import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  saveGeographicCoverage,
  saveIndustryCategory,
} from "../redux/reducer/onboardingSlice";
import FormHeader from "../components/FormHeader";
import HeroHeading from "../components/HeroHeading";
import FormFooter from "../components/FormFooter";
import FormRadio from "../components/FormRadio";
import FormImg from "../components/FormImg";
import FormMultiSelect from "../components/FormMultiSelect";
import ProcessWrapper from "../components/ProcessWrapper";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios"; // Make sure your axios instance is imported

function GeographicCoverage() {
  const data = {
    title: "Where Should We Look?",
    para:
      "Select states, regions or industries so we only surface relevant bids.",
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

  const formFooter = {
    back: {
      text: "Back",
      link: "/plan",
    },
    next: {
      text: "Next",
      link: "/industry-categories",
    },
    skip: {
      text: "Skip",
      link: "/industry-categories",
    },
  };

  const regions = [
    "Northeast",
    "Northwest",
    "South",
    "Southeast",
    "Midwest",
    "West",
  ];

  const [selectedRegions, setSelectedRegions] = useState([]);
  const [nationwideSelected, setNationwideSelected] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectionError, setSelectionError] = useState("");
  const [selectionSuccess, setSelectionSuccess] = useState("");
  const [touched, setTouched] = useState(false);
  const [stateOptions, setStateOptions] = useState([]); // State for API states
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch states from API on mount
  useEffect(() => {
    async function fetchStates() {
      try {
        const res = await api.get("/auth/states/");
        // Assuming API returns: [{ id: 1, name: "California" }, ...]
        if (Array.isArray(res.data)) {
          setStateOptions(
            res.data.map((item) => ({
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
    setNationwideSelected(true);
    setSelectedRegions([]);
    setSelectedIndustries([]);
  };

  const handleRegionChange = (value) => {
    if (selectedRegions.includes(value)) {
      setSelectedRegions((prev) => prev.filter((v) => v !== value));
    } else if (selectedRegions.length < 3) {
      setSelectedRegions((prev) => [...prev, value]);
    }
    setNationwideSelected(false);
    setSelectedIndustries([]);
  };

  const handleIndustryChange = (selected) => {
    setSelectedIndustries(selected);
    setNationwideSelected(false);
    setSelectedRegions([]);
  };

  // Real-time validation on change, but only after first interaction
  React.useEffect(() => {
    if (!touched) return;
    if (
      !nationwideSelected &&
      selectedRegions.length === 0 &&
      selectedIndustries.length === 0
    ) {
      setSelectionError("Please select any of the three");
      setSelectionSuccess("");
    } else {
      setSelectionError("");
      setSelectionSuccess("The field is selected");
    }
  }, [nationwideSelected, selectedRegions, selectedIndustries, touched]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (
      !nationwideSelected &&
      selectedRegions.length === 0 &&
      selectedIndustries.length === 0
    ) {
      setSelectionError("Please select any of the three");
      setSelectionSuccess("");
      return;
    }

    const geoData = nationwideSelected
      ? { region: "Nationwide", states: [] }
      : selectedRegions.length > 0
      ? { region: "Region", states: selectedRegions }
      : { region: "", states: [] }; // If only industry selected

    const industryData = selectedIndustries;

    // Logging
    if (nationwideSelected) {
      console.log("Selected: Nationwide");
    } else if (selectedRegions.length > 0) {
      console.log("Selected regions:", selectedRegions);
    } else if (selectedIndustries.length > 0) {
      console.log("Selected industries only:", selectedIndustries);
    }

    // Save to Redux
    dispatch(saveGeographicCoverage(geoData));
    dispatch(saveIndustryCategory(industryData));

    navigate("/industry-categories");
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
              {/* Nationwide */}
              <FormRadio
                label="Nationwide"
                type="radio"
                name="region"
                value="Nationwide"
                delay={100}
                selectedValue={nationwideSelected ? "Nationwide" : ""}
                onChange={handleNationwide}
              />

              {/* Regions */}
              <div className="form-label font-t my-5">Select region wise</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* Industries (now States from API) */}
              <FormMultiSelect
                label="Or Select State"
                name="industries"
                placeholder="Choose State (Max 10)"
                options={stateOptions}
                value={selectedIndustries}
                onChange={handleIndustryChange}
                menuPlacement="auto" // <-- Add this line
              />
              <div style={{ marginTop: 14 }}>
                {selectionError && touched && (
                  <span className="flex items-center gap-1 text-red-400 text-sm">
                    <i className="far fa-times text-red-400"></i>
                    {/* <i class=""></i> */}
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

            <FormFooter data={formFooter} />
          </form>
        </div>
      </div>

      <div className="sticky top-0">
        <FormImg src={"geographic-coverage.png"} />
      </div>
    </ProcessWrapper>
  );
}

export default GeographicCoverage;
