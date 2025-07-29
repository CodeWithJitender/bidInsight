import React from "react";

const values = [
  {
    id: "01",
    title: "Efficiency with Purpose",
    description:
      "Time is a company’s most valuable resource. Everything we build is designed to save time, reduce friction, and accelerate the path to opportunity.",
  },
  {
    id: "02",
    title: "Trust Through Transparency",
    description:
      "We earn our users’ trust by being clear about what we offer, how our platform works, and where the data comes from—no smoke and mirrors.",
  },
  {
    id: "03",
    title: "Empowering Growth",
    description:
      "Whether you're a startup chasing your first contract or a seasoned firm scaling nationwide, we’re here to help you win more, grow faster, and compete smarter.",
  },
];

const OurValue = () => {
  return (
    <div className="container-fixed">
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
