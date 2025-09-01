import React from 'react'
import { Link } from 'react-router-dom'

function Button2({text, link}) {
  return (
    <Link to={link} className='border rounded-full p-2 md:p-4 flex gap-4 font-h body-t border-black'>
      <span>{text}</span>
      <span><i class="far fa-long-arrow-right -rotate-45"></i></span>
    </Link>
  )
}

export default Button2
