import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Home, Building2, UsersRound, Target, Mail,
  Package, Briefcase, LogOut, Menu, X,
  ChevronDown, ChevronRight, ChevronLeft, Bell, User, Newspaper,
  Sun, Moon, Settings
} from "lucide-react";
import NexusLogo from "../../assets/logo.jpg";
import CONFIG from "../../config/config.js";
// darkMode and setDarkMode are passed as props from App.jsx via ThemeContext

const NAVY = "#003893";
const ORANGE = "#EA580C";

const NavAdmin = ({ collapsed, setCollapsed, darkMode, setDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ contacts: 0 });
  const [openSections, setOpenSections] = useState(["Contenu"]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const username = (() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      return u.username || u.name || u.email || "Admin";
    } catch { return "Admin"; }
  })();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(CONFIG.API_CONTACT_LIST);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.results || [];
          setCounts({ contacts: list.length });
        }
      } catch (err) { console.error(err); }
    };
    fetchCounts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    navigate("/login");
  };

  const navCategories = [
    {
      title: "Principal",
      items: [
        { path: "/dashboardAdmin", label: "Tableau de bord", icon: LayoutDashboard },
      ]
    },
    {
      title: "Contenu",
      items: [
        { path: "/homePost", label: "Accueil", icon: Home },
        { path: "/missionPost", label: "Missions", icon: Target },
      ]
    },
    {
      title: "Agence",
      items: [
        { path: "/newsPost", label: "Actualités", icon: Newspaper },
        { path: "/partnerPost", label: "Partenaires", icon: Building2 },
        { path: "/teamMessage", label: "Équipe", icon: UsersRound },
      ]
    },
    {
      title: "Services",
      items: [
        { path: "/portfolioPost", label: "Portfolio", icon: Briefcase },
        { path: "/servicePost", label: "Services", icon: Package },
      ]
    },
    {
      title: "Messages",
      items: [
        { path: "/listeContacts", label: "Contacts", icon: Mail, count: counts.contacts },
      ]
    }
  ];

  const toggleSection = (title) => {
    if (collapsed) return;
    setOpenSections(prev =>
      prev.includes(title) ? prev.filter(s => s !== title) : [...prev, title]
    );
  };

  const dk = darkMode;

  const sidebarStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: collapsed ? 72 : 260,
    background: dk ? "#0f172a" : "#fff",
    borderRight: `1.5px solid ${dk ? "#1e3a5f" : "#e2e8f0"}`,
    display: "flex",
    flexDirection: "column",
    transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
    overflow: "hidden",
    zIndex: 300,
    boxShadow: "2px 0 20px rgba(0,56,147,0.07)",
  };

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        onClick={() => setMobileOpen(false)}
        title={collapsed ? item.label : undefined}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: collapsed ? "10px 0" : "9px 12px",
          justifyContent: collapsed ? "center" : "flex-start",
          borderRadius: 10,
          margin: "1px 8px",
          textDecoration: "none",
          background: isActive ? NAVY : "transparent",
          color: isActive ? "#fff" : dk ? "#94a3b8" : "#475569",
          fontWeight: isActive ? 700 : 500,
          fontSize: 13,
          fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
          transition: "background 0.15s, color 0.15s",
          position: "relative",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = dk ? "#1e293b" : "#f1f5f9"; }}
        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: isActive ? "rgba(255,255,255,0.18)" : dk ? "#1e293b" : "#f1f5f9",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.15s",
        }}>
          <Icon size={16} strokeWidth={2} />
        </div>
        {!collapsed && (
          <>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.count > 0 && (
              <span style={{
                background: isActive ? "rgba(255,255,255,0.25)" : ORANGE,
                color: "#fff", fontSize: 10, fontWeight: 700,
                borderRadius: 20, padding: "1px 7px", minWidth: 20, textAlign: "center",
              }}>{item.count}</span>
            )}
          </>
        )}
        {collapsed && item.count > 0 && (
          <span style={{
            position: "absolute", top: 4, right: 8,
            background: ORANGE, color: "#fff",
            fontSize: 9, fontWeight: 700, borderRadius: "50%",
            width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center",
          }}>{item.count}</span>
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <div style={sidebarStyle}>
      {/* Top accent */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${NAVY} 0%, ${NAVY} 60%, ${ORANGE} 100%)`, flexShrink: 0 }} />

      {/* Logo header */}
      <div style={{
        height: 68, padding: "0 14px",
        display: "flex", alignItems: "center", gap: 10,
        borderBottom: `1px solid ${dk ? "#1e3a5f" : "#e2e8f0"}`,
        flexShrink: 0,
        position: "relative",
      }}>
        {/* Logo + nom */}
        <Link to="/dashboardAdmin" style={{ textDecoration: "none", flexShrink: 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, border: `1.5px solid ${dk ? "#1e3a5f" : "#e2e8f0"}`, overflow: "hidden", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={NexusLogo} alt="Nexus" style={{ width: 32, height: 32, objectFit: "contain" }} />
          </div>
        </Link>

        {!collapsed && (
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: NAVY, letterSpacing: "0.04em", lineHeight: 1, whiteSpace: "nowrap" }}>
              NEX<span style={{ color: ORANGE }}>US</span>
            </div>
            <div style={{ fontSize: 9, color: dk ? "#64748b" : "#94a3b8", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", whiteSpace: "nowrap", marginTop: 2 }}>
              BTP Consulting
            </div>
          </div>
        )}

        {/* Toggle — position fixed quand collapsed (comme SantaStyle) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Agrandir le menu" : "Réduire le menu"}
          style={{
            position: collapsed ? "fixed" : "relative",
            left: collapsed ? 15 : "auto",
            top: collapsed ? 15 : "auto",
            zIndex: collapsed ? 350 : "auto",
            width: 38, height: 38,
            borderRadius: 10,
            border: `2px solid ${collapsed ? NAVY : (dk ? "#1e3a5f" : "#e2e8f0")}`,
            background: collapsed
              ? `linear-gradient(135deg, #001f5c, ${NAVY})`
              : (dk ? "#1e293b" : "#f8fafc"),
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            marginLeft: collapsed ? 0 : "auto",
            transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: collapsed ? `0 4px 14px ${NAVY}50` : "0 1px 3px rgba(0,0,0,0.08)",
          }}
          onMouseEnter={e => {
            if (!collapsed) {
              e.currentTarget.style.background = `${NAVY}20`;
              e.currentTarget.style.borderColor = NAVY;
            }
            e.currentTarget.style.transform = "scale(1.08)";
          }}
          onMouseLeave={e => {
            if (!collapsed) {
              e.currentTarget.style.background = dk ? "#1e293b" : "#f8fafc";
              e.currentTarget.style.borderColor = dk ? "#1e3a5f" : "#e2e8f0";
            }
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {collapsed
            ? <ChevronRight size={18} color="#fff" strokeWidth={3} />
            : <ChevronLeft  size={18} color={NAVY} strokeWidth={2.5} />
          }
        </button>
      </div>

      {/* Nav content — scrollable */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "8px 0" }}>
        {navCategories.map((cat, idx) => (
          <div key={idx} style={{ marginBottom: 4 }}>
            {/* Section header */}
            {!collapsed && (
              <button
                onClick={() => toggleSection(cat.title)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "6px 20px", background: "transparent", border: "none", cursor: "pointer",
                  color: dk ? "#475569" : "#94a3b8",
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                  fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
                }}
              >
                <span>{cat.title}</span>
                <ChevronDown size={12} style={{ transform: openSections.includes(cat.title) ? "rotate(0)" : "rotate(-90deg)", transition: "transform 0.2s" }} />
              </button>
            )}
            {collapsed && idx > 0 && (
              <div style={{ height: 1, background: dk ? "#1e3a5f" : "#f1f5f9", margin: "4px 16px" }} />
            )}
            {/* Items */}
            {(collapsed || openSections.includes(cat.title)) && cat.items.map((item, i) => (
              <NavItem key={i} item={item} />
            ))}
          </div>
        ))}
      </div>

      {/* Bottom: user + actions */}
      <div style={{
        borderTop: `1px solid ${dk ? "#1e3a5f" : "#e2e8f0"}`,
        padding: collapsed ? "12px 0" : "12px 8px",
        flexShrink: 0,
        display: "flex", flexDirection: "column", gap: 4,
      }}>
        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!dk)}
          title={dk ? "Mode clair" : "Mode sombre"}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: collapsed ? "9px 0" : "9px 12px",
            justifyContent: collapsed ? "center" : "flex-start",
            borderRadius: 10, margin: "0 0", border: "none",
            background: "transparent", cursor: "pointer",
            color: dk ? "#94a3b8" : "#64748b",
            width: "100%",
            fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
            fontSize: 13, fontWeight: 500,
          }}
          onMouseEnter={e => e.currentTarget.style.background = dk ? "#1e293b" : "#f1f5f9"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div style={{ width: 32, height: 32, borderRadius: 8, background: dk ? "#1e293b" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {dk ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color={NAVY} />}
          </div>
          {!collapsed && <span>{dk ? "Mode clair" : "Mode sombre"}</span>}
        </button>

        {/* User card */}
        {!collapsed && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 12,
            background: dk ? "#1e293b" : "#f8fafc",
            border: `1px solid ${dk ? "#1e3a5f" : "#e2e8f0"}`,
            margin: "0 0",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <User size={17} color="#fff" />
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: dk ? "#e2e8f0" : "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {username}
              </div>
              <div style={{ fontSize: 10, color: dk ? "#475569" : "#94a3b8", fontWeight: 500, letterSpacing: "0.06em" }}>
                Administrateur
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Déconnexion"
              style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, borderRadius: 6, color: "#ef4444" }}
              onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <LogOut size={15} />
            </button>
          </div>
        )}

        {/* Collapsed user icon */}
        {collapsed && (
          <button
            onClick={handleLogout}
            title="Déconnexion"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "9px 0", border: "none", background: "transparent",
              cursor: "pointer", color: "#ef4444", width: "100%", borderRadius: 10,
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LogOut size={15} color="#ef4444" />
            </div>
          </button>
        )}
      </div>

      {/* Bottom accent */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${ORANGE} 0%, ${NAVY} 100%)`, flexShrink: 0 }} />
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        {sidebarContent}
      </div>

      {/* Mobile: hamburger button */}
      <button
        className="lg:hidden"
        onClick={() => setMobileOpen(true)}
        style={{
          position: "fixed", top: 12, left: 12, zIndex: 400,
          width: 44, height: 44, borderRadius: 12,
          background: NAVY, border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,56,147,0.25)",
        }}
      >
        <Menu size={20} color="#fff" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden"
            onClick={() => setMobileOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 350, backdropFilter: "blur(2px)" }}
          />
          <div className="lg:hidden" style={{ position: "fixed", top: 0, left: 0, width: 280, height: "100vh", zIndex: 360, background: dk ? "#0f172a" : "#fff", borderRight: `1.5px solid ${dk ? "#1e3a5f" : "#e2e8f0"}`, display: "flex", flexDirection: "column", overflowY: "auto" }}>
            {/* Mobile header */}
            <div style={{ height: 4, background: `linear-gradient(90deg, ${NAVY} 0%, ${NAVY} 60%, ${ORANGE} 100%)` }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${dk ? "#1e3a5f" : "#e2e8f0"}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, border: `1.5px solid ${dk ? "#1e3a5f" : "#e2e8f0"}`, overflow: "hidden", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={NexusLogo} alt="Nexus" style={{ width: 32, height: 32, objectFit: "contain" }} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: NAVY }}>NEX<span style={{ color: ORANGE }}>US</span></div>
                  <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>BTP Consulting</div>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: dk ? "#94a3b8" : "#64748b" }}>
                <X size={22} />
              </button>
            </div>

            {/* Mobile nav */}
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
              {navCategories.map((cat, idx) => (
                <div key={idx} style={{ marginBottom: 4 }}>
                  <div style={{ padding: "6px 20px", color: dk ? "#475569" : "#94a3b8", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    {cat.title}
                  </div>
                  {cat.items.map((item, i) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link key={i} to={item.path} onClick={() => setMobileOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", margin: "1px 8px", borderRadius: 10, textDecoration: "none", background: isActive ? NAVY : "transparent", color: isActive ? "#fff" : dk ? "#94a3b8" : "#475569", fontSize: 13, fontWeight: isActive ? 700 : 500 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: isActive ? "rgba(255,255,255,0.18)" : dk ? "#1e293b" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon size={16} />
                        </div>
                        <span style={{ flex: 1 }}>{item.label}</span>
                        {item.count > 0 && <span style={{ background: isActive ? "rgba(255,255,255,0.25)" : ORANGE, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 20, padding: "1px 7px" }}>{item.count}</span>}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Mobile bottom */}
            <div style={{ borderTop: `1px solid ${dk ? "#1e3a5f" : "#e2e8f0"}`, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
              <button onClick={() => setDarkMode(!dk)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: dk ? "#94a3b8" : "#64748b", fontSize: 13, fontWeight: 500, width: "100%" }}
                onMouseEnter={e => e.currentTarget.style.background = dk ? "#1e293b" : "#f1f5f9"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: dk ? "#1e293b" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {dk ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color={NAVY} />}
                </div>
                {dk ? "Mode clair" : "Mode sombre"}
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: dk ? "#1e293b" : "#f8fafc", border: `1px solid ${dk ? "#1e3a5f" : "#e2e8f0"}` }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <User size={17} color="#fff" />
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: dk ? "#e2e8f0" : "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{username}</div>
                  <div style={{ fontSize: 10, color: dk ? "#475569" : "#94a3b8", fontWeight: 500 }}>Administrateur</div>
                </div>
                <button onClick={handleLogout} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", padding: 4, borderRadius: 6 }}>
                  <LogOut size={15} />
                </button>
              </div>
            </div>
            <div style={{ height: 4, background: `linear-gradient(90deg, ${ORANGE} 0%, ${NAVY} 100%)` }} />
          </div>
        </>
      )}
    </>
  );
};

export default NavAdmin;