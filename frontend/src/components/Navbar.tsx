'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mic, Shield, Menu, X, Trophy, Flame, User, LogOut, UserPlus, Sparkles } from 'lucide-react';
import { CefrLevel, UserProfile } from '@/types';
import { logoutStudent, logoutAdmin } from '@/lib/api';

const levels: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const updateUserData = () => {
      const savedProfile = localStorage.getItem('user_profile');
      const adminToken = localStorage.getItem('admin_token');
      const adminUser = localStorage.getItem('admin_user');

      if (adminToken || adminUser === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }

      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setUser(parsed);
          if (parsed.username === 'admin' || parsed.role === 'ROLE_ADMIN') {
            setIsAdmin(true);
          }
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }

      const savedScore = localStorage.getItem('user_score');
      const savedStreak = localStorage.getItem('user_streak');
      if (savedScore) setScore(parseInt(savedScore, 10));
      if (savedStreak) setStreak(parseInt(savedStreak, 10));
    };

    updateUserData();
    window.addEventListener('storage', updateUserData);
    return () => window.removeEventListener('storage', updateUserData);
  }, []);

  const handleUserLogout = () => {
    logoutStudent();
    logoutAdmin();
    setUser(null);
    setIsAdmin(false);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 font-sans shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo - Emerald Jade Green */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#059669] flex items-center justify-center text-white shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Lingua<span className="text-[#059669]">Pro</span>
              </span>
              <span className="hidden sm:inline-flex items-center text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                CEFR Studio
              </span>
            </div>
          </Link>

          {/* CEFR Level Quick Selector Bar */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            {levels.map((lvl) => (
              <Link
                key={lvl}
                href={`/practice/${lvl}`}
                className="px-3.5 py-1 text-xs font-bold rounded-lg transition-all duration-200 text-slate-600 hover:text-white hover:bg-[#059669] active:scale-95"
              >
                {lvl}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            
            {/* Score & Streak Counters */}
            <div className="hidden sm:flex items-center gap-2.5 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-1.5 text-amber-600" title="Score Points">
                <Trophy className="w-3.5 h-3.5" />
                <span className="text-slate-900">{score} <span className="text-slate-500 font-normal text-[11px]">pts</span></span>
              </div>
              <div className="w-px h-3.5 bg-slate-300" />
              <div className="flex items-center gap-1.5 text-orange-600" title="Streak Days">
                <Flame className="w-3.5 h-3.5" />
                <span className="text-slate-900">{streak} <span className="text-slate-500 font-normal text-[11px]">d</span></span>
              </div>
            </div>

            <Link
              href="/speaking"
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition-all duration-200"
            >
              <Mic className="w-3.5 h-3.5 text-[#059669]" />
              <span>Speaking</span>
            </Link>

            {/* Admin Button */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border border-amber-500/30 text-xs font-bold transition-all"
                title="Admin Portal"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}

            {/* User Auth Section */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-900 leading-tight">{user.fullName || user.username}</span>
                  <span className="text-[10px] text-slate-500 font-mono">@{user.username}</span>
                </div>
                <button
                  onClick={handleUserLogout}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition-all"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/signup"
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-4 pb-6 space-y-4">
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">Select CEFR Level</p>
            <div className="grid grid-cols-6 gap-1.5">
              {levels.map((lvl) => (
                <Link
                  key={lvl}
                  href={`/practice/${lvl}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-bold rounded-lg bg-slate-100 border border-slate-200 text-slate-800 hover:bg-[#059669] hover:text-white transition"
                >
                  {lvl}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 px-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 font-bold text-sm text-center"
              >
                Admin Portal
              </Link>
            )}

            {!user ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-bold text-sm text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-xl bg-[#059669] text-white font-bold text-sm text-center shadow-md shadow-emerald-600/25"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  handleUserLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-bold text-sm text-center"
              >
                Sign Out ({user.username})
              </button>
            )}

            <Link
              href="/practice"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 px-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm text-center shadow-md shadow-emerald-600/25"
            >
              Start Exercises
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}




