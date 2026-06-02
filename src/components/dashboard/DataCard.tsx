import { ReactNode } from "react";

interface DataCardProps {
  label?: string;
  viewReportHref?: string;
  viewReportLabel?: string;
  children: ReactNode;
  className?: string;
}

export function DataCard({
  label,
  viewReportHref,
  viewReportLabel = "View Report",
  children,
  className = "",
}: DataCardProps) {
  return (
    <div className={`ds-card ${className}`}>
      {(label || viewReportHref) && (
        <div className="ds-card-header">
          {label ? <span className="ds-card-label">{label}</span> : <span />}
          {viewReportHref && (
            <a href={viewReportHref} className="ds-card-link">
              {viewReportLabel}
            </a>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
