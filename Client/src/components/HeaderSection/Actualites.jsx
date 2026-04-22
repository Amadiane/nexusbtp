import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Calendar, Loader2, X, ArrowRight, Clock, Newspaper,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import CONFIG from "../../config/config.js";

const NAVY   = "#003893";
const ORANGE = "#EA580C";

const Actualites = () => {
  const { t, i18n } = useTranslation();

  const [newsList, setNewsList]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [currentPage, setCurrentPage]   = useState(1);
  const itemsPerPage = 7; // 1 hero + 6 grille

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  // ── Fetch ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setError(null);
        const token = localStorage.getItem("access");
        const res = await fetch(CONFIG.API_NEWS_LIST, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Erreur HTTP : " + res.status);
        const data = await res.json();

        // Gère tableau direct ET réponse paginée {count, results:[]}
        const all = Array.isArray(data) ? data : (data.results ?? []);

        // Seuls les articles actifs, triés du plus récent
        const active = all
          .filter(item => item.is_active === true || item.isActive === true)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setNewsList(active);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // ── Helpers ────────────────────────────────────────────────────
  // Champs bilingues title_fr / title_en  et  content_fr / content_en
  const loc = (item, base) => {
    const lang = i18n.language;
    return item[`${base}_${lang}`] || item[`${base}_fr`] || item[base] || "";
  };

  // Debug — affiche le 1er item pour voir les champs réels de l'API
  useEffect(() => {
    if (newsList.length > 0) {
      console.log("📰 Champs d'un article News :", Object.keys(newsList[0]));
      console.log("📸 Valeurs image :", {
        image: newsList[0].image,
        image_url: newsList[0].image_url,
        photo: newsList[0].photo,
      });
    }
  }, [newsList]);

  // CloudinaryField → image_url est toujours une URL absolue https://res.cloudinary.com/...
  // On garde le fallback /media/ pour dev local si jamais
  const getImage = (item) => {
    if (!item) return null;
    const raw = item.image_url || item.image || null;
    if (!raw) return null;
    if (typeof raw === "string" && (raw.startsWith("/media") || raw.startsWith("media/"))) {
      return `${CONFIG.BASE_URL}/${raw.replace(/^\//, "")}`;
    }
    return raw;
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString(i18n.language === "fr" ? "fr-FR" : "en-US", {
      year: "numeric", month: "long", day: "numeric",
    });

  const readTime = (content) => `${Math.max(1, Math.ceil(content.split(" ").length / 200))} min`;

  // ── Pagination ─────────────────────────────────────────────────
  const totalPages   = Math.ceil(newsList.length / itemsPerPage);
  const idxLast      = currentPage * itemsPerPage;
  const idxFirst     = idxLast - itemsPerPage;
  const currentItems = newsList.slice(idxFirst, idxLast);

  const goPage = (n) => { setCurrentPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); };

  // ── Loading ────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 border-2 border-gray-200 rounded-full animate-spin mx-auto mb-5"
          style={{ borderTopColor: NAVY }} />
        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
          {t("news.loading", "Chargement...")}
        </p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <X className="w-10 h-10 text-gray-700" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {t("news.errorTitle", "Erreur de chargement")}
        </h2>
        <p className="text-gray-500 mb-8">{error}</p>
        <button onClick={() => window.location.reload()}
          className="px-8 py-4 text-white font-bold rounded-xl transition-all"
          style={{ background: NAVY }}>
          {t("news.retry", "Réessayer")}
        </button>
      </div>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero section ── */}
      <section className="relative pt-40 pb-24 px-6 lg:px-16 border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto">
          <div className="mb-16">
            {/* Accent */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-px" style={{ background: ORANGE }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ORANGE }}>
                {t("news.sectionLabel", "Actualités")}
              </span>
            </div>

            <h1
              className="text-[10vw] md:text-[8vw] lg:text-[110px] font-bold leading-none tracking-tight text-gray-900 mb-8"
              style={{ fontFamily: "'Creato Display', sans-serif" }}
            >
              {t("news.title", "Actualités")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 max-w-2xl font-light leading-relaxed">
              {t("news.subtitle", "Découvrez nos dernières publications et projets.")}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-10 text-sm uppercase tracking-widest">
            <div>
              <span className="font-bold text-3xl md:text-4xl text-gray-900">{newsList.length}</span>
              <span className="text-gray-400 ml-2">{t("news.totalArticles", "articles")}</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: ORANGE }} />
              <span className="text-gray-400">{t("news.live", "En ligne")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Articles ── */}
      <section className="py-20 px-6 lg:px-16">
        <div className="max-w-[1800px] mx-auto">

          {newsList.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Newspaper className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2"
                style={{ fontFamily: "'Creato Display', sans-serif" }}>
                {t("news.noNews", "Aucune actualité")}
              </h3>
              <p className="text-gray-400">{t("news.noNewsDesc", "Revenez bientôt.")}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
                {currentItems.map((item, idx) => {
                  const title   = loc(item, "title");
                  const content = loc(item, "content");
                  const image   = getImage(item);
                  const isHero  = idx === 0 && currentPage === 1;
                  const excerpt = content.slice(0, isHero ? 200 : 130) + "…";

                  return (
                    <article
                      key={item.id}
                      onClick={() => setSelectedNews(item)}
                      className={`group cursor-pointer ${isHero ? "md:col-span-2 lg:col-span-2" : ""}`}
                      style={{ animation: `fadeInUp 0.5s ease-out ${idx * 0.08}s both` }}
                    >
                      <div className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 h-full flex flex-col
                        hover:-translate-y-1 hover:shadow-xl
                        ${isHero ? "border-gray-200 shadow-lg" : "border-gray-100 shadow-sm"}`}
                        style={{ "--hover-border": NAVY }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = `${NAVY}40`}
                        onMouseLeave={e => e.currentTarget.style.borderColor = isHero ? "#e5e7eb" : "#f3f4f6"}
                      >
                        {/* Image */}
                        {image && (
                          <div className={`relative overflow-hidden bg-gray-100 flex-shrink-0 ${isHero ? "h-80 md:h-96" : "h-56"}`}>
                            <img
                              src={image}
                              alt={title}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={e => { e.target.parentElement.style.display = "none"; }}
                            />
                            {/* Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            {/* Read time */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/75 backdrop-blur-sm rounded-full">
                                <Clock className="w-3 h-3 text-white" />
                                <span className="text-xs font-semibold text-white">{readTime(content)}</span>
                              </div>
                            </div>
                            {/* Nexus accent */}
                            <div className="absolute bottom-0 left-0 right-0 h-1"
                              style={{ background: `linear-gradient(90deg, ${NAVY}, ${ORANGE})` }} />
                          </div>
                        )}

                        {/* Content */}
                        <div className={`flex flex-col flex-1 ${isHero ? "p-6 md:p-8" : "p-5"}`}>
                          {/* Date */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              <Calendar className="w-3 h-3" />
                              <time>{formatDate(item.created_at)}</time>
                            </div>
                          </div>

                          {/* Title */}
                          <h3
                            className={`font-bold text-gray-900 mb-3 leading-tight ${isHero ? "text-2xl md:text-3xl line-clamp-3" : "text-lg line-clamp-2"}`}
                            style={{ fontFamily: "'Creato Display', sans-serif" }}
                          >
                            {title}
                          </h3>

                          {/* Excerpt */}
                          <p className={`text-gray-500 leading-relaxed flex-1 ${isHero ? "text-base line-clamp-4" : "text-sm line-clamp-3"}`}>
                            {excerpt}
                          </p>

                          {/* CTA */}
                          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                            <span className="text-sm font-bold text-gray-800">
                              {t("news.readMore", "Lire la suite")}
                            </span>
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110"
                              style={{ background: NAVY }}
                            >
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => goPage(currentPage - 1)} disabled={currentPage === 1}
                    className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => goPage(i + 1)}
                      className="w-11 h-11 rounded-xl font-bold text-sm transition-all"
                      style={currentPage === i + 1
                        ? { background: NAVY, color: "#fff", transform: "scale(1.1)" }
                        : { border: "1px solid #e5e7eb", color: "#374151" }}
                    >{i + 1}</button>
                  ))}

                  <button onClick={() => goPage(currentPage + 1)} disabled={currentPage === totalPages}
                    className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Modal ── */}
      {selectedNews && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(16px)" }}
          onClick={() => setSelectedNews(null)}
        >
          {/* Close */}
          <button
            onClick={() => setSelectedNews(null)}
            className="fixed top-8 right-8 w-14 h-14 text-white rounded-2xl flex items-center justify-center transition-all hover:scale-110 hover:rotate-90 z-50 shadow-xl"
            style={{ background: NAVY }}
          >
            <X size={22} />
          </button>

          <div className="max-w-4xl mx-auto px-6 lg:px-12 py-28 md:py-36" onClick={e => e.stopPropagation()}>
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 font-semibold">
                <Calendar className="w-4 h-4" />
                <time>{formatDate(selectedNews.created_at)}</time>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 font-semibold">
                <Clock className="w-4 h-4" />
                <span>{readTime(loc(selectedNews, "content"))}</span>
              </div>
            </div>

            {/* Accent */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-1 rounded-full" style={{ background: `linear-gradient(90deg, ${NAVY}, ${ORANGE})` }} />
            </div>

            {/* Title */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-10 leading-tight"
              style={{ fontFamily: "'Creato Display', sans-serif" }}
            >
              {loc(selectedNews, "title")}
            </h1>

            {/* Image */}
            {getImage(selectedNews) && (
              <div className="relative w-full h-80 md:h-[500px] mb-12 rounded-2xl overflow-hidden shadow-2xl">
                <img src={getImage(selectedNews)} alt={loc(selectedNews, "title")} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-1"
                  style={{ background: `linear-gradient(90deg, ${NAVY}, ${ORANGE})` }} />
              </div>
            )}

            {/* Content */}
            <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap font-light mb-12"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              {loc(selectedNews, "content")}
            </div>

            {/* Divider */}
            <div className="w-24 h-1 rounded-full mb-8"
              style={{ background: `linear-gradient(90deg, ${NAVY}, ${ORANGE})` }} />

            {/* Back */}
            <button
              onClick={() => setSelectedNews(null)}
              className="inline-flex items-center gap-3 px-8 py-4 text-white font-bold rounded-2xl transition-all hover:gap-5 hover:shadow-xl hover:scale-105"
              style={{ background: NAVY }}
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              {t("news.backToNews", "Retour aux actualités")}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Actualites;