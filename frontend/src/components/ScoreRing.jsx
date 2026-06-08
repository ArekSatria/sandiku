export default function ScoreRing({
  score = 0,
  category = "Belum Dianalisis",
}) {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));

  return (
    <div className="score-ring-wrap">
      <div className="score-ring" style={{ "--score": `${safeScore}%` }}>
        <div className="score-ring-inner">
          <span>{safeScore}</span>
          <small>/100</small>
        </div>
      </div>

      <div className="score-ring-label">
        <strong>{category}</strong>
        <span>Skor kekuatan kata sandi</span>
      </div>
    </div>
  );
}
