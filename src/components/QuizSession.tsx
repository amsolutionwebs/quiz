import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quiz';
import { useAuthStore } from '../store/auth';
import { Button } from './Button';
import { Clock } from 'lucide-react';
import { formatTime } from '../lib/utils';

export function QuizSession() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const quiz = useQuizStore((state) => state.quizzes.find((q) => q.id === id));
  const addResult = useQuizStore((state) => state.addResult);
  const user = useAuthStore((state) => state.user);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(quiz?.timeLimit || 0);
  const [isFinished, setIsFinished] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!quiz || !user) {
      navigate('/');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, user]);

  if (!quiz || !user) return null;

  const calculateResults = () => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    answers.forEach((answer, index) => {
      if (answer === undefined) {
        unanswered++;
      } else if (answer === quiz.questions[index].correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    return { correct, incorrect, unanswered };
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinish = () => {
    if (isFinished) return;
    
    setIsFinished(true);
    const { correct } = calculateResults();

    addResult({
      id: crypto.randomUUID(),
      userId: user.id,
      userName: user.name,
      quizId: quiz.id,
      score: correct,
      totalQuestions: quiz.questions.length,
      timeTaken: quiz.timeLimit - timeLeft,
      completedAt: new Date(),
      answers,
    });

    setShowResults(true);
  };

  if (showResults) {
    const { correct, incorrect, unanswered } = calculateResults();
    const percentage = Math.round((correct / quiz.questions.length) * 100);

    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-2xl font-bold">Quiz Results</h2>
          
          <div className="mb-6">
            <div className="mb-2 text-4xl font-bold text-blue-600">{percentage}%</div>
            <p className="text-gray-600">Final Score</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-green-50 p-4">
              <div className="text-2xl font-bold text-green-600">{correct}</div>
              <p className="text-sm text-green-600">Correct Answers</p>
            </div>
            <div className="rounded-lg bg-red-50 p-4">
              <div className="text-2xl font-bold text-red-600">{incorrect}</div>
              <p className="text-sm text-red-600">Incorrect Answers</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="text-2xl font-bold text-gray-600">{unanswered}</div>
              <p className="text-sm text-gray-600">Unanswered</p>
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Quiz List
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{quiz.title}</h1>
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="h-5 w-5" />
          <span className="font-medium">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex justify-between text-sm text-gray-500">
          <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
          <span>{answers[currentQuestion] !== undefined ? 'Answered' : 'Not answered'}</span>
        </div>

        <h2 className="mb-6 text-xl font-medium">{question.question}</h2>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`w-full rounded-lg border p-4 text-left transition-colors ${
                answers[currentQuestion] === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          variant="outline"
        >
          Previous
        </Button>
        {currentQuestion === quiz.questions.length - 1 ? (
          <Button onClick={handleFinish}>Finish Quiz</Button>
        ) : (
          <Button onClick={handleNext}>Next Question</Button>
        )}
      </div>
    </div>
  );
}