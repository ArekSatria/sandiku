import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

 useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Ambil data statistik ringkasan
        const statsRes = await api.get('/api/dashboard/statistics');
        setStats(statsRes.data);

        // 2. Ambil data riwayat log analisis terbaru
        const historyRes = await api.get('/api/dashboard/analyses');
        setHistory(historyRes.data);
      } catch (err) {
        console.error("DETAIL ERROR DASHBOARD:", err.response || err); 
        // KITA MATIKAN AUTO LOGOUT SEMENTARA AGAR TIDAK TERTENDANG
        setError('Gagal memuat data dashboard. Silakan cek console browser atau pastikan token valid.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading)
    return (
      <div className="container mt-5 text-center">
        <h5>Memuat Data Dashboard...</h5>
      </div>
    );
  if (error)
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">{error}</div>
      </div>
    );

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4">Dashboard Analisis Edukasi Siber</h2>

      {/* Kartu Ringkasan Statistik */}
      <div className="row mb-5">
        <div className="col-md-4 mb-3">
          <div className="card bg-primary text-white border-0 shadow-sm">
            <div className="card-body p-4">
              <span className="small text-uppercase fw-bold opacity-75">
                Total Pengujian
              </span>
              <h2 className="display-5 fw-bold m-0 mt-2">
                {stats?.total_analyses}
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card bg-dark text-white border-0 shadow-sm">
            <div className="card-body p-4">
              <span className="small text-uppercase fw-bold opacity-75">
                Rata-Mulai Skor
              </span>
              <h2 className="display-5 fw-bold m-0 mt-2">
                {stats?.average_score}/100
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card bg-danger text-white border-0 shadow-sm">
            <div className="card-body p-4">
              <span className="small text-uppercase fw-bold opacity-75">
                Password Bocor Terdeteksi
              </span>
              <h2 className="display-5 fw-bold m-0 mt-2">
                {stats?.breached_count}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Distribusi Kategori Hasil Analisis */}
        <div className="col-md-4 mb-4">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Distribusi Kategori</h5>
            <ul className="list-group list-group-flush">
              {stats?.category_distribution.map((item, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0"
                >
                  <span className="fw-semibold text-muted">
                    {item.category}
                  </span>
                  <span className="badge bg-secondary rounded-pill">
                    {item.total}
                  </span>
                </li>
              ))}
              {stats?.category_distribution.length === 0 && (
                <p className="text-muted small m-0">
                  Belum ada data distribusi.
                </p>
              )}
            </ul>
          </div>
        </div>

        {/* Tabel Riwayat Pengujian Pengguna (Anonim) */}
        <div className="col-md-8 mb-4">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Riwayat Log Analisis Anonim</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr className="small text-muted">
                    <th>ID</th>
                    <th>Panjang</th>
                    <th>Skor</th>
                    <th>Kategori</th>
                    <th>Status Kebocoran</th>
                    <th>Waktu</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {history.map((log) => (
                    <tr key={log.id}>
                      <td className="fw-bold text-secondary">#{log.id}</td>
                      <td>{log.password_length} Karakter</td>
                      <td>
                        <span className="fw-bold">{log.score}</span>/100
                      </td>
                      <td>
                        <span
                          className={`badge ${log.score > 60 ? "bg-success" : "bg-danger"}`}
                        >
                          {log.category}
                        </span>
                      </td>
                      <td>
                        {log.is_breached ? (
                          <span className="text-danger fw-bold">
                            🚨 Terkompromi
                          </span>
                        ) : (
                          <span className="text-success">✔ Aman</span>
                        )}
                      </td>
                      <td className="text-muted">
                        {new Date(log.created_at).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-3">
                        Belum ada riwayat aktivitas analisis.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;