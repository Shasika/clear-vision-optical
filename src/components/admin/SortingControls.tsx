import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import type { SortConfig, SortOption } from '../../hooks/useSorting';

interface SortingControlsProps<T> {
  sortConfig: SortConfig<T>;
  sortOptions: SortOption<T>[];
  onSortKeyChange: (key: keyof T) => void;
  onSortOrderToggle: () => void;
  className?: string;
}

function SortingControls<T>({
  sortConfig,
  sortOptions,
  onSortKeyChange,
  onSortOrderToggle,
  className = ""
}: SortingControlsProps<T>) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <ArrowUpDown className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-600">Sort:</span>
      </div>
      
      <select
        value={String(sortConfig.key)}
        onChange={(e) => {
          const selectedOption = sortOptions.find(opt => String(opt.key) === e.target.value);
          if (selectedOption) {
            onSortKeyChange(selectedOption.key);
          }
        }}
        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
      >
        {sortOptions.map((option) => (
          <option key={String(option.key)} value={String(option.key)}>
            {option.label}
          </option>
        ))}
      </select>
      
      <button
        onClick={onSortOrderToggle}
        className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        title={`Sort ${sortConfig.direction === 'asc' ? 'descending' : 'ascending'}`}
      >
        {sortConfig.direction === 'asc' ? (
          <ChevronUp className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-600" />
        )}
      </button>
    </div>
  );
}

export default SortingControls;