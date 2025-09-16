import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Trash2, Search, ChevronDown, ChevronUp } from "lucide-react";
// 👇 Import the real API function
import { getAllStates } from "../../services/user.service";
import { useSelector, useDispatch } from "react-redux";
import FeatureRestrictionPopup from "../FeatureRestrictionPopup"; // adjust path if needed
import SavedSearchPopup from "../SavedSearchPopup"; // path adjust karo

// Mock local entities data
const LOCAL_ENTITIES = [
  { name: "City" },
  { name: "County" },
  { name: "District" },
  { name: "Municipal Authority" },
  { name: "School District" },
  { name: "Special District" },
  { name: "Township" }
];

const LocationTab = ({ filters = {}, setFilters = () => { } }) => {
  console.log("🔥 LocationTab received filters:", filters);

  // 🔥 FIXED: Properly initialize state from filters.location structure
  const initializeLocationState = (locationFilter) => {
    if (!locationFilter) {
      return {
        federal: false,
        states: [],
        local: []
      };
    }

    // Handle different possible structures
    if (typeof locationFilter === 'object' && locationFilter.federal !== undefined) {
      // New structure: { federal: boolean, states: [], local: [] }
      return {
        federal: locationFilter.federal || false,
        states: locationFilter.states || [],
        local: locationFilter.local || []
      };
    } else if (Array.isArray(locationFilter)) {
      // Old structure: just an array of states
      return {
        federal: false,
        states: locationFilter,
        local: []
      };
    }

    return {
      federal: false,
      states: [],
      local: []
    };
  };

  // State management - initialize from filters
  const [locationState, setLocationState] = useState(() =>
    initializeLocationState(filters.location)
  );

  // Dropdown states
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [localDropdownOpen, setLocalDropdownOpen] = useState(false);

  // Search states
  const [stateSearchTerm, setStateSearchTerm] = useState("");
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  // Data states
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Plan and profile data from Redux
  const planCode = useSelector(state => state.profile?.profile?.subscription_plan?.plan_code);
  const activeAddonState = useSelector(state => state.profile?.profile?.subscription_plan?.active_addon?.state);

  const profileStates = useSelector(state => state.profile?.profile?.profile?.states) || [];
  console.log(activeAddonState)
  const isEssentialPlan = planCode === "003";

  // 🔥 CRITICAL: Sync with external filters when they change
  useEffect(() => {
    console.log("🔥 Syncing LocationTab state with filters:", filters.location);
    const newLocationState = initializeLocationState(filters.location);
    setLocationState(newLocationState);
  }, [filters.location]);

  // Fetch states from API
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoading(true);
        const response = await getAllStates();
        const sorted = response.sort((a, b) =>
          (a.name || a).toLowerCase().localeCompare((b.name || b).toLowerCase())
        );
        setStates(sorted);
      } catch (error) {
        console.error("Failed to fetch states:", error);
        setStates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStates();
  }, []);

  // Filtered data
  const filteredStates = useMemo(() => {
    return states.filter((state) =>
      (state.name || state).toLowerCase().includes(stateSearchTerm.toLowerCase())
    );
  }, [stateSearchTerm, states]);

  const filteredLocal = useMemo(() => {
    return LOCAL_ENTITIES.filter((entity) =>
      entity.name.toLowerCase().includes(localSearchTerm.toLowerCase())
    );
  }, [localSearchTerm]);

  // Selection helpers
  const isAllStatesSelected = useMemo(() => {
    return filteredStates.length > 0 &&
      filteredStates.every(state => locationState.states.includes(state.name || state));
  }, [filteredStates, locationState.states]);

  const isAllLocalSelected = useMemo(() => {
    return filteredLocal.length > 0 &&
      filteredLocal.every(entity => locationState.local.includes(entity.name));
  }, [filteredLocal, locationState.local]);

  // 🔥 CRITICAL: Update filters function that properly structures the data
  const updateLocationFilters = useCallback((newLocationState) => {
    console.log("🔥 LocationTab updating filters with:", newLocationState);

    setLocationState(newLocationState);

    // Update the parent component's filters
    setFilters(prevFilters => ({
      ...prevFilters,
      location: newLocationState
    }));

    // 🔥 IMPORTANT: Generate backend URL parameters
    generateAndLogUrlParams(newLocationState);
  }, [setFilters]);

  // 🔥 Generate URL parameters for backend
  // Updated LocationTab generateAndLogUrlParams function
  const generateAndLogUrlParams = (locationData) => {
    const params = new URLSearchParams();
    const entityTypes = [];

    console.log("Generating URL params for:", locationData);

    // Collect entity types and their parameters
    if (locationData.federal) {
      entityTypes.push('Federal');
      console.log("Added Federal");
    }

    if (locationData.states && locationData.states.length > 0) {
      entityTypes.push('State');
      params.append('state', locationData.states.join(','));
      console.log("Added States: state=" + locationData.states.join(','));
    }

    if (locationData.local && locationData.local.length > 0) {
      entityTypes.push('Local');
      params.append('local', locationData.local.join(','));
      console.log("Added Local: local=" + locationData.local.join(','));
    }

    // Add single comma-separated entity_type parameter
    if (entityTypes.length > 0) {
      params.append('entity_type', entityTypes.join(','));
      console.log("Added entity_type=" + entityTypes.join(','));
    }

    console.log("Complete URL params:", params.toString());
    return params.toString();
  };

  // Federal handlers
  const toggleFederal = useCallback(() => {
    const newLocationState = {
      ...locationState,
      federal: !locationState.federal
    };

    console.log("🔥 Federal toggled:", !locationState.federal);
    updateLocationFilters(newLocationState);
  }, [locationState, updateLocationFilters]);

  // State handlers
  const toggleState = useCallback((stateName) => {
    // If on Starter and already 1 state selected, show popup
    if (planCode === "002" && locationState.states.length >= 1 && !locationState.states.includes(stateName)) {
      setShowRestrictionPopup(true);
      return;
    }

    const newStates = locationState.states.includes(stateName)
      ? locationState.states.filter(s => s !== stateName)
      : [...locationState.states, stateName];

    const newLocationState = {
      ...locationState,
      states: newStates
    };

    console.log("🔥 State toggled:", stateName, "New states:", newStates);
    updateLocationFilters(newLocationState);
  }, [planCode, locationState.states, updateLocationFilters]);

  const toggleAllStates = useCallback(() => {
    const visibleStateNames = filteredStates.map(state => state.name || state);
    const newStates = isAllStatesSelected
      ? locationState.states.filter(s => !visibleStateNames.includes(s))
      : Array.from(new Set([...locationState.states, ...visibleStateNames]));

    const newLocationState = {
      ...locationState,
      states: newStates
    };

    console.log("🔥 All states toggled. New states:", newStates);
    updateLocationFilters(newLocationState);
  }, [isAllStatesSelected, locationState, filteredStates, updateLocationFilters]);

  // Local handlers
  const toggleLocal = useCallback((entityName) => {
    const newLocal = locationState.local.includes(entityName)
      ? locationState.local.filter(e => e !== entityName)
      : [...locationState.local, entityName];

    const newLocationState = {
      ...locationState,
      local: newLocal
    };

    console.log("🔥 Local entity toggled:", entityName, "New local:", newLocal);
    updateLocationFilters(newLocationState);
  }, [locationState, updateLocationFilters]);

  const toggleAllLocal = useCallback(() => {
    const visibleLocalNames = filteredLocal.map(entity => entity.name);
    const newLocal = isAllLocalSelected
      ? locationState.local.filter(l => !visibleLocalNames.includes(l))
      : Array.from(new Set([...locationState.local, ...visibleLocalNames]));

    const newLocationState = {
      ...locationState,
      local: newLocal
    };

    console.log("🔥 All local toggled. New local:", newLocal);
    updateLocationFilters(newLocationState);
  }, [isAllLocalSelected, locationState, filteredLocal, updateLocationFilters]);

  // Clear handlers
  const clearAllSelections = useCallback(() => {
    const clearedState = {
      federal: false,
      states: [],
      local: []
    };

    console.log("🔥 Clearing all location selections");
    updateLocationFilters(clearedState);
  }, [updateLocationFilters]);

  const clearStates = useCallback(() => {
    const newLocationState = {
      ...locationState,
      states: []
    };

    console.log("🔥 Clearing all states");
    updateLocationFilters(newLocationState);
  }, [locationState, updateLocationFilters]);

  const clearLocal = useCallback(() => {
    const newLocationState = {
      ...locationState,
      local: []
    };

    console.log("🔥 Clearing all local entities");
    updateLocationFilters(newLocationState);
  }, [locationState, updateLocationFilters]);

  // Get total selected count
  const totalSelected = useMemo(() => {
    return (locationState.federal ? 1 : 0) + locationState.states.length + locationState.local.length;
  }, [locationState.federal, locationState.states.length, locationState.local.length]);



  // Enforce single state selection for Starter plan
  useEffect(() => {
    if (planCode === "002" && (profileStates.length > 0 || activeAddonState)) {

      const selectedStates = [];
      // Only select the first state (Starter plan allows 1)

      if (profileStates.length > 0) {
        selectedStates.push(profileStates[0].name);
      }

      if (activeAddonState && !selectedStates.includes(activeAddonState.name)) {
        selectedStates.push(activeAddonState.name);
      }


      setLocationState(prev => ({
        ...prev,
        federal: true, // <-- Yeh line add karo!
        states: selectedStates
      }));
      setFilters(prev => ({
        ...prev,
        location: {
          ...prev.location,
          federal: true, // <-- Yeh bhi add karo!
          states: selectedStates
        }
      }));
    }
  }, [planCode, profileStates, activeAddonState, setFilters]);



  const [showRestrictionPopup, setShowRestrictionPopup] = useState(false);
  const [showSavedSearchPopup, setShowSavedSearchPopup] = useState(false);

  // Redux state for saved search popup
  const showSavedSearchPopupRedux = useSelector(state => state.ui?.showSavedSearchPopup);

  // Effect to handle saved search popup
  useEffect(() => {
    if (showSavedSearchPopupRedux) {
      setShowSavedSearchPopup(true);
      // Optionally, dispatch an action to reset the flag here
    }
  }, [showSavedSearchPopupRedux]);

  // State/local click handler:
  const handleStateClick = (stateName) => {
    if (profileStates.length === 0) {
      setShowSavedSearchPopup(true);
      return;
    }
    // ...baaki normal logic...
  };

  const handleLocalClick = () => {
    setShowSavedSearchPopup(true);
  };

  // Bids fetching function (example)
  const fetchBids = async () => {
    try {
      await getBids(...params);
    } catch (error) {
      if (
        error.response &&
        error.response.status === 403 &&
        error.response.data?.detail?.includes("Your subscription plan only allow filtering")
      ) {
        setShowSavedSearchPopup(true);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Select Location</h1>
          {totalSelected > 0 && (
            <button
              onClick={clearAllSelections}
              className="px-4 py-2 text-sm font-medium text-blue-500 hover:text-blue-700  rounded-lg transition-colors duration-200"
            >
              Clear All ({totalSelected})
            </button>
          )}
        </div>

        {/* Selected items summary */}
        <div className="flex flex-wrap gap-2">
          {locationState.federal && (
            <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-black rounded-full text-sm">
              <span>Federal</span>
              <button
                onClick={toggleFederal}
                className="text-blue-600 hover:text-blue-800"
                aria-label="Remove Federal"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}

          {locationState.states.map((state) => (
            <div key={state} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-black  rounded-full text-sm">
              <span>{state}</span>
              <button
                onClick={() => toggleState(state)}
                className="text-blue-600 hover:text-blue-800"
                aria-label={`Remove ${state}`}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}

          {locationState.local.map((entity) => (
            <div key={entity} className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-black rounded-full text-sm">
              <span>{entity}</span>
              <button
                onClick={() => toggleLocal(entity)}
                className="text-purple-600 hover:text-purple-800"
                aria-label={`Remove ${entity}`}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* Federal Section */}
        {/* ✅ Wrapper add karo */}
        <div className={`bg-white rounded-lg border-2 border-primary overflow-hidden p-4`}>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="federal"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              checked={locationState.federal}
              onChange={toggleFederal}
            />
            <label
              htmlFor="federal"
              className="text-lg font-medium text-gray-900 cursor-pointer"
            >
              Federal
            </label>
          </div>
        </div>



        {/* State Section */}
        <div className="bg-white rounded-lg border-2 border-primary overflow-hidden">
          <div
            className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="state-header"
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                checked={locationState.states.length > 0}
                onChange={(e) => {
                  e.stopPropagation();
                  // Starter plan: block select all if more than 1 state
                  if (
                    planCode === "002" &&
                    profileStates.length > 0 &&
                    filteredStates.some(
                      (state) => (state.name || state) !== profileStates[0].name
                    )
                  ) {
                    setShowSavedSearchPopup(true);
                    return;
                  }
                  toggleAllStates();
                }}
                ref={(el) => {
                  if (el) {
                    el.indeterminate = locationState.states.length > 0 && !isAllStatesSelected;
                  }
                }}
              />
              <label
                htmlFor="state-header"
                className="text-lg font-medium text-gray-900 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                State ({locationState.states.length})
              </label>
            </div>

            <div className="flex items-center gap-2">
              {locationState.states.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearStates();
                  }}
                  className="text-sm text-blue-500 hover:text-blue-700 underline"
                >
                  Clear All
                </button>
              )}
              <div className="p-1 hover:bg-gray-100 rounded">
                {stateDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
          </div>

          {stateDropdownOpen && (
            <div className="p-4">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search states..."
                  className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  value={stateSearchTerm}
                  onChange={(e) => setStateSearchTerm(e.target.value)}
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>

              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading states...</div>
                ) : filteredStates.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No states found</div>
                ) : (
                  filteredStates.map((state) => {
                    const name = state.name || state;
                    const checked = locationState.states.includes(name);
                    return (
                      <label
                        key={name}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                          checked={checked}
                          onChange={() => {
                            // Starter plan: only allow profileStates[0].name
                            if (
                              planCode === "002" &&
                              profileStates.length > 0 &&
                              name !== profileStates[0].name
                            ) {
                              setShowSavedSearchPopup(true);
                              return;
                            }
                            toggleState(name);
                          }}
                          disabled={profileStates.length === 0}
                        />
                        <span className="text-gray-900">{name}</span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Local Section */}
        <div className="relative">
          <div className={`bg-white rounded-lg border-2 border-primary overflow-hidden ${isEssentialPlan ? 'blur-[2px]' : ''}`}>
            <div
              className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => {
                if (isEssentialPlan) return;
                if (planCode === "002" || profileStates.length === 0) {
                  setShowSavedSearchPopup(true);
                  return;
                }
                setLocalDropdownOpen(!localDropdownOpen);
              }}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="local-header"
                  disabled={isEssentialPlan}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                  checked={locationState.local.length > 0}
                  onChange={(e) => {
                    e.stopPropagation();
                    if (planCode === "002" || profileStates.length === 0) {
                      setShowSavedSearchPopup(true);
                      return;
                    }
                    toggleAllLocal();
                  }}
                  ref={(el) => {
                    if (el) {
                      el.indeterminate = locationState.local.length > 0 && !isAllLocalSelected;
                    }
                  }}
                />
                <label
                  htmlFor="local-header"
                  className="text-lg font-medium text-gray-900 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Local ({locationState.local.length})
                </label>
              </div>

              <div className="flex items-center gap-2">
                {locationState.local.length > 0 && !isEssentialPlan && ( // ✅ !isEssentialPlan ADD KARO
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearLocal();
                    }}
                    className="text-sm text-blue-500 hover:text-blue-700 underline"
                  >
                    Clear All
                  </button>
                )}
                <div className="p-1 hover:bg-gray-100 rounded">
                  {localDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
            </div>

            {localDropdownOpen && (
              <div className="p-4">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search local entities..."
                    className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>

                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                  {planCode === "002" || profileStates.length === 0 ? (
                    <div className="bg-white rounded-lg border-2 border-primary overflow-hidden opacity-50 pointer-events-none select-none">
                      <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <span className="text-lg font-medium text-gray-400">Local (Upgrade to use)</span>
                      </div>
                      <div className="p-4 text-gray-400">Local filtering is not available on your plan.</div>
                    </div>
                  ) : filteredLocal.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No local entities found</div>
                  ) : (
                    filteredLocal.map((entity) => {
                      const name = entity.name;
                      const checked = locationState.local.includes(name);
                      return (
                        <label
                          key={name}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                            checked={checked}
                            onChange={() => toggleLocal(name)}
                          />
                          <span className="text-gray-900">{name}</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {isEssentialPlan && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-lg pointer-events-none">
                <div className=" px-6 py-3 rounded-lg shadow-xl">
                  <span className="text-black font-semibold text-lg">Coming Soon</span>
                </div>
              </div>
            )}
          </div>
        </div>


      </div>

      {/* Feature restriction popup */}
      {showRestrictionPopup && (
        <FeatureRestrictionPopup
          title="Upgrade Required"
          message="Upgrade your plan to select more states or use local filters."
          onClose={() => setShowRestrictionPopup(false)}
        />
      )}

      {/* Saved search popup */}
      {showSavedSearchPopup && (
        <SavedSearchPopup
          isOpen={showSavedSearchPopup}
          onClose={() => setShowSavedSearchPopup(false)}
          title="Location Access Restricted"
          message="Your current plan doesn't allow access to this location filter. Upgrade to access all states and local entities."
          upgradeButtonText="Upgrade Plan"
          cancelButtonText="Got It"
        />
      )}
    </div>
  );
};

export default LocationTab;