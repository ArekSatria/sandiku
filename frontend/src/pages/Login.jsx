import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@sandiku.local");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("sandiku_token", response.data.access_token);

      const profileResponse = await api.get("/api/auth/me");
      localStorage.setItem(
        "sandiku_admin",
        JSON.stringify(profileResponse.data),
      );

      navigate("/dashboard");
    } catch (error) {
      const detail = error?.response?.data?.detail;
      setErrorMessage(
        typeof detail === "string"
          ? detail
          : "Login gagal. Periksa email dan password admin.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel glass-card">
        <div className="auth-brand">
          <span className="brand-mark large">S</span>
          <div>
            <p className="section-kicker">Admin Access</p>
            <h1>Masuk Dashboard</h1>
          </div>
        </div>

        <p className="auth-desc">
          Gunakan akun admin untuk mengakses statistik analisis kata sandi
          secara anonim.
        </p>

        <form onSubmit={handleLogin} className="modern-form">
          <label htmlFor="email">Email Admin</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@sandiku.local"
          />

          <label htmlFor="password">Password Admin</label>
          <div className="password-field">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Masukkan password admin"
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? "Sembunyikan" : "Tampilkan"}
            </button>
          </div>

          {errorMessage && <div className="form-alert">{errorMessage}</div>}

          <button
            className="btn btn-primary full-width"
            type="submit"
            disabled={loading}
          >
            {loading ? "Memeriksa..." : "Masuk"}
          </button>
        </form>

        <div className="privacy-banner">
          Akses dashboard dilindungi token JWT dan hanya tersedia untuk admin
          aktif.
        </div>
      </section>
    </main>
  );
}
