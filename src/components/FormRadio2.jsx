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

  return (
    <label
      htmlFor={`${name}-${value}`}
      className={`form-radio block cursor-pointer rounded-[20px] w-[100%] md:w-[90%] p-4 mb-3 transition-all duration-300 border ${
        isSelected
          ? "bg-gradient-to-r from-[#132EC9] to-[#2D54E7] text-white border-transparent"
          : "bg-transparent text-white border-gray-300"
      }`}
    >
      <div className="text-end">
        <input
        type="radio"
        id={`${name}-${value}`}
        name={name}
        value={value}
        checked={isSelected}
        onChange={onChange}
        // className="sr-only"
      />
      </div>
      <div className="font-t text-left mt-20">{label}</div>
    </label>
  );
}

export default FormRadio2;
