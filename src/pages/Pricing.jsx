import React from 'react'
import PricingHero from '../sections/pricing/PricingHero'
import Billing from '../sections/pricing/Billing'

function Pricing() {
  return (
    <div className='pricing-page'>
        <PricingHero />
        <Billing />
    </div>
  )
}

export default Pricing