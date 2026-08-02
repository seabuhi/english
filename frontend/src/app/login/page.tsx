'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginStudent } from '@/lib/api';
import BackgroundVideo from '@/components/BackgroundVideo';
import { User, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function StudentLoginPage() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await loginStudent(usernameOrEmail, password);
      window.dispatchEvent(new Event('storage'));

      if (user.username === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/practice');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center px-4 font-sans py-12 relative overflow-hidden">
      
      {/* Background Video */}
      <BackgroundVideo videoSrc="/background.mp4" opacity={0.08} overlayColor="bg-slate-50/90" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-[#059669] flex items-center justify-center text-white shadow-lg shadow-emerald-600/25">
              <Sparkles className="w-6 h-6 stroke-[2.5]" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In to LinguaPro
          </h1>
          <p className="text-slate-600 text-xs font-normal">
            Enter your credentials to access your account or studio dashboard.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl space-y-6">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-700 tracking-wider">Username or Email</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#059669] placeholder:text-slate-400 transition-colors font-medium"
                  placeholder="Enter username or email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-700 tracking-wider">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#059669] placeholder:text-slate-400 transition-colors font-medium"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>

          <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-600 font-normal">
            Don&apos;t have an account yet?{' '}
            <Link href="/signup" className="text-[#059669] font-bold hover:underline">
              Create Student Account
            </Link>
          </div>

        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-900 transition-colors">
            ← Return to Home
          </Link>
        </div>

      </div>

    </div>
  );
}



