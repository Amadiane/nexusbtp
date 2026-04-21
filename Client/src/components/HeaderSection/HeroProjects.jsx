import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CONFIG from "../../config/config";

const HeroProjects = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLang = i18n.language.toUpperCase().substring(0, 2);

  const [projects, setProjects] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch(`${CONFIG.BASE_URL}/api/portfolio/`)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.results || [];
        setProjects(list.filter(p => p.is_active && p.cover_photo_url));
      });
  }, []);

  useEffect(() => {
    if (!projects.length) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % projects.length);
    }, 6000); // 6 secondes
    return () => clearInterval(timer);
  }, [projects]);

  if (!projects.length) return null;

  const project = projects[index];

  const getText = (field) =>
    currentLang === "FR"
      ? project[`${field}_fr`] || project[`${field}_en`] || ""
      : project[`${field}_en`] || project[`${field}_fr`] || "";

  return (
    <section className="relative w-screen h-screen overflow-hidden -ml-[50vw] left-1/2 right-1/2">
      <img
        src={project.cover_photo_url}
        alt={getText("project_name")}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
      />

      {/* Overlay - Plus subtil */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

      {/* Texte - Design Ultra Moderne */}
      <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 lg:px-24 pb-16 md:pb-20">
        <div className="max-w-7xl">
          {/* Location - Petit texte au-dessus */}
          {getText("location") && (
            <p 
              className="text-sm md:text-base text-white/70 mb-3 tracking-[0.2em] uppercase font-medium"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {getText("location")}
            </p>
          )}

          {/* Titre - Typographie puissante */}
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-8 leading-[0.95] tracking-tight"
            style={{ 
              fontFamily: "'Creato Display', 'Inter', sans-serif",
              letterSpacing: '-0.02em'
            }}
          >
            {getText("project_name")}
          </h1>

          {/* Bouton CTA - Design minimaliste élégant */}
          <button
            onClick={() => navigate(`/portfolio/${project.id}`)}
            className="group inline-flex items-center gap-3 text-white font-semibold text-base md:text-lg pb-2 border-b-2 border-white/40 hover:border-white transition-all duration-300"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              Voir le projet
            </span>
            <svg 
              className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroProjects;