import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function FormPassword({
  label = "Password",
  placeholder = "e.g. m@rkJos6ph",
  name = "password",
  id = "password",
  delay = 100,
  value = "",
  onChange,
  onBlur,
  message = "",
  messageType = "",
}) {
  const [passToggle, setPassToggle] = useState(false);
  const isSuccess = messageType === "success";

  return (
    <div>
      <div className="form-field flex flex-col mb-2 w-[100%] md:w-[90%]">
        <label className="form-label font-t mb-2" htmlFor={id}>
          {label}
        </label>
        <div className="form-input-box relative">
          <input
            type={passToggle ? "text" : "password"}
            id={id}
            name={name}
            className="form-input font-t p-3 rounded-[20px] bg-transparent w-full"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="off"
          />
          <FontAwesomeIcon
            icon={passToggle ? faEyeSlash : faEye}
            onClick={() => setPassToggle(!passToggle)}
            className="text-white absolute top-[50%] right-4 transform -translate-y-1/2 cursor-pointer"
          />
        </div>
        {message && (
          <p className={`text-sm flex items-center gap-1 mt-0.5 mb-0.5 ${isSuccess ? "text-green-400" : "text-red-400"}`}>
            <FontAwesomeIcon icon={isSuccess ? faCheck : faXmark} className={isSuccess ? "text-green-400" : "text-red-400"} />
            <span>{message}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default FormPassword;
