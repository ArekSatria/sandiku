function getStrengthColorClass(score) {
  if (score <= 20) return "strength-fill danger";
  if (score <= 40) return "strength-fill weak";
  if (score <= 60) return "strength-fill medium";
  if (score <= 80) return "strength-fill strong";
  return "strength-fill excellent";
}

export default function StrengthMeter({
  score = 0,
  category = "Belum Dianalisis",
}) {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));

  return (
    <div className="strength-meter">
      <div className="strength-header">
        <span>Skor Kekuatan</span>
        <strong>{safeScore}/100</strong>
      </div>

      <div className="strength-track">
        <div
          className={getStrengthColorClass(safeScore)}
          style={{ width: `${safeScore}%` }}
        />
      </div>

      <div className="strength-category">{category}</div>
    </div>
  );
}
