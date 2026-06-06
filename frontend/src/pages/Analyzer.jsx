import { useState } from "react";
import api from "../services/api";
import StrengthMeter from "../components/StrengthMeter";

const Analyzer = () => {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!password) {
      setError("Kata sandi tidak boleh kosong!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/api/analyze", { password });
      setResult(response.data);
    } catch (err) {
      setError(
        "Terjadi kesalahan saat menghubungi server. Pastikan backend menyala.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <h2 className="fw-bold text-center mb-4">
                Analisis Kekuatan Kata Sandi
              </h2>

              <form onSubmit={handleAnalyze}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Ketik kata sandi Anda di sini..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 btn-lg fw-bold"
                  disabled={loading}
                >
                  {loading ? "Menganalisis..." : "Analisis Sekarang"}
                </button>
              </form>

              {error && <div className="alert alert-danger mt-3">{error}</div>}

              {/* Menampilkan Hasil Analisis */}
              {result && (
                <div className="mt-5 animate__animated animate__fadeIn">
                  <h4 className="fw-bold border-bottom pb-2">Hasil Analisis</h4>

                  <StrengthMeter score={result.score} />

                  <div className="row mt-4">
                    <div className="col-md-6 mb-3">
                      <div className="p-3 bg-light rounded text-center">
                        <span className="d-block text-muted small">
                          Kategori
                        </span>
                        <h4
                          className={`fw-bold mb-0 ${result.score > 60 ? "text-success" : "text-danger"}`}
                        >
                          {result.category}
                        </h4>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="p-3 bg-light rounded text-center">
                        <span className="d-block text-muted small">
                          Panjang Karakter
                        </span>
                        <h4 className="fw-bold mb-0 text-dark">
                          {result.password_length}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {result.is_breached && (
                    <div className="alert alert-danger fw-bold shadow-sm border-danger border-2 mt-2">
                      ⚠️ PERINGATAN! Kata sandi ini telah ditemukan dalam data
                      kebocoran internet sebanyak{" "}
                      {result.breach_count.toLocaleString("id-ID")} kali. JANGAN
                      DIGUNAKAN!
                    </div>
                  )}

                  <div className="mt-4">
                    <h6 className="fw-bold text-muted">
                      Kelemahan yang Ditemukan:
                    </h6>
                    <ul className="list-group list-group-flush mb-3">
                      {result.detected_patterns &&
                      result.detected_patterns.length > 0 ? (
                        result.detected_patterns.map((pattern, index) => (
                          <li
                            key={index}
                            className="list-group-item bg-transparent px-0 text-danger"
                          >
                            ⚠️ {pattern}
                          </li>
                        ))
                      ) : (
                        <li className="list-group-item bg-transparent px-0 text-success">
                          ✔ Tidak ada pola lemah yang dominan.
                        </li>
                      )}
                    </ul>

                    <h6 className="fw-bold text-muted">
                      Rekomendasi Perbaikan:
                    </h6>
                    <ul className="list-group list-group-flush">
                      {result.recommendations &&
                      result.recommendations.length > 0 ? (
                        result.recommendations.map((rec, index) => (
                          <li
                            key={index}
                            className="list-group-item bg-transparent px-0 text-success"
                          >
                            💡 {rec}
                          </li>
                        ))
                      ) : (
                        <li className="list-group-item bg-transparent px-0 text-success">
                          ✔ Kata sandi sudah memenuhi kriteria standar.
                        </li>
                      )}
                    </ul>
                  </div>

                  <p className="text-center text-muted small mt-5 mb-0">
                    *Kata sandi Anda diproses secara anonim dan tidak disimpan
                    dalam database.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
