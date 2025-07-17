
import React from 'react'
import Unlock from '../../components/Unlock';

function AiFeature() {
    const data = {
    head:"Unlock the Bid Tracking",
    p:"To view source links, save opportunities, and track bid deadlines, you need to sign in or create an account.",
    container: "flex-col justify-center max-w-[500px] mx-auto text-center p-4",
    imgSize:"w-20",
    link:"/",
  };
  return (
    <div className='summary h-full'>
      <div className="container-fixed flex flex-col justify-center items-center">
         <h1 className="font-archivo font-semibold text-p xl:text-[30px]">
          Get all AI Features
        </h1>
        <Unlock data={data} />
      </div>
    </div>
  )
}

export default AiFeature