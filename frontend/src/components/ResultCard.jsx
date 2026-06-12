import StatusBadge from "./StatusBadge";

// Fungsi absolut untuk memaksa waktu menjadi WIB (Asia/Jakarta)
const formatWIB = (dateInput) => {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  return (
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Jakarta", // Kunci di waktu Indonesia Barat
    })
      .format(date)
      .replace(/\./g, ":") + " WIB"
  );
};

export default function ResultCard({ result }) {
  if (!result) {
    return (
      <div className="glass-card result-empty">
        <div className="empty-orb">
          <i className="bi bi-shield-lock-fill"></i>
        </div>
        <h3>Menunggu Input</h3>
        <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
          Masukkan kata sandi di panel sebelah kiri untuk melihat hasil analisis
          keamanan.
        </p>
      </div>
    );
  }

  // Menentukan warna ring dan badge berdasarkan skor
  const scoreColor =
    result.score < 40 ? "#ef4444" : result.score < 80 ? "#f59e0b" : "#10b981";

  const categoryClass = String(result.category || "")
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <div className="glass-card">
      <div className="result-topbar">
        <div>
          <span
            className="status-badge status-neutral"
            style={{ marginBottom: "1rem", display: "inline-block" }}
          >
            HASIL ANALISIS
          </span>
          <h2>Kekuatan Kata Sandi</h2>
          <p style={{ color: "var(--text-muted)" }}>
            Dianalisis pada {formatWIB(result.created_at || new Date())}
          </p>
        </div>
        <StatusBadge variant={categoryClass}>{result.category}</StatusBadge>
      </div>

      <div className="result-summary">
        <div className="score-ring-wrap">
          <div
            className="score-ring"
            style={{
              "--score": `${result.score}%`,
              "--accent-primary": scoreColor,
            }}
          >
            <div className="score-ring-inner">
              <span>{result.score}</span>
              <small>/100</small>
            </div>
          </div>
          <div className="score-ring-label" style={{ textAlign: "center" }}>
            <strong style={{ color: scoreColor }}>{result.category}</strong>
            <span>Skor keamanan</span>
          </div>
        </div>

        <div className="mini-metrics">
          <div>
            <span>Panjang</span>
            <strong>
              {result.password_length}{" "}
              <small style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                karakter
              </small>
            </strong>
          </div>
          <div>
            <span>Status HIBP</span>
            <strong
              style={{ color: result.is_breached ? "#ef4444" : "#10b981" }}
            >
              {result.is_breached ? "Bocor" : "Aman"}
            </strong>
          </div>
          <div>
            <span>Jumlah Bocor</span>
            <strong>
              {Number(result.breach_count || 0).toLocaleString("id-ID")}
            </strong>
          </div>
        </div>
      </div>

      {/* AREA FEEDBACK & REKOMENDASI (KOTAK RAPI) */}
      {(result.feedback?.warning ||
        (result.feedback?.suggestions &&
          result.feedback.suggestions.length > 0)) && (
        <div className="feedback-section">
          {/* Kotak Peringatan/Kelemahan */}
          {result.feedback.warning && (
            <div className="feedback-box warning">
              <div className="feedback-title">
                <i className="bi bi-exclamation-triangle-fill"></i> Kelemahan
                Terdeteksi
              </div>
              <ul className="custom-list">
                <li>
                  <i className="bi bi-x-circle-fill"></i>
                  <span>{result.feedback.warning}</span>
                </li>
              </ul>
            </div>
          )}

          {/* Kotak Rekomendasi/Saran */}
          {result.feedback.suggestions &&
            result.feedback.suggestions.length > 0 && (
              <div className="feedback-box suggestion">
                <div className="feedback-title">
                  <i className="bi bi-lightbulb-fill"></i> Rekomendasi Perbaikan
                </div>
                <ul className="custom-list">
                  {result.feedback.suggestions.map((suggestion, index) => (
                    <li key={index}>
                      <i className="bi bi-check-circle-fill"></i>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
