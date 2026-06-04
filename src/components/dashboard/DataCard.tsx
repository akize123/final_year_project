import { ReactNode } from "react";

interface DataCardProps {
  label?: string;
  viewReportHref?: string;
  viewReportLabel?: string;
  onViewReport?: () => void;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DataCard({
  label,
  viewReportHref,
  viewReportLabel = "View Report",
  onViewReport,
  headerAction,
  children,
  className = "",
}: DataCardProps) {
  return (
    <div className={`ds-card ${className}`}>
      {(label || viewReportHref || onViewReport || headerAction) && (
        <div className="ds-card-header">
          {label ? <span className="ds-card-label">{label}</span> : <span />}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {headerAction}
            {onViewReport ? (
              <button type="button" className="ds-card-link ds-card-link-button" onClick={onViewReport}>
                {viewReportLabel}
              </button>
            ) : viewReportHref ? (
              <a href={viewReportHref} className="ds-card-link">
                {viewReportLabel}
              </a>
            ) : null}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
