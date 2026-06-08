function normalizeStatus(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export default function StatusBadge({ children, variant = "neutral" }) {
  return (
    <span className={`status-badge status-${normalizeStatus(variant)}`}>
      {children}
    </span>
  );
}
