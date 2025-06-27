import React, { useState } from "react";

function FormPassword({
  label = "Password",
  placeholder = "e.g. m@rkJos6ph",
  name = "password",
  id = "password",
  delay = 100,
  value,
  onChange,
}) {
  const [passToggle, setPassToggle] = useState(false);

  return (
    <div>
      <div
        className="form-field flex flex-col mb-4 w-full"
        data-aos="fade-up"
        data-aos-delay={delay}
      >
        <label className="form-label font-t mb-2 text-white" htmlFor={id}>
          {label}
        </label>

        <div className="relative w-[70%]">
          <input
            type={passToggle ? "text" : "password"}
            id={id}
            name={name}
            className="form-input font-t h-14 rounded-[13px] bg-transparent border border-gray-300 text-white w-full pr-10 focus:outline-none"
            required
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
          <i
            className={`far absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-white text-lg ${
              passToggle ? "fa-eye-slash" : "fa-eye"
            }`}
            onClick={() => setPassToggle(!passToggle)}
          ></i>
        </div>
      </div>
    </div>
  );
}

export default FormPassword;
