import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveInsuranceData, setSkippedInsurance, setAllNoInsurance } from "../redux/reducer/onboardingSlice"; 
import FormHeader from "../components/FormHeader";
import HeroHeading from "../components/HeroHeading";
import FormFooter from "../components/FormFooter";
import FormSelect from "../components/FormSelect";
import FormImg from "../components/FormImg";
import ProcessWrapper from "../components/ProcessWrapper";
import { checkTTLAndClear } from "../utils/ttlCheck";

function HelpOurAi() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const data = {
    title: "Help Our A.I. Get Smarter!",
    para: "The more context you provide, the smarter our compatibility engine gets!",
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
    activeStep: 4,
  };

  const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const fields = [
    { label: "Workers compensation", name: "workersCompensation" },
    { label: "General liability insurance", name: "generalLiability" },
    { label: "Automobile liability insurance", name: "autoLiability" },
    { label: "Cybersecurity insurance", name: "cyberInsurance" },
    { label: "Environmental insurance", name: "environmentalInsurance" },
    {
      label: "Medical/ Professional/ ESO insurance",
      name: "medicalProfessional",
    },
  ];

  // Initialize with empty object with all field names
  const [formValues, setFormValues] = useState(() => {
    const initialState = {};
    fields.forEach(field => {
      initialState[field.name] = "";
    });
    return initialState;
  });

  // 🔥 NEW: Add touched state for each field
  const [touched, setTouched] = useState(() => {
    const initialTouched = {};
    fields.forEach(field => {
      initialTouched[field.name] = false;
    });
    return initialTouched;
  });
  
  const [showValidation, setShowValidation] = useState(false);
  const [allDisabled, setAllDisabled] = useState(false);
  const [skipClicked, setSkipClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced session storage loading with proper state management
  useEffect(() => {
    const loadStoredData = () => {
      try {
        console.log("🔄 Loading data from sessionStorage...");
        const saved = sessionStorage.getItem("onboardingForm");
        
        if (saved) {
          const parsed = JSON.parse(saved);
          const insurance = parsed.insuranceData || {};
          
          console.log("📦 Retrieved insurance data:", insurance);
          console.log("📊 Insurance data keys:", Object.keys(insurance));
          
          // Create complete form object with all fields
          const completeFormValues = {};
          fields.forEach(field => {
            completeFormValues[field.name] = insurance[field.name] || "";
          });
          
          console.log("✅ Complete form values to set:", completeFormValues);
          
          // Set form values and then mark as loaded
          setFormValues(completeFormValues);
          
          // Small delay to ensure state is set before rendering
          setTimeout(() => {
            setIsLoading(false);
            console.log("🚀 Form data loaded and ready to render");
          }, 50);
        } else {
          console.log("📭 No saved data found in sessionStorage");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("❌ Error loading from sessionStorage:", error);
        setIsLoading(false);
      }
    };

    loadStoredData();
  }, []);

  // Enhanced sessionStorage saving with better error handling
  useEffect(() => {
    if (skipClicked || isLoading) return; // Don't save if loading or skipped

    try {
      const prev = JSON.parse(sessionStorage.getItem("onboardingForm")) || {};
      const updated = {
        ...prev,
        insuranceData: formValues,
      };
      
      console.log("💾 Saving to sessionStorage:", updated.insuranceData);
      sessionStorage.setItem("onboardingForm", JSON.stringify(updated));
    } catch (error) {
      console.error("❌ Error saving to sessionStorage:", error);
    }
  }, [formValues, skipClicked, isLoading]);

  // 🔥 UPDATED: Handle change with touched state
  const handleChange = (name, value) => {
    console.log(`🎯 Field changed: ${name} = ${value}`);
    setFormValues((prev) => {
      const updated = {
        ...prev,
        [name]: value || "",
      };
      console.log("📊 Updated form values:", updated);
      return updated;
    });

    // 🔥 NEW: Mark field as touched when changed
    setTouched((prev) => ({
      ...prev,
      [name]: true
    }));
  };

  // 🔥 NEW: Handle blur to mark as touched
  const handleBlur = (name, value) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true
    }));
  };

  // 🔥 UPDATED: Dynamic message generation based on touched state OR showValidation
  const getMessage = (name) => {
    const shouldShow = touched[name] || showValidation;
    if (!shouldShow) return "";
    return formValues[name] ? "This field is selected" : "This field is required";
  };

  const getMessageType = (name) => {
    const shouldShow = touched[name] || showValidation;
    if (!shouldShow) return "";
    return formValues[name] ? "success" : "error";
  };

  // Check if all fields are "No"
  const checkAllNo = (values) => {
    return fields.every((field) => values[field.name] === "no");
  };

  // Check if at least one field is "Yes"
  const hasAnyYes = (values) => {
    return fields.some((field) => values[field.name] === "yes");
  };

  const handleNextClick = (e) => {
    e.preventDefault();
    setShowValidation(true);
    
    // 🔥 NEW: Mark all fields as touched on submit
    const allTouched = {};
    fields.forEach(field => {
      allTouched[field.name] = true;
    });
    setTouched(allTouched);
    
    // Check if all fields are filled
    const allFilled = fields.every((field) => formValues[field.name]);
    
    if (allFilled) {
      dispatch(saveInsuranceData(formValues));
      
      // Check if all fields are "No"
      if (checkAllNo(formValues)) {
        // All "No" case - treat as skip mode
        dispatch(setAllNoInsurance(true));
        dispatch(setSkippedInsurance(false));
      } else {
        // Normal case - at least one "Yes"
        dispatch(setAllNoInsurance(false));
        dispatch(setSkippedInsurance(false));
      }
      
      navigate("/extra-data");
    }
  };

  // Handle Skip: Remove insuranceData from sessionStorage
  const skipHandle = () => {
    setSkipClicked(true);
    const prev = JSON.parse(sessionStorage.getItem("onboardingForm")) || {};
    delete prev.insuranceData;
    sessionStorage.setItem("onboardingForm", JSON.stringify(prev));

    dispatch(setSkippedInsurance(true));
    dispatch(setAllNoInsurance(false));
    navigate("/extra-data");
  };

  const formFooter = {
    back: {
      text: "Back",
      link: "/industry-categories",
    },
    next: {
      text: "Next",
      link: "/extra-data",
    },
    skip: {
      text: "Skip",
      link: "/extra-data",
    },
  };

  // Show loading state while data is being loaded
  if (isLoading) {
    return (
      <ProcessWrapper>
        <div className="form-left">
          <div className="pe-3 flex flex-col justify-center items-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your saved data...</p>
            </div>
          </div>
        </div>
        <div className="sticky top-0">
          <FormImg src="help-ai.png" />
        </div>
      </ProcessWrapper>
    );
  }

  return (
    <ProcessWrapper>
      <div className="form-left">
        <div className=" pe-3 flex flex-col justify-between h-full">
          <div>
            <FormHeader {...formHeader} />
            <HeroHeading data={data} />
          </div>
        
          <form className="form-container flex flex-col h-full justify-between">
            <div className="flex flex-col gap-4">
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex gap-4">
                  {fields.slice(row * 2, row * 2 + 2).map((field) => (
                    <div className="w-full " key={field.name}>
                      <FormSelect
                        className="text-xl"
                        label={field.label}
                        name={field.name}
                        options={yesNoOptions}
                        onChange={
                          allDisabled ? () => {} : (e) => handleChange(field.name, e.target.value)
                        }
                        onBlur={(e) => handleBlur(field.name, e.target.value)} // 🔥 NEW: Add onBlur
                        value={formValues[field.name] || ""}
                        message={getMessage(field.name)}
                        messageType={getMessageType(field.name)}
                        touched={touched[field.name]} // 🔥 NEW: Pass touched state
                        delay={100}
                        disabled={allDisabled}
                        placeholder="Select option"
                        key={`${field.name}-${formValues[field.name]}`}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            <div>
              <FormFooter 
                data={formFooter} 
                onNextClick={handleNextClick} 
                onSkipClick={skipHandle}
              />
            </div>
          </form>
        </div>
      </div>

      <div className="sticky top-0">
        <FormImg src="help-ai.png" />
      </div>
    </ProcessWrapper>
  );
}

export default HelpOurAi;