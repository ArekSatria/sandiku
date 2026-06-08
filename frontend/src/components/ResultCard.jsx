import ScoreRing from "./ScoreRing";
import StatusBadge from "./StatusBadge";

function getCategoryVariant(category) {
  return String(category || "")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function BreachPanel({ result }) {
  if (!result) return null;

  if (result.hibp_status === "failed") {
    return (
      <div className="info-panel warning-panel">
        <div className="panel-icon">!</div>
        <div>
          <h4>Pemeriksaan Kebocoran Gagal</h4>
          <p>
            Sistem tidak berhasil menghubungi layanan Have I Been Pwned. Ulangi
            pemeriksaan ketika koneksi stabil sebelum menyimpulkan kata sandi
            aman dari riwayat kebocoran.
          </p>
        </div>
      </div>
    );
  }

  if (result.is_breached) {
    return (
      <div className="info-panel danger-panel">
        <div className="panel-icon">×</div>
        <div>
          <h4>Kata Sandi Pernah Bocor</h4>
          <p>
            Kata sandi ini ditemukan dalam basis data kebocoran publik sebanyak{" "}
            <strong>
              {Number(result.breach_count || 0).toLocaleString("id-ID")}
            </strong>{" "}
            kali. Kata sandi ini tidak layak digunakan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="info-panel success-panel">
      <div className="panel-icon">✓</div>
      <div>
        <h4>Tidak Terindikasi Bocor</h4>
        <p>
          Kata sandi tidak ditemukan dalam basis data kebocoran publik
          berdasarkan pemeriksaan HIBP.
        </p>
      </div>
    </div>
  );
}

function EmptyResult() {
  return (
    <div className="result-empty">
      <div className="empty-orb">S</div>
      <h3>Belum Ada Hasil Analisis</h3>
      <p>
        Masukkan kata sandi untuk melihat skor, kategori, status kebocoran, pola
        kelemahan, dan rekomendasi perbaikannya.
      </p>
    </div>
  );
}

export default function ResultCard({ result }) {
  if (!result) {
    return (
      <section className="glass-card result-card">
        <EmptyResult />
      </section>
    );
  }

  const categoryVariant = getCategoryVariant(result.category);

  return (
    <section className="glass-card result-card">
      <div className="result-topbar">
        <div>
          <p className="section-kicker">Hasil Analisis</p>
          <h2>Kekuatan Kata Sandi</h2>
          <span className="muted-text">
            Dianalisis pada {result.created_at}
          </span>
        </div>

        <StatusBadge variant={categoryVariant}>{result.category}</StatusBadge>
      </div>

      <div className="result-summary">
        <ScoreRing score={result.score} category={result.category} />

        <div className="mini-metrics">
          <div>
            <span>Panjang</span>
            <strong>{result.password_length} karakter</strong>
          </div>
          <div>
            <span>Status HIBP</span>
            <strong>
              {result.hibp_status === "checked" ? "Berhasil" : "Gagal"}
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

      <BreachPanel result={result} />

      <div className="result-lists">
        <div>
          <h3>Kelemahan Terdeteksi</h3>

          {result.detected_patterns?.length ? (
            <ul className="clean-list">
              {result.detected_patterns.map((item, index) => (
                <li key={`pattern-${index}`}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="muted-text">
              Tidak ada kelemahan dominan yang terdeteksi.
            </p>
          )}
        </div>

        <div>
          <h3>Rekomendasi Perbaikan</h3>

          {result.recommendations?.length ? (
            <ul className="clean-list">
              {result.recommendations.map((item, index) => (
                <li key={`recommendation-${index}`}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="muted-text">
              Gunakan kata sandi unik dan jangan gunakan ulang pada layanan
              lain.
            </p>
          )}
        </div>
      </div>

      <div className="privacy-banner">
        <strong>Privasi dijaga.</strong> Sistem hanya menyimpan metadata anonim,
        seperti panjang kata sandi, skor, kategori, status kebocoran, dan waktu
        analisis. Kata sandi asli tidak disimpan.
      </div>
    </section>
  );
}
