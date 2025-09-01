import React, { useState } from "react";
import { Trash2, Search } from "lucide-react";

const mockData = [
  {
    code: "005",
    name: "ABRASIVES",
    children: [
      {
        code: "00500",
        name: "Abrasive Equipment and Tools",
        description: "Abrasive Equipment and Tools",
      },
      {
        code: "00501",
        name: "Abrasives, Coated: Cloth, Fiber, Sandpaper, etc.",
        description: "Abrasives, Coated: Cloth, Fiber, Sandpaper, etc.",
      },
      {
        code: "00505",
        name: "Abrasives, Sandblasting, Metal",
        description: "Abrasives, Sandblasting, Metal",
      },
    ],
  },
  {
    code: "018",
    name: "AGRICULTURAL EQUIPMENT AND IMPLEMENT PARTS",
    children: [
      {
        code: "01801",
        name: "Tractors and Attachments",
        description: "Tractors, Implements and Spare Parts",
      },
    ],
  },
  {
    code: "019",
    name: "AIR COMPRESSORS AND ACCESSORIES",
    children: [
      {
        code: "01910",
        name: "Portable Air Compressors",
        description: "Compressors for Industrial and Home Use",
      },
    ],
  },
  {
    code: "020",
    name: "AUTOMOTIVE VEHICLES AND RELATED TRANSPORTATION",
    children: [
      {
        code: "02001",
        name: "Fleet Vehicles",
        description: "Light and Heavy-Duty Vehicles",
      },
      {
        code: "02002",
        name: "Automobile Parts",
        description: "Spare Parts for all Car Models",
      },
    ],
  },
  {
    code: "021",
    name: "BUILDING MATERIALS AND SUPPLIES",
    children: [
      {
        code: "02110",
        name: "Concrete and Aggregates",
        description: "Cement, Bricks, and Mortar",
      },
    ],
  },
  {
    code: "022",
    name: "CLEANING EQUIPMENT AND SUPPLIES",
    children: [
      {
        code: "02201",
        name: "Commercial Cleaners",
        description: "Industrial Detergents and Cleaners",
      },
    ],
  },
  {
    code: "023",
    name: "COMPUTER EQUIPMENT, ACCESSORIES, AND SUPPLIES",
    children: [
      {
        code: "02301",
        name: "Desktops and Laptops",
        description: "IT Hardware for Office Use",
      },
      {
        code: "02302",
        name: "Keyboards, Mice, and Peripherals",
        description: "Input Devices for Computers",
      },
    ],
  },
  {
    code: "024",
    name: "ELECTRICAL EQUIPMENT AND SUPPLIES",
    children: [
      {
        code: "02401",
        name: "Wiring and Conduits",
        description: "Electrical Wiring and Accessories",
      },
    ],
  },
  {
    code: "025",
    name: "FOOD PRODUCTS AND CATERING",
    children: [
      {
        code: "02501",
        name: "Packaged Foods",
        description: "Canned, Frozen, and Dry Food",
      },
    ],
  },
  {
    code: "026",
    name: "FURNITURE AND INTERIOR FITTINGS",
    children: [
      {
        code: "02601",
        name: "Office Chairs and Desks",
        description: "Ergonomic and Standard Furniture",
      },
    ],
  },
];

const CategoriesTab = () => {
  const [selected, setSelected] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleSelect = (item) => {
    setSelected((prev) => {
      const exists = prev.find((s) => s.code === item.code);
      return exists
        ? prev.filter((s) => s.code !== item.code)
        : [...prev, item];
    });
  };

  const removeSelected = (code) => {
    setSelected((prev) => prev.filter((item) => item.code !== code));
  };

  const toggleAllItems = (category) => {
    const allSelected = category.children.every((child) =>
      selected.some((s) => s.code === child.code)
    );
    if (allSelected) {
      setSelected((prev) =>
        prev.filter(
          (item) => !category.children.some((child) => child.code === item.code)
        )
      );
    } else {
      const newItems = category.children.filter(
        (child) => !selected.some((s) => s.code === child.code)
      );
      setSelected((prev) => [...prev, ...newItems]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-10 ps-14">
      {/* Search */}
      <div className="flex justify-end mb-8">
        <div className="relative w-[340px]">
          <input
            type="text"
            placeholder="Search titles or organization or location"
            className="w-full px-10 py-2 rounded-full border border-primary outline-none placeholder-gray-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" size={18} />
        </div>
      </div>

      {/* Selected */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-p font-medium">
          Selected Categories <span className="text-primary">({selected.length})</span>
        </h2>
        {selected.length > 0 && (
          <button
            onClick={() => setSelected([])}
            className="text-lg underline font-inter"
          >
            Clear All
          </button>
        )}
      </div>

      {selected.map((item) => (
        <div
          key={item.code}
          className="flex items-start justify-between text-sm py-2 border-b font-inter"
        >
          <div className="flex items-center gap-10">
            <div className="font-medium text-lg">{item.code}</div>
            <div>
              <div>{item.name}</div>
              <div>{item.description}</div>
            </div>
          </div>
          <button onClick={() => removeSelected(item.code)} className="text-primary ml-4">
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      {/* Categories */}
      <div className="border-[#273BE280] border-[2px] rounded-[10px] mt-6">
        <div className="font-semibold text-md p-2 border-b">Categories</div>
        {mockData.map((cat) => {
          const allChildrenSelected = cat.children.every((child) =>
            selected.some((item) => item.code === child.code)
          );

          return (
            <div key={cat.code}>
              <div
                onClick={() =>
                  setActiveCategory((prev) => (prev === cat.code ? null : cat.code))
                }
                className="flex items-center font-inter text-xl w-full px-4 py-3 border-t-[2px] border-[#273BE280] cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="mr-3 accent-primary mt-1"
                  checked={allChildrenSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleAllItems(cat);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="text-primary w-6">
                  {cat.children ? (
                    <i
                      className={`fas fa-chevron-${
                        activeCategory === cat.code ? "down" : "right"
                      }`}
                    />
                  ) : null}
                </div>
                <div className="w-20 font-semibold">{cat.code}</div>
                <div className="font-medium">{cat.name}</div>
              </div>

              {activeCategory === cat.code && (
                <div>
                  {cat.children.map((child) => (
                    <label
                      key={child.code}
                      className="flex items-center gap-5 py-2 cursor-pointer font-inter px-8 text-xl border-t-[2px] border-[#273BE280]"
                    >
                      <input
                        type="checkbox"
                        className="mt-1 accent-primary"
                        checked={selected.some((item) => item.code === child.code)}
                        onChange={() => toggleSelect(child)}
                      />
                      <div className="font-semibold text-lg">{child.code}</div>
                      <div className="text-[16px]">
                        <div>{child.name}</div>
                        <div>{child.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 p-5 ps-0 bg-white sticky bottom-0">
        <button className="border-[2px] px-10 py-3 rounded-[20px] font-archivo text-xl transition-all">
          Cancel
        </button>
        <button className="bg-primary text-white px-10 py-3 rounded-[20px] font-archivo text-xl hover:bg-blue-700 transition-all">
          Search
        </button>
      </div>
    </div>
  );
};

export default CategoriesTab;
