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

    const cleanEmail = email.trim();
    const cleanPassword = password;

    if (!cleanEmail || !cleanPassword) {
      setErrorMessage("Alamat email dan kata sandi wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      // FIX: Menggunakan URLSearchParams agar dikirim sebagai x-www-form-urlencoded
      // FastAPI OAuth2PasswordRequestForm membaca field 'username' dan 'password'
      const params = new URLSearchParams();
      params.append("username", cleanEmail);
      params.append("password", cleanPassword);

      const response = await api.post("/api/auth/login", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      localStorage.setItem("sandiku_token", response.data.access_token);

      // Ambil data profil admin menggunakan token yang baru didapat
      const profileResponse = await api.get("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${response.data.access_token}`,
        },
      });

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
          : "Gagal masuk. Periksa kembali email dan kata sandi.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel-horizontal glass-card">
        {/* BAGIAN KIRI: BRANDING */}
        <div className="auth-brand-side">
          <span className="brand-mark-giant">
            <i className="bi bi-shield-lock-fill"></i>
          </span>
          <div>
            <h1 style={{ fontSize: "1.6rem", marginBottom: "0.2rem" }}>
              Portal Admin
            </h1>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                margin: 0,
              }}
            >
              Sistem Manajemen Keamanan
            </p>
          </div>

          <div
            className="privacy-note"
            style={{ marginTop: "auto", padding: "1rem", fontSize: "0.8rem" }}
          >
            <strong style={{ display: "block", marginBottom: "0.25rem" }}>
              Otorisasi Tertutup
            </strong>
            Akses dilindungi JSON Web Token. Hanya untuk administrator sistem.
          </div>
        </div>

        {/* BAGIAN KANAN: FORM LOGIN */}
        <div className="auth-form-side">
          <form onSubmit={handleLogin} className="modern-form">
            <div>
              <label
                htmlFor="email"
                style={{ display: "block", marginBottom: "0.5rem" }}
              >
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@sandiku.local"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                style={{ display: "block", marginBottom: "0.5rem" }}
              >
                Kata Sandi
              </label>
              <div className="password-field">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Masukkan sandi akses"
                />
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Sembunyikan" : "Tampilkan"}
                >
                  <i
                    className={
                      showPassword ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"
                    }
                  ></i>
                </button>
              </div>
            </div>

            {errorMessage && (
              <div
                className="form-alert"
                style={{ padding: "0.75rem", fontSize: "0.85rem" }}
              >
                {errorMessage}
              </div>
            )}

            <button
              className="btn btn-primary full-width"
              type="submit"
              disabled={loading}
              style={{ marginTop: "0.25rem" }}
            >
              {loading ? "Memverifikasi..." : "Masuk"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
