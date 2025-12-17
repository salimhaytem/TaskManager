import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  showLabel = true, 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const getColorClass = () => {
    if (value === 100) return 'bg-success';
    if (value >= 75) return 'bg-primary';
    if (value >= 50) return 'bg-warning';
    return 'bg-muted-foreground';
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-muted-foreground">Progress</span>
          <span className="text-xs font-semibold text-foreground">{value}%</span>
        </div>
      )}
      <Progress 
        value={value} 
        className={`${sizeClasses[size]} bg-secondary`}
        indicatorClassName={getColorClass()}
      />
    </div>
  );
};

export default ProgressBar;
