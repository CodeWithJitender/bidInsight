import React from "react";

const values = [
  {
    id: "01",
    title: "Clarity",
    description:
      "We prioritize delivering clear, actionable insights that simplify complex information for smarter decision-making.",
  },
  {
    id: "02",
    title: "Innovation",
    description:
      "We bring to you a cutting-edge AI technology to revolutionize the bidding process, driving efficiency and strategic advantage.",
  },
  {
    id: "03",
    title: "Empowerment",
    description:
      "We enable our users to focus their time and energy on winning contracts by providing intelligent tools and meaningful guidance to eliminate all the hassle.",
  },
];

const OurValue = () => {
  return (
    <div className="container-fixed overflow-x-hidden">
    <div className="container-section">
        <h2 className="text-h2 font-bold text-blue-700 mb-10" data-aos="fade-up" data-aos-delay="300">
        Our Values
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {values.map((value, index) => (
          <div key={value.id} data-aos="fade-left" data-aos-delay={300 + index * 100}>
            <div className=" mb-2 font-archivo font-medium text-h3">{value.id}</div>
            <hr className="border-black mb-4" />
            <h3 className="font-archivo font-semibold text-h3 mb-4">{value.title}</h3>
            <p className="font-inter text-p">{value.description}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default OurValue;
