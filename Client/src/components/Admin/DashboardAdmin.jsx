import React from "react";
import { Navigate } from "react-router-dom";
import { Rocket, Users, FileText, Calendar, Settings, BarChart3, Building2 } from "lucide-react";

/**
 * 🏗️ DASHBOARD ADMIN - BETCOM AI
 * Simple page de bienvenue
 * Design: Noir, blanc, gris
 */

const DashboardAdmin = () => {
  const token = localStorage.getItem("access");

  if (!token) return <Navigate to="/login" replace />;

  const adminTools = [
    { 
      title: "Missions", 
      description: "Gérer À propos", 
      icon: Users,
      link: "/missionPost",
      color: "blue"
    },
    { 
      title: "Services", 
      description: "Gérer les expertises", 
      icon: Settings,
      link: "/servicePost",
      color: "purple"
    },
    { 
      title: "Portfolio", 
      description: "Gérer les projets", 
      icon: FileText,
      link: "/portfolioPost",
      color: "green"
    },
    { 
      title: "Équipe", 
      description: "Gérer les membres", 
      icon: Users,
      link: "/teamPost",
      color: "orange"
    },
    { 
      title: "Actualités", 
      description: "Gérer les news", 
      icon: Calendar,
      link: "/newsPost",
      color: "red"
    },
    { 
      title: "Partenaires", 
      description: "Gérer les partenaires", 
      icon: BarChart3,
      link: "/partnerPost",
      color: "teal"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-20">
        
        {/* Hero Section */}
        <div className="text-center mb-20 pt-20">
          {/* Icon */}
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 bg-black rounded-2xl flex items-center justify-center">
              <Rocket className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-[60px] md:text-[100px] lg:text-[140px] font-bold leading-none tracking-tight text-black mb-6" style={{ fontFamily: "'Creato Display', sans-serif" }}>
            Bienvenue
          </h1>

          {/* Subtitle */}
          <p className="text-2xl md:text-3xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Dashboard Admin BETCOM AI
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="w-16 h-px bg-gray-300"></div>
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <div className="w-16 h-px bg-gray-300"></div>
          </div>

          {/* Description */}
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mt-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Architecture, Ingénierie & Innovation
          </p>
        </div>

        {/* Admin Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {adminTools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <a
                key={idx}
                href={tool.link}
                className="group bg-white border-2 border-gray-200 hover:border-black rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gray-100 group-hover:bg-black rounded-xl flex items-center justify-center mb-4 transition-all duration-300">
                    <Icon className="w-8 h-8 text-gray-600 group-hover:text-white transition-all duration-300" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-black mb-2 group-hover:text-black transition-colors" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                    {tool.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {tool.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-20 pt-12 border-t border-gray-200">
          <p className="text-sm text-gray-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
            © 2026 BETCOM AI. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;