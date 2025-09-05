import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import type { SortConfig, SortOrder } from '../../hooks/useSorting';

interface SortableTableHeaderProps<T> {
  label: string;
  sortKey: keyof T;
  sortConfig: SortConfig<T>;
  onSort: (key: keyof T) => void;
  className?: string;
}

function SortableTableHeader<T>({
  label,
  sortKey,
  sortConfig,
  onSort,
  className = ""
}: SortableTableHeaderProps<T>) {
  const isActive = sortConfig.key === sortKey;
  const direction = sortConfig.direction;

  const getSortIcon = () => {
    if (!isActive) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    }
    
    return direction === 'asc' 
      ? <ChevronUp className="h-4 w-4 text-primary-600" />
      : <ChevronDown className="h-4 w-4 text-primary-600" />;
  };

  return (
    <th 
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none ${className}`}
      onClick={() => onSort(sortKey)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSort(sortKey);
        }
      }}
    >
      <div className="flex items-center justify-between group">
        <span className={isActive ? 'text-primary-600 font-semibold' : ''}>{label}</span>
        <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {getSortIcon()}
        </span>
      </div>
    </th>
  );
}

export default SortableTableHeader;