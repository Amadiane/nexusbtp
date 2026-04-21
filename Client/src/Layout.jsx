import { Outlet, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import NavAdmin from "./components/Header/NavAdmin";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import React from "react";

/**
 * 🎨 APP BETCOM AI - HEADER QUI SCROLL
 * ✅ Header ABSOLUTE (pas fixed) pour scroll naturel
 * ✅ Disparaît quand on scroll vers bas
 * ✅ Réapparaît quand on arrive en haut
 */

const App = () => {
  const location = useLocation();
  const token = localStorage.getItem("access");

  React.useEffect(() => {
    const rootElement = document.getElementById('root');
    
    if (rootElement) {
      rootElement.scrollTop = 0;
    }
    
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    const timer = setTimeout(() => {
      if (rootElement) {
        rootElement.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    }, 0);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const adminPaths = [
    "/newsPost", "/listeContacts", "/listeRejoindre",
    "/listePostulantsCommunity", "/listPartners",
    "/listeAbonnement", "/platformPost", "/valeurPost",
    "/dashboardAdmin", "/teamMessage", "/missionPost",
    "/activitiesPost", "/homePost", "/partnerPost",
    "/servicePost", "/portfolioPost",
  ];

  const isAdminPage = adminPaths.includes(location.pathname);
  const isLoginPage = location.pathname === "/login";

  if (isAdminPage && !token) {
    return <Navigate to="/login" replace />;
  }

  const globalStyles = `
    html {
      overflow: hidden;
      width: 100%;
      height: 100%;
    }

    body {
      overflow: hidden;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }

    #root {
      overflow-y: auto;
      overflow-x: hidden;
      width: 100%;
      height: 100%;
      -webkit-overflow-scrolling: touch;
      background: #ffffff;
    }

    * {
      box-sizing: border-box;
    }

    body, #root, #root > div {
      max-width: 100%;
    }

    .w-full {
      width: 100% !important;
      max-width: 100% !important;
    }

    .min-h-screen {
      width: 100% !important;
    }

    /* Scrollbar Betcom - Gris */
    #root {
      scrollbar-width: thin;
      scrollbar-color: #9ca3af #f5f5f5;
    }

    #root::-webkit-scrollbar {
      width: 8px;
    }

    #root::-webkit-scrollbar-track {
      background: #f5f5f5;
    }

    #root::-webkit-scrollbar-thumb {
      background: #9ca3af;
      border-radius: 4px;
    }

    #root::-webkit-scrollbar-thumb:hover {
      background: #6b7280;
    }

    html::-webkit-scrollbar,
    body::-webkit-scrollbar,
    *:not(#root)::-webkit-scrollbar {
      display: none;
      width: 0;
    }

    html,
    body,
    *:not(#root) {
      scrollbar-width: none;
    }

    @media (max-width: 768px) {
      #root::-webkit-scrollbar {
        width: 4px;
      }
    }

    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    
    body {
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #000000;
    }

    h1, h2, h3, h4, h5, h6 {
      font-weight: 600;
      letter-spacing: -0.02em;
    }
  `;

  return (
    <I18nextProvider i18n={i18n}>
      <style>{globalStyles}</style>

      {isAdminPage ? (
        <div className="w-full min-h-screen bg-white relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1d1d1b]/3 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1d1d1b]/3 rounded-full blur-3xl" />
          </div>

          <NavAdmin />

          <main className="relative w-full">
            <div className="max-w-[1800px] mx-auto px-4 md:px-6 lg:px-12 pt-24 pb-10">
              <Outlet />
            </div>
          </main>
        </div>
      ) : (
        <div className="w-full min-h-screen bg-white text-[#000000] relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-bl from-[#1d1d1b]/5 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#1d1d1b]/5 to-transparent rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#1d1d1b]/3 to-transparent rounded-full blur-3xl" />
          </div>

          {/* Header ABSOLUTE (pas fixed) - scroll naturel */}
          {!isLoginPage && (
            <Header logoColor="#000000" />
          )}

          {/* MAIN - Pas de padding-top car header scroll avec */}
          <main className="relative pb-16">
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-12">
              <Outlet />
            </div>
          </main>

          {/* Footer */}
          {!isLoginPage && (
            <div className="relative z-10 border-t border-[#1d1d1b]/10">
              <Footer />
            </div>
          )}
        </div>
      )}
    </I18nextProvider>
  );
};

export default App;