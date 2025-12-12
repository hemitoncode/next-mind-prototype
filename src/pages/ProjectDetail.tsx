import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  CheckCircle2, 
  Play, 
  Sparkles,
  MessageSquare,
  Send,
  Bot,
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
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<{role: string; content: string}[]>([
    { role: "assistant", content: "Hi! I'm your AI project assistant. I'm here to help you through this project. Ask me anything about the lesson content, get feedback on your ideas, or request suggestions!" }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

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

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || isAiLoading) return;

    const userMessage = aiInput.trim();
    setAiInput("");
    setAiMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsAiLoading(true);

    // Simulate AI response (in production, this would call an actual AI API)
    setTimeout(() => {
      const responses = [
        `Great question about "${project.lessons[activeLesson].title}"! Here's what I think: The key to success in this lesson is to focus on practical application. Try breaking down the concept into smaller, actionable steps.`,
        `That's a thoughtful approach! For this project on ${project.category}, remember that authenticity is crucial. Let me suggest some ways to strengthen your work...`,
        `Excellent thinking! Here are some additional resources and tips that might help you with this aspect of the project. Consider how your work can create real impact in your community.`,
        `I love that you're thinking critically about this! In the context of ${project.title}, here are some perspectives to consider that will help you develop a more nuanced understanding.`
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      setAiMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsAiLoading(false);
    }, 1500);
  };

  const currentLesson = project.lessons[activeLesson];

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

                {/* Lesson Navigation */}
                <div className="flex items-center justify-between">
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

              {/* AI Assistant */}
              <section className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
                <div className="flex items-center gap-3 border-b border-border bg-gradient-to-r from-primary/10 to-transparent p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">AI Project Assistant</h3>
                    <p className="text-xs text-muted-foreground">Ask questions, get feedback, explore ideas</p>
                  </div>
                  <Sparkles className="ml-auto h-5 w-5 text-primary animate-pulse" />
                </div>

                {/* Chat Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {aiMessages.map((message, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "flex gap-3",
                        message.role === "user" && "flex-row-reverse"
                      )}
                    >
                      <div className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        message.role === "assistant" ? "bg-primary" : "bg-muted"
                      )}>
                        {message.role === "assistant" ? (
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className={cn(
                        "max-w-[80%] rounded-lg px-4 py-2.5",
                        message.role === "assistant" 
                          ? "bg-muted text-foreground" 
                          : "bg-primary text-primary-foreground"
                      )}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isAiLoading && (
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="rounded-lg bg-muted px-4 py-2.5">
                        <div className="flex gap-1">
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleAiSubmit} className="border-t border-border p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="Ask about this lesson or project..."
                      className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button type="submit" disabled={isAiLoading || !aiInput.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
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
