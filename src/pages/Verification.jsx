import React, { useState, useEffect, useRef } from "react";
import FormHeader from "../components/FormHeader";
import HeroHeading from "../components/HeroHeading";
import FormFooter from "../components/FormFooter";
import FormImg from "../components/FormImg";
import ProcessWrapper from "../components/ProcessWrapper";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/axios"

function Verification() {
  const data = {
    title: "Verify your Email to begin your Biding",
    para: "All government bids. One dashboard. Zero hassles.",
    btnText: false,
    btnLink: false,
    container: "max-w-4xl mx-auto text-left",
    headingSize: "h1",
    pSize: "text-xl",
  };

  const formHeader = {
    title: "Log In",
    link: "/login",
    steps: "",
    activeStep: 0,
  };

  const formFooter = {
    back: {
      text: "Back",
      link: "/login",
    },
    next: {
      text: "Verify",
      link: "",
    },
    skip: {
      text: "",
      link: "",
    },
  };

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [otpMessage, setOtpMessage] = useState("");
  const [otpMessageType, setOtpMessageType] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const otpFromSignup = location.state?.otp || null;

  useEffect(() => {
    if (otpFromSignup) {
      alert(`Your OTP is: ${otpFromSignup}`);
    }
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
      setOtpMessage("");
      setOtpMessageType("");


      if (value && index < 5) inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6 || otp.some((d) => d === "")) {
      setOtpMessage("Please fill all the 6 digits");
      setOtpMessageType("error");
      return;
    }
    setOtpMessage("");
    setOtpMessageType("success");

    try {
      const response = await api.post("/auth/verify-otp/", { email, otp: enteredOtp });
      setApiResponse(response.data);
      console.log("API Response:", response.data);
      // Check for success in response (adjust as per your backend)
      if ((response.data.success || response.status === 200) && response.data.access) {
        localStorage.setItem("access_token", response.data.access);
        navigate("/plan");
      } else {
        setOtpMessage("OTP is invalid");
        setOtpMessageType("error");
      }
    } catch (error) {
      setApiResponse({ error: error.message });
      setOtpMessage("OTP is invalid");
      setOtpMessageType("error");
      console.log("API Error:", error);
      if (error.response) {
        console.log("API Error Response Data:", error.response.data);
      }
    }
  };

  const handleResend = async () => {
    if (timer === 0) {
      setTimer(120);
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0].focus();
      try {
        // Pass email in the request body as required by backend
        const response = await api.post("/auth/resend-otp/", { email });
        setApiResponse(response.data);
        console.log("Resend OTP API Response:", response.data.data);
      } catch (error) {
        setApiResponse({ error: error.message });
        setOtpMessage("Failed to resend OTP. Please try again.");
        setOtpMessageType("error");
        console.log("Resend OTP API Error:", error);
      }
    }
  };

  return (
    <ProcessWrapper>
      <div className="form-left">
        <div className="pe-3 flex flex-col justify-between h-full">
          <div>
            <FormHeader {...formHeader} />
            <HeroHeading data={data} />
          </div>

          <div className="h-full">
            <div className="mt-10">
              <p className="mb-2 text-white">Enter the 6 digit verification code</p>
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
                    className="w-10 md:w-14 h-10 md:h-14 rounded-md bg-transparent border border-white text-3xl text-center focus:outline-none focus:ring-2 focus:ring-white text-white"
                  />
                ))}
              </div>

              {otpMessage && (
                <p
                  className={`text-sm flex items-center gap-1 mt-2 mb-1 ${
                    otpMessageType === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {otpMessageType === "success" ? (
                    <span className="flex items-center">
                      <i className="fal fa-check text-green-400"></i>
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <i className="far fa-times text-red-400"></i>
                    </span>
                  )}
                  <span>{otpMessage}</span>
                </p>
              )}

              <div className="mt-4 flex items-center gap-2 text-white">
                {timer > 0 ? (
                  <p>
                    Resend Code in <span className="font-bold">{timer}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    className="underline hover:text-blue-300"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </div>
          </div>

          <FormFooter data={formFooter} onNextClick={handleVerify} />
        </div>
      </div>

      <div className="sticky top-0">
        <FormImg src={"login-img.png"} />
      </div>
    </ProcessWrapper>
  );
}

export default Verification;
