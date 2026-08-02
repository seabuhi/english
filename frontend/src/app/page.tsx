'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundVideo from '@/components/BackgroundVideo';
import {
  BookOpen,
  Headphones,
  CheckCircle2,
  Mic,
  ArrowRight,
  Target,
  Layers,
  FileCheck,
  Zap,
  Check,
  ChevronRight,
  ShieldCheck,
  BarChart3,
  Volume2,
  Sparkles
} from 'lucide-react';
import { CefrLevel } from '@/types';

interface LevelDetail {
  level: CefrLevel;
  title: string;
  badge: string;
  desc: string;
  vocabCount: string;
  grammarFocus: string;
  typicalOutcome: string;
}

const levelDetails: LevelDetail[] = [
  {
    level: 'A1',
    title: 'Beginner Level',
    badge: 'Basic Foundations',
    desc: 'Master fundamental greetings, daily routine expressions, simple present verbs, and essential noun phrases.',
    vocabCount: '500 – 1,000 words',
    grammarFocus: 'Present Simple, Personal Pronouns, Basic Articles',
    typicalOutcome: 'Can understand basic phrases and introduce themselves in clear contexts.'
  },
  {
    level: 'A2',
    title: 'Elementary Level',
    badge: 'Practical Daily',
    desc: 'Navigate travel situations, describe past events with Past Simple, read short narrative texts, and listen to familiar prompts.',
    vocabCount: '1,000 – 2,000 words',
    grammarFocus: 'Past Simple, Comparative Adjectives, Modal Verbs',
    typicalOutcome: 'Can handle routine tasks and communicate in simple, everyday exchanges.'
  },
  {
    level: 'B1',
    title: 'Intermediate Level',
    badge: 'Independent Learner',
    desc: 'Engage with opinion pieces, express future plans, master Present Perfect verb tenses, and practice structured speaking prompts.',
    vocabCount: '2,000 – 3,500 words',
    grammarFocus: 'Present Perfect, First & Second Conditionals, Relative Clauses',
    typicalOutcome: 'Can understand main points on familiar topics and produce connected text.'
  },
  {
    level: 'B2',
    title: 'Upper Intermediate',
    badge: 'Vibrant Fluency',
    desc: 'Analyze complex articles, understand native fast speech, tackle third conditionals, active passive structures, and express nuanced debates.',
    vocabCount: '3,500 – 6,000 words',
    grammarFocus: 'Third Conditionals, Passive Voice, Advanced Phrasal Verbs',
    typicalOutcome: 'Can interact with native speakers with a high degree of fluency and spontaneity.'
  },
  {
    level: 'C1',
    title: 'Advanced Level',
    badge: 'Professional Proficiency',
    desc: 'Dissect academic essays, comprehend implicit nuances, master inverted grammar, subclause subtilties, and professional vocabulary.',
    vocabCount: '6,000 – 10,000 words',
    grammarFocus: 'Inversion, Subjunctive Mood, Complex Prepositional Phrases',
    typicalOutcome: 'Can express ideas fluently and spontaneously for professional and academic purposes.'
  },
  {
    level: 'C2',
    title: 'Mastery Level',
    badge: 'Near-Native Expertise',
    desc: 'Understand philosophical texts, idiomatic expressions, rapid native dialects, and craft precise analytical compositions.',
    vocabCount: '10,000+ words',
    grammarFocus: 'Idiomatic Nuances, Ellipsis, Advanced Rhetoric',
    typicalOutcome: 'Can effortlessly understand virtually everything heard or read.'
  }
];

interface DemoQuestion {
  level: string;
  category: string;
  question: string;
  options: { id: number; text: string; correct: boolean }[];
  explanation: string;
}

