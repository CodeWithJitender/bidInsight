
// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { saveInsuranceData, setSkippedInsurance } from "../redux/reducer/onboardingSlice"; 
// import FormHeader from "../components/FormHeader";
// import HeroHeading from "../components/HeroHeading";
// import FormFooter from "../components/FormFooter";
// import FormSelect from "../components/FormSelect";
// import FormImg from "../components/FormImg";
// import ProcessWrapper from "../components/ProcessWrapper";
// import { checkTTLAndClear } from "../utils/ttlCheck";

// function HelpOurAi() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const data = {
//     title: "Help Our A.I. Get Smarter!",
//     para: "The more context you provide, the smarter our compatibility engine gets!",
//     btnText: false,
//     btnLink: false,
//     container: "max-w-4xl mx-auto text-left",
//     headingSize: "h3",
//     pSize: "text-xl",
//   };

//   const formHeader = {
//     title: "Log In",
//     link: "/login",
//     steps: 6,
//     activeStep: 4,
//   };

//   // ✅ Simple skip handler - Only set skip flag, don't clear data yet
//   function skipHandle() {
//     dispatch(setSkippedInsurance(true)); // ✅ Set skip flag in Redux
//     navigate("/extra-data");
//   }

//   const formFooter = {
//     back: {
//       text: "Back",
//       link: "/industry-categories",
//     },
//     next: {
//       text: "Next",
//       link: "/extra-data",
//     },
//     skip: {
//       text: "Skip",
//       link: "/extra-data",
//     },
//   };

//   const yesNoOptions = [
//     { value: "yes", label: "Yes" },
//     { value: "no", label: "No" },
//   ];

//   const fields = [
//     { label: "Workers compensation", name: "workersCompensation" },
//     { label: "General liability insurance", name: "generalLiability" },
//     { label: "Automobile liability insurance", name: "autoLiability" },
//     { label: "Cybersecurity insurance", name: "cyberInsurance" },
//     { label: "Environmental insurance", name: "environmentalInsurance" },
//     {
//       label: "Medical/ Professional/ ESO liability insurance",
//       name: "medicalProfessional",
//     },
//   ];

//   useEffect(() => {
//     checkTTLAndClear(navigate);
//   }, []);

//   const insuranceData = useSelector((state) => state.onboarding.insuranceData);
//   const [formValues, setFormValues] = useState({});
//   const [showValidation, setShowValidation] = useState(false);
//   const [allDisabled, setAllDisabled] = useState(false);

//   // ✅ Load existing data normally and handle reset case
//   useEffect(() => {
//     if (insuranceData && Object.keys(insuranceData).length > 0) {
//       setFormValues(insuranceData);
//     } else {
//       // ✅ If insurance data is empty/cleared, reset form completely
//       setFormValues({});
//       setShowValidation(false);
//     }
//   }, [insuranceData]);

//   const handleChange = (name, value) => {
//     setFormValues((prev) => ({
//       ...prev,
//       [name]: value || "",
//     }));
//   };

//   const getMessage = (name) => {
//     if (!showValidation) return "";
//     return formValues[name] ? "This field is selected" : "This field is required";
//   };

//   const getMessageType = (name) => {
//     if (!showValidation) return "";
//     return formValues[name] ? "success" : "error";
//   };

//   const handleNextClick = (e) => {
//     e.preventDefault();
//     setShowValidation(true);
    
//     // Check if all fields are filled
//     const allFilled = fields.every((field) => formValues[field.name]);
    
//     if (allFilled) {
//       dispatch(saveInsuranceData(formValues)); // ✅ Save form data to Redux
//       dispatch(setSkippedInsurance(false)); // ✅ Reset skip flag if user completes form
//       navigate("/extra-data");
//     }
//   };



//   return (
//     <ProcessWrapper>
//       <div className="form-left">
//         <div className="pe-3 flex flex-col justify-between h-full">
//           <div>
//             <FormHeader {...formHeader} />
//             <HeroHeading data={data} />
//           </div>

