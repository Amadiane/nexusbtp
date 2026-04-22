import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Mail, Phone, MapPin, Facebook, Instagram, Linkedin,
  ArrowRight, ArrowUpRight, Building2, Users, Briefcase, Home,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const NAVY   = "#003893";
const ORANGE = "#EA580C";

const Footer = () => {
  const { t } = useTranslation();
  const [hoveredLink, setHoveredLink] = useState(null);

  const services = [
    { label: t("footer.services.architecture", "Architecture"), href: "/services", icon: Building2 },
    { label: t("footer.services.engineering",  "Ingénierie"),   href: "/services", icon: Briefcase },
    { label: t("footer.services.urban",        "Urbanisme"),    href: "/services", icon: Home },
    { label: t("footer.services.consulting",   "Consulting"),   href: "/services", icon: Users },
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
    { icon: MapPin, label: "Adresse",  text: "Conakry, Guinée",           href: "https://maps.google.com" },
    { icon: Phone,  label: "Téléphone",text: "+224 628 80 74 56",         href: "tel:+224628807456" },
    { icon: Mail,   label: "Email",    text: "contact@nexusbtp.com",       href: "mailto:contact@nexusbtp.com" },
  ];

  return (
    <footer style={{ background: "#05112a", color: "#fff", fontFamily: "'DM Sans','Segoe UI',sans-serif", position: "relative", overflow: "hidden" }}>

      {/* ── Decorative background geometry ── */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${NAVY} 0%, ${NAVY} 55%, ${ORANGE} 100%)` }} />
      <div style={{ position: "absolute", top: -200, right: -200, width: 600, height: 600, borderRadius: "50%", background: `${NAVY}18`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: `${ORANGE}08`, pointerEvents: "none" }} />
      {/* Grid lines */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "80px 80px", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1600, margin: "0 auto", padding: "40px 48px 0", position: "relative" }}>

        {/* ── TOP: Brand + CTA ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center", marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>

          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {/* Wordmark compact */}
            <h2 style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              margin: 0,
              fontFamily: "'Creato Display','DM Sans',sans-serif",
              flexShrink: 0,
            }}>
              <span style={{ color: "#fff" }}>NEX</span>
              <span style={{ color: ORANGE }}>US</span>
              <span style={{ fontSize: "0.28em", fontWeight: 500, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", marginLeft: 10, verticalAlign: "middle" }}>BTP CONSULTING</span>
            </h2>

            {/* Separator */}
            <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />

            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, fontWeight: 300, maxWidth: 320, margin: 0 }}>
              {t("footer.tagline", "Architecture, ingénierie et conseil BTP — nous façonnons les infrastructures de demain.")}
            </p>
          </div>

          {/* CTA */}
          <NavLink to="/contacternous"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", background: ORANGE, color: "#fff", borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: "none", transition: "all 0.2s", whiteSpace: "nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#c44a08"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = ORANGE; e.currentTarget.style.transform = "translateY(0)"; }}>
            Parlons-en <ArrowRight size={15} />
          </NavLink>
        </div>

        {/* ── MIDDLE: Links + Contact ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 32, marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>

          {/* Contact — compact inline rows */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ width: 16, height: 2, background: ORANGE, marginBottom: 8 }} />
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                {t("footer.sections.contact", "Contact")}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {contactInfo.map((item, idx) => {
                const Icon = item.icon;
                const key = `contact-${idx}`;
                return (
                  <a key={idx} href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    onMouseEnter={() => setHoveredLink(key)}
                    onMouseLeave={() => setHoveredLink(null)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: idx < contactInfo.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", textDecoration: "none", transition: "all 0.2s" }}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: hoveredLink === key ? NAVY : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}>
                      <Icon size={13} color={hoveredLink === key ? "#fff" : "rgba(255,255,255,0.4)"} />
                    </div>
                    <span style={{ fontSize: 13, color: hoveredLink === key ? "#fff" : "rgba(255,255,255,0.55)", fontWeight: 500, transition: "color 0.2s" }}>{item.text}</span>
                    <ArrowUpRight size={12} color={hoveredLink === key ? ORANGE : "transparent"} style={{ marginLeft: "auto", transition: "color 0.2s" }} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ width: 16, height: 2, background: ORANGE, marginBottom: 8 }} />
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                {t("footer.sections.services", "Services")}
              </span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {services.map((s, idx) => (
                <li key={idx}>
                  <NavLink to={s.href}
                    style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none", display: "flex", alignItems: "center", gap: 7, transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
                  >
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: ORANGE, flexShrink: 0 }} />
                    {s.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ width: 16, height: 2, background: ORANGE, marginBottom: 8 }} />
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                {t("footer.sections.navigation", "Navigation")}
              </span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <NavLink to={link.href}
                    style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ width: 16, height: 2, background: ORANGE, marginBottom: 8 }} />
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                {t("footer.sections.social", "Réseaux")}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {socialLinks.map((s, idx) => {
                const Icon = s.icon;
                const key = `social-${idx}`;
                return (
                  <a key={idx} href={s.url} target="_blank" rel="noopener noreferrer"
                    onMouseEnter={() => setHoveredLink(key)}
                    onMouseLeave={() => setHoveredLink(null)}
                    style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", transition: "all 0.2s" }}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${hoveredLink === key ? ORANGE : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", background: hoveredLink === key ? `${ORANGE}15` : "transparent" }}>
                      <Icon size={13} color={hoveredLink === key ? ORANGE : "rgba(255,255,255,0.4)"} />
                    </div>
                    <span style={{ fontSize: 13, color: hoveredLink === key ? "#fff" : "rgba(255,255,255,0.45)", fontWeight: 500, transition: "color 0.2s" }}>
                      {s.name}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, paddingBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 20, height: 20, borderRadius: 5, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 8, fontWeight: 900, color: "#fff" }}>N</span>
              </div>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontWeight: 600 }}>
                © {new Date().getFullYear()} NEXUS BTP Consulting
              </span>
            </div>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.18)" }}>
              {t("footer.copyright", "Tous droits réservés")}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {[
              { label: t("footer.legal.terms",  "Mentions légales"),  href: "/mentions-legales" },
              { label: t("footer.legal.privacy", "Confidentialité"),   href: "/politique-confidentialite" },
              { label: t("footer.legal.cgv",     "CGV"),               href: "/cgv" },
            ].map((l, idx) => (
              <a key={idx} href={l.href}
                style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.2)"}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom accent bar ── */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${ORANGE} 0%, ${NAVY} 100%)` }} />
    </footer>
  );
};

export default Footer;