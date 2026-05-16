import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isRegister) {
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    try {
      if (isRegister) {
        await register(username, password);
      } else {
        await login(username, password);
      }
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.response?.data || (isRegister ? 'Registration failed' : 'Invalid credentials');
      setError(typeof msg === 'string' ? msg : 'An error occurred');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100]"
        >
          <motion.div
            initial={{ scale: 0.9, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: -20 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-fresh-mint/10 rounded-full blur-2xl" />

            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-3xl font-black text-slate-900 mb-2">
              {isRegister ? 'Join Freshopia' : 'Welcome Back'}
            </h2>
            <p className="text-slate-500 text-sm font-medium mb-8">
              {isRegister ? 'Start your fresh journey today.' : 'Login to continue shopping.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="FreshUser123"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-fresh-mint/20 focus:bg-white rounded-2xl px-5 py-4 transition-all outline-none text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-fresh-mint/20 focus:bg-white rounded-2xl px-5 py-4 transition-all outline-none text-sm font-bold"
                />
              </div>

              {isRegister && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-fresh-mint/20 focus:bg-white rounded-2xl px-5 py-4 transition-all outline-none text-sm font-bold"
                  />
                </motion.div>
              )}
              
              {error && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs text-red-500 font-bold flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> {error}
                </motion.p>
              )}

              <button
                type="submit"
                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-fresh-mint hover:shadow-xl hover:shadow-fresh-mint/20 transition-all duration-300"
              >
                {isRegister ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm font-bold text-slate-400">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button 
                  onClick={() => { setIsRegister(!isRegister); setError(null); }}
                  className="text-fresh-mint hover:underline underline-offset-4"
                >
                  {isRegister ? 'Sign In' : 'Register Now'}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