const DEMO_QUESTIONS: DemoQuestion[] = [
  {
    level: 'A2',
    category: 'Grammar',
    question: 'She ______ to London twice last year for business conferences.',
    options: [
      { id: 0, text: 'traveled', correct: true },
      { id: 1, text: 'travels', correct: false },
      { id: 2, text: 'has traveled', correct: false },
      { id: 3, text: 'is traveling', correct: false }
    ],
    explanation: '"Traveled" is the correct Past Simple verb form used for completed past actions.'
  },
  {
    level: 'B1',
    category: 'Vocabulary',
    question: 'If you work hard, you will definitely ______ your long-term goals.',
    options: [
      { id: 0, text: 'achieve', correct: true },
      { id: 1, text: 'abandon', correct: false },
      { id: 2, text: 'postpone', correct: false },
      { id: 3, text: 'ignore', correct: false }
    ],
    explanation: '"Achieve" means to successfully bring about a desired result through effort.'
  },
  {
    level: 'B2',
    category: 'Vocabulary',
    question: 'The CEO delivered an ______ presentation that persuaded all key investors.',
    options: [
      { id: 0, text: 'articulate', correct: true },
      { id: 1, text: 'hesitant', correct: false },
      { id: 2, text: 'ambiguous', correct: false },
      { id: 3, text: 'superficial', correct: false }
    ],
    explanation: '"Articulate" means expressing ideas fluently and coherently in speech.'
  },
  {
    level: 'B2',
    category: 'Grammar',
    question: 'Had I known about the flight delay, I ______ at the hotel longer.',
    options: [
      { id: 0, text: 'would have stayed', correct: true },
      { id: 1, text: 'will stay', correct: false },
      { id: 2, text: 'stayed', correct: false },
      { id: 3, text: 'have stayed', correct: false }
    ],
    explanation: '"Would have stayed" forms the inverted third conditional for hypothetical past actions.'
  },
  {
    level: 'C1',
    category: 'Synonyms',
    question: 'Choose the closest synonym for the word "meticulous":',
    options: [
      { id: 0, text: 'painstaking', correct: true },
      { id: 1, text: 'careless', correct: false },
      { id: 2, text: 'hasty', correct: false },
      { id: 3, text: 'vague', correct: false }
    ],
    explanation: '"Painstaking" and "meticulous" both describe showing great care and thorough attention to detail.'
  },
  {
    level: 'C2',
    category: 'Mastery',
    question: 'Not until the audit concluded ______ the discrepancies in the financial report.',
    options: [
      { id: 0, text: 'did they discover', correct: true },
      { id: 1, text: 'they discovered', correct: false },
      { id: 2, text: 'they have discovered', correct: false },
      { id: 3, text: 'were discovered', correct: false }
    ],
    explanation: 'Negative adverbials like "Not until" require subject-auxiliary inversion ("did they discover").'
  }
];

