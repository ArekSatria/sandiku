export default function StatCard({ title, value, description, icon = "◇" }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}
