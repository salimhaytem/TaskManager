import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, Calendar, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProgressBar from '@/components/ProgressBar';
import { useProjects, Project } from '@/contexts/ProjectContext';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  const { getProjectProgress } = useProjects();
  const progress = getProjectProgress(project.id);

  const handleClick = () => {
    navigate(`/dashboard/projects/${project.id}`);
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-card hover:shadow-card-hover border-border/50 bg-card animate-scale-in"
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent group-hover:bg-primary/10 transition-colors">
              <Folder className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                {project.title}
              </CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description || 'No description provided'}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{progress.completed}/{progress.total} tasks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <ProgressBar value={progress.percentage} size="sm" />
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
