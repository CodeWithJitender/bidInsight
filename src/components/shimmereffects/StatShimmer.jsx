import React from "react";

const StatShimmer = () => {
  // Simulate 5 stat cards like in your dashboard
  const statCards = Array.from({ length: 5 }, (_, index) => index);

  return (
    <div className="flex gap-3 text-[1em]">
      {statCards.map((_, index) => (
        <div
          key={index}
          className="stat-shimmer-card rounded-2xl py-3 px-1 backdrop-blur-sm border border-white/10 shadow-lg"
          style={{ 
            backgroundColor: "#4752CB",
            animationDelay: `${index * 150}ms`
          }}
        >
          <div className="flex gap-2 items-center">
            {/* Title Shimmer */}
            <div 
              className="shimmer-text h-4 rounded-md"
              style={{ 
                width: `${80 + Math.random() * 40}px`, // Random width between 80-120px
                backgroundColor: "#2A3A8F"
              }}
            />
            
            {/* Number Shimmer */}
            <div 
              className="shimmer-number h-5 rounded-md"
              style={{ 
                width: `${40 + Math.random() * 30}px`, // Random width between 40-70px
                backgroundColor: "#2A3A8F"
              }}
            />
          </div>
        </div>
      ))}

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes statShimmer {
          0%, 100% { 
            opacity: 0.4;
            transform: scale(0.98);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.01);
          }
        }

        @keyframes waveShimmer {
          0% { 
            transform: translateX(-100%); 
          }
          100% { 
            transform: translateX(100%); 
          }
        }

        @keyframes pulseGlow {
          0%, 100% { 
            box-shadow: 0 4px 20px rgba(42, 58, 143, 0.3);
          }
          50% { 
            box-shadow: 0 8px 30px rgba(42, 58, 143, 0.5);
          }
        }

        .stat-shimmer-card {
          position: relative;
          overflow: hidden;
          animation: statShimmer 2.5s ease-in-out infinite, 
                     pulseGlow 3s ease-in-out infinite;
          min-width: 120px;
        }

        .stat-shimmer-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 25%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0.1) 75%,
            transparent 100%
          );
          animation: waveShimmer 3s ease-in-out infinite;
          border-radius: inherit;
        }

        .shimmer-text, .shimmer-number {
          position: relative;
          overflow: hidden;
          animation: statShimmer 2s ease-in-out infinite;
        }

        .shimmer-text::before, .shimmer-number::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            110deg,
            transparent 0%,
            rgba(255, 255, 255, 0.15) 25%,
            rgba(255, 255, 255, 0.25) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            transparent 100%
          );
          animation: waveShimmer 2.2s ease-in-out infinite;
          border-radius: inherit;
        }

        .shimmer-number {
          font-weight: 600;
        }

        /* Hover effect for better UX */
        .stat-shimmer-card:hover {
          animation-duration: 1.5s;
          transform: translateY(-2px);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .stat-shimmer-card {
            min-width: 100px;
            padding: 12px 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default StatShimmer;