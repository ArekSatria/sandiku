import { useState } from "react";
import ResultCard from "../components/ResultCard";
import api from "../services/api";

function getErrorMessage(error) {
  const detail = error?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  return "Analisis gagal. Pastikan koneksi internet Anda stabil.";
}

export default function Analyzer() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAnalyze(event) {
    event.preventDefault();
    setErrorMessage("");
    setResult(null);

    if (!password.trim()) {
      setErrorMessage("Kata sandi tidak boleh kosong.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/analyze", { password });
      setResult(response.data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="page-heading">
        <p className="section-kicker">Credential Scanner</p>
        <h1>Cek Kekuatan Kata Sandi Anda</h1>
        <p>
          Ketahui seberapa aman kata sandi Anda dari ancaman peretasan. Sistem
          akan mendeteksi kelemahan dan memeriksa apakah kata sandi tersebut
          pernah bocor di internet.
        </p>
        <br />
      </section>

      <section className="analyzer-layout">
        <aside className="glass-card analyzer-form-card">
          <div className="form-header">
            <div>
              <h2>Panel Pengujian</h2>
              <p>Ketik kata sandi Anda di bawah ini.</p>
            </div>
          </div>

          <form onSubmit={handleAnalyze} className="modern-form">
            <label htmlFor="password">Kata Sandi</label>

            <div className="password-field">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Analisis Password"
                maxLength={128}
              />

              <button
                type="button"
                className="icon-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={
                  showPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
                }
              >
                <i
                  className={
                    showPassword ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"
                  }
                ></i>
              </button>
            </div>

            <div className="input-meta">
              <span>{password.length}/128 karakter</span>
              <span>Aman & Anonim</span>
            </div>

            <div className="privacy-note">
              <strong>Jaminan Keamanan:</strong> Infrastruktur SANDISCAN
              beroperasi dengan prinsip Zero-Knowledge. Kami murni hanya
              menyimpan metadata keluaran analitik anonim tanpa menahan karakter
              asli kata sandi Anda.
            </div>

            {errorMessage && <div className="form-alert">{errorMessage}</div>}

            <button
              className="btn btn-primary full-width"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sedang Memeriksa..." : "Cek Sekarang"}
            </button>
          </form>
        </aside>

        <ResultCard result={result} />
      </section>
    </main>
  );
}
