import React from 'react'
import BidHeader from '../sections/summary/BidHeader'
import SummaryContent from '../sections/summary/SummaryContent'
import BidTracking from '../sections/summary/BidTracking'
import AiFeature from '../sections/summary/AiFeature'
import SimilarBids from '../sections/summary/SimilarBids'

function SummaryPage() {
  return (
    <div className='py-[120px] bg-blue'>
      <div className="min-h-screen bg-gradient-to-br text-white p-4 sm:p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header Card */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-md shadow-xl">
            <BidHeader
              title="Omnivex Annual Subscription"
              org="ODM"
              location="OH (Columbus)"
              postedDate="Jun. 27"
              deadline="Jul. 11"
              countdownDays={10}
              countdownHours={23}
              countdownMinutes={22}
              countdownSeconds={56}
            />
          </div>

          {/* Summary Section */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl  shadow-xl">
            <SummaryContent />
          </div>

          {/* Bid Tracking + AI Features + Similar Bids */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Left Column: Bid Tracking + Similar Bids */}
            <div className="col-span-2 space-y-4">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl">
                <BidTracking />
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl  shadow-xl">
                <SimilarBids />
              </div>
            </div>

            {/* Right Column: AI Features */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl  shadow-xl">
              <AiFeature />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SummaryPage
