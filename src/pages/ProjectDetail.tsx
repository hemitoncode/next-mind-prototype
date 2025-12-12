import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  CheckCircle2, 
  Play, 
  Sparkles,
  Target,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import projectsData from "@/data/projects.json";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const project = projectsData.projects.find(p => p.id === projectId);
  
  const [activeLesson, setActiveLesson] = useState(0);
  // CORE state is per-lesson and persisted to localStorage
  const [coreState, setCoreState] = useState({
    context: "",
    objective: "",
    reflection: "",
    evaluation: "",
    lastSavedAt: "" as string | Date,
  });
  const [isObjectiveLoading, setIsObjectiveLoading] = useState(false);
  const [objectiveError, setObjectiveError] = useState<string | null>(null);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Project Not Found</h1>
          <Link to="/" className="text-primary hover:underline">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  const currentLesson = project.lessons[activeLesson];

  // Helpers for localStorage keys (per project & per lesson)
  const storageKey = (projId: string, lessonId: string) => `core:${projId}:${lessonId}`;

  // Load core state for active lesson
  useEffect(() => {
    const key = storageKey(project.id, currentLesson.id);
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setCoreState({ 
          context: parsed.context || "",
          objective: parsed.objective || "",
          reflection: parsed.reflection || "",
          evaluation: parsed.evaluation || "",
          lastSavedAt: parsed.lastSavedAt || "",
        });
      } catch {
        setCoreState({
          context: "",
          objective: "",
          reflection: "",
          evaluation: "",
          lastSavedAt: "",
        });
      }
    } else {
      // blank slate for new lesson
      setCoreState({
        context: "",
        objective: "",
        reflection: "",
        evaluation: "",
        lastSavedAt: "",
      });
    }
    // reset objective error when switching lessons
    setObjectiveError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, activeLesson]);

  // Auto-save whenever coreState changes (simple, immediate)
  useEffect(() => {
    const key = storageKey(project.id, currentLesson.id);
    const payload = { ...coreState, lastSavedAt: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(payload));
    // update lastSavedAt in state quickly
    setCoreState(prev => ({ ...prev, lastSavedAt: payload.lastSavedAt }));
  // we intentionally want to run when coreState changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coreState.context, coreState.objective, coreState.reflection, coreState.evaluation]);

  const updateCore = (patch: Partial<typeof coreState>) => {
    setCoreState(prev => ({ ...prev, ...patch }));
  };

  // Run Objective: contact your API (backend should enforce "objective only")
  const runObjective = async () => {
    if (!coreState.context.trim()) {
      updateCore({ objective: "Write some context first — what do you want objective info about?" });
      return;
    }
  
    setIsObjectiveLoading(true);
    setObjectiveError(null);
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "system",
              content: `You are an AI that produces ONLY objective, non-interpretive, non-personal factual summaries.
  
  Rules:
  - No opinions
  - No advice
  - No reflection
  - No evaluation
  - No next steps
  - No embellishment
  - No emotional tone
  - Do NOT reference the user
  - Do NOT speak in first person
  - Keep it concise, factual, and neutral
  - Focus *strictly* on the context provided
  
  Output must be plain text only.`
            },
            {
              role: "user",
              content: coreState.context
            }
          ],
          temperature: 0,
          max_tokens: 400
        })
      });
  
      if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
  
      const data = await response.json();
      const output = data?.choices?.[0]?.message?.content || "No objective output returned from API.";
      updateCore({ objective: output });
    } catch (err) {
      const fallback = generateFallbackObjective(coreState.context, project, currentLesson);
      updateCore({ objective: fallback });
      setObjectiveError("Failed to reach OpenAI API — using local fallback.");
    } finally {
      setIsObjectiveLoading(false);
    }
  };


  // Small playful fallback generator (keeps things niche & useful)
  const generateFallbackObjective = (context: string, proj: any, lesson: any) => {
    // aim for concise, bullet-like objective info
    const bullets = [
      `Focus: ${lesson.title} — key practical takeaway: break tasks into small, testable steps.`,
      `Scope: Apply this within the project's category (${proj.category}).`,
      `Constraint: Keep interventions ethical, documented, and reversible.`,
      `Measurement: Use simple metrics (e.g., "time spent", "iterations", "user feedback").`,
    ];
    return `Objective notes (local fallback):\n\n${bullets.join("\n")}\n\nContext you provided:\n${context.slice(0, 300)}${context.length > 300 ? "…" : ""}`;
  };

  // Reset CORE for this lesson
  const resetCoreForLesson = () => {
    const key = storageKey(project.id, currentLesson.id);
    localStorage.removeItem(key);
    setCoreState({
      context: "",
      objective: "",
      reflection: "",
      evaluation: "",
      lastSavedAt: "",
    });
    setObjectiveError(null);
  };

  return (
    <>
      <Helmet>
        <title>{project.title} | NextMind Incubator</title>
        <meta name="description" content={project.description} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero">
                <span className="text-lg font-bold text-primary-foreground">N</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-foreground">NextMind</h1>
                <p className="text-xs text-muted-foreground -mt-0.5">Incubator</p>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
          {/* Project Hero */}
          <div className="mb-8 rounded-2xl gradient-hero p-8 lg:p-12">
            <div className="max-w-3xl">
              <span className="mb-4 inline-block rounded-full bg-primary-foreground/20 px-3 py-1 text-sm text-primary-foreground">
                {project.category}
              </span>
              <h1 className="mb-4 text-3xl font-bold text-primary-foreground lg:text-4xl">
                {project.title}
              </h1>
              <p className="mb-6 text-lg text-primary-foreground/80">
                {project.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-primary-foreground/80">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {project.duration}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {project.participants.toLocaleString()} participants
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {project.difficulty}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Current Lesson */}
              <section className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Lesson {activeLesson + 1} of {project.lessons.length}</p>
                      <h2 className="font-semibold text-foreground">{currentLesson.title}</h2>
                    </div>
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
                    {currentLesson.duration}
                  </span>
                </div>

                <p className="mb-6 text-muted-foreground">
                  {currentLesson.description}
                </p>

                {/* Lesson Type Badge */}
                <div className="mb-6 flex items-center gap-2">
                  <span className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium",
                    currentLesson.type === "ai-assisted" && "bg-purple-100 text-purple-700",
                    currentLesson.type === "interactive" && "bg-blue-100 text-blue-700",
                    currentLesson.type === "practical" && "bg-green-100 text-green-700",
                    currentLesson.type === "research" && "bg-yellow-100 text-yellow-700",
                    currentLesson.type === "analysis" && "bg-orange-100 text-orange-700"
                  )}>
                    {currentLesson.type === "ai-assisted" && "🤖 AI-Assisted"}
                    {currentLesson.type === "interactive" && "💡 Interactive"}
                    {currentLesson.type === "practical" && "🛠️ Practical"}
                    {currentLesson.type === "research" && "🔍 Research"}
                    {currentLesson.type === "analysis" && "📊 Analysis"}
                  </span>
                </div>

                {/* Interactive Content Placeholder */}
                <div className="mb-6 rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 text-center">
                  <Play className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-semibold text-foreground">Interactive Lesson Content</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This is where the lesson's interactive content, videos, quizzes, and activities would appear.
                  </p>
                  <Button variant="default">
                    <Play className="h-4 w-4 mr-2" />
                    Start Lesson
                  </Button>
                </div>

                {/* CORE Framework — inserted BELOW each lesson */}
                <div className="mt-6 rounded-xl border border-border bg-card p-4 shadow-inner">
                  <div className="mb-3 flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <h3 className="font-semibold text-foreground">CORE — Reflective Lab</h3>
                    <span className="ml-auto text-xs text-muted-foreground">Prototype • autosaves locally</span>
                  </div>

                  {/* Mini intro */}
                  <p className="text-xs text-muted-foreground mb-4">
                    Use the CORE loop to interrogate what you learned: <strong>C</strong>ontext → <strong>O</strong>bjective → <strong>R</strong>eflect → <strong>E</strong>valuate. Make it quick, honest, and a little playful.
                  </p>

                  {/* C — Context */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">C — Context</label>
                      <span className="text-xs text-muted-foreground">What do you want the AI to focus on?</span>
                    </div>
                    <textarea
                      className="w-full mt-2 rounded-md border bg-background p-3 text-sm"
                      rows={3}
                      placeholder=""
                      value={coreState.context}
                      onChange={(e) => updateCore({ context: e.target.value })}
                    />
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => updateCore({ context: "" })}>Clear</Button>
                      <div className="text-xs text-muted-foreground ml-auto">
                        Saved: {coreState.lastSavedAt ? new Date(coreState.lastSavedAt).toLocaleString() : "—"}
                      </div>
                    </div>
                  </div>

                  {/* O — Objective */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">O — Objective</label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Objective-only facts</span>
                        <Button size="sm" onClick={runObjective} disabled={isObjectiveLoading}>
                          {isObjectiveLoading ? "Fetching…" : "Get Objective"}
                        </Button>
                      </div>
                    </div>

                    <div className="mt-2 rounded-md border bg-muted p-3 text-sm whitespace-pre-wrap">
                      {coreState.objective ? (
                        <>
                          <div className="mb-2 text-xs text-muted-foreground">Objective output (auto-saved)</div>
                          <div>{coreState.objective}</div>
                        </>
                      ) : (
                        <div className="text-xs text-muted-foreground">No objective output yet. Click "Get Objective" to fetch objective facts based on your context. (API fallback available.)</div>
                      )}
                    </div>
                    {objectiveError && <div className="mt-2 text-xs text-red-500">{objectiveError}</div>}
                  </div>

                  {/* R — Reflect */}
                  <div className="mb-4">
                    <label className="text-sm font-medium">R — Reflect</label>
                    <textarea
                      className="w-full mt-2 rounded-md border bg-background p-3 text-sm"
                      rows={3}
                      placeholder="What changed in your understanding? What surprised you?"
                      value={coreState.reflection}
                      onChange={(e) => updateCore({ reflection: e.target.value })}
                    />
                  </div>

                  {/* E — Evaluate */}
                  <div className="mb-4">
                    <label className="text-sm font-medium">E — Evaluate</label>
                    <textarea
                      className="w-full mt-2 rounded-md border bg-background p-3 text-sm"
                      rows={3}
                      placeholder="Is this info useful, accurate, biased? Next steps?"
                      value={coreState.evaluation}
                      onChange={(e) => updateCore({ evaluation: e.target.value })}
                    />
                  </div>

                  {/* Small playful footer actions */}
                  <div className="mt-3 flex items-center gap-3">
                    <Button size="sm" variant="outline" onClick={() => {
                      // quick copy summary to clipboard
                      const summary = `CORE — ${project.title} / ${currentLesson.title}\n\nContext:\n${coreState.context}\n\nObjective:\n${coreState.objective}\n\nReflection:\n${coreState.reflection}\n\nEvaluation:\n${coreState.evaluation}`;
                      navigator.clipboard?.writeText(summary);
                      // tiny visual feedback — naive alert (prototype)
                      alert("CORE summary copied to clipboard ✨");
                    }}>
                      Copy CORE Summary
                    </Button>

                    <Button size="sm" variant="ghost" onClick={() => resetCoreForLesson()}>
                      Reset CORE (this lesson)
                    </Button>

                    <div className="ml-auto text-xs text-muted-foreground">
                      Tip: Re-run Objective after editing context to refine outputs.
                    </div>
                  </div>
                </div>

                {/* Lesson Navigation */}
                <div className="mt-6 flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    disabled={activeLesson === 0}
                    onClick={() => setActiveLesson(prev => prev - 1)}
                  >
                    Previous Lesson
                  </Button>
                  <Button 
                    disabled={activeLesson === project.lessons.length - 1}
                    onClick={() => setActiveLesson(prev => prev + 1)}
                  >
                    Next Lesson
                  </Button>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h3 className="mb-4 font-semibold text-foreground">Your Progress</h3>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Overall</span>
                  <span className="font-medium text-foreground">{project.progress}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Lessons List */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h3 className="mb-4 font-semibold text-foreground">Project Lessons</h3>
                <div className="space-y-2">
                  {project.lessons.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(index)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors",
                        activeLesson === index 
                          ? "bg-secondary text-primary" 
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <div className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                        activeLesson === index 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{lesson.title}</p>
                        <p className="text-xs opacity-70">{lesson.duration}</p>
                      </div>
                      {index < activeLesson && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Features */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">AI Features</h3>
                </div>
                <ul className="space-y-2">
                  {project.aiFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outcomes */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Project Outcomes</h3>
                </div>
                <ul className="space-y-2">
                  {project.outcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetail;
