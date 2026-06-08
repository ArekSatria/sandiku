import { useState } from "react";
import api from "../services/api";

const Analyzer = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    try {
      const res = await api.post("/api/analyze", { password });
      setResult(res.data);
    } catch (error) {
      console.error("Gagal terhubung ke server:", error);
    } finally {
      setLoading(false);
    }
  };

  const getColorTheme = (score) => {
    if (score <= 25) return { hex: "#ef4444", name: "danger" };
    if (score <= 50) return { hex: "#f59e0b", name: "warning" };
    if (score <= 75) return { hex: "#3b82f6", name: "primary" };
    return { hex: "#10b981", name: "success" };
  };

  return (
    <div className="container mt-5 fade-in-up">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark mb-2">Audit Kredensial</h2>
            <p className="text-muted">
              Masukkan kata sandi untuk menganalisis kerentanan secara instan.
            </p>
          </div>

          <form onSubmit={handleAnalyze} className="mb-5">
            <div className="input-group seamless-input mb-3 p-1">
              <span className="input-group-text border-0 px-3">
                <i className="bi bi-lock text-muted"></i>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control form-control-lg border-0 shadow-none fs-6"
                placeholder="Ketik kata sandi di sini..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="input-group-text border-0 px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={
                    showPassword
                      ? "bi bi-eye-slash text-muted"
                      : "bi bi-eye text-muted"
                  }
                ></i>
              </button>
            </div>
            <button
              type="submit"
              className="btn btn-ultra w-100 py-3"
              disabled={loading || !password}
            >
              {loading ? "Menjalankan Audit..." : "Proses Analisis"}
            </button>
          </form>

          {result &&
            (() => {
              const theme = getColorTheme(result.score);
              return (
                <div className="ultra-card p-5 mb-5 fade-in-up">
                  {/* Header Hasil */}
                  <div className="d-flex justify-content-between align-items-center mb-4 pb-4 border-bottom">
                    <div>
                      <h5 className="fw-bold mb-1 text-dark">
                        Ringkasan Analisis
                      </h5>
                      <span
                        className={`ultra-badge bg-${theme.name} bg-opacity-10 text-${theme.name}`}
                      >
                        {result.category}
                      </span>
                    </div>
                    <div className="text-end">
                      <h1
                        className="fw-bolder mb-0"
                        style={{
                          color: theme.hex,
                          fontSize: "3rem",
                          letterSpacing: "-2px",
                        }}
                      >
                        {result.score}
                        <span className="fs-5 text-muted fw-normal">/100</span>
                      </h1>
                    </div>
                  </div>

                  {/* Indikator Bar Clean */}
                  <div className="mb-5">
                    <div
                      className="progress bg-light"
                      style={{ height: "8px", overflow: "visible" }}
                    >
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${result.score}%`,
                          backgroundColor: theme.hex,
                          borderRadius: "8px",
                          transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      ></div>
                    </div>
                    <div
                      className="d-flex justify-content-between mt-2 text-muted"
                      style={{ fontSize: "0.8rem" }}
                    >
                      <span>Panjang: {result.password_length} Karakter</span>
                      <span>Tingkat Ketertebakan</span>
                    </div>
                  </div>

                  {/* Peringatan Kebocoran Minimalis */}
                  {result.is_breached && (
                    <div
                      className="p-4 mb-4 rounded-4"
                      style={{
                        backgroundColor: "#fef2f2",
                        border: "1px solid #fecaca",
                      }}
                    >
                      <div className="d-flex">
                        <i className="bi bi-shield-x text-danger fs-4 me-3"></i>
                        <div>
                          <h6 className="fw-bold text-danger mb-1">
                            Kredensial Terkompromi
                          </h6>
                          <p className="mb-0 text-danger opacity-75 small">
                            Ditemukan dalam basis data kebocoran publik sebanyak{" "}
                            <strong>
                              {result.breach_count.toLocaleString("id-ID")}
                            </strong>{" "}
                            kali.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Detail Kelemahan & Rekomendasi (Clean Text Only) */}
                  <div className="row mt-4">
                    <div className="col-12 mb-4">
                      <h6 className="fw-bold text-dark fs-6 mb-3">
                        Identifikasi Kerentanan
                      </h6>
                      {result.detected_patterns &&
                      result.detected_patterns.length > 0 ? (
                        <ul className="list-unstyled mb-0">
                          {result.detected_patterns.map((pattern, index) => (
                            <li
                              key={index}
                              className="mb-2 text-secondary small d-flex align-items-start"
                            >
                              <i className="bi bi-dash text-danger me-2"></i>{" "}
                              {pattern}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-success small d-flex align-items-center">
                          <i className="bi bi-check2 me-2"></i>Tidak ada
                          kerentanan struktural dominan.
                        </span>
                      )}
                    </div>

                    <div className="col-12">
                      <h6 className="fw-bold text-dark fs-6 mb-3">
                        Saran Mitigasi
                      </h6>
                      <ul className="list-unstyled mb-0">
                        {result.recommendations.map((rec, index) => (
                          <li
                            key={index}
                            className="mb-2 text-secondary small d-flex align-items-start"
                          >
                            <i className="bi bi-arrow-return-right text-primary me-2 mt-1"></i>{" "}
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()}
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
