'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyStudentOtp, resendStudentOtp } from '@/lib/api';
import { KeyRound, Mail, CheckCircle2, AlertCircle, RefreshCw, BookOpen } from 'lucide-react';
import Link from 'next/link';

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const qEmail = searchParams.get('email');
    if (qEmail) {
      setEmail(qEmail);
    }
  }, [searchParams]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await verifyStudentOtp(email, otpCode);
      setSuccessMsg(res.message);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'OTP verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Please provide an email address first.');
      return;
    }
    setError('');
    setSuccessMsg('');
    setResending(true);

    try {
      const res = await resendStudentOtp(email);
      setSuccessMsg(res.message);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to resend OTP code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      
      <div className="text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-800 flex items-center justify-center text-white shadow-xl">
            <BookOpen className="w-6 h-6" />
          </div>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Verify Email Address
        </h1>
        <p className="text-slate-400 text-sm">
          Enter the 6-digit OTP code sent to your email.
        </p>
      </div>

      <div className="bg-black border border-blue-950 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {error && (
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-slate-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-blue-950 border border-blue-800 text-white text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          
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
            <label className="text-xs font-bold uppercase text-slate-300 tracking-wider">6-Digit OTP Code</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-base tracking-widest font-mono text-center font-bold focus:outline-none focus:border-blue-800"
                placeholder="123456"
              />
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800 text-white font-bold text-sm shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Verifying OTP...' : 'Verify Email & Complete Registration'}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>{resending ? 'Resending Code...' : 'Resend OTP Code via Email'}</span>
            </button>
          </div>

        </form>

        <div className="pt-4 border-t border-slate-900 text-center text-xs text-slate-400">
          Ready to log in?{' '}
          <Link href="/login" className="text-white font-bold hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>

    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 font-sans py-12">
      <Suspense fallback={<div className="text-slate-400 text-sm">Loading verification...</div>}>
        <VerifyOtpForm />
      </Suspense>
    </div>
  );
}
