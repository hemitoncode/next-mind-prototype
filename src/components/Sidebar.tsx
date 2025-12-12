import { 
  Home, 
  BookOpen, 
  Trophy, 
  Settings, 
  HelpCircle,
  GraduationCap,
  BarChart3,
  Users,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: BookOpen, label: "My Modules", active: false },
  { icon: GraduationCap, label: "Learning Paths", active: false },
  { icon: BarChart3, label: "Progress", active: false },
  { icon: Trophy, label: "Achievements", active: false },
  { icon: Users, label: "Community", active: false },
];

const bottomItems = [
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Help Center" },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-border bg-card transition-transform duration-300 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile close button */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero">
              <span className="text-lg font-bold text-primary-foreground">N</span>
            </div>
            <span className="font-bold text-foreground">NextMind</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Logo for desktop */}
        <div className="hidden h-16 items-center gap-2 border-b border-border px-4 lg:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero">
            <span className="text-lg font-bold text-primary-foreground">N</span>
          </div>
          <div>
            <h1 className="font-bold text-foreground">NextMind</h1>
            <p className="text-xs text-muted-foreground -mt-0.5">Incubator</p>
          </div>
        </div>

        {/* Menu items */}
        <nav className="flex-1 space-y-1 p-3">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                item.active
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom items */}
        <div className="border-t border-border p-3 space-y-1">
          {bottomItems.map((item) => (
            <button
              key={item.label}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
