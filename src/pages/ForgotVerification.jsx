import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FormHeader from "../components/FormHeader";
import HeroHeading from "../components/HeroHeading";
import FormFooter from "../components/FormFooter";
import FormImg from "../components/FormImg";
import ProcessWrapper from "../components/ProcessWrapper";
import { forgotPasswordRequest } from "../services/user.service"; // Import for resend OTP

function ForgotVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from previous page
  const email = location.state?.email;

  // Redirect if no email found
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const data = {
    title: "Verify your Email to reset password",
    para: "Enter the verification code sent to your email",
    btnText: false,
    btnLink: false,
    container: "max-w-4xl mx-auto text-left",
    headingSize: "h1",
    pSize: "text-xl",
  };

  const formHeader = {
    title: "Back to Forgot Password",
    link: "/forgot-password",
    steps: "",
    activeStep: 0,
  };

  const formFooter = {
    back: {
      text: "Back",
      link: "/forgot-password",
    },
    next: {
      text: "Verify",
      link: "",
    },
  };

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [otpMessage, setOtpMessage] = useState("");
  const [otpMessageType, setOtpMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputsRef = useRef([]);

  // Start timer on component mount
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [timer]);

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

  const handleVerify = () => {
    const enteredOtp = otp.join("");

    // Validation
    if (enteredOtp.length !== 6 || otp.some((d) => d === "")) {
      setOtpMessage("Please fill all the 6 digits");
      setOtpMessageType("error");
      return;
    }

    setIsLoading(true);

    try {
      // Navigate to confirm password with email and OTP data
      navigate("/confirm-password", { 
        state: { 
          email: email,
          otp: enteredOtp
        } 
      });
    } catch (error) {
      setOtpMessage("Something went wrong. Please try again.");
      setOtpMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer === 0 && !resendLoading) {
      setResendLoading(true);
      setOtpMessage("");
      setOtpMessageType("");

      try {
        // Call API to resend OTP
        await forgotPasswordRequest(email);
        
        // Reset OTP fields
        setOtp(["", "", "", "", "", ""]);
        if (inputsRef.current[0]) {
          inputsRef.current[0].focus();
        }

        // Reset timer
        setTimer(120);
        setOtpMessage("OTP sent successfully!");
        setOtpMessageType("success");

        // Clear success message after 3 seconds
        setTimeout(() => {
          setOtpMessage("");
          setOtpMessageType("");
        }, 3000);

      } catch (error) {
        console.error("Resend OTP error:", error);
        setOtpMessage("Failed to resend OTP. Please try again.");
        setOtpMessageType("error");
      } finally {
        setResendLoading(false);
      }
    }
  };

  if (!email) {
    return null; // Component will redirect
  }

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
              <p className="mb-2 text-white">
                Enter the 6 digit verification code sent to:
              </p>
              <p className="mb-4 text-blue-300 font-medium">{email}</p>
              
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
                    disabled={isLoading}
                    className={`w-10 md:w-14 h-10 md:h-14 rounded-md bg-transparent border border-white text-3xl text-center focus:outline-none focus:ring-2 focus:ring-white text-white ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
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
                    disabled={isLoading || resendLoading}
                    className={`underline hover:text-blue-300 ${
                      isLoading || resendLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {resendLoading ? "Sending..." : "Resend Code"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <FormFooter
            data={formFooter}
            onNextClick={handleVerify}
            loading={isLoading}
          />
        </div>
      </div>

      <div className="sticky top-0">
        <FormImg src={"login-img.png"} />
      </div>
    </ProcessWrapper>
  );
}

export default ForgotVerification;