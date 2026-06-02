import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataCard } from "@/components/dashboard/DataCard";
import { DocumentUploadDialog } from "@/components/dashboard/DocumentUploadDialog";
import { Pagination, paginate, totalPages } from "@/components/dashboard/Pagination";
import { mockPersonalProjects } from "@/data/student-documents-mock";
import { toast } from "sonner";

const STORAGE_KEY = "auca_student_personal_projects";
const PAGE_SIZE = 5;

type Project = (typeof mockPersonalProjects)[0];

function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return mockPersonalProjects;
}

export default function StudentProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(loadProjects);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pages = totalPages(projects.length, PAGE_SIZE);
  const visible = paginate(projects, page, PAGE_SIZE);

  const persist = (list: Project[]) => {
    setProjects(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  return (
    <div className="ds-page-frame">
      <PageHeader
        title="Personal Projects"
        subtitle="Portfolio projects outside your final year submission"
      />

      <DataCard label="Your Projects">
        <div className="ds-table-toolbar">
          <span className="ds-text-secondary">{projects.length} project(s)</span>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setUploadOpen(true)}>
            Add Project
          </button>
        </div>
        {projects.length === 0 ? (
          <div className="ds-empty">No personal projects yet.</div>
        ) : (
          <div className="ds-table-wrap">
            <table className="ds-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Technologies</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.title}</strong>
                      <p className="ds-text-secondary" style={{ margin: "4px 0 0" }}>
                        {p.description}
                      </p>
                    </td>
                    <td>{p.tech}</td>
                    <td>{p.updatedAt}</td>
                    <td>
                      {p.link && (
                        <a href={p.link} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ marginRight: 8 }}>
                          View
                        </a>
                      )}
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => persist(projects.filter((x) => x.id !== p.id))}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {projects.length > 0 && (
          <Pagination
            page={page}
            totalPages={pages}
            totalItems={projects.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        )}
      </DataCard>

      <DocumentUploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Add Personal Project"
        fileRequired={false}
        showFileZone={true}
        submitLabel="Save Project"
        fields={[
          { name: "title", label: "Project Title", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea", required: true },
          { name: "tech", label: "Technologies", type: "text", placeholder: "React, Node.js" },
          { name: "link", label: "Link (optional)", type: "text", placeholder: "https://github.com/..." },
        ]}
        onSubmit={async (file, values) => {
          persist([
            {
              id: `pp-${Date.now()}`,
              title: values.title,
              description: values.description,
              tech: values.tech,
              link: values.link,
              updatedAt: new Date().toISOString().slice(0, 10),
            },
            ...projects,
          ]);
          if (file) toast.message(`Attachment "${file.name}" noted for future upload.`);
        }}
      />
    </div>
  );
}
