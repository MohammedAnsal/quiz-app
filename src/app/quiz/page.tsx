"use client";

import React, { useEffect, useState } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { quiz } from "../data";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type Sans = {
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
};

const QuizPage: React.FC = () => {
  const router = useRouter();

  const [checked, setChecked] = useState<boolean>(false);
  const [activeQuestion, setActiveQuestion] = useState<number>(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null
  );
  const [showResult, setShowResult] = useState<boolean>(false);
  const { questions, totalQuestions } = quiz;
  const [result, setResult] = useState<Sans>({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    totalQuestions: totalQuestions,
  });
  const [selectedAnswer, setSelectedAnswer] = useState<boolean>(false);

  const { question, answers, correctAnswer } = questions[activeQuestion];

  useEffect(() => {

    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }

  }, []);

  //  Manage Answer Is Correct or Not

  const onAnswerSelected = (ans: string, index: number) => {
    setChecked(true);
    setSelectedAnswerIndex(index);

    if (ans === correctAnswer) {
      setSelectedAnswer(true);
      console.log("Correct answer");
    } else {
      setSelectedAnswer(false);
      console.log("Wrong answer");
    }
  };

  //  Calculate Score And Increment Next Question

  const nextQuestion = () => {
    setSelectedAnswerIndex(null);

    setResult((prev) =>
      selectedAnswer
        ? {
            ...prev,
            score: prev?.score + 1,
            correctAnswers: prev?.correctAnswers + 1,
          }
        : {
            ...prev,
            wrongAnswers: prev?.wrongAnswers + 1,
          }
    );

    if (activeQuestion === questions.length - 1) {
      setActiveQuestion(0);
      setShowResult(true);
    } else {
      setActiveQuestion((prev) => prev + 1);
    }

    setChecked(false);
  };

  //  Pass All Result

  const handleAllRes = () => {
    router.push(`/quiz/shwo-res?data=${JSON.stringify(result)}`);
  };

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative h-screen w-full flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="h-screen w-full rounded-md relative flex flex-col antialiased items-center">
          <h1 className="relative z-10 pt-12 text-lg md:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
            Quiz App
          </h1>

          {!showResult && (
            <>
              <div className="text-center pt-5">
                <h2 className="text-xl font-semibold text-neutral-[.3]">
                  Question: {activeQuestion + 1}/{totalQuestions}
                </h2>
              </div>

              <div className="flex justify-center mt-10 w-full">
                <div className="quiz-container w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 p-4 rounded-lg transition-all duration-300 ease-in shadow-[0px_4px_15px_rgba(0,0,0,0.5)]">
                  <h3 className="text-xl text-gray-400 font-medium text-center mb-4 text-neutral-[.3]">
                    {question}
                  </h3>

                  <ul className="space-y-3 text-gray-300">
                    {answers.map((ans, index) => (
                      <li
                        key={index}
                        onClick={() => onAnswerSelected(ans, index)}
                        className={`p-3 rounded-lg border-2 text-center cursor-pointer transition-all duration-[.3] ease-in ${
                          selectedAnswerIndex === index
                            ? ans === correctAnswer
                              ? "border-2 border-green-500 bg-gradient-to-b text-white"
                              : "border-2 border-red-500 bg-gradient-to-b text-white"
                            : `shadow-[1px_4px_15px_rgba(0,0,0,0.1)] hover:border-white border-transparent hover:text-white`
                        } `}
                      >
                        <span>{ans}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="text-center mt-5">
                    {checked ? (
                      <button
                        onClick={nextQuestion}
                        className="btn w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 ease-in bg-gradient-to-b from-neutral-300 to-neutral-700 text-neutral-900 hover:from-neutral-400 hover:to-neutral-800"
                      >
                        {activeQuestion + 1 === questions.length
                          ? "Finish"
                          : "Next"}
                      </button>
                    ) : (
                      <button
                        onClick={nextQuestion}
                        disabled
                        className="btn-disabled w-full py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-neutral-800 to-black text-neutral-400 cursor-not-allowed"
                      >
                        {activeQuestion + 1 === questions.length
                          ? "Finish"
                          : "Next"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {showResult && (
            <div className="text-white w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl text-white font-semibold mb-4">
                Results
              </h3>

              <h3 className="text-lg mb-2 text-white">
                Overall Score: {(result.score / questions.length) * 100}%
              </h3>

              <button
                onClick={handleAllRes}
                className="mt-4 w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 ease-in bg-gradient-to-b from-neutral-300 to-neutral-700 text-neutral-900 hover:from-neutral-400 hover:to-neutral-800"
              >
                Show All Results
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AuroraBackground>
  );
};

export default QuizPage;
