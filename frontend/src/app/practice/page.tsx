'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ExerciseRunner from '@/components/ExerciseRunner';
import BackgroundVideo from '@/components/BackgroundVideo';
import { fetchPublicExercises } from '@/lib/api';
import { Exercise } from '@/types';
import { Filter, Sparkles, RefreshCw } from 'lucide-react';

const levels = ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const categories: { id: string; label: string }[] = [
  { id: 'ALL', label: 'All Categories' },
  { id: 'READING', label: 'Reading' },
  { id: 'LISTENING', label: 'Listening' },
  { id: 'VOCABULARY', label: 'Vocabulary' },
  { id: 'SYNONYMS_ANTONYMS', label: 'Synonyms & Antonyms' },
  { id: 'GRAMMAR', label: 'Grammar' },
];

export default function PracticePage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadExercises = async () => {
    setLoading(true);
    try {
      const data = await fetchPublicExercises(selectedLevel, selectedCategory);
      setExercises(data);
    } catch (err) {
      console.error('Failed to load exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExercises();
  }, [selectedLevel, selectedCategory]);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans relative">
      <Navbar />

      {/* Background Video */}
      <BackgroundVideo videoSrc="/practice-bg.mp4" opacity={0.08} overlayColor="bg-slate-50/90" />

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Page Header */}
        <div className="space-y-3 text-center sm:text-left border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
            <span>Practical Exercise Studio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            English Practice Studio
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl font-normal">
            Select your target CEFR level and category below. Answers remain hidden until submitted.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#059669]">
            <Filter className="w-3.5 h-3.5 text-[#059669]" />
            <span>Filter Studio Exercises</span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-600 mb-2 font-semibold">CEFR Level:</p>
              <div className="flex flex-wrap gap-2">
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
                    {lvl === 'ALL' ? 'All Levels' : lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-600 mb-2 font-semibold">Category:</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                      selectedCategory === cat.id
                        ? 'bg-[#059669] border border-[#059669] text-white shadow-md shadow-emerald-600/25'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Exercise Runner */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#059669]" />
            <p className="text-slate-600 text-xs">Loading practical exercises...</p>
          </div>
        ) : (
          <ExerciseRunner exercises={exercises} />
        )}

      </main>

      <Footer />
    </div>
  );
}



