import React, { useEffect, useState, useMemo } from "react";
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
import { clearInsuranceData, clearOnboardingData, setSkippedInsurance, setAllNoInsurance } from "../redux/reducer/onboardingSlice";

function ExtraData() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const insuranceData = useSelector((state) => state.onboarding.insuranceData);
  const skippedInsurance = useSelector((state) => state.onboarding.skippedInsurance);
  const allNoInsurance = useSelector((state) => state.onboarding.allNoInsurance);
  const onboardingData = useSelector((state) => state.onboarding);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [showAllNoModal, setShowAllNoModal] = useState(false);
  const [isSkipMode, setIsSkipMode] = useState(false);
  const [fields, setFields] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});


  // Field mapping with proper labels
  const insuranceFields = {
    workersCompensation: {
      fieldName: "workersCompensationAmount",
      label: "Workers Compensation Amount"
    },
    generalLiability: {
      fieldName: "generalLiabilityAmount",
      label: "General Liability Insurance Amount"
    },
    autoLiability: {
      fieldName: "autoLiabilityAmount",
      label: "Automobile Liability Insurance Amount"
    },
    medicalProfessional: {
      fieldName: "medicalProfessionalAmount",
      label: "Medical/Professional/ESO Liability Insurance Amount"
    },
    environmentalInsurance: {
      fieldName: "environmentAmount",
      label: "Environmental Insurance Amount"
    },
    cyberInsurance: {
      fieldName: "cybersecurityAmount",
      label: "Cybersecurity Insurance Amount"
    },
  };

  // ✅ All possible fields with their labels
  const allPossibleFields = useMemo(() => {
    return Object.values(insuranceFields);
  }, []);

  // ✅ Get enabled fields based on user selections (only "yes" fields)
  const enabledFields = useMemo(() => {
    if (isSkipMode || !insuranceData || allNoInsurance) {
      return [];
    }
    return Object.entries(insuranceFields)
      .filter(([key]) => insuranceData[key] === "yes")
      .map(([_, config]) => config.fieldName);
  }, [insuranceData, isSkipMode, allNoInsurance]);

  // ✅ Setup initial fields - show all but only validate enabled ones
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("onboardingForm");
      if (saved) {
        const parsed = JSON.parse(saved);
        const extra = parsed.extraData || {};

        const restoredFields = {};
        const restoredErrors = {};
        const restoredTouched = {};

        allPossibleFields.forEach((config) => {
          restoredFields[config.fieldName] = extra[config.fieldName] || "";
          restoredErrors[config.fieldName] = "";
          restoredTouched[config.fieldName] = false;
        });

        setFields(restoredFields);
        setErrors(restoredErrors);
        setTouched(restoredTouched);

        console.log("📦 ExtraData restored from sessionStorage:", extra);
      }
    } catch (err) {
      console.error("❌ Failed to load extraData:", err);
    }
  }, [allPossibleFields]);

  useEffect(() => {
    try {
      const prev = JSON.parse(sessionStorage.getItem("onboardingForm")) || {};
      const updated = {
        ...prev,
        extraData: fields,
      };
      sessionStorage.setItem("onboardingForm", JSON.stringify(updated));
      console.log("💾 ExtraData saved to sessionStorage:", fields);
    } catch (err) {
      console.error("❌ Failed to save extraData:", err);
    }
  }, [fields]);

  // ✅ Handle different incoming states
  useEffect(() => {
    if (skippedInsurance) {
      // Skip button clicked - show modal with blur background
      setShowSkipModal(true);
      setIsSkipMode(true);
      dispatch(setSkippedInsurance(false));
    } else if (allNoInsurance) {
      // All "No" selected - direct modal for submission
      setShowAllNoModal(true);
      dispatch(setAllNoInsurance(false));
    }
  }, [skippedInsurance, allNoInsurance, dispatch]);

  const validateField = (name, value) => {
    if (!value || value.trim() === "") {
      return { msg: "This field is required", type: "error" };
    }
    if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(value)) {
      return { msg: "Please enter a valid amount (numbers only)", type: "error" };
    }
    if (parseFloat(value) <= 0) {
      return { msg: "Amount must be greater than 0", type: "error" };
    }
    return { msg: "This field is valid", type: "success" };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Only allow changes to enabled fields
    if (!enabledFields.includes(name) && !isSkipMode) {
      return;
    }

    setFields((prev) => ({ ...prev, [name]: value }));

    // Only validate enabled fields
    if (enabledFields.includes(name)) {
      const validation = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: validation.msg }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Only process blur for enabled fields
    if (!enabledFields.includes(name) && !isSkipMode) {
      return;
    }

    setTouched((prev) => ({ ...prev, [name]: true }));

    if (enabledFields.includes(name)) {
      const validation = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: validation.msg }));
    }
  };

  const submitProfile = async () => {

    console.log("🔥 Full onboardingDataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa:", onboardingData);
    console.log("🔥 geographicCoverage:", onboardingData.geographicCoverage);
    console.log("🔥 industryCategory:", onboardingData.industryCategory);

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
      region: onboardingData.geographicCoverage.region,  // ✅ Direct number access
        industry: Array.isArray(onboardingData.industryCategory)
    ? onboardingData.industryCategory[0] || null
    : onboardingData.industryCategory,
      states: onboardingData.geographicCoverage.states || []  // ✅ Already correct
    };

    // ✅ Handle different modes
    if (isSkipMode || showAllNoModal) {
      // Skip mode or All "No" - set all to false/default
      Object.entries(boolMap).forEach(([key, apiKey]) => {
        payload[apiKey] = false;
      });
    } else {
      // Normal mode - use actual selections
      Object.entries(boolMap).forEach(([key, apiKey]) => {
        payload[apiKey] = insuranceData?.[key] === "yes";
      });

      // Only add amounts for enabled fields with values
      Object.entries(fields).forEach(([key, val]) => {
        if (val && enabledFields.includes(key) && parseFloat(val) > 0) {
          payload[insuranceMap[key]] = parseFloat(val);
        }
      });
    }

    console.log(payload, "🚀 Submitting profile payload");
     console.log("Payload as JSON:", JSON.stringify(payload, null, 2));
    console.log("Content-Type:", typeof payload);

    try {
      const res = await api.post("/auth/profile/", payload);
      console.log("✅ Profile submitted:", res.data);

      // Clear session data
      sessionStorage.removeItem("onboardingForm");
      sessionStorage.removeItem("ttlStartTime");
      dispatch(setSkippedInsurance(false));
      dispatch(setAllNoInsurance(false));
      dispatch(clearOnboardingData());

      navigate("/dashboard");
    } catch (err) {
      const message = err.response ? JSON.stringify(err.response.data) : err.message;
      console.error("API Error:", message);
      alert("Submission failed: " + message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Skip mode or all "No" mein direct submit
    if (isSkipMode || showAllNoModal) {
      submitProfile();
      return;
    }

    // Validate only enabled fields
    let isValid = true;
    const newErrors = { ...errors };
    const newTouched = { ...touched };

    enabledFields.forEach((fieldName) => {
      const validation = validateField(fieldName, fields[fieldName]);
      newErrors[fieldName] = validation.msg;
      newTouched[fieldName] = true;

      if (validation.type !== "success") {
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(newTouched);

    if (isValid) {
      submitProfile();
    }
  };

  // ✅ Skip functionality - show modal with blur background
  const handleSkip = () => {
    setShowSkipModal(true);
    setIsSkipMode(true);
  };

  // ✅ Modal handlers for skip case
  const handleSkipConfirm = () => {
    setShowSkipModal(false);
    submitProfile();
  };

  const handleSkipCancel = () => {
    dispatch(clearInsuranceData());
    setShowSkipModal(false);
    setIsSkipMode(false);
    navigate("/help-our-ai");
  };

  // ✅ Modal handlers for "All No" case
  const handleAllNoConfirm = () => {
    setShowAllNoModal(false);
    submitProfile();
  };

  const handleAllNoCancel = () => {
    dispatch(clearInsuranceData());
    setShowAllNoModal(false);
    navigate("/help-our-ai");
  };

  const handleBack = () => {
    navigate("/help-our-ai");
  };

  // ✅ Get only enabled field configs for rendering
  const getEnabledFieldsToRender = useMemo(() => {
    if (isSkipMode) {
      // Skip mode - show all fields for background effect
      return allPossibleFields;
    } else if (showAllNoModal) {
      // All No mode - show all fields disabled
      return allPossibleFields;
    } else {
      // Normal mode - show only enabled fields
      return allPossibleFields.filter((config) =>
        enabledFields.includes(config.fieldName)
      );
    }
  }, [allPossibleFields, enabledFields, isSkipMode, showAllNoModal]);

  // ✅ Enhanced helper function to get field properties
  const getFieldProps = (config, index) => {
    const { fieldName, label } = config;
    const isEnabled = enabledFields.includes(fieldName);
    const isFieldTouched = touched[fieldName];
    const fieldError = errors[fieldName];

    // Base properties for all fields
    const baseProps = {
      key: fieldName,
      label: label,
      name: fieldName,
      type: "text",
      delay: index * 100,
      value: fields[fieldName] || "",
    };

    if (isSkipMode) {
      // Skip mode - show all fields disabled in background
      return {
        ...baseProps,
        disabled: true,
        readOnly: true,
        placeholder: "Skipped - No input required",
        message: "This step was skipped",
        messageType: "info",
        className: "opacity-40 cursor-not-allowed pointer-events-none bg-gray-100 transition-all duration-200",
        tabIndex: -1,
      };
    } else if (showAllNoModal) {
      // All No mode - all fields disabled
      return {
        ...baseProps,
        disabled: true,
        readOnly: true,
        placeholder: "All insurance types marked as 'No'",
        message: "No insurance coverage selected",
        messageType: "info",
        className: "opacity-40 cursor-not-allowed pointer-events-none bg-gray-100 transition-all duration-200",
        tabIndex: -1,
      };
    }

    if (isEnabled) {
      // Enabled field - normal interactive behavior
      return {
        ...baseProps,
        placeholder: "Enter amount (e.g., 50000)",
        onChange: handleChange,
        onBlur: handleBlur,
        message: isFieldTouched && fieldError ? fieldError : "",
        messageType: isFieldTouched && fieldError === "This field is valid"
          ? "success"
          : isFieldTouched && fieldError
            ? "error"
            : "",
        className: "transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
      };
    } else {
      // This should not be reached in normal mode since we filter fields
      return {
        ...baseProps,
        disabled: true,
        readOnly: true,
        placeholder: "Not selected in previous step",
        message: "This insurance type was not selected",
        messageType: "info",
        className: "opacity-30 cursor-not-allowed pointer-events-none bg-gray-100 transition-all duration-200",
        onChange: () => { },
        onBlur: () => { },
        onFocus: () => { },
        onClick: () => { },
        tabIndex: -1,
      };
    }
  };

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
    next: { text: (isSkipMode || showAllNoModal) ? "Continue" : "Submit", link: "" },
    skip: (isSkipMode || showAllNoModal) ? "" : "Skip this step",
  };

  return (
    <ProcessWrapper>
      <div className="form-left">
        <div className="pe-3 flex flex-col h-full">
          <div>
            <FormHeader {...formHeader} />
            <HeroHeading data={data} />
          </div>

          {/* ✅ Form container with conditional overlay effects */}
          <div className={`relative h-full ${(showSkipModal || showAllNoModal) ? 'overflow-hidden' : ''} `}>
            <form
              className={`form-container flex flex-col h-full justify-between transition-opacity duration-300 ${(showSkipModal || showAllNoModal) ? 'opacity-30 pointer-events-none' : 'opacity-100'
                }`}
              onSubmit={handleSubmit}
            >

              <div className="flex flex-col gap-4">
                {/* ✅ Render filtered fields based on mode */}
                {getEnabledFieldsToRender.length > 0 ? (
                  getEnabledFieldsToRender.map((config, index) => (
                    <FormField {...getFieldProps(config, index)} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">No insurance types selected for amount entry.</p>
                  </div>
                )}
              </div>


              <FormFooter
                data={formFooter}
                onSkip={handleSkip}
                onBack={handleBack}
              />
            </form>

            {/* ✅ Skip Modal Overlay */}
            {showSkipModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-black bg-opacity-50 absolute inset-0"></div>
                <SubmissionModal
                  title="Skip Insurance Details?"
                  message="You can skip this step and continue. You can always add this information later from your profile settings."
                  onBack={handleSkipCancel}
                  onContinue={handleSkipConfirm}
                  onClose={handleSkipCancel}
                  backText="Go Back"
                  continueText="Yes, Skip This Step"
                />
              </div>
            )}

            {/* ✅ All "No" Modal Overlay */}
            {showAllNoModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-black bg-opacity-50 absolute inset-0"></div>
                <SubmissionModal
                  title="No Insurance Coverage Selected"
                  message="You selected 'No' for all insurance types. Would you like to continue without insurance details or go back to make changes?"
                  onBack={handleAllNoCancel}
                  onContinue={handleAllNoConfirm}
                  onClose={handleAllNoCancel}
                  backText="Go Back & Change"
                  continueText="Continue Without Insurance"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sticky top-0">
        <FormImg src="login-img.png" />
      </div>
    </ProcessWrapper>
  );
}

export default ExtraData;