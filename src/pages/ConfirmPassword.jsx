import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FormHeader from "../components/FormHeader";
import HeroHeading from "../components/HeroHeading";
import FormPassword from "../components/FormPassword";
import FormFooter from "../components/FormFooter";
import ProcessWrapper from "../components/ProcessWrapper";
import FormImg from "../components/FormImg";
import { forgotPasswordVerify } from "../services/user.service"; // Import your API function

function ConfirmPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email and OTP from previous page
  const email = location.state?.email;
  const otp = location.state?.otp;

  // Redirect if no email or OTP found
  useEffect(() => {
    if (!email || !otp) {
      navigate("/forgot-password");
    }
  }, [email, otp, navigate]);

  const data = {
    title: "Reset password to access BidInsight",
    para: "Create a strong password for your account security.",
    btnText: false,
    btnLink: false,
    container: "max-w-4xl mx-auto text-left",
    headingSize: "h1",
    pSize: "text-xl",
  };

  const formHeader = {
    title: "Back to Verification",
    link: "/forgot-verification",
    steps: "",
    activeStep: "",
  };

  const formFooter = {
    back: {
      text: "Back",
      link: "/forgot-verification",
    },
    next: {
      text: "Save New Password",
      link: "",
    },
  };

  const [fields, setFields] = useState({
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password validation regex - at least 8 chars, 1 uppercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Real-time validation
  const validateField = (name, value) => {
    let msg = "";
    
    if (name === "password") {
      if (!value) {
        msg = "Password is required";
      } else if (value.length < 8) {
        msg = "Password must be at least 8 characters long";
      } else if (!/(?=.*[A-Z])/.test(value)) {
        msg = "Password must contain at least one uppercase letter";
      } else if (!/(?=.*\d)/.test(value)) {
        msg = "Password must contain at least one number";
      } else if (!/(?=.*[@$!%*?&])/.test(value)) {
        msg = "Password must contain at least one special character (@$!%*?&)";
      } else if (!passwordRegex.test(value)) {
        msg = "Password format is invalid";
      }
    } else if (name === "confirmPassword") {
      if (!value) {
        msg = "Please confirm your password";
      } else if (value !== fields.password) {
        msg = "Passwords do not match";
      }
    }
    
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
    setApiError(""); // Clear API error on change

    // Also validate confirm password when password changes
    if (name === "password" && fields.confirmPassword && touched.confirmPassword) {
      const confirmPasswordError = value !== fields.confirmPassword ? "Passwords do not match" : "";
      setErrors((prev) => ({ ...prev, confirmPassword: confirmPasswordError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const getMessageType = (name) => {
    if (!touched[name]) return "";
    return errors[name] ? "error" : "";
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setApiError("");

    // Validate all fields before API call
    let valid = true;
    let newErrors = { ...errors };

    // Password validation
    if (!fields.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (!passwordRegex.test(fields.password)) {
      if (fields.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long";
      } else if (!/(?=.*[A-Z])/.test(fields.password)) {
        newErrors.password = "Password must contain at least one uppercase letter";
      } else if (!/(?=.*\d)/.test(fields.password)) {
        newErrors.password = "Password must contain at least one number";
      } else if (!/(?=.*[@$!%*?&])/.test(fields.password)) {
        newErrors.password = "Password must contain at least one special character";
      }
      valid = false;
    }

    // Confirm password validation
    if (!fields.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      valid = false;
    } else if (fields.password !== fields.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    setTouched({ password: true, confirmPassword: true });

    if (!valid) return;

    setLoading(true);

    try {
      // Combine all data for API call
      const payload = {
        email: email,
        otp: otp,
         new_password: fields.password
      };

      const response = await forgotPasswordVerify(payload);

      if (response.status === 200 || response.status === 201) {
        // Success - redirect to login with success message
        navigate("/login", { 
          state: { 
            message: "Password reset successfully! Please login with your new password.",
            messageType: "success"
          } 
        });
      }
    } catch (err) {
      console.error("Password reset error:", err);

      if (err.response) {
        if (err.response.status === 400) {
          setApiError("Invalid OTP or request. Please try the process again.");
        } else if (err.response.status === 404) {
          setApiError("Reset request not found. Please start the process again.");
        } else if (err.response.status === 410) {
          setApiError("OTP has expired. Please request a new one.");
        } else if (err.response.status === 429) {
          setApiError("Too many attempts. Please try again later.");
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

  if (!email || !otp) {
    return null; // Component will redirect
  }

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
            onSubmit={handleResetPassword}
          >
            <div className="">
              <FormPassword
                label="Enter your new password"
                placeholder="e.g. M@rkJos6ph"
                name="password"
                id="password"
                delay={100}
                value={fields.password}
                onChange={handleChange}
                onBlur={handleBlur}
                message={errors.password}
                messageType={getMessageType("password")}
              />
              
              <FormPassword
                label="Confirm your new password"
                placeholder="e.g. M@rkJos6ph"
                name="confirmPassword"
                id="confirmPassword"
                delay={200}
                value={fields.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                message={errors.confirmPassword}
                messageType={getMessageType("confirmPassword")}
              />

              {/* Password Requirements Info */}
              <div className="mt-2 text-sm text-gray-300">
                <p>Password must contain:</p>
                <ul className="list-disc list-inside ml-2 text-xs">
                  <li>At least 8 characters</li>
                  <li>One uppercase letter (A-Z)</li>
                  <li>One number (0-9)</li>
                  <li>One special character (@$!%*?&)</li>
                </ul>
              </div>

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
              onNextClick={handleResetPassword}
              loading={loading}
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

export default ConfirmPassword;