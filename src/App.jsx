import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutWrapper from "./LayoutWrapper";
import AOS from "aos";
import "aos/dist/aos.css";
import ScrollToTop from "./components/ScrollToTop";
import Loader from "./components/Loader";


// Lazy-loaded Pages
const Home = lazy(() => import("./pages/Home"));
const Error404 = lazy(() => import("./pages/Error404"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const CompanyBuild = lazy(() => import("./pages/CompanyBuild"));
const GeographicCoverage = lazy(() => import("./pages/GeographicCoverage"));
const HelpOurAi = lazy(() => import("./pages/HelpOurAi"));
const IndustryCategories = lazy(() => import("./pages/IndustryCategories"));
const ExtraData = lazy(() => import("./pages/ExtraData"));
const EmailVerification = lazy(() => import("./components/EmailVerification"));
const Verification = lazy(() => import("./pages/Verification"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Plan = lazy(() => import("./pages/Plan"));
const SummaryPage = lazy(() => import("./pages/SummaryPage"));
const Pricing = lazy(() => import("./pages/Pricing"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const SuperAdmin = lazy(() => import("./pages/SuperAdmin"));


const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);


  return (
      <LayoutWrapper>
        <ScrollToTop />
        <Suspense fallback={<Loader />}>
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
            <Route path="/summary" element={<SummaryPage />} />
            <Route path="/summary/:id" element={<SummaryPage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/super-admin" element={<SuperAdmin />} />
            <Route path="/*" element={<Error404 />} />
          </Routes>
        </Suspense>
      </LayoutWrapper>
  );
};


export default App;
