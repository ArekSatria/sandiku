import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Sistem Analisis Kekuatan Kata Sandi</p>
          <h1>SANDIKU</h1>
          <p>
            SANDIKU adalah aplikasi web edukatif untuk membantu pengguna
            memahami kekuatan kata sandi melalui skor, kategori, deteksi pola
            lemah, pemeriksaan kebocoran publik, dan rekomendasi perbaikan.
          </p>

          <div className="hero-actions">
            <Link className="primary-button" to="/analyzer">
              Mulai Analisis
            </Link>
            <Link className="secondary-button" to="/login">
              Login Admin
            </Link>
          </div>
        </div>

        <div className="card hero-card">
          <h3>Prinsip Privasi</h3>
          <p>
            Kata sandi asli pengguna tidak disimpan ke database. Sistem hanya
            mencatat metadata anonim seperti panjang, skor, kategori, status
            kebocoran, dan waktu analisis.
          </p>
        </div>
      </section>
    </main>
  );
}
