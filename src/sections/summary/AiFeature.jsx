import React from 'react';
import Unlock from '../../components/Unlock';

function AiFeature() {
  const data = {
    head: "Unlock AI Features",
    p: "To access AI-powered tools like summary generation, risk analysis, and pricing insights, sign in or create an account.",
    container: "flex-col justify-center max-w-[500px] mx-auto text-center p-4",
    imgSize: "w-20",
    link: "/",
  };

  return (
    <div className="summary h-full">
      <div className="container-fixed flex flex-col justify-center items-center">
        <h1 className="font-archivo font-semibold text-p xl:text-[30px] mb-4">
          Get all AI Features
        </h1>
        <Unlock data={data} />
      </div>
    </div>
  );
}

export default AiFeature;