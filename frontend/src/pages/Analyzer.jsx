import { useState } from "react";
import api from "../services/api";
import ResultCard from "../components/ResultCard";

export default function Analyzer() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      const detail = error?.response?.data?.detail;

      if (Array.isArray(detail)) {
        setErrorMessage(detail.map((item) => item.msg).join(", "));
      } else if (typeof detail === "string") {
        setErrorMessage(detail);
      } else {
        setErrorMessage(
          "Analisis gagal dilakukan. Periksa koneksi backend atau coba beberapa saat lagi.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="hero compact">
        <div>
          <p className="eyebrow">SANDIKU</p>
          <h1>Analisis Kekuatan Kata Sandi</h1>
          <p>
            Masukkan kata sandi untuk memperoleh skor keamanan, kategori,
            kelemahan, rekomendasi, serta pemeriksaan kebocoran publik melalui
            HIBP.
          </p>
        </div>
      </section>

      <section className="layout-two">
        <div className="card">
          <h3>Form Analisis</h3>

          <form onSubmit={handleAnalyze} className="form">
            <label htmlFor="password">Kata Sandi</label>

            <div className="password-input-group">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Masukkan kata sandi yang ingin diuji"
                maxLength={128}
              />

              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? "Sembunyikan" : "Tampilkan"}
              </button>
            </div>

            <p className="muted">
              Panjang saat ini: {password.length}/128 karakter. Kata sandi asli
              tidak disimpan ke database.
            </p>

            {errorMessage && <div className="alert danger">{errorMessage}</div>}

            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? "Menganalisis..." : "Analisis Kata Sandi"}
            </button>
          </form>
        </div>

        <ResultCard result={result} />
      </section>
    </main>
  );
}
