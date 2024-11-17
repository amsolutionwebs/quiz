import { useQuizStore } from '../store/quiz';
import { formatTime } from '../lib/utils';

export function QuizResults() {
  const results = useQuizStore((state) => state.results);
  const quizzes = useQuizStore((state) => state.quizzes);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg bg-blue-50 p-6">
          <div className="text-2xl font-bold text-blue-600">
            {results.length}
          </div>
          <p className="text-sm text-blue-600">Total Attempts</p>
        </div>
        <div className="rounded-lg bg-green-50 p-6">
          <div className="text-2xl font-bold text-green-600">
            {Math.round(
              (results.reduce((acc, r) => acc + r.score, 0) /
                results.reduce((acc, r) => acc + r.totalQuestions, 0)) *
                100
            )}%
          </div>
          <p className="text-sm text-green-600">Average Score</p>
        </div>
        <div className="rounded-lg bg-purple-50 p-6">
          <div className="text-2xl font-bold text-purple-600">
            {formatTime(
              Math.round(
                results.reduce((acc, r) => acc + r.timeTaken, 0) / results.length
              )
            )}
          </div>
          <p className="text-sm text-purple-600">Average Time</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Quiz
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Percentage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Time Taken
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Completed
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {results.map((result) => {
              const quiz = quizzes.find((q) => q.id === result.quizId);
              const percentage = Math.round((result.score / result.totalQuestions) * 100);
              return (
                <tr key={result.id}>
                  <td className="whitespace-nowrap px-6 py-4">{result.userName}</td>
                  <td className="whitespace-nowrap px-6 py-4">{quiz?.title}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {result.score}/{result.totalQuestions}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                        percentage >= 70
                          ? 'bg-green-100 text-green-800'
                          : percentage >= 40
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {percentage}%
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{formatTime(result.timeTaken)}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {new Date(result.completedAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}