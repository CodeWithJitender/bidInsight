// ✅ Final ExtraData.jsx with shared API logic
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import FormHeader from "../components/FormHeader";
import HeroHeading from "../components/HeroHeading";
import FormField from "../components/FormField";
import FormFooter from "../components/FormFooter";
import FormImg from "../components/FormImg";
import ProcessWrapper from "../components/ProcessWrapper";
import SubmissionModal from "../components/SubmissionModal";
import api from "../utils/axios";
import { setSkippedInsurance } from "../redux/onboardingSlice";

function ExtraData() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const insuranceData = useSelector((state) => state.onboarding.insuranceData);
  const skippedInsurance = useSelector((state) => state.onboarding.skippedInsurance);

  const [showModal, setShowModal] = useState(false);
  const [fields, setFields] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Modal show if skipped previously
  useEffect(() => {
    if (skippedInsurance) {
      setShowModal(true);
      dispatch(setSkippedInsurance(false));
    }
  }, [skippedInsurance, dispatch]);

  // Field mapping
  const insuranceFields = {
    workersCompensation: "workersCompensationAmount",
    generalLiability: "generalLiabilityAmount",
    autoLiability: "autoLiabilityAmount",
    medicalProfessional: "medicalProfessionalAmount",
    environmentalInsurance: "environmentAmount",
    cyberInsurance: "cybersecurityAmount",
  };

  // Enabled fields from Redux (only YES ones)
  const enabledKeys = Object.entries(insuranceFields)
    .filter(([key]) => insuranceData[key] === "yes")
    .map(([_, value]) => value);

  // Set blank state for enabled fields only
  useEffect(() => {
    const newState = {};
    enabledKeys.forEach((key) => {
      newState[key] = "";
    });
    setFields(newState);
    setErrors({ ...newState });
    setTouched({ ...newState });
  }, [insuranceData]);

  // ✅ Field Validation
  const validateField = (name, value) => {
    if (!value) return { msg: "This field is required", type: "error" };
    if (!/^[0-9]+$/.test(value))
      return { msg: "Please enter digits", type: "error" };
    return { msg: "This field is valid", type: "success" };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    const { msg } = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const { msg } = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  // ✅ Shared API Submit Logic
  const submitProfile = async () => {
    const insuranceMap = {
      workersCompensationAmount: "workers_compensation_amount",
      generalLiabilityAmount: "general_liability_insurance_amount",
      autoLiabilityAmount: "auto_mobile_liability_insurance_amount",
      medicalProfessionalAmount: "medical_professional_eso_insurance_amount",
      environmentAmount: "enviormental_insurance_amount",
      cybersecurityAmount: "cyber_security_insurance_amount",
    };

    const boolMap = {
      workersCompensation: "workers_compensation",
      generalLiability: "general_liability_insurance",
      autoLiability: "auto_mobile_liability_insurance",
      medicalProfessional: "medical_professional_eso_insurance",
      environmentalInsurance: "enviormental_insurance",
      cyberInsurance: "cyber_security_insurance",
    };

    const payload = {
      region: 1,
      industry: 1,
      states: [1, 5, 6],
    };

    Object.entries(boolMap).forEach(([key, apiKey]) => {
      payload[apiKey] = insuranceData[key] === "yes";
    });

    Object.entries(fields).forEach(([key, val]) => {
      if (val) {
        payload[insuranceMap[key]] = Number(val);
      }
    });

    try {
      const res = await api.post("/auth/profile/", payload);
      console.log("✅ Profile submitted:", res.data);
      navigate("/dashboard");
    } catch (err) {
      if (err.response) {
        alert("API Error: " + JSON.stringify(err.response.data));
      } else {
        alert("Network Error: " + err.message);
      }
    }
  };

  // ✅ Submit button handler
  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    let valid = true;

    Object.keys(fields).forEach((key) => {
      const { msg, type } = validateField(key, fields[key]);
      newErrors[key] = msg;
      if (type !== "success") valid = false;
    });

    setErrors(newErrors);
    setTouched(Object.keys(fields).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (valid) {
      submitProfile();
    }
  };

  // ✅ Modal button handler
  const handleContinue = () => {
    setShowModal(false);
    submitProfile();
  };

  const handleBack = () => navigate("/help-our-ai");
  const handleClose = () => setShowModal(false);

  const data = {
    title: "Extra Data, Maximum Compatibility",
    para: "Your A.I. profile is tuned to score every RFP by how well it fits you.",
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
    activeStep: 5,
  };

  const formFooter = {
    back: { text: "Back", link: "/help-our-ai" },
    next: { text: "Submit", link: "" },
    skip: "",
  };

  return (
    <ProcessWrapper>
      <div className="form-left">
        <div className="pe-3 flex flex-col justify-between h-full">
          <div>
            <FormHeader {...formHeader} />
            <HeroHeading data={data} />
          </div>

          <form
            className="form-container flex flex-col h-full justify-between"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-4">
              {enabledKeys.map((key, index) => (
                <FormField
                  key={key}
                  label={key.replace(/([A-Z])/g, " $1").trim() + " (amount)"}
                  name={key}
                  type="text"
                  placeholder="e.g. Value"
                  delay={index * 100}
                  value={fields[key] || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  message={touched[key] && errors[key] ? errors[key] : ""}
                  messageType={
                    touched[key] && errors[key] === "This field is valid"
                      ? "success"
                      : touched[key] && errors[key]
                      ? "error"
                      : ""
                  }
                />
              ))}
            </div>

            <FormFooter data={formFooter} />
          </form>
        </div>
      </div>

      <div className="sticky top-0">
        <FormImg src="login-img.png" />
      </div>

      {showModal && (
        <SubmissionModal
          onBack={handleBack}
          onContinue={handleContinue} // ✅ Shared submit call
          onClose={handleClose}
        />
      )}
    </ProcessWrapper>
  );
}

export default ExtraData;
