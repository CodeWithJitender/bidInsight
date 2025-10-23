import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveGeographicCoverage } from "../redux/reducer/onboardingSlice";
import { fetchUserProfile } from "../redux/reducer/profileSlice";
import FormHeader from "../components/FormHeader";
import HeroHeading from "../components/HeroHeading";
import FormFooter from "../components/FormFooter";
import FormRadio from "../components/FormRadio";
import FormImg from "../components/FormImg";
import FormMultiSelect from "../components/FormMultiSelect";
import ProcessWrapper from "../components/ProcessWrapper";
import { useNavigate } from "react-router-dom";
import { getAllStates } from "../services/user.service";
import { usePlan } from "../hooks/usePlan";
import FeatureRestrictionPopup from "../components/FeatureRestrictionPopup";
import SavedSearchPopup from "../components/SavedSearchPopup";
import { region } from "../services/bid.service";

function GeographicCoverage({ onFeatureRestriction = () => {} }) {
  const data = {
    title: "Where Should We Look?",
    para: "Select states, regions or industries so we only surface relevant bids.",
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
    activeStep: 2,
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { planInfo } = usePlan();

  // ✅ Redux selectors
  const profileData = useSelector((state) => state.profile.profile);

  // ✅ State management
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [nationwideSelected, setNationwideSelected] = useState(false);
  const [selectedStates, setSelectedStates] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  const [regionLoading, setRegionLoading] = useState(true);
  const [regionMapping, setRegionMapping] = useState({});
  const [skipClicked, setSkipClicked] = useState(false);
  const [showSavedSearchPopup, setShowSavedSearchPopup] = useState(false);
  // const [stateFieldRef, setStateFieldRef] = useState(null);
  // 🔥 NEW: Validation states (HelpOurAi pattern)
  const [showValidation, setShowValidation] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
    nationwide: false,
    regions: false,
    states: false,
  });
 const stateFieldRef = useRef(null);
  const [popupState, setPopupState] = useState({
    isOpen: false,
    title: "",
    message: "",
    featureName: "",
    showUpgradeButton: true,
  });

  console.log(profileData, "🔥 Profile data in GeographicCoverage");

  // ✅ Popup handlers
  const handleFeatureRestriction = (title, message, featureName, needsUpgrade = true) => {
    setPopupState({
      isOpen: true,
      title: title || "Feature Restricted",
      message: message || "This feature is not available in your current plan.",
      featureName: featureName || "Premium Feature",
      showUpgradeButton: needsUpgrade,
    });
  };

  const handleClosePopup = () => {
    setPopupState((prev) => ({ ...prev, isOpen: false }));
  };

 const handleUpgrade = () => {
  navigate("/pricing");
  handleClosePopup();
};

