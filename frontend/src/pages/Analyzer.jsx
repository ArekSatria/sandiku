import { useState } from "react";
import ResultCard from "../components/ResultCard";
import api from "../services/api";

function getErrorMessage(error) {
  const detail = error?.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).join(", ");
  }

  if (typeof detail === "string") {
    return detail;
  }

  return "Analisis gagal dilakukan. Pastikan backend aktif dan koneksi stabil.";
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

    if (password.length > 128) {
      setErrorMessage("Kata sandi maksimal 128 karakter.");
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
        <p className="section-kicker">Password Analyzer</p>
        <h1>Uji kekuatan kata sandi secara instan.</h1>
        <p>
          Sistem akan menilai kata sandi berdasarkan pola, panjang, variasi
          karakter, blocklist lokal, dan indikasi kebocoran publik.
        </p>
      </section>

      <section className="analyzer-layout">
        <aside className="glass-card analyzer-form-card">
          <div className="form-header">
            <span className="form-icon">⌁</span>
            <div>
              <h2>Form Analisis</h2>
              <p>Masukkan kata sandi yang ingin diuji.</p>
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
                placeholder="Contoh: LangitBiru#KopiPagi27!"
                maxLength={128}
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? "Sembunyikan" : "Tampilkan"}
              </button>
            </div>

            <div className="input-meta">
              <span>{password.length}/128 karakter</span>
              <span>Kata sandi asli tidak disimpan</span>
            </div>

            {errorMessage && <div className="form-alert">{errorMessage}</div>}

            <button
              className="btn btn-primary full-width"
              type="submit"
              disabled={loading}
            >
              {loading ? "Menganalisis..." : "Analisis Sekarang"}
            </button>
          </form>

          <div className="analysis-hints">
            <h3>Tips kata sandi kuat</h3>
            <ul>
              <li>Gunakan minimal 12 karakter.</li>
              <li>Hindari nama, tanggal lahir, dan pola keyboard.</li>
              <li>Gunakan kata sandi unik untuk setiap layanan.</li>
              <li>Jangan gunakan kata sandi yang pernah bocor.</li>
            </ul>
          </div>
        </aside>

        <ResultCard result={result} />
      </section>
    </main>
  );
}
