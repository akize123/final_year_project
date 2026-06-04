import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  IconArchive,
  IconCalendar,
  IconFolder,
  IconFolderFile,
} from "@/components/icons/FolderIcons";

const documentChildren = [
  { to: "/student/documents/academic", label: "Academic Records" },
  { to: "/student/documents/financial", label: "Financial" },
  { to: "/student/documents/internship", label: "Internship" },
  { to: "/student/documents/clearance", label: "Clearance" },
  { to: "/student/documents/certificates", label: "Certificates" },
  { to: "/student/documents/final-year-project", label: "Final Year" },
];

function NavCard({
  to,
  label,
  icon,
  active,
  end,
}: {
  to: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `ds-fm-nav-card${isActive || active ? " active" : ""}`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

export function StudentSidebar() {
  const location = useLocation();
  const onDocuments = location.pathname.startsWith("/student/documents");
  const onSchedule = location.pathname === "/student/schedule";

  return (
    <aside className="ds-sidebar ds-sidebar-fm">
      <div className="ds-sidebar-brand">
        <img src="/auca-logo.png" alt="Adventist University of Central Africa" className="ds-sidebar-logo" />
        <span className="ds-sidebar-brand-name">AUCA ARCHIVE</span>
      </div>
      <nav className="ds-sidebar-nav" aria-label="Student navigation">
        <NavCard
          to="/dashboard"
          end
          label="Dashboard"
          icon={<IconFolder open={location.pathname === "/dashboard"} size={21} light />}
        />
        <NavCard
          to="/my-reservations"
          label="My Reservation"
        />
        <NavCard
          to="/student/schedule"
          label="Timetable"
          active={onSchedule}
          icon={<IconCalendar size={21} light />}
        />

        <div className={`ds-fm-nav-card ds-fm-nav-toggle${onDocuments ? " active" : ""}`}>
          <IconFolder open={onDocuments} size={21} light />
          <span>My Documents</span>
        </div>

        <div className="ds-fm-subnav">
          {documentChildren.map((item) => (
            <NavCard
              key={item.to}
              to={item.to}
              label={item.label}
              icon={<IconFolderFile size={18} light />}
            />
          ))}
        </div>

        <NavCard
          to="/student/projects"
          label="Personal Projects"
          icon={<IconFolder open={location.pathname.startsWith("/student/projects")} size={21} light />}
        />
        <NavCard
          to="/browse"
          label="Archive Research"
          icon={<IconArchive size={21} light />}
        />
      </nav>
    </aside>
  );
}
