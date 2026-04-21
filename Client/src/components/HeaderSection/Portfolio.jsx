import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowUp } from "lucide-react";
import CONFIG from "../../config/config.js";

/**
 * 🎨 PORTFOLIO - Design ultra moderne avec asymétrie
 * Images espacées, tailles variées, disposition dynamique
 */

const Portfolio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.toUpperCase().substring(0, 2);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    
    const fetchProject = async () => {
      try {
        const res = await fetch(`${CONFIG.BASE_URL}/api/portfolio/${id}/`);
        if (!res.ok) throw new Error('Project not found');
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error('Fetch error:', err);
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id, navigate]);

  const getText = (field) => {
    if (!project) return '';
    return currentLang === 'FR' 
      ? (project[`${field}_fr`] || project[`${field}_en`] || '')
      : (project[`${field}_en`] || project[`${field}_fr`] || '');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('portfolio.not_found') || 'Project not found'}</h2>
          <button 
            onClick={() => navigate('/projects')}
            className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
          >
            {t('portfolio.back_projects') || 'Back to Projects'}
          </button>
        </div>
      </div>
    );
  }

  const projectName = getText('project_name');
  const location = getText('location');
  const descriptionTitle = getText('description_title');
  const description = getText('description');
  const client = getText('client');
  const surface = getText('surface');
  const completionDate = getText('completion_date');
  
  const allImages = Array.from({ length: 20 }, (_, i) => 
    project[`image_${i+1}_url`]
  ).filter(Boolean);

  return (
    <div className="min-h-screen bg-white">

      {/* IMAGE DE COUVERTURE - FULL SCREEN SANS MARGES */}
      {project.cover_photo_url && (
        <div className="relative w-screen h-screen -mx-[50vw] left-1/2 right-1/2">
          <img
            src={project.cover_photo_url}
            alt={projectName}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay pour meilleure lisibilité si vous voulez ajouter du texte */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none"></div>
        </div>
      )}

      {/* CONTENU - AVEC PADDING */}
      <div className="px-6 lg:px-16 py-20">
        <div className="max-w-[1600px] mx-auto">
          
          {/* TITRE + LOCALISATION */}
          <div className="mb-20">
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 leading-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {projectName || `Project ${project.id}`}
            </h1>
            
            {location && (
              <p 
                className="text-lg text-gray-600 font-light"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {location}
              </p>
            )}
          </div>
          
          {/* LAYOUT 2 COLONNES - DESCRIPTION + INFOS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32 mb-20">
            
            {/* COLONNE GAUCHE - Description */}
            <div className="lg:col-span-6">
              {descriptionTitle && (
                <h2 
                  className="text-xl font-bold text-black mb-6"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {descriptionTitle}
                </h2>
              )}
              
              {description && (
                <div 
                  className="text-sm text-gray-700 leading-relaxed space-y-4"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {description.split('\n').map((para, idx) => (
                    para.trim() && <p key={idx}>{para}</p>
                  ))}
                </div>
              )}
            </div>

            {/* COLONNE DROITE - Détails */}
            <div className="lg:col-span-6">
              <div className="space-y-6 lg:pl-20">
                {client && (
                  <div>
                    <p className="text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <span className="font-bold text-black">{t('portfolio.client') || 'Client'}: </span>
                      <span className="text-gray-600">{client}</span>
                    </p>
                  </div>
                )}
                
                {surface && (
                  <div>
                    <p className="text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <span className="font-bold text-black">{t('portfolio.size') || 'Size'}: </span>
                      <span className="text-gray-600">{surface}</span>
                    </p>
                  </div>
                )}
                
                {completionDate && (
                  <div>
                    <p className="text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <span className="font-bold text-black">{t('portfolio.completion_date') || 'Completion Date'}: </span>
                      <span className="text-gray-600">{completionDate}</span>
                    </p>
                  </div>
                )}

                {project.category && (
                  <div>
                    <p className="text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <span className="font-bold text-black">{t('portfolio.category') || 'Category'}: </span>
                      <span className="text-gray-600">
                        {project.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🎨 GALLERY ULTRA MODERNE - Disposition asymétrique variée */}
      {allImages.length > 0 && (
        <div className="px-6 lg:px-16 mb-20">
          <div className="max-w-[1400px] mx-auto">
            <div className="space-y-24">
              {allImages.map((imageUrl, index) => {
                // Pattern qui se répète tous les 4 images
                const patterns = [
                  { width: '65%', align: 'left' },    // Moyenne gauche
                  { width: '80%', align: 'right' },   // Large droite
                  { width: '55%', align: 'center' },  // Petite centrée
                  { width: '90%', align: 'left' },    // Très large gauche
                ];
                
                const pattern = patterns[index % 4];
                
                let alignmentClass = '';
                if (pattern.align === 'left') {
                  alignmentClass = 'mr-auto';
                } else if (pattern.align === 'right') {
                  alignmentClass = 'ml-auto';
                } else {
                  alignmentClass = 'mx-auto';
                }
                
                return (
                  <div
                    key={index}
                    className={`relative ${alignmentClass}`}
                    style={{
                      width: pattern.width,
                      maxWidth: '100%',
                    }}
                  >
                    <div className="relative overflow-hidden bg-gray-50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                      <img
                        src={imageUrl}
                        alt={`${projectName} - Image ${index + 1}`}
                        className="w-full h-auto object-cover"
                        style={{
                          display: 'block',
                          maxWidth: '100%',
                          height: 'auto',
                        }}
                        loading="lazy"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bouton Retour en bas */}
      <div className="px-6 lg:px-16 py-16 border-t border-gray-200">
        <div className="max-w-[1600px] mx-auto text-center">
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-3 text-base font-bold text-black hover:gap-4 transition-all duration-300"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <ArrowLeft className="w-6 h-6" />
            {t('portfolio.back_all') || 'Back to All Projects'}
          </button>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 hover:scale-110 transition-all duration-300 shadow-2xl z-50 group"
          aria-label={t('portfolio.scroll_top') || 'Retour en haut'}
        >
          <ArrowUp className="w-7 h-7 group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      )}
    </div>
  );
};

export default Portfolio;