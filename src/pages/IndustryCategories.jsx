import React, { useState, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveIndustryCategory } from "../redux/reducer/onboardingSlice";
import FormHeader from "../components/FormHeader";
import HeroHeading from "../components/HeroHeading";
import FormFooter from "../components/FormFooter";
import FormRadio2 from "../components/FormRadio2";
import FormImg from "../components/FormImg";
import ProcessWrapper from "../components/ProcessWrapper";
import { checkTTLAndClear } from "../utils/ttlCheck";
import { fetchIndustryCategories } from "../services/user.service";

// Static fallback data as array of objects
const fallbackIndustries = [
  { id: 1, name: "Agriculture, Forestry, Fishing and Hunting" },
  { id: 2, name: "Mining, Quarrying, and Oil and Gas Extraction" },
  { id: 3, name: "Utilities" },
  { id: 4, name: "Construction" },
  { id: 5, name: "Manufacturing" },
  { id: 6, name: "Wholesale Trade" },
  { id: 7, name: "Retail Trade" },
  { id: 8, name: "Transportation and Warehousing" },
  { id: 9, name: "Information" },
  { id: 10, name: "Finance and Insurance" },
  { id: 11, name: "Real Estate and Rental and Leasing" },
  { id: 12, name: "Professional, Scientific, and Technical Services" },
  { id: 13, name: "Management of Companies and Enterprises" },
  { id: 14, name: "Administrative and Support and Waste Management and Remediation Services" },
  { id: 15, name: "Educational Services" },
  { id: 16, name: "Health Care and Social Assistance" },
  { id: 17, name: "Arts, Entertainment, and Recreation" },
  { id: 18, name: "Accommodation and Food Services" },
  { id: 19, name: "Other Services (except Public Administration)" },
  { id: 20, name: "Public Administration" }
];

