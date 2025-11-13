// import React, { useEffect, lazy, Suspense } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LayoutWrapper from "./LayoutWrapper";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import ScrollToTop from "./components/ScrollToTop";
// import ProtectedRoute from "./protectedRoute/ProtectedRoute";
// import ShimmerSummaryCard from "./components/shimmereffects/ShimmerSummaryCard.jsx";
// import AiToolSet from "./pages/AiToolSet.jsx";
// import HelpCenter from "./pages/HelpCenter.jsx";
// import UserProfile from "./pages/UserProfile.jsx";
// import PaymentPage from "./pages/Payment.jsx";
// import PaymentStatus from "./pages/PaymentStatus.jsx";
// import ConfirmPassword from "./pages/ConfirmPassword.jsx";
// import { fetchUserProfile } from "./redux/reducer/profileSlice.js";
// import ForgotVerification from "./pages/ForgotVerification.jsx";
// import ChangePaymentMethod from "./pages/ChangePaymentMethod.jsx";
// import ChangePaymentPopup from "./components/ChangePaymentPopup.jsx";
// import OnboardingProtectedRoute from "./protectedRoute/OnboardingProtectedRoute.jsx";
// import BidAnalizer from "./pages/aitoolspage/BidAnalizer.jsx";
// // import PaymentPopup from "./components/PaymentPopup.jsx";

// // Lazy-loaded Pages
// const Home = lazy(() => import("./pages/Home"));
// const Error404 = lazy(() => import("./pages/Error404"));
// const Login = lazy(() => import("./pages/Login"));
// const Register = lazy(() => import("./pages/Register"));
// const CompanyBuild = lazy(() => import("./pages/CompanyBuild"));
// const GeographicCoverage = lazy(() => import("./pages/GeographicCoverage"));
// const HelpOurAi = lazy(() => import("./pages/HelpOurAi"));
// const IndustryCategories = lazy(() => import("./pages/IndustryCategories"));
// const ExtraData = lazy(() => import("./pages/ExtraData"));
// const EmailVerification = lazy(() => import("./components/EmailVerification"));
// const Verification = lazy(() => import("./pages/Verification"));
// const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
// const Dashboard = lazy(() => import("./pages/Dashboard"));
// const Plan = lazy(() => import("./pages/Plan"));
// const SummaryPage = lazy(() => import("./pages/SummaryPage"));
// const Pricing = lazy(() => import("./pages/Pricing"));
// const AboutUs = lazy(() => import("./pages/AboutUs"));
// const SuperAdmin = lazy(() => import("./pages/SuperAdmin"));
// const Payment = lazy(() => import("./components/Payment"));

// // const PaymentUnsuccessful = lazy(() => import("./sections/payment/PaymentUnsuccessful"));


// const App = () => {
//   useEffect(() => {
//     AOS.init({
//       duration: 1000,
//       once: true,
//     });
//   }, []);
//  const content = {
//     image: "/process-activation.png",
//     title: "Your Plan is on the Way!",
//     description:
//       "We’ve received your payment and are setting up your subscription. This may take a few minutes. You’ll get notified once everything is ready.",
//     // details: [
//     //   { label: "Invoice Number", value: "absk-23094-jlaksjd-3993" },
//     //   { label: "Transaction Date", value: "12/09/2025" },
//     //   { label: "Payment Mode", value: "MasterCard 0922" },
//     //   { label: "Subtotal", value: "$302.00" },
//     //   { label: "Tax", value: "$10.00" },
//     // ],
//     buttons: [
//       {
//         type: "link",
//         text: "Go Back to Home Page",
//         url: "/",
//       },
//       {
//         type: "button",
//         text: "Download Invoice",
//         onClick: () => alert("Downloading Invoice..."),
//       },
//     ],
//     note: {
//       text: " If it takes longer than expected, please reach us at ",
//       email: "support@bidinsight.com",
//     },
//   };

//   useEffect(() => {
//     fetchUserProfile()
//   },[])

