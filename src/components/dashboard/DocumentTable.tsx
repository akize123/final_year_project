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
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.documentId}>
                <td>
                  <span className="ds-doc-filename" title={row.filename}>
                    📄 {row.filename}
                  </span>
                </td>
                <td>{row.typeLabel ?? "—"}</td>
                <td>
                  {row.uploadedAt
                    ? new Date(row.uploadedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </td>
                <td>{statusBadge(row.status)}</td>
                <td>
                  <div className="ds-action-group">
                    {onPreview && (
                      <button
                        type="button"
                        className="ds-action-btn ds-action-view"
                        title="View document (opens PDF)"
                        onClick={() => onPreview(row.documentId)}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        View
                      </button>
                    )}
                    {onDownload && (
                      <button
                        type="button"
                        className="ds-action-btn ds-action-download"
                        title="Download document"
                        onClick={() => onDownload(row.documentId)}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        className="ds-action-btn ds-action-delete"
                        title="Delete document"
                        onClick={() => onDelete(row.documentId)}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4h6v2" />
                        </svg>
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
