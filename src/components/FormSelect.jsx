import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

function FormSelect({
  label,
  name,
  options = [],
  placeholder = "Select an option",
  delay = 100,
  required = true,
  value = "",
  onChange,
  onBlur,
  message = "",
  messageType = ""
}) {
  const isSuccess = messageType === "success";
  const isError = messageType === "error";

  return (
    <div className="form-field flex flex-col mb-3 w-[100%] md:w-[90%]">
      {/* Label */}
      <label className="form-label font-t mb-2" htmlFor={name}>
        {label}
      </label>

      {/* Select Input */}
      <div className="font-t p-3 py-5 rounded-[20px] border border-gray-300 text-white">
        <select
          id={name}
          name={name}
          required={required}
          className="form-select bg-transparent w-full focus:ring-0"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
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

      {/* Validation Message */}
      {message && (
        <p
          className={`text-sm flex items-center gap-1 mt-0.5 mb-1 ${
            isSuccess ? "text-green-400" : "text-red-400"
          }`}
        >
          <FontAwesomeIcon
            icon={isSuccess ? faCheck : faXmark}
            className={isSuccess ? "text-green-400" : "text-red-400"}
          />
          <span>{message}</span>
        </p>
      )}
    </div>
  );
}

export default FormSelect;
