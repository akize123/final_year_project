import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { mockCertificateDocs } from "@/data/student-documents-mock";
import { mockPersonalProjects } from "@/data/student-documents-mock";

const CERT_STORAGE = "auca_student_certificates";
const PROJECT_STORAGE = "auca_student_personal_projects";

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function StudentProfilePage() {
  const { user } = useAuth();
  if (!user) return null;

  const certs = loadJson(CERT_STORAGE, mockCertificateDocs);
  const projects = loadJson(PROJECT_STORAGE, mockPersonalProjects);

  const shareUrl = useMemo(
    () => `${window.location.origin}/student/profile?share=${user.id}`,
    [user.id],
  );

  const copyShare = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  return (
    <div className="ds-page-scroll">
      <PageHeader
        title="Professional Profile"
        subtitle="Shareable portfolio — projects, certificates, and academic identity"
      />

      <div className="ds-profile-hero">
        <div className="ds-profile-banner" />
        <div className="ds-profile-body">
          <div className="ds-profile-avatar-lg">{user.avatarInitials}</div>
          <h1 className="ds-profile-name">{user.name}</h1>
          <p className="ds-profile-headline">
            {user.year ?? "Student"} · {user.department} · {user.campusId}
          </p>
          <p className="ds-body-text">{user.email}</p>
          <div className="ds-profile-actions">
            <button type="button" className="btn btn-primary btn-sm" onClick={copyShare}>
              Copy share link
            </button>
            <span className="ds-share-badge">Public CV preview (coming soon)</span>
          </div>
        </div>
      </div>

      <div className="ds-profile-section">
        <h3 className="ds-section-heading">About</h3>
        <p className="ds-body-text">
          Information Technology student at AUCA with focus on software engineering, web
          systems, and cloud technologies. Building portfolio through coursework, internships,
          and personal projects.
        </p>
      </div>

      <div className="ds-profile-section">
        <h3 className="ds-section-heading">Personal Projects</h3>
        {projects.length === 0 ? (
          <p className="ds-text-secondary">No projects added yet.</p>
        ) : (
          projects.map((p) => (
            <div key={p.id} className="ds-profile-item">
              <h4>{p.title}</h4>
              <p className="ds-text-secondary">{p.description}</p>
              <p className="ds-body-text" style={{ marginTop: 8 }}>
                <strong>Tech:</strong> {p.tech}
              </p>
              {p.link && (
                <a href={p.link} className="ds-card-link" target="_blank" rel="noreferrer">
                  View project
                </a>
              )}
            </div>
          ))
        )}
      </div>

      <div className="ds-profile-section">
        <h3 className="ds-section-heading">Certificates</h3>
        {certs.length === 0 ? (
          <p className="ds-text-secondary">No certificates uploaded.</p>
        ) : (
          certs.map((c) => (
            <div key={c.documentId} className="ds-profile-item">
              <h4>{c.typeLabel ?? c.filename}</h4>
              <p className="ds-text-secondary">{c.filename}</p>
              <span className={`ds-badge ds-badge-success`} style={{ marginTop: 8 }}>
                {c.status}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="ds-profile-section">
        <h3 className="ds-section-heading">Education</h3>
        <div className="ds-profile-item">
          <h4>Adventist University of Central Africa</h4>
          <p className="ds-text-secondary">BSc Information Technology · {user.year ?? "Year 4"}</p>
        </div>
      </div>
    </div>
  );
}
