import React, { useState, useRef, useEffect } from "react";

interface LookupOption {
  id: number;
  name: string;
}

interface LookupFieldProps {
  label: string;
  value: string;
  options: LookupOption[];
  onChange: (value: string, id?: number) => void;
  onAddNew: () => void;
  placeholder?: string;
  required?: boolean;
}

const LookupField: React.FC<LookupFieldProps> = ({
  label,
  value,
  options,
  onChange,
  onAddNew,
  placeholder = "Select or type to search...",
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onChange(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleOptionSelect = (option: LookupOption) => {
    setSearchTerm(option.name);
    onChange(option.name, option.id);
    setIsOpen(false);
  };

  const handleAddNew = () => {
    onAddNew();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block mb-1 font-medium text-white">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white pr-10"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            {isOpen ? (
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            )}
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-zinc-800 border border-zinc-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            <ul className="py-1">
              {filteredOptions.map((option) => (
                <li
                  key={option.id}
                  className="px-3 py-2 hover:bg-zinc-700 cursor-pointer"
                  onClick={() => handleOptionSelect(option)}
                >
                  {option.name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-zinc-400">No matches found</div>
          )}
          <div className="border-t border-zinc-700 p-2">
            <button
              type="button"
              onClick={handleAddNew}
              className="w-full text-left px-3 py-2 text-green-500 hover:bg-zinc-700 rounded flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add new {label.toLowerCase()}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LookupField;
