import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: import('react').FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Hardcoded initial password per requirements
    // This will be replaced with Firebase Auth once provisioned
    setTimeout(() => {
      if (password === 'Oluwasambo2020@') {
        localStorage.setItem('adminAuth', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid password');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <div>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Lock className="h-8 w-8 text-blue-950" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-950">
            Administrator Portal
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Sign in to manage website content
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 focus:z-10 focus:border-blue-950 focus:outline-none focus:ring-blue-950 sm:text-sm"
                placeholder="Enter Administrator Password"
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-sm text-red-600 text-center font-medium"
            >
              {error}
            </motion.p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-xl bg-blue-950 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:ring-offset-2 disabled:opacity-70"
            >
              {isLoading ? 'Authenticating...' : (
                <>
                  <LogIn className="absolute left-4 h-5 w-5 text-blue-800 group-hover:text-blue-700" />
                  Sign in
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