//   return (
//     <LayoutWrapper>
//       <ScrollToTop />
//       <Suspense>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           {/* <Route path="forgot-password" element={<OTPVerification />} /> */}
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/forgot-otp" element={<ForgotVerification />} />
//           <Route path="confirm-password" element={<ConfirmPassword />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/company-build" element={<CompanyBuild />} />
//           <Route path="/help" element={<HelpCenter />} />
//           {/* <Route path="/paymentpopup" element={<PaymentPopup />} /> */}
//           {/* <Route path="/i" element={<IndustryCategoriesSkeletonLeft />} /> */}
//           <Route path="/ai-toolset" element={<AiToolSet />} />
//           {/* <Route path="/bid-analyzer" element={<ProtectedRoute><BidAnalizer initialTab="bid-analyzer" /></ProtectedRoute>} /> */}
//           <Route path="/plan" element={<Plan />} />
//           <Route path="/geographic-coverage" element={<ProtectedRoute> <OnboardingProtectedRoute> <GeographicCoverage /> </OnboardingProtectedRoute> </ProtectedRoute>} />
//           <Route path="/industry-categories" element={<ProtectedRoute> <OnboardingProtectedRoute> <IndustryCategories />  </OnboardingProtectedRoute> </ProtectedRoute>} />
//           <Route path="/help-our-ai" element={<ProtectedRoute> <OnboardingProtectedRoute> <HelpOurAi /> </OnboardingProtectedRoute>  </ProtectedRoute>} />
//           <Route path="/extra-data" element={<ProtectedRoute> <OnboardingProtectedRoute> <ExtraData /> </OnboardingProtectedRoute> </ProtectedRoute>} />
//           <Route path="/email-verification" element={<EmailVerification />} />
//           <Route path="/verification" element={<Verification />} />
//           <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//            <Route path="/dashboard/bookmarkBids" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//             <Route path="/dashboard/followedBids" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//           <Route path="/summary/:id" element={<Suspense fallback={<ShimmerSummaryCard />}> <ProtectedRoute><SummaryPage /></ProtectedRoute> </Suspense>} />
//           <Route path="/pricing" element={<Pricing />} />
//           <Route path="/about" element={<AboutUs />} />
//           <Route path="/super-admin" element={<ProtectedRoute><SuperAdmin /></ProtectedRoute>} />
//           <Route path="/user-profile/" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} >
//             <Route path="change-payment-method" element={<ProtectedRoute><ChangePaymentMethod /></ProtectedRoute>} />
//           </Route>
//           <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
//           <Route path="/payment-status" element={<ProtectedRoute><PaymentStatus /></ProtectedRoute>} />
//           <Route path="/payment" element={<Payment content={content} />} />
//           <Route path="/*" element={<Error404 />} />
//           <Route path="/ChangePayment" element={<ChangePaymentPopup />} />
//           {/* <Route path="/payment-unsuccessful" element={<PaymentUnsuccessful />} /> */}
//         </Routes>
//       </Suspense> 
//     </LayoutWrapper>
//   );
// };


// export default App;


