import React from "react";

function FormRadio({
  label,
  name,
  value,
  selectedValue,
  selectedValues = [],
  onChange,
  delay = 100,
  type = "radio",
  maxSelected,
}) {
  const isSelected =
    type === "checkbox"
      ? selectedValues.includes(value)
      : selectedValue === value;

  const handleChange = () => {
    if (type === "checkbox") {
      if (isSelected) {
        // allow unselect
        onChange(value);
      } else if (!maxSelected || selectedValues.length < maxSelected) {
        // allow select only if under limit
        onChange(value);
      }
    } else {
      onChange(value);
    }
  };

  return (
    <div
      className={`form-radio flex justify-between items-center mb-3 rounded-[20px] w-[100%] md:w-[90%] p-4 border transition-all duration-300 ${
        isSelected
          ? "bg-gradient-to-r from-[#132EC9] to-[#2D54E7] text-white border-transparent"
          : "bg-transparent text-gray-700 border border-gray-300"
      }`}
    >
      <label
        htmlFor={`${name}-${value}`}
        className="form-label font-t cursor-pointer flex-1 pr-4"
      >
        {label}
      </label>
      <span className="flex items-center">
        <input
          type={type}
          id={`${name}-${value}`}
          name={name}
          value={value}
          checked={isSelected}
          onChange={handleChange}
          className="hidden"
        />
        <span
          className={`w-4 h-4 flex items-center justify-center rounded-full border-2 ${
            isSelected ? "border-white" : "border-gray-400"
          }`}
        >
          {isSelected && (
            <span className="w-2 h-2 bg-white rounded-full"></span>
          )}
        </span>
      </span>
    </div>
  );
}

export default FormRadio;