function IndustryCategories() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Static data configurations
  const data = {
    title: "Your Industry Focus",
    para: "Pick sectors where you excel. Our AI will learn your sweet spots!",
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
    activeStep: 3,
  };

  const formFooter = {
    back: {
      text: "Back",
      link: "/geographic-coverage",
    },
    next: {
      text: "Next",
    },
    skip: {
      text: "Skip",
      link: "/help-our-ai",
    },
  };

  // State management
  const [allIndustries, setAllIndustries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [showValidation, setShowValidation] = useState(false);
  const [skipClicked, setSkipClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial setup and data fetching
  useEffect(() => {
    // checkTTLAndClear(navigate);
    loadIndustryCategories();
  }, []);

  // Load industry categories from API
  const loadIndustryCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const industries = await fetchIndustryCategories();
      
      if (Array.isArray(industries) && industries.length > 0 && industries[0].id) {
        // Use API data directly if it has id and name
        setAllIndustries(industries);
      } else {
        setAllIndustries(fallbackIndustries);
      }
    } catch (err) {
      setError("Failed to load industries. Using default categories.");
      setAllIndustries(fallbackIndustries);
    } finally {
      setIsLoading(false);
    }
  };

  // Load saved industry selection from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("onboardingForm");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.industry && parsed.industry.selectedIndustry) {
          setSelectedIndustry(parsed.industry.selectedIndustry);
        }
      } catch (err) {
        console.error("Error parsing saved form data:", err);
      }
    }
  }, []);

  // Save to sessionStorage whenever selection changes
  useEffect(() => {
    if (skipClicked || !selectedIndustry) return;

    try {
      const prev = JSON.parse(sessionStorage.getItem("onboardingForm")) || {};
      const updated = {
        ...prev,
        industry: {
          selectedIndustry,
        },
      };
      sessionStorage.setItem("onboardingForm", JSON.stringify(updated));
    } catch (err) {
      console.error("Error saving form data:", err);
    }
  }, [selectedIndustry, skipClicked]);

  // Filter industries based on search term
  const filteredIndustries = useMemo(() => {
    let filtered = allIndustries;
    
    // Apply search filter if search term exists
    if (searchTerm) {
      filtered = allIndustries.filter((industry) =>
        industry.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      // If no search term, show only first 6 industries
      filtered = allIndustries.slice(0, 6);
    }
    
    // Move selected industry to top if it exists in filtered results
    if (selectedIndustry && filtered.some(i => i.id === selectedIndustry.id)) {
      const selectedIndex = filtered.findIndex(i => i.id === selectedIndustry.id);
      const reordered = [
        selectedIndustry,
        ...filtered.slice(0, selectedIndex),
        ...filtered.slice(selectedIndex + 1)
      ];
      return reordered;
    }
    
    return filtered;
  }, [searchTerm, allIndustries, selectedIndustry]);
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowValidation(true);

    if (selectedIndustry) {
      dispatch(saveIndustryCategory([selectedIndustry])); // Save full object
      console.log("✅ Selected Industry (saved to Redux):", selectedIndustry);
      navigate("/help-our-ai");
    }
  };

  // Handle skip action
  const handleSkip = () => {
    setSkipClicked(true);

    try {
      const prev = JSON.parse(sessionStorage.getItem("onboardingForm")) || {};
      delete prev.industry; // Remove just this step's data
      sessionStorage.setItem("onboardingForm", JSON.stringify(prev));
    } catch (err) {
      console.error("Error updating form data on skip:", err);
    }

    navigate("/help-our-ai");
  };

  // Loading state
  if (isLoading) {
    return (
      <ProcessWrapper>
        <div className="form-left">
          <div className="pe-3 flex flex-col justify-between h-full">
            <div>
              <FormHeader {...formHeader} />
              <HeroHeading data={data} />
            </div>
            
            <div className="forn-container flex flex-col h-full justify-center items-center">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-lg">Loading..</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="sticky top-0">
          <FormImg src={"industry-categories.png"} />
        </div>
      </ProcessWrapper>
    );
  }

  return (
    <ProcessWrapper>
      <div className="form-left">
        <div className="pe-3 flex flex-col justify-between h-full">
          <div>
            <FormHeader {...formHeader} />
            <HeroHeading data={data} />
          </div>

          <form
            className="forn-container flex flex-col h-full justify-between"
            onSubmit={handleSubmit}
          >
            <div>
              {/* Error message if API failed */}
              {error && (
                <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500 rounded-lg text-yellow-300 text-sm">
                  <i className="fal fa-exclamation-triangle mr-2"></i>
                  {error}
                </div>
              )}

              {/* Search Input */}
              <div className="mb-6 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search your industry"
                  className="w-full rounded-xl py-3 px-5 pr-12 bg-transparent border border-white text-white placeholder:text-white focus:outline-none"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50">
                  <i className="fas fa-search"></i>
                </span>
              </div>

              <div className="font-t text-white text-p font-inter mb-4 text-center">
                {searchTerm ? "Search Results" : "Popular Industries"}
              </div>

              {/* Industry Grid */}
              <div className="forn-container h-[400px] pe-2 overflow-y-auto">
                {filteredIndustries.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredIndustries.map((industry, i) => (
                      <FormRadio2
                        key={industry.id}
                        label={industry.name}
                        name="industry"
                        value={industry.id}
                        selectedValue={selectedIndustry?.id}
                        onChange={() => setSelectedIndustry(industry)}
                        delay={i * 100}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-white text-sm text-center py-8">
                    {searchTerm ? "No industries found matching your search." : "No industries available."}
                  </div>
                )}
              </div>

              {/* Real-time validation */}
              {showValidation && (
                <div className="flex items-center gap-2 mt-4 font-semibold">
                  {selectedIndustry ? (
                    <span className="text-green-400 text-[14px]">
                      <i className="fal fa-check"></i> This field is selected
                    </span>
                  ) : (
                    <span className="text-red-400 text-[14px]">
                      <i className="fal fa-times"></i> This field is required
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Footer with submit button */}
            <FormFooter
              data={formFooter}
              onSkipClick={handleSkip}
            />
          </form>
        </div>
      </div>

      <div className="sticky top-0">
        <FormImg src={"industry-categories.png"} />
      </div>
    </ProcessWrapper>
  );
}

export default IndustryCategories;
