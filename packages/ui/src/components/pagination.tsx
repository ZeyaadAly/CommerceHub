'use client';

import { Button } from './button.js';

export function Pagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}) {
  if (
    !Number.isSafeInteger(page) ||
    !Number.isSafeInteger(totalPages) ||
    page < 1 ||
    page > totalPages
  ) {
    throw new RangeError('Pagination requires a valid current page and total page count.');
  }
  return (
    <nav className="ch-pagination" aria-label="Pagination">
      <Button
        variant="outline"
        size="compact"
        disabled={disabled || page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span aria-current="page">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="compact"
        disabled={disabled || page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}
