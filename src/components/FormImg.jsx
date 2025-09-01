import React from "react";

function FormImg({src}) {
  return (
    <div className="form-right hidden lg:block overflow-hidden sticky top-0">
      <div className="form-img">
        <img src={`/${src}`} className="max-h-[90vh] m-auto" alt="" />
      </div>
    </div>
  );
}

export default FormImg;
