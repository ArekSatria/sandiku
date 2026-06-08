import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function StatCard({ title, value, description }) {
  return (
    <div className="stat-card">
      <span>{title}</span>
      <strong>{value}</strong>
      {description && <p>{description}</p>}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalAnalyses = statistics?.total_analyses || 0;
  const averageScore = statistics?.average_score || 0;
  const breachedCount = statistics?.breached_count || 0;
  const hibpFailedCount = statistics?.hibp_failed_count || 0;
  const totalBreachHits = statistics?.total_breach_hits || 0;

  return (
    <main className="page">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">Dashboard Admin</p>
          <h1>Statistik Analisis SANDIKU</h1>
          <p className="muted">
            Data yang ditampilkan bersifat anonim dan tidak memuat kata sandi
            asli pengguna.
          </p>
          {admin && (
            <p className="muted">
              Login sebagai: <strong>{admin.name}</strong> ({admin.email})
            </p>
          )}
        </div>

        <div className="dashboard-actions">
          <button className="secondary-button" onClick={fetchDashboardData}>
            Muat Ulang
          </button>
          <button className="danger-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </section>

      {errorMessage && <div className="alert danger">{errorMessage}</div>}

      {loading ? (
        <div className="card">
          <p>Memuat data dashboard...</p>
        </div>
      ) : (
        <>
          <section className="stats-grid">
            <StatCard
              title="Total Analisis"
              value={totalAnalyses.toLocaleString("id-ID")}
              description="Jumlah seluruh pengujian kata sandi"
            />

            <StatCard
              title="Rata-rata Skor"
              value={Number(averageScore).toLocaleString("id-ID")}
              description="Skor rata-rata dari seluruh analisis"
            />

            <StatCard
              title="Password Bocor"
              value={breachedCount.toLocaleString("id-ID")}
              description="Jumlah kata sandi yang terindikasi bocor"
            />

            <StatCard
              title="Total Jejak Kebocoran"
              value={totalBreachHits.toLocaleString("id-ID")}
              description="Akumulasi breach_count dari HIBP"
            />

            <StatCard
              title="HIBP Gagal"
              value={hibpFailedCount.toLocaleString("id-ID")}
              description="Jumlah pemeriksaan HIBP yang gagal"
            />
          </section>

          <section className="layout-two">
            <div className="card">
              <h3>Distribusi Kategori</h3>

              {statistics?.category_distribution?.length ? (
                <div className="category-list">
                  {statistics.category_distribution.map((item) => (
                    <div className="category-row" key={item.category}>
                      <span>{item.category}</span>
                      <strong>{item.total}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="muted">Belum ada data kategori.</p>
              )}
            </div>

            <div className="card">
              <h3>Catatan Privasi</h3>
              <p>
                Dashboard hanya menampilkan metadata anonim, seperti panjang
                kata sandi, skor, kategori, status kebocoran, dan waktu
                analisis. Sistem tidak menyimpan kata sandi asli maupun hash
                kata sandi publik.
              </p>
            </div>
          </section>

          <section className="card">
            <h3>Riwayat Analisis Anonim</h3>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Waktu</th>
                    <th>Panjang</th>
                    <th>Skor</th>
                    <th>Kategori</th>
                    <th>Status Bocor</th>
                    <th>Jumlah Bocor</th>
                    <th>Status HIBP</th>
                  </tr>
                </thead>
                <tbody>
                  {analyses.length ? (
                    analyses.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.created_at}</td>
                        <td>{item.password_length}</td>
                        <td>{item.score}</td>
                        <td>{item.category}</td>
                        <td>{item.is_breached ? "Bocor" : "Tidak Bocor"}</td>
                        <td>
                          {Number(item.breach_count || 0).toLocaleString(
                            "id-ID",
                          )}
                        </td>
                        <td>
                          {item.hibp_status === "checked"
                            ? "Berhasil"
                            : "Gagal"}
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
