import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { DataCard } from "@/components/dashboard/DataCard";
import { DocumentUploadForm } from "@/components/dashboard/DocumentUploadForm";
import { DocumentUploadDialog } from "@/components/dashboard/DocumentUploadDialog";
import type { FypResponse } from "@/api/types";
import { listFyp, createFyp, uploadFypDoc, submitFyp, deleteFyp } from "@/api/student/fyp";
import { getAuthToken } from "@/lib/auth-token";
import { toast } from "sonner";

export default function FinalYearProjectPage() {
  const [projects, setProjects] = useState<FypResponse[]>([]);
  const [selected, setSelected] = useState<FypResponse | null>(null);
  const [docType, setDocType] = useState<"thesis" | "report" | "code-archive">("thesis");
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const load = useCallback(async () => {
    if (!getAuthToken()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const list = await listFyp();
      setProjects(list);
      setSelected(list[0] ?? null);
    } catch {
      setProjects([]);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="ds-page-scroll">
      <PageHeader
        title="Final Year Project"
        subtitle="Thesis, report, code archive, and submission status"
      />

      <div className="ds-kpi-grid">
        <KpiCard label="Projects" value={projects.length} />
        <KpiCard
          label="Status"
          value={selected?.status ?? "—"}
        />
        <KpiCard
          label="GitHub"
          value={selected?.githubConnected ? "Connected" : "Not linked"}
        />
      </div>

      {!projects.length && !loading && (
        <div className="ds-form-actions" style={{ marginBottom: 20 }}>
          <button type="button" className="btn btn-primary" onClick={() => setCreateOpen(true)}>
            Create Final Year Project
          </button>
        </div>
      )}

      {selected && (
        <>
          <div className="ds-card" style={{ marginBottom: 24 }}>
            <h3 className="ds-section-heading">{selected.title}</h3>
            <p className="ds-text-secondary" style={{ marginBottom: 12 }}>
              Status: {selected.status}
              {selected.hasThesis && " · Thesis uploaded"}
              {selected.hasReport && " · Report uploaded"}
              {selected.hasCodeArchive && " · Code archive uploaded"}
            </p>
            <div className="ds-form-actions">
              {selected.status !== "SUBMITTED" && (
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={async () => {
                    try {
                      await submitFyp(selected.id);
                      toast.success("Project submitted for review.");
                      load();
                    } catch (e) {
                      toast.error(e instanceof Error ? e.message : "Submit failed.");
                    }
                  }}
                >
                  Submit for Review
                </button>
              )}
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={async () => {
                  if (!confirm("Delete this project record?")) return;
                  await deleteFyp(selected.id);
                  toast.success("Project deleted.");
                  load();
                }}
              >
                Delete Project
              </button>
            </div>
          </div>

          <DataCard label="Project Files">
            <div className="ds-table-toolbar">
              <span className="ds-text-secondary">Thesis, report, and code archive</span>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setUploadOpen(true)}>
                Upload
              </button>
            </div>
            <div className="ds-table-wrap">
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>File Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Thesis</td>
                    <td>{selected.hasThesis ? "Uploaded" : "Missing"}</td>
                  </tr>
                  <tr>
                    <td>Report</td>
                    <td>{selected.hasReport ? "Uploaded" : "Missing"}</td>
                  </tr>
                  <tr>
                    <td>Code Archive</td>
                    <td>{selected.hasCodeArchive ? "Uploaded" : "Missing"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </DataCard>
        </>
      )}

      <DocumentUploadDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Final Year Project"
        fileRequired={false}
        showFileZone={false}
        submitLabel="Create Project"
        fields={[
          { name: "title", label: "Project Title", type: "text", required: true },
          { name: "abstractText", label: "Abstract", type: "textarea" },
          { name: "keywords", label: "Keywords", type: "text" },
          { name: "department", label: "Department", type: "text" },
          { name: "academicYear", label: "Academic Year", type: "text" },
        ]}
        onSubmit={async (_file, values) => {
          if (getAuthToken()) {
            const created = await createFyp({
              title: values.title,
              abstractText: values.abstractText,
              keywords: values.keywords,
              department: values.department,
              academicYear: values.academicYear,
            });
            setSelected(created);
            await load();
          }
          toast.success("Project created.");
        }}
      />

      <DocumentUploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload Project File"
        extraContent={
          <div className="ds-form-group">
            <label className="ds-form-label">File type</label>
            <select
              className="ds-form-select"
              value={docType}
              onChange={(e) => setDocType(e.target.value as typeof docType)}
            >
              <option value="thesis">Thesis</option>
              <option value="report">Project Report</option>
              <option value="code-archive">Code Archive</option>
            </select>
          </div>
        }
        onSubmit={async (file) => {
          if (!file || !selected) return;
          await uploadFypDoc(selected.id, docType, file);
          toast.success("File uploaded.");
          load();
        }}
      />

      {projects.length > 1 && (
        <DataCard label="All Projects">
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
                        className="btn btn-primary btn-sm"
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
