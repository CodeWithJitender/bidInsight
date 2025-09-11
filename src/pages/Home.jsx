import React, { useState } from 'react'
import Hero from '../sections/home/Hero'
import KeyValuePro from '../sections/home/KeyValuePro'
import LockedFeature from '../sections/home/LockedFeature'
import HowItWorks from '../sections/home/HowItWorks'
// import PricingSection from '../sections/home/PricingSection'
import CallToAction from '../sections/home/CallToAction'
import ComparisonGrid from '../sections/home/ComparisonGrid'
import PricingHero from '../sections/pricing/PricingHero'
import PaymentPopup from '../components/PaymentPopup'

function Home() {
  const [open, setOpen] = useState(false);
const processData = [
  {
    image: "/payment-successfull.png",
    title: "Your Payment is Successful",
    // description:
    //   "Upgrade your plan to sort bids by different criteria like date, status, etc.",
    details: [
      { label: "Invoice Number", value: "absk-23094-jlaksjd-3993" },
      { label: "Transaction Date", value: "12/09/2025" },
      { label: "Payment Mode", value: "MasterCard 0922" },
      { label: "Subtotal", value: "$302.00" },
      { label: "Tax", value: "$10.00" },
    ],
    buttons: [
      { type: "link", text: "Go Back to Home Page", url: "/" },
      { type: "button", text: "Download Invoice", onClick: () => alert("Downloading...") },
    ],
    // note: {
    //   text: "If the issue continues, contact our support team at",
    //   email: "support@bidinsight.com",
    // },
  },
  {
    image: "/payment-ussuccessfull.png",
    title: "Your Payment was Unsuccessful",
    description:
      "We’re sorry, your payment could not be completed due to a gateway error.",
    // details: [
    //   { label: "Invoice Number", value: "absk-23094-jlaksjd-3993" },
    //   { label: "Transaction Date", value: "12/09/2025" },
    //   { label: "Payment Mode", value: "MasterCard 0922" },
    //   { label: "Subtotal", value: "$302.00" },
    //   { label: "Tax", value: "$10.00" },
    // ],
    buttons: [
      { type: "link", text: "Go Back to Home Page", url: "/" },
      { type: "button", text: "Retry Payment", onClick: () => alert("Downloading...") },
    ],
    note: {
      text: "If the issue continues, contact our support team at",
      email: "support@bidinsight.com",
    },
  },
]
  const content = {
    image: "/ai-power.png",
    title: "Access Restricted",
    description:
      "Upgrade your plan to sort bids by different criteria like date, status, etc.",
    // details: [
    //   { label: "Invoice Number", value: "absk-23094-jlaksjd-3993" },
    //   { label: "Transaction Date", value: "12/09/2025" },
    //   { label: "Payment Mode", value: "MasterCard 0922" },
    //   { label: "Subtotal", value: "$302.00" },
    //   { label: "Tax", value: "$10.00" },
    // ],
    buttons: [
      { type: "link", text: "Close", url: "/" },
      { type: "button", text: "Upgrade Plan", onClick: () => alert("Downloading...") },
    ],
    note: {
      text: "If the issue continues, contact our support team at",
      email: "support@bidinsight.com",
    },
  };
  return (
    <div className='overflow-x-hidden'>
     <Hero/>
     <div className=""  onClick={() => setOpen(true)}>hell</div>
     <KeyValuePro/>
     <LockedFeature />
     <HowItWorks/>
     {/* <PricingSection /> */}
     <PricingHero />
     <ComparisonGrid />
     <CallToAction t1='Still Thinking ' t2='About It?' p='Dive right in and discover how BidInsight simplifies your gov­ern­ment bidding - no heavy lifting required. Start your free trial now and see opportunities tailored to you, risk-free.' link='/pricing' />
       {open && <PaymentPopup content={content} onClose={() => setOpen(false)} />}
    </div>
  )
}

export default Home
