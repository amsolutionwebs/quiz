import { useState } from 'react';
import { useAuthStore } from '../store/auth';
import { Button } from './Button';
import { LogIn } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(email, password);
    if (!user) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="mx-auto max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Welcome to QuizMaster</h1>
        <p className="mt-2 text-sm text-gray-600">
          Please sign in to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="admin@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <Button type="submit" className="w-full">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Default Admin Credentials:</p>
          <p>Email: admin@example.com</p>
          <p>Password: admin123</p>
        </div>
      </form>
    </div>
  );
}