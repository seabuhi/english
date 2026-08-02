'use client';

import React, { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ExerciseRunner from '@/components/ExerciseRunner';
import { fetchPublicExercises } from '@/lib/api';
import { Exercise } from '@/types';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface LevelCategoryPageProps {
  params: Promise<{ level: string; category: string }>;
}

export default function LevelCategoryPage({ params }: LevelCategoryPageProps) {
  const resolvedParams = use(params);
  const level = resolvedParams.level.toUpperCase();
  const category = resolvedParams.category.toUpperCase();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicExercises(level, category)
      .then(setExercises)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [level, category]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        
        <div className="flex items-center justify-between">
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Practice Catalog
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-xs">
              {level} Level
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold text-xs uppercase">
              {category.replace('_', ' ')}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center text-slate-400 my-8">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium">Loading exercises...</p>
          </div>
        ) : (
          <ExerciseRunner exercises={exercises} />
        )}

      </main>

      <Footer />
    </div>
  );
}
