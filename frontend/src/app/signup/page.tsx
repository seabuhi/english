'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerStudent } from '@/lib/api';
import BackgroundVideo from '@/components/BackgroundVideo';
import { User, Mail, Lock, UserCheck, ArrowRight, AlertCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await registerStudent(fullName, username, email, password);
      router.push(`/verify-otp?email=${encodeURIComponent(res.email)}`);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 font-sans py-12 relative overflow-hidden">
      
      {/* Background Video */}
      <BackgroundVideo videoSrc="/background.mp4" opacity={0.45} overlayColor="bg-black/80" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-800 flex items-center justify-center text-white shadow-xl">
              <BookOpen className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create Student Account
          </h1>
          <p className="text-slate-400 text-sm">
            Sign up to track your scores, streaks, and CEFR level progress.
          </p>
        </div>

        <div className="bg-black/90 border border-blue-950 rounded-3xl p-8 shadow-2xl space-y-6 backdrop-blur-md">
          
          {error && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-slate-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-300 tracking-wider">Full Name</label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-800"
                  placeholder="e.g. Alex Morgan"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-300 tracking-wider">Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-800"
                  placeholder="e.g. alexmorgan"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-300 tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-800"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-300 tracking-wider">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-800"
                  placeholder="Create a strong password"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800 text-white font-bold text-sm shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Sending OTP Email via Brevo...' : 'Register & Receive OTP Code'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>

          <div className="pt-4 border-t border-slate-900 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-white font-bold hover:underline">
              Sign In
            </Link>
          </div>

        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition">
            ← Return to Home
          </Link>
        </div>

      </div>

    </div>
  );
}
