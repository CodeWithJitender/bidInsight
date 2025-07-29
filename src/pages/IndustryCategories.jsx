import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveIndustryCategory } from "../redux/reducer/onboardingSlice";

import FormHeader from "../components/FormHeader";
import HeroHeading from "../components/HeroHeading";
import FormFooter from "../components/FormFooter";
import FormRadio2 from "../components/FormRadio2";
import FormImg from "../components/FormImg";
import ProcessWrapper from "../components/ProcessWrapper";

function IndustryCategories() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const allIndustries = [
    "Agriculture, Forestry, Fishing and Hunting",
    "Mining, Quarrying, Oil and Gas Extraction",
    "Utilities",
    "Construction",
    "Manufacturing",
    "Wholesale Trade",
    "Information Technology",
    "Health Care and Social Assistance",
    "Finance and Insurance",
    "Real Estate and Rental Leasing",
    "Education Services",
    "Transportation and Warehousing",
    "Retail Trade",
    "Professional, Scientific, and Technical Services",
    "Arts, Entertainment, and Recreation",
    "Accommodation and Food Services",
    "Administrative and Support Services",
    "Public Administration",
    "Other Services (except Public Administration)",
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [showValidation, setShowValidation] = useState(false);

  const filteredIndustries = useMemo(() => {
    if (!searchTerm) return allIndustries.slice(0, 6);
    return allIndustries.filter((ind) =>
      ind.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowValidation(true);

    if (selectedIndustry) {
      dispatch(saveIndustryCategory([selectedIndustry]));
      console.log("✅ Selected Industry (saved to Redux):", selectedIndustry);
      navigate("/help-our-ai");
    }
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
            className="forn-container flex flex-col h-full justify-between"
            onSubmit={handleSubmit} // ✅ handled properly
          >
            <div>
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

              {/* Grid */}
              <div className="forn-container h-[400px] pe-2 overflow-y-auto">
                {filteredIndustries.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredIndustries.map((industry, i) => (
                      <FormRadio2
                        key={i}
                        label={industry}
                        name="industry"
                        value={industry}
                        selectedValue={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        delay={i * 100}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-white text-sm">No industries found.</div>
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

            {/* Footer with button type="submit" */}
            <FormFooter
              data={formFooter}
              onNextClick={() => {}} // no need anymore, submit is handled above
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
