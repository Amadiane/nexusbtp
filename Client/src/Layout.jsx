import { useState, useEffect, useContext } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import NavAdmin from "./components/Header/NavAdmin";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";

const SIDEBAR_EXPANDED = 260;
const SIDEBAR_COLLAPSED = 72;

const AppInner = () => {
  const location = useLocation();
  const token = localStorage.getItem("access");
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem("nexus_sidebar_collapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("nexus_sidebar_collapsed", sidebarCollapsed);
  }, [sidebarCollapsed]);

  useEffect(() => {
    const rootElement = document.getElementById("root");
    if (rootElement) rootElement.scrollTop = 0;
    window.scrollTo(0, 0);
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

  const dk = darkMode;
  const sidebarW = sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;
  const adminBg = dk ? "#0a1628" : "#f0f4f8";
  const adminText = dk ? "#e2e8f0" : "#1e293b";

  const globalStyles = `
    *, *::before, *::after { box-sizing: border-box; }
    html { overflow: hidden; width: 100%; height: 100%; }
    body {
      overflow: hidden; width: 100%; height: 100%;
      margin: 0; padding: 0;
      font-family: 'DM Sans', 'Segoe UI', system-ui, sans-serif;
    }
    #root {
      overflow-y: auto; overflow-x: hidden;
      width: 100%; height: 100%;
      -webkit-overflow-scrolling: touch;
    }
    #root { scrollbar-width: thin; scrollbar-color: #003893 transparent; }
    #root::-webkit-scrollbar { width: 6px; }
    #root::-webkit-scrollbar-track { background: transparent; }
    #root::-webkit-scrollbar-thumb { background: #003893; border-radius: 3px; }
    #root::-webkit-scrollbar-thumb:hover { background: #EA580C; }
    html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; width: 0; }
    html, body { scrollbar-width: none; }
    a { text-decoration: none; }
    button { font-family: inherit; }
    .admin-main-content {
      transition: margin-left 0.25s cubic-bezier(0.4,0,0.2,1);
    }
    @media (max-width: 1023px) {
      .admin-main-content { margin-left: 0 !important; }
    }
    .topbar-date { display: flex; }
    .topbar-user-label { display: flex; }
    @media (max-width: 640px) {
      .topbar-date { display: none !important; }
      .topbar-user-label { display: none !important; }
      .topbar-breadcrumb-sub { display: none !important; }
    }
  `;

  return (
    <>
      <style>{globalStyles}</style>

      {isAdminPage ? (
        <div style={{ minHeight: "100vh", background: adminBg, color: adminText }}>

          <NavAdmin
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

          <main
            className="admin-main-content"
            style={{ marginLeft: sidebarW, minHeight: "100vh", background: adminBg, color: adminText }}
          >
            {/* ── Top bar responsive ── */}
            <div style={{
              height: 64,
              background: dk ? "#0f172a" : "#fff",
              borderBottom: `1px solid ${dk ? "#1e3a5f" : "#f1f5f9"}`,
              display: "flex", alignItems: "center",
              padding: "0 16px", gap: 10,
              position: "sticky", top: 0, zIndex: 100,
              boxShadow: dk ? "0 1px 0 #1e3a5f" : "0 1px 12px rgba(0,56,147,0.06)",
            }}>

              {/* Mobile: spacer for hamburger button (68px) */}
              <div className="lg:hidden" style={{ width: 52, flexShrink: 0 }} />

              {/* Breadcrumb */}
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <div style={{ width: 3, height: 20, background: "#EA580C", borderRadius: 2, flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div className="topbar-breadcrumb-sub" style={{ fontSize: 10, color: dk ? "#334155" : "#94a3b8", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1 }}>
                    Administration
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: dk ? "#e2e8f0" : "#1e293b", lineHeight: 1.3, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {location.pathname === "/dashboardAdmin" ? "Tableau de bord"
                      : location.pathname === "/newsPost" ? "Actualités"
                      : location.pathname === "/listeContacts" ? "Contacts"
                      : location.pathname === "/partnerPost" ? "Partenaires"
                      : location.pathname === "/teamMessage" ? "Équipe"
                      : location.pathname === "/missionPost" ? "Missions"
                      : location.pathname === "/servicePost" ? "Services"
                      : location.pathname === "/portfolioPost" ? "Portfolio"
                      : location.pathname === "/homePost" ? "Accueil"
                      : location.pathname.replace("/", "").replace(/([A-Z])/g, " $1").trim()}
                  </div>
                </div>
              </div>

              {/* Date pill — masquée sur mobile */}
              <div className="topbar-date" style={{
                alignItems: "center", gap: 8,
                padding: "6px 14px", borderRadius: 20,
                background: dk ? "#1e293b" : "#f8fafc",
                border: `1px solid ${dk ? "#1e3a5f" : "#e2e8f0"}`,
                flexShrink: 0,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: dk ? "#94a3b8" : "#64748b", whiteSpace: "nowrap" }}>
                  {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>

              {/* User badge */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "5px 10px 5px 6px",
                borderRadius: 20, flexShrink: 0,
                background: dk ? "#1e293b" : `linear-gradient(135deg, #003893 0%, #0052cc 100%)`,
                border: `1px solid ${dk ? "#1e3a5f" : "transparent"}`,
              }}>
                {/* Avatar */}
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: dk ? "#003893" : "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>
                    {(() => { try { const u = JSON.parse(localStorage.getItem("user") || "{}"); const n = u.username || u.name || u.email || "A"; return n[0].toUpperCase(); } catch { return "A"; } })()}
                  </span>
                </div>
                {/* Name + role — masqués sur mobile */}
                <div className="topbar-user-label" style={{ lineHeight: 1.2, flexDirection: "column" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: dk ? "#e2e8f0" : "#fff", whiteSpace: "nowrap" }}>
                    {(() => { try { const u = JSON.parse(localStorage.getItem("user") || "{}"); return u.username || u.name || u.email || "Admin"; } catch { return "Admin"; } })()}
                  </div>
                  <div style={{ fontSize: 10, color: dk ? "#475569" : "rgba(255,255,255,0.65)", fontWeight: 500 }}>Administrateur</div>
                </div>
              </div>

            </div>

            {/* Page content */}
            <div style={{ padding: "24px 20px 40px" }}>
              <Outlet />
            </div>
          </main>
        </div>
      ) : (
        <div style={{ width: "100%", minHeight: "100vh", background: "#fff", color: "#000" }}>
          {!isLoginPage && <Header logoColor="#000000" />}
          <main>
            <div style={{ width: "100%", maxWidth: 1600, margin: "0 auto", padding: "0 24px" }}>
              <Outlet />
            </div>
          </main>
          {!isLoginPage && (
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
              <Footer />
            </div>
          )}
        </div>
      )}
    </>
  );
};

const App = () => (
  <ThemeProvider>
    <I18nextProvider i18n={i18n}>
      <AppInner />
    </I18nextProvider>
  </ThemeProvider>
);

export default App;