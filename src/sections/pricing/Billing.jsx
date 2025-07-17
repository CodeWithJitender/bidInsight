import React from "react";
import Heading from "../../components/Heading";

function Billing() {
  // data/plans.js
  const plans = ["Free", "Basic", "Standard", "Premium"];

  const sections = [
    {
      title: "Essentials",
      features: [
        {
          name: "Lorem ipsum dolor",
          values: ["Limited", "Limited", "Flexible", "Unlimited"],
        },
        {
          name: "Lorem ipsum dolor",
          values: ["-", "Limited", "Flexible", "Unlimited"],
        },
        {
          name: "Lorem ipsum dolor sit amet",
          values: ["Limited", "✔️", "✔️", "✔️"],
        },
      ],
    },
    {
      title: "Features",
      features: [
        {
          name: "Lorem ipsum dolor",
          values: ["-", "-", "Flexible", "Unlimited"],
        },
        {
          name: "Lorem ipsum dolor sit",
          values: ["Limited", "Limited", "Flexible", "Unlimited"],
        },
      ],
    },
  ];

  return (
    <div className="billing-page">
      <div className="container-fixed container-section">
        <Heading
          textD="Choose the perfect "
          textL="plan for your needs"
          textAlign={"text-center"}
        />
      </div>
      <div className="px-4 sm:px-6 lg:px-20 py-10">
        <div className="overflow-auto">
          <table className="min-w-full border-separate border-spacing-y-6 text-sm sm:text-base">
            <thead>
              <tr>
                <th className="text-left w-48"></th>
                {plans.map((plan, idx) => (
                  <th key={idx} className="text-center">
                    <div className="mb-2 font-semibold">{plan}</div>
                    <button className="px-4 py-1 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 text-sm transition">
                      Get {plan} <span>↗</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sections.map((section, sIdx) => (
                <React.Fragment key={sIdx}>
                  <tr>
                    <td
                      colSpan={plans.length + 1}
                      className="text-left pt-6 pb-2 font-semibold text-lg"
                    >
                      {section.title}
                    </td>
                  </tr>
                  {section.features.map((feature, fIdx) => (
                    <tr
                      key={fIdx}
                      className="border-t border-gray-200 border-b last:border-b-0"
                    >
                      <td className="py-4 pr-4 font-medium text-left">
                        {feature.name}
                      </td>
                      {feature.values.map((val, vIdx) => (
                        <td key={vIdx} className="text-center py-4">
                          {val === "✔️" ? (
                            <span className="text-green-500 text-lg">✔️</span>
                          ) : (
                            <span>{val}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Billing;
