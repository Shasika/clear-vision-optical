import { useState, useMemo } from 'react';

export type SortOrder = 'asc' | 'desc';

export interface SortConfig<T> {
  key: keyof T;
  direction: SortOrder;
}

export interface SortOption<T> {
  key: keyof T;
  label: string;
  type?: 'string' | 'number' | 'date' | 'boolean';
  getValue?: (item: T) => any;
}

export interface UseSortingConfig<T> {
  initialSortKey?: keyof T;
  initialSortOrder?: SortOrder;
  sortOptions: SortOption<T>[];
}

export interface UseSortingResult<T> {
  sortConfig: SortConfig<T>;
  sortedData: T[];
  setSortKey: (key: keyof T) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSortOrder: () => void;
  sortBy: (key: keyof T) => void;
  sortOptions: SortOption<T>[];
}

export function useSorting<T>(
  data: T[],
  config: UseSortingConfig<T>
): UseSortingResult<T> {
  const {
    initialSortKey = config.sortOptions[0]?.key,
    initialSortOrder = 'asc',
    sortOptions
  } = config;

  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: initialSortKey,
    direction: initialSortOrder
  });

  const sortedData = useMemo(() => {
    const sortableItems = [...data];
    
    if (!sortConfig.key) return sortableItems;

    const sortOption = sortOptions.find(option => option.key === sortConfig.key);
    
    sortableItems.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortOption?.getValue) {
        aValue = sortOption.getValue(a);
        bValue = sortOption.getValue(b);
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Sort based on type
      const sortType = sortOption?.type || 'string';
      let comparison = 0;

      switch (sortType) {
        case 'string':
          const aStr = String(aValue).toLowerCase();
          const bStr = String(bValue).toLowerCase();
          comparison = aStr.localeCompare(bStr);
          break;
        
        case 'number':
          const aNum = Number(aValue);
          const bNum = Number(bValue);
          comparison = aNum - bNum;
          break;
        
        case 'date':
          const aDate = new Date(aValue).getTime();
          const bDate = new Date(bValue).getTime();
          comparison = aDate - bDate;
          break;
        
        case 'boolean':
          const aBool = Boolean(aValue);
          const bBool = Boolean(bValue);
          comparison = aBool === bBool ? 0 : aBool ? 1 : -1;
          break;
        
        default:
          // Default string comparison
          comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return sortableItems;
  }, [data, sortConfig, sortOptions]);

  const setSortKey = (key: keyof T) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const setSortOrder = (direction: SortOrder) => {
    setSortConfig(current => ({ ...current, direction }));
  };

  const toggleSortOrder = () => {
    setSortConfig(current => ({
      ...current,
      direction: current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortBy = (key: keyof T) => {
    setSortKey(key);
  };

  return {
    sortConfig,
    sortedData,
    setSortKey,
    setSortOrder,
    toggleSortOrder,
    sortBy,
    sortOptions
  };
}

export default useSorting;