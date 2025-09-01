import React from 'react'

function Heading({textD, textL, textAlign}) {
  return (
    <div className={`h2 font-h font-semibold ${textAlign}`}>
      <span className="text-primary">{textD} </span>
      <span className="text-secondary"> {textL}</span>
    </div>
  )
}

export default Heading
