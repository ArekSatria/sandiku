import StrengthMeter from "./StrengthMeter";

function BreachStatus({ result }) {
  if (!result) return null;

  if (result.hibp_status === "failed") {
    return (
      <div className="alert warning">
        Pemeriksaan kebocoran melalui Have I Been Pwned gagal dilakukan. Ulangi
        pemeriksaan ketika koneksi stabil.
      </div>
    );
  }

  if (result.is_breached) {
    return (
      <div className="alert danger">
        Kata sandi ini ditemukan dalam basis data kebocoran publik sebanyak{" "}
        <strong>
          {Number(result.breach_count || 0).toLocaleString("id-ID")}
        </strong>{" "}
        kali. Jangan gunakan kata sandi ini.
      </div>
    );
  }

  return (
    <div className="alert success">
      Kata sandi tidak terindikasi muncul dalam basis data kebocoran publik
      berdasarkan pemeriksaan HIBP.
    </div>
  );
}

export default function ResultCard({ result }) {
  if (!result) {
    return (
      <div className="card empty-state">
        <h3>Belum ada hasil analisis</h3>
        <p>
          Masukkan kata sandi untuk melihat skor, kategori, kelemahan, dan
          rekomendasi perbaikannya.
        </p>
      </div>
    );
  }

  return (
    <div className="card result-card">
      <div className="result-header">
        <div>
          <h3>Hasil Analisis Kata Sandi</h3>
          <p className="muted">Waktu analisis: {result.created_at}</p>
        </div>

        <span
          className={`badge badge-${String(result.category).toLowerCase().replaceAll(" ", "-")}`}
        >
          {result.category}
        </span>
      </div>

      <StrengthMeter score={result.score} category={result.category} />

      <div className="result-grid">
        <div className="metric-box">
          <span>Panjang Kata Sandi</span>
          <strong>{result.password_length} karakter</strong>
        </div>

        <div className="metric-box">
          <span>Status HIBP</span>
          <strong>
            {result.hibp_status === "checked"
              ? "Berhasil Diperiksa"
              : "Gagal Diperiksa"}
          </strong>
        </div>

        <div className="metric-box">
          <span>Jumlah Kebocoran</span>
          <strong>
            {Number(result.breach_count || 0).toLocaleString("id-ID")}
          </strong>
        </div>
      </div>

      <BreachStatus result={result} />

      <div className="analysis-section">
        <h4>Kelemahan yang Terdeteksi</h4>
        <ul>
          {(result.detected_patterns || []).map((item, index) => (
            <li key={`pattern-${index}`}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="analysis-section">
        <h4>Rekomendasi Perbaikan</h4>
        <ul>
          {(result.recommendations || []).map((item, index) => (
            <li key={`recommendation-${index}`}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="privacy-note">
        Sistem hanya menyimpan metadata anonim seperti skor, kategori, panjang
        kata sandi, dan waktu analisis. Kata sandi asli tidak disimpan.
      </div>
    </div>
  );
}
