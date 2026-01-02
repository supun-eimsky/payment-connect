import { useState, useCallback } from "react";

export function usePagination(initialLimit: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);
  const offset = (currentPage - 1) * limit;

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
    setTotal(0);
  }, []);

  return {
    currentPage,
    limit,
    offset,
    total,
    totalPages,
    setTotal,
    goToPage,
    nextPage,
    prevPage,
    resetPagination,
  };
}