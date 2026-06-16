import StatusBadge from "./StatusBadge";

// Penerjemah Waktu Khusus (Mengubah teks "12 Juni 2026, 11:27:49 WIB" menjadi UTC lalu ke WIB Asli)
const formatWIB = (dateInput) => {
  if (!dateInput) return "";
  try {
    const ds = String(dateInput);

    // Deteksi pola string dari backend (contoh: "12 Juni 2026, 11:27:49 WIB")
    const match = ds.match(
      /(\d{1,2})\s+([A-Za-z]+)\s+(\d{4}),\s+(\d{2}):(\d{2}):(\d{2})/,
    );

    if (match) {
      // Kamus bulan bahasa Indonesia ke angka
      const months = {
        januari: 0,
        februari: 1,
        maret: 2,
        april: 3,
        mei: 4,
        juni: 5,
        juli: 6,
        agustus: 7,
        september: 8,
        oktober: 9,
        november: 10,
        desember: 11,
      };

      const day = parseInt(match[1], 10);
      const month = months[match[2].toLowerCase()] || 0;
      const year = parseInt(match[3], 10);
      const hour = parseInt(match[4], 10);
      const minute = parseInt(match[5], 10);
      const second = parseInt(match[6], 10);

      // Anggap jam 11 itu adalah UTC (mengabaikan teks WIB palsu dari backend)
      const utcDate = new Date(
        Date.UTC(year, month, day, hour, minute, second),
      );

      // Paksa konversi ke Waktu Indonesia Barat (+7)
      return (
        new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Jakarta",
        })
          .format(utcDate)
          .replace(/\./g, ":") + " WIB"
      );
    }

    return ds; // Fallback jika format berbeda
  } catch {
    return String(dateInput);
  }
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

  // MENGAMBIL DATA SESUAI NAMA VARIABEL DARI BACKEND
  const warnings = result.detected_patterns || [];
  const suggestions = result.recommendations || [];

  const scoreValue = result.score || 0;
  const scoreColor =
    scoreValue < 40 ? "#ef4444" : scoreValue < 80 ? "#f59e0b" : "#10b981";
  const categoryClass = String(result.category || "lemah")
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
            Dianalisis pada {formatWIB(result.created_at)}
          </p>
        </div>
        <StatusBadge variant={categoryClass}>
          {result.category || "Belum Diketahui"}
        </StatusBadge>
      </div>

      <div className="result-summary">
        <div className="score-ring-wrap">
          <div
            className="score-ring"
            style={{
              "--score": `${scoreValue}%`,
              "--accent-primary": scoreColor,
            }}
          >
            <div className="score-ring-inner">
              <span>{scoreValue}</span>
              <small>/100</small>
            </div>
          </div>
          <div className="score-ring-label" style={{ textAlign: "center" }}>
            <strong style={{ color: scoreColor }}>
              {result.category || "Status"}
            </strong>
            <span>Skor keamanan</span>
          </div>
        </div>

        <div className="mini-metrics">
          <div>
            <span>Panjang</span>
            <strong>
              {result.password_length || 0}{" "}
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

      {/* AREA FEEDBACK YANG SUDAH TERHUBUNG DENGAN DATA BACKEND */}
      {(warnings.length > 0 || suggestions.length > 0) && (
        <div className="feedback-section">
          {/* Kotak Kelemahan (detected_patterns) */}
          {warnings.length > 0 && (
            <div className="feedback-box warning">
              <div className="feedback-title">
                <i className="bi bi-exclamation-triangle-fill"></i> Kelemahan
                Terdeteksi
              </div>
              <ul className="custom-list">
                {warnings.map((warn, index) => (
                  <li key={index}>
                    <i className="bi bi-x-circle-fill"></i> <span>{warn}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Kotak Rekomendasi (recommendations) */}
          {suggestions.length > 0 && (
            <div className="feedback-box suggestion">
              <div className="feedback-title">
                <i className="bi bi-lightbulb-fill"></i> Rekomendasi Perbaikan
              </div>
              <ul className="custom-list">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>
                    <i className="bi bi-check-circle-fill"></i>{" "}
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
