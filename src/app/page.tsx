import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { fadeIn, bounce } from "@/utils/animations";

const Home = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden relative">
      <BackgroundBeams />
      
      <div className="container text-center relative z-10 px-4">
        <motion.div
          variants={fadeIn("up")}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400"
            variants={bounce}
            initial="initial"
            animate="animate"
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 2,
              repeatDelay: 1
            }}
          >
            Welcome to the Quiz App
          </motion.h1>
          
          <motion.p 
            className="mb-10 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            animate="visible"
          >
            Test your knowledge with our exciting quiz! Choose from various categories and difficulty levels.
          </motion.p>

          <motion.div
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/quiz">
              <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  Start Quiz
                </span>
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default Home;
