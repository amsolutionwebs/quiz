import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Brain, ClipboardList, LayoutDashboard, Users } from 'lucide-react';
import { AdminQuizForm } from './components/AdminQuizForm';
import { QuizList } from './components/QuizList';
import { QuizResults } from './components/QuizResults';
import { QuizSession } from './components/QuizSession';
import { UserManagement } from './components/UserManagement';
import { LoginForm } from './components/LoginForm';
import { useAuthStore } from './store/auth';
import { Button } from './components/Button';

function App() {
  const { user, logout } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="border-b bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <Link to="/" className="flex items-center px-2 text-xl font-bold text-blue-600">
                  <Brain className="mr-2 h-6 w-6" />
                  QuizMaster
                </Link>
                {user && (
                  <div className="ml-6 flex items-center space-x-4">
                    <Link
                      to="/"
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-blue-600"
                    >
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Quizzes
                    </Link>
                    {user.role === 'admin' && (
                      <>
                        <Link
                          to="/admin"
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-blue-600"
                        >
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Admin
                        </Link>
                        <Link
                          to="/users"
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-blue-600"
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Users
                        </Link>
                        <Link
                          to="/results"
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-blue-600"
                        >
                          Results
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                    <Button onClick={() => logout()} variant="outline">
                      Logout
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {!user ? (
            <LoginForm />
          ) : (
            <Routes>
              <Route path="/" element={<QuizList />} />
              <Route path="/quiz/:id" element={<QuizSession />} />
              <Route
                path="/admin"
                element={
                  user.role === 'admin' ? (
                    <div className="max-w-3xl">
                      <h1 className="mb-8 text-3xl font-bold">Create New Quiz</h1>
                      <AdminQuizForm />
                    </div>
                  ) : (
                    <div>Access denied</div>
                  )
                }
              />
              <Route
                path="/users"
                element={
                  user.role === 'admin' ? (
                    <div>
                      <h1 className="mb-8 text-3xl font-bold">User Management</h1>
                      <UserManagement />
                    </div>
                  ) : (
                    <div>Access denied</div>
                  )
                }
              />
              <Route
                path="/results"
                element={
                  user.role === 'admin' ? (
                    <div>
                      <h1 className="mb-8 text-3xl font-bold">Quiz Results</h1>
                      <QuizResults />
                    </div>
                  ) : (
                    <div>Access denied</div>
                  )
                }
              />
            </Routes>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;