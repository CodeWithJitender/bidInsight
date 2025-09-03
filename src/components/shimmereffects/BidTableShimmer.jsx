import React from "react";

const ShimmerRow = ({ index }) => {
  return (
    <tr className="relative border-b border-white/10 hover:bg-white/5 transition overflow-hidden">
      <td colSpan={8} className="px-4 py-4">
        <div className="relative w-full h-6 rounded-lg bg-white/5 overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-full shimmer-bar"></div>
        </div>
      </td>
    </tr>
  );
};

const BidTableShimmer = () => {
  return (
    <div className="w-full rounded-2xl bg-btn text-white my-12 shadow-xl overflow-x-auto border-white border-2 border-solid relative max-h-screen overflow-y-auto">
      <table className="min-w-full table-auto text-sm text-center">
        <thead className="sticky top-0 bg-white/5 backdrop-blur-sm z-10">
          <tr className="border-b border-white/20">
            {Array(8).fill(0).map((_, idx) => (
              <th key={idx} className="px-4 py-4">
                <div className="shimmer h-4 w-20 rounded-lg mx-auto opacity-60" style={{ animationDelay: `${idx * 0.05}s` }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array(12).fill(0).map((_, idx) => (
            <ShimmerRow key={idx} index={idx} />
          ))}
        </tbody>
      </table>

      <style jsx>{`
        @keyframes shimmerFlow {
          0% { transform: translateX(-100%); opacity: 0; }
          25% { opacity: 0.3; }
          50% { opacity: 0.5; }
          75% { opacity: 0.3; }
          100% { transform: translateX(100%); opacity: 0; }
        }

        .shimmer-bar {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
          animation: shimmerFlow 2s infinite ease-in-out;
        }

        .shimmer {
          position: relative;
          overflow: hidden;
          background: linear-gradient(
            110deg,
            rgba(255, 255, 255, 0.03) 0%,
            rgba(255, 255, 255, 0.08) 25%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.08) 75%,
            rgba(255, 255, 255, 0.03) 100%
          );
          background-color: rgba(255, 255, 255, 0.04);
          background-size: 200% 100%;
          animation: shimmerFlow 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default BidTableShimmer;
