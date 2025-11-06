import React from "react";
import { motion } from "framer-motion";
import { Button } from "@headlessui/react";
import NormalBtn from "../components/NormalBtn";

const AiToolSet = () => {
  return (
    <div
      className="relative flex items-center justify-center h-screen text-white overflow-hidden bg-blue bg-center"
      // style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 " />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center px-6 relative z-10"
      >
        {/* Logo/Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex justify-center mb-6"
        >
          <img
            src="/icon.png"
            alt="AI Toolkit Icon"
            className="w-16 h-16 md:w-20 md:h-20 drop-shadow-[0_0_15px_rgba(59,130,246,0.7)]"
          />
        </motion.div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold font-archivo mb-6 leading-tight">
          A.I. Toolset{" "}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Coming Soon
            {/* Glowing Underline */}
            <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-pulse"></span>
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-white max-w-xl mx-auto text-lg md:text-xl leading-relaxed">
          Revolutionizing productivity with next-gen AI tools. Stay tuned for
          something powerful.
        </p>
        <NormalBtn text="Get Notified" btnFun={true} />
      </motion.div>
    </div>
  );
};

export default AiToolSet;









// import React from "react";
// import { Sparkles, TrendingUp, FileText, Brain, Target, Zap } from "lucide-react";

// const AiToolSet = () => {
//   const aiTools = [
//     {
//       id: 1,
//       name: "Smart Bid Analyzer",
//       description: "AI-powered bid analysis with risk assessment and winning probability predictions",
//       icon: TrendingUp,
//       available: true,
//       route: "/bid-analyzer",
//       gradient: "from-blue-500 via-indigo-500 to-purple-600",
//       glowColor: "rgba(99, 102, 241, 0.4)"
//     },
//     {
//       id: 2,
//       name: "Proposal Generator",
//       description: "Create winning bid proposals automatically with AI-driven content generation",
//       icon: FileText,
//       available: false,
//       gradient: "from-purple-500 via-pink-500 to-rose-600",
//       glowColor: "rgba(168, 85, 247, 0.4)"
//     },
//     {
//       id: 3,
//       name: "Competitor Intelligence",
//       description: "Analyze competitor bids and market positioning with advanced AI insights",
//       icon: Target,
//       available: false,
//       gradient: "from-cyan-500 via-blue-500 to-indigo-600",
//       glowColor: "rgba(34, 211, 238, 0.4)"
//     },
//     {
//       id: 4,
//       name: "Price Optimizer",
//       description: "Optimize your bid pricing strategy using machine learning algorithms",
//       icon: Zap,
//       available: false,
//       gradient: "from-amber-500 via-orange-500 to-red-600",
//       glowColor: "rgba(245, 158, 11, 0.4)"
//     },
//     {
//       id: 5,
//       name: "Document Analyzer",
//       description: "Extract key requirements from tender documents with AI-powered scanning",
//       icon: Brain,
//       available: false,
//       gradient: "from-emerald-500 via-teal-500 to-cyan-600",
//       glowColor: "rgba(16, 185, 129, 0.4)"
//     },
//     {
//       id: 6,
//       name: "Smart Assistant",
//       description: "Your AI bidding companion for real-time suggestions and workflow automation",
//       icon: Sparkles,
//       available: false,
//       gradient: "from-violet-500 via-purple-500 to-fuchsia-600",
//       glowColor: "rgba(139, 92, 246, 0.4)"
//     }
//   ];

//   const handleCardClick = (tool) => {
//     if (tool.available) {
//       // Navigate to the route - you can use window.location or your router
//       window.location.href = tool.route;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-blue text-white py-20 px-4 overflow-hidden">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
//         <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
//       </div>

//       {/* Header */}
//       <div className="text-center pt-12 mb-16 relative z-10 animate-fade-in">
//         <div className="inline-block mb-6">
//           {/* <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50 animate-spin-slow"> */}
//             {/* <Sparkles className="w-10 h-10 text-white" /> */}
//             <img src="icon.png" alt="" />
//           {/* </div> */}
//         </div>

//         <h1 className="text-5xl md:text-7xl font-extrabold font-archivo mb-4">
//           A.I. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Toolset</span>
//         </h1>
//         <p className="text-xl text-blue-200 max-w-2xl mx-auto">
//           Revolutionizing bidding with next-generation AI tools
//         </p>
//       </div>

//       {/* AI Tools Grid */}
//       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
//         {aiTools.map((tool, index) => {
//           const IconComponent = tool.icon;
//           return (
//             <div
//               key={tool.id}
//               onClick={() => handleCardClick(tool)}
//               className={`relative group ${tool.available ? 'cursor-pointer' : 'cursor-not-allowed'} animate-slide-up`}
//               style={{ animationDelay: `${index * 100}ms` }}
//             >
//               {/* Card */}
//               <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border-[1px] overflow-hidden h-full transition-all duration-300 hover:border-white/40 hover:-translate-y-2 hover:shadow-2xl">
                
//                 {/* Gradient Overlay on Hover */}
//                 <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
//                 {/* Glow Effect */}
//                 <div 
//                   className="absolute -inset-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"
//                   style={{
//                     background: `radial-gradient(circle at center, ${tool.glowColor}, transparent 70%)`
//                   }}
//                 />

//                 {/* Coming Soon Badge */}
//                 {!tool.available && (
//                   <div className="absolute top-4 right-4 z-10">
//                     <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
//                       Coming Soon
//                     </div>
//                   </div>
//                 )}

//                 {/* Icon */}
//                 <div className={`mb-6 relative ${!tool.available && 'opacity-60'}`}>
//                   <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}>
//                     <IconComponent className="w-8 h-8 text-white" strokeWidth={2.5} />
//                   </div>
                  
//                   {/* Available Indicator */}
//                   {tool.available && (
//                     <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg animate-pulse" />
//                   )}
//                 </div>

//                 {/* Content */}
//                 <div className={!tool.available ? 'opacity-60' : ''}>
//                   <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors duration-300">
//                     {tool.name}
//                   </h3>
//                   <p className="text-blue-200 text-sm leading-relaxed">
//                     {tool.description}
//                   </p>
//                 </div>

//                 {/* Launch Button for Available Tool */}
//                 {tool.available && (
//                   <div className="mt-6 flex items-center text-blue-400 font-semibold group-hover:text-blue-300 transition-all duration-300 group-hover:translate-x-2">
//                     Launch Tool
//                     <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                     </svg>
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Bottom CTA */}
//       <div className="text-center mt-20 relative z-10 animate-fade-in" style={{ animationDelay: '1s' }}>
//         <p className="text-blue-300 mb-4">More powerful tools launching soon</p>
//         <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95">
//           Get Notified
//         </button>
//       </div>

//       <style>{`
//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         @keyframes slide-up {
//           from { opacity: 0; transform: translateY(50px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         @keyframes spin-slow {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }

//         .animate-fade-in {
//           animation: fade-in 0.8s ease-out forwards;
//         }

//         .animate-slide-up {
//           animation: slide-up 0.5s ease-out forwards;
//           opacity: 0;
//         }

//         .animate-spin-slow {
//           animation: spin-slow 20s linear infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AiToolSet;