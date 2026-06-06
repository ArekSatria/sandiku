const StrengthMeter = ({ score }) => {
  let bgColor = "bg-danger"; // Sangat Lemah / Lemah
  if (score > 40 && score <= 60) bgColor = "bg-warning"; // Sedang
  if (score > 60 && score <= 80) bgColor = "bg-info"; // Kuat
  if (score > 80) bgColor = "bg-success"; // Sangat Kuat

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between mb-1">
        <span className="fw-bold text-muted small">Indikator Kekuatan:</span>
        <span className="fw-bold small">{score}/100</span>
      </div>
      <div className="progress" style={{ height: "10px" }}>
        <div
          className={`progress-bar ${bgColor} progress-bar-striped progress-bar-animated`}
          role="progressbar"
          style={{ width: `${score}%` }}
          aria-valuenow={score}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  );
};

export default StrengthMeter;
