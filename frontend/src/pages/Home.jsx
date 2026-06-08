import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="page-shell">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="section-kicker">Cyber Hygiene Assistant</p>
          <h1>
            Analisis kata sandi dengan tampilan modern dan privasi terjaga.
          </h1>
          <p>
            SANDIKU membantu pengguna memahami kekuatan kata sandi melalui skor,
            kategori keamanan, deteksi pola lemah, pemeriksaan kebocoran publik,
            dan rekomendasi perbaikan yang mudah dipahami.
          </p>

          <div className="hero-actions">
            <Link className="btn btn-primary" to="/analyzer">
              Mulai Analisis
            </Link>
            <Link className="btn btn-secondary" to="/login">
              Login Admin
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
            <span>Security Score</span>
            <strong>86</strong>
            <small>Sangat Kuat</small>
          </div>

          <div className="hero-bars">
            <div>
              <span>Panjang</span>
              <b style={{ width: "90%" }} />
            </div>
            <div>
              <span>Variasi</span>
              <b style={{ width: "82%" }} />
            </div>
            <div>
              <span>Pola Aman</span>
              <b style={{ width: "74%" }} />
            </div>
          </div>

          <div className="hero-safe-note">
            ✓ Kata sandi asli tidak disimpan ke database.
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <div className="glass-card feature-card">
          <span className="feature-icon">01</span>
          <h3>Analisis Hibrida</h3>
          <p>
            Menggabungkan zxcvbn, rule-based checking, blocklist lokal, dan
            pemeriksaan HIBP.
          </p>
        </div>

        <div className="glass-card feature-card">
          <span className="feature-icon">02</span>
          <h3>Privasi Anonim</h3>
          <p>
            Sistem tidak menyimpan kata sandi asli maupun hash kata sandi
            publik.
          </p>
        </div>

        <div className="glass-card feature-card">
          <span className="feature-icon">03</span>
          <h3>Dashboard Admin</h3>
          <p>
            Admin dapat melihat statistik analisis anonim untuk kebutuhan
            evaluasi sistem.
          </p>
        </div>
      </section>
    </main>
  );
}
