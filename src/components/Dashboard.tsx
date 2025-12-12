import HeroSection from "./HeroSection";
import ModuleCard from "./ModuleCard";
import { TrendingUp, Target, Flame } from "lucide-react";

const modules = [
  {
    title: "Understanding AI in Modern Politics",
    description: "Introduction to how AI shapes political discourse, campaigns, and public opinion.",
    duration: "2h 30min",
    students: 2847,
    progress: 75,
    colorAccent: "hsl(0, 72%, 51%)",
  },
  {
    title: "Detecting AI-Generated Content",
    description: "Learn to identify deepfakes, AI-written text, and synthetic media in political contexts.",
    duration: "3h 15min",
    students: 3124,
    progress: 45,
    colorAccent: "hsl(350, 80%, 45%)",
  },
  {
    title: "Critical Evaluation Framework",
    description: "Build a systematic approach to evaluating political information for AI manipulation.",
    duration: "2h 45min",
    students: 1893,
    progress: 0,
    colorAccent: "hsl(10, 75%, 50%)",
  },
  {
    title: "AI and Electoral Integrity",
    description: "Explore how AI can both threaten and protect democratic electoral processes.",
    duration: "3h 00min",
    students: 2156,
    isCompleted: true,
    colorAccent: "hsl(0, 60%, 55%)",
  },
  {
    title: "Social Media & AI Algorithms",
    description: "Understand how recommendation algorithms shape political views and polarization.",
    duration: "2h 15min",
    students: 4521,
    progress: 20,
    colorAccent: "hsl(355, 70%, 48%)",
  },
  {
    title: "Ethical AI Advocacy",
    description: "Learn to advocate for responsible AI policies in your community and government.",
    duration: "2h 00min",
    students: 1234,
    isLocked: true,
    colorAccent: "hsl(5, 65%, 52%)",
  },
];

const stats = [
  { icon: Flame, label: "Day Streak", value: "12", color: "text-orange-500" },
  { icon: Target, label: "Completed", value: "4", color: "text-primary" },
  { icon: TrendingUp, label: "This Week", value: "8h", color: "text-emerald-500" },
];

const Dashboard = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Hero */}
        <HeroSection />

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card"
            >
              <div className={cn("rounded-lg bg-muted p-2", stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modules section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">Your Modules</h2>
              <p className="text-sm text-muted-foreground">
                Continue your journey in AI literacy
              </p>
            </div>
            <button className="text-sm font-medium text-primary hover:underline">
              View all
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module, index) => (
              <ModuleCard key={module.title} {...module} index={index} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Helper for cn in this file
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default Dashboard;
