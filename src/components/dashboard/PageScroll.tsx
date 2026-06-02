import { ReactNode } from "react";

/** Wrapper for pages without paginated tables — scroll via main content area */
export function PageScroll({ children }: { children: ReactNode }) {
  return <div className="ds-page-scroll">{children}</div>;
}
