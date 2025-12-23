import React from 'react';
import { Trash2, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Task } from '@/contexts/ProjectContext';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const isOverdue = !task.completed && new Date(task.dueDate) < new Date();

  return (
    <div 
      className={cn(
        "group flex items-start gap-4 p-4 rounded-lg border transition-all duration-200 animate-fade-in",
        task.completed 
          ? "bg-success/5 border-success/20" 
          : isOverdue 
            ? "bg-destructive/5 border-destructive/20"
            : "bg-card border-border hover:border-primary/30 hover:shadow-sm"
      )}
    >
      <button
        onClick={onToggle}
        className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110 p-1"
        aria-label={task.completed ? 'Marquer non fait' : 'Marquer comme fait'}
        title={task.completed ? 'Marquer non fait' : 'Marquer comme fait'}
      >
        {task.completed ? (
          <CheckCircle2 className="h-5 w-5 text-success" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <h4 
          className={cn(
            "font-medium text-foreground transition-all",
            task.completed && "line-through text-muted-foreground"
          )}
        >
          {task.title}
        </h4>
        {task.description && (
          <p className={cn(
            "text-sm mt-1",
            task.completed ? "text-muted-foreground/60" : "text-muted-foreground"
          )}>
            {task.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <Calendar className={cn(
            "h-3.5 w-3.5",
            isOverdue && !task.completed ? "text-destructive" : "text-muted-foreground"
          )} />
          <span className={cn(
            "text-xs",
            isOverdue && !task.completed ? "text-destructive font-medium" : "text-muted-foreground"
          )}>
            {isOverdue && !task.completed ? 'Overdue: ' : 'Due: '}
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Button
        variant="default"
        size="sm"
        className="ml-2"
        onClick={onToggle}
      >
        {task.completed ? 'Mark as Undone' : 'Mark as Done'}
      </Button>
    </div>
  );
};

export default TaskItem;
