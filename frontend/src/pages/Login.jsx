import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Menembak endpoint autentikasi login admin di backend
      const response = await api.post("/api/auth/login", { email, password });

      // Simpan token JWT yang diberikan backend ke localStorage browser
      localStorage.setItem("token", response.data.access_token);

      // Alihkan halaman ke Dashboard Statistik Admin
      navigate("/dashboard");
      window.location.reload(); // Refresh untuk memperbarui status menu Navbar
    } catch (err) {
      if (err.response && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Gagal terhubung ke server. Pastikan backend menyala.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm border-0 mt-5">
            <div className="card-body p-4">
              <h3 className="fw-bold text-center mb-4">Login Admin Sandiku</h3>

              {error && (
                <div className="alert alert-danger text-center small py-2">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="admin@sandiku.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">
                    Kata Sandi
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-dark w-100 fw-bold"
                  disabled={loading}
                >
                  {loading ? "Memverifikasi..." : "Masuk Aplikasi"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;