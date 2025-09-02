import React from 'react'
import Heading from '../components/Heading'
import HeroHeading from '../components/HeroHeading';
import { text } from '@fortawesome/fontawesome-svg-core';

function Error404({title, para, btnText, btnLink}) {
    const data = {
    title: title || "Bidding made easier. Insights made smarter.",
    para: para || "Revolutionizing government bidding. Powered by A.I. Fueled by Analytics.",
    btnText: btnText || "Get Started",
    btnLink: btnLink || "/dashboard",
    headingSize: "h1",
  };
  return (
    <div className='bg-blue h-screen flex justify-center items-center'>
      <div className="max-w-4xl mx-auto text-center text-white px-4">
         <HeroHeading data={data} />
      </div>
    </div>
  )
}

export default Error404
