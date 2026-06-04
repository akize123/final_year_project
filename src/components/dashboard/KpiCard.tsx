interface KpiCardProps {
  label: string;
  value: string | number;
  trend?: { direction: "up" | "down" | "neutral"; text: string };
  subLabel?: string;
  compact?: boolean;
}

export function KpiCard({ label, value, trend, subLabel, compact }: KpiCardProps) {
  return (
    <div className={`ds-kpi-card${compact ? " compact" : ""}`}>
      <div className="ds-kpi-label">{label}</div>
      <div className="ds-kpi-value">{value}</div>
      {trend ? (
        <div className={`ds-kpi-trend ${trend.direction}`}>
          {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "•"} {trend.text}
        </div>
      ) : (
        <div className="ds-kpi-trend" style={{ visibility: "hidden" }}>spacer</div>
      )}
      {subLabel && <div className="ds-kpi-sub">{subLabel}</div>}
    </div>
  );
}
