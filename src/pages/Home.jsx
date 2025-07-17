import React from 'react'
import Hero from '../sections/home/Hero'
import KeyValuePro from '../sections/home/KeyValuePro'
import LockedFeature from '../sections/home/LockedFeature'
import HowItWorks from '../sections/home/HowItWorks'
import PricingSection from '../sections/home/PricingSection'
import CallToAction from '../sections/home/CallToAction'
import ComparisonGrid from '../sections/home/ComparisonGrid'

function Home() {
  return (
    <div className='overflow-x-hidden'>
     <Hero/>
     <KeyValuePro/>
     <LockedFeature />
     <HowItWorks/>
     <PricingSection />
     <ComparisonGrid />
     <CallToAction />
    </div>
  )
}

export default Home
