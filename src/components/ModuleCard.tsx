import { Clock, Users, CheckCircle2, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  title: string;
  description: string;
  duration: string;
  students: number;
  progress?: number;
  isLocked?: boolean;
  isCompleted?: boolean;
  colorAccent: string;
  index: number;
}

const ModuleCard = ({
  title,
  description,
  duration,
  students,
  progress = 0,
  isLocked = false,
  isCompleted = false,
  colorAccent,
  index,
}: ModuleCardProps) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1",
        "animate-fade-in",
        isLocked && "opacity-60"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Color accent bar */}
      <div 
        className="absolute left-0 top-0 h-1 w-full"
        style={{ background: colorAccent }}
      />

      {/* Status badge */}
      {isCompleted && (
        <div className="absolute right-4 top-4">
          <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </div>
        </div>
      )}
      
      {isLocked && (
        <div className="absolute right-4 top-4">
          <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            <Lock className="h-3 w-3" />
            Locked
          </div>
        </div>
      )}

      {/* Content */}
      <div className="mb-4 pt-2">
        <h3 className="mb-2 font-semibold text-foreground text-lg line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>

      {/* Progress bar */}
      {progress > 0 && !isCompleted && (
        <div className="mb-4">
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Meta info */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {duration}
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {students.toLocaleString()} enrolled
        </div>
      </div>

      {/* Hover action */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center bg-foreground/5 opacity-0 transition-opacity duration-200",
        !isLocked && "group-hover:opacity-100"
      )}>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-button transition-transform hover:scale-105">
          <Play className="h-4 w-4" />
          {progress > 0 ? "Continue" : "Start"}
        </button>
      </div>
    </div>
  );
};

export default ModuleCard;
