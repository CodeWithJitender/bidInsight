import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Trash2, Search } from "lucide-react";
import { getAllStates } from "../../services/user.service.js";

const US_STATES = [/* fallback states if needed */];

const LocationTab = ({ filters = {}, setFilters = () => {} }) => {
  const [selectedStates, setSelectedStates] = useState(filters.location || []);
  const [selectedEntity, setSelectedEntity] = useState(filters.entity || ["Federal", "State","Local"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch & sort states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoading(true);
        const response = await getAllStates();
        const sorted = response.sort((a, b) =>
          (a.name || a).toLowerCase().localeCompare((b.name || b).toLowerCase())
        );
        setStates(sorted);
      } catch {
        const fallbackSorted = US_STATES
          .map((name) => ({ name }))
          .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        setStates(fallbackSorted);
      } finally {
        setLoading(false);
      }
    };
    fetchStates();
  }, []);

  // Sync with external filters
  useEffect(() => {
    if (Array.isArray(filters.location)) {
      setSelectedStates(filters.location);
    }
  }, [filters.location]);

  const filteredStates = useMemo(() => {
    return states.filter((state) =>
      (state.name || state).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, states]);

  const visibleStateNames = useMemo(() => {
    return filteredStates.map((state) => state.name || state);
  }, [filteredStates]);

  const isAllSelected = useMemo(() => {
    return (
      visibleStateNames.length > 0 &&
      visibleStateNames.every((name) => selectedStates.includes(name))
    );
  }, [visibleStateNames, selectedStates]);

  const updateFilter = useCallback((updated) => {
    setSelectedStates(updated);
    setFilters((prev) => ({ ...prev, location: updated }));
  }, [setFilters]);

  const toggleState = useCallback((name) => {
    const updated = selectedStates.includes(name)
      ? selectedStates.filter((s) => s !== name)
      : [...selectedStates, name];
    updateFilter(updated);
  }, [selectedStates, updateFilter]);

  const toggleSelectAll = useCallback(() => {
    const updated = isAllSelected
      ? selectedStates.filter((s) => !visibleStateNames.includes(s))
      : Array.from(new Set([...selectedStates, ...visibleStateNames]));
    updateFilter(updated);
  }, [isAllSelected, selectedStates, visibleStateNames, updateFilter]);

  const clearAll = useCallback(() => {
    updateFilter([]);
  }, [updateFilter]);

  return (
    <div className="min-h-screen flex flex-col justify-between p-10 ps-14">
      <div>
        {/* Search Input */}
        <div className="flex justify-end mb-8">
          <div className="relative w-[340px]">
            <input
              type="text"
              placeholder="Search states"
              className="w-full px-10 py-2 rounded-full border border-primary outline-none placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
              size={18}
            />
          </div>
        </div>

        {/* Selected Entity */}
        <div className="hidden justify-between items-center mb-4">
          <h2 className="text-p font-medium font-inter">
            Selected Entity{" "}
            <span className="text-primary">({selectedEntity.length})</span>
          </h2>
          {selectedEntity.length > 0 && (
            <button
              onClick={clearAll}
              className="text-lg underline font-inter"
              aria-label="Clear all selected entity"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="hidden flex-wrap gap-2 mb-6">
          {selectedEntity.map((name) => (
            <div
              key={name}
              className="flex border-[2px] gap-1 px-3 rounded-[30px] border-primary items-center text-lg py-1 font-inter"
            >
              <div>{name}</div>
              <button
                onClick={() => toggleState(name)}
                className="text-primary"
                aria-label={`Remove ${name}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
         {/* Entity List */}
        <div className="hidden border-[#273BE280] border-[2px] rounded-[10px] max-h-[400px] overflow-y-auto mb-10">
          <div className="flex items-center px-4 py-3 border-b font-medium font-inter text-p">
            <input
              type="checkbox"
              className="accent-primary mr-3"
              checked={isAllSelected}
              onChange={toggleSelectAll}
              aria-label="Select all visible states"
            />
            <span>Select All States</span>
          </div>

          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading states...</div>
          ) : selectedEntity.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No states found</div>
          ) : (
            selectedEntity.map((state) => {
              const name = state.name || state;
              const checked = selectedStates.includes(name);
              return (
                <label
                  key={name}
                  className="flex items-center gap-5 py-2 cursor-pointer font-inter px-4 text-xl border-[#273BE280] border-t-[2px]"
                >
                  <input
                    type="checkbox"
                    className="mt-1 accent-primary"
                    checked={checked}
                    onChange={() => toggleState(name)}
                    aria-label={`Select state ${name}`}
                  />
                  <div className="text-[16px]">{name}</div>
                </label>
              );
            })
          )}
        </div>
        {/* Selected States */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-p font-medium font-inter">
            Selected Location{" "}
            <span className="text-primary">({selectedStates.length})</span>
          </h2>
          {selectedStates.length > 0 && (
            <button
              onClick={clearAll}
              className="text-lg underline font-inter"
              aria-label="Clear all selected states"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {selectedStates.map((name) => (
            <div
              key={name}
              className="flex border-[2px] gap-1 px-3 rounded-[30px] border-primary items-center text-lg py-1 font-inter"
            >
              <div>{name}</div>
              <button
                onClick={() => toggleState(name)}
                className="text-primary"
                aria-label={`Remove ${name}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* State List */}
        <div className="border-[#273BE280] border-[2px] rounded-[10px] max-h-[400px] overflow-y-auto">
          <div className="flex items-center px-4 py-3 border-b font-medium font-inter text-p">
            <input
              type="checkbox"
              className="accent-primary mr-3"
              checked={isAllSelected}
              onChange={toggleSelectAll}
              aria-label="Select all visible states"
            />
            <span>Select All States</span>
          </div>

          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading states...</div>
          ) : filteredStates.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No states found</div>
          ) : (
            filteredStates.map((state) => {
              const name = state.name || state;
              const checked = selectedStates.includes(name);
              return (
                <label
                  key={name}
                  className="flex items-center gap-5 py-2 cursor-pointer font-inter px-4 text-xl border-[#273BE280] border-t-[2px]"
                >
                  <input
                    type="checkbox"
                    className="mt-1 accent-primary"
                    checked={checked}
                    onChange={() => toggleState(name)}
                    aria-label={`Select state ${name}`}
                  />
                  <div className="text-[16px]">{name}</div>
                </label>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationTab;






// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { Trash2, Search } from "lucide-react";
// import { getAllStates } from "../../services/user.service.js";

// const US_STATES = [
//   /* fallback states if needed */
// ];

// const LocationTab = ({ filters = {}, setFilters = () => {} }) => {
//   const [selectedStates, setSelectedStates] = useState(filters.location || []);
//   const [selectedEntity, setSelectedEntity] = useState(
//     filters.entity || ["Federal", "State", "Local"]
//   );
//   const [searchTerm, setSearchTerm] = useState("");
//   const [states, setStates] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const LOCAL_SUBCATEGORIES = ["City", "County", "District"];
//   const [federalChecked, setFederalChecked] = useState(false);
//   const [localChecked, setLocalChecked] = useState(false);
//   const [selectedLocalCategories, setSelectedLocalCategories] = useState([]);
//   // Fetch & sort states
//   useEffect(() => {
//     const fetchStates = async () => {
//       try {
//         setLoading(true);
//         const response = await getAllStates();
//         const sorted = response.sort((a, b) =>
//           (a.name || a).toLowerCase().localeCompare((b.name || b).toLowerCase())
//         );
//         setStates(sorted);
//       } catch {
//         const fallbackSorted = US_STATES.map((name) => ({ name })).sort(
//           (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())
//         );
//         setStates(fallbackSorted);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStates();
//   }, []);

//   useEffect(() => {
//     if (federalChecked) {
//       setFilters((prev) => ({
//         ...prev,
//         entity_type: "Federal",
//         local_category: undefined,
//       }));
//     } else if (localChecked && selectedLocalCategories.length > 0) {
//       setFilters((prev) => ({
//         ...prev,
//         entity_type: "Local",
//         local_category: selectedLocalCategories.join(","),
//       }));
//     } else {
//       setFilters((prev) => {
//         const { entity_type, local_category, ...rest } = prev;
//         return rest;
//       });
//     }
//     // eslint-disable-next-line
//   }, [federalChecked, localChecked, selectedLocalCategories]);

//   // ...existing code...

// useEffect(() => {
//   // Sync Federal checkbox
//   setFederalChecked(filters.entity_type === "Federal");

//   // Sync Local checkbox
//   setLocalChecked(filters.entity_type === "Local" || !!filters.local_category);

//   // Sync Local categories
//   if (filters.local_category) {
//     setSelectedLocalCategories(filters.local_category.split(","));
//   } else {
//     setSelectedLocalCategories([]);
//   }
// }, [filters.entity_type, filters.local_category]);


//   useEffect(() => {
//     if (Array.isArray(filters.location)) {
//       setSelectedStates(filters.location);
//     }
//   }, [filters.location]);

//   const filteredStates = useMemo(() => {
//     return states.filter((state) =>
//       (state.name || state).toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [searchTerm, states]);

//   const visibleStateNames = useMemo(() => {
//     return filteredStates.map((state) => state.name || state);
//   }, [filteredStates]);

//   const isAllSelected = useMemo(() => {
//     return (
//       visibleStateNames.length > 0 &&
//       visibleStateNames.every((name) => selectedStates.includes(name))
//     );
//   }, [visibleStateNames, selectedStates]);

//   const updateFilter = useCallback(
//     (updated) => {
//       setSelectedStates(updated);
//       setFilters((prev) => ({ ...prev, location: updated }));
//     },
//     [setFilters]
//   );

//   const toggleState = useCallback(
//     (name) => {
//       const updated = selectedStates.includes(name)
//         ? selectedStates.filter((s) => s !== name)
//         : [...selectedStates, name];
//       updateFilter(updated);
//     },
//     [selectedStates, updateFilter]
//   );

//   const toggleSelectAll = useCallback(() => {
//     const updated = isAllSelected
//       ? selectedStates.filter((s) => !visibleStateNames.includes(s))
//       : Array.from(new Set([...selectedStates, ...visibleStateNames]));
//     updateFilter(updated);
//   }, [isAllSelected, selectedStates, visibleStateNames, updateFilter]);

//   const clearAll = useCallback(() => {
//     updateFilter([]);
//   }, [updateFilter]);

//   return (
//     <div className="min-h-screen flex flex-col justify-between p-10 ps-14">
//       <div>
//         {/* Search Input */}
//         <div className="flex justify-end mb-8">
//           <div className="relative w-[340px]">
//             <input
//               type="text"
//               placeholder="Search states"
//               className="w-full px-10 py-2 rounded-full border border-primary outline-none placeholder-gray-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <Search
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
//               size={18}
//             />
//           </div>
//         </div>

//         {/* Selected States */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-p font-medium font-inter">
//             Selected Location{" "}
//             <span className="text-primary">({selectedStates.length})</span>
//           </h2>
//           {selectedStates.length > 0 && (
//             <button
//               onClick={clearAll}
//               className="text-lg underline font-inter"
//               aria-label="Clear all selected states"
//             >
//               Clear All
//             </button>
//           )}
//         </div>

//         {/* Selected Entity */}
//         <div className="flex gap-8 items-center mb-8">
//           <div className="flex items-center gap-3">
//             <input
//               type="checkbox"
//               id="federal-checkbox"
//               className="accent-primary w-5 h-5"
//               checked={federalChecked}
//               onChange={() => {
//                 setFederalChecked((prev) => !prev);

//               }}
//             />
//             <label
//               htmlFor="federal-checkbox"
//               className=" font-inter font-medium text-p"
//             >
//               Federal
//             </label>
//           </div>

//           <div className="flex items-center gap-3">
//             {/* // ...existing code... */}
//             <input
//               type="checkbox"
//               id="local-checkbox"
//               className="accent-primary w-5 h-5"
//               checked={localChecked}
//               onChange={() => {
//                 setLocalChecked((prev) => !prev);

//               }}
//             />
//             <label
//               htmlFor="local-checkbox"
//               className="font-inter font-medium text-p"
//             >
//               Local
//             </label>
//           </div>

//           {localChecked && !federalChecked && (
//             <div className="flex gap-4 mb-6 ms-2">
//               {LOCAL_SUBCATEGORIES.map((cat) => (
//                 <label
//                   key={cat}
//                   className="flex items-center gap-2 font-inter text-base"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedLocalCategories.includes(cat)}
//                     onChange={() => {
//                       setSelectedLocalCategories((prev) =>
//                         prev.includes(cat)
//                           ? prev.filter((c) => c !== cat)
//                           : [...prev, cat]
//                       );
//                     }}
//                     className="accent-primary"
//                   />
//                   {cat}
//                 </label>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="flex flex-wrap gap-2 mb-6">
//           {selectedStates.map((name) => (
//             <div
//               key={name}
//               className="flex border-[2px] gap-1 px-3 rounded-[30px] border-primary items-center text-lg py-1 font-inter"
//             >
//               <div>{name}</div>
//               <button
//                 onClick={() => toggleState(name)}
//                 className="text-primary"
//                 aria-label={`Remove ${name}`}
//               >
//                 <Trash2 size={16} />
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* State List */}
//         <div className="border-[#273BE280] border-[2px] rounded-[10px] max-h-[400px] overflow-y-auto">
//           <div className="flex items-center px-4 py-3 border-b font-medium font-inter text-p">
//             <input
//               type="checkbox"
//               className="accent-primary mr-3"
//               checked={isAllSelected}
//               onChange={toggleSelectAll}
//               aria-label="Select all visible states"
//             />
//             <span>Select All States</span>
//           </div>

//           {loading ? (
//             <div className="p-4 text-center text-gray-500">
//               Loading states...
//             </div>
//           ) : filteredStates.length === 0 ? (
//             <div className="p-4 text-center text-gray-500">No states found</div>
//           ) : (
//             filteredStates.map((state) => {
//               const name = state.name || state;
//               const checked = selectedStates.includes(name);
//               return (
//                 <label
//                   key={name}
//                   className="flex items-center gap-5 py-2 cursor-pointer font-inter px-4 text-xl border-[#273BE280] border-t-[2px]"
//                 >
//                   <input
//                     type="checkbox"
//                     className="mt-1 accent-primary"
//                     checked={checked}
//                     onChange={() => toggleState(name)}
//                     aria-label={`Select state ${name}`}
//                   />
//                   <div className="text-[16px]">{name}</div>
//                 </label>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LocationTab;