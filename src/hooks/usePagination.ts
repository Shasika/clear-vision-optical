import { useState, useMemo } from 'react';

export interface PaginationConfig {
  initialPage?: number;
  initialItemsPerPage?: number;
  itemsPerPageOptions?: number[];
}

export interface PaginationResult<T> {
  // Pagination state
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  
  // Paginated data
  paginatedData: T[];
  
  // Controls
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  
  // Pagination info
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function usePagination<T>(
  data: T[],
  config: PaginationConfig = {}
): PaginationResult<T> {
  const {
    initialPage = 1,
    initialItemsPerPage = 10,
  } = config;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Auto-adjust current page if it exceeds total pages
  const validCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const paginatedData = useMemo(() => {
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  const hasNextPage = validCurrentPage < totalPages;
  const hasPreviousPage = validCurrentPage > 1;

  const handleSetCurrentPage = (page: number) => {
    const validPage = Math.min(Math.max(1, page), Math.max(1, totalPages));
    setCurrentPage(validPage);
  };

  const handleSetItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    // Adjust current page to maintain roughly the same position
    const currentFirstItem = (validCurrentPage - 1) * itemsPerPage + 1;
    const newPage = Math.ceil(currentFirstItem / newItemsPerPage);
    setCurrentPage(Math.max(1, newPage));
  };

  const goToFirstPage = () => handleSetCurrentPage(1);
  const goToLastPage = () => handleSetCurrentPage(totalPages);
  const goToNextPage = () => {
    if (hasNextPage) {
      handleSetCurrentPage(validCurrentPage + 1);
    }
  };
  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      handleSetCurrentPage(validCurrentPage - 1);
    }
  };

  return {
    currentPage: validCurrentPage,
    itemsPerPage,
    totalItems,
    totalPages: Math.max(1, totalPages),
    paginatedData,
    setCurrentPage: handleSetCurrentPage,
    setItemsPerPage: handleSetItemsPerPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
  };
}

export default usePagination;