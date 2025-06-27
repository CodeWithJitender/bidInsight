import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { saveRegisterData } from "../redux/registerSlice";
import FormHeader from "../components/FormHeader";
import HeroHeading from "../components/HeroHeading";
import FormField from "../components/FormField";
import FormPassword from "../components/FormPassword";
import FormFooter from "../components/FormFooter";
import { Link } from "react-router-dom";

function Register() {
  const data = {
    title: "Ready to Win More Contracts?",
    para: "All government bids. One dashboard. Zero hassles.",
    btnText: false,
    btnLink: false,
    container: "max-w-4xl mx-auto text-left",
    headingSize: "h3",
    pSize: "text-xl",
  };

  const formHeader = {
    title: "Log In",
    link: "/login",
    steps: 6,
    activeStep: 0,
  };

  // Step 1: Navigation links disabled for testing
  const formFooter = {
    back: {
      text: "Back",
      link: "/login",
    },
    next: {
      text: "Next",
      link: null, // Disabled for now
    },
  
  };

  // Step 2: useState for form
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Step 3: handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // inside Register()
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    console.log("handleSubmit called");
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Form Data:");
    console.table(formData);

    // Save to Redux
    dispatch(saveRegisterData(formData));

    // Direct navigation to company-build
    navigate("/company-build");
  };

  return (
    <div className="login bg-blue min-h-screen">
      <div className="container-fixed">
        <div className="form-container grid grid-cols-1 lg:grid-cols-2 h-screen">
          {/* Left Section */}
          <div className="form-left w-full h-full overflow-y-auto px-5 md:px-10 py-8">
            <div className="h-full flex flex-col justify-start">
              <FormHeader {...formHeader} />
              <HeroHeading data={data} />

              {/* Step 5: Add handleSubmit */}
              <form method="post" className="flex flex-col w-full" onSubmit={handleSubmit}>
                <div>
                  <FormField
                    label="Full Name"
                    type="text"
                    name="fullName"
                    placeholder="e.g. John Doe"
                    delay={100}
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  <FormField
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="e.g. joseph.mark12@gmail.com"
                    delay={100}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <FormPassword
                    label="Password"
                    placeholder="e.g. m@rkJos6ph"
                    name="password"
                    id="password"
                    delay={100}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <FormPassword
                    label="Confirm password"
                    placeholder="e.g. m@rkJos6ph"
                    name="confirmPassword"
                    id="confirmPassword"
                    delay={100}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col gap-4 mt-6 w-full">
                  <label className="flex items-center text-white font-t font-normal">
                    <input type="checkbox" className="mr-2" />
                    I accept the&nbsp;
                    <Link className="underline" to="/policy">Privacy Policy</Link>,&nbsp;
                    <Link className="underline" to="/terms">T&C</Link>,&nbsp;
                    <Link className="underline" to="/member-terms">Member Terms</Link>&nbsp;and&nbsp;
                    <Link className="underline" to="/disclaimer">Disclaimer</Link>.
                  </label>


                  {/* Step 7: Optional UI Footer */}
                  <FormFooter data={formFooter} />
                </div>
              </form>
            </div>
          </div>

          {/* Right Section */}
          <div className="form-right hidden lg:flex items-center justify-center overflow-hidden">
            <div className="form-img w-full h-full pt-8 pb-8">
              <img
                src="/register.png"
                alt="Login"
                className="w-full h-full p-0 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
