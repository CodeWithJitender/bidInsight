import React from "react";

function FormField({ label, type = "text", name, placeholder, delay = 100, value, onChange }) {
  const getValidationProps = (type) => {
    switch (type) {
      case "email":
        return {
          pattern: "[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$", // fixed hyphen placement
          title: "Please enter a valid email address.",
        };
      case "phone":
        return {
          pattern: "[0-9]{10}",
          inputMode: "numeric",
          title: "Please enter a 10-digit phone number.",
          maxLength: 10,
        };
      case "text":
        return {
          minLength: 2,
          maxLength: 50,
          title: "Text should be 2–50 characters.",
        };
      default:
        return {};
    }
  };

  const validationProps = getValidationProps(type);

  return (
    <div
      className="form-field flex flex-col mb-4 w-full"
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      <label className="form-label font-t mb-2 text-white" htmlFor={name}>
        {label}
      </label>
      <input
        type={type === "phone" ? "text" : type}
        id={name}
        name={name}
        placeholder={placeholder}
        required
        value={value}
        onChange={onChange}
        className="form-input font-t rounded-[13px] bg-transparent border h-14 border-gray-300 text-white focus:outline-none w-[70%]"
        {...validationProps}
      />
    </div>
  );
}

export default FormField;
