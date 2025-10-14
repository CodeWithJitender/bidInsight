import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ✅ STEP 1: Import this component at the top of Dashboard.jsx
// import OnboardingRequiredPopup from './path/to/OnboardingRequiredPopup';

const OnboardingRequiredPopup = ({
  isOpen,
  onClose,
  title = "Profile Incomplete",
  message = "Please complete your profile to access bids and unlock all features."
}) => {
  const navigate = useNavigate();

  const handleCompleteOnboarding = () => {
    navigate('/geographic-coverage');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-2">
      {/* Card */}
      <div className="relative w-full max-w-[500px] bg-blue text-white rounded-2xl border border-[#DBDFFF] p-8 shadow-xl">
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-[80px] h-[80px] bg-white/10 rounded-full flex items-center justify-center">
            <MapPin size={40} className="text-white" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="h3 font-bold font-archivo text-g mb-3">
            {title}
          </h1>
          <p className="text-lg font-inter">{message}</p>
        </div>

        {/* Details */}
        <div className="text-left space-y-3 text-lg font-inter mt-6">
          <div className="flex justify-between">
            <span>Profile Status</span>
            <span className="opacity-80">Incomplete</span>
          </div>
          <div className="flex justify-between">
            <span>Required Action</span>
            <span className="opacity-80">Add Geographic Coverage</span>
          </div>
        </div>

        {/* Button */}
        <div className="my-4 md:mt-10 flex justify-center">
          <button
            onClick={handleCompleteOnboarding}
            className="w-[70%] font-archivo text-xl px-6 py-3 rounded-xl bg-primary hover:bg-blue-700 transition text-white font-semibold flex items-center justify-center gap-2"
          >
            Complete Onboarding
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Note */}
        <div className="text-xs font-inter mt-2 w-full text-center leading-tight">
          <b>NOTE:</b> You need to add at least one state to your geographic coverage to view bids.
        </div>
      </div>
    </div>
  );
};

export default OnboardingRequiredPopup;