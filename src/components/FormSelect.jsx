import React from "react";

function FormSelect({
  label,
  name,
  options = [],
  placeholder = "Select an option",
  delay = 100,
  required = true,
}) {
  return (
    <div
      className="form-field flex flex-col mb-3 max-w-[540px] w-full"
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      <label className="form-label font-t mb-2" htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        className="form-select font-t p-3 py-5 rounded-[20px] bg-transparent border border-gray-300 text-white focus:ring-0"
      >
        <option value=""  disabled selected>
          {placeholder}
        </option>
        {options.map((opt, i) => (
          <option key={i} value={opt.value} className="text-black">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FormSelect;
