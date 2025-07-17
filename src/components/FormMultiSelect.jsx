import React from "react";
import Select from "react-select";

function FormMultiSelect({
  label,
  name,
  options = [],
  placeholder = "Select an option",
  required = true,
  value = [],
  onChange,
}) {
  // Handler to restrict max 10 selections
  const handleChange = (selectedOptions) => {
    if (selectedOptions.length <= 10) {
      onChange(selectedOptions);
    }
  };

  return (
    <div className="form-field flex flex-col mb-3 w-full md:w-[90%]">
      <label htmlFor={name} className="form-label font-t my-5 text-white">
        {label}
      </label>
      <Select
        isMulti
        name={name}
        options={options}
        className="basic-multi-select font-t rounded-[20px] border border-gray-300 text-white bg-transparent"
        classNamePrefix="select"
        placeholder={placeholder}
        // required={required}
        value={value}
        onChange={handleChange}
        menuPlacement="top"
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "20px",
            padding: "10px 12px",
            borderColor: "white",
            background: "transparent",
            color: "white",
            width: "100%",
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused
              ? "#d1d1d1"
              : state.isSelected
              ? "white"
              : "white",
            color: "black",
            cursor: "pointer",
            position: "relative",
            zIndex: "10",
          }),
        }}
      />
      {value.length >= 10 && (
        <p className="text-red-400 text-sm mt-2 font-semibold">
          You can select up to 10 industries only.
        </p>
      )}
    </div>
  );
}

export default FormMultiSelect;
