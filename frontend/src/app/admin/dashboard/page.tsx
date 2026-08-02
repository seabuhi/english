'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  fetchAdminExercises,
  createAdminExercise,
  updateAdminExercise,
  deleteAdminExercise,
  fetchAdminSpeakingTopics,
  createAdminSpeakingTopic,
  updateAdminSpeakingTopic,
  deleteAdminSpeakingTopic,
  uploadMediaFile,
  parsePdfFile,
  confirmPdfImportBatch,
  logoutAdmin
} from '@/lib/api';
import { Exercise, SpeakingTopic, CefrLevel, Category, ExerciseType } from '@/types';
import {
  Shield,
  Plus,
  Trash2,
  Edit,
  FileText,
  Search,
  LogOut,
  CheckCircle,
  Volume2,
  Image as ImageIcon,
  Mic,
  BookOpen,
  X,
  Copy,
  Check
} from 'lucide-react';

const levels: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const categories: Category[] = ['READING', 'LISTENING', 'VOCABULARY', 'SYNONYMS_ANTONYMS', 'GRAMMAR', 'SPEAKING'];
const exerciseTypes: ExerciseType[] = ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_IN_BLANK', 'MATCHING', 'SENTENCE_CORRECTION'];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'exercises' | 'speaking' | 'media' | 'pdf'>('exercises');
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [speakingTopics, setSpeakingTopics] = useState<SpeakingTopic[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Partial<Exercise> | null>(null);
  const [optionsText, setOptionsText] = useState<string>('');

  const [isSpeakingModalOpen, setIsSpeakingModalOpen] = useState(false);
  const [editingSpeakingTopic, setEditingSpeakingTopic] = useState<Partial<SpeakingTopic> | null>(null);
  const [promptsText, setPromptsText] = useState<string>('');
  const [followUpText, setFollowUpText] = useState<string>('');

  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; fileName: string }[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfLevel, setPdfLevel] = useState<string>('B1');
  const [pdfCategory, setPdfCategory] = useState<string>('GRAMMAR');
  const [parsingPdf, setParsingPdf] = useState(false);
  const [parsedCandidates, setParsedCandidates] = useState<Partial<Exercise>[]>([]);
  const [importingBatch, setImportingBatch] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    loadData();
  }, [filterLevel, filterCategory, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [exData, spData] = await Promise.all([
        fetchAdminExercises(filterLevel, filterCategory, searchQuery),
        fetchAdminSpeakingTopics(filterLevel),
      ]);
      setExercises(exData);
      setSpeakingTopics(spData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    router.push('/admin/login');
  };

  const openNewExerciseModal = () => {
    setEditingExercise({
      title: '',
      level: 'A1',
      category: 'GRAMMAR',
      exerciseType: 'MULTIPLE_CHOICE',
      questionText: '',
      correctAnswer: '',
      explanation: '',
    });
    setOptionsText('["Option A", "Option B", "Option C", "Option D"]');
    setIsExerciseModalOpen(true);
  };

  const openEditExerciseModal = (ex: Exercise) => {
    setEditingExercise(ex);
    setOptionsText(ex.optionsJson || '');
    setIsExerciseModalOpen(true);
  };

  const handleSaveExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExercise) return;

    try {
      const payload = {
        ...editingExercise,
        optionsJson: optionsText,
      };

      if (editingExercise.id) {
        await updateAdminExercise(editingExercise.id, payload);
      } else {
        await createAdminExercise(payload);
      }

      setIsExerciseModalOpen(false);
      loadData();
    } catch {
      alert('Failed to save exercise.');
    }
  };

  const handleDeleteExercise = async (id: number) => {
    if (confirm('Are you sure you want to delete this exercise?')) {
      await deleteAdminExercise(id);
      loadData();
    }
  };

  const openNewSpeakingModal = () => {
    setEditingSpeakingTopic({
      title: '',
      level: 'A1',
      description: '',
    });
    setPromptsText('["Question prompt 1", "Question prompt 2"]');
    setFollowUpText('["Follow up question 1"]');
    setIsSpeakingModalOpen(true);
  };

  const openEditSpeakingModal = (topic: SpeakingTopic) => {
    setEditingSpeakingTopic(topic);
    setPromptsText(topic.promptsJson || '');
    setFollowUpText(topic.followUpQuestionsJson || '');
    setIsSpeakingModalOpen(true);
  };

  const handleSaveSpeakingTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpeakingTopic) return;

    try {
      const payload = {
        ...editingSpeakingTopic,
        promptsJson: promptsText,
        followUpQuestionsJson: followUpText,
      };

      if (editingSpeakingTopic.id) {
        await updateAdminSpeakingTopic(editingSpeakingTopic.id, payload);
      } else {
        await createAdminSpeakingTopic(payload);
      }

      setIsSpeakingModalOpen(false);
      loadData();
    } catch {
      alert('Failed to save speaking topic.');
    }
  };

  const handleDeleteSpeakingTopic = async (id: number) => {
    if (confirm('Are you sure you want to delete this speaking topic?')) {
      await deleteAdminSpeakingTopic(id);
      loadData();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'images') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadMediaFile(file, type);
      setUploadedFiles((prev) => [res, ...prev]);
    } catch {
      alert('Failed to upload file.');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(`http://localhost:8080${url}`);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleParsePdf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) return;

    setParsingPdf(true);
    try {
      const parsed = await parsePdfFile(pdfFile, pdfLevel, pdfCategory);
      setParsedCandidates(parsed);
    } catch {
      alert('Failed to parse PDF document.');
    } finally {
      setParsingPdf(false);
    }
  };

  const handleConfirmPdfImport = async () => {
    if (parsedCandidates.length === 0) return;

    setImportingBatch(true);
    try {
      await confirmPdfImportBatch(parsedCandidates);
      alert(`Successfully imported ${parsedCandidates.length} exercises to database!`);
      setParsedCandidates([]);
      setPdfFile(null);
      loadData();
    } catch {
      alert('Failed to import exercises batch.');
    } finally {
      setImportingBatch(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-black border-b border-slate-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-base">LinguaPro Admin</span>
              <span className="ml-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-950 text-white border border-blue-800">
                Authorized Session
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Workspace */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-900 pb-4">
          {[
            { id: 'exercises', label: 'Exercise Manager', icon: BookOpen },
            { id: 'speaking', label: 'Speaking Topics', icon: Mic },
            { id: 'media', label: 'Media Uploader (Audio/Images)', icon: Volume2 },
            { id: 'pdf', label: 'PDF Question Import Studio', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition ${
                  activeTab === tab.id
                    ? 'bg-blue-950 border border-blue-800 text-white shadow-lg'
                    : 'bg-black border border-slate-900 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: EXERCISES */}
        {activeTab === 'exercises' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Exercise Database</h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Total exercises in database: <span className="text-white font-bold">{exercises.length}</span>
                </p>
              </div>

              <button
                onClick={openNewExerciseModal}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Exercise</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-black border border-slate-900 p-4 rounded-2xl">
              
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">CEFR Level</label>
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                >
                  <option value="ALL">All Levels</option>
                  {levels.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                >
                  <option value="ALL">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Search Keywords</label>
                <div className="relative mt-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title or question..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>

            </div>

            <div className="bg-black border border-slate-900 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-900">
                    <tr>
                      <th className="py-3.5 px-4">Title</th>
                      <th className="py-3.5 px-4">Level</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Type</th>
                      <th className="py-3.5 px-4">Question</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {exercises.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-500">
                          No exercises found matching criteria.
                        </td>
                      </tr>
                    ) : (
                      exercises.map((ex) => (
                        <tr key={ex.id} className="hover:bg-slate-950 transition">
                          <td className="py-3 px-4 font-semibold text-white">{ex.title}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-900 text-white font-bold">
                              {ex.level}
                            </span>
                          </td>
                          <td className="py-3 px-4 uppercase font-mono text-[10px] text-slate-300">
                            {ex.category}
                          </td>
                          <td className="py-3 px-4 font-mono text-[10px] text-slate-400">
                            {ex.exerciseType}
                          </td>
                          <td className="py-3 px-4 truncate max-w-xs text-slate-400">
                            {ex.questionText}
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => openEditExerciseModal(ex)}
                              className="p-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 border border-slate-800 transition"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteExercise(ex.id)}
                              className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: SPEAKING */}
        {activeTab === 'speaking' && (
          <div className="space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Speaking Topics</h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Total topics: <span className="text-white font-bold">{speakingTopics.length}</span>
                </p>
              </div>

              <button
                onClick={openNewSpeakingModal}
                className="px-5 py-3 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Speaking Topic</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {speakingTopics.map((topic) => (
                <div key={topic.id} className="bg-black border border-slate-900 rounded-2xl p-6 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-white font-bold text-xs border border-blue-800">
                      {topic.level} Level
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditSpeakingModal(topic)}
                        className="p-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 border border-slate-800 transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSpeakingTopic(topic.id)}
                        className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-lg">{topic.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{topic.description}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: MEDIA UPLOADER */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            
            <div className="bg-black border border-slate-900 rounded-3xl p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-xl font-bold text-white">Upload Audio & Image Files</h2>
                <p className="text-slate-400 text-xs mt-1">
                  Upload MP3 listening clips or images to embed into your exercises.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="bg-slate-950 border border-dashed border-slate-800 rounded-2xl p-6 text-center space-y-3">
                  <Volume2 className="w-8 h-8 text-white mx-auto" />
                  <h4 className="font-bold text-sm text-white">Upload Audio MP3</h4>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileUpload(e, 'audio')}
                    disabled={uploading}
                    className="hidden"
                    id="audio-upload-input"
                  />
                  <label
                    htmlFor="audio-upload-input"
                    className="inline-block px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800 text-white font-bold text-xs cursor-pointer transition"
                  >
                    {uploading ? 'Uploading...' : 'Choose MP3 File'}
                  </label>
                </div>

                <div className="bg-slate-950 border border-dashed border-slate-800 rounded-2xl p-6 text-center space-y-3">
                  <ImageIcon className="w-8 h-8 text-white mx-auto" />
                  <h4 className="font-bold text-sm text-white">Upload Image</h4>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'images')}
                    disabled={uploading}
                    className="hidden"
                    id="image-upload-input"
                  />
                  <label
                    htmlFor="image-upload-input"
                    className="inline-block px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800 text-white font-bold text-xs cursor-pointer transition"
                  >
                    {uploading ? 'Uploading...' : 'Choose Image File'}
                  </label>
                </div>

              </div>

              {uploadedFiles.length > 0 && (
                <div className="pt-4 border-t border-slate-900 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Uploaded Files</h4>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-900 text-xs">
                        <span className="font-mono text-slate-300 truncate max-w-sm">{file.fileName}</span>
                        <button
                          onClick={() => copyToClipboard(file.url)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-950 border border-blue-900 text-white font-semibold"
                        >
                          {copiedUrl === file.url ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedUrl === file.url ? 'Copied URL!' : 'Copy URL'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 4: PDF IMPORT */}
        {activeTab === 'pdf' && (
          <div className="space-y-6">
            
            <div className="bg-black border border-slate-900 rounded-3xl p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-xl font-bold text-white">Automated PDF Exercise Import Studio</h2>
                <p className="text-slate-400 text-xs mt-1">
                  Upload PDF question sheets to parse text automatically, review & edit questions, and batch import to database.
                </p>
              </div>

              <form onSubmit={handleParsePdf} className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-900">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Assign Level</label>
                    <select
                      value={pdfLevel}
                      onChange={(e) => setPdfLevel(e.target.value)}
                      className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                    >
                      {levels.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Assign Category</label>
                    <select
                      value={pdfCategory}
                      onChange={(e) => setPdfCategory(e.target.value)}
                      className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                    >
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Select PDF File</label>
                    <input
                      type="file"
                      accept=".pdf"
                      required
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                      className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={parsingPdf || !pdfFile}
                    className="px-6 py-3 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800 text-white font-bold text-xs shadow-lg disabled:opacity-50"
                  >
                    {parsingPdf ? 'Extracting & Parsing PDF...' : '1. Parse PDF Text'}
                  </button>
                </div>
              </form>

              {parsedCandidates.length > 0 && (
                <div className="space-y-6 pt-4 border-t border-slate-900">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-lg">
                      Extracted Candidate Exercises ({parsedCandidates.length})
                    </h3>

                    <button
                      onClick={handleConfirmPdfImport}
                      disabled={importingBatch}
                      className="px-6 py-3 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800 text-white font-bold text-xs shadow-lg flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span>{importingBatch ? 'Importing...' : 'Confirm & Save All to Database'}</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {parsedCandidates.map((cand, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white">Exercise #{idx + 1}</span>
                          <span className="text-xs text-slate-400 font-mono">{cand.exerciseType}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400">Title</label>
                            <input
                              type="text"
                              value={cand.title || ''}
                              onChange={(e) => {
                                const next = [...parsedCandidates];
                                next[idx].title = e.target.value;
                                setParsedCandidates(next);
                              }}
                              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400">Question Text</label>
                            <input
                              type="text"
                              value={cand.questionText || ''}
                              onChange={(e) => {
                                const next = [...parsedCandidates];
                                next[idx].questionText = e.target.value;
                                setParsedCandidates(next);
                              }}
                              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400">Options JSON</label>
                          <input
                            type="text"
                            value={cand.optionsJson || ''}
                            onChange={(e) => {
                              const next = [...parsedCandidates];
                              next[idx].optionsJson = e.target.value;
                              setParsedCandidates(next);
                            }}
                            className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400">Correct Answer</label>
                            <input
                              type="text"
                              value={cand.correctAnswer || ''}
                              onChange={(e) => {
                                const next = [...parsedCandidates];
                                next[idx].correctAnswer = e.target.value;
                                setParsedCandidates(next);
                              }}
                              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400">Explanation</label>
                            <input
                              type="text"
                              value={cand.explanation || ''}
                              onChange={(e) => {
                                const next = [...parsedCandidates];
                                next[idx].explanation = e.target.value;
                                setParsedCandidates(next);
                              }}
                              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* EXERCISE MODAL FORM */}
      {isExerciseModalOpen && editingExercise && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-black border border-blue-950 rounded-3xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingExercise.id ? 'Edit Exercise' : 'Create New Exercise'}
              </h3>
              <button onClick={() => setIsExerciseModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExercise} className="space-y-4 text-xs">
              
              <div>
                <label className="font-bold text-slate-300 uppercase">Title</label>
                <input
                  type="text"
                  required
                  value={editingExercise.title || ''}
                  onChange={(e) => setEditingExercise({ ...editingExercise, title: e.target.value })}
                  className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  placeholder="e.g. Present Simple Basics"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 uppercase">Level</label>
                  <select
                    value={editingExercise.level || 'A1'}
                    onChange={(e) => setEditingExercise({ ...editingExercise, level: e.target.value as CefrLevel })}
                    className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  >
                    {levels.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 uppercase">Category</label>
                  <select
                    value={editingExercise.category || 'GRAMMAR'}
                    onChange={(e) => setEditingExercise({ ...editingExercise, category: e.target.value as Category })}
                    className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  >
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 uppercase">Type</label>
                  <select
                    value={editingExercise.exerciseType || 'MULTIPLE_CHOICE'}
                    onChange={(e) => setEditingExercise({ ...editingExercise, exerciseType: e.target.value as ExerciseType })}
                    className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  >
                    {exerciseTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 uppercase">Reading Text / Passage (Optional)</label>
                <textarea
                  rows={3}
                  value={editingExercise.textContent || ''}
                  onChange={(e) => setEditingExercise({ ...editingExercise, textContent: e.target.value })}
                  className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  placeholder="Insert reading passage text..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 uppercase">Audio URL (Optional)</label>
                  <input
                    type="text"
                    value={editingExercise.audioUrl || ''}
                    onChange={(e) => setEditingExercise({ ...editingExercise, audioUrl: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    placeholder="/uploads/audio/sample.mp3"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 uppercase">Image URL (Optional)</label>
                  <input
                    type="text"
                    value={editingExercise.imageUrl || ''}
                    onChange={(e) => setEditingExercise({ ...editingExercise, imageUrl: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    placeholder="/uploads/images/sample.jpg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 uppercase">Question Text</label>
                <textarea
                  rows={2}
                  required
                  value={editingExercise.questionText || ''}
                  onChange={(e) => setEditingExercise({ ...editingExercise, questionText: e.target.value })}
                  className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium"
                  placeholder="Type the question prompt..."
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 uppercase">Options (JSON Array format)</label>
                <input
                  type="text"
                  value={optionsText}
                  onChange={(e) => setOptionsText(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                  placeholder='["Option A", "Option B", "Option C"]'
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 uppercase">Correct Answer</label>
                <input
                  type="text"
                  required
                  value={editingExercise.correctAnswer || ''}
                  onChange={(e) => setEditingExercise({ ...editingExercise, correctAnswer: e.target.value })}
                  className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold"
                  placeholder="Exact string matching one of the options"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 uppercase">Explanation (Shown after Submit)</label>
                <textarea
                  rows={2}
                  value={editingExercise.explanation || ''}
                  onChange={(e) => setEditingExercise({ ...editingExercise, explanation: e.target.value })}
                  className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
                  placeholder="Explain why this answer is correct..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsExerciseModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800 text-white font-bold"
                >
                  Save Exercise
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* SPEAKING TOPIC MODAL FORM */}
      {isSpeakingModalOpen && editingSpeakingTopic && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-black border border-blue-950 rounded-3xl max-w-xl w-full p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingSpeakingTopic.id ? 'Edit Speaking Topic' : 'Add New Speaking Topic'}
              </h3>
              <button onClick={() => setIsSpeakingModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSpeakingTopic} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 uppercase">Topic Title</label>
                <input
                  type="text"
                  required
                  value={editingSpeakingTopic.title || ''}
                  onChange={(e) => setEditingSpeakingTopic({ ...editingSpeakingTopic, title: e.target.value })}
                  className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 uppercase">CEFR Level</label>
                <select
                  value={editingSpeakingTopic.level || 'A1'}
                  onChange={(e) => setEditingSpeakingTopic({ ...editingSpeakingTopic, level: e.target.value as CefrLevel })}
                  className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-white"
                >
                  {levels.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 uppercase">Description / Instructions</label>
                <textarea
                  rows={2}
                  value={editingSpeakingTopic.description || ''}
                  onChange={(e) => setEditingSpeakingTopic({ ...editingSpeakingTopic, description: e.target.value })}
                  className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 uppercase">Prompts (JSON Array)</label>
                <textarea
                  rows={2}
                  value={promptsText}
                  onChange={(e) => setPromptsText(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 uppercase">Follow-up Questions (JSON Array)</label>
                <textarea
                  rows={2}
                  value={followUpText}
                  onChange={(e) => setFollowUpText(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSpeakingModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800 text-white font-bold"
                >
                  Save Speaking Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