import React, { useEffect, lazy, Suspense, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import LayoutWrapper from "./LayoutWrapper";
import AOS from "aos";
import "aos/dist/aos.css";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";
import ShimmerSummaryCard from "./components/shimmereffects/ShimmerSummaryCard.jsx";
import AiToolSet from "./pages/AiToolSet.jsx";
import HelpCenter from "./pages/HelpCenter.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import PaymentPage from "./pages/Payment.jsx";
import PaymentStatus from "./pages/PaymentStatus.jsx";
import ConfirmPassword from "./pages/ConfirmPassword.jsx";
import { fetchUserProfile } from "./redux/reducer/profileSlice.js";
import ForgotVerification from "./pages/ForgotVerification.jsx";
import ChangePaymentMethod from "./pages/ChangePaymentMethod.jsx";
import ChangePaymentPopup from "./components/ChangePaymentPopup.jsx";
import OnboardingProtectedRoute from "./protectedRoute/OnboardingProtectedRoute.jsx";
import BidAnalizer from "./pages/aitoolspage/BidAnalizer.jsx";

// 🔥 Redux imports for logout
import { persistor } from "./redux/store";
import { clearProfile } from "./redux/reducer/profileSlice";
import { logoutUser } from "./redux/reducer/authSlice";
import { clearLoginData } from "./redux/reducer/loginSlice";
import { clearOnboardingData } from "./redux/reducer/onboardingSlice";
import { clearSavedSearches } from "./redux/reducer/savedSearchesSlice";

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

// 🔥 Idle Timeout Component (App ke andar chalega)
const IdleTimeoutHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const timeoutRef = useRef(null);
  
  // 1 hour = 60 * 60 * 1000 milliseconds
  const IDLE_TIMEOUT = 60 * 60 * 1000; // 1 hour
  // const IDLE_TIMEOUT = 10 * 1000; // 10 seconds (testing ke liye)

  const handleAutoLogout = async () => {
    console.log("⏰ User idle for 1 hour - Auto logout");
    
    try {
      // Redux state clear
      dispatch(clearProfile());
      dispatch(logoutUser());
      dispatch(clearLoginData());
      dispatch(clearOnboardingData());
      dispatch(clearSavedSearches());

      // Persist clear
      await persistor.purge();
      
      // Storage clear
      localStorage.clear();
      sessionStorage.clear();

      // Clear cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(
            /=.*/,
            `=;expires=${new Date(0).toUTCString()};path=/;domain=${window.location.hostname}`
          );
      });

      // Clear cache
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      // Clear IndexedDB
      if ("indexedDB" in window) {
        const dbs = await indexedDB.databases();
        for (const db of dbs) {
          await indexedDB.deleteDatabase(db.name);
        }
      }

      // Unregister service workers
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }

      // Redirect to login
      navigate("/login", { replace: true });
      
      // Optional: Alert user
      alert("You have been logged out due to inactivity.");
    } catch (error) {
      console.error("Auto logout error:", error);
      navigate("/login", { replace: true });
    }
  };

  const resetTimer = () => {
    // Clear existing timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timer
    timeoutRef.current = setTimeout(() => {
      handleAutoLogout();
    }, IDLE_TIMEOUT);
  };

  useEffect(() => {
    // Events jo user activity track karenge
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Har event pe timer reset karo
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Initial timer set karo
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return null; // Kuch render nahi karna
};

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
      "We've received your payment and are setting up your subscription. This may take a few minutes. You'll get notified once everything is ready.",
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
    fetchUserProfile();
  }, []);

  return (
    <LayoutWrapper>
      <ScrollToTop />
      {/* 🔥 Idle Timeout Handler - Router ke andar */}
      <IdleTimeoutHandler />
      
      <Suspense>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-otp" element={<ForgotVerification />} />
          <Route path="confirm-password" element={<ConfirmPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/company-build" element={<CompanyBuild />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/ai-toolset" element={<AiToolSet />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/geographic-coverage" element={<ProtectedRoute> <OnboardingProtectedRoute> <GeographicCoverage /> </OnboardingProtectedRoute> </ProtectedRoute>} />
          <Route path="/industry-categories" element={<ProtectedRoute> <OnboardingProtectedRoute> <IndustryCategories />  </OnboardingProtectedRoute> </ProtectedRoute>} />
          <Route path="/help-our-ai" element={<ProtectedRoute> <OnboardingProtectedRoute> <HelpOurAi /> </OnboardingProtectedRoute>  </ProtectedRoute>} />
          <Route path="/extra-data" element={<ProtectedRoute> <OnboardingProtectedRoute> <ExtraData /> </OnboardingProtectedRoute> </ProtectedRoute>} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/bookmarkBids" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/followedBids" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/summary/:id" element={<Suspense fallback={<ShimmerSummaryCard />}> <ProtectedRoute><SummaryPage /></ProtectedRoute> </Suspense>} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/super-admin" element={<ProtectedRoute><SuperAdmin /></ProtectedRoute>} />
          <Route path="/user-profile/" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} >
            <Route path="change-payment-method" element={<ProtectedRoute><ChangePaymentMethod /></ProtectedRoute>} />
          </Route>
          <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/payment-status" element={<ProtectedRoute><PaymentStatus /></ProtectedRoute>} />
          <Route path="/payment" element={<Payment content={content} />} />
          <Route path="/*" element={<Error404 />} />
          <Route path="/ChangePayment" element={<ChangePaymentPopup />} />
        </Routes>
      </Suspense> 
    </LayoutWrapper>
  );
};

export default App;