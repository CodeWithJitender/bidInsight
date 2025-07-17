import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import FormHeader from "../components/FormHeader";
import HeroHeading from "../components/HeroHeading";
import FormField from "../components/FormField";
import FormPassword from "../components/FormPassword";
import FormFooter from "../components/FormFooter";
import { Link } from "react-router-dom";
import FormImg from "../components/FormImg";
import ProcessWrapper from "../components/ProcessWrapper";

function Register() {
  const [fields, setFields] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });


  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [checkboxMessage, setCheckboxMessage] = useState("");
  const [checkboxMessageType, setCheckboxMessageType] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordChecks = [
    { test: (v) => v.length >= 8, message: "At least 8 characters" },
    { test: (v) => /[A-Z]/.test(v), message: "At least one uppercase letter" },
    { test: (v) => /[a-z]/.test(v), message: "At least one lowercase letter" },
    { test: (v) => /[0-9]/.test(v), message: "At least one number" },
    { test: (v) => /[^A-Za-z0-9]/.test(v), message: "At least one special character" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let msg = "";
    if (!value) {
      msg = "This field is required";
    } else {
      if (name === "email") {
        msg = emailRegex.test(value) ? "Email is valid" : "Enter a valid email";
      } else if (name === "password") {
        for (let i = 0; i < passwordChecks.length; i++) {
          if (!passwordChecks[i].test(value)) {
            msg = passwordChecks[i].message;
            break;
          }
        }
        if (!msg) msg = "Password is strong";
      } else if (name === "confirmPassword") {
        msg = value === fields.password ? "Password matched" : "Passwords do not match";
      } else if (name === "fullName") {
        msg = value.length > 1 ? "Full Name is valid" : "This field is required";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const allFieldsValid =
    errors.fullName === "Full Name is valid" &&
    errors.email === "Email is valid" &&
    errors.password === "Password is strong" &&
    errors.confirmPassword === "Password matched" &&
    fields.fullName && fields.email && fields.password && fields.confirmPassword;

  const checkboxDisabled = !allFieldsValid;

  const handleCheckboxChange = (e) => {
    setCheckboxChecked(e.target.checked);
    // Remove all messages when checked, only show error if not checked and required
    if (!e.target.checked) {
      setCheckboxMessage("Please accept all terms");
      setCheckboxMessageType("error");
    } else {
      setCheckboxMessage("");
      setCheckboxMessageType("");
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    let newTouched = { ...touched };
    let newErrors = { ...errors };
    let valid = true;
    Object.keys(fields).forEach((key) => {
      newTouched[key] = true;
      if (!fields[key]) {
        newErrors[key] = "This field is required";
        valid = false;
      } else {
        validateField(key, fields[key]);
        if (
          (key === "email" && !emailRegex.test(fields[key])) ||
          (key === "password" && passwordChecks.some((c) => !c.test(fields[key]))) ||
          (key === "confirmPassword" && fields[key] !== fields.password)
        ) {
          valid = false;
        }
      }
    });
    setTouched(newTouched);
    setErrors(newErrors);
    if (valid && !checkboxChecked) {
      setCheckboxMessage("Please accept all terms");
      setCheckboxMessageType("error");
      return;
    }
    if (valid && checkboxChecked) {
      setCheckboxMessage("");
      setCheckboxMessageType("");
      // Log all field values after all fields are filled and valid
      console.log("Register fields:", fields);
      navigate("/company-build", { state: { fullName: fields.fullName, email: fields.email, password: fields.password } });
    } else {
      setCheckboxMessage("");
      setCheckboxMessageType("");
    }
  };

  const data = {
    title: "Ready to Win More Contracts?",
    para: "All government bids. One dashboard. Zero hassles.",
    btnText: false,
    btnLink: false,
    container: "max-w-4xl mx-auto text-left",
    headingSize: "h3",
    pSize: "text-xl",
  };

  const formHeader = {
    title: "Log In",
    link: "/login",
    steps: 6,
    activeStep: 0,
  };

  const formFooter = {
    back: {
      text: "Back",
      link: "/login",
    },
    next: {
      text: "Next",
      link: "/company-build",
    },
    skip: {
      text: "",
      link: "",
    },
  };

  return (
    <ProcessWrapper>
      <div className="form-left">
        <div className="pe-3 flex flex-col justify-between h-full">
          <div>
            <FormHeader {...formHeader} />
            <HeroHeading data={data} />
          </div>

          <form className="form-container flex flex-col h-full justify-between">
            <div>
              {/* Full Name */}
              <FormField
                label="Full Name"
                type="text"
                name="fullName"
                placeholder="e.g. John Doe"
                delay={100}
                value={fields.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                message={
                  touched.fullName && errors.fullName ? (
                    <span className={`flex items-center gap-1 mt-0.5 mb-1 ${errors.fullName === 'Full Name is valid' ? 'text-green-400' : 'text-red-400'}`}>
                      <i className={`fa-solid ${errors.fullName === 'Full Name is valid' ? 'fa-circle-check text-green-400' : 'fa-xmark text-red-400'}`}></i>
                      <span>{errors.fullName}</span>
                    </span>
                  ) : ""
                }
                messageType={
                  touched.fullName && errors.fullName === "Full Name is valid"
                    ? "success"
                    : touched.fullName && errors.fullName
                    ? "error"
                    : ""
                }
              />

              {/* Email */}
              <FormField
                label="Email"
                type="email"
                name="email"
                placeholder="e.g. jopseph.mark12@gmail.com"
                delay={100}
                value={fields.email}
                onChange={handleChange}
                onBlur={handleBlur}
                message={
                  touched.email && errors.email ? (
                    <span className={`flex items-center gap-1 mt-0.5 mb-1 ${errors.email === 'Email is valid' ? 'text-green-400' : 'text-red-400'}`}>
                      <i className={`fa-solid ${errors.email === 'Email is valid' ? 'fa-circle-check text-green-400' : 'fa-xmark text-red-400'}`}></i>
                      <span>{errors.email}</span>
                    </span>
                  ) : ""
                }
                messageType={
                  touched.email && errors.email === "Email is valid"
                    ? "success"
                    : touched.email && errors.email
                    ? "error"
                    : ""
                }
              />

              {/* Password */}
              <FormPassword
                label="Password"
                placeholder="e.g. m@rkJos6ph"
                name="password"
                id="password"
                delay={100}
                value={fields.password}
                onChange={handleChange}
                onBlur={handleBlur}
                message={
                  touched.password && errors.password ? (
                    <span className={`flex items-center gap-1 mt-0.5 mb-1 ${errors.password === 'Password is strong' ? 'text-green-400' : 'text-red-400'}`}>
                      <i className={`fa-solid ${errors.password === 'Password is strong' ? 'fa-circle-check text-green-400' : 'fa-xmark text-red-400'}`}></i>
                      <span>{errors.password}</span>
                    </span>
                  ) : ""
                }
                messageType={
                  touched.password && errors.password === "Password is strong"
                    ? "success"
                    : touched.password && errors.password
                    ? "error"
                    : ""
                }
              />

              {/* Confirm Password */}
              <FormPassword
                label="Confirm password"
                placeholder="e.g. m@rkJos6ph"
                name="confirmPassword"
                id="confirmPassword"
                delay={100}
                value={fields.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                message={
                  touched.confirmPassword && errors.confirmPassword ? (
                    <span className={`flex items-center gap-1 mt-0.5 mb-1 ${errors.confirmPassword === 'Password matched' ? 'text-green-400' : 'text-red-400'}`}>
                      <i className={`fa-solid ${errors.confirmPassword === 'Password matched' ? 'fa-circle-check text-green-400' : 'fa-xmark text-red-400'}`}></i>
                      <span>{errors.confirmPassword}</span>
                    </span>
                  ) : ""
                }
                messageType={
                  touched.confirmPassword && errors.confirmPassword === "Password matched"
                    ? "success"
                    : touched.confirmPassword && errors.confirmPassword
                    ? "error"
                    : ""
                }
              />
            </div>

            <div>
              <div className="accept">
                <label className="text-white font-t font-normal">
                  <input
                    type="checkbox"
                    className="mr-2"
                    disabled={checkboxDisabled}
                    checked={checkboxChecked}
                    onChange={handleCheckboxChange}
                  />
                  I accept the&nbsp;
                  <Link className="underline" to="/policy">Privacy Policy</Link>,&nbsp;
                  <Link className="underline" to="/terms">T&C</Link>,&nbsp;
                  <Link className="underline" to="/member-terms">Member Terms</Link>,&nbsp;
                  <Link className="underline" to="/disclaimer">Disclaimer</Link>.
                </label>

                {checkboxMessage && (
                  <p className={`text-sm flex items-center gap-1 mt-0.5 mb-1 ${checkboxMessageType === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    <i className={`fa-solid ${checkboxMessageType === 'success' ? 'fa-circle-check text-green-400' : 'fa-xmark text-red-400'}`}></i>
                    <span>{checkboxMessage}</span>
                  </p>
                )}
              </div>
              <FormFooter data={formFooter} onNextClick={handleNext} />
            </div>
          </form>
        </div>
      </div>
      <div className="sticky top-0">
        <FormImg src={"login-img.png"} />
      </div>
    </ProcessWrapper>
  );
}

export default Register;
