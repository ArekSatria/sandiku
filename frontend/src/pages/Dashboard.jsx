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
        const statsRes = await api.get("/api/dashboard/statistics");
        setStats(statsRes.data);
        const historyRes = await api.get("/api/dashboard/analyses");
        setHistory(historyRes.data);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data. Sesi Anda mungkin telah berakhir.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="container mt-5 pt-5 text-center text-muted fade-in-up">
        Memuat Dasbor Metrik...
      </div>
    );
  if (error)
    return (
      <div className="container mt-5">
        <div className="alert alert-danger border-0 shadow-sm">{error}</div>
      </div>
    );

  return (
    <div className="container mt-5 mb-5 fade-in-up">
      <div className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h2
            className="fw-bolder text-dark mb-1"
            style={{ letterSpacing: "-0.5px" }}
          >
            Tinjauan Sistem
          </h2>
          <p className="text-muted mb-0">
            Statistik anonim pengujian kredensial masyarakat.
          </p>
        </div>
      </div>

      {/* KPI Cards Clean Design */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="ultra-card p-4 d-flex align-items-center">
            <div
              className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center me-4"
              style={{ width: "60px", height: "60px" }}
            >
              <i className="bi bi-activity fs-3"></i>
            </div>
            <div>
              <p className="text-muted small fw-bold mb-0 text-uppercase tracking-wide">
                Total Audit
              </p>
              <h2 className="fw-bolder text-dark mb-0">
                {stats?.total_analyses.toLocaleString("id-ID")}
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="ultra-card p-4 d-flex align-items-center">
            <div
              className="bg-success bg-opacity-10 text-success rounded-circle d-flex justify-content-center align-items-center me-4"
              style={{ width: "60px", height: "60px" }}
            >
              <i className="bi bi-bullseye fs-3"></i>
            </div>
            <div>
              <p className="text-muted small fw-bold mb-0 text-uppercase tracking-wide">
                Rata-rata Skor
              </p>
              <h2 className="fw-bolder text-dark mb-0">
                {stats?.average_score}
                <span className="fs-5 text-muted fw-normal">/100</span>
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="ultra-card p-4 d-flex align-items-center">
            <div
              className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex justify-content-center align-items-center me-4"
              style={{ width: "60px", height: "60px" }}
            >
              <i className="bi bi-shield-x fs-3"></i>
            </div>
            <div>
              <p className="text-muted small fw-bold mb-0 text-uppercase tracking-wide">
                Insiden Bocor
              </p>
              <h2 className="fw-bolder text-dark mb-0">
                {stats?.breached_count.toLocaleString("id-ID")}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Log Clean */}
      <div className="ultra-card p-0 overflow-hidden">
        <div className="p-4 border-bottom bg-white">
          <h6 className="fw-bold text-dark mb-0">
            Log Analisis Kredensial Terbaru (Anonim)
          </h6>
        </div>
        <div className="table-responsive">
          <table className="table table-hover table-borderless align-middle mb-0 text-secondary">
            <thead className="bg-light" style={{ fontSize: "0.85rem" }}>
              <tr>
                <th className="ps-4 py-3 fw-semibold" style={{ width: "10%" }}>
                  ID
                </th>
                <th className="py-3 fw-semibold" style={{ width: "15%" }}>
                  Panjang
                </th>
                <th className="py-3 fw-semibold" style={{ width: "15%" }}>
                  Skor
                </th>
                {/* Memberikan ruang yang cukup untuk klasifikasi agar tidak mendesak kolom lain */}
                <th className="py-3 fw-semibold" style={{ width: "30%" }}>
                  Klasifikasi
                </th>
                <th className="py-3 fw-semibold" style={{ width: "15%" }}>
                  Integritas
                </th>
                <th
                  className="pe-4 py-3 fw-semibold text-end"
                  style={{ width: "15%" }}
                >
                  Waktu (WIB)
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "0.9rem" }}>
              {history.map((log) => (
                <tr key={log.id} className="border-bottom border-light">
                  <td className="ps-4 py-3 fw-semibold text-dark">#{log.id}</td>
                  <td className="py-3">
                    {log.password_length}{" "}
                    <span className="text-muted">char</span>
                  </td>
                  <td className="py-3 fw-bold text-dark">{log.score}</td>
                  <td className="py-3">
                    <span
                      className={`ultra-badge bg-${log.score > 60 ? "success" : log.score > 25 ? "warning" : "danger"} bg-opacity-10 text-${log.score > 60 ? "success" : log.score > 25 ? "warning" : "danger"}`}
                    >
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3">
                    {log.is_breached ? (
                      <span className="text-danger d-flex align-items-center">
                        <i className="bi bi-x-circle-fill me-2"></i> Bocor
                      </span>
                    ) : (
                      <span className="text-success d-flex align-items-center">
                        <i className="bi bi-check-circle-fill me-2"></i> Aman
                      </span>
                    )}
                  </td>
                  <td className="pe-4 py-3 text-end text-muted">
                    {new Date(log.created_at).toLocaleString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    Tidak ada aktivitas tercatat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
