import { API_BASE_URL, LoginRequest, LoginResponse, ProjectRequest, ProjectResponse, TaskRequest, TaskResponse } from '@/config/api';

// Fonction utilitaire pour obtenir le token depuis localStorage
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Fonction utilitaire pour les requêtes HTTP
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error) {
    // Erreur réseau (CORS, serveur inaccessible, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur http://localhost:8080');
    }
    throw error;
  }

  if (!response.ok) {
    let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      // Gérer différents formats de réponse d'erreur
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      } else if (typeof errorData === 'object') {
        // Pour les erreurs de validation (Map<String, String>)
        const errorMessages = Object.values(errorData).join(', ');
        if (errorMessages) {
          errorMessage = errorMessages;
        }
      }
    } catch {
      // Si la réponse n'est pas du JSON, utiliser le message par défaut
      if (response.status === 401) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (response.status === 404) {
        errorMessage = 'Endpoint non trouvé';
      } else if (response.status === 500) {
        errorMessage = 'Erreur serveur. Vérifiez que le backend est démarré.';
      }
    }
    
    throw new Error(errorMessage);
  }

  // Si la réponse est 204 No Content, retourner null
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
};

// Service d'authentification
export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};

// Service des projets
export const projectService = {
  getAll: async (): Promise<ProjectResponse[]> => {
    return apiRequest<ProjectResponse[]>('/projects');
  },

  getById: async (id: number): Promise<ProjectResponse> => {
    return apiRequest<ProjectResponse>(`/projects/${id}`);
  },

  create: async (project: ProjectRequest): Promise<ProjectResponse> => {
    return apiRequest<ProjectResponse>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  },

  update: async (id: number, project: ProjectRequest): Promise<ProjectResponse> => {
    return apiRequest<ProjectResponse>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  },

  delete: async (id: number): Promise<void> => {
    return apiRequest<void>(`/projects/${id}`, {
      method: 'DELETE',
    });
  },
};

// Service des tâches
export const taskService = {
  getAllByProject: async (projectId: number): Promise<TaskResponse[]> => {
    return apiRequest<TaskResponse[]>(`/projects/${projectId}/tasks`);
  },

  create: async (projectId: number, task: TaskRequest): Promise<TaskResponse> => {
    return apiRequest<TaskResponse>(`/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(task),
    });
  },

  update: async (projectId: number, taskId: number, task: TaskRequest): Promise<TaskResponse> => {
    return apiRequest<TaskResponse>(`/projects/${projectId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  },

  toggle: async (projectId: number, taskId: number): Promise<TaskResponse> => {
    return apiRequest<TaskResponse>(`/projects/${projectId}/tasks/${taskId}/toggle`, {
      method: 'PATCH',
    });
  },

  delete: async (projectId: number, taskId: number): Promise<void> => {
    return apiRequest<void>(`/projects/${projectId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },
};

