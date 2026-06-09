"use client";

import React, { useStatct,e } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { fetchQuizQuestions, QuizData, quizCategories, difficultyLevels } from "@/services/api";
import { fadeIn, staggerContainer, scaleUp, shake, progressBar } from "@/utils/animations";

// type Sans = {
//   score: number;
//   correctAnswers?: number;
//   wrongAnswers?: number;
//   totalQuestions?: number;
// };
type Sans = {
  score: number;
  correctAnswers?: number;
  wrongAnswers?: number;
  totalQuestions?: number;
};

const QuizPage: React.FC = () => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [activeQuestion, setActiveQuestion] = useState<number>(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<number>(9); // Default: General Knowledge
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("easy");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [result, setResult] = useState<Sans>({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    totalQuestions: 5,
  });
  const [selectedAnswer, setSelectedAnswer] = useState<boolean>(false);
  const [wrongAnimation, setWrongAnimation] = useState<boolean>(false);

  // Load quiz data
  const loadQuizData = async () => {
    setLoading(true);
    try {
      const data = await fetchQuizQuestions(questionCount, selectedCategory, selectedDifficulty);
      setQuizData(data);
      setResult(prev => ({
        ...prev,
        totalQuestions: data.totalQuestions
      }));
    } catch (error) {
      console.error("Failed to load quiz data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Start the quiz with selected settings
  const startQuiz = () => {
    setShowSettings(false);
    loadQuizData();
  };

  // Handle answer selection
  const onAnswerSelected = (ans: string, index: number) => {
    setChecked(true);
    setSelectedAnswerIndex(index);

    if (!quizData) return;
    
    const { correctAnswer } = quizData.questions[activeQuestion];
    
    if (ans === correctAnswer) {
      setSelectedAnswer(true);
    } else {
      setSelectedAnswer(false);
      setWrongAnimation(true);
      setTimeout(() => setWrongAnimation(false), 500);
    }
  };

  // Move to next question or finish quiz
  const nextQuestion = () => {
    setSelectedAnswerIndex(null);

    setResult((prev) =>
      selectedAnswer
        ? {
            ...prev,
            score: prev?.score + 1,
            correctAnswers: (prev?.correctAnswers ?? 0) + 1,
          }
        : {
            ...prev,
            wrongAnswers: (prev?.wrongAnswers ?? 0) + 1,
          }
    );

    if (!quizData) return;

    if (activeQuestion === quizData.questions.length - 1) {
      setActiveQuestion(0);
      setShowResult(true);
    } else {
      setActiveQuestion((prev) => prev + 1);
    }

    setChecked(false);
  };

  // Navigate to results page
  const handleAllRes = () => {
    router.push(`/quiz/shwo-res?data=${JSON.stringify(result)}`);
  };

  // Calculate progress percentage
  const progressPercentage = quizData 
    ? ((activeQuestion + 1) / quizData.totalQuestions) * 100 
    : 0;

  // If in settings mode, show category and difficulty selection
  if (showSettings) {
    return (
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative h-screen w-full flex flex-col gap-4 items-center justify-center px-4"
        >
          <div className="h-screen w-full rounded-md relative flex flex-col antialiased items-center">
            <h1 className="relative z-10 pt-12 text-lg md:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
              Quiz Settings
            </h1>

            <motion.div 
              className="mt-10 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 p-6 rounded-lg shadow-[0px_4px_15px_rgba(0,0,0,0.5)] bg-neutral-800/50 backdrop-blur-sm"
              variants={scaleUp}
              initial="hidden"
              animate="visible"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-neutral-300 mb-2">Category</label>
                  <select 
                    className="w-full p-3 rounded-lg bg-neutral-700 text-white border border-neutral-600 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(Number(e.target.value))}
                  >
                    {quizCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 mb-2">Difficulty</label>
                  <select 
                    className="w-full p-3 rounded-lg bg-neutral-700 text-white border border-neutral-600 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                  >
                    {difficultyLevels.map(level => (
                      <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 mb-2">Number of Questions</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="20" 
                    className="w-full p-3 rounded-lg bg-neutral-700 text-white border border-neutral-600 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startQuiz}
                  className="w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 ease-in bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
                >
                  Start Quiz
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AuroraBackground>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <AuroraBackground>
        <div className="h-screen w-full flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-16 h-16 border-4 border-t-indigo-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full"
          />
        </div>
      </AuroraBackground>
    );
  }

  // If quiz data is not loaded
  if (!quizData) {
    return (
      <AuroraBackground>
        <div className="h-screen w-full flex flex-col items-center justify-center">
          <h2 className="text-xl text-white mb-4">Failed to load quiz data</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(true)}
            className="px-6 py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
          >
            Try Again
          </motion.button>
        </div>
      </AuroraBackground>
    );
  }

  const { questions } = quizData;
  const { question, answers } = questions[activeQuestion];

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
        <div className="h-screen w-full rounded-md relative flex flex-col antialiased items-center">
          <h1 className="relative z-10 pt-12 text-lg md:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
            Quiz App
          </h1>

          {!showResult && (
            <>
              <div className="text-center pt-5">
                <h2 className="text-xl font-semibold text-white">
                  Question: {activeQuestion + 1}/{quizData.totalQuestions}
                </h2>
                
                {/* Progress bar */}
                <div className="w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 h-2 bg-neutral-700 rounded-full mt-3 mx-auto overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                    variants={progressBar(progressPercentage)}
                    initial="initial"
                    animate="animate"
                  />
                </div>
              </div>

              <div className="flex justify-center mt-10 w-full">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeQuestion}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="quiz-container w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 p-6 rounded-lg transition-all duration-300 ease-in shadow-[0px_4px_15px_rgba(0,0,0,0.5)] bg-neutral-800/50 backdrop-blur-sm"
                  >
                    <motion.h3 
                      className="text-xl text-white font-medium text-center mb-6"
                      dangerouslySetInnerHTML={{ __html: question }}
                    />

                    <motion.ul 
                      className="space-y-3 text-white"
                      variants={staggerContainer}
                      initial="hidden"
                        <motion.li
                          key={index}
  variants={fadeIn("up", index * 0.1)}  // First variants attribute
                          onClick={() => !checked && onAnswerSelected(ans, index)}
                          animate={wrongAnimation && selectedAnswerIndex === index ? "shake" : ""}
  variants={shake}  // Second variants attribute (duplicate)
  className={`p-4 rounded-lg border-2 text-center cursor-pointer transition-all duration-300 ease-in ${
    // ...
                          } `}
                          whileHover={!checked ? { scale: 1.02 } : {}}
                          whileTap={!checked ? { scale: 0.98 } : {}}
                        >
                          <span dangerouslySetInnerHTML={{ __html: ans }} />
                        </motion.li>
                      ))}
                    </motion.ul>

                    <div className="text-center mt-6">
                      {checked ? (
                        <motion.button
                          onClick={nextQuestion}
                          className="btn w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 ease-in bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {activeQuestion + 1 === questions.length
                            ? "Finish"
                            : "Next Question"}
                        </motion.button>
                      ) : (
                        <button
                          disabled
                          className="btn-disabled w-full py-3 rounded-lg font-semibold text-sm bg-neutral-800 text-neutral-400 cursor-not-allowed"
                        >
                          {activeQuestion + 1 === questions.length
                            ? "Finish"
                            : "Next Question"}
                        </button>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          )}

          {showResult && (
            <motion.div 
              className="text-white w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 p-6 rounded-lg shadow-lg text-center bg-neutral-800/50 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <h3 className="text-2xl text-white font-semibold mb-4">
                Results
              </h3>

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="py-3 px-4 bg-neutral-700/50 rounded-lg mb-4">
                  <h3 className="text-lg mb-2 text-white">
                    Overall Score: {Math.round((result.score / questions.length) * 100)}%
                  </h3>
                </div>

                <motion.button
                  onClick={handleAllRes}
                  className="mt-4 w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 ease-in bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Show All Results
                </motion.button>

                <motion.button
                  onClick={() => setShowSettings(true)}
                  className="mt-3 w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 ease-in bg-neutral-700 text-white hover:bg-neutral-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try Another Quiz
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AuroraBackground>
  );
};

export default QuizPage;

                  Try Another Quiz
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AuroraBackground>
  );
};

export default QuizPage;
