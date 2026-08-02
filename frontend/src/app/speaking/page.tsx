'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SpeakingCard from '@/components/SpeakingCard';
import BackgroundVideo from '@/components/BackgroundVideo';
import { fetchPublicSpeakingTopics } from '@/lib/api';
import { SpeakingTopic } from '@/types';
import { Mic, RefreshCw } from 'lucide-react';

const levels = ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function SpeakingPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [topics, setTopics] = useState<SpeakingTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPublicSpeakingTopics(selectedLevel)
      .then(setTopics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedLevel]);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans relative">
      <Navbar />

      {/* Background Video */}
      <BackgroundVideo videoSrc="/speaking-bg.mp4" opacity={0.08} overlayColor="bg-slate-50/90" />

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Page Header */}
        <div className="space-y-3 text-center sm:text-left border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Mic className="w-3.5 h-3.5 text-[#059669]" />
            <span>Speaking Studio Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Level-Based Speaking Studio
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl font-normal">
            Choose a CEFR level to practice speaking prompts, follow-up questions, and browser voice recording.
          </p>
        </div>

        {/* Level Tabs */}
        <div className="flex flex-wrap gap-2 bg-white border border-slate-200 p-3 rounded-2xl shadow-sm">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                selectedLevel === lvl
                  ? 'bg-[#059669] border border-[#059669] text-white shadow-md shadow-emerald-600/25'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {lvl === 'ALL' ? 'All Levels' : `${lvl} Level`}
            </button>
          ))}
        </div>

        {/* Topics List */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#059669]" />
            <p className="text-slate-600 text-xs">Loading speaking topics...</p>
          </div>
        ) : topics.length === 0 ? (
          <div className="py-16 text-center bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <p className="text-slate-600 text-xs font-normal">No speaking topics found for the selected level.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topics.map((topic) => (
              <SpeakingCard key={topic.id} topic={topic} />
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}



