import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#f8fafc] border-t border-slate-200 text-slate-600 py-14 px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#059669] flex items-center justify-center text-white shadow-md shadow-emerald-600/25">
              <Sparkles className="w-4 h-4 text-white stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-slate-900 text-xl tracking-tight">Lingua<span className="text-[#059669]">Pro</span></span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Modern English learning platform engineered for active recall across CEFR levels A1 through C2.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
            <Activity className="w-3 h-3 text-emerald-600 animate-pulse" />
            <span>Platform Status · 100% Operational</span>
          </div>
        </div>

        {/* CEFR Levels Column */}
        <div>
          <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-4">CEFR Skill Scale</h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            {[
              { code: 'A1', label: 'A1 · Beginner' },
              { code: 'A2', label: 'A2 · Elementary' },
              { code: 'B1', label: 'B1 · Intermediate' },
              { code: 'B2', label: 'B2 · Upper Intermediate' },
              { code: 'C1', label: 'C1 · Advanced' },
              { code: 'C2', label: 'C2 · Mastery' },
            ].map((lvl) => (
              <li key={lvl.code}>
                <Link href={`/practice/${lvl.code}`} className="text-slate-600 hover:text-[#059669] transition-colors duration-150">
                  {lvl.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories Column */}
        <div>
          <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-4">Skill Modules</h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            <li><Link href="/practice/ALL/READING" className="text-slate-600 hover:text-[#059669] transition-colors duration-150">Reading Passages</Link></li>
            <li><Link href="/practice/ALL/LISTENING" className="text-slate-600 hover:text-[#059669] transition-colors duration-150">Audio Listening Clips</Link></li>
            <li><Link href="/practice/ALL/VOCABULARY" className="text-slate-600 hover:text-[#059669] transition-colors duration-150">Vocabulary & Context</Link></li>
            <li><Link href="/practice/ALL/SYNONYMS_ANTONYMS" className="text-slate-600 hover:text-[#059669] transition-colors duration-150">Synonyms & Antonyms</Link></li>
            <li><Link href="/practice/ALL/GRAMMAR" className="text-slate-600 hover:text-[#059669] transition-colors duration-150">Grammar Rules & Tests</Link></li>
            <li><Link href="/speaking" className="text-slate-600 hover:text-[#059669] transition-colors duration-150">Interactive Speaking Studio</Link></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-14 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div className="flex items-center gap-2 font-medium">
          <span>© {new Date().getFullYear()} LinguaPro Platform. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-bold text-[#059669]">
          <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Clean Modern Emerald Architecture</span>
        </div>
      </div>
    </footer>
  );
}




