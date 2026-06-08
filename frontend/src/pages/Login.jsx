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
    <main className="page auth-page">
      <section className="card auth-card">
        <p className="eyebrow">Admin SANDIKU</p>
        <h1>Login Admin</h1>
        <p className="muted">
          Masuk untuk melihat statistik analisis kata sandi secara anonim.
        </p>

        <form onSubmit={handleLogin} className="form">
          <label htmlFor="email">Email Admin</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@sandiku.local"
          />

          <label htmlFor="password">Password Admin</label>
          <div className="password-input-group">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Masukkan password admin"
            />

            <button
              type="button"
              className="secondary-button"
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? "Sembunyikan" : "Tampilkan"}
            </button>
          </div>

          {errorMessage && <div className="alert danger">{errorMessage}</div>}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </section>
    </main>
  );
}
