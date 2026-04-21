import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Home, Building2, UsersRound, Target, Mail,
  Users, Package, Briefcase, LogOut, Menu, X,
  ChevronDown, Grid3x3, FileText, Bell, User, Newspaper
} from "lucide-react";
import CONFIG from "../../config/config.js";

/**
 * 🏗️ NAVADMIN - BETCOM AI ULTRA MODERNE
 * Layout: Top bar horizontal minimaliste
 * Charte: Noir #000000, Blanc #ffffff, Gris
 * Style: Architecture professionnelle
 */

const NavAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    contacts: 0,
    newsletter: 0
  });
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Fetch counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const contactsRes = await fetch(CONFIG.API_CONTACT_LIST);
        if (contactsRes.ok) {
          const contactsData = await contactsRes.json();
          const contactsList = Array.isArray(contactsData) 
            ? contactsData 
            : contactsData.results || [];
          setCounts(prev => ({ ...prev, contacts: contactsList.length }));
        }

        const newsletterRes = await fetch(CONFIG.API_ABONNEMENT_LIST);
        if (newsletterRes.ok) {
          const newsletterData = await newsletterRes.json();
          const newsletterList = Array.isArray(newsletterData)
            ? newsletterData
            : newsletterData.results || [];
          setCounts(prev => ({ ...prev, newsletter: newsletterList.length }));
        }
      } catch (err) {
        console.error("Erreur fetch counts:", err);
      }
    };
    
    fetchCounts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    navigate("/login");
  };

  const getIcon = (path) => {
    const icons = {
      "/dashboardAdmin": <LayoutDashboard className="w-5 h-5" />,
      "/homePost": <Home className="w-5 h-5" />,
      "/partnerPost": <Building2 className="w-5 h-5" />,
      "/teamMessage": <UsersRound className="w-5 h-5" />,
      "/missionPost": <Target className="w-5 h-5" />,
      "/listeContacts": <Mail className="w-5 h-5" />,
      "/servicePost": <Package className="w-5 h-5" />,
      "/portfolioPost": <Briefcase className="w-5 h-5" />,
      "/newsPost": <Newspaper className="w-5 h-5" />,
    };
    return icons[path] || <FileText className="w-5 h-5" />;
  };

  const navCategories = [
    {
      title: "Dashboard",
      items: [
        { path: "/dashboardAdmin", label: "Tableau de bord" }
      ]
    },
    {
      title: "Contenu",
      items: [
        { path: "/homePost", label: "Accueil" },
        { path: "/missionPost", label: "Missions" }
      ]
    },
    {
      title: "Agence",
      items: [
        { path: "/newsPost", label: "Actualités" },
        { path: "/partnerPost", label: "Partenaires" },
        { path: "/teamMessage", label: "Équipe" }
      ]
    },
    {
      title: "Services",
      items: [
        { path: "/portfolioPost", label: "Portfolio" },
        { path: "/servicePost", label: "Services" }
      ]
    },
    {
      title: "Messages",
      items: [
        { path: "/listeContacts", label: "Contacts", count: counts.contacts }
      ]
    }
  ];

  const quickAccess = [
    { path: "/dashboardAdmin", label: "Dashboard", icon: <LayoutDashboard /> },
    { path: "/portfolioPost", label: "Portfolio", icon: <Briefcase /> },
    { path: "/listeContacts", label: "Messages", icon: <Mail />, badge: counts.contacts },
    { path: "/servicePost", label: "Services", icon: <Package /> },
  ];

  return (
    <>
      {/* TOP BAR */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white border-b-2 border-black z-[200]">
        <div className="h-full max-w-[1920px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Left: Logo + Brand */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Logo */}
            <Link to="/dashboardAdmin" className="relative group">
              <div className="relative w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-2xl font-black" style={{ fontFamily: "'Creato Display', sans-serif" }}>B</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navCategories.map((category, idx) => (
                <div key={idx} className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === idx ? null : idx)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:text-black hover:bg-gray-100 transition-all font-semibold text-sm"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    <span>{category.title}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === idx ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {activeDropdown === idx && (
                    <div className="absolute top-full left-0 mt-2 min-w-[220px] bg-white border-2 border-black rounded-2xl shadow-2xl overflow-hidden">
                      {category.items.map((item, itemIdx) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <Link
                            key={itemIdx}
                            to={item.path}
                            onClick={() => setActiveDropdown(null)}
                            className={`flex items-center justify-between px-4 py-3 transition-all ${
                              isActive
                                ? 'bg-black text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                          >
                            <div className="flex items-center gap-3">
                              {getIcon(item.path)}
                              <span className="font-medium text-sm">{item.label}</span>
                            </div>
                            {item.count > 0 && (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-black text-white'
                              }`}>
                                {item.count}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Notifications */}
            <button className="relative p-2.5 sm:p-3 bg-gray-100 hover:bg-gray-200 border-2 border-gray-200 hover:border-black rounded-xl transition-all">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              {(counts.contacts + counts.newsletter) > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-black rounded-full text-white text-xs font-bold flex items-center justify-center">
                  {counts.contacts + counts.newsletter}
                </span>
              )}
            </button>

            {/* Quick Menu Button */}
            <button
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              className="hidden sm:flex p-3 bg-black hover:bg-gray-800 rounded-xl transition-all shadow-lg"
            >
              <Grid3x3 className="w-5 h-5 text-white" />
            </button>

            {/* Admin Profile */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-100 border-2 border-gray-200 rounded-xl">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden lg:block">
                <div className="text-black text-sm font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>Admin</div>
                <div className="text-gray-500 text-xs" style={{ fontFamily: 'Poppins, sans-serif' }}>admin@betcom.ma</div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex p-3 bg-red-50 hover:bg-red-100 border-2 border-red-500 rounded-xl transition-all"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5 text-red-600" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2.5 sm:p-3 bg-gray-100 border-2 border-gray-200 rounded-xl"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5 text-black" />
              ) : (
                <Menu className="w-5 h-5 text-black" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* FLOATING QUICK MENU */}
      {showQuickMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[250]"
            onClick={() => setShowQuickMenu(false)}
          ></div>
          
          <div className="fixed top-24 right-6 w-80 bg-white border-2 border-black rounded-3xl shadow-2xl z-[300] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b-2 border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-black font-bold text-lg flex items-center gap-2" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                  Accès Rapide
                </h3>
                <button
                  onClick={() => setShowQuickMenu(false)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <p className="text-gray-600 text-xs" style={{ fontFamily: 'Poppins, sans-serif' }}>Pages les plus utilisées</p>
            </div>

            {/* Quick Links Grid */}
            <div className="p-4 grid grid-cols-2 gap-3">
              {quickAccess.map((item, idx) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={idx}
                    to={item.path}
                    onClick={() => setShowQuickMenu(false)}
                    className={`relative p-4 rounded-2xl transition-all ${
                      isActive
                        ? 'bg-black text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isActive 
                          ? 'bg-white/20' 
                          : 'bg-white border-2 border-gray-200'
                      }`}>
                        {item.icon}
                      </div>
                      <span className="text-sm font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>{item.label}</span>
                      {item.badge > 0 && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 bg-black text-white rounded-full text-xs font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* All Categories */}
            <div className="p-4 border-t-2 border-gray-200 bg-gray-50">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Toutes les sections
              </div>
              <div className="space-y-1">
                {navCategories.map((category, idx) => (
                  <div key={idx}>
                    <div className="text-xs font-bold text-black px-3 py-2 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {category.title}
                    </div>
                    {category.items.map((item, itemIdx) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={itemIdx}
                          to={item.path}
                          onClick={() => setShowQuickMenu(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                            isActive
                              ? 'bg-black text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          <div className="flex items-center gap-2">
                            {getIcon(item.path)}
                            <span className="text-sm font-medium">{item.label}</span>
                          </div>
                          {item.count > 0 && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-black text-white'
                            }`}>
                              {item.count}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* MOBILE MENU */}
      {showMobileMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[250] lg:hidden"
            onClick={() => setShowMobileMenu(false)}
          ></div>
          
          <div className="fixed inset-0 top-20 bg-white z-[300] overflow-y-auto lg:hidden">
            {/* Header Mobile */}
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-black font-bold text-lg flex items-center gap-2" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                <Menu className="w-5 h-5" />
                Menu
              </h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2.5 bg-gray-100 hover:bg-gray-200 border-2 border-gray-200 rounded-xl transition-all"
              >
                <X className="w-6 h-6 text-black" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6 pb-32">
              {/* User Info Mobile */}
              <div className="flex items-center gap-3 p-4 bg-gray-100 border-2 border-gray-200 rounded-2xl">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-black font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>Admin</div>
                  <div className="text-gray-600 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>admin@betcom.ma</div>
                </div>
              </div>

              {/* Notifications Mobile */}
              {(counts.contacts + counts.newsletter) > 0 && (
                <div className="p-4 bg-blue-50 border-2 border-blue-500 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <span className="text-black font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>Notifications</span>
                    <span className="ml-auto px-3 py-1 bg-black text-white rounded-full text-sm font-bold">
                      {counts.contacts + counts.newsletter}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {counts.contacts > 0 && (
                      <Link
                        to="/listeContacts"
                        onClick={() => setShowMobileMenu(false)}
                        className="flex items-center justify-between px-3 py-2 bg-white rounded-xl"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        <span className="text-gray-700 text-sm">Messages</span>
                        <span className="px-2 py-1 bg-black text-white rounded-full text-xs font-bold">
                          {counts.contacts}
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Categories */}
              {navCategories.map((category, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-2 px-3 py-2 mb-3">
                    <div className="w-1 h-6 bg-black rounded-full"></div>
                    <div className="text-sm font-bold uppercase tracking-wider text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {category.title}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {category.items.map((item, itemIdx) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={itemIdx}
                          to={item.path}
                          onClick={() => setShowMobileMenu(false)}
                          className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${
                            isActive
                              ? 'bg-black text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          <div className="flex items-center gap-3">
                            {getIcon(item.path)}
                            <span className="font-bold">{item.label}</span>
                          </div>
                          {item.count > 0 && (
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-black text-white'
                            }`}>
                              {item.count}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Logout Mobile */}
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-50 hover:bg-red-100 border-2 border-red-500 rounded-2xl transition-all text-red-600 font-bold"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <LogOut className="w-5 h-5" />
                Déconnexion
              </button>
            </div>

            {/* Floating close button */}
            <button
              onClick={() => setShowMobileMenu(false)}
              className="fixed bottom-6 right-6 w-14 h-14 bg-black hover:bg-gray-800 rounded-full shadow-2xl flex items-center justify-center z-20"
            >
              <X className="w-7 h-7 text-white" />
            </button>
          </div>
        </>
      )}

      {/* Click outside dropdowns */}
      {activeDropdown !== null && (
        <div 
          className="fixed inset-0 z-[150]"
          onClick={() => setActiveDropdown(null)}
        ></div>
      )}
    </>
  );
};

export default NavAdmin;