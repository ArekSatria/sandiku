import { useEffect, useMemo, useState } from "react";
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

  function handleLogout() {
    localStorage.removeItem("sandiku_token");
    localStorage.removeItem("sandiku_admin");
    navigate("/login");
  }

  async function fetchDashboardData() {
    setLoading(true);
    setErrorMessage("");

    try {
      const [profileResponse, statsResponse, analysesResponse] =
        await Promise.all([
          api.get("/api/auth/me"),
          api.get("/api/dashboard/statistics"),
          api.get("/api/dashboard/analyses"),
        ]);

      setAdmin(profileResponse.data);
      setStatistics(statsResponse.data);
      setAnalyses(analysesResponse.data || []);
    } catch (error) {
      const detail = error?.response?.data?.detail;

      setErrorMessage(
        typeof detail === "string"
          ? detail
          : "Gagal memuat dashboard. Silakan login ulang.",
      );

      if (error?.response?.status === 401 || error?.response?.status === 403) {
        localStorage.removeItem("sandiku_token");
        localStorage.removeItem("sandiku_admin");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  // --- FITUR BARU: EKSPOR CSV ---
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
      `"${item.created_at}"`,
      item.password_length,
      item.score,
      item.category,
      item.is_breached ? "Bocor" : "Aman",
      item.breach_count,
      item.hibp_status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Laporan_Analisis_SANDIKU_${new Date().getTime()}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <main className="page-shell">
      <section className="dashboard-heading">
        <div>
          <p className="section-kicker">Admin Dashboard</p>
          <h1>Statistik Analisis SANDIKU</h1>
          <p>
            Dashboard menampilkan metadata anonim hasil analisis kata sandi
            tanpa menyimpan kata sandi asli pengguna.
          </p>

          {admin && (
            <span className="admin-chip">
              Login sebagai <strong>{admin.name}</strong> · {admin.email}
            </span>
          )}
        </div>

        <div className="dashboard-actions">
          <button className="btn btn-primary" onClick={handleExportCSV}>
            Ekspor CSV
          </button>
          <button className="btn btn-secondary" onClick={fetchDashboardData}>
            Muat Ulang
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </section>

      {errorMessage && (
        <div className="form-alert dashboard-alert">{errorMessage}</div>
      )}

      {loading ? (
        <section className="glass-card loading-card">
          <div className="loader" />
          <p>Memuat data dashboard...</p>
        </section>
      ) : (
        <>
          <section className="dashboard-stats">
            <StatCard
              icon="Σ"
              title="Total Analisis"
              value={formatNumber(statistics?.total_analyses)}
              description="Seluruh pengujian kata sandi"
            />

            <StatCard
              icon="Ø"
              title="Rata-rata Skor"
              value={formatNumber(statistics?.average_score)}
              description="Rata-rata skor keamanan"
            />

            <StatCard
              icon="!"
              title="Password Bocor"
              value={formatNumber(statistics?.breached_count)}
              description="Terdeteksi dalam HIBP"
            />

            <StatCard
              icon="↯"
              title="Total Jejak Bocor"
              value={formatNumber(statistics?.total_breach_hits)}
              description="Akumulasi breach_count"
            />

            <StatCard
              icon="?"
              title="HIBP Gagal"
              value={formatNumber(statistics?.hibp_failed_count)}
              description="Pemeriksaan eksternal gagal"
            />
          </section>

          <section className="dashboard-grid">
            <div className="glass-card">
              <div className="card-heading">
                <div>
                  <p className="section-kicker">Distribusi</p>
                  <h2>Kategori Kata Sandi</h2>
                </div>
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
                  <p className="muted-text">Belum ada data kategori.</p>
                )}
              </div>
            </div>

            <div className="glass-card">
              <div className="card-heading">
                <div>
                  <p className="section-kicker">Privasi</p>
                  <h2>Data yang Disimpan</h2>
                </div>
              </div>

              <div className="privacy-checks">
                <div>✓ Panjang kata sandi</div>
                <div>✓ Skor dan kategori</div>
                <div>✓ Status kebocoran</div>
                <div>✓ Waktu analisis WIB</div>
                <div>× Kata sandi asli tidak disimpan</div>
                <div>× Hash kata sandi publik tidak disimpan</div>
              </div>
            </div>
          </section>

          <section className="glass-card">
            <div className="card-heading">
              <div>
                <p className="section-kicker">Riwayat</p>
                <h2>Analisis Anonim Terbaru</h2>
              </div>
              <span className="muted-text">Maksimal 50 data terbaru</span>
            </div>

            <div className="table-shell">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Waktu</th>
                    <th>Panjang</th>
                    <th>Skor</th>
                    <th>Kategori</th>
                    <th>Status Bocor</th>
                    <th>Jumlah Bocor</th>
                    <th>HIBP</th>
                  </tr>
                </thead>
                <tbody>
                  {analyses.length ? (
                    analyses.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.created_at}</td>
                        <td>{item.password_length}</td>
                        <td>
                          <strong>{item.score}</strong>
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
                            <StatusBadge variant="success">
                              Tidak Bocor
                            </StatusBadge>
                          )}
                        </td>
                        <td>{formatNumber(item.breach_count)}</td>
                        <td>
                          {item.hibp_status === "checked" ? (
                            <StatusBadge variant="success">
                              Berhasil
                            </StatusBadge>
                          ) : (
                            <StatusBadge variant="warning">Gagal</StatusBadge>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">Belum ada riwayat analisis.</td>
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
