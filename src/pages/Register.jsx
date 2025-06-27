// import React from "react";
// import FormHeader from "../components/FormHeader";
// import HeroHeading from "../components/HeroHeading";
// import FormField from "../components/FormField";
// import FormPassword from "../components/FormPassword";
// import FormFooter from "../components/FormFooter";
// import { Link } from "react-router-dom";

// function Register() {
//   const data = {
//     title: "Ready to Win More Contracts?",
//     para: "All government bids. One dashboard. Zero hassles.",
//     btnText: false,
//     btnLink: false,
//     container: "max-w-4xl mx-auto text-left",
//     headingSize: "h3",
//     pSize: "text-xl",
//   };
//   const formHeader = {
//     title: "Log In",
//     link: "/login",
//     steps: 6,
//     activeStep: 0,
//   };
//   const formFooter = {
//     back: {
//       text: "Back",
//       link: "/login",
//     },
//     next: {
//       text: "Next",
//       link: "/company-build",
//     },
//     skip: {
//       text: "Next",
//       link: "/company-build",
//     },
//   };
//   return (
//     <>
//       <div className="login bg-blue">
//         <div className="container-fixed">
//           <div className="form-container py-10 h-screen grid grid-cols-1 lg:grid-cols-2 gap-10 px-5 md:px-10 overflow-y-scroll">
//             <div className="form-left flex flex-col  justify-between  ">
//               <div className="pe-3">
//                 <FormHeader {...formHeader} />

//                 <HeroHeading data={data} />
//                 <form
//                   action=""
//                   method="post"
//                   className="forn-container flex flex-col  h-full justify-between max-h-[100%]"
//                 >
//                   <div className="">
//                     <FormField
//                       label="Full Name"
//                       type={"text"}
//                       name="fullName"
//                       placeholder="e.g. John Doe"
//                       delay={100}
//                     />
//                     <FormField
//                       label="Email"
//                       type={"email"}
//                       name="email"
//                       placeholder="e.g. jopseph.mark12@gmail.com"
//                       delay={100}
//                     />
//                     <FormPassword
//                       label="Password"
//                       placeholder="e.g. m@rkJos6ph"
//                       name="password"
//                       id="password"
//                       delay={100}
//                     />
//                     <FormPassword
//                       label="Confirm password"
//                       placeholder="e.g. m@rkJos6ph"
//                       name="password"
//                       id="password"
//                       delay={100}
//                     />
//                   </div>

//                   <div className="">
//                     <div className="accept">
//                     <label className="flex items-center text-white font-t font-normal">
//                       <input type="checkbox" className="mr-2" />I accept the &nbsp;
//                       <Link className="underline" to="/policy">Privacy Policy </Link>
//                       ,&nbsp;
//                       <Link className="underline" to="/terms">
                        
//                         T&C
//                       </Link>
//                       ,&nbsp;
//                       <Link className="underline" to="/member-terms">
                        
//                         Member Terms
//                       </Link>
//                       &nbsp;and&nbsp;
//                       <Link className="underline" to="/disclaimer">
                        
//                         Disclaimer
//                       </Link>
//                       .
//                     </label>
//                   </div>
//                   <FormFooter data={formFooter} />
//                   </div>
//                 </form>
//               </div>
//             </div>
//             <div className="form-right hidden lg:block overflow-hidden ">
//               <div className="form-img">
//                 <img src="/login-img.png" className="h-full" alt="" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Register;





import React from "react";
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

  const formFooter = {
    back: {
      text: "Back",
      link: "/login",
    },
    next: {
      text: "Next",
      link: "/company-build",
    },
    skip: {
      text: "Next",
      link: "/company-build",
    },
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

              <form method="post" className="flex flex-col w-full">
                <div>
                  <FormField
                    label="Full Name"
                    type="text"
                    name="fullName"
                    placeholder="e.g. John Doe"
                    delay={100}
                  />
                  <FormField
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="e.g. joseph.mark12@gmail.com"
                    delay={100}
                  />
                  <FormPassword
                    label="Password"
                    placeholder="e.g. m@rkJos6ph"
                    name="password"
                    id="password"
                    delay={100}
                  />
                  <FormPassword
                    label="Confirm password"
                    placeholder="e.g. m@rkJos6ph"
                    name="password"
                    id="confirmPassword"
                    delay={100}
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
