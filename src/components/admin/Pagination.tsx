import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import CustomDropdown from '../CustomDropdown';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  itemsPerPageOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  itemsPerPageOptions = [10, 25, 50, 100]
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return (
      <div className="px-4 py-3 bg-white border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="text-sm text-gray-700 text-center sm:text-left">
            <span>
              Showing {startItem} to {endItem} of {totalItems} results
            </span>
          </div>
          {showItemsPerPage && onItemsPerPageChange && (
            <div className="flex items-center justify-center sm:justify-end space-x-2">
              <label className="text-sm text-gray-700 whitespace-nowrap">
                Items per page:
              </label>
              <CustomDropdown
                value={itemsPerPage}
                onChange={(value) => onItemsPerPageChange(Number(value))}
                options={itemsPerPageOptions.map((option) => ({
                  value: option,
                  label: option.toString()
                }))}
                className="min-w-[80px] focus:ring-primary-500"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 bg-white border-t border-gray-200">
      {/* Mobile Layout */}
      <div className="sm:hidden space-y-3">
        {/* Results info */}
        <div className="text-sm text-gray-700 text-center">
          <span>
            Showing {startItem} to {endItem} of {totalItems} results
          </span>
        </div>
        
        {/* Items per page */}
        {showItemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center justify-center space-x-2">
            <label className="text-sm text-gray-700 whitespace-nowrap">
              Items per page:
            </label>
            <CustomDropdown
              value={itemsPerPage}
              onChange={(value) => onItemsPerPageChange(Number(value))}
              options={itemsPerPageOptions.map((option) => ({
                value: option,
                label: option.toString()
              }))}
              className="min-w-[80px] focus:ring-primary-500"
            />
          </div>
        )}
        
        {/* Mobile pagination controls */}
        <div className="flex items-center justify-center space-x-1">
          {/* Previous */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="hidden xs:inline">Prev</span>
          </button>
          
          {/* Current page indicator */}
          <div className="inline-flex items-center px-4 py-2 text-sm font-medium bg-primary-600 text-white border border-primary-600 min-h-[44px]">
            {currentPage} of {totalPages}
          </div>
          
          {/* Next */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            title="Next page"
          >
            <span className="hidden xs:inline">Next</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        {/* Jump to page (for mobile) */}
        {totalPages > 3 && (
          <div className="flex items-center justify-center space-x-2">
            <label className="text-sm text-gray-700 whitespace-nowrap">
              Go to page:
            </label>
            <CustomDropdown
              value={currentPage}
              onChange={(value) => onPageChange(Number(value))}
              options={Array.from({ length: totalPages }, (_, i) => ({
                value: i + 1,
                label: (i + 1).toString()
              }))}
              className="min-w-[80px] focus:ring-primary-500"
            />
          </div>
        )}
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing {startItem} to {endItem} of {totalItems} results
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          {showItemsPerPage && onItemsPerPageChange && (
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-700 whitespace-nowrap">
                Items per page:
              </label>
              <CustomDropdown
                value={itemsPerPage}
                onChange={(value) => onItemsPerPageChange(Number(value))}
                options={itemsPerPageOptions.map((option) => ({
                  value: option,
                  label: option.toString()
                }))}
                className="min-w-[80px] focus:ring-primary-500"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <nav className="flex items-center space-x-1">
              {/* First Page */}
              <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              
              {/* Previous Page */}
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {/* Page Numbers */}
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && onPageChange(page)}
                  disabled={page === '...'}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium border ${
                    page === currentPage
                      ? 'bg-primary-600 text-white border-primary-600'
                      : page === '...'
                      ? 'bg-white text-gray-400 border-gray-300 cursor-default'
                      : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              {/* Next Page */}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              
              {/* Last Page */}
              <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;