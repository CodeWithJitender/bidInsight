import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

function FormField({
  label,
  type = "text",
  name,
  placeholder,
  delay = 100,
  value = "",
  onChange = () => {},
  onBlur,
  message = "",
  messageType = "",
}) {
  const isSuccess = messageType === "success";

  return (
    <div className="form-field flex flex-col mb-3 w-[100%] md:w-[90%]">
      <label className="form-label font-t mb-2" htmlFor={name}>
        {label}
      </label>
      <input
        type={type === "phone" ? "text" : type}
        id={name}
        name={name}
        placeholder={placeholder}
        className="form-input font-t p-3 rounded-[20px] bg-transparent border border-gray-300 focus:ring-0"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete="off"
      />
      {message && (
        <p className={`text-sm flex items-center gap-1 mt-0.5 mb-1 ${isSuccess ? "text-green-400" : "text-red-400"}`}>
          <FontAwesomeIcon icon={isSuccess ? faCheck : faXmark} className={isSuccess ? "text-green-400" : "text-red-400"} />
          <span>{message}</span>
        </p>
      )}
    </div>
  );
}

export default FormField;
