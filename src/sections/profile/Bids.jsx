import React from 'react'
import BookmarkTable from './BookmarkTable'
import { bookmarkedBids, followData } from './bookmarkedBids'

function Bids() {
  return (
     <div className='p-4 xl:p-8'>
      <BookmarkTable type="bookmarked" data={bookmarkedBids} />
      <BookmarkTable type="followed" data={followData} />
    </div>
  )
}

export default Bids