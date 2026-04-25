import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Loader2, Github } from 'lucide-react';
import { useSound } from '../hooks/useSound';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { login, loginWithEmail, signUpWithEmail, resetPassword } = useStore();
  const navigate = useNavigate();
  const { playClick, playSuccess, playError } = useSound();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isReset) {
        await resetPassword(email);
        playSuccess();
        setMessage('Check your email for password reset instructions.');
      } else if (isLogin) {
        await loginWithEmail(email, password);
        playSuccess();
        navigate('/');
      } else {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await signUpWithEmail(email, password, name);
        playSuccess();
        navigate('/');
      }
    } catch (err: any) {
      playError();
      if (err.code === 'auth/network-request-failed' || err.message?.includes('network-request-failed')) {
        setError('Network error: Unable to reach authentication server. Please check your internet connection or disable any adblockers/firewalls blocking Google services.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      playClick();
      await login();
      playSuccess();
      navigate('/');
    } catch (err: any) {
      playError();
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[3rem] p-10 border border-white/10"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-black tracking-tighter uppercase mb-2">
            {isReset ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Join SingReality'}
          </h1>
          <p className="text-sm text-gray-400">
            {isReset 
              ? 'Enter your email to receive a reset link' 
              : isLogin 
                ? 'Enter your credentials to access your studio' 
                : 'Create an account to start your musical journey'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 text-xs text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && !isReset && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-singularity transition-colors outline-none"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-singularity transition-colors outline-none"
            />
          </div>

          {!isReset && (
            <div className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-singularity transition-colors outline-none"
                />
              </div>

              {!isLogin && (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-singularity transition-colors outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {isLogin && !isReset && (
            <div className="text-right">
              <button 
                type="button"
                onClick={() => { playClick(); setIsReset(true); }}
                className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-black rounded-2xl font-bold text-xs tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {isReset ? 'Send Reset Link' : isLogin ? 'Login' : 'Sign Up'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <span className="relative px-4 bg-transparent text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Or continue with
            </span>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 glass rounded-2xl font-bold text-xs tracking-widest uppercase hover:bg-white/5 transition-all flex items-center justify-center gap-3 border border-white/10"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
            Google
          </button>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => {
              playClick();
              if (isReset) {
                setIsReset(false);
                setIsLogin(true);
              } else {
                setIsLogin(!isLogin);
              }
              setError('');
              setMessage('');
            }}
            className="text-[10px] font-bold text-gray-400 hover:text-singularity uppercase tracking-widest transition-colors"
          >
            {isReset 
              ? 'Back to Login' 
              : isLogin 
                ? "Don't have an account? Sign Up" 
                : "Already have an account? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
