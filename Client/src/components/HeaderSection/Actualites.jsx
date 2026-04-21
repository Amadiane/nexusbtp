import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  Loader2,
  X,
  ArrowRight,
  Clock,
  TrendingUp,
  Newspaper,
  Sparkles,
  Zap,
} from "lucide-react";
import CONFIG from "../../config/config.js";

/**
 * 🗞️ ACTUALITÉS BETCOM AI - ULTRA MODERN V2
 * Design contemporain avec couleurs vibrantes
 * Glassmorphism, gradients subtils, micro-interactions
 * Charte: Noir, blanc, accents de couleur
 */

const Actualites = () => {
  const { t, i18n } = useTranslation();

  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // 1 hero + 6 regular

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setError(null);
        const response = await fetch(CONFIG.API_NEWS_LIST);
        if (!response.ok) throw new Error("Erreur HTTP : " + response.status);

        const data = await response.json();
        
        const activeNews = data.filter(item => item.is_active === true || item.isActive === true);
        
        const sorted = activeNews.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setNewsList(sorted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const getLocalizedField = (item, base) => {
    const lang = i18n.language;
    return item[`${base}_${lang}`] || item[`${base}_fr`] || item[base] || "";
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(i18n.language === "fr" ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getReadTime = (content) => {
    const words = content.split(" ").length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min`;
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentNews = newsList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(newsList.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">
            {t("news.loading")}
          </p>
        </div>
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
          <h2 className="text-3xl font-bold text-black mb-3">{t("news.errorTitle")}</h2>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all duration-300"
          >
            {t("news.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section - Style Patriarche comme NotreEquipe */}
      <section className="relative pt-40 pb-24 px-6 lg:px-16 border-b border-black">
        <div className="max-w-[1800px] mx-auto">
          
          {/* Title */}
          <div className="mb-20">
            <h1 className="text-[10vw] md:text-[8vw] lg:text-[120px] font-bold leading-none tracking-tight text-black mb-8" style={{ fontFamily: "'Creato Display', sans-serif" }}>
              {t("news.title")}
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 max-w-3xl font-light leading-relaxed">
              {t('news.subtitle')}
            </p>
          </div>

          {/* Stats Line */}
          <div className="flex flex-wrap items-center gap-8 md:gap-16 text-sm uppercase tracking-widest">
            <div>
              <span className="text-black font-bold text-3xl md:text-4xl">{newsList.length}</span>
              <span className="text-gray-400 ml-3">{t("news.totalArticles")}</span>
            </div>
            {/* <div className="w-px h-8 bg-gray-300 hidden sm:block"></div> */}
            {/* <div>
              <span className="text-black font-bold text-3xl md:text-4xl">{totalPages}</span>
              <span className="text-gray-400 ml-3">{t("news.pages")}</span>
            </div> */}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-20 px-6 lg:px-16">
        <div className="max-w-[1800px] mx-auto">
          {newsList.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Newspaper className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Creato Display', sans-serif" }}>{t("news.noNews")}</h3>
              <p className="text-gray-500 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>{t("news.noNewsDesc")}</p>
            </div>
          ) : (
            <>
              {/* Grid Layout - Modern Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {currentNews.map((item, index) => {
                  const title = getLocalizedField(item, "title");
                  const content = getLocalizedField(item, "content");
                  const isHero = index === 0;
                  const excerpt = content.slice(0, isHero ? 180 : 120) + "...";

                  return (
                    <article
                      key={item.id}
                      className={`group cursor-pointer ${
                        isHero ? "md:col-span-2 lg:col-span-2" : ""
                      }`}
                      onClick={() => setSelectedNews(item)}
                      onMouseEnter={() => setHoveredId(item.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                    >
                      <div className={`bg-white rounded-3xl overflow-hidden transition-all duration-500 h-full flex flex-col ${
                        isHero 
                          ? "shadow-2xl hover:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.25)] border-2 border-gray-200 hover:border-gray-300 hover:-translate-y-2" 
                          : "shadow-xl hover:shadow-2xl border border-gray-100 hover:border-gray-200 hover:-translate-y-1"
                      }`}>
                        {/* Image avec overlay au hover */}
                        {item.image_url && (
                          <div className={`relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 ${
                            isHero ? "h-80 md:h-96" : "h-64"
                          }`}>
                            <img
                              src={item.image_url}
                              alt={title}
                              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                              loading="lazy"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                            
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            
                            {/* Reading time badge */}
                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                              <div className="flex items-center gap-2 px-3 py-2 bg-black/80 backdrop-blur-sm rounded-full">
                                <Clock className="w-4 h-4 text-white" />
                                <span className="text-xs font-bold text-white">{getReadTime(content)}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Content - Design moderne avec espacement */}
                        <div className={`flex flex-col flex-1 ${isHero ? "p-6 md:p-8" : "p-5"}`}>
                          {/* Meta - Plus stylisé */}
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 flex-shrink-0 font-semibold uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                              <Calendar className="w-3.5 h-3.5" />
                              <time>{formatDate(item.created_at)}</time>
                            </div>
                          </div>

                          {/* Title - Plus de contraste avec Creato Display */}
                          <h3 className={`font-bold text-gray-900 mb-3 leading-tight transition-colors duration-300 group-hover:underline underline-offset-4 ${
                            isHero ? "text-2xl md:text-3xl lg:text-4xl line-clamp-3" : "text-lg md:text-xl line-clamp-2"
                          }`} style={{ fontFamily: "'Creato Display', sans-serif" }}>
                            {title}
                          </h3>

                          {/* Excerpt - Meilleure lisibilité */}
                          <p className={`text-gray-600 leading-relaxed mb-4 flex-1 ${
                            isHero ? "text-base md:text-lg line-clamp-4" : "text-sm line-clamp-3"
                          }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {excerpt}
                          </p>

                          {/* Read More - Design premium */}
                          <div className={`flex items-center justify-between pt-3 border-t border-gray-100 ${
                            isHero ? "text-base" : "text-sm"
                          }`}>
                            <span className="font-bold text-gray-900 transition-colors duration-300" style={{ fontFamily: 'Poppins, sans-serif' }}>
                              {t("news.readMore")}
                            </span>
                            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shadow-lg shadow-black/20 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                              <ArrowRight className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination - Modern avec noir */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-12" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-12 h-12 rounded-2xl bg-white border-2 border-gray-200 text-gray-900 hover:border-black hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center font-bold shadow-lg hover:shadow-xl"
                    aria-label={t("news.previousPage")}
                  >
                    ←
                  </button>

                  <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-12 h-12 rounded-2xl font-bold transition-all duration-300 ${
                            currentPage === pageNumber
                              ? "bg-black text-white shadow-xl shadow-black/30 scale-110"
                              : "bg-white border-2 border-gray-200 text-gray-700 hover:border-black hover:bg-gray-50 shadow-lg"
                          }`}
                          aria-label={`${t("news.page")} ${pageNumber}`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-12 h-12 rounded-2xl bg-white border-2 border-gray-200 text-gray-900 hover:border-black hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center font-bold shadow-lg hover:shadow-xl"
                    aria-label={t("news.nextPage")}
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Modal - Ultra Modern */}
      {selectedNews && (
        <div
          className="fixed inset-0 bg-white/95 backdrop-blur-xl z-50 overflow-y-auto animate-fadeIn"
          onClick={() => setSelectedNews(null)}
        >
          {/* Close Button - Plus moderne */}
          <button
            className="fixed top-8 right-8 w-16 h-16 bg-black hover:bg-gray-800 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 z-50 shadow-2xl"
            onClick={() => setSelectedNews(null)}
            aria-label={t("news.close")}
          >
            <X size={28} className="text-white" />
          </button>

          <div
            className="max-w-5xl mx-auto px-6 lg:px-12 py-24 md:py-32"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Meta avec design */}
            <div className="flex flex-wrap items-center gap-4 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 font-semibold">
                <Calendar className="w-4 h-4" />
                <time>{formatDate(selectedNews.created_at)}</time>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 font-semibold">
                <Clock className="w-4 h-4" />
                <span>{getReadTime(getLocalizedField(selectedNews, "content"))}</span>
              </div>
            </div>

            {/* Title - Énorme avec Creato Display */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-10 leading-tight" style={{ fontFamily: "'Creato Display', sans-serif" }}>
              {getLocalizedField(selectedNews, "title")}
            </h1>

            {/* Image avec effet */}
            {selectedNews.image_url && (
              <div className="relative w-full h-[400px] md:h-[600px] mb-12 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={selectedNews.image_url}
                  alt={getLocalizedField(selectedNews, "title")}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>
            )}

            {/* Content - Typographie optimisée */}
            <div className="prose prose-xl prose-gray max-w-none mb-12">
              <div className="text-gray-700 text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-light" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {getLocalizedField(selectedNews, "content")}
              </div>
            </div>

            {/* Divider */}
            <div className="w-32 h-1.5 bg-black rounded-full mb-6"></div>

            {/* Back Button - Premium */}
            <button
              onClick={() => setSelectedNews(null)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-black hover:bg-gray-800 text-white font-bold rounded-2xl transition-all duration-300 hover:gap-5 hover:shadow-2xl hover:scale-105"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <ArrowRight className="w-6 h-6 rotate-180" />
              <span>{t("news.backToNews")}</span>
            </button>
          </div>
        </div>
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

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Actualites;