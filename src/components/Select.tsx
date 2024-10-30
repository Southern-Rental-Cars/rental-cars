import { useState, useEffect, useRef } from 'react';

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  displayValue?: (value: string) => string;
}

export default function CustomSelect({
  options,
  selectedValue,
  onSelect,
  placeholder = "Select...",
  buttonClassName = "",
  dropdownClassName = "",
  displayValue = (value) =>
    options.find((option) => option.value === value)?.label || placeholder,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape key press
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        ref={buttonRef}
        className={`w-full border border-gray-300 rounded-lg p-2 text-left text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 ${buttonClassName}`}
      >
        {displayValue(selectedValue)}
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-labelledby="select-label"
          className={`absolute right-0 mt-2 w-full ${dropdownClassName} bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10`}
        >
          <ul className="py-1">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  role="option"
                  aria-selected={selectedValue === option.value}
                  onClick={() => {
                    onSelect(option.value);
                    setIsOpen(false);
                    buttonRef.current?.focus(); // Return focus to the button
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                    selectedValue === option.value ? 'bg-gray-100' : ''
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
