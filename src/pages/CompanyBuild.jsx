import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux"; // <-- Add this
import FormHeader from "../components/FormHeader";
import HeroHeading from "../components/HeroHeading";
import FormField from "../components/FormField";
import FormPassword from "../components/FormPassword";
import FormFooter from "../components/FormFooter";
import { Link } from "react-router-dom";
import FormSelect from "../components/FormSelect";
import FormImg from "../components/FormImg";
import ProcessWrapper from "../components/ProcessWrapper";
import api from "../utils/axios"; // <-- Import your custom axios instance


function CompanyBuild() {
  // Redux se user data lo
  const { fullName, email } = useSelector((state) => state.register.userData);
  // Password navigate state se lo
  const location = useLocation();
  const password = location.state?.password || "";

  // Company fields
  const [fields, setFields] = useState({
    companyName: "",
    companyFienOrSsn: "",
    companyWebsite: "",
    yearInBusiness: "",
    numberOfEmployees: "",
    state: "",
    targetContractSize: "",
    upload: null,
  });

  const [touched, setTouched] = useState({
    companyName: false,
    companyFienOrSsn: false,
    companyWebsite: false,
    yearInBusiness: false,
    numberOfEmployees: false,
    state: false,
    targetContractSize: false,
    upload: false,
  });
  const [errors, setErrors] = useState({
    companyName: "",
    companyFienOrSsn: "",
    companyWebsite: "",
    yearInBusiness: "",
    numberOfEmployees: "",
    state: "",
    targetContractSize: "",
    upload: "",
  });
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate(); // <-- Add this
  const uploadRef = useRef(null); // <-- Add this

  // Validation rules
  const validateField = (name, value) => {
    let msg = "";
    let type = "error";
    if (!value || (name === "upload" && !value)) {
      if (name === "upload") {
        msg = "Please upload a file";
      } else {
        msg = "This field is required";
      }
    } else {
      if (name === "companyWebsite") {
        // Allow http(s)://, www., or plain domain like abc.com
        const urlRegex = /^(https?:\/\/)?(www\.)?([\w-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;
        msg = urlRegex.test(value)
          ? "Website is valid"
          : "Enter a valid url";
        type = urlRegex.test(value) ? "success" : "error";
      } else if (name === "upload") {
        if (value && value.name) {
          msg = `${value.name} is uploaded`;
          type = "success";
        } else {
          msg = "Please upload a file";
          type = "error";
        }
      } else if (["yearInBusiness", "numberOfEmployees", "state", "targetContractSize"].includes(name)) {
        msg = "This field is selected";
        type = "success";
      } else {
        msg = "This field is valid";
        type = "success";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: msg }));
    return type;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type: inputType, files } = e.target;
    let val = inputType === "file" ? files[0] : value;
    setFields((prev) => ({ ...prev, [name]: val }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, val);
  };

  // On blur, mark as touched
  const handleBlur = (e) => {
    const { name, value, type: inputType, files } = e.target;
    let val = inputType === "file" ? files[0] : value;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, val);
  };

  // Get messageType for icon coloring
  const getMessageType = (name) => {
    if (!touched[name]) return "";
    if (name === "companyWebsite") {
      // Use the same regex as above for consistency
      const urlRegex = /^(https?:\/\/)?(www\.)?([\w-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;
      return urlRegex.test(fields[name]) ? "success" : "error";
    }
    if (name === "upload") {
      // If file is selected and has a name, return success
      return fields.upload && fields.upload.name ? "success" : "error";
    }
    if (["yearInBusiness", "numberOfEmployees", "state", "targetContractSize"].includes(name)) {
      return errors[name] === "This field is selected" ? "success" : "error";
    }
    return errors[name] === "This field is valid" || errors[name] === "Website is valid" ? "success" : "error";
  };

  // On Next click
  const handleNext = async (e) => {
    e.preventDefault();
    setEmailError("");
    let newTouched = { ...touched };
    let newErrors = { ...errors };
    let valid = true;

    Object.keys(fields).forEach((key) => {
      newTouched[key] = true;

      if ((!fields[key] && key !== "upload") || (key === "upload" && !uploadRef.current.files[0])) {
        if (key === "upload") {
          newErrors[key] = "Please upload a file";
        } else {
          newErrors[key] = "This field is required";
        }
        valid = false;
      } else {
        if (key === "companyWebsite") {
          const urlRegex = /^(https?:\/\/)?(www\.)?([\w-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;
          if (!urlRegex.test(fields[key])) {
            newErrors[key] = "Enter a valid website URL (must start with http:// or https://)";
            valid = false;
          } else {
            newErrors[key] = "Website is valid";
          }
        } else if (["yearInBusiness", "numberOfEmployees", "state", "targetContractSize"].includes(key)) {
          newErrors[key] = "This field is selected";
        } else {
          newErrors[key] = "This field is valid";
        }
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);

    if (valid) {
      // Use fields.upload for the file
      const signupData = {
        full_name: fullName,
        email: email,
        password: password,
        company_name: fields.companyName,
        fein_or_ssn_number: fields.companyFienOrSsn,
        company_website: fields.companyWebsite,
        year_in_business: fields.yearInBusiness,
        no_of_employees: fields.numberOfEmployees,
        state: fields.state,
        target_contract_size: fields.targetContractSize,
      };
      const formData = new FormData();
      Object.entries(signupData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      if (fields.upload) {
        formData.append("capability_statement", fields.upload); // <-- backend expects this
      }
      try {
        const res = await api.post("/auth/signup/", formData);
        console.log("Signup API Response:", res);
        // Pass OTP to verification page if present in response
        let otp = res.data && res.data.otp ? res.data.otp : null;
        if ((res.status === 200 || res.status === 201) && otp) {
          navigate("/verification", { state: { email, otp } });
        } else if (res.status === 200 || res.status === 201) {
          navigate("/verification", { state: { email } });
        } else {
          alert("Signup failed");
        }
      } catch (err) {
        // Check for email already registered error
        if (
          err.response &&
          err.response.status === 400 &&
          err.response.data &&
          (String(err.response.data.email).toLowerCase().includes("already") ||
            String(err.response.data.detail).toLowerCase().includes("already"))
        ) {
          setEmailError("Email is already registered. Please login.");
        } else {
          alert("Network error");
        }
      }
    }
  };


  const data = {
    title: "Lorem ipsum dolor sit ",
    para: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ",
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
    activeStep: 1,
  };
  const formFooter = {
    back: {
      text: "Back",
      link: "/register",
    },
    next: {
      text: "Next",
      link: "/verification",
    },
    skip: null,
  };
  return (
    <ProcessWrapper>
      <div className="form-left">
        <div className="pe-3 flex flex-col justify-between h-full">
          <div className="">
            <FormHeader {...formHeader} />

            <HeroHeading data={data} />
          </div>

          <form
            action=""
            method="post"
            className="forn-container flex flex-col  h-full justify-between max-h-[100%]"
          >
            <div className="">
              <FormField
                label="Company name"
                type="text"
                name="companyName"
                placeholder="e.g. BidInsight "
                delay={100}
                value={fields.companyName}
                onChange={handleChange}
                onBlur={handleBlur}
                message={touched.companyName || errors.companyName ? errors.companyName : ""}
                messageType={getMessageType("companyName")}
              />
              <FormField
                label="Company FIEN or SSN"
                type="text"
                name="companyFienOrSsn"
                placeholder="e.g. XX-XXXXXXX"
                delay={100}
                value={fields.companyFienOrSsn}
                onChange={handleChange}
                onBlur={handleBlur}
                message={touched.companyFienOrSsn || errors.companyFienOrSsn ? errors.companyFienOrSsn : ""}
                messageType={getMessageType("companyFienOrSsn")}
              />
              <FormField
                label="Company website"
                type="text"
                name="companyWebsite"
                placeholder="e.g. www.mark-jospeh.com"
                delay={100}
                value={fields.companyWebsite}
                onChange={handleChange}
                onBlur={handleBlur}
                message={touched.companyWebsite || errors.companyWebsite ? errors.companyWebsite : ""}
                messageType={getMessageType("companyWebsite")}
              />
              <div className="flex w-[100%] md:w-[90%] gap-4">
                <FormSelect
                  label="Year in business"
                  name="yearInBusiness"
                  value={fields.yearInBusiness}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={[
                    { value: 1, label: "1-3" },
                    { value: 4, label: "4-7" },
                    { value: 8, label: "8+" },
                  ]}
                  delay={100}
                  message={touched.yearInBusiness || errors.yearInBusiness ? errors.yearInBusiness : ""}
                  messageType={getMessageType("yearInBusiness")}
                />
                <FormSelect
                  label="No. of employees"
                  name="numberOfEmployees"
                  value={fields.numberOfEmployees}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={[
                    { value: "1-10", label: "1 to 10" },
                    { value: "11-50", label: "11 to 50" },
                    { value: "50+", label: "50+" },
                  ]}
                  delay={100}
                  message={touched.numberOfEmployees || errors.numberOfEmployees ? errors.numberOfEmployees : ""}
                  messageType={getMessageType("numberOfEmployees")}
                />
              </div>
              <div className="flex w-[100%] md:w-[90%] gap-4">
                <FormSelect
                  label="State"
                  name="state"
                  value={fields.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={[
                    { value: "1", label: "California" },
                  ]}
                  delay={100}
                  message={touched.state || errors.state ? errors.state : ""}
                  messageType={getMessageType("state")}
                />
                <FormSelect
                  label="Target contract size"
                  name="targetContractSize"
                  value={fields.targetContractSize}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={[
                    { value: "upto-75000", label: "Up to $75,000" },
                    { value: "75000-500000", label: "$75,000 to $500,000" },
                    { value: "above-500000", label: "Above $500,000" },
                  ]}
                  delay={100}
                  message={touched.targetContractSize || errors.targetContractSize ? errors.targetContractSize : ""}
                  messageType={getMessageType("targetContractSize")}
                />
              </div>


              <div className="form-field flex flex-col mb-2 w-[100%] md:w-[90%]">
                <label className="form-label font-t mb-2" htmlFor="upload">
                  Capability Statement
                </label>
                <label
                  htmlFor="upload"
                  className="form-input font-t p-3 rounded-[20px] text-center flex justify-center gap-2 text-[#E2E2E2] bg-transparent border border-gray-300 focus:ring-0 cursor-pointer"
                >
                  Upload the file
                  <img src="upload.svg" alt="upload" />
                </label>
                <input
                  type="file"
                  id="upload"
                  name="upload" // <-- must match state key
                  ref={uploadRef}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  accept=".pdf,.doc,.docx"
                  className="opacity-0 absolute pointer-events-none"
                />

                {touched.upload && errors.upload && (
                  <p
                    className={`text-sm flex items-center gap-1 mt-1 mb-1 ${getMessageType("upload") === "success" ? "text-green-400" : "text-red-400"
                      }`}
                  >
                    {getMessageType("upload") === "success" ? (
                      <span className="flex items-center">
                        <i className="fal fa-check text-green-400"></i>
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <i class="fal fa-times text-red-400"></i>
                      </span>
                    )}
                    <span>{errors.upload}</span>
                  </p>
                )}
              </div>


              <div className="text-white font-t">
                <b>NOTE:</b> The capability statement is essential for building
                your company's profile, as providing comprehensive information
                is crucial to achieving optimal AI results
              </div>
              {emailError && (
                <div className="text-red-400 font-t mt-2 text-base flex items-center gap-2">
                  <i className="fa-solid fa-xmark text-red-400"></i>
                  {emailError} <a href="/login" className="underline text-red-400 ml-2">Login</a>
                </div>
              )}
            </div>

            <div className="">
              <FormFooter data={formFooter} onNextClick={handleNext} />
            </div>
          </form>
        </div>
      </div>
      <div className="sticky top-0">
        <FormImg src={"compang-build.png"} />
      </div>
    </ProcessWrapper>
  );
}

export default CompanyBuild;