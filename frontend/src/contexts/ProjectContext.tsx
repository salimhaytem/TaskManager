import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  createdAt: string;
}

interface ProjectContextType {
  projects: Project[];
  addProject: (title: string, description: string) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  addTask: (projectId: string, title: string, description: string, dueDate: string) => void;
  toggleTask: (projectId: string, taskId: string) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  getProjectProgress: (projectId: string) => { total: number; completed: number; percentage: number };
  getTotalStats: () => { totalProjects: number; totalTasks: number; completedTasks: number };
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

const initialProjects: Project[] = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design',
    tasks: [
      { id: '1', title: 'Design mockups', description: 'Create initial design concepts', dueDate: '2024-02-15', completed: true, createdAt: '2024-01-01' },
      { id: '2', title: 'Frontend development', description: 'Implement the new design', dueDate: '2024-03-01', completed: true, createdAt: '2024-01-05' },
      { id: '3', title: 'Testing', description: 'QA testing and bug fixes', dueDate: '2024-03-15', completed: false, createdAt: '2024-01-10' },
    ],
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Build a cross-platform mobile application',
    tasks: [
      { id: '1', title: 'Requirements gathering', description: 'Collect all requirements', dueDate: '2024-02-01', completed: true, createdAt: '2024-01-15' },
      { id: '2', title: 'UI/UX Design', description: 'Design the mobile interface', dueDate: '2024-02-20', completed: false, createdAt: '2024-01-20' },
      { id: '3', title: 'API Integration', description: 'Connect to backend services', dueDate: '2024-03-10', completed: false, createdAt: '2024-01-25' },
      { id: '4', title: 'App Store submission', description: 'Prepare and submit to stores', dueDate: '2024-04-01', completed: false, createdAt: '2024-01-30' },
    ],
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    title: 'Marketing Campaign',
    description: 'Q1 digital marketing campaign',
    tasks: [
      { id: '1', title: 'Strategy planning', description: 'Define campaign goals and KPIs', dueDate: '2024-01-20', completed: true, createdAt: '2024-01-10' },
      { id: '2', title: 'Content creation', description: 'Create marketing materials', dueDate: '2024-02-05', completed: true, createdAt: '2024-01-12' },
    ],
    createdAt: '2024-01-10',
  },
];

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const addProject = (title: string, description: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      title,
      description,
      tasks: [],
      createdAt: new Date().toISOString(),
    };
    setProjects(prev => [...prev, newProject]);
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const getProject = (id: string) => {
    return projects.find(p => p.id === id);
  };

  const addTask = (projectId: string, title: string, description: string, dueDate: string) => {
    setProjects(prev =>
      prev.map(project => {
        if (project.id === projectId) {
          const newTask: Task = {
            id: Date.now().toString(),
            title,
            description,
            dueDate,
            completed: false,
            createdAt: new Date().toISOString(),
          };
          return { ...project, tasks: [...project.tasks, newTask] };
        }
        return project;
      })
    );
  };

  const toggleTask = (projectId: string, taskId: string) => {
    setProjects(prev =>
      prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            ),
          };
        }
        return project;
      })
    );
  };

  const deleteTask = (projectId: string, taskId: string) => {
    setProjects(prev =>
      prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.filter(task => task.id !== taskId),
          };
        }
        return project;
      })
    );
  };

  const getProjectProgress = (projectId: string) => {
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
    addProject,
    deleteProject,
    getProject,
    addTask,
    toggleTask,
    deleteTask,
    getProjectProgress,
    getTotalStats,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};
