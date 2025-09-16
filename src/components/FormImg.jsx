import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';

function FormImg({src}) {
  return (
    <div className="form-right hidden lg:block overflow-hidden sticky top-0">
      <div className="form-img">
        <LazyLoadImage src={`/${src}`} className="max-h-[90vh] m-auto" alt="" />
      </div>
    </div>
  );
}

export default FormImg;
