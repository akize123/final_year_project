interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalItems?: number;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  pageSize = 5,
  totalItems,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="ds-pagination">
      <span className="ds-pagination-info">
        Page {page} of {totalPages}
        {totalItems != null && ` · ${totalItems} items`}
      </span>
      <div className="ds-pagination-actions">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function totalPages(count: number, pageSize: number): number {
  return Math.max(1, Math.ceil(count / pageSize));
}
