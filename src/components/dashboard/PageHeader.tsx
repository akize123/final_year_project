import type React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  aside?: React.ReactNode;
  centered?: boolean;
}

export function PageHeader({ title, subtitle, aside, centered }: PageHeaderProps) {
  return (
    <div className={`page-header${centered ? " page-header-centered" : ""}`}>
      <div>
        <h4 className="page-title">{title}</h4>
        {subtitle && <p className="ds-text-secondary" style={{ marginTop: 6 }}>{subtitle}</p>}
      </div>
      {aside && <div className="page-header-aside">{aside}</div>}
    </div>
  );
}
