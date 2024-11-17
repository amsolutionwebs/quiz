import { useQuizStore } from '../store/quiz';
import { Button } from './Button';
import { Clock } from 'lucide-react';
import { formatTime } from '../lib/utils';
import { Link } from 'react-router-dom';

export function QuizList() {
  const quizzes = useQuizStore((state) => state.quizzes);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <div
          key={quiz.id}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h3 className="text-xl font-semibold text-gray-900">{quiz.title}</h3>
          <p className="mt-2 text-sm text-gray-600">{quiz.description}</p>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <Clock className="mr-2 h-4 w-4" />
            {formatTime(quiz.timeLimit)}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">{quiz.questions.length} questions</span>
            <Link to={`/quiz/${quiz.id}`}>
              <Button>Start Quiz</Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}