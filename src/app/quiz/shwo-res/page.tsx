"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Link from "next/link";

interface Result {
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
}

const AllResult: React.FC = () => {
  const [allData, setAllData] = useState<Result | null>(null);

  useEffect(() => { 
    const query = new URLSearchParams(window.location.search);
    const data = query.get("data");

    if (data) {
      setAllData(JSON.parse(data));
    }
  }, []);

  if (!allData) return <p>Loading results...</p>;

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative h-screen w-full flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="h-screen w-full rounded-md relative flex flex-col items-center">
          <h1 className="relative z-10 pt-12 text-lg md:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
            Quiz Results
          </h1>

          <div className="mt-10 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 p-6 rounded-lg shadow-[0px_4px_15px_rgba(0,0,0,0.5)] bg-neutral-800 text-white text-center">
            <p className="text-lg font-semibold mb-4">Your Results</p>

            <p>
              Total Questions: <span>{allData.totalQuestions}</span>
            </p>
            <p>
              Total Score: <span>{allData.score}</span>
            </p>
            <p>
              Correct Answers: <span>{allData.correctAnswers}</span>
            </p>
            <p>
              Wrong Answers: <span>{allData.wrongAnswers}</span>
            </p>

            <button className="mt-6 w-full py-3 rounded-lg font-semibold bg-gradient-to-b from-neutral-300 to-neutral-700 text-neutral-900 hover:from-neutral-400 hover:to-neutral-800 transition-all duration-300 ease-in">
              <Link href={"/quiz"}>Restart Quiz</Link>
            </button>
          </div>
        </div>
      </motion.div>
    </AuroraBackground>
  );
};

export default AllResult;
