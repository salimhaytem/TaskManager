import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectService, taskService } from '@/services/api';
import { ProjectResponse, TaskResponse } from '@/config/api';

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  projectId: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tasks: Task[];
  createdAt: string;
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
}

interface ProjectContextType {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  addProject: (title: string, description: string) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  getProject: (id: number) => Project | undefined;
  updateProject: (id: number, title: string, description: string) => Promise<void>;
  addTask: (projectId: number, title: string, description: string, dueDate: string) => Promise<void>;
  toggleTask: (projectId: number, taskId: number) => Promise<void>;
  deleteTask: (projectId: number, taskId: number) => Promise<void>;
  updateTask: (projectId: number, taskId: number, title: string, description: string, dueDate: string) => Promise<void>;
  getProjectProgress: (projectId: number) => { total: number; completed: number; percentage: number };
  getTotalStats: () => { totalProjects: number; totalTasks: number; completedTasks: number };
  refreshProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour charger les projets et leurs tâches
  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Charger tous les projets
      const projectsData = await projectService.getAll();
      
      // Charger les tâches pour chaque projet
      const projectsWithTasks = await Promise.all(
        projectsData.map(async (project: ProjectResponse) => {
          try {
            const tasks = await taskService.getAllByProject(project.id);
            console.log('Tâches chargées depuis l\'API:', tasks);
            return {
              ...project,
              tasks: tasks.map((task: TaskResponse) => ({
                id: task.id,
                title: task.title,
                description: task.description || '',
                dueDate: task.dueDate,
                completed: task.completed,
                createdAt: task.createdAt,
                projectId: task.projectId,
              })),
            };
          } catch (err) {
            console.error(`Erreur lors du chargement des tâches pour le projet ${project.id}:`, err);
            return {
              ...project,
              tasks: [],
            };
          }
        })
      );
      
      setProjects(projectsWithTasks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des projets';
      setError(errorMessage);
      console.error('Erreur lors du chargement des projets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les projets au montage du composant
  useEffect(() => {
    loadProjects();
  }, []);

  const addProject = async (title: string, description: string) => {
    try {
      setError(null);
      const newProject = await projectService.create({ title, description: description || '' });
      
      // Ajouter le projet avec une liste de tâches vide
      const projectWithTasks: Project = {
        ...newProject,
        tasks: [],
      };
      
      setProjects(prev => [...prev, projectWithTasks]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du projet';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteProject = async (id: number) => {
    try {
      setError(null);
      await projectService.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression du projet';
      setError(errorMessage);
      throw err;
    }
  };

  const updateProject = async (id: number, title: string, description: string) => {
    try {
      setError(null);
      const updatedProject = await projectService.update(id, { title, description: description || '' });
      
      setProjects(prev =>
        prev.map(project =>
          project.id === id
            ? { ...project, title: updatedProject.title, description: updatedProject.description || '' }
            : project
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du projet';
      setError(errorMessage);
      throw err;
    }
  };

  const getProject = (id: number) => {
    return projects.find(p => p.id === id);
  };

  const addTask = async (projectId: number, title: string, description: string, dueDate: string) => {
    try {
      setError(null);
      const newTask = await taskService.create(projectId, {
        title,
        description: description || '',
        dueDate,
      });
      
      const task: Task = {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description || '',
        dueDate: newTask.dueDate,
        completed: newTask.completed,
        createdAt: newTask.createdAt,
        projectId: newTask.projectId,
      };
      
      setProjects(prev =>
        prev.map(project =>
          project.id === projectId
            ? { ...project, tasks: [...project.tasks, task] }
            : project
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de la tâche';
      setError(errorMessage);
      throw err;
    }
  };

  const toggleTask = async (projectId: number, taskId: number) => {
    try {
      setError(null);
      console.log(`Toggling task: Project ID=${projectId}, Task ID=${taskId}`);
      // Mise à jour optimiste: basculer immédiatement l'état local pour une réponse visuelle instantanée
      setProjects(prev =>
        prev.map(project =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.map(task =>
                  task.id === taskId
                    ? { ...task, completed: true }
                    : task
                ),
              }
            : project
        )
      );

      // Appel API pour confirmer la modification côté serveur
      const updatedTask = await taskService.toggle(projectId, taskId);
      console.log('Updated task from server:', updatedTask);

      // Harmoniser l'état avec la réponse serveur (au cas où)
      setProjects(prev =>
        prev.map(project =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.map(task =>
                  task.id === taskId
                    ? { ...task, completed: updatedTask.completed }
                    : task
                ),
              }
            : project
        )
      );
    } catch (err) {
      // En cas d'erreur, revenir à l'état précédent en inversant de nouveau
      setProjects(prev =>
        prev.map(project =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.map(task =>
                  task.id === taskId
                    ? { ...task, completed: true }
                    : task
                ),
              }
            : project
        )
      );

      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la tâche';
      setError(errorMessage);
      throw err;
    }
  };

  const updateTask = async (projectId: number, taskId: number, title: string, description: string, dueDate: string) => {
    try {
      setError(null);
      const updatedTask = await taskService.update(projectId, taskId, {
        title,
        description: description || '',
        dueDate,
      });
      
      setProjects(prev =>
        prev.map(project =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.map(task =>
                  task.id === taskId
                    ? {
                        ...task,
                        title: updatedTask.title,
                        description: updatedTask.description || '',
                        dueDate: updatedTask.dueDate,
                      }
                    : task
                ),
              }
            : project
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la tâche';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteTask = async (projectId: number, taskId: number) => {
    try {
      setError(null);
      await taskService.delete(projectId, taskId);
      
      setProjects(prev =>
        prev.map(project =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.filter(task => task.id !== taskId),
              }
            : project
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression de la tâche';
      setError(errorMessage);
      throw err;
    }
  };

  const getProjectProgress = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return { total: 0, completed: 0, percentage: 0 };
    
    const total = project.tasks.length;
    const completed = project.tasks.filter(t => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    return { total, completed, percentage };
  };

  const getTotalStats = () => {
    const totalProjects = projects.length;
    const totalTasks = projects.reduce((acc, p) => acc + p.tasks.length, 0);
    const completedTasks = projects.reduce((acc, p) => acc + p.tasks.filter(t => t.completed).length, 0);
    
    return { totalProjects, totalTasks, completedTasks };
  };

  const value = {
    projects,
    isLoading,
    error,
    addProject,
    deleteProject,
    getProject,
    updateProject,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    getProjectProgress,
    getTotalStats,
    refreshProjects: loadProjects,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};
