import React, { useEffect } from 'react'
import Hero from '../sections/home/Hero'
import KeyValuePro from '../sections/home/KeyValuePro'
import LockedFeature from '../sections/home/LockedFeature'
import HowItWorks from '../sections/home/HowItWorks'
// import PricingSection from '../sections/home/PricingSection'
import CallToAction from '../sections/home/CallToAction'
import ComparisonGrid from '../sections/home/ComparisonGrid'
import StackOnScroll from '../sections/home/StackOnScroll'
import PricingHero from '../sections/pricing/PricingHero'
import { useLocation } from 'react-router-dom'

function Home() {
   const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [hash]);
  
  return (
    <div className='overflow-x-hidden'>
     <Hero/>
     <div className="" id='why-bidinsight'>
     <KeyValuePro/>
     </div>
     <LockedFeature />
     
     <HowItWorks/>
     {/* <StackOnScroll /> */}
     {/* <PricingSection /> */}
     <PricingHero />
     <ComparisonGrid />
     <CallToAction t1='Still Thinking ' t2='About It?' p='Dive right in and discover how BidInsight simplifies your gov­ern­ment bidding - no heavy lifting required. Start your free trial now and see opportunities tailored to you, risk-free.' link='/pricing' />
    </div>
  )
}

export default Home
