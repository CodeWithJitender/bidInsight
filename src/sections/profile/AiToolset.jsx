import React, { useState } from 'react'
import SignupModal from '../../components/SignupModal';

function AiToolset() {
    const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className='h-screen w-full flex justify-center items-center'>
      <img src="/coming-soon.jpg"   onClick={() => setIsModalOpen(true)} className='rounded-lg max-w-xl' alt="" />

<SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default AiToolset