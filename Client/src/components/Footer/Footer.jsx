import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, ArrowRight, Building2, Users, Briefcase, Home } from "lucide-react";
import { NavLink } from "react-router-dom";

const NAVY   = "#003893";
const ORANGE = "#EA580C";

const Footer = () => {
  const { t } = useTranslation();
  const [hoveredLink, setHoveredLink] = useState(null);

  const services = [
    { label: t("footer.services.architecture", "Architecture"), href: "/services" },
    { label: t("footer.services.engineering",  "Ingénierie"),   href: "/services" },
    { label: t("footer.services.urban",        "Urbanisme"),    href: "/services" },
    { label: t("footer.services.consulting",   "Consulting"),   href: "/services" },
  ];

  const quickLinks = [
    { label: t("footer.links.home",    "Accueil"),      href: "/" },
    { label: t("footer.links.about",   "Nos missions"), href: "/nosMissions" },
    { label: t("footer.links.team",    "Notre équipe"), href: "/notreEquipe" },
    { label: t("footer.links.projects","Portfolio"),    href: "/portfolio" },
    { label: t("footer.links.news",    "Actualités"),   href: "/actualites" },
    { label: t("footer.links.contact", "Contact"),      href: "/contacternous" },
  ];

  const socialLinks = [
    { name: "LinkedIn",  icon: Linkedin,  url: "https://linkedin.com" },
    { name: "Facebook",  icon: Facebook,  url: "https://facebook.com" },
    { name: "Instagram", icon: Instagram, url: "https://instagram.com" },
  ];

  const contactInfo = [
    { icon: MapPin, text: "Conakry, Guinée",       href: "https://maps.google.com" },
    { icon: Phone,  text: "+224 628 80 74 56",     href: "tel:+224628807456" },
    { icon: Mail,   text: "contact@nexusbtp.com",  href: "mailto:contact@nexusbtp.com" },
  ];

  const ColTitle = ({ label }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ width: 16, height: 2, background: ORANGE, marginBottom: 8 }} />
      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
        {label}
      </span>
    </div>
  );

  return (
    <footer style={{ background: "#05112a", color: "#fff", fontFamily: "'DM Sans','Segoe UI',sans-serif", position: "relative", overflow: "hidden" }}>

      {/* Decorative */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${NAVY} 0%,${NAVY} 55%,${ORANGE} 100%)` }} />
      <div style={{ position: "absolute", top: -200, right: -200, width: 500, height: 500, borderRadius: "50%", background: `${NAVY}15`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -100, left: -100, width: 350, height: 350, borderRadius: "50%", background: `${ORANGE}07`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.015) 1px,transparent 1px)", backgroundSize: "80px 80px", pointerEvents: "none" }} />

      <div className="footer-inner" style={{ maxWidth: 1600, margin: "0 auto", padding: "40px 48px 0", position: "relative" }}>

        {/* ── TOP ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32, paddingBottom: 28, borderBottom: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 16, flex: 1 }}>
            <h2 style={{ fontSize: "clamp(26px,5vw,52px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1, margin: 0, fontFamily: "'Creato Display','DM Sans',sans-serif", flexShrink: 0 }}>
              <span style={{ color: "#fff" }}>NEX</span>
              <span style={{ color: ORANGE }}>US</span>
              <span style={{ fontSize: "0.27em", fontWeight: 500, color: "rgba(255,255,255,.3)", letterSpacing: "0.12em", marginLeft: 8, verticalAlign: "middle" }}>BTP CONSULTING</span>
            </h2>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,.32)", lineHeight: 1.6, fontWeight: 300, maxWidth: 280, margin: 0 }}>
              {t("footer.tagline", "Architecture, ingénierie et conseil BTP.")}
            </p>
          </div>
          <NavLink to="/contacternous"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", background: ORANGE, color: "#fff", borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.background = "#c44a08"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = ORANGE; e.currentTarget.style.transform = ""; }}>
            Parlons-en <ArrowRight size={14} />
          </NavLink>
        </div>

        {/* ── GRID ── */}
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 28, marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid rgba(255,255,255,.08)" }}>

          {/* Contact */}
          <div>
            <ColTitle label={t("footer.sections.contact","Contact")} />
            {contactInfo.map((item, idx) => {
              const Icon = item.icon;
              const key  = `c${idx}`;
              return (
                <a key={idx} href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredLink(key)}
                  onMouseLeave={() => setHoveredLink(null)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: idx < 2 ? "1px solid rgba(255,255,255,.05)" : "none", textDecoration: "none" }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: hoveredLink === key ? NAVY : "rgba(255,255,255,.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background .2s" }}>
                    <Icon size={12} color={hoveredLink === key ? "#fff" : "rgba(255,255,255,.4)"} />
                  </div>
                  <span style={{ fontSize: 12, color: hoveredLink === key ? "#fff" : "rgba(255,255,255,.55)", fontWeight: 500, transition: "color .2s", overflowWrap: "anywhere" }}>
                    {item.text}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Services */}
          <div>
            <ColTitle label={t("footer.sections.services","Services")} />
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
              {services.map((s, i) => (
                <li key={i}>
                  <NavLink to={s.href}
                    style={{ fontSize: 13, color: "rgba(255,255,255,.45)", textDecoration: "none", display: "flex", alignItems: "center", gap: 7, transition: "color .2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.45)"}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: ORANGE, flexShrink: 0 }} />{s.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <ColTitle label={t("footer.sections.navigation","Navigation")} />
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
              {quickLinks.map((l, i) => (
                <li key={i}>
                  <NavLink to={l.href}
                    style={{ fontSize: 13, color: "rgba(255,255,255,.45)", textDecoration: "none", transition: "color .2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.45)"}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <ColTitle label={t("footer.sections.social","Réseaux")} />
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {socialLinks.map((s, i) => {
                const Icon = s.icon;
                const key  = `s${i}`;
                return (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                    onMouseEnter={() => setHoveredLink(key)}
                    onMouseLeave={() => setHoveredLink(null)}
                    style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${hoveredLink===key ? ORANGE : "rgba(255,255,255,.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s", background: hoveredLink===key ? `${ORANGE}18` : "transparent" }}>
                      <Icon size={13} color={hoveredLink===key ? ORANGE : "rgba(255,255,255,.4)"} />
                    </div>
                    <span style={{ fontSize: 13, color: hoveredLink===key ? "#fff" : "rgba(255,255,255,.45)", fontWeight: 500, transition: "color .2s" }}>{s.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── BOTTOM ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, paddingBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: 5, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 8, fontWeight: 900, color: "#fff" }}>N</span>
            </div>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,.22)", fontWeight: 600 }}>
              © {new Date().getFullYear()} NEXUS BTP Consulting
            </span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,.15)" }}>· {t("footer.copyright","Tous droits réservés")}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
            {[
              { label: t("footer.legal.terms","Mentions légales"), href: "/mentions-legales" },
              { label: t("footer.legal.privacy","Confidentialité"), href: "/politique-confidentialite" },
              { label: t("footer.legal.cgv","CGV"), href: "/cgv" },
            ].map((l, i) => (
              <a key={i} href={l.href}
                style={{ fontSize: 11, color: "rgba(255,255,255,.2)", textDecoration: "none", transition: "color .2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,.6)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.2)"}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div style={{ height: 4, background: `linear-gradient(90deg,${ORANGE} 0%,${NAVY} 100%)` }} />

      <style>{`
        .footer-grid { grid-template-columns: repeat(4,1fr); }

        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: repeat(2,1fr) !important; gap: 28px !important; }
        }

        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .footer-inner { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;