import React from 'react'
import { Link } from 'react-router-dom'

function Arrow({link, customclass}) {
  return (
    <Link to={"/ai-toolset"} className={`bg-primary flex  text-center rounded-full justify-center items-center  text-white ${customclass}`}>
      <i class="far fa-arrow-right"></i>
    </Link>
  )
}

export default Arrow
