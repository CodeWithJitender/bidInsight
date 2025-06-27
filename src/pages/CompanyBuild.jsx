import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FormHeader from "../components/FormHeader";
import HeroHeading from "../components/HeroHeading";
import FormField from "../components/FormField";
import FormPassword from "../components/FormPassword";
import FormFooter from "../components/FormFooter";
import { Link } from "react-router-dom";
import FormSelect from "../components/FormSelect";

function CompanyBuild() {
  // Local state for company form
  const [companyData, setCompanyData] = useState({
    companyName: "",
    companyFienOrSsn: "",
    companyWebsite: "",
    yearInBusiness: "",
    numberOfEmployees: "",
    state: "",
    targetContractSize: "",
    upload: null,
  });

  const [stateOptions, setStateOptions] = useState([]);
  const registerData = useSelector((state) => state.register.userData);

  useEffect(() => {
    fetch("http://82.112.234.104:8001/api/auth/states/")
      .then((res) => res.json())
      .then((data) => {
        const options = Array.isArray(data)
          ? data.map((item) =>
              typeof item === "object"
                ? { value: item.id || item.pk || item.code, label: item.name }
                : { value: item, label: item }
            )
          : [];
        setStateOptions(options);
      })
      .catch(() => {
        setStateOptions([]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setCompanyData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Map frontend fields to backend fields, ensure state and year_in_business are integers
    const mapped = {
      full_name: registerData.fullName,
      email: registerData.email,
      password: registerData.password,
      company_name: companyData.companyName,
      fein_or_ssn_number: companyData.companyFienOrSsn,
      company_website: companyData.companyWebsite,
      year_in_business: companyData.yearInBusiness ? parseInt(companyData.yearInBusiness, 10) : "",
      no_of_employees: companyData.numberOfEmployees,
      state: companyData.state ? parseInt(companyData.state, 10) : "",
      target_contract_size: companyData.targetContractSize,
      // capability_statement will be handled below
    };

    const formDataToSend = new FormData();
    Object.entries(mapped).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formDataToSend.append(key, value);
      }
    });
    // File field
    if (companyData.upload) {
      formDataToSend.append("capability_statement", companyData.upload, companyData.upload.name);
    }

    try {
      const response = await fetch("http://82.112.234.104:8001/api/auth/signup/", {
        method: "POST",
        body: formDataToSend,
      });
      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        result = text;
      }
      console.log("Signup API response:", result);
      alert("API Response: " + (typeof result === 'string' ? result : JSON.stringify(result)));
    } catch (error) {
      console.error("Signup API error:", error);
      alert("Signup API error: " + error);
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
      link: "/geographic-coverage",
    },
    skip: {
      text: "Skip",
      link: "/geographic-coverage",
    },
  };
  return (
    <div className="login bg-blue w-screen px-5 md:px-10">
      <div className="container-fixed">
        <div className="form-container py-10 h-screen grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="form-left flex flex-col justify-between">
            <div className="pe-3">
              <FormHeader {...formHeader} />
              <HeroHeading data={data} />
              <form
                onSubmit={handleSubmit}
                className="flex flex-col h-full justify-between max-h-[100%]"
              >
                <div>
                  <FormField
                    label="Company name"
                    type="text"
                    name="companyName"
                    placeholder="e.g. BidInsight "
                    delay={100}
                    value={companyData.companyName}
                    onChange={handleChange}
                  />
                  <FormField
                    label="Company FIEN or SSN"
                    type="text"
                    name="companyFienOrSsn"
                    placeholder="e.g. XX-XXXXXXX"
                    delay={100}
                    value={companyData.companyFienOrSsn}
                    onChange={handleChange}
                  />
                  <FormField
                    label="Company website"
                    type="text"
                    name="companyWebsite"
                    placeholder="e.g. www.mark-jospeh.com"
                    delay={100}
                    value={companyData.companyWebsite}
                    onChange={handleChange}
                  />
                  <div className="flex flex-col md:flex-row w-full md:w-[90%] gap-4">
                    <FormSelect
                      label="Year in business"
                      name="yearInBusiness"
                      options={[
                        { value: 1, label: "1-3" },
                        { value: 4, label: "4-7" },
                        { value: 8, label: "8+" },
                      ]}
                      delay={100}
                      value={companyData.yearInBusiness}
                      onChange={handleChange}
                    />
                    <FormSelect
                      label="No. of employees"
                      name="numberOfEmployees"
                      options={[
                        { value: "1-10", label: "1 to 10" },
                        { value: "11-50", label: "11 to 50" },
                        { value: "50+", label: "50+" },
                      ]}
                      delay={100}
                      value={companyData.numberOfEmployees}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row w-full md:w-[90%] gap-4 mt-4">
                    <FormSelect
                      label="State"
                      name="state"
                      options={stateOptions}
                      delay={100}
                      value={companyData.state}
                      onChange={handleChange}
                    />
                    <FormSelect
                      label="Target contract size"
                      name="targetContractSize"
                      options={[
                        { value: "upto-75000", label: "Up to $75,000" },
                        { value: "75000-500000", label: "$75,000 to $500,000" },
                        { value: "above-500000", label: "Above $500,000" },
                      ]}
                      delay={100}
                      value={companyData.targetContractSize}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    className="form-field flex flex-col mb-3 w-full md:w-[90%]"
                    data-aos="fade-up"
                    data-aos-delay={100}
                  >
                    <div className="form-label font-t mb-2" htmlFor="upload">
                      Capability Statement
                    </div>
                    <label
                      className="form-input font-t p-3 rounded-[20px] text-center flex justify-center gap-2 text-[#E2E2E2] bg-transparent border border-gray-300 focus:ring-0"
                      htmlFor="upload"
                    >
                      <span> Upload the file </span>
                      <img src="upload.svg" alt="" />
                    </label>
                    <input
                      type="file"
                      id="upload"
                      name="upload"
                      placeholder="Upload your capability statement"
                      accept=".pdf,.doc,.docx"
                      required
                      className="form-input font-t p-3 rounded-[20px] bg-transparent border border-gray-300 focus:ring-0 opacity-0 absolute pointer-events-none"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="text-white font-t mt-2">
                    <b>NOTE:</b> The capability statement is essential for building your company’s profile, as providing comprehensive information is crucial to achieving optimal AI results
                  </div>
                </div>
                <FormFooter data={formFooter} />
              </form>
            </div>
          </div>
          <div className="form-right hidden lg:block overflow-hidden rounded-[50px]">
            <div className="form-img flex items-center justify-center ">
              <img src="/compang-build.png" className="max-h-full" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyBuild;
