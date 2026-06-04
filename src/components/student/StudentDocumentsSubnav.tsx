import { NavLink, useLocation } from "react-router-dom";

const documentSections = [
  { to: "/student/documents/academic", label: "Academic Records" },
  { to: "/student/documents/financial", label: "Financial" },
  { to: "/student/documents/internship", label: "Internship" },
  { to: "/student/documents/clearance", label: "Clearance" },
  { to: "/student/documents/certificates", label: "Certificates" },
  { to: "/student/documents/final-year-project", label: "Final Year" },
] as const;

export function StudentDocumentsSubnav() {
  const location = useLocation();
  const onDocuments = location.pathname.startsWith("/student/documents");
  if (!onDocuments) return null;

  return (
    <nav className="ds-student-docs-subnav" aria-label="My Documents sections">
      {documentSections.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          style={{
            width: 132,
            minWidth: 132,
            minHeight: 40,
            justifyContent: "center",
            textAlign: "center",
          }}
          className={({ isActive }) =>
            `ds-student-docs-subnav-link${isActive ? " active" : ""}`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
