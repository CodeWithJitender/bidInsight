import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faXmark,
  faCalendarAlt,
  faUsers,
  faHandshake,
  faMapMarkerAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

function FormSelect({
  label,
  name,
  options = [],
  placeholder = "Select an option",
  required = true,
  value = "",
  onChange,
  onBlur,
  message = "",
  messageType = "",
  touched = false,
  dark = true
}) {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  // Check if options match the "contract range" set
  const isContractRange = options.every((opt) =>
    ["upto-75000", "75000-500000", "above-500000"].includes(opt.value)
  );

  // Apply sorting only when NOT contract range
  const sortedOptions = isContractRange
    ? options // keep order as given
    : [...options].sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: "base" })
      );

  const fullOptions = [
    { value: "", label: placeholder },
    ...sortedOptions.filter((opt) => opt.value !== ""),
  ];

  // Filter options based on search term
  const filteredOptions = fullOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [selected, setSelected] = useState(value || "");
  
  // 🔥 FIX: Proper validation logic
  const shouldShowValidation = hasInteracted || touched;
  const hasValue = selected && selected !== "";
  const showError = shouldShowValidation && required && !hasValue;
  const showSuccess = shouldShowValidation && hasValue && !message.includes("required");

  const getIcon = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("year")) return faCalendarAlt;
    if (lower.includes("employee")) return faUsers;
    if (lower.includes("contract")) return faHandshake;
    if (lower.includes("state")) return faMapMarkerAlt;
    return null;
  };

  const iconColor = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("state")) return "text-[#9CA3AF]";
    return "text-gray-400";
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync with parent value
  useEffect(() => {
    setSelected(value || "");
  }, [value]);

  // Update parent on change
  useEffect(() => {
    if (onChange && hasInteracted && selected !== value) {
      onChange({ target: { name, value: selected } });
    }
  }, [selected, hasInteracted]);

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  const handleSelect = (optValue) => {
    setSelected(optValue);
    setIsOpen(false);
    setSearchTerm("");
    setHasInteracted(true);
    
    // Immediately call onChange
    if (onChange) {
      onChange({ target: { name, value: optValue } });
    }
    
    // Call onBlur if provided
    if (onBlur) {
      onBlur({ target: { name, value: optValue } });
    }
  };

  // 🔥 FIX: Dynamic message generation
  const getDisplayMessage = () => {
    // If parent provides message, use it
    if (message && shouldShowValidation) {
      return message;
    }
    
    // Generate our own validation messages
    if (shouldShowValidation) {
      if (required && !hasValue) {
        return "This field is required";
      } else if (hasValue) {
        return "This field is valid";
      }
    }
    
    return "";
  };

  const getDisplayMessageType = () => {
    // If parent provides messageType, use it
    if (messageType && shouldShowValidation) {
      return messageType;
    }
    
    // Generate our own message type
    if (shouldShowValidation) {
      if (required && !hasValue) {
        return "error";
      } else if (hasValue) {
        return "success";
      }
    }
    
    return "";
  };

  const displayMessage = getDisplayMessage();
  const displayMessageType = getDisplayMessageType();
  const isSuccess = displayMessageType === "success";
  const isError = displayMessageType === "error";
  

  return (
    <div
      className="form-field flex flex-col mb-3 w-[100%] md:w-[90%]"
      ref={dropdownRef}
    >
      {/* Label */}
      <label className="form-label font-t mb-2" htmlFor={name}>
        {label}
      </label>

      {/* Custom Dropdown */}
      <div
        className={`relative font-t p-3 py-5 rounded-[20px] border border-gray-300 text-white ${dark ? "text-white" : "text-black"} cursor-pointer`}
        onClick={handleDropdownToggle}
      > 
      
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={getIcon(label)}
              className={`${iconColor(label)}`}
            />
            <span>
              {fullOptions.find((o) => o.value === selected)?.label ||
                placeholder}
            </span>
          </div>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`text-gray-400 transform transition-transform ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>

        {isOpen && (
          <div className="absolute left-0 top-full mt-2 w-full bg-white text-black rounded-lg shadow-lg z-50 overflow-hidden">
            {/* Search Input - Only for State dropdown (more than 10 options) */}
            {options.length > 10 && (
              <div className="p-3 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search states..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            {/* Options List with scrolling */}
            <ul className="max-h-48 overflow-y-auto">
              {filteredOptions.map((opt, i) => (
                <li
                  key={i}
                  className={`flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer ${
                    opt.value === "" ? "text-gray-400" : ""
                  } ${opt.value === selected ? "bg-blue-50" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(opt.value);
                  }}
                >
                  <FontAwesomeIcon
                    icon={getIcon(label)}
                    className={`${iconColor(label)} text-xs`}
                  />
                  {opt.label}
                </li>
              ))}
              {filteredOptions.length === 0 && (
                <li className="p-3 text-gray-500 text-center">
                  No options found
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* 🔥 FIX: Show validation message with proper logic */}
      {displayMessage && (
        <p
          className={`text-sm flex items-center gap-1 mt-0.5 mb-1 ${
            isSuccess ? "text-green-400" : "text-red-400"
          }`}
        >
          <FontAwesomeIcon
            icon={isSuccess ? faCheck : faXmark}
            className={isSuccess ? "text-green-400" : "text-red-400"}
          />
          <span>{displayMessage}</span>
        </p>
      )}
    </div>
  );
}

export default FormSelect;