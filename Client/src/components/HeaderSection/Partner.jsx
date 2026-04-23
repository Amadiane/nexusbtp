import { useEffect, useState } from "react";
import { Handshake, ExternalLink, AlertCircle, ArrowRight } from "lucide-react";
import CONFIG from "../../config/config.js";
import { useTranslation } from "react-i18next";

const NAVY   = "#003893";
const ORANGE = "#EA580C";

const Partner = () => {
  const { t } = useTranslation();
  const [partners, setPartners]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [hoveredId, setHoveredId]   = useState(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res  = await fetch(`${CONFIG.BASE_URL}/api/partners/`);
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.results ?? []);
        setPartners(list.filter(p => p.is_active === true || p.isActive === true));
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchPartners();
  }, []);

  const getImg = (p) => p.cover_image_url || p.cover_image || null;

  /* ── Loading ── */
  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 44, height: 44, border: `2px solid #f0f0f0`, borderTopColor: NAVY, borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 14px" }} />
        <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#bbb" }}>Chargement</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <AlertCircle size={44} color="#ef4444" style={{ margin: "0 auto 16px" }} />
        <p style={{ color: "#777", marginBottom: 24 }}>{error}</p>
        <button onClick={() => window.location.reload()} style={{ padding: "11px 28px", background: NAVY, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>
          Réessayer
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#fff", minHeight: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

        .pc-card { transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s; }
        .pc-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,56,147,0.13); }

        .pc-img { transition: transform .5s ease; }
        .pc-card:hover .pc-img { transform: scale(1.06); }

        .pc-overlay { opacity: 0; transition: opacity .3s; }
        .pc-card:hover .pc-overlay { opacity: 1; }

        .pc-stripe { transform: scaleX(0); transform-origin: left; transition: transform .4s ease; }
        .pc-card:hover .pc-stripe { transform: scaleX(1); }

        @media(max-width:768px) {
          .partner-hero   { padding: 56px 24px 40px !important; }
          .partner-grid   { padding: 40px 24px 64px !important; grid-template-columns: repeat(2,1fr) !important; }
          .partner-cta    { padding: 56px 24px !important; }
        }
        @media(max-width:480px) {
          .partner-grid   { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="partner-hero" style={{ padding: "96px 48px 72px", maxWidth: 1600, margin: "0 auto" }}>

        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
          <div style={{ width: 36, height: 2, background: ORANGE }} />
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.24em", textTransform: "uppercase", color: ORANGE }}>
            {t("partners.sectionLabel", "Nos partenaires")}
          </span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} />
            <span style={{ fontSize: 10, color: "#bbb", letterSpacing: "0.14em", textTransform: "uppercase" }}>
              {partners.length} {t("partners.count", "partenaires")}
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: "clamp(48px, 8vw, 110px)",
          fontWeight: 900, letterSpacing: "-0.03em",
          lineHeight: 0.92, margin: "0 0 28px",
          fontFamily: "'Creato Display','DM Sans',sans-serif",
          color: "#0a0a0a",
        }}>
          {t("partners.titleLine1", "Ils nous")}
          <br />
          <span style={{ color: NAVY }}>{t("partners.titleLine2", "font")}</span>
          {" "}
          <span style={{ color: ORANGE }}>{t("partners.titleLine3", "confiance")}</span>
        </h1>

        <p style={{ fontSize: 17, color: "#666", maxWidth: 520, lineHeight: 1.8, fontWeight: 300 }}>
          {t("partners.subtitle", "Découvrez les entreprises et organisations qui collaborent avec NEXUS BTP pour bâtir les infrastructures de demain.")}
        </p>
      </section>

      {/* Divider */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #e8e8e8 20%, #e8e8e8 80%, transparent)", maxWidth: 1600, margin: "0 auto" }} />

      {/* ── GRID ── */}
      <section className="partner-grid" style={{ padding: "64px 48px 80px", maxWidth: 1600, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24 }}>

        {partners.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "80px 0" }}>
            <Handshake size={44} color="#e0e0e0" style={{ margin: "0 auto 16px" }} />
            <p style={{ color: "#bbb", fontSize: 15 }}>{t("partners.noPartners", "Aucun partenaire pour le moment")}</p>
          </div>
        )}

        {partners.map((p, idx) => {
          const img  = getImg(p);
          const name = p.name_fr || p.name_en || "Partenaire";
          return (
            <article key={p.id} className="pc-card"
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => p.website_url && window.open(p.website_url, "_blank", "noopener,noreferrer")}
              style={{
                borderRadius: 16, overflow: "hidden", border: "1px solid #ebebeb",
                background: "#fff", cursor: p.website_url ? "pointer" : "default",
                animation: `fadeUp .55s ease ${idx * .06}s both`,
                display: "flex", flexDirection: "column",
              }}>

              {/* Image */}
              <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                {img ? (
                  <img className="pc-img" src={img} alt={name}
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    onError={e => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                    <span style={{ fontSize: 40, fontWeight: 900, color: `${NAVY}20`, fontFamily: "'Creato Display',sans-serif" }}>
                      {name[0]?.toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Hover overlay */}
                {p.website_url && (
                  <div className="pc-overlay" style={{ position: "absolute", inset: 0, background: `${NAVY}e0`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ExternalLink size={20} color="#fff" />
                    </div>
                  </div>
                )}

                {/* Stripe */}
                <div className="pc-stripe" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${NAVY},${ORANGE})` }} />
              </div>

              {/* Name */}
              <div style={{ padding: "14px 18px", borderTop: "1px solid #f5f5f5", background: hoveredId === p.id ? "#f7f9ff" : "#fff", transition: "background .2s" }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: hoveredId === p.id ? NAVY : "#0a0a0a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", transition: "color .2s" }}>
                  {name}
                </h3>
                {p.description_fr && (
                  <p style={{ fontSize: 12, color: "#aaa", margin: "4px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.description_fr}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {/* ── CTA ── */}
      <section className="partner-cta" style={{ padding: "64px 48px", borderTop: "1px solid #f0f0f0", background: "#fafafa" }}>
        <div style={{ maxWidth: 1600, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
          <div style={{ maxWidth: 500 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 24, height: 2, background: ORANGE }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: ORANGE }}>
                {t("partners.cta.eyebrow", "Partenariat")}
              </span>
            </div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 50px)", fontWeight: 900, color: "#0a0a0a", margin: "0 0 14px", letterSpacing: "-0.02em", fontFamily: "'Creato Display',sans-serif" }}>
              {t("partners.cta.title", "Rejoignez notre réseau")}
            </h2>
            <p style={{ fontSize: 15, color: "#777", lineHeight: 1.75, fontWeight: 300, margin: 0 }}>
              {t("partners.cta.desc", "Collaborez avec NEXUS BTP et participez à la construction d'infrastructures d'excellence.")}
            </p>
          </div>
          <a href="/contacternous"
            style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "14px 32px", background: NAVY, color: "#fff", borderRadius: 14, fontWeight: 800, fontSize: 15, textDecoration: "none", transition: "all .2s", flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.background = "#001f5c"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.transform = "translateY(0)"; }}>
            {t("partners.cta.button", "Devenir partenaire")}
            <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Partner;