import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string | number;
  label: string;
}

interface CustomDropdownProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  dropdownClassName?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
  dropdownClassName = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    
    // Check if there's enough space below, otherwise show above
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Estimate dropdown height (8 options * 40px = 320px max)
      const estimatedDropdownHeight = Math.min(options.length * 40, 320);
      
      if (spaceBelow < estimatedDropdownHeight && spaceAbove > estimatedDropdownHeight) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  };

  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={`
          w-full flex items-center justify-between px-3 py-2 text-sm text-left
          border border-gray-300 rounded-lg bg-white hover:bg-gray-50
          focus:outline-none focus:ring-2 focus:ring-offset-0
          ${isOpen ? 'ring-2' : ''}
          ${className.includes('focus:ring-primary') ? 'focus:ring-primary-500 focus:border-primary-500' : ''}
          ${className.includes('focus:ring-orange') ? 'focus:ring-orange-500 focus:border-orange-500' : ''}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown when clicked outside */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className={`
            absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-xl
            max-h-80 overflow-y-auto overflow-x-hidden
            ${
              dropdownPosition === 'top' 
                ? 'bottom-full mb-1' 
                : 'top-full mt-1'
            }
            ${dropdownClassName}
          `}
            style={{
              minWidth: 'max-content',
              maxHeight: '20rem'
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full px-3 py-2 text-sm text-left hover:bg-gray-100 transition-colors
                  ${value === option.value 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-900'
                  }
                  first:rounded-t-lg last:rounded-b-lg
                  focus:outline-none focus:bg-gray-100
                  min-h-[40px] flex items-center
                `}
                role="option"
                aria-selected={value === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomDropdown;