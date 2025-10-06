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
  const [regionLoading, setRegionLoading] = useState(true); // 🆕 Loading state
  const [regionMapping, setRegionMapping] = useState({}); // 🆕 ADD THIS
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [skipClicked, setSkipClicked] = useState(false); // 🆕 Skip flag
  // After line 64 (after const [stateOptions, setStateOptions] = useState([]);)
  const profileData = useSelector((state) => state.profile.profile);
  console.log(profileData?.profile?.states, "🔥 Profile data in GeographicCoverage");

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
      setRegionLoading(true);
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
      } finally {
        setRegionLoading(false); // 🆕 loading end
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
    // ✅ Check sessionStorage FIRST
    const saved = sessionStorage.getItem("onboardingForm");
    if (saved) {
      const parsed = JSON.parse(saved);
      const geo = parsed.geographic || {};

      // If sessionStorage has data, use it (user made changes)
      if (geo.selectedRegions || geo.nationwideSelected || geo.selectedStates) {
        setSelectedRegions(geo.selectedRegions || []);
        setNationwideSelected(geo.nationwideSelected || false);
        setSelectedStates(geo.selectedStates || []);
        console.log("✅ Loaded from sessionStorage (user changes)");
        return; // Don't prefill from Redux
      }
    }

    // If no sessionStorage data, we'll prefill from Redux in next useEffect
  }, []); // ✅ Run only once on mount
  // 💾 Save to sessionStorage (only if not skipped)
  useEffect(() => {
    if (skipClicked) return;

    // ✅ ALWAYS save to sessionStorage when user makes changes
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
  // ✅ Removed profileData dependency

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
  // useEffect(() => {


  //   const apiProfile = profileData?.profile;
  //   console.log("🔥 useEffect Check:", {
  //   hasApiProfile: !!apiProfile,
  //   stateOptionsLength: stateOptions.length,
  //   regionMappingKeys: Object.keys(regionMapping).length,
  //   isDataLoaded,
  //   apiProfileStates: apiProfile?.states
  // });

  //   if (
  //     apiProfile &&
  //     stateOptions.length > 0 &&
  //     Object.keys(regionMapping).length > 0 &&
  //     !isDataLoaded // Only run once
  //   ) {
  //     // ✅ Check if sessionStorage already has data
  //     const saved = sessionStorage.getItem("onboardingForm");
  //     if (saved) {
  //       const parsed = JSON.parse(saved);
  //       if (parsed.geographic) {
  //         console.log("⏭️ SessionStorage exists - skipping Redux prefill");
  //         setIsDataLoaded(true);
  //         return; // User ne changes kiye hain, Redux mat use karo
  //       }
  //     }

  //     console.log("🔥 FULL profileData:", JSON.stringify(profileData, null, 2));

  //     console.log("📝 PREFILLING from Redux Profile");

  //     // const apiProfile = profileData.profile;
  //     console.log(apiProfile, "🔥 apiProfile");
  //     console.log("🔍 Raw API Data:", {
  //       nation_wide: apiProfile.nation_wide,
  //       region: apiProfile.region,
  //       states: apiProfile.states
  //     });

  //     // Force reset ALL states
  //     setNationwideSelected(false);
  //     setSelectedRegions([]);
  //     setSelectedStates([]);

  //     // Small delay for state batching
  //     setTimeout(() => {
  //       // Check nationwide - STRICT true check
  //       if (apiProfile.nation_wide === true) {
  //         console.log("✅ Setting Nationwide = TRUE");
  //         setNationwideSelected(true);
  //         setIsDataLoaded(true);
  //         return;
  //       }

  //       // Check regions
  //       if (apiProfile.region && apiProfile.region.length > 0) {
  //         // Handle both formats - objects OR IDs
  //         const regionIds = apiProfile.region.map(item => {
  //           if (typeof item === 'object' && item.id) {
  //             return item.id;
  //           }
  //           return item;
  //         });

  //         console.log("🔍 Extracted Region IDs:", regionIds);

  //         // Map IDs to names
  //         const regionNames = regionIds
  //           .map(regionId => {
  //             const regionName = Object.keys(regionMapping).find(
  //               name => regionMapping[name] === regionId
  //             );
  //             console.log(`Mapping ID ${regionId} -> ${regionName}`);
  //             return regionName;
  //           })
  //           .filter(Boolean);

  //         if (regionNames.length > 0) {
  //           console.log("✅ Setting regions:", regionNames);
  //           setSelectedRegions(regionNames);
  //           setIsDataLoaded(true);
  //           return;
  //         }
  //       }

  //       // Check states
  //       if (apiProfile.states && apiProfile.states.length > 0) {
  //         const selectedStateObjects = apiProfile.states.map(state => {
  //           const stateId = typeof state === 'object' ? state.id : state;
  //           return stateOptions.find(opt => opt.value === stateId) || {
  //             value: stateId,
  //             label: typeof state === 'object' ? state.name : `State ${stateId}`
  //           };
  //         });

  //         console.log("✅ Setting states:", selectedStateObjects);
  //         setSelectedStates(selectedStateObjects);
  //       }

  //       setIsDataLoaded(true);
  //     }, 100);
  //   }
  // }, [profileData?.profile, stateOptions, regionMapping, isDataLoaded]);


  // ⭐ NEW: Prefill from Redux profile data
useEffect(() => {
  const apiProfile = profileData?.profile; // ✅ Just one .profile
  
  console.log("🔥 useEffect Check:", {
    hasApiProfile: !!apiProfile,
    stateOptionsLength: stateOptions.length,
    regionMappingKeys: Object.keys(regionMapping).length,
    isDataLoaded,
    apiProfileStates: apiProfile?.states
  });

  if (
    apiProfile && // ✅ Changed from profileData?.profile
    stateOptions.length > 0 &&
    Object.keys(regionMapping).length > 0 &&
    !isDataLoaded
  ) {
    // Check sessionStorage
    const saved = sessionStorage.getItem("onboardingForm");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.geographic) {
        console.log("⏭️ SessionStorage exists - skipping Redux prefill");
        setIsDataLoaded(true);
        return;
      }
    }

    console.log("📝 PREFILLING from Redux Profile");
    console.log("🔍 Raw API Data:", {
      nation_wide: apiProfile.nation_wide,
      region: apiProfile.region,
      states: apiProfile.states
    });

    // Reset states
    setNationwideSelected(false);
    setSelectedRegions([]);
    setSelectedStates([]);

    setTimeout(() => {
      // Check nationwide
      if (apiProfile.nation_wide === true) {
        console.log("✅ Setting Nationwide = TRUE");
        setNationwideSelected(true);
        setIsDataLoaded(true);
        return;
      }

      // Check regions
      if (apiProfile.region && apiProfile.region.length > 0) {
        const regionIds = apiProfile.region.map(item => 
          typeof item === 'object' ? item.id : item
        );

        const regionNames = regionIds
          .map(regionId => 
            Object.keys(regionMapping).find(name => regionMapping[name] === regionId)
          )
          .filter(Boolean);

        if (regionNames.length > 0) {
          console.log("✅ Setting regions:", regionNames);
          setSelectedRegions(regionNames);
          setIsDataLoaded(true);
          return;
        }
      }

      // Check states
      if (apiProfile.states && apiProfile.states.length > 0) {
        const selectedStateObjects = apiProfile.states.map(state => {
          const stateId = typeof state === 'object' ? state.id : state;
          return stateOptions.find(opt => opt.value === stateId) || {
            value: stateId,
            label: typeof state === 'object' ? state.name : `State ${stateId}`
          };
        });

        console.log("✅ Setting states:", selectedStateObjects);
        setSelectedStates(selectedStateObjects);
      }

      setIsDataLoaded(true);
    }, 100);
  }
}, [profileData?.profile, stateOptions, regionMapping, isDataLoaded]);
// ^^^^^^^^^^^^^^^^^^^ ✅ Changed dependency too

  // Starter plan code
  const isStarter = planInfo?.plan_code === "002" || planInfo?.isStarter;

  // ✅ PROPERLY FIXED: Nationwide handler with correct toggle logic
  const handleNationwide = () => {
    if (isStarter) {
      setShowSavedSearchPopup(true);
      return;
    }

    // Clear selections whenever toggling nationwide
    setNationwideSelected((prev) => !prev);
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
    e.preventDefault();

    // Proper region ID mapping
    let nation_wide = false;
    let regionIds = [];
    let statesArray = [];

    if (nationwideSelected) {
      nation_wide = true;
    } else if (selectedRegions.length > 0) {
      regionIds = selectedRegions
        .map(regionName => regionMapping[regionName])
        .filter(Boolean);
    } else if (selectedStates.length > 0) {
      statesArray = selectedStates.map(state =>
        typeof state === 'object' ? parseInt(state.value || state.id) : parseInt(state)
      );
    }

    const geoData = {
      nation_wide,
      region: regionIds,
      states: statesArray
    };

    dispatch(saveGeographicCoverage(geoData));

    // Navigate next page
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
    // skip: !isStarter
    //   ? {
    //     text: "Skip",
    //     link: "/industry-categories"
    //   }
    //   : undefined,
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
              {/* // Replace your current FormRadio with this wrapper */}
              <div
                onClick={handleNationwide}
                className="cursor-pointer"
              >
                <FormRadio
                  label="Nationwide"
                  type="radio"
                  name="region"
                  value="Nationwide"
                  delay={100}
                  selectedValue={nationwideSelected ? "Nationwide" : ""}
                  onChange={() => { }} // Empty handler, parent div handles click
                />
              </div>

              <div className="form-label font-t my-5">Select region</div>


              {regionLoading ? ( // 🆕 loading check
                <div className="text-gray-300 flex items-center justify-center h-40 text-lg mb-3">Loading regions...</div>
              ) : (
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
              )}

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










