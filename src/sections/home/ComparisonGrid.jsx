import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';

const ComparisonGrid = () => {
  return (
    <section className="comparison bg-blue">
      <div className="container-section">
        <h1 className="h1 font-black text-center font-h text-g mb-5" data-aos="fade-up" >
          Are We Really Better? You Decide!
        </h1>

        <div className="">
          <LazyLoadImage src="you-decide.png" className="w-full" alt="" data-aos="fade-up" data-aos-delay="200"  />
          {/* <div className="comparison-grid">
            <div className="grid-item" id="grid-item-1">
            </div>
            <div className="grid-item" id="grid-item-2">
            </div>
            <div className="grid-item" id="grid-item-3">
            </div>
            <div className="grid-item" id="grid-item-4">
            </div>
            <div className="grid-item" id="grid-item-5">
            </div>
            <div className="grid-item" id="grid-item-6">
            </div>
            <div className="grid-item" id="grid-item-7">
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default ComparisonGrid;
