import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-800 to-black text-white">
      <div className="container text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to the Quiz App</h1>
        <p className="mb-10 text-lg text-gray-300">
          Test your knowledge with our exciting quiz!
        </p>

        <Link href="/quiz">
          <button className="w-full md:w-1/3 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ease-in bg-gradient-to-b from-neutral-300 to-neutral-700 text-neutral-900 hover:from-neutral-400 hover:to-neutral-800">
            Start Quiz
          </button>
        </Link>
      </div>
    </main>
  );
};

export default Home;
