import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutWrapper from "./LayoutWrapper";
import AOS from "aos";
import "aos/dist/aos.css";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";
import ShimmerSummaryCard from "./components/shimmereffects/ShimmerSummaryCard.jsx";
import AiToolSet from "./pages/AiToolSet.jsx";
import HelpCenter from "./pages/HelpCenter.jsx";
import OTPVerification from "./components/OTPVerification.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import PaymentPage from "./pages/Payment.jsx";
import PaymentStatus from "./pages/PaymentStatus.jsx";
import ConfirmPassword from "./pages/ConfirmPassword.jsx";
import { fetchUserProfile } from "./redux/reducer/profileSlice.js";
import ForgotVerification from "./pages/ForgotVerification.jsx";
// import PaymentPopup from "./components/PaymentPopup.jsx";

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
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Plan = lazy(() => import("./pages/Plan"));
const SummaryPage = lazy(() => import("./pages/SummaryPage"));
const Pricing = lazy(() => import("./pages/Pricing"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const SuperAdmin = lazy(() => import("./pages/SuperAdmin"));
const Payment = lazy(() => import("./components/Payment"));

// const PaymentUnsuccessful = lazy(() => import("./sections/payment/PaymentUnsuccessful"));


const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
 const content = {
    image: "/process-activation.png",
    title: "Your Plan is on the Way!",
    description:
      "We’ve received your payment and are setting up your subscription. This may take a few minutes. You’ll get notified once everything is ready.",
    // details: [
    //   { label: "Invoice Number", value: "absk-23094-jlaksjd-3993" },
    //   { label: "Transaction Date", value: "12/09/2025" },
    //   { label: "Payment Mode", value: "MasterCard 0922" },
    //   { label: "Subtotal", value: "$302.00" },
    //   { label: "Tax", value: "$10.00" },
    // ],
    buttons: [
      {
        type: "link",
        text: "Go Back to Home Page",
        url: "/",
      },
      {
        type: "button",
        text: "Download Invoice",
        onClick: () => alert("Downloading Invoice..."),
      },
    ],
    note: {
      text: " If it takes longer than expected, please reach us at ",
      email: "support@bidinsight.com",
    },
  };

  useEffect(() => {
    fetchUserProfile()
  },[])

  return (
    <LayoutWrapper>
      <ScrollToTop />
      <Suspense>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="forgot-password" element={<OTPVerification />} /> */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-otp" element={<ForgotVerification />} />
          <Route path="confirm-password" element={<ConfirmPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/company-build" element={<CompanyBuild />} />
          <Route path="/help" element={<HelpCenter />} />
          {/* <Route path="/paymentpopup" element={<PaymentPopup />} /> */}
          {/* <Route path="/i" element={<IndustryCategoriesSkeletonLeft />} /> */}
          <Route path="/ai-toolset" element={<AiToolSet />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/geographic-coverage" element={<ProtectedRoute> <GeographicCoverage /> </ProtectedRoute>} />
          <Route path="/industry-categories" element={<ProtectedRoute> <IndustryCategories /> </ProtectedRoute>} />
          <Route path="/help-our-ai" element={<ProtectedRoute> <HelpOurAi /> </ProtectedRoute>} />
          <Route path="/extra-data" element={<ProtectedRoute><ExtraData /></ProtectedRoute>} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
           <Route path="/dashboard/bookmarkBids" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/followedBids" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/summary/:id" element={<Suspense fallback={<ShimmerSummaryCard />}> <ProtectedRoute><SummaryPage /></ProtectedRoute> </Suspense>} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/super-admin" element={<ProtectedRoute><SuperAdmin /></ProtectedRoute>} />
          <Route path="/user-profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/payment-status" element={<ProtectedRoute><PaymentStatus /></ProtectedRoute>} />
          <Route path="/*" element={<Error404 />} />
          <Route path="/payment" element={<Payment content={content} />} />
          {/* <Route path="/payment-unsuccessful" element={<PaymentUnsuccessful />} /> */}
        </Routes>
      </Suspense> 
    </LayoutWrapper>
  );
};


export default App;
