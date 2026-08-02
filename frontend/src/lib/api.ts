import axios from 'axios';
import { AnswerResult, AuthResponse, Category, CefrLevel, Exercise, SpeakingTopic, UserProfile } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const adminToken = localStorage.getItem('admin_token');
    const userToken = localStorage.getItem('user_token');
    const token = adminToken || userToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// --- Public Exercises & Topics ---

export async function fetchPublicExercises(level?: CefrLevel | string, category?: Category | string): Promise<Exercise[]> {
  const params: Record<string, string> = {};
  if (level && level !== 'ALL') params.level = level;
  if (category && category !== 'ALL') params.category = category;

  const res = await api.get<Exercise[]>('/public/exercises', { params });
  return res.data;
}

export async function fetchPublicExerciseById(id: number): Promise<Exercise> {
  const res = await api.get<Exercise>(`/public/exercises/${id}`);
  return res.data;
}

export async function submitExerciseAnswer(id: number, userAnswer: string): Promise<AnswerResult> {
  const res = await api.post<AnswerResult>(`/public/exercises/${id}/submit`, { userAnswer });
  return res.data;
}

export async function fetchPublicSpeakingTopics(level?: CefrLevel | string): Promise<SpeakingTopic[]> {
  const params: Record<string, string> = {};
  if (level && level !== 'ALL') params.level = level;

  const res = await api.get<SpeakingTopic[]>('/public/speaking-topics', { params });
  return res.data;
}

// --- Student User Auth Endpoints ---

export async function registerStudent(fullName: string, username: string, email: string, password: string): Promise<{ message: string; email: string; username: string }> {
  const res = await api.post<{ message: string; email: string; username: string }>('/user/auth/register', {
    fullName,
    username,
    email,
    password,
  });
  return res.data;
}

export async function verifyStudentOtp(email: string, otpCode: string): Promise<{ message: string }> {
  const res = await api.post<{ message: string }>('/user/auth/verify-otp', { email, otpCode });
  return res.data;
}

export async function resendStudentOtp(email: string): Promise<{ message: string }> {
  const res = await api.post<{ message: string }>('/user/auth/resend-otp', { email });
  return res.data;
}

export async function loginStudent(usernameOrEmail: string, password: string): Promise<UserProfile> {
  const res = await api.post<UserProfile>('/user/auth/login', { usernameOrEmail, password });
  if (res.data.token) {
    localStorage.setItem('user_token', res.data.token);
    localStorage.setItem('user_profile', JSON.stringify(res.data));

    if (res.data.username === 'admin') {
      localStorage.setItem('admin_token', res.data.token);
      localStorage.setItem('admin_user', 'admin');
    }
  }
  return res.data;
}

export async function fetchStudentProfile(): Promise<UserProfile> {
  const res = await api.get<UserProfile>('/user/auth/me');
  if (res.data) {
    localStorage.setItem('user_profile', JSON.stringify(res.data));
  }
  return res.data;
}

export function logoutStudent() {
  localStorage.removeItem('user_token');
  localStorage.removeItem('user_profile');
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
}

// --- Admin Endpoints ---

export async function loginAdmin(username: string, password: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/login', { username, password });
  if (res.data.token) {
    localStorage.setItem('admin_token', res.data.token);
    localStorage.setItem('admin_user', res.data.username);
  }
  return res.data;
}

export function logoutAdmin() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  localStorage.removeItem('user_token');
  localStorage.removeItem('user_profile');
}

export async function fetchAdminExercises(level?: string, category?: string, search?: string): Promise<Exercise[]> {
  const params: Record<string, string> = {};
  if (level && level !== 'ALL') params.level = level;
  if (category && category !== 'ALL') params.category = category;
  if (search) params.search = search;

  const res = await api.get<Exercise[]>('/admin/exercises', { params });
  return res.data;
}

export async function createAdminExercise(exercise: Partial<Exercise>): Promise<Exercise> {
  const res = await api.post<Exercise>('/admin/exercises', exercise);
  return res.data;
}

export async function updateAdminExercise(id: number, exercise: Partial<Exercise>): Promise<Exercise> {
  const res = await api.put<Exercise>(`/admin/exercises/${id}`, exercise);
  return res.data;
}

export async function deleteAdminExercise(id: number): Promise<void> {
  await api.delete(`/admin/exercises/${id}`);
}

export async function fetchAdminSpeakingTopics(level?: string): Promise<SpeakingTopic[]> {
  const params: Record<string, string> = {};
  if (level && level !== 'ALL') params.level = level;

  const res = await api.get<SpeakingTopic[]>('/admin/speaking-topics', { params });
  return res.data;
}

export async function createAdminSpeakingTopic(topic: Partial<SpeakingTopic>): Promise<SpeakingTopic> {
  const res = await api.post<SpeakingTopic>('/admin/speaking-topics', topic);
  return res.data;
}

export async function updateAdminSpeakingTopic(id: number, topic: Partial<SpeakingTopic>): Promise<SpeakingTopic> {
  const res = await api.put<SpeakingTopic>(`/admin/speaking-topics/${id}`, topic);
  return res.data;
}

export async function deleteAdminSpeakingTopic(id: number): Promise<void> {
  await api.delete(`/admin/speaking-topics/${id}`);
}

export async function uploadMediaFile(file: File, type: 'audio' | 'images' = 'audio'): Promise<{ url: string; fileName: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const res = await api.post<{ url: string; fileName: string }>('/admin/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function parsePdfFile(file: File, level?: string, category?: string): Promise<Exercise[]> {
  const formData = new FormData();
  formData.append('file', file);
  if (level && level !== 'ALL') formData.append('level', level);
  if (category && category !== 'ALL') formData.append('category', category);

  const res = await api.post<Exercise[]>('/admin/pdf/parse', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function confirmPdfImportBatch(exercises: Partial<Exercise>[]): Promise<Exercise[]> {
  const res = await api.post<Exercise[]>('/admin/pdf/confirm', exercises);
  return res.data;
}
