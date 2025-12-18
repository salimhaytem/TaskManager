// Configuration de l'API Backend
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Types pour les réponses du backend
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  fullName: string;
}

export interface ProjectRequest {
  title: string;
  description?: string;
}

export interface ProjectResponse {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
}

export interface TaskRequest {
  title: string;
  description?: string;
  dueDate: string;
}

export interface TaskResponse {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  projectId: number;
}

