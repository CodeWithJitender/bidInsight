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

  const regions = [
    "Northeast",
    "Northwest",
    "South",
    "Southeast",
    "Midwest",
    "West",
  ];



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

  const [skipClicked, setSkipClicked] = useState(false); // 🆕 Skip flag


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

  const handleNationwide = () => {
    console.log("🔥 Nationwide clicked, planInfo:", planInfo);
    console.log("🔥 Restrictions:", restrictions);

    // Check if it's Starter plan and restricted
    if (planInfo?.isStarter && restrictions?.geographic_nationwide) {
      console.log("🔥 Triggering nationwide restriction popup");
      validateAndExecute(
        'geographic_nationwide',
        (popupData) => {
          onFeatureRestriction(
            popupData.title || "🔒 Nationwide Coverage Locked",
            popupData.message || "Upgrade to Essentials plan to select nationwide coverage.",
            popupData.feature || "Geographic Nationwide",
            popupData.needsUpgrade || true
          );
        },
        () => {
          // Success callback - allow selection
          console.log("✅ Nationwide allowed");
          setNationwideSelected(true);
          setSelectedRegions([]);
          setSelectedStates([]);
        }
      );
      return;
    }

    // For non-restricted users
    setNationwideSelected(true);
    setSelectedRegions([]);
    setSelectedStates([]);
  };

  const handleRegionChange = (value) => {
    console.log("🔥 Region clicked:", value, "planInfo:", planInfo);

    // Check if it's Starter plan and restricted
    if (planInfo?.isStarter && restrictions?.geographic_region) {
      console.log("🔥 Triggering region restriction popup");
      validateAndExecute(
        'geographic_region',
        (popupData) => {
          onFeatureRestriction(
            popupData.title || "🔒 Regional Selection Locked",
            popupData.message || "Upgrade to Essentials plan to select specific regions.",
            popupData.feature || "Geographic Region",
            popupData.needsUpgrade || true
          );
        },
        () => {
          // Success callback - allow selection
          console.log("✅ Region selection allowed");
          if (selectedRegions.includes(value)) {
            setSelectedRegions((prev) => prev.filter((v) => v !== value));
          } else if (selectedRegions.length < 3) {
            setSelectedRegions((prev) => [...prev, value]);
          }
          setNationwideSelected(false);
          setSelectedStates([]);
        }
      );
      return;
    }

    // For non-restricted users
    if (selectedRegions.includes(value)) {
      setSelectedRegions((prev) => prev.filter((v) => v !== value));
    } else if (selectedRegions.length < 3) {
      setSelectedRegions((prev) => [...prev, value]);
    }
    setNationwideSelected(false);
    setSelectedStates([]);
  };

  const handleStateChange = (selected) => {
    console.log("🔥 States selected:", selected, "planInfo:", planInfo);

    // Check if it's Starter plan trying to select multiple states
    if (planInfo?.isStarter && selected.length > 1 && restrictions?.geographic_multi_state) {
      console.log("🔥 Triggering multi-state restriction popup");
      validateAndExecute(
        'geographic_multi_state',
        (popupData) => {
          onFeatureRestriction(
            popupData.title || "🔒 Multiple States Locked",
            popupData.message || "Upgrade to Essentials plan to select multiple states.",
            popupData.feature || "Geographic Multi State",
            popupData.needsUpgrade || true
          );
        },
        () => {
          // Success callback - allow selection
          console.log("✅ Multi-state selection allowed");
          setSelectedStates(selected);
          setNationwideSelected(false);
          setSelectedRegions([]);
        }
      );
      return;
    }

    // For non-restricted users or single state selection
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
    setTouched(true);

    if (
      !nationwideSelected &&
      selectedRegions.length === 0 &&
      selectedStates.length === 0
    ) {
      setSelectionError("Please select any of the three");
      setSelectionSuccess("");
      return;
    }

    const geoData = nationwideSelected
      ? { region: "Nationwide", states: [] }
      : selectedRegions.length > 0
        ? { region: "Region", states: selectedRegions }
        : selectedStates.length > 0
          ? { region: "State", states: selectedStates }
          : { region: "", states: [] };

    // const industryData = selectedIndustries;

    dispatch(saveGeographicCoverage(geoData));
    // dispatch(saveIndustryCategory(industryData));

    navigate("/industry-categories");
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
    skip: {
      text: "Skip",
      link: "/industry-categories"
    },
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
                {regions.map((reg, i) => (
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
                placeholder="Choose State (Max 10)"
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

    </ProcessWrapper>
  );
}

export default GeographicCoverage;
