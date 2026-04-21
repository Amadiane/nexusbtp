import React, { useEffect, useState } from "react";
import { Users, AlertCircle, Linkedin, Mail, ArrowRight, Crown } from "lucide-react";
import { useTranslation } from "react-i18next";
import CONFIG from "../../config/config.js";

/**
 * 🏗️ ÉQUIPE BETCOM AI - CHARTE GRAPHIQUE BETCOM
 * Police Poppins partout selon la charte
 * Titre massif comme "Rejoignez notre équipe"
 * Photos en noir & blanc → couleur au survol
 */

const LoadingSpinner = ({ t }) => (
  <div className="flex flex-col justify-center items-center py-40">
    <div className="w-16 h-16 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
    <span 
      className="text-sm text-gray-400 mt-6 tracking-widest uppercase"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {t('team.loading')}
    </span>
  </div>
);

const NotreEquipe = () => {
  const { t } = useTranslation();
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const normalizeUrl = (url) => {
      if (!url) return null;
      if (url.startsWith("http")) return url;
      if (url.startsWith("/")) return `${CONFIG.BASE_URL}${url}`;
      return `${CONFIG.BASE_URL}/${url}`;
    };

    const fetchEquipe = async () => {
      try {
        setError(null);
        const res = await fetch(CONFIG.API_TEAM_LIST);
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        
        const data = await res.json();
        const teamData = Array.isArray(data) ? data : data.results || [];
        const activeMembres = teamData.filter(m => m.is_active === true);
        
        const normalized = activeMembres.map((m) => ({
          ...m,
          photo_url: normalizeUrl(m.photo_url || m.photo),
          cover_image: normalizeUrl(m.cover_image),
        }));
        
        const sorted = normalized.sort((a, b) => {
          if (a.created_at && b.created_at) return new Date(a.created_at) - new Date(b.created_at);
          return a.id - b.id;
        });
        
        setMembres(sorted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipe();
  }, []);

  const dirigeants = membres.filter(m => m.role === "dirigeant" || m.is_leader === true);
  const employes = membres.filter(m => m.role !== "dirigeant" && !m.is_leader);

  return (
    <div className="min-h-screen bg-white">
      
      {/* Cover Image - Full Width en haut */}
      {membres.length > 0 && membres[0]?.cover_image && (
        <div className="relative w-full h-[60vh] md:h-[70vh] bg-black">
          <img
            src={membres[0].cover_image}
            alt="Team Cover"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        </div>
      )}
      
      {/* Hero Section - Présentation comme la capture */}
      <section className="relative pt-20 pb-16 px-6 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Colonne Gauche - Titre */}
            <div>
              <h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-black mb-0"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {t('team.title') || 'Une équipe, une culture, l\'excellence'}
              </h1>
            </div>

            {/* Colonne Droite - Description */}
            <div className="space-y-6">
              <p 
                className="text-lg md:text-xl text-gray-700 leading-relaxed"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {t('team.subtitle') || 'Portés par la passion du détail et l\'ambition d\'innover, nous plaçons l\'humain et le contexte au cœur de chaque conception.'}
              </p>
              <p 
                className="text-lg md:text-xl text-gray-700 leading-relaxed"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <strong>Bâtir des espaces qui inspirent, résistent et racontent une histoire.</strong>
              </p>

              {/* Stats Line */}
              <div className="flex flex-wrap items-center gap-6 md:gap-10 pt-8 text-sm">
                <div>
                  <span 
                    className="text-black font-bold text-2xl md:text-3xl block"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {membres.length}
                  </span>
                  <span 
                    className="text-gray-500 uppercase tracking-wider text-xs"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {t('team.stats.members') || 'Membres'}
                  </span>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div>
                  <span 
                    className="text-black font-bold text-2xl md:text-3xl block"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {dirigeants.length}
                  </span>
                  <span 
                    className="text-gray-500 uppercase tracking-wider text-xs"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {t('team.stats.leaders') || 'Dirigeants'}
                  </span>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div>
                  <span 
                    className="text-black font-bold text-2xl md:text-3xl block"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {employes.length}
                  </span>
                  <span 
                    className="text-gray-500 uppercase tracking-wider text-xs"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {t('team.stats.experts') || 'Experts'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Grid Section */}
      <section className="relative py-20 px-6 lg:px-16">
        <div className="max-w-[1800px] mx-auto">

          {loading && <LoadingSpinner t={t} />}

          {error && !loading && (
            <div className="max-w-2xl mx-auto p-12 border border-red-200 rounded-2xl text-center bg-red-50">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 
                className="text-xl font-bold mb-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {t('team.error.title')}
              </h3>
              <p 
                className="text-gray-600 mb-6"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {error}
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {t('team.error.retry')}
              </button>
            </div>
          )}

          {!loading && !error && membres.length === 0 && (
            <div className="max-w-2xl mx-auto p-12 border border-gray-200 rounded-2xl text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 
                className="text-xl font-bold mb-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {t('team.noMembers.title')}
              </h3>
              <p 
                className="text-gray-500"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {t('team.noMembers.subtitle')}
              </p>
            </div>
          )}

          {!loading && !error && membres.length > 0 && (
            <>
              {/* DIRIGEANTS */}
              {dirigeants.length > 0 && (
                <div className="mb-32">
                  <div className="mb-16">
                    <div className="flex items-center gap-4 mb-4">
                      <h2 
                        className="text-5xl md:text-6xl font-bold text-black tracking-tight"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {t('team.leadership.title')}
                      </h2>
                      <Crown className="w-10 h-10 text-black" />
                    </div>
                    <div className="w-24 h-1 bg-black"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {dirigeants.map((membre, i) => (
                      <article
                        key={membre.id}
                        onMouseEnter={() => setHoveredId(membre.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className="group relative cursor-pointer"
                        style={{ animation: `fadeIn 0.8s ease-out ${i * 0.1}s both` }}
                      >
                        {/* Photo Container */}
                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-6">
                          <img
                            src={membre.photo_url || "https://placehold.co/800x1000/f5f5f5/000000?text=Photo"}
                            alt={membre.full_name}
                            style={{
                              filter: hoveredId === membre.id ? 'grayscale(0%)' : 'grayscale(100%)',
                              transform: hoveredId === membre.id ? 'scale(1.05)' : 'scale(1)',
                              transition: 'all 0.7s ease'
                            }}
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.src = "https://placehold.co/800x1000/f5f5f5/000000?text=Photo"}
                          />
                          
                          {/* Overlay progressif */}
                          <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-700 ${
                            hoveredId === membre.id ? 'opacity-0' : 'opacity-100'
                          }`}></div>

                          {/* Badge Leader */}
                          <div className={`absolute top-4 right-4 transition-all duration-500 ${
                            hoveredId === membre.id ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
                          }`}>
                            <div className="px-3 py-1.5 bg-black/80 backdrop-blur-sm rounded-full flex items-center gap-2">
                              <Crown className="w-4 h-4 text-white" />
                              <span 
                                className="text-xs font-bold text-white uppercase tracking-wider"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                              >
                                {t('team.leadership.badge')}
                              </span>
                            </div>
                          </div>

                          {/* Social Links Overlay */}
                          <div className={`absolute inset-0 bg-black/80 flex items-center justify-center gap-4 transition-all duration-500 ${
                            hoveredId === membre.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                          }`}>
                            {membre.linkedin && (
                              <a
                                href={membre.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all transform hover:scale-110"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Linkedin className="w-6 h-6" />
                              </a>
                            )}
                            {membre.email && (
                              <a
                                href={`mailto:${membre.email}`}
                                className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all transform hover:scale-110"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Mail className="w-6 h-6" />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Info */}
                        <div>
                          <h3 
                            className="text-2xl md:text-3xl font-bold text-black mb-2 tracking-tight group-hover:underline underline-offset-4 transition-all"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            {membre.full_name}
                          </h3>
                          <p 
                            className="text-base md:text-lg text-gray-600 font-medium mb-4"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            {membre.position_fr || t('team.leadership.defaultPosition')}
                          </p>
                          {membre.bio_fr && (
                            <p 
                              className="text-sm md:text-base text-gray-500 leading-relaxed line-clamp-3"
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              {membre.bio_fr}
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* EMPLOYÉS */}
              {employes.length > 0 && (
                <div>
                  <div className="mb-16">
                    <h2 
                      className="text-5xl md:text-6xl font-bold text-black mb-4 tracking-tight"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {t('team.members.title')}
                    </h2>
                    <div className="w-24 h-1 bg-black"></div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                    {employes.map((membre, i) => (
                      <article
                        key={membre.id}
                        onMouseEnter={() => setHoveredId(membre.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className="group relative cursor-pointer"
                        style={{ animation: `fadeIn 0.6s ease-out ${i * 0.05}s both` }}
                      >
                        {/* Photo Container */}
                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                          <img
                            src={membre.photo_url || "https://placehold.co/600x800/f5f5f5/666666?text=Photo"}
                            alt={membre.full_name}
                            style={{
                              filter: hoveredId === membre.id ? 'grayscale(0%)' : 'grayscale(100%)',
                              transform: hoveredId === membre.id ? 'scale(1.1)' : 'scale(1)',
                              transition: 'all 0.7s ease'
                            }}
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.src = "https://placehold.co/600x800/f5f5f5/666666?text=Photo"}
                          />
                          
                          {/* Overlay */}
                          <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-700 ${
                            hoveredId === membre.id ? 'opacity-0' : 'opacity-100'
                          }`}></div>

                          {/* Quick Actions */}
                          <div className={`absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-500 ${
                            hoveredId === membre.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                          }`}>
                            {membre.linkedin && (
                              <a
                                href={membre.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-2 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all text-sm font-semibold transform hover:scale-105"
                                onClick={(e) => e.stopPropagation()}
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                              >
                                <Linkedin className="w-4 h-4" />
                              </a>
                            )}
                            {membre.email && (
                              <a
                                href={`mailto:${membre.email}`}
                                className="w-10 h-10 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-black hover:text-white transition-all transform hover:scale-105"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Mail className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Info */}
                        <div>
                          <h4 
                            className="text-base md:text-lg font-bold text-black mb-1 truncate group-hover:underline underline-offset-2 transition-all"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            {membre.full_name}
                          </h4>
                          <p 
                            className="text-sm text-gray-600 truncate"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            {membre.position_fr || t('team.members.defaultPosition')}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!loading && !error && membres.length > 0 && (
        <section className="relative py-32 px-6 lg:px-16 border-t border-black bg-gray-50">
          <div className="max-w-[1800px] mx-auto">
            <div className="max-w-4xl">
              <h2 
                className="text-5xl md:text-7xl font-bold text-black mb-8 tracking-tight leading-tight"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {t('team.cta.title')}
              </h2>
              <p 
                className="text-xl md:text-2xl text-gray-600 mb-12 font-light max-w-2xl leading-relaxed"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {t('team.cta.description')}
              </p>
              <a
                href="/services"
                className="group inline-flex items-center gap-4 text-xl font-bold text-black hover:gap-6 transition-all duration-300"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {t('team.cta.button')}
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default NotreEquipe;