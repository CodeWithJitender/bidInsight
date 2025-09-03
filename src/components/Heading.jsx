import React from 'react'

function Heading({textD, textL, textAlign}) {
  return (
    <div className={`h2 font-h font-semibold ${textAlign}`}>
      <sapn className="text-primary">{textD} </sapn>
      <sapn className="text-secondary"> {textL}</sapn>
    </div>
  )
}

export default Heading
