import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import CONFIG from "../../config/config.js";
import { AlertCircle } from "lucide-react";

/**
 * 🏗️ NOS MISSIONS FINAL - OPTION A
 * Images: HISTORIQUE + DIRECTION uniquement
 * Texte seul: VISION + ORGANISATION
 */

const NosMissions = () => {
  const { t, i18n } = useTranslation();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentLang = i18n.language || 'fr';

  const getLocalizedField = (mission, fieldBase) => {
    const localizedField = `${fieldBase}_${currentLang}`;
    return mission[localizedField] || mission[`${fieldBase}_fr`] || mission[fieldBase] || '';
  };

  const fetchMissions = async () => {
    try {
      const res = await axios.get(CONFIG.API_ABOUT_LIST);
      if (Array.isArray(res.data)) {
        setMissions(res.data);
      } else {
        setMissions([]);
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (missions.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-black">{t('missions.empty.title')}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero - Minimaliste extrême */}
      <section className="relative px-6 lg:px-16 pt-32 pb-20">
        <div className="max-w-[1800px] mx-auto">
          {/* Number géant en arrière-plan */}
          <div className="text-[200px] md:text-[300px] lg:text-[400px] font-bold leading-none text-gray-100 absolute top-0 left-0 -z-10 select-none" style={{ fontFamily: "'Creato Display', sans-serif" }}>
            01
          </div>
          
          {/* Title */}
          <div className="relative pt-40">
            <h1 className="text-[15vw] md:text-[12vw] lg:text-[180px] font-bold leading-none tracking-tighter text-black mb-4" style={{ fontFamily: "'Creato Display', sans-serif" }}>
              {t('missions.title')}
            </h1>
            <div className="flex items-center gap-6 mt-8">
              <div className="w-24 h-px bg-black"></div>
              <p className="text-lg md:text-xl text-gray-600 font-light max-w-2xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {t('missions.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-16">
        {missions.map((mission) => (
          <div key={mission.id}>
            
            {/* 02 - HISTORIQUE avec IMAGE */}
            {getLocalizedField(mission, 'historique_title') && (
              <section className="relative py-24 border-t border-gray-200">
                {/* Background Number */}
                <div className="absolute top-12 right-6 lg:right-16 text-[120px] md:text-[180px] lg:text-[240px] font-bold leading-none text-gray-50 select-none -z-10" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                  02
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                  {/* Content */}
                  <div className="lg:col-span-7 space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-px bg-black"></div>
                      <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {t('missions.sections.history')}
                      </span>
                    </div>

                    <h2 className="text-[8vw] md:text-[6vw] lg:text-[80px] font-bold leading-none tracking-tight text-black" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                      {getLocalizedField(mission, 'historique_title')}
                    </h2>

                    <div className="space-y-6">
                      <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed font-light max-w-3xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {getLocalizedField(mission, 'historique_description')}
                      </p>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-px bg-black"></div>
                        <div className="w-1 h-1 bg-black rounded-full"></div>
                        <div className="w-16 h-px bg-gray-300"></div>
                      </div>
                    </div>
                  </div>

                  {/* Image */}
                  {mission.historique_image_url && (
                    <div className="lg:col-span-5">
                      <div className="sticky top-32">
                        <div className="aspect-[3/4] overflow-hidden rounded-lg border border-gray-200">
                          <img
                            src={mission.historique_image_url}
                            alt={getLocalizedField(mission, 'historique_title')}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            loading="eager"
                            decoding="async"
                            style={{ imageRendering: 'crisp-edges' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* 03 - VISION sans image */}
            {getLocalizedField(mission, 'vision_title') && (
              <section className="relative py-24 border-t border-gray-200">
                {/* Background Number */}
                <div className="absolute top-12 right-6 lg:right-16 text-[120px] md:text-[180px] lg:text-[240px] font-bold leading-none text-gray-50 select-none -z-10" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                  03
                </div>

                <div className="max-w-5xl space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-px bg-black"></div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {t('missions.sections.vision')}
                    </span>
                  </div>

                  <h2 className="text-[8vw] md:text-[6vw] lg:text-[80px] font-bold leading-none tracking-tight text-black" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                    {getLocalizedField(mission, 'vision_title')}
                  </h2>

                  <div className="space-y-6">
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed font-light" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {getLocalizedField(mission, 'vision_description')}
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-px bg-black"></div>
                      <div className="w-1 h-1 bg-black rounded-full"></div>
                      <div className="w-16 h-px bg-gray-300"></div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 04 - ORGANISATION sans image */}
            {getLocalizedField(mission, 'organisation_title') && (
              <section className="relative py-24 border-t border-gray-200">
                {/* Background Number */}
                <div className="absolute top-12 right-6 lg:right-16 text-[120px] md:text-[180px] lg:text-[240px] font-bold leading-none text-gray-50 select-none -z-10" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                  04
                </div>

                <div className="max-w-5xl space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-px bg-black"></div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {t('missions.sections.organization')}
                    </span>
                  </div>

                  <h2 className="text-[8vw] md:text-[6vw] lg:text-[80px] font-bold leading-none tracking-tight text-black" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                    {getLocalizedField(mission, 'organisation_title')}
                  </h2>

                  <div className="space-y-6">
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed font-light" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {getLocalizedField(mission, 'organisation_description')}
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-px bg-black"></div>
                      <div className="w-1 h-1 bg-black rounded-full"></div>
                      <div className="w-16 h-px bg-gray-300"></div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 05 - DIRECTION avec IMAGE (grayscale) */}
            {getLocalizedField(mission, 'direction_title') && (
              <section className="relative py-24 border-t border-gray-200">
                {/* Background Number */}
                <div className="absolute top-12 right-6 lg:right-16 text-[120px] md:text-[180px] lg:text-[240px] font-bold leading-none text-gray-50 select-none -z-10" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                  05
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                  {/* Image - Ordre inversé sur desktop */}
                  {mission.direction_image_url && (
                    <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1">
                      <div className="sticky top-32">
                        <div className="aspect-[3/4] overflow-hidden rounded-lg border border-gray-200">
                          <img
                            src={mission.direction_image_url}
                            alt={getLocalizedField(mission, 'direction_title')}
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            loading="eager"
                            decoding="async"
                            style={{ imageRendering: 'crisp-edges' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="lg:col-span-7 lg:col-start-6 space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-px bg-black"></div>
                      <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {t('missions.sections.direction')}
                      </span>
                    </div>

                    <h2 className="text-[8vw] md:text-[6vw] lg:text-[80px] font-bold leading-none tracking-tight text-black" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                      {getLocalizedField(mission, 'direction_title')}
                    </h2>

                    <div className="space-y-6">
                      <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed font-light max-w-3xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {getLocalizedField(mission, 'direction_message')}
                      </p>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-px bg-black"></div>
                        <div className="w-1 h-1 bg-black rounded-full"></div>
                        <div className="w-16 h-px bg-gray-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        ))}
      </div>

      {/* Footer - Ultra minimaliste */}
      <section className="relative px-6 lg:px-16 py-32 mt-32 border-t border-black">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-[8vw] md:text-[6vw] lg:text-[100px] font-bold leading-none text-black mb-8" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                {t('missions.cta.title')}
              </h2>
            </div>
            <div className="flex items-end">
              <div className="space-y-6">
                <p className="text-xl md:text-2xl text-gray-600 font-light" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t('missions.cta.subtitle')}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-px bg-black"></div>
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NosMissions;