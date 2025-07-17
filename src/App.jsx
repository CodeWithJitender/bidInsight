import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutWrapper from "./LayoutWrapper";
import AOS from "aos";
import "aos/dist/aos.css";
import Home from "./pages/Home";
import Error404 from "./pages/Error404";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CompanyBuild from "./pages/CompanyBuild";
import GeographicCoverage from "./pages/GeographicCoverage";
import HelpOurAi from "./pages/HelpOurAi";
import IndustryCategories from "./pages/IndustryCategories";
import ExtraData from "./pages/ExtraData";
import EmailVerification from "./components/EmailVerification";
import Verification from "./pages/Verification";
import Dashboard from "./pages/Dashboard";
import Plan from "./pages/Plan";
import Loader from "./components/Loader";
import SummaryPage from "./pages/SummaryPage";
import Pricing from "./pages/Pricing";

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    // <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loader" element={<Loader />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/company-build" element={<CompanyBuild />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/geographic-coverage" element={<GeographicCoverage />} />
          <Route path="/help-our-ai" element={<HelpOurAi />} />
          <Route path="/industry-categories" element={<IndustryCategories />} />
          <Route path="/extra-data" element={<ExtraData />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Remove or keep the base /summary route if needed */}
          {/* <Route path="/summary" element={<SummaryPage />} /> */}

          {/* Dynamic route for bid detail page */}
          <Route path="/summary/:id" element={<SummaryPage />} />

          <Route path="/pricing" element={<Pricing />} />
          <Route path="/*" element={<Error404 />} />
        </Routes>
      </LayoutWrapper>
    // </Router>
  );
};

export default App;












// import React, { useEffect, Suspense, lazy } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LayoutWrapper from "./LayoutWrapper";
// import AOS from "aos";
// import "aos/dist/aos.css";

// // Lazy load all pages
// const Home = lazy(() => import("./pages/Home"));
// const Login = lazy(() => import("./pages/Login"));
// const Register = lazy(() => import("./pages/Register"));
// const CompanyBuild = lazy(() => import("./pages/CompanyBuild"));
// const Plan = lazy(() => import("./pages/Plan"));
// const GeographicCoverage = lazy(() => import("./pages/GeographicCoverage"));
// const HelpOurAi = lazy(() => import("./pages/HelpOurAi"));
// const IndustryCategories = lazy(() => import("./pages/IndustryCategories"));
// const ExtraData = lazy(() => import("./pages/ExtraData"));
// const EmailVerification = lazy(() => import("./components/EmailVerification"));
// const Verification = lazy(() => import("./pages/Verification"));
// const Dashboard = lazy(() => import("./pages/Dashboard"));
// const Error404 = lazy(() => import("./pages/Error404"));

// const App = () => {
//   useEffect(() => {
//     AOS.init({
//       duration: 1000,
//       once: true,
//     });
//   }, []);

//   return (
//     // <Router>
//       <LayoutWrapper>
//         <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/company-build" element={<CompanyBuild />} />
//             <Route path="/plan" element={<Plan />} />
//             <Route path="/geographic-coverage" element={<GeographicCoverage />} />
//             <Route path="/help-our-ai" element={<HelpOurAi />} />
//             <Route path="/industry-categories" element={<IndustryCategories />} />
//             <Route path="/extra-data" element={<ExtraData />} />
//             <Route path="/email-verification" element={<EmailVerification />} />
//             <Route path="/verification" element={<Verification />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/*" element={<Error404 />} />
//           </Routes>
//         </Suspense>
//       </LayoutWrapper>
//     // </Router>
//   );
// };

// export default App;
