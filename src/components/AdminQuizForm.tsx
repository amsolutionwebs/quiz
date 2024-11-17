import { useState } from 'react';
import { Button } from './Button';
import { useQuizStore, type Question } from '../store/quiz';
import { PlusCircle, MinusCircle } from 'lucide-react';

export function AdminQuizForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(300); // 5 minutes default
  const [questions, setQuestions] = useState<Omit<Question, 'id'>[]>([
    { question: '', options: ['', '', '', ''], correctAnswer: 0 },
  ]);

  const addQuiz = useQuizStore((state) => state.addQuiz);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addQuiz({
      id: crypto.randomUUID(),
      title,
      description,
      timeLimit,
      questions: questions.map((q) => ({ ...q, id: crypto.randomUUID() })),
    });
    setTitle('');
    setDescription('');
    setTimeLimit(300);
    setQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Quiz Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Time Limit (seconds)</label>
        <input
          type="number"
          value={timeLimit}
          onChange={(e) => setTimeLimit(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          min={60}
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Questions</h3>
          <Button
            type="button"
            onClick={() =>
              setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }])
            }
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <h4 className="text-md font-medium">Question {qIndex + 1}</h4>
              {questions.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setQuestions(questions.filter((_, i) => i !== qIndex))}
                >
                  <MinusCircle className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>

            <input
              type="text"
              value={q.question}
              onChange={(e) => {
                const newQuestions = [...questions];
                newQuestions[qIndex].question = e.target.value;
                setQuestions(newQuestions);
              }}
              className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Enter question"
              required
            />

            <div className="mt-4 space-y-2">
              {q.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correctAnswer === oIndex}
                    onChange={() => {
                      const newQuestions = [...questions];
                      newQuestions[qIndex].correctAnswer = oIndex;
                      setQuestions(newQuestions);
                    }}
                    required
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[qIndex].options[oIndex] = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder={`Option ${oIndex + 1}`}
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button type="submit" size="lg" className="w-full">
        Create Quiz
      </Button>
    </form>
  );
}