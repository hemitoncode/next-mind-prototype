import { Clock, Users, CheckCircle2, Lock, ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

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

  // -------------------------------
  // CORE JOURNAL SYSTEM (MESSY, INLINE, SPAGHETTI)
  // -------------------------------
  const storageKey = `core-journal-${id}`;
  const [coreOpen, setCoreOpen] = useState(false);
  const [journal, setJournal] = useState({
    context: "",
    objectiveOutput: "",
    reflection: "",
    evaluation: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setJournal(JSON.parse(saved));
  }, [id]);

  const updateJournal = (obj: any) => {
    const newData = { ...journal, ...obj };
    setJournal(newData);
    localStorage.setItem(storageKey, JSON.stringify(newData));
  };

  const runObjective = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/core-objective", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: journal.context }),
      });
      const data = await res.json();
      updateJournal({ objectiveOutput: data.output || "No output from server." });
    } catch (err) {
      updateJournal({ objectiveOutput: "Error contacting AI endpoint." });
    }
    setLoading(false);
  };

  // -------------------------------

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

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
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

      {/* CORE PANEL BUTTON */}
      <button
        onClick={() => setCoreOpen(!coreOpen)}
        className="flex items-center gap-2 w-full rounded-md border px-3 py-2 text-sm mb-3"
      >
        CORE Framework Tools
        <ChevronDown className={cn("h-4 w-4 transition-transform", coreOpen && "rotate-180")} />
      </button>

      {/* CORE PANEL CONTENT */}
      {coreOpen && (
        <div className="border rounded-md p-4 space-y-5 bg-background text-sm">

          {/* CONTEXT */}
          <div>
            <label className="font-semibold">C — Context</label>
            <textarea
              className="w-full mt-1 rounded-md border bg-card p-2"
              rows={3}
              value={journal.context}
              onChange={(e) => updateJournal({ context: e.target.value })}
            />
          </div>

          {/* OBJECTIVE */}
          <div>
            <button
              onClick={runObjective}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground text-xs"
            >
              {loading ? "Thinking..." : "Get Objective Information"}
            </button>

            {journal.objectiveOutput && (
              <div className="mt-2 rounded-md bg-muted p-2">
                <strong>O — Objective Output</strong>
                <p className="mt-1 whitespace-pre-wrap">{journal.objectiveOutput}</p>
              </div>
            )}
          </div>

          {/* REFLECT */}
          <div>
            <label className="font-semibold">R — Reflect</label>
            <textarea
              className="w-full mt-1 rounded-md border bg-card p-2"
              rows={3}
              value={journal.reflection}
              onChange={(e) => updateJournal({ reflection: e.target.value })}
            />
          </div>

          {/* EVALUATE */}
          <div>
            <label className="font-semibold">E — Evaluate</label>
            <textarea
              className="w-full mt-1 rounded-md border bg-card p-2"
              rows={3}
              value={journal.evaluation}
              onChange={(e) => updateJournal({ evaluation: e.target.value })}
            />
          </div>

        </div>
      )}

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
