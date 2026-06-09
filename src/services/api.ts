import axios from 'axios';

export interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: string;
}

export interface QuizData {
  totalQuestions: number;
  questions: Question[];
}

// Function to fetch quiz questions from Open Trivia DB
export const fetchQuizQuestions = async (amount: number = 5, category?: number, difficulty?: string): Promise<QuizData> => {
  try {
    const response = await axios.get('https://opentdb.com/api.php', {
      params: {
        amount,
        category,
        difficulty,
        type: 'multiple',
      },
    });

    if (response.data.response_code === 0) {
      // Transform the data to match our app's format
      const transformedQuestions = response.data.results.map((item: {
        incorrect_answers: string[];
        correct_answer: string;
        question: string;
      }, index: number) => {
        // Combine correct and incorrect answers and shuffle them
        const answers = [
          ...item.incorrect_answers,
          item.correct_answer,
        ].sort(() => Math.random() - 0.5);

        return {
          id: index + 1,
          question: item.question,
          answers,
          correctAnswer: item.correct_answer,
        };
      });

      return {
        totalQuestions: transformedQuestions.length,
        questions: transformedQuestions,
      };
    } else {
      // Fallback to local data if API fails
      throw new Error('Failed to fetch questions from API');
    }
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    // Return local data as fallback
    return import('../app/data').then(module => module.quiz);
  }
};

// Categories from Open Trivia DB
export const quizCategories = [
  { id: 9, name: 'General Knowledge' },
  { id: 10, name: 'Entertainment: Books' },
  { id: 11, name: 'Entertainment: Film' },
  { id: 12, name: 'Entertainment: Music' },
  { id: 14, name: 'Entertainment: Television' },
  { id: 15, name: 'Entertainment: Video Games' },
  { id: 17, name: 'Science & Nature' },
  { id: 18, name: 'Science: Computers' },
  { id: 19, name: 'Science: Mathematics' },
  { id: 21, name: 'Sports' },
  { id: 22, name: 'Geography' },
  { id: 23, name: 'History' },
  { id: 24, name: 'Politics' },
  { id: 27, name: 'Animals' },
];

export const difficultyLevels = ['easy', 'medium', 'hard'];
