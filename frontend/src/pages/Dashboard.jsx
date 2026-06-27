import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

function formatNumber(value) {
  return Number(value || 0).toLocaleString("id-ID");
}

function getCategoryClass(category) {
  return String(category || "")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function escapeCsvValue(value) {
  const stringValue = String(value ?? "");
  const escapedValue = stringValue.replace(/"/g, '""');

  return `"${escapedValue}"`;
}

async function getDashboardData() {
  const [profileResponse, statsResponse, analysesResponse] = await Promise.all([
    api.get("/api/auth/me"),
    api.get("/api/dashboard/statistics"),
    api.get("/api/dashboard/analyses"),
  ]);

  return {
    admin: profileResponse.data,
    statistics: statsResponse.data,
    analyses: analysesResponse.data || [],
  };
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const totalAnalyses = statistics?.total_analyses || 0;

  const categoryDistribution = useMemo(() => {
    return statistics?.category_distribution || [];
  }, [statistics]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("SANDISCAN_token");
    localStorage.removeItem("SANDISCAN_admin");
    navigate("/login");
  }, [navigate]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const dashboardData = await getDashboardData();

      setAdmin(dashboardData.admin);
      setStatistics(dashboardData.statistics);
      setAnalyses(dashboardData.analyses);
    } catch (error) {
      const detail = error?.response?.data?.detail;

      setErrorMessage(
        typeof detail === "string"
          ? detail
          : "Gagal memuat dashboard. Silakan login ulang.",
      );

      if (error?.response?.status === 401 || error?.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  function handleExportCSV() {
    if (!analyses || analyses.length === 0) {
      setErrorMessage("Tidak ada data riwayat analisis untuk diekspor.");
      return;
    }

    const headers = [
      "ID",
      "Waktu Analisis",
      "Panjang Karakter",
      "Skor",
      "Kategori",
      "Status Kebocoran",
      "Jumlah Bocor",
      "Status HIBP",
    ];

    const rows = analyses.map((item) => [
      item.id,
      item.created_at,
      item.password_length,
      item.score,
      item.category,
      item.is_breached ? "Bocor" : "Aman",
      item.breach_count,
      item.hibp_status,
    ]);

    const csvContent = [
      headers.map(escapeCsvValue).join(","),
      ...rows.map((row) => row.map(escapeCsvValue).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Laporan_Analisis_SANDISCAN_${Date.now()}.csv`,
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialDashboard() {
      try {
        const dashboardData = await getDashboardData();

        if (!isMounted) {
          return;
        }

        setAdmin(dashboardData.admin);
        setStatistics(dashboardData.statistics);
        setAnalyses(dashboardData.analyses);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const detail = error?.response?.data?.detail;

        setErrorMessage(
          typeof detail === "string"
            ? detail
            : "Gagal memuat dashboard. Silakan login ulang.",
        );

        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          handleLogout();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadInitialDashboard();

    return () => {
      isMounted = false;
    };
  }, [handleLogout]);

  return (
    <main className="page-shell">
      <section className="dashboard-heading">
        <div>
          <p className="section-kicker">Admin Dashboard</p>
          <h1>STATISTIC SANDISCAN</h1>
          <p>
            Memantau metrik analisis kata sandi secara anonim tanpa menyimpan
            data pribadi pengguna.
          </p>

          {admin && (
            <span className="admin-chip">
              Login sebagai <strong>{admin.name}</strong> · {admin.email}
            </span>
          )}
        </div>

        <div className="dashboard-actions">
          <button className="btn btn-primary" onClick={handleExportCSV}>
            <i
              className="bi bi-file-earmark-excel-fill"
              style={{ marginRight: "8px" }}
            ></i>{" "}
            Ekspor CSV
          </button>

          <button className="btn btn-secondary" onClick={fetchDashboardData}>
            <i
              className="bi bi-arrow-clockwise"
              style={{ marginRight: "8px" }}
            ></i>{" "}
            Muat Ulang
          </button>

          <button className="btn btn-danger" onClick={handleLogout}>
            <i
              className="bi bi-box-arrow-right"
              style={{ marginRight: "8px" }}
            ></i>{" "}
            Logout
          </button>
        </div>
      </section>

      {errorMessage && (
        <div className="form-alert dashboard-alert">{errorMessage}</div>
      )}

      {loading ? (
        <section className="glass-card result-empty">
          <div className="empty-orb">
            <i className="bi bi-hourglass-split"></i>
          </div>
          <h3>Memuat Dashboard...</h3>
        </section>
      ) : (
        <>
          <section className="dashboard-stats">
            <StatCard
              icon={<i className="bi bi-bar-chart-fill"></i>}
              title="Total Analisis"
              value={formatNumber(statistics?.total_analyses)}
            />

            <StatCard
              icon={<i className="bi bi-speedometer2"></i>}
              title="Rata-rata Skor"
              value={formatNumber(statistics?.average_score)}
            />

            <StatCard
              icon={<i className="bi bi-shield-lock-fill"></i>}
              title="Password Bocor"
              value={formatNumber(statistics?.breached_count)}
            />

            <StatCard
              icon={<i className="bi bi-exclamation-triangle-fill"></i>}
              title="Jejak Bocor"
              value={formatNumber(statistics?.total_breach_hits)}
            />
          </section>

          <section className="dashboard-grid">
            <div className="glass-card">
              <div className="card-heading">
                <h2>Kategori Keamanan</h2>
              </div>

              <div className="distribution-list">
                {categoryDistribution.length ? (
                  categoryDistribution.map((item) => {
                    const percent = totalAnalyses
                      ? Math.round((item.total / totalAnalyses) * 100)
                      : 0;

                    return (
                      <div className="distribution-item" key={item.category}>
                        <div className="distribution-top">
                          <span>{item.category}</span>
                          <strong>
                            {item.total} · {percent}%
                          </strong>
                        </div>

                        <div className="distribution-track">
                          <b style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="muted-text">Belum ada data analisis.</p>
                )}
              </div>
            </div>

            <div className="glass-card">
              <div className="card-heading">
                <h2>Protokol Privasi (Zero-Knowledge)</h2>
              </div>

              <div className="privacy-checks">
                <div>
                  <i
                    className="bi bi-check-circle-fill text-success"
                    style={{ color: "#10b981", marginRight: "8px" }}
                  ></i>{" "}
                  Panjang & Kategori dicatat
                </div>

                <div>
                  <i
                    className="bi bi-check-circle-fill text-success"
                    style={{ color: "#10b981", marginRight: "8px" }}
                  ></i>{" "}
                  Waktu (WIB) dicatat
                </div>

                <div>
                  <i
                    className="bi bi-x-circle-fill text-danger"
                    style={{ color: "#ef4444", marginRight: "8px" }}
                  ></i>{" "}
                  Teks sandi <strong>tidak disimpan</strong>
                </div>

                <div>
                  <i
                    className="bi bi-x-circle-fill text-danger"
                    style={{ color: "#ef4444", marginRight: "8px" }}
                  ></i>{" "}
                  Identitas pengguna <strong>tidak dilacak</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="glass-card">
            <div className="card-heading">
              <h2>Riwayat Pengujian Anonim</h2>
            </div>

            <div className="table-shell">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Waktu (WIB)</th>
                    <th>Karakter</th>
                    <th>Skor</th>
                    <th>Kategori</th>
                    <th>Status HIBP</th>
                    <th>Total Jejak</th>
                  </tr>
                </thead>

                <tbody>
                  {analyses.length ? (
                    analyses.map((item) => (
                      <tr key={item.id}>
                        <td>#{item.id}</td>
                        <td>{item.created_at}</td>
                        <td>{item.password_length} char</td>
                        <td>
                          <strong>{item.score}/100</strong>
                        </td>
                        <td>
                          <StatusBadge
                            variant={getCategoryClass(item.category)}
                          >
                            {item.category}
                          </StatusBadge>
                        </td>
                        <td>
                          {item.is_breached ? (
                            <StatusBadge variant="danger">Bocor</StatusBadge>
                          ) : (
                            <StatusBadge variant="success">Aman</StatusBadge>
                          )}
                        </td>
                        <td>{formatNumber(item.breach_count)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        style={{ textAlign: "center", padding: "2rem" }}
                      >
                        Belum ada riwayat pengujian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
