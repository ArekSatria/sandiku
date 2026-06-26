import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="page-shell">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="section-kicker">Keamanan Akun Digital</p>
          <h1>Validasi Keamanan Kredensial Anda dengan Presisi Tinggi.</h1>
          <p>
            SANDISCAN adalah alat bantu yang mudah digunakan untuk mengecek
            tingkat keamanan kata sandi Anda. Dapatkan saran perbaikan secara
            langsung tanpa khawatir kata sandi Anda disimpan.
          </p>

          <div className="hero-actions">
            <Link className="btn btn-primary" to="/analyzer">
              Mulai Cek Kata Sandi
            </Link>
            <Link className="btn btn-secondary" to="/login">
              Portal Admin
            </Link>
          </div>
        </div>

        <div className="hero-visual glass-card">
          <div className="terminal-header">
            <span />
            <span />
            <span />
          </div>

          <div className="hero-score">
            <span>Security Index</span>
            <strong>86</strong>
            <small>Sangat Kuat</small>
          </div>

          <div className="hero-bars">
            <div>
              <span>Panjang</span>
              <b style={{ "--w": "90%" }} />
            </div>
            <div>
              <span>Variasi</span>
              <b style={{ "--w": "82%" }} />
            </div>
            <div>
              <span>Pola</span>
              <b style={{ "--w": "74%" }} />
            </div>
          </div>

          <div className="hero-safe-note">
            ✓ Kata sandi Anda tidak akan disimpan.
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <div className="glass-card feature-card">
          <span className="feature-icon">
            <i className="bi bi-shield-check"></i>
          </span>
          <h3>Audit Heuristik Hibrida</h3>
          <p>
            Evaluasi mendalam menggunakan mesin komputasi zxcvbn, validasi
            logika berlapis, dan filtrasi daftar hitam.
          </p>
        </div>

        <div className="glass-card feature-card">
          <span className="feature-icon">
            <i className="bi bi-incognito"></i>
          </span>
          <h3>Privasi Terisolasi</h3>
          <p>
            Kata sandi yang Anda ketik tidak pernah ditransmisikan maupun
            disimpan di dalam basis data.
          </p>
        </div>

        <div className="glass-card feature-card">
          <span className="feature-icon">
            <i className="bi bi-globe"></i>
          </span>
          <h3>Verifikasi Kebocoran Global</h3>
          <p>
            Melacak riwayat paparan kompromi kredensial melalui koneksi
            terenkripsi k-Anonymity ke basis data dunia.
          </p>
        </div>
      </section>
    </main>
  );
}
