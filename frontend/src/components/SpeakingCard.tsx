'use client';

import React, { useState, useRef } from 'react';
import { SpeakingTopic } from '@/types';
import { Mic, Square, RefreshCw, MessageSquare, HelpCircle } from 'lucide-react';

interface SpeakingCardProps {
  topic: SpeakingTopic;
}

export default function SpeakingCard({ topic }: SpeakingCardProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  let prompts: string[] = [];
  let followUp: string[] = [];

  if (topic.promptsJson) {
    try { prompts = JSON.parse(topic.promptsJson); } catch { prompts = []; }
  }
  if (topic.followUpQuestionsJson) {
    try { followUp = JSON.parse(topic.followUpQuestionsJson); } catch { followUp = []; }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedUrl(audioUrl);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch {
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    } else {
      setRecordedUrl('simulated');
    }
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resetRecording = () => {
    setRecordedUrl(null);
    setRecordingTime(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <span className="px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#059669] font-bold text-xs">
          {topic.level} Speaking
        </span>
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
          <Mic className="w-3.5 h-3.5 text-[#059669]" />
          <span>Interactive Voice Studio</span>
        </div>
      </div>

      {/* Topic Title & Description */}
      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{topic.title}</h3>
        {topic.description && (
          <p className="text-slate-600 text-sm leading-relaxed font-normal">{topic.description}</p>
        )}
      </div>

      {/* Prompts Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#059669]">
          <MessageSquare className="w-4 h-4 text-[#059669]" /> Speaking Prompts
        </div>
        <ul className="space-y-2.5">
          {prompts.map((p, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-800 text-sm font-medium">
              <span className="w-5 h-5 rounded-md bg-emerald-100 text-[#059669] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Follow Up Questions */}
      {followUp.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#059669]">
            <HelpCircle className="w-4 h-4 text-[#059669]" /> Optional Follow-Up Questions
          </div>
          <ul className="space-y-1.5 text-slate-700 text-sm font-medium">
            {followUp.map((q, idx) => (
              <li key={idx} className="list-disc list-inside text-slate-700">{q}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Voice Recorder Interface */}
      <div className="bg-slate-900 text-white rounded-xl p-6 text-center space-y-4 shadow-md">
        <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
          Browser Voice Recorder Suite
        </h4>

        <div className="flex items-center justify-center gap-3">
          {isRecording ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/20 border border-rose-500 text-rose-200 font-mono font-bold text-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>Recording... {formatTime(recordingTime)}</span>
            </div>
          ) : (
            <div className="text-slate-300 text-xs font-mono">
              {recordedUrl ? `Recorded clip duration: ${formatTime(recordingTime)}` : 'Click record when ready'}
            </div>
          )}
        </div>

        <div className="flex justify-center gap-3">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="px-6 py-3.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all duration-200"
            >
              <Mic className="w-4 h-4" />
              <span>{recordedUrl ? 'Re-record Audio' : 'Start Recording'}</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all duration-200"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Stop Recording</span>
            </button>
          )}

          {recordedUrl && (
            <button
              onClick={resetRecording}
              className="p-3.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white border border-slate-700 transition-all"
              title="Reset"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

        {recordedUrl && recordedUrl !== 'simulated' && (
          <div className="pt-3 max-w-md mx-auto">
            <audio src={recordedUrl} controls className="w-full rounded-xl bg-black" />
          </div>
        )}
      </div>

    </div>
  );
}



