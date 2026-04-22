import { Navigate, Link } from "react-router-dom";
import { useContext } from "react";
import {
  Target, Settings, FileText, Users,
  Calendar, Building2, Briefcase, LayoutDashboard,
  TrendingUp, ArrowRight
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const NAVY = "#003893";
const ORANGE = "#EA580C";

const DashboardAdmin = () => {
  const token = localStorage.getItem("access");
  const { darkMode: dk } = useContext(ThemeContext);

  if (!token) return <Navigate to="/login" replace />;

  const username = (() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      return u.username || u.name || u.email || "Admin";
    } catch { return "Admin"; }
  })();

  const adminTools = [
    { title: "Missions", description: "Gérer la section À propos", icon: Target, link: "/missionPost", color: NAVY },
    { title: "Services", description: "Gérer les expertises métier", icon: Settings, link: "/servicePost", color: "#0369a1" },
    { title: "Portfolio", description: "Gérer les projets réalisés", icon: Briefcase, link: "/portfolioPost", color: "#0891b2" },
    { title: "Équipe", description: "Gérer les membres", icon: Users, link: "/teamMessage", color: "#7c3aed" },
    { title: "Actualités", description: "Gérer les news & articles", icon: Calendar, link: "/newsPost", color: ORANGE },
    { title: "Partenaires", description: "Gérer les partenariats", icon: Building2, link: "/partnerPost", color: "#059669" },
  ];

  const stats = [
    { label: "Sections actives", value: "6", icon: LayoutDashboard, trend: "+2" },
    { label: "Projets portfolio", value: "—", icon: Briefcase, trend: null },
    { label: "Membres équipe", value: "—", icon: Users, trend: null },
    { label: "Articles publiés", value: "—", icon: FileText, trend: null },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>

      {/* Welcome banner */}
      <div style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, #002270 60%, #001a52 100%)`,
        borderRadius: 20,
        padding: "32px 36px",
        marginBottom: 28,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative shapes */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(234,88,12,0.15)" }} />
        <div style={{ position: "absolute", bottom: -60, right: 80, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", top: 20, right: 200, width: 8, height: 8, borderRadius: "50%", background: ORANGE }} />
        <div style={{ position: "absolute", bottom: 30, right: 160, width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: ORANGE }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Espace Administration
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            Bonjour, <span style={{ color: ORANGE }}>{username}</span> 👋
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", margin: "10px 0 0", fontWeight: 400 }}>
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            &nbsp;·&nbsp; Bienvenue sur votre tableau de bord NEXUS BTP Consulting
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 14,
        marginBottom: 28,
      }}>
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} style={{
              background: dk ? "#0f172a" : "#fff",
              border: `1px solid ${dk ? "#1e3a5f" : "#e2e8f0"}`,
              borderRadius: 14,
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: dk ? "#1e293b" : "#f0f4f8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color={NAVY} />
                </div>
                {s.trend && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981", background: "#d1fae5", borderRadius: 20, padding: "2px 8px", display: "flex", alignItems: "center", gap: 3 }}>
                    <TrendingUp size={10} /> {s.trend}
                  </span>
                )}
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, color: dk ? "#e2e8f0" : "#1e293b", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: dk ? "#475569" : "#94a3b8", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section title */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{ width: 4, height: 22, background: ORANGE, borderRadius: 2 }} />
        <h2 style={{ fontSize: 16, fontWeight: 700, color: dk ? "#e2e8f0" : "#1e293b", margin: 0 }}>
          Gestion du contenu
        </h2>
      </div>

      {/* Tools grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 16,
        marginBottom: 40,
      }}>
        {adminTools.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <Link
              key={idx}
              to={tool.link}
              style={{
                background: dk ? "#0f172a" : "#fff",
                border: `1.5px solid ${dk ? "#1e3a5f" : "#e2e8f0"}`,
                borderRadius: 16,
                padding: "22px 22px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 16,
                transition: "border-color 0.2s, box-shadow 0.2s, transform 0.15s",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = tool.color;
                e.currentTarget.style.boxShadow = `0 4px 20px ${tool.color}20`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = dk ? "#1e3a5f" : "#e2e8f0";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Left accent */}
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: tool.color, borderRadius: "0 2px 2px 0" }} />

              <div style={{
                width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                background: `${tool.color}15`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={20} color={tool.color} strokeWidth={2} />
              </div>

              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: dk ? "#e2e8f0" : "#1e293b", marginBottom: 3 }}>
                  {tool.title}
                </div>
                <div style={{ fontSize: 12, color: dk ? "#475569" : "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {tool.description}
                </div>
              </div>

              <ArrowRight size={16} color={dk ? "#475569" : "#cbd5e1"} style={{ flexShrink: 0 }} />
            </Link>
          );
        })}
      </div>

      {/* Footer note */}
      <div style={{
        borderTop: `1px solid ${dk ? "#1e3a5f" : "#e2e8f0"}`,
        paddingTop: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: ORANGE }} />
          <span style={{ fontSize: 11, color: dk ? "#475569" : "#94a3b8", fontWeight: 500, letterSpacing: "0.06em" }}>
            NEXUS BTP Consulting · Administration
          </span>
        </div>
        <span style={{ fontSize: 11, color: dk ? "#334155" : "#cbd5e1" }}>© 2026 Tous droits réservés</span>
      </div>
    </div>
  );
};

export default DashboardAdmin;