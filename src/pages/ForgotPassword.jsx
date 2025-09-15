// import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormHeader from "../components/FormHeader";
import HeroHeading from "../components/HeroHeading";
import FormField from "../components/FormField";
import FormFooter from "../components/FormFooter";
import ProcessWrapper from "../components/ProcessWrapper";
import FormImg from "../components/FormImg";
import { forgotPasswordRequest } from "../services/user.service"; // Import your API function
import { useState, useEffect } from "react";

function ForgotPassword() {
  const data = {
    title: "Forgot your password and Continue",
    para: "All government bids. One dashboard. Zero hassles.",
    btnText: false,
    btnLink: false,
    container: "max-w-4xl mx-auto text-left",
    headingSize: "h1",
    pSize: "text-xl",
  };

  const formHeader = {
    title: "Back to Login",
    link: "/login",
    steps: "",
    activeStep: "",
  };

  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const navigate = useNavigate();

  // Timer effect - Fixed to properly handle timer countdown
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            setIsTimerActive(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timer]);

  // Check if button should be disabled
  const isButtonDisabled = loading || timer > 0;

  // Dynamic formFooter based on loading and timer state
  const formFooter = {
    back: {
      text: "Back to Login",
      link: "/login",
    },
    next: {  
      text: loading ? "Sending..." : timer > 0 ? `Resend in ${timer}s` : "Send OTP",
      link: "", // Empty because we handle navigation in function
      disabled: isButtonDisabled // Add disabled property
    },
  };

  // Email validation
  const validateEmail = (value) => {
    if (!value) {
      return "Email is required";
    }
    if (!emailRegex.test(value)) {
      return "Please enter a valid email";
    }
    return "";
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    setTouched(true);
    
    // Real-time validation
    const validationError = validateEmail(value);
    setError(validationError);
    setApiError(""); // Clear API error on change
  };

  const handleBlur = (e) => {
    const { value } = e.target;
    setTouched(true);
    const validationError = validateEmail(value);
    setError(validationError);
  };

  const getMessageType = () => {
    if (!touched) return "";
    return error ? "error" : "";
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    // Prevent action if button is disabled
    if (isButtonDisabled) {
      return;
    }
    
    setApiError("");

    // Validate email before API call
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      setTouched(true);
      return;
    }

    setLoading(true);
    
    try {
      const response = await forgotPasswordRequest(email);
      
      if (response.status === 200 || response.status === 201) {
        // Start 30 second timer
        setTimer(30);
        setIsTimerActive(true);
        
        // Navigate to verification page with email data
        navigate("/forgot-otp", { 
          state: { email: email } 
        });
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      
      if (err.response) {
        if (err.response.status === 404) {
          setApiError("Email not found. Please check your email address.");
        } else if (err.response.status === 400) {
          setApiError("Invalid email");
        } else if (err.response.status === 429) {
          setApiError("Too many requests. Please try again later.");
        } else {
          setApiError("Something went wrong. Please try again.");
        }
      } else if (err.request) {
        setApiError("Network error. Please check your connection.");
      } else {
        setApiError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Debug logging - remove after testing
  console.log("Timer:", timer, "Loading:", loading, "Disabled:", isButtonDisabled);

  return (
    <ProcessWrapper>
      <div className="form-left">
        <div className="pe-3 flex flex-col h-full justify-between">
          <div className="">
            <FormHeader {...formHeader} />
            <HeroHeading data={data} />
          </div>
          
          <form
            action=""
            method="post"
            className="flex flex-col justify-between h-full"
            onSubmit={handleSendOTP}
          >
            <div className="">
              <FormField
                label="Email"
                type="email"
                name="email"
                placeholder="e.g. joseph.mark12@gmail.com"
                delay={100}
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
                message={error}
                messageType={getMessageType()}
              />
              
              {/* API Error Display */}
              <div className="float-right pr-20">
                {apiError && (
                  <div style={{ 
                    marginTop: "2px", 
                    color: "#ef4444", 
                    fontSize: "15px" 
                  }}>
                    {apiError}
                  </div>
                )}
              </div>
            </div>

            <FormFooter 
              data={formFooter} 
              onNextClick={handleSendOTP}
              loading={loading}
              disabled={isButtonDisabled}
            />
          </form>
        </div>
      </div>
      
      <div className="sticky top-0">
        <FormImg src={"loginbid.png"} />
      </div>
    </ProcessWrapper>
  );
}

export default ForgotPassword;