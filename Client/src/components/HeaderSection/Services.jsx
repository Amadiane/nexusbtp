import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  Package, 
  Loader2, 
  AlertCircle, 
  X, 
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle,
  Star
} from "lucide-react";
import CONFIG from "../../config/config.js";

/**
 * 🎨 SERVICES BETCOM AI - ULTRA MODERN
 * Inspiré de v-p.com avec charte Betcom
 * Noir, blanc, gris + images en couleur
 */

const LoadingSpinner = ({ t }) => (
  <div className="flex flex-col justify-center items-center py-40">
    <div className="w-16 h-16 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
    <span className="text-sm text-gray-400 mt-6 tracking-widest uppercase">{t('services.loading')}</span>
  </div>
);

const Services = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setError(null);
        const response = await fetch(CONFIG.API_SERVICE_LIST);
        if (!response.ok) throw new Error(`Erreur ${response.status}`);
        const data = await response.json();
        const list = Array.isArray(data) ? data : data.results || [];
        
        const activeServices = list.filter(service => service.is_active === true);
        setServices(activeServices);
      } catch (err) {
        setError(err.message || "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedService(null);
    document.body.style.overflow = 'unset';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner t={t} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-black" />
          </div>
          <h2 className="text-3xl font-bold text-black mb-3">{t('services.error.title')}</h2>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all duration-300"
          >
            {t('services.error.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section - Style NotreEquipe */}
      <section className="relative pt-40 pb-24 px-6 lg:px-16 border-b border-black">
        <div className="max-w-[1800px] mx-auto">
          
          {/* Title */}
          <div className="mb-20">
            <h1 className="text-[10vw] md:text-[8vw] lg:text-[120px] font-bold leading-none tracking-tight text-black mb-8" style={{ fontFamily: "'Creato Display', sans-serif" }}>
              {t('services.title')}
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 max-w-3xl font-light leading-relaxed">
              {t('services.subtitle')}
            </p>
          </div>

          {/* Stats Line */}
          <div className="flex flex-wrap items-center gap-8 md:gap-16 text-sm uppercase tracking-widest" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <div>
              <span className="text-black font-bold text-3xl md:text-4xl">{services.length}</span>
              <span className="text-gray-400 ml-3">{t('services.stats.services')}</span>
            </div>
            <div className="w-px h-8 bg-gray-300 hidden sm:block"></div>
            <div>
              <span className="text-black font-bold text-3xl md:text-4xl">∞</span>
              <span className="text-gray-400 ml-3">{t('services.stats.solutions')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-20 px-6 lg:px-16">
        <div className="max-w-[1800px] mx-auto">

          {/* Empty State */}
          {!loading && !error && services.length === 0 && (
            <div className="max-w-2xl mx-auto p-12 border border-gray-200 rounded-2xl text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{t('services.empty.title')}</h3>
              <p className="text-gray-500">{t('services.empty.subtitle')}</p>
            </div>
          )}

          {/* Services Grid - Style v-p.com asymétrique */}
          {!loading && !error && services.length > 0 && (
            <>
              {/* Grid asymétrique inspiré de v-p.com */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 md:gap-4 auto-rows-fr">
                {services.map((service, index) => {
                  // Pattern asymétrique: images beaucoup plus compactes
                  let gridClass = '';
                  let aspectRatio = '';
                  
                  if (index === 0) {
                    gridClass = 'lg:col-span-4'; // Hero encore plus réduit
                    aspectRatio = 'aspect-[5/6]'; // Plus compact que 3:4
                  } else if (index === 1) {
                    gridClass = 'lg:col-span-4';
                    aspectRatio = 'aspect-[5/6]';
                  } else if (index === 2) {
                    gridClass = 'lg:col-span-4';
                    aspectRatio = 'aspect-[5/6]';
                  } else if (index % 4 === 3) {
                    gridClass = 'lg:col-span-3';
                    aspectRatio = 'aspect-[5/6]';
                  } else if (index % 4 === 0 && index > 0) {
                    gridClass = 'lg:col-span-3';
                    aspectRatio = 'aspect-[5/6]';
                  } else if (index % 4 === 1) {
                    gridClass = 'lg:col-span-3';
                    aspectRatio = 'aspect-[5/6]';
                  } else {
                    gridClass = 'lg:col-span-3';
                    aspectRatio = 'aspect-[5/6]';
                  }

                  return (
                    <ServiceCard 
                      key={service.id} 
                      service={service} 
                      onClick={handleServiceClick}
                      index={index}
                      gridClass={gridClass}
                      aspectRatio={aspectRatio}
                      hoveredId={hoveredId}
                      setHoveredId={setHoveredId}
                      t={t}
                    />
                  );
                })}
              </div>

              {/* CTA Section */}
              <div className="mt-24 mb-12">
                <div className="max-w-4xl mx-auto">
                  <div className="w-16 h-1 bg-black mb-6 mx-auto"></div>
                  
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 text-center" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                    {t('services.cta.title')}
                  </h2>
                  
                  <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-light text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {t('services.cta.subtitle')}
                  </p>

                  {/* Benefits Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                      { icon: Star, text: t('services.benefits.quality') },
                      { icon: Zap, text: t('services.benefits.fast') },
                      { icon: CheckCircle, text: t('services.benefits.support') },
                      { icon: Sparkles, text: t('services.benefits.creative') }
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-xl hover:border-black transition-all duration-300 hover:-translate-y-1">
                          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mb-3">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-xs font-bold text-gray-900">{item.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* CTA Button */}
                  <div className="text-center">
                    <a
                      href="/contact"
                      className="group inline-flex items-center gap-4 text-xl font-bold text-black hover:gap-6 transition-all duration-300"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {t('services.cta.button')}
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedService && (
        <ServiceModal 
          service={selectedService} 
          onClose={handleCloseModal}
          t={t}
        />
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
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

// Service Card - Style minimaliste v-p.com
const ServiceCard = ({ service, onClick, index, gridClass, aspectRatio, hoveredId, setHoveredId, t }) => {
  const serviceImage = service.image_url || service.image;
  const isHero = index === 0;

  return (
    <div
      onClick={() => onClick(service)}
      onMouseEnter={() => setHoveredId(service.id)}
      onMouseLeave={() => setHoveredId(null)}
      className={`group relative cursor-pointer ${gridClass}`}
      style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
    >
      <div className="relative bg-white border border-gray-200 hover:border-black rounded-xl overflow-hidden transition-all duration-500 h-full hover:-translate-y-0.5 hover:shadow-xl">
        
        {/* Image Container */}
        <div className={`relative overflow-hidden bg-gray-100 ${aspectRatio}`}>
          {serviceImage ? (
            <img
              src={serviceImage}
              alt={service.title}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="text-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-[10px] uppercase tracking-wider">{t('services.card.discover')}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className={`font-bold text-black mb-1.5 leading-tight group-hover:underline underline-offset-2 transition-all ${
            isHero ? 'text-lg md:text-xl' : 'text-base'
          }`} style={{ fontFamily: "'Creato Display', sans-serif" }}>
            {service.title}
          </h3>
          
          {service.description && (
            <p className="text-gray-600 line-clamp-2 text-[11px] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {service.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-2">
            <span className="text-[9px] text-gray-900 font-bold uppercase tracking-wide">
              {t('services.card.learnMore')}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-black" />
          </div>
        </div>

        {/* Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  );
};

// Modal - Style épuré
const ServiceModal = ({ service, onClose, t }) => {
  return (
    <div
      className="fixed inset-0 bg-white/95 backdrop-blur-xl z-50 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        className="fixed top-8 right-8 w-16 h-16 bg-black hover:bg-gray-800 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 z-50 shadow-2xl"
        onClick={onClose}
        aria-label={t('services.modal.close')}
      >
        <X size={28} className="text-white" />
      </button>

      <div
        className="max-w-6xl mx-auto px-6 lg:px-12 py-24 md:py-32"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-10 leading-tight" style={{ fontFamily: "'Creato Display', sans-serif" }}>
          {service.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left - Image */}
          {(service.image_url || service.image) && (
            <div className="space-y-6">
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 border-2 border-gray-200">
                <img
                  src={service.image_url || service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Right - Description */}
          <div className="space-y-8">
            {/* Description */}
            {service.description && (
              <div>
                <div className="w-24 h-1 bg-black mb-6"></div>
                <h2 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                  {t('services.modal.description')}
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {service.description}
                </p>
              </div>
            )}

            {/* Benefits */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h3 className="font-bold text-black mb-4 flex items-center gap-2" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                <Star className="w-5 h-5 text-black" />
                {t('services.modal.benefits.title')}
              </h3>
              <ul className="space-y-3">
                {[
                  t('services.modal.benefits.expertise'),
                  t('services.modal.benefits.results'),
                  t('services.modal.benefits.support'),
                  t('services.modal.benefits.pricing')
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-black flex-shrink-0" />
                    <span style={{ fontFamily: 'Poppins, sans-serif' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="pt-8 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-black" />
                <h3 className="text-xl font-bold text-black" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                  {t('services.modal.cta.title')}
                </h3>
              </div>
              <p className="text-gray-600 mb-6 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {t('services.modal.cta.subtitle')}
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-black hover:bg-gray-800 text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <Sparkles className="w-5 h-5" />
                <span>{t('services.modal.cta.button')}</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;