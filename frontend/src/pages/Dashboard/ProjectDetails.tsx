import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Calendar,
  CheckCircle2,
  ListTodo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import ProgressBar from '@/components/ProgressBar';
import TaskItem from '@/components/TaskItem';
import { useProjects } from '@/contexts/ProjectContext';
import { useToast } from '@/hooks/use-toast';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProject, getProjectProgress, addTask, toggleTask, deleteTask, deleteProject } = useProjects();
  const { toast } = useToast();

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');

  const projectId = id ? parseInt(id, 10) : null;
  const project = projectId ? getProject(projectId) : undefined;
  const progress = projectId ? getProjectProgress(projectId) : { total: 0, completed: 0, percentage: 0 };

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-xl font-semibold text-foreground mb-2">Project not found</h2>
        <p className="text-muted-foreground mb-4">This project doesn't exist or has been deleted.</p>
        <Button onClick={() => navigate('/dashboard/projects')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskTitle.trim()) {
      toast({
        variant: 'destructive',
        title: 'Title required',
        description: 'Please enter a task title.',
      });
      return;
    }

    if (!taskDueDate) {
      toast({
        variant: 'destructive',
        title: 'Due date required',
        description: 'Please select a due date.',
      });
      return;
    }

    if (project) {
      addTask(project.id, taskTitle.trim(), taskDescription.trim(), taskDueDate)
        .then(() => {
          toast({
            title: 'Task added!',
            description: 'Your new task has been created.',
          });
          setTaskTitle('');
          setTaskDescription('');
          setTaskDueDate('');
          setIsTaskDialogOpen(false);
        })
        .catch((error) => {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: error.message || 'Failed to create task',
          });
        });
    }
  };

  const handleDeleteProject = () => {
    if (project) {
      deleteProject(project.id)
        .then(() => {
          toast({
            title: 'Project deleted',
            description: 'The project has been permanently deleted.',
          });
          navigate('/dashboard/projects');
        })
        .catch((error) => {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: error.message || 'Failed to delete project',
          });
        });
    }
  };

  const completedTasks = project.tasks.filter(t => t.completed);
  const pendingTasks = project.tasks.filter(t => !t.completed);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard/projects')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{project.title}</h1>
            <p className="text-muted-foreground mt-1">
              {project.description || 'No description provided'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Add a new task to this project.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTask} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="taskTitle">Title *</Label>
                  <Input
                    id="taskTitle"
                    placeholder="e.g., Design mockups"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taskDescription">Description</Label>
                  <Textarea
                    id="taskDescription"
                    placeholder="Task details..."
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taskDueDate">Due Date *</Label>
                  <Input
                    id="taskDueDate"
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsTaskDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Create Task
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{project.title}" and all its tasks. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleDeleteProject}
                >
                  Delete Project
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Progress Card */}
      <Card className="border-border/50 shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ListTodo className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{progress.total}</p>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{progress.completed}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Calendar className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{progress.total - progress.completed}</p>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                </div>
              </div>
            </div>
            <div className="md:w-64">
              <ProgressBar value={progress.percentage} size="lg" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <Card className="border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-2 h-2 rounded-full bg-warning" />
              Pending Tasks ({pendingTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTasks.length > 0 ? (
              pendingTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(project.id, task.id)}
                  onDelete={() => {
                    deleteTask(project.id, task.id);
                    toast({ title: 'Task deleted' });
                  }}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No pending tasks. Great job! 🎉
              </p>
            )}
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        <Card className="border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-2 h-2 rounded-full bg-success" />
              Completed Tasks ({completedTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedTasks.length > 0 ? (
              completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(project.id, task.id)}
                  onDelete={() => {
                    deleteTask(project.id, task.id);
                    toast({ title: 'Task deleted' });
                  }}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No completed tasks yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetails;
