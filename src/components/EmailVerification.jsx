import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function EmailVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const inputsRef = useRef([]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join("");
    console.log("Entered OTP:", enteredOtp);
    // Call your API here
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0].focus();
      console.log("OTP resent!");
      // Call resend OTP API here
    }
  };

  return (
    <div className="w-screen min-h-screen bg-blue text-white flex items-center px-5 md:px-10">
      <div className="container-fixed w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
        {/* Left Panel */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Verify your Email to begin your Biding
          </h1>
          <p className="text-xl mt-4">
            All government bids. One dashboard. Zero hassles.
          </p>

          <div className="mt-10">
            <p className="mb-2">Enter the 6 digit verification code</p>
            <div className="flex gap-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="w-14 h-14 rounded-md bg-transparent border border-white text-3xl text-center focus:outline-none focus:ring-2 focus:ring-white"
                />
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm">
              {timer > 0 ? (
                <p>Resend Code in <span className="font-bold">{timer}s</span></p>
              ) : (
                <button onClick={handleResend} className="underline hover:text-blue-300">
                  Resend Code
                </button>
              )}
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <Link
              to="/"
              className="border border-white text-white rounded-xl px-6 py-2"
            >
              Cancel
            </Link>
            <button
              onClick={handleVerify}
              className="bg-gradient-to-r from-[#132EC9] to-[#2D54E7] text-white rounded-xl px-6 py-2"
            >
              Verify
            </button>
          </div>
        </div>

        {/* Right Panel (Image) */}
        <div className="hidden lg:block">
          <div className="bg-[#1A237E] rounded-[50px] p-10 flex justify-center items-center h-full">
            <img
              src="/verify-phones.png"
              alt="Smart Bidding"
              className="max-h-[80vh] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;
