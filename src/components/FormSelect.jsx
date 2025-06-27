import React from "react";

function FormSelect({
  label,
  name,
  options = [],
  placeholder = "Select an option",
  delay = 100,
  required = true,
  value = "",
  onChange,
}) {
  return (
    <div
      className="form-field flex flex-col mb-3 w-[100%] md:w-[90%]"
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      <label className="form-label font-t mb-2" htmlFor={name}>
        {label}
      </label>
      <div className="font-t p-3 py-5 rounded-[20px]  border border-gray-300 text-white">
        <select
          id={name}
          name={name}
          required={required}
          className="form-select bg-transparent w-full focus:ring-0"
          value={value}
          onChange={onChange}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt, i) => (
            <option key={i} value={opt.value} className="text-black">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FormSelect;
