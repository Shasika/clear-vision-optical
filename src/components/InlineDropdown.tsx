import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string | number;
  label: string;
}

interface InlineDropdownProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
}

const InlineDropdown: React.FC<InlineDropdownProps> = ({
  value,
  onChange,
  options,
  className = "",
  buttonClassName = "",
  dropdownClassName = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
          inline-flex items-center justify-between text-xs font-medium rounded-full px-3 py-1
          hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
          min-w-[100px] max-w-[140px]
          ${buttonClassName}
          ${isOpen ? 'ring-2 ring-blue-500' : ''}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate mr-1">
          {selectedOption ? selectedOption.label : 'Select...'}
        </span>
        <ChevronDown 
          className={`h-3 w-3 transition-transform flex-shrink-0 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className={`
          absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg
          min-w-[140px] max-h-48 overflow-auto left-0
          ${dropdownClassName}
        `}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`
                w-full px-3 py-2 text-sm text-left hover:bg-gray-100
                ${value === option.value 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-gray-900'
                }
                first:rounded-t-lg last:rounded-b-lg
                focus:outline-none focus:bg-gray-100
              `}
              role="option"
              aria-selected={value === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InlineDropdown;