import { Rocket, ArrowRight, Sparkles, Users, FolderKanban, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl gradient-hero p-8 lg:p-12">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary-foreground blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-primary-foreground blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="max-w-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/20 px-3 py-1 text-sm text-primary-foreground">
            <Sparkles className="h-4 w-4" />
            <span>New project available</span>
          </div>
          
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground lg:text-4xl">
            Shape the Future of Youth Politics
          </h2>
          
          <p className="mb-6 text-primary-foreground/80 text-lg">
            Complete hands-on projects that teach you to use AI ethically for advocacy, 
            social media campaigns, and political engagement.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg">
              <Rocket className="h-5 w-5" />
              Start a Project
            </Button>
            <Button variant="heroOutline" size="lg">
              Explore All Projects
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl bg-primary-foreground/10 blur-xl" />
            <div className="relative rounded-xl bg-primary-foreground/20 p-6 backdrop-blur">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/30">
                    <FolderKanban className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary-foreground">6 Projects</p>
                    <p className="text-sm text-primary-foreground/70">Real-world impact</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/30">
                    <Users className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary-foreground">10K+ Youth</p>
                    <p className="text-sm text-primary-foreground/70">Already participating</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/30">
                    <Award className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary-foreground">Certificates</p>
                    <p className="text-sm text-primary-foreground/70">Upon completion</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