// 🔥 ADD THIS NEW FUNCTION
const handleSelectStateInstead = () => {
  // Step 1: Close popup
  setShowSavedSearchPopup(false);
  
  // Step 2: Smooth scroll after small delay
  setTimeout(() => {
    if (stateFieldRef.current) {
      stateFieldRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // Step 3: Add glow effect
      stateFieldRef.current.classList.add('field-highlight');
      
      // Step 4: Focus and open dropdown
      setTimeout(() => {
        const selectInput = stateFieldRef.current.querySelector('input');
        if (selectInput) {
          selectInput.focus();
          selectInput.click();
        }
      }, 700);
      
      // Step 5: Remove glow
      setTimeout(() => {
        stateFieldRef.current.classList.remove('field-highlight');
      }, 2500);
    }
  }, 300);
};

  // ✅ 1. Fetch profile on mount
  useEffect(() => {
    dispatch(fetchUserProfile());
    console.log("🔥 Profile fetched on Geographic Coverage page");
  }, [dispatch]);

  // ✅ 2. Fetch regions from API
  useEffect(() => {
    async function fetchRegions() {
      setRegionLoading(true);
      try {
        const data = await region();
        console.log("🔥 Regions API response:", data);
        if (Array.isArray(data)) {
          setRegionOptions(data.map((item) => item.name));

          const mapping = {};
          data.forEach((item) => {
            mapping[item.name] = item.id;
          });
          setRegionMapping(mapping);
          console.log("📍 Region mapping created:", mapping);
        }
      } catch (err) {
        console.error("Error loading regions:", err);
        setRegionOptions([]);
        setRegionMapping({});
      } finally {
        setRegionLoading(false);
      }
    }

    fetchRegions();
  }, []);

  // ✅ 3. Fetch states from API
  useEffect(() => {
    async function fetchStates() {
      try {
        const data = await getAllStates();
        if (Array.isArray(data)) {
          setStateOptions(
            data.map((item) => ({
              value: item.id,
              label: item.name,
            }))
          );
        }
      } catch (err) {
        console.error("Error loading states:", err);
        setStateOptions([{ value: "", label: "Error loading states" }]);
      }
    }

    fetchStates();
  }, []);

  // ✅ 4. PREFILL LOGIC
  useEffect(() => {
    console.log("🔍 Prefill useEffect triggered");

    if (skipClicked) {
      console.log("⏭️ Skip mode - not prefilling geographic");
      return;
    }

    // Check sessionStorage first
    const saved = sessionStorage.getItem("onboardingForm");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const geoData = parsed.geographic;

        if (
          geoData &&
          (geoData.selectedRegions?.length > 0 ||
            geoData.nationwideSelected === true ||
            geoData.selectedStates?.length > 0)
        ) {
          console.log("✅ Using sessionStorage (user changes)");
          setSelectedRegions(geoData.selectedRegions || []);
          setNationwideSelected(geoData.nationwideSelected || false);
          setSelectedStates(geoData.selectedStates || []);
          return;
        }
      } catch (err) {
        console.error("Error parsing sessionStorage:", err);
      }
    }

    // Prefill from profileData
    if (!profileData?.profile) {
      console.log("❌ No profileData.profile");
      return;
    }

    if (stateOptions.length === 0) {
      console.log("⏳ Waiting for stateOptions to load...");
      return;
    }

    if (Object.keys(regionMapping).length === 0) {
      console.log("⏳ Waiting for regionMapping to load...");
      return;
    }

    console.log("📝 PREFILLING from Profile Data");

    const apiProfile = profileData.profile;
    console.log("🔥 apiProfile:", apiProfile);

    // Reset first
    setNationwideSelected(false);
    setSelectedRegions([]);
    setSelectedStates([]);

    setTimeout(() => {
      // Handle nationwide
      if (apiProfile.nation_wide === true) {
        console.log("✅ Setting Nationwide = TRUE");
        setNationwideSelected(true);
        return;
      }

      // Handle regions
      if (apiProfile.region && apiProfile.region.length > 0) {
        const regionIds = apiProfile.region.map((item) =>
          typeof item === "object" ? item.id : item
        );

        const regionNames = regionIds
          .map((regionId) =>
            Object.keys(regionMapping).find((name) => regionMapping[name] === regionId)
          )
          .filter(Boolean);

        if (regionNames.length > 0) {
          console.log("✅ Setting regions:", regionNames);
          setSelectedRegions(regionNames);
          return;
        }
      }

      // Handle states
      if (apiProfile.states && apiProfile.states.length > 0) {
        const selectedStateObjects = apiProfile.states.map((state) => {
          const stateId = typeof state === "object" ? state.id : state;
          return (
            stateOptions.find((opt) => opt.value === stateId) || {
              value: stateId,
              label: typeof state === "object" ? state.name : `State ${stateId}`,
            }
          );
        });

        console.log("✅ Setting states:", selectedStateObjects);
        setSelectedStates(selectedStateObjects);
      }
    }, 100);
  }, [
    profileData?.profile,
    stateOptions.length,
    Object.keys(regionMapping).length,
    skipClicked,
  ]);

  // ✅ 5. Save to sessionStorage
  useEffect(() => {
    if (skipClicked) return;

    try {
      const prev = JSON.parse(sessionStorage.getItem("onboardingForm")) || {};
      const updated = {
        ...prev,
        geographic: {
          selectedRegions,
          nationwideSelected,
          selectedStates,
        },
      };
      sessionStorage.setItem("onboardingForm", JSON.stringify(updated));
    } catch (err) {
      console.error("Error saving to sessionStorage:", err);
    }
  }, [selectedRegions, nationwideSelected, selectedStates, skipClicked]);

  // 🔥 NEW: Validation message logic (HelpOurAi pattern)
  const getValidationMessage = () => {
    const anyTouched =
      touchedFields.nationwide || touchedFields.regions || touchedFields.states;
    const anySelected =
      nationwideSelected || selectedRegions.length > 0 || selectedStates.length > 0;

    // Show validation if form submitted OR any field touched
    if (showValidation || anyTouched) {
      return anySelected
        ? { type: "success", text: "This field is valid" }
        : { type: "error", text: "Please fill one input any of three" };
    }
    return null;
  };

  // ✅ Plan restriction check
  const isStarter = planInfo?.plan_code === "002" || planInfo?.isStarter;

  // ✅ Nationwide handler
  const handleNationwide = () => {
    // 🔥 Mark as touched
    setTouchedFields((prev) => ({ ...prev, nationwide: true }));

    if (isStarter) {
      setShowSavedSearchPopup(true);
      return;
    }

    setNationwideSelected((prev) => !prev);
    setSelectedRegions([]);
    setSelectedStates([]);
  };

  // ✅ Region handler
  const handleRegionChange = (value) => {
    // 🔥 Mark as touched
    setTouchedFields((prev) => ({ ...prev, regions: true }));

    if (isStarter) {
      setShowSavedSearchPopup(true);
      return;
    }

    if (selectedRegions.includes(value)) {
      setSelectedRegions((prev) => prev.filter((v) => v !== value));
    } else if (selectedRegions.length < 3) {
      setSelectedRegions((prev) => [...prev, value]);
    }
    setNationwideSelected(false);
    setSelectedStates([]);
  };

  // ✅ State handler
  const handleStateChange = (selected) => {
    // 🔥 Mark as touched
    setTouchedFields((prev) => ({ ...prev, states: true }));

    if (isStarter && selected.length > 1) {
      setShowSavedSearchPopup(true);
      return;
    }

    setSelectedStates(selected);
    setNationwideSelected(false);
    setSelectedRegions([]);
  };

  // 🔥 FIXED: Submit handler with validation
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 🔥 Step 1: Show validation
    setShowValidation(true);

    // 🔥 Step 2: Mark all fields as touched
    setTouchedFields({
      nationwide: true,
      regions: true,
      states: true,
    });

    // 🔥 Step 3: Check if any field is selected
    const anySelected =
      nationwideSelected || selectedRegions.length > 0 || selectedStates.length > 0;

    // 🔥 Step 4: Stop if nothing selected
    if (!anySelected) {
      console.log("❌ Validation failed - no selection");
      return; // Don't proceed
    }

    // ✅ Step 5: Proceed with submission
    console.log("✅ Validation passed - submitting");

    let nation_wide = false;
    let regionIds = [];
    let statesArray = [];

    if (nationwideSelected) {
      nation_wide = true;
    } else if (selectedRegions.length > 0) {
      regionIds = selectedRegions.map((regionName) => regionMapping[regionName]).filter(Boolean);
    } else if (selectedStates.length > 0) {
      statesArray = selectedStates.map((state) =>
        typeof state === "object" ? parseInt(state.value || state.id) : parseInt(state)
      );
    }

    const geoData = {
      nation_wide,
      region: regionIds,
      states: statesArray,
    };

    console.log("🚀 Final geoData:", geoData);

    dispatch(saveGeographicCoverage(geoData));
    navigate("/industry-categories");
  };

  // ✅ Skip handler
  const handleSkip = () => {
    setSkipClicked(true);

    // Clear selections
    setSelectedRegions([]);
    setNationwideSelected(false);
    setSelectedStates([]);

    // Clear from Redux
    dispatch(
      saveGeographicCoverage({
        nation_wide: false,
        region: [],
        states: [],
      })
    );

    // Remove from sessionStorage
    try {
      const prev = JSON.parse(sessionStorage.getItem("onboardingForm")) || {};
      delete prev.geographic;
      sessionStorage.setItem("onboardingForm", JSON.stringify(prev));
    } catch (err) {
      console.error("Error on skip:", err);
    }

    navigate("/industry-categories");
  };

  const formFooter = {
    next: {
      text: "Next",
    },
  };

  // 🔥 Get validation message for display
  const validationMsg = getValidationMessage();

  return (
    <ProcessWrapper>
      <div className="form-left">
        <div className="flex flex-col justify-between h-full">
          <div>
            <FormHeader {...formHeader} />
            <HeroHeading data={data} />
          </div>

          <form
            className="forn-container flex flex-col h-full justify-between"
            onSubmit={handleSubmit}
          >
            <div className="w-[100%] md:w-[90%]">
              <div onClick={handleNationwide} className="cursor-pointer">
                <FormRadio
                  label="Nationwide"
                  type="radio"
                  name="region"
                  value="Nationwide"
                  delay={100}
                  selectedValue={nationwideSelected ? "Nationwide" : ""}
                  onChange={() => {}}
                />
              </div>

              <div className="form-label font-t my-5">Select region</div>

              {regionLoading ? (
                <div className="text-gray-300 flex items-center justify-center h-40 text-lg mb-3">
                  Loading regions...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 mb-3">
                  {regionOptions.map((reg, i) => (
                    <FormRadio
                      key={i}
                      type="checkbox"
                      label={reg}
                      name="region-multi"
                      value={reg}
                      selectedValues={selectedRegions}
                      onChange={() => handleRegionChange(reg)}
                      maxSelected={3}
                      delay={i * 100}
                    />
                  ))}
                </div>
              )}

              <div className="state-field-wrapper">
  <FormMultiSelect
    label="Select State"
    name="industries"
    placeholder="Choose State"
    options={stateOptions}
    value={selectedStates}
    onChange={handleStateChange}
    menuPlacement="auto"
    inputRef={stateFieldRef}  // 🔥 Pass ref as prop
    highlightClass="field-highlight"  
  />
</div>

              {/* 🔥 FIXED: Validation message display */}
              <div style={{ marginTop: 14 }}>
                {validationMsg && (
                  <span
                    className={`flex items-center gap-1 text-sm ${
                      validationMsg.type === "success" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    <i
                      className={`far ${
                        validationMsg.type === "success" ? "fa-check" : "fa-times"
                      } ${validationMsg.type === "success" ? "text-green-400" : "text-red-400"}`}
                    ></i>
                    {validationMsg.text}
                  </span>
                )}
              </div>
            </div>

            <FormFooter data={formFooter} onSkipClick={handleSkip} />
          </form>
        </div>
      </div>

      <div className="sticky top-0">
        <FormImg src={"geographic-coverage.webp"} />
      </div>

      <FeatureRestrictionPopup
        isOpen={popupState.isOpen}
        onClose={handleClosePopup}
        onUpgrade={handleUpgrade}
        title={popupState.title}
        message={popupState.message}
        featureName={popupState.featureName}
        showUpgradeButton={popupState.showUpgradeButton}
      />

     <SavedSearchPopup
  isOpen={showSavedSearchPopup}
  onClose={() => {
    setShowSavedSearchPopup(false);
    // Auto-scroll when popup closes
    setTimeout(() => {
      if (stateFieldRef.current) {
        stateFieldRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        stateFieldRef.current.classList.add('field-highlight');
        setTimeout(() => {
          stateFieldRef.current.classList.remove('field-highlight');
        }, 1000);
      }
    }, 100);
  }}
  title="Location Access Restricted"
  message="Starter plan includes 1 state access. Please select one state below to continue."
  upgradeButtonText="Upgrade Plan"
  cancelButtonText="Got It"
  onCancel={handleSelectStateInstead}
/>
    </ProcessWrapper>
  );
}

export default GeographicCoverage;





// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { saveGeographicCoverage } from "../redux/reducer/onboardingSlice";
// import { fetchUserProfile } from "../redux/reducer/profileSlice";
// import FormHeader from "../components/FormHeader";
// import HeroHeading from "../components/HeroHeading";
// import FormFooter from "../components/FormFooter";
// import FormRadio from "../components/FormRadio";
// import FormImg from "../components/FormImg";
// import FormMultiSelect from "../components/FormMultiSelect";
// import ProcessWrapper from "../components/ProcessWrapper";
// import { useNavigate } from "react-router-dom";
// import { getAllStates } from "../services/user.service";
// import { usePlan } from "../hooks/usePlan";
// import FeatureRestrictionPopup from "../components/FeatureRestrictionPopup";
// import SavedSearchPopup from "../components/SavedSearchPopup";
// import { region } from "../services/bid.service";

// function GeographicCoverage({ onFeatureRestriction = () => { } }) {
//   const data = {
//     title: "Where Should We Look?",
//     para: "Select states, regions or industries so we only surface relevant bids.",
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
//     activeStep: 2,
//   };

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { planInfo } = usePlan();

//   // ✅ Redux selectors
//   const profileData = useSelector((state) => state.profile.profile);
//   console.log(profileData, "🔥 Profile data in GeographicCoverageeeeeeeeeeeeee");
//   // ✅ State management
//   const [selectedRegions, setSelectedRegions] = useState([]);
//   const [nationwideSelected, setNationwideSelected] = useState(false);
//   const [selectedStates, setSelectedStates] = useState([]);
//   const [selectionError, setSelectionError] = useState("");
//   const [selectionSuccess, setSelectionSuccess] = useState("");
//   const [touched, setTouched] = useState(false);
//   const [stateOptions, setStateOptions] = useState([]);
//   const [regionOptions, setRegionOptions] = useState([]);
//   const [regionLoading, setRegionLoading] = useState(true);
//   const [regionMapping, setRegionMapping] = useState({});
//   const [skipClicked, setSkipClicked] = useState(false);
//   const [showSavedSearchPopup, setShowSavedSearchPopup] = useState(false);
//   const [touchedFields, setTouchedFields] = useState({
//   nationwide: false,
//   regions: false,
//   states: false
// });

//   const [popupState, setPopupState] = useState({
//     isOpen: false,
//     title: "",
//     message: "",
//     featureName: "",
//     showUpgradeButton: true,
//   });

//   console.log(profileData?.profile, "🔥 Profile data in GeographicCoverage");

//   // ✅ Popup handlers
//   const handleFeatureRestriction = (title, message, featureName, needsUpgrade = true) => {
//     setPopupState({
//       isOpen: true,
//       title: title || "Feature Restricted",
//       message: message || "This feature is not available in your current plan.",
//       featureName: featureName || "Premium Feature",
//       showUpgradeButton: needsUpgrade,
//     });
//   };

//   const handleClosePopup = () => {
//     setPopupState((prev) => ({ ...prev, isOpen: false }));
//   };

//   const handleUpgrade = () => {
//     navigate("/pricing");
//     handleClosePopup();
//   };

//   // ✅ 1. Fetch profile on mount
//   useEffect(() => {
//     dispatch(fetchUserProfile());
//     console.log("🔥 Profile fetched on Geographic Coverage page");
//   }, [dispatch]);

//   // ✅ 2. Fetch regions from API (ONLY ONCE)
//   useEffect(() => {
//     async function fetchRegions() {
//       setRegionLoading(true);
//       try {
//         const data = await region();
//         console.log("🔥 Regions API response:", data);
//         if (Array.isArray(data)) {
//           setRegionOptions(data.map((item) => item.name));

//           const mapping = {};
//           data.forEach((item) => {
//             mapping[item.name] = item.id;
//           });
//           setRegionMapping(mapping);
//           console.log("📍 Region mapping created:", mapping);
//         }
//       } catch (err) {
//         console.error("Error loading regions:", err);
//         setRegionOptions([]);
//         setRegionMapping({});
//       } finally {
//         setRegionLoading(false);
//       }
//     }

//     fetchRegions();
//   }, []); // ✅ Only once

//   // ✅ 3. Fetch states from API
//   useEffect(() => {
//     async function fetchStates() {
//       try {
//         const data = await getAllStates();
//         if (Array.isArray(data)) {
//           setStateOptions(
//             data.map((item) => ({
//               value: item.id,
//               label: item.name,
//             }))
//           );
//         }
//       } catch (err) {
//         console.error("Error loading states:", err);
//         setStateOptions([{ value: "", label: "Error loading states" }]);
//       }
//     }

//     fetchStates();
//   }, []);

//   // ✅ 4. PREFILL LOGIC - Same as Industry Component
// useEffect(() => {
//   // ✅ STEP 0: Debug logs
//   console.log("🔍 Prefill useEffect triggered");
//   console.log("🔍 Conditions:", {
//     skipClicked,
//     hasProfileData: !!profileData?.profile,
//     profileDataKeys: profileData?.profile ? Object.keys(profileData.profile) : [],
//     stateOptionsLength: stateOptions.length,
//     regionMappingLength: Object.keys(regionMapping).length,
//     sessionStorageExists: !!sessionStorage.getItem("onboardingForm")
//   });

//   // 🛑 Check 1: Skip mode
//   if (skipClicked) {
//     console.log("⏭️ Skip mode - not prefilling geographic");
//     return;
//   }

//   // 🛑 Check 2: SessionStorage first
//   const saved = sessionStorage.getItem("onboardingForm");
//   if (saved) {
//     try {
//       const parsed = JSON.parse(saved);
//       const geoData = parsed.geographic;
      
//       // ✅ Better check - data actually hai ya nahi
//       if (geoData && (
//         geoData.selectedRegions?.length > 0 ||
//         geoData.nationwideSelected === true ||
//         geoData.selectedStates?.length > 0
//       )) {
//         console.log("✅ Using sessionStorage (user changes)");
//         setSelectedRegions(geoData.selectedRegions || []);
//         setNationwideSelected(geoData.nationwideSelected || false);
//         setSelectedStates(geoData.selectedStates || []);
//         return;
//       }
//     } catch (err) {
//       console.error("Error parsing sessionStorage:", err);
//     }
//   }

//   // ✅ Check 3: Prefill from profileData
//   // IMPORTANT: Check each condition separately
//   if (!profileData?.profile) {
//     console.log("❌ No profileData.profile");
//     return;
//   }

//   if (stateOptions.length === 0) {
//     console.log("⏳ Waiting for stateOptions to load...");
//     return;
//   }

//   if (Object.keys(regionMapping).length === 0) {
//     console.log("⏳ Waiting for regionMapping to load...");
//     return;
//   }

//   // ✅ All conditions met - proceed with prefill
//   console.log("📝 PREFILLING from Profile Data");

//   const apiProfile = profileData.profile;
//   console.log("🔥 apiProfile:", apiProfile);
//   console.log("🔍 Raw API Data:", {
//     nation_wide: apiProfile.nation_wide,
//     region: apiProfile.region,
//     states: apiProfile.states,
//   });

//   // Reset first
//   setNationwideSelected(false);
//   setSelectedRegions([]);
//   setSelectedStates([]);

//   // Small delay for React batching
//   setTimeout(() => {
//     // Handle nationwide
//     if (apiProfile.nation_wide === true) {
//       console.log("✅ Setting Nationwide = TRUE");
//       setNationwideSelected(true);
//       return;
//     }

//     // Handle regions
//     if (apiProfile.region && apiProfile.region.length > 0) {
//       const regionIds = apiProfile.region.map((item) =>
//         typeof item === "object" ? item.id : item
//       );

//       console.log("🔍 Extracted Region IDs:", regionIds);

//       const regionNames = regionIds
//         .map((regionId) =>
//           Object.keys(regionMapping).find((name) => regionMapping[name] === regionId)
//         )
//         .filter(Boolean);

//       if (regionNames.length > 0) {
//         console.log("✅ Setting regions:", regionNames);
//         setSelectedRegions(regionNames);
//         return;
//       }
//     }

//     // Handle states
//     if (apiProfile.states && apiProfile.states.length > 0) {
//       const selectedStateObjects = apiProfile.states.map((state) => {
//         const stateId = typeof state === "object" ? state.id : state;
//         return (
//           stateOptions.find((opt) => opt.value === stateId) || {
//             value: stateId,
//             label: typeof state === "object" ? state.name : `State ${stateId}`,
//           }
//         );
//       });

//       console.log("✅ Setting states:", selectedStateObjects);
//       setSelectedStates(selectedStateObjects);
//     }
//   }, 100);

// }, [profileData?.profile, stateOptions.length, Object.keys(regionMapping).length, skipClicked]);


// const getValidationMessage = () => {
//   const anyTouched = touchedFields.nationwide || touchedFields.regions || touchedFields.states;
//   const anySelected = nationwideSelected || selectedRegions.length > 0 || selectedStates.length > 0;
  
//   if (showValidation || anyTouched) {
//     return anySelected 
//       ? { type: "success", text: "This field is valid" }
//       : { type: "error", text: "Please fill one input any of three" };
//   }
//   return null;
// };

//   // ✅ 5. Save to sessionStorage on every change (NOT on skip)
//   useEffect(() => {
//     if (skipClicked) return;

//     try {
//       const prev = JSON.parse(sessionStorage.getItem("onboardingForm")) || {};
//       const updated = {
//         ...prev,
//         geographic: {
//           selectedRegions,
//           nationwideSelected,
//           selectedStates,
//         },
//       };
//       sessionStorage.setItem("onboardingForm", JSON.stringify(updated));
//     } catch (err) {
//       console.error("Error saving to sessionStorage:", err);
//     }
//   }, [selectedRegions, nationwideSelected, selectedStates, skipClicked]);

//   // ✅ Plan restriction check
//   const isStarter = planInfo?.plan_code === "002" || planInfo?.isStarter;

//   // ✅ Nationwide handler
//   const handleNationwide = () => {
//     setTouchedFields(prev => ({ ...prev, nationwide: true }));
//     if (isStarter) {
//       setShowSavedSearchPopup(true);
//       return;
//     }

//     setNationwideSelected((prev) => !prev);
//     setSelectedRegions([]);
//     setSelectedStates([]);
//   };

//   // ✅ Region handler
//   const handleRegionChange = (value) => {
//     if (isStarter) {
//       setShowSavedSearchPopup(true);
//       return;
//     }
//     if (selectedRegions.includes(value)) {
//       setSelectedRegions((prev) => prev.filter((v) => v !== value));
//     } else if (selectedRegions.length < 3) {
//       setSelectedRegions((prev) => [...prev, value]);
//     }
//     setNationwideSelected(false);
//     setSelectedStates([]);
//   };

//   // ✅ State handler
//   const handleStateChange = (selected) => {
//     if (isStarter && selected.length > 1) {
//       setShowSavedSearchPopup(true);
//       return;
//     }
//     setSelectedStates(selected);
//     setNationwideSelected(false);
//     setSelectedRegions([]);
//   };

//   // ✅ Validation effect
//   useEffect(() => {
//     if (!touched) return;
//     if (!nationwideSelected && selectedRegions.length === 0 && selectedStates.length === 0) {
//       setSelectionError("Please select any of the three");
//       setSelectionSuccess("");
//     } else {
//       setSelectionError("");
//       setSelectionSuccess("The field is selected");
//     }
//   }, [nationwideSelected, selectedRegions, selectedStates, touched]);

//   // ✅ Submit handler
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     let nation_wide = false;
//     let regionIds = [];
//     let statesArray = [];

//     if (nationwideSelected) {
//       nation_wide = true;
//     } else if (selectedRegions.length > 0) {
//       regionIds = selectedRegions.map((regionName) => regionMapping[regionName]).filter(Boolean);
//     } else if (selectedStates.length > 0) {
//       statesArray = selectedStates.map((state) =>
//         typeof state === "object" ? parseInt(state.value || state.id) : parseInt(state)
//       );
//     }

//     const geoData = {
//       nation_wide,
//       region: regionIds,
//       states: statesArray,
//     };

//     console.log("🚀 Final geoData:", geoData);

//     dispatch(saveGeographicCoverage(geoData));
//     navigate("/industry-categories");
//   };

//   // ✅ Skip handler
//   const handleSkip = () => {
//     setSkipClicked(true);

//     // Clear selections
//     setSelectedRegions([]);
//     setNationwideSelected(false);
//     setSelectedStates([]);

//     // Clear from Redux
//     dispatch(
//       saveGeographicCoverage({
//         nation_wide: false,
//         region: [],
//         states: [],
//       })
//     );

//     // Remove from sessionStorage
//     try {
//       const prev = JSON.parse(sessionStorage.getItem("onboardingForm")) || {};
//       delete prev.geographic;
//       sessionStorage.setItem("onboardingForm", JSON.stringify(prev));
//     } catch (err) {
//       console.error("Error on skip:", err);
//     }

//     navigate("/industry-categories");
//   };

//   const formFooter = {
//     next: {
//       text: "Next",
//     },
//   };

//   return (
//     <ProcessWrapper>
//       <div className="form-left">
//         <div className="flex flex-col justify-between h-full">
//           <div>
//             <FormHeader {...formHeader} />
//             <HeroHeading data={data} />
//           </div>

//           <form
//             className="forn-container flex flex-col h-full justify-between"
//             onSubmit={handleSubmit}
//           >
//             <div className="w-[100%] md:w-[90%]">
//               <div onClick={handleNationwide} className="cursor-pointer">
//                 <FormRadio
//                   label="Nationwide"
//                   type="radio"
//                   name="region"
//                   value="Nationwide"
//                   delay={100}
//                   selectedValue={nationwideSelected ? "Nationwide" : ""}
//                   onChange={() => { }}
//                 />
//               </div>

//               <div className="form-label font-t my-5">Select region</div>

//               {regionLoading ? (
//                 <div className="text-gray-300 flex items-center justify-center h-40 text-lg mb-3">
//                   Loading regions...
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
//                   {regionOptions.map((reg, i) => (
//                     <FormRadio
//                       key={i}
//                       type="checkbox"
//                       label={reg}
//                       name="region-multi"
//                       value={reg}
//                       selectedValues={selectedRegions}
//                       onChange={() => handleRegionChange(reg)}
//                       maxSelected={3}
//                       delay={i * 100}
//                     />
//                   ))}
//                 </div>
//               )}

//               <FormMultiSelect
//                 label="Select State"
//                 name="industries"
//                 placeholder="Choose State"
//                 options={stateOptions}
//                 value={selectedStates}
//                 onChange={handleStateChange}
//                 menuPlacement="auto"
//               />

//               <div style={{ marginTop: 14 }}>
//                 {selectionError && touched && (
//                   <span className="flex items-center gap-1 text-red-400 text-sm">
//                     <i className="far fa-times text-red-400"></i>
//                     {selectionError}
//                   </span>
//                 )}
//                 {selectionSuccess && !selectionError && touched && (
//                   <span className="flex items-center gap-1 text-green-400 text-sm">
//                     <i className="far fa-check text-green-400"></i>
//                     {selectionSuccess}
//                   </span>
//                 )}
//               </div>
//             </div>

//             <FormFooter data={formFooter} onSkipClick={handleSkip} />
//           </form>
//         </div>
//       </div>

//       <div className="sticky top-0">
//         <FormImg src={"geographic-coverage.png"} />
//       </div>

//       <FeatureRestrictionPopup
//         isOpen={popupState.isOpen}
//         onClose={handleClosePopup}
//         onUpgrade={handleUpgrade}
//         title={popupState.title}
//         message={popupState.message}
//         featureName={popupState.featureName}
//         showUpgradeButton={popupState.showUpgradeButton}
//       />

//       <SavedSearchPopup
//         isOpen={showSavedSearchPopup}
//         onClose={() => setShowSavedSearchPopup(false)}
//         title="Location Access Restricted"
//         message="Your current plan doesn't allow access to this location filter. Upgrade to access all states and regions."
//         upgradeButtonText="Upgrade Plan"
//         cancelButtonText="Got It"
//       />
//     </ProcessWrapper>
//   );
// }

// export default GeographicCoverage;


