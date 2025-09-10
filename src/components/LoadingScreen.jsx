import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen({ progress, isDone }) {
  return (
    <AnimatePresence>
      {!isDone && (
        <div className="absolute inset-0 h-screen bg-blue z-[10000]">
          <div className="container-fixed">
            <motion.div
              className="flex flex-col items-center justify-center h-screen text-white relative"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              {/* Progress Counter */}
              <div className="absolute top-10 left-10 font-bold text-g font-h h1">
                {progress} / 100
              </div>

              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-2"
              >
                <span className="text-3xl font-semibold">
                  <img src="/logo.png" className="max-w-[200px]" alt="Logo" />
                </span>
              </motion.div>

              {/* Progress Bar */}
              <div className="absolute bottom-16 w-full">
                <div className="h-1 bg-white/30 rounded-full relative">
                  <motion.div
                    className="h-1 bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeInOut", duration: 0.2 }}
                  />
                  {/* Circle Indicator */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md"
                    animate={{ left: `${progress}%` }}
                    transition={{ ease: "easeInOut", duration: 0.2 }}
                  />
                </div>
                <div className="text-right mt-2 text-xl">Loading</div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
