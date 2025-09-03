import React from 'react'

function ProcessWrapper({children}) {
  return (
    <div className="login bg-blue">
      <div className="container-fixed">
        <div className="form-container py-10 h-screen grid grid-cols-1 lg:grid-cols-2 gap-10 px-5 md:px-10 overflow-y-auto relative">
            {children}
        </div>
      </div>
    </div>
  )
}

export default ProcessWrapper
