import React from "react";

function FormRadio2({
  label,
  name,
  value,
  selectedValue,
  onChange,
  delay = 100,
}) {
  const isSelected = selectedValue === value;

  // Handle click on label with toggle logic
  const handleLabelClick = (e) => {
    e.preventDefault(); // Prevent default label behavior
    
    if (isSelected) {
      // Deselect if already selected
      onChange(null);
    } else {
      // Select if not selected
      onChange(value);
    }
  };

  return (
    <label
      htmlFor={`${name}-${value}`}
      className={`form-radio block cursor-pointer rounded-[20px] w-[100%] md:w-[90%] p-4 mb-3 transition-all duration-300 border ${
        isSelected
          ? "bg-gradient-to-r from-[#132EC9] to-[#2D54E7] text-white border-transparent"
          : "bg-transparent text-white border-gray-300"
      }`}
      onClick={handleLabelClick}
    >
      <div className="text-end">
        <input
          type="radio"an
          id={`${name}-${value}`}
          name={name}
          value={value}
          checked={isSelected}
          onChange={() => {}} // Empty, parent handles it
          className="sr-only" // Hide input
        />
      </div>
      <div className="font-t text-left md:mt-20">{label}</div>
    </label>
  );
}

export default FormRadio2;