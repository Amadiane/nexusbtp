import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, ArrowUpRight, X, Clock, Calendar } from "lucide-react";
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
  const [hoveredId, setHoveredId]       = useState(null);
  const itemsPerPage = 6;

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await fetch(CONFIG.API_NEWS_LIST, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Erreur " + res.status);
        const data = await res.json();
        const all = Array.isArray(data) ? data : (data.results ?? []);
        const active = all
          .filter(i => i.is_active === true || i.isActive === true)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setNewsList(active);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchNews();
  }, []);

  const loc = (item, base) => {
    const lang = i18n.language;
    return item[`${base}_${lang}`] || item[`${base}_fr`] || item[base] || "";
  };

  const getImage = (item) => {
    if (!item) return null;
    const raw = item.image_url || item.image || null;
    if (!raw) return null;
    if (typeof raw === "string" && (raw.startsWith("/media") || raw.startsWith("media/")))
      return `${CONFIG.BASE_URL}/${raw.replace(/^\//, "")}`;
    return raw;
  };

  const formatDate = (d) => new Date(d).toLocaleDateString(
    i18n.language === "fr" ? "fr-FR" : "en-US",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const readTime = (c) => `${Math.max(1, Math.ceil(c.split(" ").length / 200))} min`;

  const totalPages   = Math.ceil(newsList.length / itemsPerPage);
  const currentItems = newsList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goPage = (n) => { setCurrentPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); };

  /* ── Loading ─────────────────────────────────────────────── */
  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 48, height: 48, border: `2px solid #f0f0f0`, borderTopColor: NAVY, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#999", fontFamily: "sans-serif" }}>Chargement</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>⚠</p>
        <p style={{ color: "#666", marginBottom: 24 }}>{error}</p>
        <button onClick={() => window.location.reload()} style={{ padding: "12px 32px", background: NAVY, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>
          Réessayer
        </button>
      </div>
    </div>
  );

  /* ── Main ────────────────────────────────────────────────── */
  return (
    <div style={{ background: "#fff", minHeight: "100vh", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { to { transform:rotate(360deg); } }
        .news-card { transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s; }
        .news-card:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(0,56,147,0.12); }
        .news-img { transition: transform 0.6s cubic-bezier(0.22,1,0.36,1); }
        .news-card:hover .news-img { transform: scale(1.06); }
        .arrow-btn { transition: transform 0.2s, background 0.2s; }
        .arrow-btn:hover { transform: scale(1.12); background: ${ORANGE} !important; }
        .modal-enter { animation: fadeUp 0.35s cubic-bezier(0.22,1,0.36,1); }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ padding: "120px 48px 80px", borderBottom: "1px solid #f0f0f0", maxWidth: 1600, margin: "0 auto" }}>

        {/* eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
          <div style={{ width: 32, height: 2, background: ORANGE }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: ORANGE }}>
            {t("news.sectionLabel", "Actualités")}
          </span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", animation: "spin 3s linear infinite" }} />
            <span style={{ fontSize: 11, color: "#999", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {newsList.length} {t("news.totalArticles", "articles")}
            </span>
          </div>
        </div>

        {/* giant title */}
        <h1 style={{
          fontSize: "clamp(56px, 10vw, 128px)",
          fontWeight: 900,
          letterSpacing: "-0.03em",
          lineHeight: 0.9,
          color: "#0a0a0a",
          marginBottom: 32,
          fontFamily: "'Creato Display', 'DM Sans', sans-serif",
        }}>
          {t("news.title", "Actua")}
          {/* <span style={{ color: NAVY }}>lités</span> */}
          <span style={{ color: ORANGE, fontSize: "0.35em", fontWeight: 400, letterSpacing: "0.1em", verticalAlign: "super", marginLeft: 8 }}>
            NEXUS BTP
          </span>
        </h1>

        <p style={{ fontSize: 18, color: "#666", maxWidth: 560, lineHeight: 1.7, fontWeight: 300 }}>
          {t("news.subtitle", "Découvrez nos dernières publications, projets et actualités du secteur BTP.")}
        </p>
      </section>

      {/* ── GRID ─────────────────────────────────────────────── */}
      <section style={{ padding: "72px 48px 80px", maxWidth: 1600, margin: "0 auto" }}>

        {newsList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "120px 0" }}>
            <p style={{ fontSize: 64, marginBottom: 16 }}>📰</p>
            <p style={{ color: "#999", fontSize: 18 }}>{t("news.noNews", "Aucune actualité pour le moment")}</p>
          </div>
        ) : (
          <>
            {/* Featured first article */}
            {currentPage === 1 && currentItems[0] && (() => {
              const hero = currentItems[0];
              const img  = getImage(hero);
              const content = loc(hero, "content");
              return (
                <div
                  onClick={() => setSelectedNews(hero)}
                  className="news-card"
                  style={{
                    display: "grid", gridTemplateColumns: img ? "1fr 1fr" : "1fr",
                    gap: 0, borderRadius: 20, overflow: "hidden",
                    border: "1px solid #e8e8e8", marginBottom: 48,
                    cursor: "pointer", background: "#fff",
                    animation: "fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both",
                  }}
                >
                  {img && (
                    <div style={{ position: "relative", overflow: "hidden", minHeight: 420 }}>
                      <img className="news-img" src={img} alt={loc(hero, "title")}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,56,147,0.3), transparent)" }} />
                      <div style={{ position: "absolute", top: 20, left: 20, background: NAVY, color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 20 }}>
                        À la une
                      </div>
                    </div>
                  )}
                  <div style={{ padding: "48px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                        <span style={{ fontSize: 11, color: "#999", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          {formatDate(hero.created_at)}
                        </span>
                        <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#ddd" }} />
                        <span style={{ fontSize: 11, color: "#999" }}>{readTime(content)}</span>
                      </div>
                      <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em", color: "#0a0a0a", marginBottom: 16, fontFamily: "'Creato Display', sans-serif" }}>
                        {loc(hero, "title")}
                      </h2>
                      <p style={{ fontSize: 15, color: "#666", lineHeight: 1.8, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {content}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 28, borderTop: "1px solid #f0f0f0", marginTop: 28 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>
                        {t("news.readMore", "Lire l'article")}
                      </span>
                      <button className="arrow-btn" style={{ width: 44, height: 44, borderRadius: "50%", background: NAVY, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ArrowRight size={18} color="#fff" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Rest of articles — masonry-style numbered grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
              {(currentPage === 1 ? currentItems.slice(1) : currentItems).map((item, idx) => {
                const img     = getImage(item);
                const content = loc(item, "content");
                const num     = String((currentPage - 1) * itemsPerPage + idx + (currentPage === 1 ? 2 : 1)).padStart(2, "0");

                return (
                  <article
                    key={item.id}
                    onClick={() => setSelectedNews(item)}
                    className="news-card"
                    style={{
                      borderRadius: 16, overflow: "hidden", cursor: "pointer",
                      border: "1px solid #ebebeb", background: "#fff",
                      animation: `fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) ${idx * 0.07}s both`,
                      display: "flex", flexDirection: "column",
                    }}
                  >
                    {/* Image zone */}
                    <div style={{ position: "relative", height: 220, overflow: "hidden", background: "#f5f5f5", flexShrink: 0 }}>
                      {img ? (
                        <img className="news-img" src={img} alt={loc(item, "title")}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={e => { e.target.parentElement.style.background = `linear-gradient(135deg, ${NAVY}15, ${ORANGE}10)`; e.target.style.display = "none"; }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${NAVY}10, ${ORANGE}08)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 48, opacity: 0.15, fontWeight: 900, color: NAVY }}>N</span>
                        </div>
                      )}
                      {/* Number badge */}
                      <div style={{
                        position: "absolute", top: 14, left: 14,
                        width: 36, height: 36, borderRadius: "50%",
                        background: "rgba(255,255,255,0.95)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 800, color: NAVY, letterSpacing: "-0.02em",
                      }}>{num}</div>
                      {/* Gradient overlay */}
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }} />
                      {/* Nexus stripe */}
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${NAVY}, ${ORANGE})` }} />
                    </div>

                    {/* Content */}
                    <div style={{ padding: "22px 24px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <Calendar size={11} color="#aaa" />
                        <span style={{ fontSize: 11, color: "#aaa", letterSpacing: "0.06em" }}>{formatDate(item.created_at)}</span>
                        <span style={{ marginLeft: "auto", fontSize: 10, color: "#bbb" }}>{readTime(content)}</span>
                      </div>

                      <h3 style={{
                        fontSize: 17, fontWeight: 800, lineHeight: 1.3, letterSpacing: "-0.01em",
                        color: "#0a0a0a", marginBottom: 10, flex: 1,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                        fontFamily: "'Creato Display', sans-serif",
                      }}>
                        {loc(item, "title")}
                      </h3>

                      <p style={{
                        fontSize: 13, color: "#888", lineHeight: 1.7, marginBottom: 18,
                        display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
                      }}>
                        {content}
                      </p>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid #f5f5f5" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>
                          {t("news.readMore", "Lire la suite")}
                        </span>
                        <button className="arrow-btn" style={{ width: 34, height: 34, borderRadius: "50%", background: NAVY, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <ArrowUpRight size={14} color="#fff" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 64 }}>
                <button onClick={() => goPage(currentPage - 1)} disabled={currentPage === 1}
                  style={{ width: 42, height: 42, borderRadius: 10, border: "1px solid #e0e0e0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: currentPage === 1 ? 0.3 : 1 }}>
                  ←
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => goPage(i + 1)}
                    style={{
                      width: 42, height: 42, borderRadius: 10, border: "none", cursor: "pointer",
                      fontWeight: 700, fontSize: 14, transition: "all 0.2s",
                      background: currentPage === i + 1 ? NAVY : "#f5f5f5",
                      color: currentPage === i + 1 ? "#fff" : "#555",
                      transform: currentPage === i + 1 ? "scale(1.1)" : "scale(1)",
                    }}>{i + 1}</button>
                ))}
                <button onClick={() => goPage(currentPage + 1)} disabled={currentPage === totalPages}
                  style={{ width: 42, height: 42, borderRadius: 10, border: "1px solid #e0e0e0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: currentPage === totalPages ? 0.3 : 1 }}>
                  →
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── MODAL ────────────────────────────────────────────── */}
      {selectedNews && (() => {
        const img     = getImage(selectedNews);
        const content = loc(selectedNews, "content");
        const title   = loc(selectedNews, "title");
        return (
          <div
            onClick={() => setSelectedNews(null)}
            style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", overflowY: "auto", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 24px" }}
          >
            <div
              className="modal-enter"
              onClick={e => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 820, overflow: "hidden", position: "relative" }}
            >
              {/* Close */}
              <button onClick={() => setSelectedNews(null)}
                style={{ position: "absolute", top: 20, right: 20, zIndex: 10, width: 44, height: 44, borderRadius: 12, background: "rgba(0,0,0,0.7)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = NAVY}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.7)"}
              >
                <X size={18} color="#fff" />
              </button>

              {/* Hero image */}
              {img && (
                <div style={{ height: 360, overflow: "hidden", position: "relative" }}>
                  <img src={img} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${NAVY}, ${ORANGE})` }} />
                </div>
              )}

              {/* Content */}
              <div style={{ padding: "40px 48px 48px" }}>
                {/* Meta */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 28, height: 2, background: ORANGE }} />
                  <span style={{ fontSize: 11, color: "#999", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    {formatDate(selectedNews.created_at)}
                  </span>
                  <span style={{ fontSize: 11, color: "#ccc" }}>·</span>
                  <span style={{ fontSize: 11, color: "#999" }}>{readTime(content)}</span>
                </div>

                {/* Title */}
                <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#0a0a0a", marginBottom: 28, fontFamily: "'Creato Display', sans-serif" }}>
                  {title}
                </h2>

                {/* Body */}
                <p style={{ fontSize: 16, color: "#555", lineHeight: 1.85, whiteSpace: "pre-wrap", fontWeight: 300 }}>
                  {content}
                </p>

                {/* Footer */}
                <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={() => setSelectedNews(null)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 28px", background: NAVY, color: "#fff", border: "none", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14, transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#001f5c"}
                    onMouseLeave={e => e.currentTarget.style.background = NAVY}
                  >
                    <ArrowRight size={16} style={{ transform: "rotate(180deg)" }} />
                    {t("news.backToNews", "Retour")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default Actualites;