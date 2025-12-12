import HeroSection from "./HeroSection";
import ProjectCard from "./ProjectCard";
import { TrendingUp, Target, Flame, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import projectsData from "@/data/projects.json";

const stats = [
  { icon: Flame, label: "Day Streak", value: "12", color: "text-orange-500" },
  { icon: Target, label: "Completed", value: "1", color: "text-primary" },
  { icon: FolderOpen, label: "In Progress", value: "2", color: "text-blue-500" },
  { icon: TrendingUp, label: "This Week", value: "8h", color: "text-emerald-500" },
];

const Dashboard = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Hero */}
        <HeroSection />

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Projects section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">Your Projects</h2>
              <p className="text-sm text-muted-foreground">
                Hands-on projects to shape youth advocacy and political engagement
              </p>
            </div>
            <button className="text-sm font-medium text-primary hover:underline">
              View all
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projectsData.projects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                {...project} 
                index={index} 
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
