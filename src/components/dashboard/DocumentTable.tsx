import { useState } from "react";
import type { DocumentUploadResponse } from "@/api/types";
import { Pagination, paginate, totalPages } from "./Pagination";

function statusBadge(status: string) {
  const s = status?.toUpperCase() ?? "";
  if (s.includes("VERIF") || s === "APPROVED") {
    return <span className="ds-badge ds-badge-success">Verified</span>;
  }
  if (s.includes("REJECT")) {
    return <span className="ds-badge ds-badge-danger">Rejected</span>;
  }
  if (s.includes("PEND")) {
    return <span className="ds-badge ds-badge-warning">Pending</span>;
  }
  return <span className="ds-badge ds-badge-muted">{status || "Uploaded"}</span>;
}

export interface DocumentRow extends DocumentUploadResponse {
  typeLabel?: string;
}

interface DocumentTableProps {
  rows: DocumentRow[];
  loading?: boolean;
  pageSize?: number;
  onPreview?: (id: string) => void;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
  emptyMessage?: string;
}

export function DocumentTable({
  rows,
  loading,
  pageSize = 5,
  onPreview,
  onDownload,
  onDelete,
  emptyMessage = "No documents yet. Use Upload to add your first file.",
}: DocumentTableProps) {
  const [page, setPage] = useState(1);
  const pages = totalPages(rows.length, pageSize);
  const safePage = Math.min(page, pages);
  const visible = paginate(rows, safePage, pageSize);

  if (loading) {
    return <div className="ds-empty">Loading documents…</div>;
  }

  if (!rows.length) {
    return <div className="ds-empty">{emptyMessage}</div>;
  }

  return (
    <>
      <div className="ds-table-wrap ds-table-no-scroll">
        <table className="ds-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Type</th>
              <th>Uploaded</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.documentId}>
                <td>{row.filename}</td>
                <td>{row.typeLabel ?? "—"}</td>
                <td>
                  {row.uploadedAt
                    ? new Date(row.uploadedAt).toLocaleDateString()
                    : "—"}
                </td>
                <td>{statusBadge(row.status)}</td>
                <td>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {onPreview && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => onPreview(row.documentId)}
                      >
                        View
                      </button>
                    )}
                    {onDownload && (
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => onDownload(row.documentId)}
                      >
                        Download
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => onDelete(row.documentId)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        page={safePage}
        totalPages={pages}
        totalItems={rows.length}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </>
  );
}
