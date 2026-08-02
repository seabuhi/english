'use client';

import React, { useState } from 'react';
import { Exercise, AnswerResult } from '@/types';
import { submitExerciseAnswer } from '@/lib/api';
import AudioPlayer from './AudioPlayer';
import { CheckCircle2, XCircle, ArrowRight, HelpCircle, BookOpen, Sparkles } from 'lucide-react';

interface ExerciseRunnerProps {
  exercises: Exercise[];
  onCompleteAll?: () => void;
}

export default function ExerciseRunner({ exercises, onCompleteAll }: ExerciseRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AnswerResult | null>(null);

  if (!exercises || exercises.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 my-8 space-y-3 font-sans shadow-sm">
        <HelpCircle className="w-10 h-10 text-[#059669] mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">No Exercises Found</h3>
        <p className="text-xs text-slate-500 font-normal">Try selecting a different level or category filter.</p>
      </div>
    );
  }

  const currentEx = exercises[currentIndex];
  let optionsList: string[] = [];

  if (currentEx.optionsJson) {
    try {
      optionsList = JSON.parse(currentEx.optionsJson);
    } catch {
      optionsList = [];
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const answerToSubmit = currentEx.exerciseType === 'FILL_IN_BLANK' ? textAnswer : selectedOption;

    if (!answerToSubmit || answerToSubmit.trim() === '') {
      alert('Please select or type your answer before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitExerciseAnswer(currentEx.id, answerToSubmit);
      setResult(res);

      if (res.correct) {
        const currentScore = parseInt(localStorage.getItem('user_score') || '0', 10);
        const currentStreak = parseInt(localStorage.getItem('user_streak') || '1', 10);
        localStorage.setItem('user_score', (currentScore + 10).toString());
        localStorage.setItem('user_streak', currentStreak.toString());
        window.dispatchEvent(new Event('storage'));
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    setResult(null);
    setSelectedOption('');
    setTextAnswer('');

    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (onCompleteAll) {
      onCompleteAll();
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 font-sans">
      
      {/* Progress Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#059669] font-bold text-xs">
            {currentEx.level} Level
          </span>
          <span className="px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider">
            {currentEx.category.replace('_', ' ')}
          </span>
        </div>
        <div className="text-xs font-mono text-slate-500">
          Exercise <span className="text-slate-900 font-bold">{currentIndex + 1}</span> of {exercises.length}
        </div>
      </div>

      {/* Exercise Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
          {currentEx.title}
        </h2>
      </div>

      {/* Reading Text Content */}
      {currentEx.textContent && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-slate-700 text-sm leading-relaxed max-h-64 overflow-y-auto font-sans space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#059669] uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-[#059669]" /> Reading Context
          </div>
          <p className="whitespace-pre-line font-normal text-slate-700">{currentEx.textContent}</p>
        </div>
      )}

      {/* Audio Player for Listening */}
      {currentEx.audioUrl && (
        <AudioPlayer src={currentEx.audioUrl} transcript={currentEx.transcript} />
      )}

      {/* Image */}
      {currentEx.imageUrl && (
        <div className="rounded-xl overflow-hidden border border-slate-200 max-h-72">
          <img src={currentEx.imageUrl} alt={currentEx.title} className="w-full object-cover" />
        </div>
      )}

      {/* Question Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <p className="text-slate-900 font-semibold text-base sm:text-lg leading-snug">
          {currentEx.questionText}
        </p>
      </div>

      {/* Form / Options */}
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {optionsList.length > 0 ? (
            <div className="grid grid-cols-1 gap-2.5">
              {optionsList.map((opt, i) => (
                <label
                  key={i}
                  className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedOption === opt
                      ? 'bg-emerald-50 border-2 border-[#059669] text-[#059669] shadow-md shadow-emerald-500/10 ring-1 ring-[#059669]'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-[#059669] hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="exerciseOption"
                    value={opt}
                    checked={selectedOption === opt}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="w-4 h-4 text-[#059669] bg-white border-slate-300 focus:ring-[#059669]"
                  />
                  <span className="ml-3 font-semibold text-sm sm:text-base">{opt}</span>
                </label>
              ))}
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base focus:ring-2 focus:ring-[#059669] focus:outline-none placeholder:text-slate-400 font-medium"
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-base shadow-lg shadow-emerald-600/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Checking Answer...' : 'Submit Answer'}
            </button>
          </div>
        </form>
      ) : (
        /* Result View */
        <div className="space-y-6">
          
          <div
            className={`p-6 rounded-xl border flex items-start gap-4 ${
              result.correct
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            {result.correct ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-7 h-7 text-rose-600 shrink-0 mt-0.5" />
            )}

            <div className="space-y-1">
              <h4 className="font-bold text-base sm:text-lg">
                {result.correct ? 'Correct Answer! (+10 pts)' : 'Incorrect Answer'}
              </h4>
              <p className="text-xs sm:text-sm font-normal text-slate-700">
                {result.correct
                  ? 'Great job! Your answer matches the benchmark specification.'
                  : 'Your submitted answer was not correct for this question.'}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Target Benchmark Answer:</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">{result.correctAnswer}</p>
            </div>

            {result.explanation && (
              <div className="pt-3 border-t border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#059669] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#059669]" /> Explanation:
                </span>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mt-1 font-normal">{result.explanation}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleNext}
            className="w-full py-4 px-6 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-base shadow-lg shadow-emerald-600/25 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>{currentIndex < exercises.length - 1 ? 'Next Exercise' : 'Finish Session'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

    </div>
  );
}



