import { useCallback, useEffect, useState } from "react";
import { Camera, FileStack, Link2, Plus, Sparkles, UserCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { DataCard } from "@/components/dashboard/DataCard";
import { FypCreateProjectForm } from "@/components/student/FypCreateProjectForm";
import { FypStudentProfileForm } from "@/components/student/FypStudentProfileForm";
import { FypProfilePhotoUpload } from "@/components/student/FypProfilePhotoUpload";
import { FypProjectDocumentsPanel } from "@/components/student/FypProjectDocumentsPanel";
import { FypExternalLinksForm } from "@/components/student/FypExternalLinksForm";
import type { FypResponse } from "@/api/types";
import { listFyp, createFyp, uploadFypDoc, submitFyp, deleteFyp } from "@/api/student/fyp";
import {
  addProjectDocument,
  categoryLabel,
  countUploadedDocTypes,
  createLocalFyp,
  genderLabel,
  loadFypProfile,
  loadLocalFypProjects,
  removeProjectDocument,
  saveFypProfile,
  saveFypProfilePhoto,
  saveLocalFypProjects,
  saveProjectExternalLinks,
  type FypCreateInput,
  type FypDocumentType,
  type FypExternalLinks,
  type FypProfileInput,
  type FypStudentProfile,
  type StoredFypProject,
} from "@/data/fyp-project";
import { getAuthToken } from "@/lib/auth-token";
import { toast } from "sonner";
import { pushNotification } from "@/lib/notifications";

function mergeWithLocalExtras(apiProjects: FypResponse[]): StoredFypProject[] {
  const local = loadLocalFypProjects();
  return apiProjects.map((p) => {
    const extra = local.find((l) => l.id === p.id);
    return {
      ...p,
      supervisorName: extra?.supervisorName ?? p.supervisorName,
      researchArea: extra?.researchArea,
      projectCategory: extra?.projectCategory,
      documents: extra?.documents ?? [],
      externalLinks: extra?.externalLinks,
    };
  });
}

function persistLocalExtras(project: StoredFypProject) {
  const all = loadLocalFypProjects();
  const idx = all.findIndex((p) => p.id === project.id);
  if (idx >= 0) all[idx] = project;
  else all.unshift(project);
  saveLocalFypProjects(all);
}

const API_DOC_MAP: Partial<Record<FypDocumentType, "thesis" | "report" | "code-archive">> = {
  "final-report": "report",
  "proposal": "report",
  "source-code": "code-archive",
};

export default function FinalYearProjectPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<FypStudentProfile | null>(() => loadFypProfile());
  const [projects, setProjects] = useState<StoredFypProject[]>([]);
  const [selected, setSelected] = useState<StoredFypProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showPhotoStep, setShowPhotoStep] = useState(false);
  const [showDocsStep, setShowDocsStep] = useState(false);
  const [showLinksStep, setShowLinksStep] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const savedProfile = loadFypProfile();
    setProfile(savedProfile);
    setShowProfileForm(!savedProfile);

    try {
      if (getAuthToken()) {
        const list = mergeWithLocalExtras(await listFyp());
        setProjects(list);
        setSelected((prev) => list.find((p) => p.id === prev?.id) ?? list[0] ?? null);
        setShowCreateForm(savedProfile ? list.length === 0 : false);
      } else {
        const list = loadLocalFypProjects();
        setProjects(list);
        setSelected((prev) => list.find((p) => p.id === prev?.id) ?? list[0] ?? null);
        setShowCreateForm(savedProfile ? list.length === 0 : false);
      }
    } catch {
      const list = loadLocalFypProjects();
      setProjects(list);
      setSelected((prev) => list.find((p) => p.id === prev?.id) ?? list[0] ?? null);
      setShowCreateForm(savedProfile ? list.length === 0 : false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateSelected = (project: StoredFypProject) => {
    setSelected(project);
    setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)));
    persistLocalExtras(project);
  };

  const handleProfileSave = async (input: FypProfileInput) => {
    const saved = saveFypProfile(input);
    setProfile(saved);
    setShowProfileForm(false);
    setShowPhotoStep(false);
    setShowDocsStep(false);
    setShowLinksStep(false);
    setShowCreateForm(true);
    toast.success("Student profile saved. Continue to Step 2 to create your project.");
  };

  const handlePhotoSave = async (dataUrl: string) => {
    const updated = saveFypProfilePhoto(dataUrl);
    if (!updated) {
      toast.error("Save your profile (Step 1) before uploading a photo.");
      throw new Error("No profile");
    }
    setProfile(updated);
    setShowPhotoStep(false);
  };

  const handleCreate = async (input: FypCreateInput) => {
    if (!profile) {
      toast.error("Complete Step 1 — student profile — first.");
      setShowProfileForm(true);
      throw new Error("Profile required");
    }

    if (getAuthToken()) {
      try {
        const created = await createFyp({
          title: input.title,
          abstractText: input.abstractText,
          keywords: input.keywords,
          department: input.department,
          academicYear: input.academicYear,
          supervisorName: input.supervisorName,
          researchArea: input.researchArea,
          projectCategory: input.projectCategory,
          projectType: input.projectCategory,
        });
        const stored: StoredFypProject = {
          ...created,
          supervisorName: input.supervisorName,
          researchArea: input.researchArea,
          projectCategory: input.projectCategory,
          documents: [],
          externalLinks: {},
        };
        persistLocalExtras(stored);
        setSelected(stored);
        setShowCreateForm(false);
        setShowDocsStep(true);
        await load();
        toast.success("Final year project created.");
        return;
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not create project.");
        throw e;
      }
    }

    const created = createLocalFyp(input);
    setProjects((prev) => [created, ...prev]);
    setSelected(created);
    setShowCreateForm(false);
    setShowDocsStep(true);
    toast.success("Final year project created (demo mode).");
  };

  const handleDocUpload = async (type: FypDocumentType, file: File) => {
    if (!selected) return;
    const apiType = API_DOC_MAP[type];
    if (getAuthToken() && apiType) {
      await uploadFypDoc(selected.id, apiType, file);
    }
    const updated = addProjectDocument(selected.id, type, file);
    if (!updated) throw new Error("Project not found");
    updateSelected(updated);
  };

  const handleDocRemove = (docId: string) => {
    if (!selected) return;
    const updated = removeProjectDocument(selected.id, docId);
    if (updated) {
      updateSelected(updated);
      toast.message("File removed.");
    }
  };

  const handleLinksSave = async (links: FypExternalLinks) => {
    if (!selected) return;
    const updated = saveProjectExternalLinks(selected.id, links);
    if (!updated) throw new Error("Project not found");
    updateSelected(updated);
    setShowLinksStep(false);
  };

  const handleDelete = async (project: FypResponse) => {
    if (!confirm("Delete this project record?")) return;
    if (getAuthToken()) {
      try {
        await deleteFyp(project.id);
        toast.success("Project deleted.");
        await load();
        return;
      } catch {
        toast.error("Could not delete project.");
        return;
      }
    }
    const next = projects.filter((p) => p.id !== project.id);
    saveLocalFypProjects(next);
    setProjects(next);
    setSelected(next[0] ?? null);
    setShowCreateForm(next.length === 0);
    toast.success("Project deleted.");
  };

  const hasPhoto = Boolean(profile?.profilePhotoUrl);
  const docTypesCount = selected ? countUploadedDocTypes(selected) : 0;
  const linkCount = selected
    ? Object.values(selected.externalLinks ?? {}).filter(Boolean).length
    : 0;

  const wizardOpen =
    showProfileForm ||
    showPhotoStep ||
    showDocsStep ||
    showLinksStep ||
    showCreateForm ||
    !profile ||
    projects.length === 0;

  const showStep1 = !profile || showProfileForm;
  const showStep3Photo = profile && !showProfileForm && showPhotoStep;
  const showStep2 =
    profile && !showProfileForm && !showStep3Photo && (showCreateForm || projects.length === 0);
  const showStep4Docs = profile && selected && !showStep1 && !showStep2 && !showStep3Photo && showDocsStep;
  const showStep5Links =
    profile && selected && !showStep1 && !showStep2 && !showStep3Photo && showLinksStep;
  const showDashboard =
    profile && selected && !showStep1 && !showStep2 && !showStep3Photo && !showStep4Docs && !showStep5Links;
  const showContinueToProject =
    profile && !showProfileForm && !showCreateForm && !showDocsStep && !showLinksStep && projects.length === 0;

  const profileDefaults = user
    ? { fullName: user.name, registrationNumber: user.campusId, email: user.email }
    : undefined;

  return (
    <div className="ds-page-scroll ds-fyp-page">
      <div className="ds-schedule-toolbar ds-fyp-toolbar">
        <div className="ds-schedule-toolbar-info">
          <h2 className="ds-schedule-toolbar-title">Final Year Project</h2>
          <p className="ds-schedule-toolbar-sub">
            Build your portfolio — complete all five steps for a full profile
          </p>
        </div>
        {showDashboard && (
          <div className="ds-schedule-toolbar-actions">
            <button
              type="button"
              className="ds-schedule-btn ds-schedule-btn-outline"
              onClick={() => setShowDocsStep(true)}
            >
              Manage documents
            </button>
            <button
              type="button"
              className="ds-schedule-btn ds-schedule-btn-outline"
              onClick={() => setShowLinksStep(true)}
            >
              Edit links
            </button>
            <button
              type="button"
              className="ds-schedule-btn ds-schedule-btn-primary ds-schedule-btn-with-icon"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus size={16} strokeWidth={2.25} aria-hidden />
              New project
            </button>
          </div>
        )}
      </div>

      <div className="ds-fyp-steps ds-fyp-steps-wrap" aria-label="Project setup steps">
        <div className={`ds-fyp-step${showStep1 ? " active" : profile ? " done" : " muted"}`}>
          <span className="ds-fyp-step-num">1</span>
          <span>Profile</span>
        </div>
        <div className="ds-fyp-step-line" aria-hidden />
        <div
          className={`ds-fyp-step${showStep2 ? " active" : projects.length ? " done" : " muted"}`}
        >
          <span className="ds-fyp-step-num">2</span>
          <span>Project</span>
        </div>
        <div className="ds-fyp-step-line" aria-hidden />
        <div
          className={`ds-fyp-step${showStep3Photo ? " active" : hasPhoto ? " done" : " muted"}`}
        >
          <span className="ds-fyp-step-num">3</span>
          <span>Photo</span>
        </div>
        <div className="ds-fyp-step-line" aria-hidden />
        <div
          className={`ds-fyp-step${showStep4Docs ? " active" : docTypesCount >= 3 ? " done" : " muted"}`}
        >
          <span className="ds-fyp-step-num">4</span>
          <span>Documents</span>
        </div>
        <div className="ds-fyp-step-line" aria-hidden />
        <div
          className={`ds-fyp-step${showStep5Links ? " active" : linkCount > 0 ? " done" : " muted"}`}
        >
          <span className="ds-fyp-step-num">5</span>
          <span>Links</span>
        </div>
      </div>

      {!loading && (
        <div className="ds-kpi-grid">
          <KpiCard compact label="Profile" value={profile ? "Complete" : "Pending"} />
          <KpiCard compact label="Documents" value={`${docTypesCount}/5`} />
          <KpiCard compact label="Links" value={linkCount} />
          <KpiCard compact label="Status" value={selected?.status ?? "—"} />
        </div>
      )}

      {showContinueToProject && (
        <div className="ds-fyp-inline-cta" style={{ marginBottom: 16 }}>
          <button
            type="button"
            className="ds-schedule-btn ds-schedule-btn-primary"
            onClick={() => setShowCreateForm(true)}
          >
            Continue to Step 2
          </button>
        </div>
      )}

      {showContinueToProject && (
        <div className="ds-fyp-create-card">
          <div className="ds-fyp-create-card-head">
            <div className="ds-fyp-create-icon" aria-hidden>
              <Sparkles size={22} />
            </div>
            <div>
              <h3 className="ds-fyp-create-title">Continue to Step 2</h3>
              <p className="ds-text-secondary" style={{ margin: "6px 0 0", fontSize: 13 }}>
                Step 1 is complete. Continue to create your final year project.
              </p>
            </div>
          </div>
          <div className="ds-fyp-form-actions" style={{ borderTop: "none", paddingTop: 0 }}>
            <button
              type="button"
              className="ds-schedule-btn ds-schedule-btn-primary"
              onClick={() => setShowCreateForm(true)}
            >
              Continue to Step 2
            </button>
          </div>
        </div>
      )}

      {showStep1 && (
        <div className="ds-fyp-create-card">
          <div className="ds-fyp-create-card-head">
            <div className="ds-fyp-create-icon" aria-hidden>
              <UserCircle size={22} />
            </div>
            <div>
              <h3 className="ds-fyp-create-title">Student Profile Information</h3>
              <p className="ds-text-secondary" style={{ margin: "6px 0 0", fontSize: 13 }}>
                Step 1 — portfolio profile details.
              </p>
            </div>
          </div>
          <FypStudentProfileForm
            initial={profile}
            defaultValues={profileDefaults}
            onSubmit={handleProfileSave}
            onCancel={profile ? () => setShowProfileForm(false) : undefined}
          />
        </div>
      )}

      {showStep2 && (
        <div className="ds-fyp-create-card">
          <div className="ds-fyp-create-card-head">
            <div className="ds-fyp-create-icon" aria-hidden>
              <Sparkles size={22} />
            </div>
            <div>
              <h3 className="ds-fyp-create-title">Create Final Year Project</h3>
              <p className="ds-text-secondary" style={{ margin: "6px 0 0", fontSize: 13 }}>
                Step 2 — describe your research project.
              </p>
            </div>
          </div>
          <FypCreateProjectForm
            onSubmit={handleCreate}
            onCancel={projects.length > 0 ? () => setShowCreateForm(false) : undefined}
          />
        </div>
      )}

      {showStep3Photo && profile && (
        <div className="ds-fyp-create-card">
          <div className="ds-fyp-create-card-head">
            <div className="ds-fyp-create-icon" aria-hidden>
              <Camera size={22} />
            </div>
            <div>
              <h3 className="ds-fyp-create-title">Upload Student Photo</h3>
              <p className="ds-text-secondary" style={{ margin: "6px 0 0", fontSize: 13 }}>
                Step 3 — preview before saving; shown on your portfolio.
              </p>
            </div>
          </div>
          <FypProfilePhotoUpload
            currentPhotoUrl={profile.profilePhotoUrl}
            onSave={handlePhotoSave}
          />
          <div className="ds-fyp-form-actions" style={{ marginTop: 8, borderTop: "none", paddingTop: 0 }}>
            <button
              type="button"
              className="ds-schedule-btn ds-schedule-btn-outline"
              onClick={() => setShowPhotoStep(false)}
            >
              {hasPhoto ? "Done" : "Skip for now"}
            </button>
          </div>
        </div>
      )}

      {showStep4Docs && selected && (
        <div className="ds-fyp-create-card">
          <div className="ds-fyp-create-card-head">
            <div className="ds-fyp-create-icon" aria-hidden>
              <FileStack size={22} />
            </div>
            <div>
              <h3 className="ds-fyp-create-title">Upload Required Project Documents</h3>
              <p className="ds-text-secondary" style={{ margin: "6px 0 0", fontSize: 13 }}>
                Step 4 — drag and drop each file type below.
              </p>
            </div>
          </div>
          <FypProjectDocumentsPanel
            project={selected}
            onUpload={handleDocUpload}
            onRemove={handleDocRemove}
          />
          <div className="ds-fyp-form-actions">
            <button
              type="button"
              className="ds-schedule-btn ds-schedule-btn-outline"
              onClick={() => setShowDocsStep(false)}
            >
              Done
            </button>
            <button
              type="button"
              className="ds-schedule-btn ds-schedule-btn-primary"
              onClick={() => {
                setShowDocsStep(false);
                setShowLinksStep(true);
              }}
            >
              Continue to Step 5
            </button>
          </div>
        </div>
      )}

      {showStep5Links && selected && (
        <div className="ds-fyp-create-card">
          <div className="ds-fyp-create-card-head">
            <div className="ds-fyp-create-icon" aria-hidden>
              <Link2 size={22} />
            </div>
            <div>
              <h3 className="ds-fyp-create-title">External Project Links</h3>
              <p className="ds-text-secondary" style={{ margin: "6px 0 0", fontSize: 13 }}>
                Step 5 — links are validated before saving.
              </p>
            </div>
          </div>
          <FypExternalLinksForm
            initial={selected.externalLinks}
            onSubmit={handleLinksSave}
            onCancel={() => setShowLinksStep(false)}
          />
        </div>
      )}

      {showDashboard && profile && selected && (
        <>
          <div className="ds-fyp-project-card ds-fyp-portfolio-card">
            <div className="ds-fyp-portfolio-header">
              {profile.profilePhotoUrl ? (
                <img src={profile.profilePhotoUrl} alt="" className="ds-fyp-portfolio-avatar" />
              ) : (
                <div className="ds-fyp-portfolio-avatar ds-fyp-portfolio-avatar-empty">
                  <UserCircle size={40} strokeWidth={1.5} />
                </div>
              )}
              <div className="ds-fyp-portfolio-header-text">
                <span className="ds-fyp-status-pill">Portfolio profile</span>
                <h3 className="ds-fyp-project-title">{profile.fullName}</h3>
                <p className="ds-text-secondary" style={{ margin: "6px 0 0", fontSize: 13 }}>
                  {profile.registrationNumber} · {profile.email}
                </p>
              </div>
              <div className="ds-fyp-portfolio-header-actions">
                <button
                  type="button"
                  className="ds-schedule-btn ds-schedule-btn-outline"
                  onClick={() => setShowPhotoStep(true)}
                >
                  {hasPhoto ? "Update photo" : "Add photo"}
                </button>
                <button
                  type="button"
                  className="ds-schedule-btn ds-schedule-btn-outline"
                  onClick={() => setShowProfileForm(true)}
                >
                  Edit profile
                </button>
              </div>
            </div>
            <dl className="ds-fyp-meta-grid">
              <div>
                <dt>Phone</dt>
                <dd>{profile.phoneNumber}</dd>
              </div>
              <div>
                <dt>Gender</dt>
                <dd>{genderLabel(profile.gender)}</dd>
              </div>
              <div>
                <dt>Nationality</dt>
                <dd>{profile.nationality}</dd>
              </div>
              <div>
                <dt>Skills</dt>
                <dd>{profile.skills}</dd>
              </div>
            </dl>
            {profile.biography && (
              <div className="ds-fyp-abstract">
                <h4>About</h4>
                <p>{profile.biography}</p>
              </div>
            )}
          </div>

          <div className="ds-fyp-project-card">
            <div className="ds-fyp-project-card-head">
              <div>
                <span className="ds-fyp-status-pill">{selected.status}</span>
                <h3 className="ds-fyp-project-title">{selected.title}</h3>
              </div>
              <div className="ds-fyp-form-actions">
                {selected.status !== "SUBMITTED" && (
                  <button
                    type="button"
                    className="ds-schedule-btn ds-schedule-btn-outline"
                    onClick={async () => {
                      try {
                        if (getAuthToken()) {
                          await submitFyp(selected.id);
                          await load();
                        } else {
                          const updated = { ...selected, status: "SUBMITTED" };
                          updateSelected(updated);
                        }
                        toast.success("Project submitted for review.");

                        if (user) {
                          pushNotification({
                            userId: user.id,
                            type: "submitted",
                            title: "Project Submitted Successfully",
                            body: `Your project "${selected.title}" has been submitted for review.`,
                            fromRole: "student",
                            fromName: user.name,
                          });
                          // Notify Moderator (u3)
                          pushNotification({
                            userId: "u3",
                            type: "review",
                            title: "New FYP Submission Pending Review",
                            body: `Student ${profile?.fullName ?? user.name} has submitted a new project: "${selected.title}".`,
                            fromRole: "student",
                            fromName: profile?.fullName ?? user.name,
                          });
                          // Notify HOD (u4)
                          pushNotification({
                            userId: "u4",
                            type: "review",
                            title: "New Project Submitted",
                            body: `"${selected.title}" has been submitted by ${profile?.fullName ?? user.name} and is awaiting review.`,
                            fromRole: "student",
                            fromName: profile?.fullName ?? user.name,
                          });
                        }
                      } catch (e) {
                        toast.error(e instanceof Error ? e.message : "Submit failed.");
                      }
                    }}
                  >
                    Submit for review
                  </button>
                )}
                <button
                  type="button"
                  className="ds-schedule-btn ds-schedule-btn-outline"
                  onClick={() => handleDelete(selected)}
                >
                  Delete
                </button>
              </div>
            </div>
            <dl className="ds-fyp-meta-grid">
              <div>
                <dt>Department</dt>
                <dd>{selected.department ?? "—"}</dd>
              </div>
              <div>
                <dt>Academic year</dt>
                <dd>{selected.academicYear ?? "—"}</dd>
              </div>
              <div>
                <dt>Supervisor</dt>
                <dd>{selected.supervisorName ?? "—"}</dd>
              </div>
              <div>
                <dt>Research area</dt>
                <dd>{selected.researchArea ?? "—"}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{categoryLabel(selected.projectCategory ?? selected.projectType)}</dd>
              </div>
              <div>
                <dt>Keywords</dt>
                <dd>{selected.keywords || "—"}</dd>
              </div>
            </dl>
            {selected.abstractText && (
              <div className="ds-fyp-abstract">
                <h4>Abstract</h4>
                <p>{selected.abstractText}</p>
              </div>
            )}
          </div>

          {selected.status !== "DRAFT" && (
            <DataCard label="Feedback & Recommendations">
              {(selected as any).recommended && (
                <div 
                  className="ds-recommendation-banner" 
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background: "linear-gradient(135deg, rgba(255, 193, 7, 0.15) 0%, rgba(255, 152, 0, 0.1) 100%)",
                    border: "1px solid rgba(255, 193, 7, 0.3)",
                    padding: "16px",
                    borderRadius: "12px",
                    marginBottom: "20px"
                  }}
                >
                  <div style={{ background: "#ffc107", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "10px" }}>
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h5 style={{ margin: 0, fontWeight: 750, color: "#855800", fontSize: "14px" }}>Recommended for Research Showcase</h5>
                    <p style={{ margin: "4px 0 0", color: "#744210", fontSize: "12px", fontWeight: 550 }}>This project has been nominated by the Moderation Committee for display in the public AUCA Archive Research Showcase!</p>
                  </div>
                </div>
              )}
              {selected.comments && selected.comments.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {selected.comments.map((c) => (
                    <div key={c.id} style={{ display: "flex", gap: "12px", background: "#f8f9fc", padding: "12px 16px", borderRadius: "10px", border: "1px solid #eef0f6" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "50%", background: "#eef0fd", color: "#003566", fontSize: "11px", fontWeight: "bold" }}>
                        {c.user.split(" ").map(w => w[0]).join("").slice(0, 2)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                          <span style={{ fontSize: "12px", fontWeight: "bold", color: "#1a1d2e" }}>{c.user}</span>
                          <span style={{ fontSize: "10px", color: "#8a8fa8", marginLeft: "auto" }}>{c.date}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: "13px", color: "#4e5366", fontStyle: "italic" }}>"{c.text}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="ds-text-secondary" style={{ fontSize: "13px", margin: 0 }}>No comments or feedback logged yet. Your project is awaiting librarian and supervisor moderation.</p>
              )}
            </DataCard>
          )}

          <DataCard label="Project documents">
            <div className="ds-table-toolbar">
              <span className="ds-text-secondary">
                {docTypesCount} of 5 document types uploaded
              </span>
              <button
                type="button"
                className="ds-schedule-btn ds-schedule-btn-primary"
                onClick={() => setShowDocsStep(true)}
              >
                Upload documents
              </button>
            </div>
            <FypProjectDocumentsPanel
              project={selected}
              onUpload={handleDocUpload}
              onRemove={handleDocRemove}
            />
          </DataCard>

          <DataCard label="External links">
            {linkCount > 0 ? (
              <ul className="ds-fyp-links-list">
                {(
                  [
                    ["github", "GitHub"],
                    ["liveDemo", "Live demo"],
                    ["youtube", "YouTube"],
                    ["googleDrive", "Google Drive"],
                    ["portfolio", "Portfolio"],
                  ] as const
                ).map(([key, label]) => {
                  const url = selected.externalLinks?.[key];
                  if (!url) return null;
                  return (
                    <li key={key}>
                      <span className="ds-fyp-link-label">{label}</span>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="ds-fyp-link-url">
                        {url}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="ds-text-secondary" style={{ marginBottom: 12, fontSize: 13 }}>
                No links saved yet.
              </p>
            )}
            <button
              type="button"
              className="ds-schedule-btn ds-schedule-btn-outline"
              onClick={() => setShowLinksStep(true)}
            >
              {linkCount > 0 ? "Edit links" : "Add external links"}
            </button>
          </DataCard>
        </>
      )}

      {profile && !wizardOpen && !selected && !loading && (
        <div className="ds-fyp-create-card">
          <p className="ds-text-secondary" style={{ marginBottom: 14 }}>
            Profile ready. Create your final year project (Step 2).
          </p>
          <button
            type="button"
            className="ds-schedule-btn ds-schedule-btn-primary"
            onClick={() => setShowCreateForm(true)}
          >
            Create Final Year Project
          </button>
        </div>
      )}

      {projects.length > 1 && showDashboard && (
        <DataCard label="All projects">
          <div className="ds-table-wrap">
            <table className="ds-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td>{p.status}</td>
                    <td>
                      <button
                        type="button"
                        className="ds-schedule-btn ds-schedule-btn-outline"
                        style={{ minHeight: 32, padding: "0 12px", fontSize: 12 }}
                        onClick={() => setSelected(p)}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataCard>
      )}
    </div>
  );
}
