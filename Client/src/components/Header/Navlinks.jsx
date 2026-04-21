import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X, Search } from "lucide-react";

const Navlinks = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const currentLanguage = i18n.language.toUpperCase().substring(0, 2);
  
  // Pages avec menu BLANC (logo + hamburger blancs)
  const whiteMenuPages = ["/", "/home"];
  
  // Détection portfolio (toutes les sous-pages)
  const isPortfolioPage = location.pathname.startsWith('/portfolio');
  
  // Menu BLANC uniquement pour home et portfolio
  const isWhiteMenu = whiteMenuPages.includes(location.pathname) || isPortfolioPage;
  
  // Couleurs conditionnelles
  const textColor = isWhiteMenu ? "text-white" : "text-black";
  const hamburgerBg = isWhiteMenu ? "bg-white" : "bg-black";

  useEffect(() => {
    const handleScroll = () => {
      // Récupère le scroll de #root (pas window !)
      const rootElement = document.getElementById('root');
      const currentScrollY = rootElement ? rootElement.scrollTop : 0;
      
      // Seulement visible quand on est EN HAUT (0-10px)
      if (currentScrollY < 10) {
        setHeaderVisible(true);
      } else {
        // Dès qu'on scroll, on cache
        setHeaderVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Écoute le scroll sur #root (pas window !)
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.addEventListener('scroll', handleScroll, { passive: true });
      return () => rootElement.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang.toLowerCase());
  };

  const navItems = [
    { title: t('nav.home') || "Accueil", path: "/" },
    { title: t('nav.about') || "À propos", path: "/nosMissions" },
    { title: t('nav.expertise') || "Expertise", path: "/services" },
    { title: t('nav.projects') || "Projets", path: "/portfolio" },
    { title: t('nav.team') || "Équipe", path: "/notreEquipe" },
    { title: t('nav.news') || "Actualités", path: "/actualites" },
    { title: t('nav.contactUs') || "Contact", path: "/hi" },
  ];

  return (
    <>
      {/* HEADER ABSOLUTE (scroll avec la page) */}
      <header 
        className={`absolute top-0 left-0 right-0 z-40 transition-transform duration-300 ${
          headerVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-6 lg:px-16">
          <div className="flex items-center justify-between h-28">
            
            {/* BETCOM AI Logo Text */}
            <NavLink 
              to="/" 
              className={`relative z-10 transition-colors duration-300 ${textColor}`}
            >
              <h1 
                className="text-2xl md:text-3xl font-bold tracking-tight"
                style={{ 
                  fontFamily: "'Creato Display', 'Inter', sans-serif",
                  letterSpacing: '-0.02em'
                }}
              >
                BETCOM AI
              </h1>
            </NavLink>

            <div className="flex items-center gap-6">
              
              {/* Search Icon - Blanc ou noir selon la page */}
              <button 
                className={`hidden md:block hover:opacity-70 transition-all ${textColor} ${
                  menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                <Search className="w-7 h-7" strokeWidth={2.5} />
              </button>

              {/* Hamburger - Blanc ou noir selon la page */}
              <button
                onClick={() => setMenuOpen(true)}
                className={`group relative z-10 transition-all ${
                  menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
                aria-label="Menu"
              >
                <div className="flex flex-col gap-2">
                  <span className={`w-9 h-[3px] ${hamburgerBg} transition-all group-hover:w-7`}></span>
                  <span className={`w-9 h-[3px] ${hamburgerBg}`}></span>
                  <span className={`w-9 h-[3px] ${hamburgerBg} transition-all group-hover:w-7`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MENU PANEL */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black opacity-70"
            onClick={() => setMenuOpen(false)}
          />

          <div className="absolute top-0 right-0 h-full w-[240px] sm:w-[260px] md:w-[280px] lg:w-[300px] bg-white shadow-2xl flex flex-col">
            
            {/* Header avec X */}
            <div className="flex items-center justify-end pr-1 pl-8 h-20 border-b border-gray-200 bg-white flex-shrink-0">
              <button
                onClick={() => setMenuOpen(false)}
                className="w-14 h-14 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-10 h-10 text-black" strokeWidth={3} />
              </button>
            </div>

            {/* Navigation - Police Inter Bold */}
            <div className="flex-1 pl-8 pr-1 py-6 bg-white">
              <nav>
                <ul className="space-y-0">
                  {navItems.map((item, index) => (
                    <li key={index} className="border-b border-gray-200">
                      <NavLink
                        to={item.path}
                        onClick={() => setMenuOpen(false)}
                        className="group block py-3 text-[18px] sm:text-[20px] font-bold text-black transition-all"
                        style={{ 
                          fontFamily: "'Inter', 'Helvetica Neue', -apple-system, sans-serif",
                          letterSpacing: '-0.01em'
                        }}
                      >
                        <span className="group-hover:translate-x-1 inline-block transition-transform">
                          {item.title}
                        </span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Footer - Design langue élégant */}
            <div className="pl-8 pr-1 py-5 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400 font-bold mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Language
                  </p>
                  <div className="inline-flex bg-gray-100 rounded-full p-1">
                    <button
                      onClick={() => {
                        changeLanguage("FR");
                        setMenuOpen(false);
                      }}
                      className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                        currentLanguage === "FR"
                          ? "bg-black text-white shadow-sm"
                          : "text-gray-600 hover:text-black"
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      FR
                    </button>
                    <button
                      onClick={() => {
                        changeLanguage("EN");
                        setMenuOpen(false);
                      }}
                      className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                        currentLanguage === "EN"
                          ? "bg-black text-white shadow-sm"
                          : "text-gray-600 hover:text-black"
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      EN
                    </button>
                  </div>
                </div>

                <div className="text-center pt-3 border-t border-gray-300">
                  <p className="text-[9px] text-gray-500 leading-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                    © 2026 Betcom AI<br/>Architecture & Ingénierie
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navlinks;