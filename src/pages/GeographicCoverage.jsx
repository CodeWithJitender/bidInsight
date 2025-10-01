import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
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
import SavedSearchPopup from "../components/SavedSearchPopup"; // Add this if not already
import { useSelector } from "react-redux";
import { updateProfileData } from "../redux/reducer/profileSlice"; // if needed for PUT
import { region } from "../services/bid.service";
function GeographicCoverage({ onFeatureRestriction = () => { } }) {


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
  const { planInfo, isRestricted } = usePlan();

  const [selectedRegions, setSelectedRegions] = useState([]);
  const [nationwideSelected, setNationwideSelected] = useState(false);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectionError, setSelectionError] = useState("");
  const [selectionSuccess, setSelectionSuccess] = useState("");
  const [touched, setTouched] = useState(false);
  const [stateOptions, setStateOptions] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
const [regionMapping, setRegionMapping] = useState({}); // 🆕 ADD THIS
  const [skipClicked, setSkipClicked] = useState(false); // 🆕 Skip flag
  // After line 64 (after const [stateOptions, setStateOptions] = useState([]);)
  const profileData = useSelector((state) => state.profile.profile);
  console.log(profileData, "🔥 Profile data in GeographicCoverage");

  const [popupState, setPopupState] = useState({
    isOpen: false,
    title: "",
    message: "",
    featureName: "",
    showUpgradeButton: true
  });

  const handleFeatureRestriction = (title, message, featureName, needsUpgrade = true) => {
    setPopupState({
      isOpen: true,
      title: title || "Feature Restricted",
      message: message || "This feature is not available in your current plan.",
      featureName: featureName || "Premium Feature",
      showUpgradeButton: needsUpgrade
    });
  };

  const handleClosePopup = () => {
    setPopupState(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const handleUpgrade = () => {
    navigate("/pricing");
    handleClosePopup();
  };

// 🌐 Fetch regions from API
useEffect(() => {
  async function fetchRegions() {
    try {
      const data = await region();
      console.log("🔥 Regions API response:", data);
      if (Array.isArray(data)) {
        // Store names for UI
        setRegionOptions(data.map((item) => item.name));
        
        // 🆕 Create name->id mapping
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
    }
  }

  fetchRegions();
}, []);

  // Add this state for SavedSearchPopup
  const [showSavedSearchPopup, setShowSavedSearchPopup] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
    console.log("🔥 Profile fetched on Geographic Coverage page");
  }, [dispatch]);

  useEffect(() => {
    // current entry lock kar do
    window.history.pushState(null, "", window.location.href);

    const handleBack = () => {
      window.history.go(1); // back dabane par same page par rakho
    };

    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, []);


  // 🌐 Fetch regions from API
// 🌐 Fetch regions from API
useEffect(() => {
  async function fetchRegions() {
    try {
      const data = await region();
      console.log("🔥 Regions API response:", data);
      if (Array.isArray(data)) {
        // Store names for UI
        setRegionOptions(data.map((item) => item.name));
        
        // 🆕 Create name->id mapping
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
    }
  }

  fetchRegions();
}, []);

  // 🔁 Load sessionStorage on first mount
  useEffect(() => {
    const saved = sessionStorage.getItem("onboardingForm");
    if (saved) {
      const parsed = JSON.parse(saved);
      const geo = parsed.geographic || {};
      setSelectedRegions(geo.selectedRegions || []);
      setNationwideSelected(geo.nationwideSelected || false);
      setSelectedStates(geo.selectedStates || []);
    }
  }, []);

  // 💾 Save to sessionStorage (only if not skipped)
  useEffect(() => {
    if (skipClicked) return;

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
  }, [selectedRegions, nationwideSelected, selectedStates, skipClicked]);

  // 🌐 Fetch states
  useEffect(() => {
    async function fetchStates() {
      try {
        const data = await getAllStates(); // ✅ use the service function
        if (Array.isArray(data)) {
          setStateOptions(
            data.map((item) => ({
              value: item.id,
              label: item.name,
            }))
          );
        }
      } catch (err) {
        setStateOptions([{ value: "", label: "Error loading states" }]);
      }
    }

    fetchStates();
  }, []);

  // ⭐ NEW: Prefill from Redux profile data
 useEffect(() => {
  if (profileData?.profile && stateOptions.length > 0 && Object.keys(regionMapping).length > 0) {
    console.log("📝 Prefilling from Redux Profile");
    
    const apiProfile = profileData.profile;
    console.log("🔍 Raw API Data:", {
      nation_wide: apiProfile.nation_wide,
      region: apiProfile.region,
      states: apiProfile.states
    });

    // Reset first
    setNationwideSelected(false);
    setSelectedRegions([]);
    setSelectedStates([]);

    // Check nationwide
    if (apiProfile.nation_wide === true) {
      console.log("✅ Restoring Nationwide");
      setNationwideSelected(true);
      return;
    }

    // Check regions
    if (apiProfile.region && apiProfile.region.length > 0) {
      const regionIds = Array.isArray(apiProfile.region) 
        ? apiProfile.region 
        : [apiProfile.region];
      
      console.log("🔍 Region IDs:", regionIds);
      
      const regionNames = regionIds
        .map(regionId => {
          const regionName = Object.keys(regionMapping).find(
            name => regionMapping[name] === regionId
          );
          console.log(`Mapping ID ${regionId} -> ${regionName}`);
          return regionName;
        })
        .filter(Boolean);
      
      if (regionNames.length > 0) {
        console.log("✅ Restoring regions:", regionNames);
        setSelectedRegions(regionNames);
        return;
      }
    }

    // Check states
    if (apiProfile.states && apiProfile.states.length > 0) {
      console.log("🔍 States from API:", apiProfile.states);
      
      const selectedStateObjects = apiProfile.states.map(state => {
        const stateId = typeof state === 'object' ? state.id : state;
        const matchingOption = stateOptions.find(opt => opt.value === stateId);
        
        return matchingOption || {
          value: stateId,
          label: typeof state === 'object' && state.name ? state.name : `State ${stateId}`
        };
      });

      console.log("✅ Restoring states:", selectedStateObjects);
      setSelectedStates(selectedStateObjects);
    }
  }
}, [profileData, stateOptions, regionMapping]);

  // ⭐ NEW: Clear sessionStorage when loading from Redux profile
useEffect(() => {
  if (profileData?.profile && (nationwideSelected || selectedRegions.length > 0 || selectedStates.length > 0)) {
    console.log("🧹 Clearing sessionStorage - loaded from Redux");
    const prev = JSON.parse(sessionStorage.getItem("onboardingForm")) || {};
    delete prev.geographic;
    sessionStorage.setItem("onboardingForm", JSON.stringify(prev));
  }
}, [nationwideSelected, selectedRegions, selectedStates, profileData]);


  // Starter plan code
  const isStarter = planInfo?.plan_code === "002" || planInfo?.isStarter;

  // Nationwide handler
  const handleNationwide = () => {
    if (isStarter) {
      setShowSavedSearchPopup(true);
      return;
    }
    setNationwideSelected(true);
    setSelectedRegions([]);
    setSelectedStates([]);
  };

  // Region handler
  const handleRegionChange = (value) => {
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

  // State handler
  const handleStateChange = (selected) => {
    if (isStarter && selected.length > 1) {
      setShowSavedSearchPopup(true);
      return;
    }
    setSelectedStates(selected);
    setNationwideSelected(false);
    setSelectedRegions([]);
  };

  useEffect(() => {
    if (!touched) return;
    if (
      !nationwideSelected &&
      selectedRegions.length === 0 &&
      selectedStates.length === 0
    ) {
      setSelectionError("Please select any of the three");
      setSelectionSuccess("");
    } else {
      setSelectionError("");
      setSelectionSuccess("The field is selected");
    }
  }, [nationwideSelected, selectedRegions, selectedStates, touched]);

  const handleSubmit = (e) => {

    console.log("🔥 Form submission:");
    console.log("nationwideSelected:", nationwideSelected);
    console.log("selectedRegions:", selectedRegions);
    console.log("selectedStates:", selectedStates);
    console.log("stateOptions:", stateOptions);
    e.preventDefault();
    setTouched(true);

    if (!nationwideSelected && selectedRegions.length === 0 && selectedStates.length === 0) {
      setSelectionError("Please select any of the three");
      return;
    }

    // ✅ FIX: Proper region ID mapping
   let nation_wide = false;
let regionIds = [];
let statesArray = [];

    if (nationwideSelected) {
  nation_wide = true;
  regionIds = [];
  statesArray = [];
} else if (selectedRegions.length > 0) {
  nation_wide = false;
  // Convert region names to IDs
  regionIds = selectedRegions
    .map(regionName => regionMapping[regionName])
    .filter(Boolean);
  statesArray = [];
} else if (selectedStates.length > 0) {
  nation_wide = false;
  regionIds = [];
  statesArray = selectedStates.map(state => {
    if (typeof state === 'object') {
      return parseInt(state.value || state.id);
    }
    return parseInt(state);
  });
}

    const geoData = {
  nation_wide: nation_wide,
  region: regionIds,
  states: statesArray
};

    dispatch(saveGeographicCoverage(geoData));
    navigate("/industry-categories");

    console.log("🚀 Final geoData:", geoData);
  };

  // 🆕 Handle Skip
  const handleSkip = () => {
    setSkipClicked(true);

    // Remove geographic from sessionStorage
    const prev = JSON.parse(sessionStorage.getItem("onboardingForm")) || {};
    delete prev.geographic;
    sessionStorage.setItem("onboardingForm", JSON.stringify(prev));

    navigate("/industry-categories");
  };


  const formFooter = {
    // back: {
    //   text: "Back",
    //   link: "/plan",
    // },
    next: {
      text: "Next",
    },
    skip: !isStarter
      ? {
        text: "Skip",
        link: "/industry-categories"
      }
      : undefined,
  };

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
              <FormRadio
                label="Nationwide"
                type="radio"
                name="region"
                value="Nationwide"
                delay={100}
                selectedValue={nationwideSelected ? "Nationwide" : ""}
                onChange={handleNationwide}
              />

              <div className="form-label font-t my-5">Select region</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
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

              <FormMultiSelect
                label="Select State"
                name="industries"
                placeholder="Choose State"
                options={stateOptions}
                value={selectedStates}
                onChange={handleStateChange}
                menuPlacement="auto"
              />

              <div style={{ marginTop: 14 }}>
                {selectionError && touched && (
                  <span className="flex items-center gap-1 text-red-400 text-sm">
                    <i className="far fa-times text-red-400"></i>
                    {selectionError}
                  </span>
                )}
                {selectionSuccess && !selectionError && touched && (
                  <span className="flex items-center gap-1 text-green-400 text-sm">
                    <i className="far fa-check text-green-400"></i>
                    {selectionSuccess}
                  </span>
                )}
              </div>
            </div>

            <FormFooter
              data={formFooter}
              onSkipClick={handleSkip} // 🆕 passed skip handler
            />
          </form>
        </div>
      </div>

      <div className="sticky top-0">
        <FormImg src={"geographic-coverage.png"} />
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
        onClose={() => setShowSavedSearchPopup(false)}
        title="Location Access Restricted"
        message="Your current plan doesn't allow access to this location filter. Upgrade to access all states and regions."
        upgradeButtonText="Upgrade Plan"
        cancelButtonText="Got It"
      />

    </ProcessWrapper>
  );
}

export default GeographicCoverage;













// import React, { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
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
// import SavedSearchPopup from "../components/SavedSearchPopup"; // Add this if not already
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
//   const { planInfo, isRestricted } = usePlan();


//   const [selectedRegions, setSelectedRegions] = useState([]);
//   const [nationwideSelected, setNationwideSelected] = useState(false);
//   const [selectedStates, setSelectedStates] = useState([]);
//   const [selectionError, setSelectionError] = useState("");
//   const [selectionSuccess, setSelectionSuccess] = useState("");
//   const [touched, setTouched] = useState(false);
//   const [stateOptions, setStateOptions] = useState([]);
//   const [regionOptions, setRegionOptions] = useState([]);
// const [regionMapping, setRegionMapping] = useState({}); // 🆕 ADD THIS
//   const [skipClicked, setSkipClicked] = useState(false); // 🆕 Skip flag




//   const [popupState, setPopupState] = useState({
//     isOpen: false,
//     title: "",
//     message: "",
//     featureName: "",
//     showUpgradeButton: true
//   });


//   const handleFeatureRestriction = (title, message, featureName, needsUpgrade = true) => {
//     setPopupState({
//       isOpen: true,
//       title: title || "Feature Restricted",
//       message: message || "This feature is not available in your current plan.",
//       featureName: featureName || "Premium Feature",
//       showUpgradeButton: needsUpgrade
//     });
//   };


//   const handleClosePopup = () => {
//     setPopupState(prev => ({
//       ...prev,
//       isOpen: false
//     }));
//   };


//   const handleUpgrade = () => {
//     navigate("/pricing");
//     handleClosePopup();
//   };


//   // Add this state for SavedSearchPopup
//   const [showSavedSearchPopup, setShowSavedSearchPopup] = useState(false);


//   useEffect(() => {
//     dispatch(fetchUserProfile());
//     console.log("🔥 Profile fetched on Geographic Coverage page");
//   }, [dispatch]);


//   useEffect(() => {
//     // current entry lock kar do
//     window.history.pushState(null, "", window.location.href);


//     const handleBack = () => {
//       window.history.go(1); // back dabane par same page par rakho
//     };


//     window.addEventListener("popstate", handleBack);
//     return () => window.removeEventListener("popstate", handleBack);
//   }, []);




//   // 🌐 Fetch regions from API
// // 🌐 Fetch regions from API
// useEffect(() => {
//   async function fetchRegions() {
//     try {
//       const data = await region();
//       console.log("🔥 Regions API response:", data);
//       if (Array.isArray(data)) {
//         // Store names for UI
//         setRegionOptions(data.map((item) => item.name));
       
//         // 🆕 Create name->id mapping
//         const mapping = {};
//         data.forEach((item) => {
//           mapping[item.name] = item.id;
//         });
//         setRegionMapping(mapping);
//         console.log("📍 Region mapping created:", mapping);
//       }
//     } catch (err) {
//       console.error("Error loading regions:", err);
//       setRegionOptions([]);
//       setRegionMapping({});
//     }
//   }


//   fetchRegions();
// }, []);


//   // 🔁 Load sessionStorage on first mount
//   useEffect(() => {
//     const saved = sessionStorage.getItem("onboardingForm");
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       const geo = parsed.geographic || {};
//       setSelectedRegions(geo.selectedRegions || []);
//       setNationwideSelected(geo.nationwideSelected || false);
//       setSelectedStates(geo.selectedStates || []);
//     }
//   }, []);


//   // 💾 Save to sessionStorage (only if not skipped)
//   useEffect(() => {
//     if (skipClicked) return;


//     const prev = JSON.parse(sessionStorage.getItem("onboardingForm")) || {};
//     const updated = {
//       ...prev,
//       geographic: {
//         selectedRegions,
//         nationwideSelected,
//         selectedStates,
//       },
//     };
//     sessionStorage.setItem("onboardingForm", JSON.stringify(updated));
//   }, [selectedRegions, nationwideSelected, selectedStates, skipClicked]);


//   // 🌐 Fetch states
//   useEffect(() => {
//     async function fetchStates() {
//       try {
//         const data = await getAllStates(); // ✅ use the service function
//         if (Array.isArray(data)) {
//           setStateOptions(
//             data.map((item) => ({
//               value: item.id,
//               label: item.name,
//             }))
//           );
//         }
//       } catch (err) {
//         setStateOptions([{ value: "", label: "Error loading states" }]);
//       }
//     }


//     fetchStates();
//   }, []);


//   // Starter plan code
//   const isStarter = planInfo?.plan_code === "002" || planInfo?.isStarter;


//   // Nationwide handler
//   const handleNationwide = () => {
//     if (isStarter) {
//       setShowSavedSearchPopup(true);
//       return;
//     }
//     setNationwideSelected(true);
//     setSelectedRegions([]);
//     setSelectedStates([]);
//   };


//   // Region handler
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


//   // State handler
//   const handleStateChange = (selected) => {
//     if (isStarter && selected.length > 1) {
//       setShowSavedSearchPopup(true);
//       return;
//     }
//     setSelectedStates(selected);
//     setNationwideSelected(false);
//     setSelectedRegions([]);
//   };


//   useEffect(() => {
//     if (!touched) return;
//     if (
//       !nationwideSelected &&
//       selectedRegions.length === 0 &&
//       selectedStates.length === 0
//     ) {
//       setSelectionError("Please select any of the three");
//       setSelectionSuccess("");
//     } else {
//       setSelectionError("");
//       setSelectionSuccess("The field is selected");
//     }
//   }, [nationwideSelected, selectedRegions, selectedStates, touched]);


//   const handleSubmit = (e) => {


//     console.log("🔥 Form submission:");
//     console.log("nationwideSelected:", nationwideSelected);
//     console.log("selectedRegions:", selectedRegions);
//     console.log("selectedStates:", selectedStates);
//     console.log("stateOptions:", stateOptions);
//     e.preventDefault();
//     setTouched(true);


//     if (!nationwideSelected && selectedRegions.length === 0 && selectedStates.length === 0) {
//       setSelectionError("Please select any of the three");
//       return;
//     }


//     // ✅ FIX: Proper region ID mapping
//     let nation_wide = false;
//     let regionIds = [];
//     let statesArray = [];


//     if (nationwideSelected) {
//   nation_wide = true;
//   regionIds = [];
//   statesArray = [];
// } else if (selectedRegions.length > 0) {
//   nation_wide = false;
//   // Convert region names to IDs
//   regionIds = selectedRegions
//     .map(regionName => regionMapping[regionName])
//     .filter(Boolean);
//   statesArray = [];
// } else if (selectedStates.length > 0) {
//   nation_wide = false;
//   regionIds = [];
//   statesArray = selectedStates.map(state => {
//     if (typeof state === 'object') {
//       return parseInt(state.value || state.id);
//     }
//     return parseInt(state);
//   });
// }


//     const geoData = {
//   nation_wide: nation_wide,
//   region: regionIds,
//   states: statesArray
// };


//     dispatch(saveGeographicCoverage(geoData));
//     navigate("/industry-categories");


//     console.log("🚀 Final geoData:", geoData);
//   };


//   // 🆕 Handle Skip
//   const handleSkip = () => {
//     setSkipClicked(true);


//     // Remove geographic from sessionStorage
//     const prev = JSON.parse(sessionStorage.getItem("onboardingForm")) || {};
//     delete prev.geographic;
//     sessionStorage.setItem("onboardingForm", JSON.stringify(prev));


//     navigate("/industry-categories");
//   };




//   const formFooter = {
//     // back: {
//     //   text: "Back",
//     //   link: "/plan",
//     // },
//     next: {
//       text: "Next",
//     },
//     skip: !isStarter
//       ? {
//         text: "Skip",
//         link: "/industry-categories"
//       }
//       : undefined,
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
//               <FormRadio
//                 label="Nationwide"
//                 type="radio"
//                 name="region"
//                 value="Nationwide"
//                 delay={100}
//                 selectedValue={nationwideSelected ? "Nationwide" : ""}
//                 onChange={handleNationwide}
//               />


//               <div className="form-label font-t my-5">Select region</div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
//                 {regionOptions.map((reg, i) => (
//                   <FormRadio
//                     key={i}
//                     type="checkbox"
//                     label={reg}
//                     name="region-multi"
//                     value={reg}
//                     selectedValues={selectedRegions}
//                     onChange={() => handleRegionChange(reg)}
//                     maxSelected={3}
//                     delay={i * 100}
//                   />
//                 ))}
//               </div>


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


//             <FormFooter
//               data={formFooter}
//               onSkipClick={handleSkip} // 🆕 passed skip handler
//             />
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