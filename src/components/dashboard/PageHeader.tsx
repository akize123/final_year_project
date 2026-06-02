interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="page-header">
      <h4 className="page-title">{title}</h4>
      {subtitle && <p className="ds-text-secondary" style={{ marginTop: 6 }}>{subtitle}</p>}
    </div>
  );
}
