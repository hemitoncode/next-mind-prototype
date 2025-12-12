import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import { Helmet } from "react-helmet";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>NextMind Incubator | AI & Politics Learning Platform</title>
        <meta 
          name="description" 
          content="Master ethical AI use in political contexts. Learn to detect AI-generated content, evaluate political information, and become an informed digital citizen."
        />
      </Helmet>
      
      <div className="flex h-screen flex-col bg-background">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <Dashboard />
        </div>
      </div>
    </>
  );
};

export default Index;
