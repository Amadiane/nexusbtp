import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import CONFIG from "../../config/config.js";
import { AlertCircle, ArrowRight } from "lucide-react";

const NAVY   = "#003893";
const ORANGE = "#EA580C";

const NosMissions = () => {
  const { t, i18n } = useTranslation();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading]   = useState(true);

  const lang = i18n.language?.startsWith("en") ? "en" : "fr";
  const lf   = (item, base) =>
    item[`${base}_${lang}`] || item[`${base}_fr`] || item[base] || "";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    axios.get(CONFIG.API_ABOUT_LIST)
      .then(res => setMissions(Array.isArray(res.data) ? res.data : []))
      .catch(() => setMissions([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 44, height: 44, border: `2px solid #f0f0f0`, borderTopColor: NAVY, borderRadius: "50%", animation: "spin .8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (missions.length === 0) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <AlertCircle size={44} color="#ddd" style={{ margin: "0 auto 16px" }} />
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#555" }}>{t("missions.empty.title", "Aucun contenu")}</h3>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#fff", minHeight: "100vh", fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif" }}>
      <style>{`
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        .ms-img { transition: transform .7s ease; }
        .ms-imgwrap:hover .ms-img { transform: scale(1.04); }
        .ms-cta:hover { gap:18px!important; }
        @media(max-width:900px) {
          .ms-hero    { padding:56px 24px 40px!important; }
          .ms-section { padding:48px 24px!important; grid-template-columns:1fr!important; }
          .ms-section-rev { grid-template-columns:1fr!important; }
          .ms-h1 { font-size:clamp(48px,12vw,96px)!important; }
          .ms-num { font-size:80px!important; }
        }
      `}</style>

      {/* ══ HERO ═══════════════════════════════════════════════ */}
      <section className="ms-hero" style={{ padding: "96px 64px 72px", maxWidth: 1600, margin: "0 auto", position: "relative", overflow: "hidden" }}>
        {/* Giant bg number */}
        <div className="ms-num" style={{
          position: "absolute", top: 0, right: -20,
          fontSize: 320, fontWeight: 900, lineHeight: 1,
          color: "#f5f7fa", letterSpacing: "-0.05em", userSelect: "none",
          fontFamily: "'Creato Display','DM Sans',sans-serif", zIndex: 0,
        }}>01</div>

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ width: 36, height: 2, background: ORANGE }} />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.24em", textTransform: "uppercase", color: ORANGE }}>
              {t("missions.eyebrow", "À propos")}
            </span>
          </div>

          {/* Title */}
          <h1 className="ms-h1" style={{
            fontSize: "clamp(64px, 11vw, 160px)",
            fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.9,
            color: "#0a0a0a", margin: "0 0 32px",
            fontFamily: "'Creato Display','DM Sans',sans-serif",
          }}>
            {t("missions.title", "Nos")}<br />
            <span style={{ color: NAVY }}>{t("missions.titleLine2", "Mis")}</span>
            <span style={{ color: ORANGE }}>{t("missions.titleLine3", "sions")}</span>
          </h1>

          {/* Subtitle */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 24, maxWidth: 640 }}>
            <div style={{ width: 2, height: 48, background: `linear-gradient(${NAVY},${ORANGE})`, borderRadius: 2, flexShrink: 0, marginTop: 4 }} />
            <p style={{ fontSize: 18, color: "#666", lineHeight: 1.8, fontWeight: 300, margin: 0 }}>
              {t("missions.subtitle", "Portés par la passion du détail et l'ambition d'innover, nous façonnons les infrastructures de demain.")}
            </p>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#e8e8e8 20%,#e8e8e8 80%,transparent)", maxWidth: 1600, margin: "0 auto" }} />

      {/* ══ SECTIONS ═══════════════════════════════════════════ */}
      {missions.map((m, mi) => {
        const sections = [
          {
            num: "02", key: "historique",
            label: t("missions.sections.history", "Historique"),
            title: lf(m, "historique_title"),
            text:  lf(m, "historique_description"),
            img:   m.historique_image_url,
            imgLeft: false,
          },
          {
            num: "03", key: "vision",
            label: t("missions.sections.vision", "Vision"),
            title: lf(m, "vision_title"),
            text:  lf(m, "vision_description"),
            img:   m.vision_image_url,
            imgLeft: true,
          },
          {
            num: "04", key: "organisation",
            label: t("missions.sections.organization", "Organisation"),
            title: lf(m, "organisation_title"),
            text:  lf(m, "organisation_description"),
            img:   m.organisation_image_url,
            imgLeft: false,
          },
          {
            num: "05", key: "direction",
            label: t("missions.sections.direction", "Direction"),
            title: lf(m, "direction_title"),
            text:  lf(m, "direction_message"),
            img:   m.direction_image_url,
            imgLeft: true,
          },
        ].filter(s => s.title || s.text);

        return (
          <div key={m.id}>
            {sections.map((s, si) => (
              <section key={s.key}
                style={{
                  padding: "80px 64px",
                  maxWidth: 1600, margin: "0 auto",
                  borderTop: si > 0 ? "1px solid #f0f0f0" : "none",
                  animation: `fadeUp .7s ease ${si*.12}s both`,
                }}>

                <div className={s.imgLeft ? "ms-section ms-section-rev" : "ms-section"}
                  style={{
                    display: "grid",
                    gridTemplateColumns: s.img ? (s.imgLeft ? "2fr 3fr" : "3fr 2fr") : "1fr",
                    gap: 80,
                    alignItems: "center",
                  }}>

                  {/* Image — left side */}
                  {s.img && s.imgLeft && (
                    <div className="ms-imgwrap" style={{ position: "relative", overflow: "hidden", borderRadius: 16 }}>
                      <div style={{ aspectRatio: "4/5", overflow: "hidden", borderRadius: 16 }}>
                        <img className="ms-img" src={s.img} alt={s.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      </div>
                      {/* Accent stripe */}
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${NAVY},${ORANGE})` }} />
                      {/* Section number watermark on image */}
                      <div style={{ position: "absolute", top: 16, right: 16, fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,.7)", letterSpacing: "0.16em", background: "rgba(0,0,0,.35)", backdropFilter: "blur(6px)", padding: "4px 10px", borderRadius: 20 }}>
                        {s.num}
                      </div>
                    </div>
                  )}

                  {/* Text content */}
                  <div style={{ position: "relative" }}>
                    {/* Giant bg number */}
                    <div style={{
                      position: "absolute",
                      top: s.imgLeft ? -20 : -10,
                      right: s.imgLeft ? undefined : -10,
                      left: s.imgLeft ? -10 : undefined,
                      fontSize: 160, fontWeight: 900, lineHeight: 1,
                      color: "#f5f7fa", letterSpacing: "-0.04em", userSelect: "none",
                      fontFamily: "'Creato Display',sans-serif", zIndex: 0,
                    }}>{s.num}</div>

                    <div style={{ position: "relative", zIndex: 1 }}>
                      {/* Section label */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                        <div style={{ width: 28, height: 2, background: ORANGE }} />
                        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: ORANGE }}>
                          {s.label}
                        </span>
                      </div>

                      {/* Title */}
                      {s.title && (
                        <h2 style={{
                          fontSize: "clamp(32px, 4vw, 58px)",
                          fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.1,
                          color: "#0a0a0a", margin: "0 0 24px",
                          fontFamily: "'Creato Display','DM Sans',sans-serif",
                        }}>
                          {s.title}
                        </h2>
                      )}

                      {/* Divider */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                        <div style={{ width: 40, height: 2, background: NAVY }} />
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: ORANGE }} />
                        <div style={{ width: 20, height: 1, background: "#e0e0e0" }} />
                      </div>

                      {/* Text */}
                      {s.text && (
                        <div>
                          {s.text.split("\n").filter(p => p.trim()).map((p, i) => (
                            <p key={i} style={{ fontSize: 16, color: "#666", lineHeight: 1.85, fontWeight: 300, marginBottom: 14 }}>{p}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image — right side */}
                  {s.img && !s.imgLeft && (
                    <div className="ms-imgwrap" style={{ position: "relative", overflow: "hidden", borderRadius: 16 }}>
                      <div style={{ aspectRatio: "4/5", overflow: "hidden", borderRadius: 16 }}>
                        <img className="ms-img" src={s.img} alt={s.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      </div>
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${NAVY},${ORANGE})` }} />
                      <div style={{ position: "absolute", top: 16, left: 16, fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,.7)", letterSpacing: "0.16em", background: "rgba(0,0,0,.35)", backdropFilter: "blur(6px)", padding: "4px 10px", borderRadius: 20 }}>
                        {s.num}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        );
      })}

      {/* ══ CTA ════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 64px", borderTop: "1px solid #f0f0f0", background: "#fafafa" }}>
        <div style={{ maxWidth: 1600, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 40 }}>
          <div style={{ maxWidth: 560 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 28, height: 2, background: ORANGE }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: ORANGE }}>
                {t("missions.cta.eyebrow", "Travaillons ensemble")}
              </span>
            </div>
            <h2 style={{
              fontSize: "clamp(32px, 5vw, 64px)",
              fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.05,
              color: "#0a0a0a", margin: "0 0 16px",
              fontFamily: "'Creato Display','DM Sans',sans-serif",
            }}>
              {t("missions.cta.title", "Rejoignez notre équipe")}
            </h2>
            <p style={{ fontSize: 16, color: "#777", lineHeight: 1.75, fontWeight: 300, margin: 0 }}>
              {t("missions.cta.subtitle", "Participez à la construction d'infrastructures d'excellence avec NEXUS BTP.")}
            </p>
          </div>

          <a href="/contacternous" className="ms-cta"
            style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "16px 36px", background: NAVY, color: "#fff", borderRadius: 14, fontWeight: 800, fontSize: 16, textDecoration: "none", transition: "all .25s", flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.background = "#001f5c"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${NAVY}40`; }}
            onMouseLeave={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            {t("missions.cta.button", "Nous contacter")}
            <ArrowRight size={20} />
          </a>
        </div>
      </section>
    </div>
  );
};

export default NosMissions;