import React, { useEffect, useState } from "react";
import { Users, AlertCircle, Linkedin, Mail, ArrowRight, Crown } from "lucide-react";
import { useTranslation } from "react-i18next";
import CONFIG from "../../config/config.js";

const NAVY   = "#003893";
const ORANGE = "#EA580C";

const normalizeUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${CONFIG.BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const NotreEquipe = () => {
  const { t } = useTranslation();
  const [membres, setMembres]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const token = localStorage.getItem("access");
        const res   = await fetch(CONFIG.API_TEAM_LIST, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data   = await res.json();
        const list   = Array.isArray(data) ? data : (data.results ?? []);
        const active = list
          .filter(m => m.is_active === true)
          .map(m => ({ ...m, photo_url: normalizeUrl(m.photo_url || m.photo) }))
          .sort((a, b) => (a.created_at && b.created_at)
            ? new Date(a.created_at) - new Date(b.created_at)
            : a.id - b.id);
        setMembres(active);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetch_();
  }, []);

  const dirigeants = membres.filter(m => m.role === "dirigeant" || m.is_leader === true);
  const employes   = membres.filter(m => m.role !== "dirigeant" && !m.is_leader);

  /* ─── Loading ─────────────────────────────────────── */
  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 44, height: 44, border: `2px solid #f0f0f0`, borderTopColor: NAVY, borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 14px" }} />
        <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#bbb", fontFamily: "sans-serif" }}>
          {t("team.loading", "Chargement")}
        </p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  /* ─── Error ─────────────────────────────────────── */
  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "#fff" }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <AlertCircle size={44} color="#ef4444" style={{ margin: "0 auto 16px" }} />
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{t("team.error.title", "Erreur")}</h3>
        <p style={{ color: "#777", marginBottom: 24, fontSize: 14 }}>{error}</p>
        <button onClick={() => window.location.reload()} style={{ padding: "11px 28px", background: NAVY, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
          {t("team.error.retry", "Réessayer")}
        </button>
      </div>
    </div>
  );

  /* ─── Render ─────────────────────────────────────── */
  return (
    <div style={{ background: "#fff", minHeight: "100vh", fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif" }}>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }

        /* grayscale → color on hover */
        .tc-photo { filter: grayscale(100%); transition: filter .6s ease, transform .6s ease; }
        .tc-card:hover .tc-photo { filter: grayscale(0%); transform: scale(1.05); }

        /* stripe reveal */
        .tc-stripe { transform: scaleX(0); transform-origin: left; transition: transform .4s ease; }
        .tc-card:hover .tc-stripe { transform: scaleX(1); }

        /* social overlay */
        .tc-overlay { opacity: 0; transition: opacity .35s; pointer-events: none; }
        .tc-card:hover .tc-overlay { opacity: 1; pointer-events: auto; }

        /* gradient overlay fade */
        .tc-grad { transition: opacity .5s; }
        .tc-card:hover .tc-grad { opacity: 0 !important; }

        /* badge fade */
        .tc-badge { transition: opacity .35s; }
        .tc-card:hover .tc-badge { opacity: 0; }

        /* underline on name */
        .tc-name { transition: text-decoration .2s; }
        .tc-card:hover .tc-name { text-decoration: underline; text-underline-offset: 4px; }

        /* social btn hover */
        .tc-social-btn:hover { background: #fff !important; color: #000 !important; }

        /* employee quick action */
        .tc-qa { opacity:0; transform:translateY(10px); transition: opacity .3s, transform .3s; pointer-events:none; }
        .tc-card:hover .tc-qa { opacity:1; transform:translateY(0); pointer-events:auto; }

        @media (max-width: 768px) {
          .team-hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .team-dir-grid  { grid-template-columns: 1fr !important; }
          .team-emp-grid  { grid-template-columns: repeat(2, 1fr) !important; }
          .team-hero      { padding: 48px 24px 40px !important; }
          .team-section   { padding: 40px 24px 64px !important; }
          .team-cta       { padding: 56px 24px !important; }
        }
        @media (max-width: 480px) {
          .team-emp-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section className="team-hero" style={{ padding: "80px 48px 64px", maxWidth: 1600, margin: "0 auto" }}>

        {/* Top line */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
          <div style={{ width: 36, height: 2, background: ORANGE }} />
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.24em", textTransform: "uppercase", color: ORANGE }}>
            {t("team.sectionLabel", "Notre équipe")}
          </span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} />
            <span style={{ fontSize: 10, color: "#bbb", letterSpacing: "0.14em", textTransform: "uppercase" }}>
              {membres.length} {t("team.stats.members", "membres")}
            </span>
          </div>
        </div>

        <div className="team-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "flex-start" }}>

          {/* Left — big title */}
          <div>
            <h1 style={{
              fontSize: "clamp(44px, 7vw, 88px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              margin: 0,
              fontFamily: "'Creato Display','DM Sans',sans-serif",
            }}>
              <span style={{ color: "#0a0a0a" }}>{t("team.titleLine1", "Une équipe,")}</span>
              <br />
              <span style={{ color: NAVY }}>{t("team.titleLine2", "une culture,")}</span>
              <br />
              <span style={{ color: ORANGE }}>{t("team.titleLine3", "l'excellence")}</span>
            </h1>
          </div>

          {/* Right — desc + stats */}
          <div style={{ paddingTop: 8 }}>
            <p style={{ fontSize: 16, color: "#666", lineHeight: 1.85, fontWeight: 300, marginBottom: 14 }}>
              {t("team.subtitle", "Portés par la passion du détail et l'ambition d'innover, nous plaçons l'humain au cœur de chaque conception.")}
            </p>
            <p style={{ fontSize: 15, color: "#333", lineHeight: 1.7, fontWeight: 600, marginBottom: 40 }}>
              {t("team.subtitle2", "Bâtir des espaces qui inspirent, résistent et racontent une histoire.")}
            </p>

            {/* Stats */}
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              {[
                { val: membres.length,    label: t("team.stats.members",  "Membres") },
                { val: dirigeants.length, label: t("team.stats.leaders",  "Dirigeants") },
                { val: employes.length,   label: t("team.stats.experts",  "Experts") },
              ].map((s, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <div style={{ width: 1, height: 36, background: "#e8e8e8" }} />}
                  <div>
                    <div style={{ fontSize: 30, fontWeight: 900, color: NAVY, lineHeight: 1, letterSpacing: "-0.02em" }}>{s.val}</div>
                    <div style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 5 }}>{s.label}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #e8e8e8 20%, #e8e8e8 80%, transparent)", maxWidth: 1600, margin: "0 auto" }} />

      {/* ══ TEAM SECTION ══════════════════════════════════ */}
      <section className="team-section" style={{ padding: "64px 48px 80px", maxWidth: 1800, margin: "0 auto" }}>

        {membres.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <Users size={44} color="#e0e0e0" style={{ margin: "0 auto 16px" }} />
            <p style={{ color: "#bbb", fontSize: 15 }}>{t("team.noMembers.title", "Aucun membre pour le moment")}</p>
          </div>
        )}

        {/* ── DIRIGEANTS ─────────────────────────────────── */}
        {dirigeants.length > 0 && (
          <div style={{ marginBottom: 80 }}>
            {/* Section label */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <Crown size={20} color={ORANGE} />
                  <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-0.02em", color: "#0a0a0a", margin: 0, fontFamily: "'Creato Display',sans-serif" }}>
                    {t("team.leadership.title", "Leadership")}
                  </h2>
                </div>
                <div style={{ width: 48, height: 3, background: `linear-gradient(90deg,${NAVY},${ORANGE})`, borderRadius: 2 }} />
              </div>
            </div>

            <div className="team-dir-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 40 }}>
              {dirigeants.map((m, i) => (
                <article key={m.id} className="tc-card"
                  onMouseEnter={() => setHoveredId(m.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ cursor: "default", animation: `fadeUp .7s ease ${i * .1}s both` }}>

                  {/* Photo */}
                  <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: "#f5f5f5", marginBottom: 20 }}>
                    <img className="tc-photo"
                      src={m.photo_url || `https://placehold.co/600x800/f0f4f8/${NAVY.replace("#","")}?text=${encodeURIComponent(m.full_name?.[0]||"N")}`}
                      alt={m.full_name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={e => e.target.src = `https://placehold.co/600x800/f0f4f8/003893?text=Photo`}
                    />

                    {/* Gradient */}
                    <div className="tc-grad" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.22), transparent)", opacity: 1 }} />

                    {/* Leader badge */}
                    <div className="tc-badge" style={{ position: "absolute", top: 14, left: 14, background: NAVY, color: "#fff", fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 20, display: "flex", alignItems: "center", gap: 5 }}>
                      <Crown size={9} /> {t("team.leadership.badge", "Leadership")}
                    </div>

                    {/* Social overlay */}
                    <div className="tc-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.80)", display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
                      {m.linkedin && (
                        <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="tc-social-btn"
                          style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", transition: "all .2s" }}>
                          <Linkedin size={20} />
                        </a>
                      )}
                      {m.email && (
                        <a href={`mailto:${m.email}`} className="tc-social-btn"
                          style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", transition: "all .2s" }}>
                          <Mail size={20} />
                        </a>
                      )}
                    </div>

                    {/* Bottom stripe */}
                    <div className="tc-stripe" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${NAVY},${ORANGE})` }} />
                  </div>

                  {/* Info */}
                  <h3 className="tc-name" style={{ fontSize: 20, fontWeight: 800, color: "#0a0a0a", marginBottom: 4, letterSpacing: "-0.01em", fontFamily: "'Creato Display',sans-serif" }}>
                    {m.full_name}
                  </h3>
                  <p style={{ fontSize: 13, color: NAVY, fontWeight: 600, marginBottom: 8 }}>{m.position_fr}</p>
                  {m.bio_fr && (
                    <p style={{ fontSize: 13, color: "#999", lineHeight: 1.7, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {m.bio_fr}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ── EMPLOYÉS ────────────────────────────────────── */}
        {employes.length > 0 && (
          <div>
            <div style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: "clamp(24px, 3.5vw, 44px)", fontWeight: 900, letterSpacing: "-0.02em", color: "#0a0a0a", marginBottom: 10, fontFamily: "'Creato Display',sans-serif" }}>
                {t("team.members.title", "Notre équipe")}
              </h2>
              <div style={{ width: 48, height: 3, background: `linear-gradient(90deg,${NAVY},${ORANGE})`, borderRadius: 2 }} />
            </div>

            <div className="team-emp-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 24 }}>
              {employes.map((m, i) => (
                <article key={m.id} className="tc-card"
                  onMouseEnter={() => setHoveredId(m.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ cursor: "default", animation: `fadeUp .55s ease ${i * .05}s both` }}>

                  <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: "#f5f5f5", marginBottom: 12 }}>
                    <img className="tc-photo"
                      src={m.photo_url || `https://placehold.co/400x533/f0f4f8/003893?text=Photo`}
                      alt={m.full_name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={e => e.target.src = `https://placehold.co/400x533/f0f4f8/003893?text=Photo`}
                    />
                    <div className="tc-grad" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.18), transparent)", opacity: 1 }} />

                    {/* Quick actions */}
                    <div className="tc-qa" style={{ position: "absolute", bottom: 10, left: 10, right: 10, display: "flex", gap: 6 }}>
                      {m.linkedin && (
                        <a href={m.linkedin} target="_blank" rel="noopener noreferrer"
                          style={{ flex: 1, padding: "7px 0", background: "rgba(255,255,255,.92)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "#000" }}>
                          <Linkedin size={14} />
                        </a>
                      )}
                      {m.email && (
                        <a href={`mailto:${m.email}`}
                          style={{ width: 34, background: "rgba(255,255,255,.92)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "#000" }}>
                          <Mail size={13} />
                        </a>
                      )}
                    </div>

                    <div className="tc-stripe" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${NAVY},${ORANGE})` }} />
                  </div>

                  <h4 className="tc-name" style={{ fontSize: 14, fontWeight: 800, color: "#0a0a0a", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Creato Display',sans-serif" }}>
                    {m.full_name}
                  </h4>
                  <p style={{ fontSize: 12, color: NAVY, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {m.position_fr || t("team.members.defaultPosition", "Consultant")}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ══ CTA ══════════════════════════════════════════ */}
      {!loading && !error && membres.length > 0 && (
        <section className="team-cta" style={{ padding: "64px 48px", borderTop: "1px solid #f0f0f0", background: "#fafafa" }}>
          <div style={{ maxWidth: 1600, margin: "0 auto" }}>
            <div style={{ maxWidth: 600 }}>
              {/* Eyebrow */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 24, height: 2, background: ORANGE }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: ORANGE }}>
                  {t("team.cta.eyebrow", "Carrières")}
                </span>
              </div>

              <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, color: "#0a0a0a", marginBottom: 16, letterSpacing: "-0.02em", fontFamily: "'Creato Display',sans-serif" }}>
                {t("team.cta.title", "Rejoignez notre équipe")}
              </h2>
              <p style={{ fontSize: 16, color: "#777", lineHeight: 1.75, fontWeight: 300, marginBottom: 32 }}>
                {t("team.cta.description", "Vous souhaitez contribuer à des projets ambitieux ? Découvrez nos opportunités.")}
              </p>
              <a href="/contacternous"
                style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "13px 28px", background: NAVY, color: "#fff", borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none", transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#001f5c"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.transform = "translateY(0)"; }}>
                {t("team.cta.button", "Voir nos services")}
                <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default NotreEquipe;