import { Clock, Users, CheckCircle2, Lock, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  participants: number;
  difficulty: string;
  progress?: number;
  status: string;
  colorAccent: string;
  tags: string[];
  index: number;
}

const ProjectCard = ({
  id,
  title,
  description,
  category,
  duration,
  participants,
  difficulty,
  progress = 0,
  status,
  colorAccent,
  tags,
  index,
}: ProjectCardProps) => {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const isInProgress = status === "in-progress";

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
        className="absolute left-0 top-0 h-1.5 w-full"
        style={{ background: colorAccent }}
      />

      {/* Status badge */}
      <div className="absolute right-4 top-4">
        {isCompleted && (
          <div className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </div>
        )}
        
        {isLocked && (
          <div className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <Lock className="h-3 w-3" />
            Locked
          </div>
        )}

        {isInProgress && (
          <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3 w-3" />
            In Progress
          </div>
        )}
      </div>

      {/* Category tag */}
      <div className="mb-3 pt-2">
        <span className="inline-block rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-primary">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="mb-2 font-semibold text-foreground text-lg line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {tags.slice(0, 3).map((tag) => (
          <span 
            key={tag}
            className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
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
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {duration}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {participants.toLocaleString()}
          </div>
        </div>
        <span className={cn(
          "rounded-full px-2 py-0.5 text-xs font-medium",
          difficulty === "Beginner" && "bg-green-100 text-green-700",
          difficulty === "Intermediate" && "bg-yellow-100 text-yellow-700",
          difficulty === "Advanced" && "bg-red-100 text-red-700"
        )}>
          {difficulty}
        </span>
      </div>

      {/* Hover action */}
      {!isLocked && (
        <Link 
          to={`/project/${id}`}
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-foreground/5 opacity-0 transition-opacity duration-200",
            "group-hover:opacity-100"
          )}
        >
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-button transition-transform hover:scale-105">
            <ArrowRight className="h-4 w-4" />
            {progress > 0 ? "Continue Project" : "Start Project"}
          </button>
        </Link>
      )}
    </div>
  );
};

export default ProjectCard;