export default function HomePage() {
  const [activeLevel, setActiveLevel] = useState<CefrLevel>('B2');
  const [demoIndex, setDemoIndex] = useState<number>(0);
  const [heroOptionSelected, setHeroOptionSelected] = useState<number | null>(null);
  const [heroSubmitted, setHeroSubmitted] = useState(false);

  React.useEffect(() => {
    const randomIndex = Math.floor(Math.random() * DEMO_QUESTIONS.length);
    setDemoIndex(randomIndex);
  }, []);

  const currentDemo = DEMO_QUESTIONS[demoIndex] || DEMO_QUESTIONS[2];
  const activeDetail = levelDetails.find((l) => l.level === activeLevel) || levelDetails[3];

  const handleNextDemo = () => {
    setHeroOptionSelected(null);
    setHeroSubmitted(false);
    setDemoIndex((prev) => (prev + 1) % DEMO_QUESTIONS.length);
  };

  const handleHeroSubmit = () => {
    if (heroOptionSelected === null) return;
    setHeroSubmitted(true);

    const chosenOption = currentDemo.options.find((o) => o.id === heroOptionSelected);
    if (chosenOption && chosenOption.correct) {
      const currentScore = parseInt(localStorage.getItem('user_score') || '0', 10);
      const currentStreak = parseInt(localStorage.getItem('user_streak') || '1', 10);
      localStorage.setItem('user_score', (currentScore + 10).toString());
      localStorage.setItem('user_streak', currentStreak.toString());
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans relative selection:bg-emerald-500/20 selection:text-emerald-700">
      <Navbar />

      {/* Hero Section - Clean Light Emerald Theme */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 border-b border-slate-200 bg-emerald-hero-light bg-emerald-dots-light">
        <BackgroundVideo opacity={0.10} overlayColor="bg-emerald-50/80" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline & Action */}
            <div className="lg:col-span-7 space-y-7 text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
                <span>CEFR A1–C2 Practical Platform</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Master Practical English <br className="hidden sm:inline" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#059669] via-emerald-600 to-teal-700">
                  With Precision Exercises
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
                Build real English fluency across Reading, Listening, Vocabulary, Synonyms, Grammar, and Speaking with immediate feedback and instant explanations.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  href="/practice"
                  className="px-8 py-4 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <span>Start Free Exercises</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/speaking"
                  className="px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-bold text-sm shadow-xs transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Mic className="w-4 h-4 text-[#059669]" />
                  <span>Explore Speaking Studio</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { title: 'A1 to C2 Scale', desc: 'All 6 official levels' },
                  { title: 'Instant Feedback', desc: 'No answer spoilers' },
                  { title: 'Native Audio', desc: 'Real listening clips' },
                  { title: 'Voice Studio', desc: 'Browser speech audio' },
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{f.title}</p>
                      <p className="text-[11px] text-slate-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Column: Dynamic Interactive Demo Card */}
            <div className="lg:col-span-5">
              <div className="relative bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xl shadow-slate-900/5 space-y-5">
                
                {/* Micro Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">Live Interactive Demo</span>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {currentDemo.level} {currentDemo.category}
                  </span>
                </div>

                {/* Question */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500">Choose the best answer:</p>
                  <p className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                    {currentDemo.question}
                  </p>
                </div>

                {/* Radio Options */}
                <div className="space-y-2 pt-1">
                  {currentDemo.options.map((opt) => {
                    const isSelected = heroOptionSelected === opt.id;
                    let style = 'bg-slate-50 border-slate-200 text-slate-700 hover:border-[#059669] hover:bg-white';

                    if (heroSubmitted) {
                      if (opt.correct) {
                        style = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold';
                      } else if (isSelected && !opt.correct) {
                        style = 'bg-rose-50 border-rose-300 text-rose-800';
                      }
                    } else if (isSelected) {
                      style = 'bg-emerald-50 border-[#059669] text-[#059669] font-bold ring-1 ring-[#059669]';
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          if (!heroSubmitted) setHeroOptionSelected(opt.id);
                        }}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all duration-200 flex items-center justify-between ${style}`}
                      >
                        <span>{opt.text}</span>
                        {heroSubmitted && opt.correct && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Card Bottom CTA / Explanation */}
                <div className="pt-2">
                  {!heroSubmitted ? (
                    <button
                      type="button"
                      disabled={heroOptionSelected === null}
                      onClick={handleHeroSubmit}
                      className="w-full py-3.5 rounded-xl bg-[#059669] hover:bg-[#047857] disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Submit Answer</span>
                      <Zap className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>
                            {currentDemo.options.find((o) => o.id === heroOptionSelected)?.correct
                              ? 'Correct! (+10 pts / XP Added)'
                              : 'Incorrect Answer'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 leading-relaxed font-normal">
                          {currentDemo.explanation}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleNextDemo}
                        className="w-full py-3 rounded-xl bg-slate-900 hover:bg-[#059669] text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
                      >
                        <span>Try Another Question</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CEFR Progression Map */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#059669] text-xs font-bold">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Targeted CEFR Scale</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Curated Proficiency Track
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto font-normal">
            Select your proficiency level to inspect detailed syllabus scope and immediately begin level-matched exercises.
          </p>
        </div>

        {/* Level Switcher Tab Bar */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {levelDetails.map((item) => {
            const isActive = activeLevel === item.level;
            return (
              <button
                key={item.level}
                onClick={() => setActiveLevel(item.level)}
                className={`px-5 py-3 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-2 border ${
                  isActive
                    ? 'bg-[#059669] border-[#059669] text-white shadow-md shadow-emerald-600/25'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-[#059669] hover:bg-white'
                }`}
              >
                <span>{item.level}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-[#047857] text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Featured Level Active Spotlight Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-8 space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-white bg-[#059669] px-4 py-1.5 rounded-xl shadow-md shadow-emerald-600/25">
                  {activeDetail.level}
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{activeDetail.title}</h3>
                  <p className="text-xs text-[#059669] font-bold">{activeDetail.badge}</p>
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed max-w-2xl font-normal">
                {activeDetail.desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] font-bold text-slate-500">Target Vocabulary</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">{activeDetail.vocabCount}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] font-bold text-slate-500">Grammar Focus</p>
                  <p className="text-xs font-bold text-[#059669] mt-1 truncate">{activeDetail.grammarFocus}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] font-bold text-slate-500">Skill Horizon</p>
                  <p className="text-xs font-bold text-emerald-600 mt-1">Verified Fluency</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center items-center lg:items-end border-t lg:border-t-0 lg:border-l border-slate-200 pt-6 lg:pt-0 lg:pl-8 space-y-4">
              <p className="text-xs text-slate-600 text-center lg:text-right font-normal">
                {activeDetail.typicalOutcome}
              </p>
              <Link
                href={`/practice/${activeDetail.level}`}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Practice {activeDetail.level} Level</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Bento Skill Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200">
        
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#059669] text-xs font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>Comprehensive Skill Modules</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Designed for Active Skill Acquisition
          </h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto font-normal">
            Every module is tailored to train distinct linguistic cognitive skills.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tile 1: Reading Passages */}
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-7 flex flex-col justify-between hover:border-[#059669] hover:shadow-xl transition-all duration-300 group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#059669]">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Reading Comprehension & Passages</h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-xl font-normal">
                Engage with curated texts across science, economics, culture, and literature. Includes built-in multiple choice, true/false, and context inferencing.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Text-based questions with instant context hints</span>
              </div>
              <Link href="/practice/ALL/READING" className="text-[#059669] hover:underline font-bold flex items-center gap-1">
                Explore Reading <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Tile 2: Listening Module */}
          <div className="bg-white border border-slate-200 rounded-2xl p-7 flex flex-col justify-between hover:border-[#059669] hover:shadow-xl transition-all duration-300 group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Listening Exercises</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-normal">
                Native audio clips with custom player controls, playback speed toggles, and transcript reveals.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link href="/practice/ALL/LISTENING" className="text-xs font-bold text-[#059669] hover:underline flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5" /> Audio Exercises <ArrowRight className="w-3 h-3 ml-auto" />
              </Link>
            </div>
          </div>

          {/* Tile 3: Vocabulary & Context */}
          <div className="bg-white border border-slate-200 rounded-2xl p-7 flex flex-col justify-between hover:border-[#059669] hover:shadow-xl transition-all duration-300">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Vocabulary & Context</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-normal">
                Master word collocations, idiomatic phrases, and fill-in-the-blank contextual challenges.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link href="/practice/ALL/VOCABULARY" className="text-xs font-bold text-[#059669] hover:underline flex items-center gap-1">
                Train Vocabulary <ArrowRight className="w-3 h-3 ml-auto" />
              </Link>
            </div>
          </div>

          {/* Tile 4: Synonyms & Antonyms */}
          <div className="bg-white border border-slate-200 rounded-2xl p-7 flex flex-col justify-between hover:border-[#059669] hover:shadow-xl transition-all duration-300">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Synonyms & Antonyms</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-normal">
                Expand lexical variety and prevent repetitive word usage in analytical writing.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link href="/practice/ALL/SYNONYMS_ANTONYMS" className="text-xs font-bold text-[#059669] hover:underline flex items-center gap-1">
                Lexical Matching <ArrowRight className="w-3 h-3 ml-auto" />
              </Link>
            </div>
          </div>

          {/* Tile 5: Grammar Rules & Inversion */}
          <div className="bg-white border border-slate-200 rounded-2xl p-7 flex flex-col justify-between hover:border-[#059669] hover:shadow-xl transition-all duration-300">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Grammar Precision</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-normal">
                Detailed explanations of complex syntax, conditionals, inversion, and tense consistency.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link href="/practice/ALL/GRAMMAR" className="text-xs font-bold text-[#059669] hover:underline flex items-center gap-1">
                Grammar Tests <ArrowRight className="w-3 h-3 ml-auto" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Speaking Studio Spotlight Card */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-[#059669] rounded-2xl p-8 sm:p-12 overflow-hidden shadow-2xl text-white">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold">
                <Mic className="w-3.5 h-3.5 text-emerald-300" />
                <span>Voice Recording Suite</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Interactive Speaking Studio
              </h2>
              <p className="text-slate-100 text-sm leading-relaxed font-normal">
                Practice topic prompts, review follow-up questions, inspect key vocabulary suggestions, and record your speech directly in your browser with immediate playback.
              </p>
            </div>

            <Link
              href="/speaking"
              className="px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <span>Launch Speaking Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}