//           <form className="form-container flex flex-col h-full justify-between">
//             <div className="flex flex-col gap-4">
//               {[0, 1, 2].map((row) => (
//                 <div key={row} className="flex gap-4">
//                   {fields.slice(row * 2, row * 2 + 2).map((field) => (
//                     <div className="w-full" key={field.name}>
//                       <FormSelect
//                         label={field.label}
//                         name={field.name}
//                         options={yesNoOptions}
//                         onChange={
//                           allDisabled ? () => {} : (e) => handleChange(field.name, e.target.value)
//                         }
//                         value={formValues[field.name] || ""}
//                         message={getMessage(field.name)}
//                         messageType={getMessageType(field.name)}
//                         delay={100}
//                         disabled={allDisabled}
//                         placeholder="Select option" // ✅ Better UX
//                       />
//                     </div>
//                   ))}
//                 </div>
//               ))}
//             </div>
            
//             <div>
//               <FormFooter 
//                 data={formFooter} 
//                 onNextClick={handleNextClick} 
//                 onSkipClick={skipHandle}
//               />
//             </div>
//           </form>
//         </div>
//       </div>

//       <div className="sticky top-0">
//         <FormImg src="help-ai.png" />
//       </div>
//     </ProcessWrapper>
//   );
// }

// export default HelpOurAi;










import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveInsuranceData, setSkippedInsurance } from "../redux/reducer/onboardingSlice"; 
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
      label: "Medical/ Professional/ ESO liability insurance",
      name: "medicalProfessional",
    },
  ];

  const [formValues, setFormValues] = useState({});
  const [showValidation, setShowValidation] = useState(false);
  const [allDisabled, setAllDisabled] = useState(false);
  const [skipClicked, setSkipClicked] = useState(false); // 🆕 Skip Flag

  useEffect(() => {
    checkTTLAndClear(navigate);
  }, []);

  // 🟢 Load from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("onboardingForm");
    if (saved) {
      const parsed = JSON.parse(saved);
      const insurance = parsed.insuranceData || {};
      setFormValues(insurance);
    }
  }, []);

  // 🟢 Save to sessionStorage on every form change
  useEffect(() => {
    if (skipClicked) return; // If skipped, don't save

    const prev = JSON.parse(sessionStorage.getItem("onboardingForm")) || {};
    const updated = {
      ...prev,
      insuranceData: formValues,
    };
    sessionStorage.setItem("onboardingForm", JSON.stringify(updated));
  }, [formValues, skipClicked]);

  const handleChange = (name, value) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  };

  const getMessage = (name) => {
    if (!showValidation) return "";
    return formValues[name] ? "This field is selected" : "This field is required";
  };

  const getMessageType = (name) => {
    if (!showValidation) return "";
    return formValues[name] ? "success" : "error";
  };

  const handleNextClick = (e) => {
    e.preventDefault();
    setShowValidation(true);
    
    // Check if all fields are filled
    const allFilled = fields.every((field) => formValues[field.name]);
    
    if (allFilled) {
      dispatch(saveInsuranceData(formValues)); // ✅ Save to Redux
      dispatch(setSkippedInsurance(false));    // ✅ Clear skip flag
      navigate("/extra-data");
    }
  };

  // 🟢 Handle Skip: Remove insuranceData from sessionStorage
  const skipHandle = () => {
    setSkipClicked(true);
    const prev = JSON.parse(sessionStorage.getItem("onboardingForm")) || {};
    delete prev.insuranceData;
    sessionStorage.setItem("onboardingForm", JSON.stringify(prev));

    dispatch(setSkippedInsurance(true));
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
                        value={formValues[field.name] || ""}
                        message={getMessage(field.name)}
                        messageType={getMessageType(field.name)}
                        delay={100}
                        disabled={allDisabled}
                        placeholder="Select option"
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
