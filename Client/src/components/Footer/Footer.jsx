import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  ArrowRight,
  ExternalLink,
  Building2,
  Users,
  Briefcase,
  Home,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import CONFIG from "../../config/config.js";

/**
 * 🏗️ FOOTER BETCOM AI - ULTRA MODERNE
 * Charte: Noir, blanc, gris
 * Inspiré des grands sites d'architecture
 */

const Footer = () => {
  const { t } = useTranslation();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const services = [
    { label: t('footer.services.architecture'), href: "/services", icon: Building2 },
    { label: t('footer.services.engineering'), href: "/services", icon: Briefcase },
    { label: t('footer.services.urban'), href: "/services", icon: Home },
    { label: t('footer.services.consulting'), href: "/services", icon: Users },
  ];

  const quickLinks = [
    { label: t('footer.links.home'), href: "/" },
    { label: t('footer.links.about'), href: "/nosMissions" },
    { label: t('footer.links.team'), href: "/notreEquipe" },
    { label: t('footer.links.projects'), href: "/portfolio" },
    { label: t('footer.links.news'), href: "/actualites" },
    { label: t('footer.links.contact'), href: "/contacternous" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "https://facebook.com" },
    { name: "Instagram", icon: Instagram, url: "https://instagram.com" },
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com" },
  ];

  const contactInfo = [
    { 
      icon: MapPin, 
      text: "Conakry, Guinée",
      link: "https://maps.google.com"
    },
    { 
      icon: Phone, 
      text: "+212 628 80 74 56",
      link: "tel:+212XXXXXXXXX"
    },
    { 
      icon: Mail, 
      text: "contact@betcom.com",
      link: "mailto:contact@betcom.ma"
    },
  ];

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[9999] animate-in slide-in-from-right duration-500">
          <div className={`max-w-md ${
            toastType === "success" ? "bg-black" : "bg-red-600"
          } rounded-xl p-4 border-2 ${
            toastType === "success" ? "border-white" : "border-red-400"
          } shadow-2xl`}>
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-white font-bold text-sm mb-1">
                  {toastType === "success" ? t('footer.toast.success') : t('footer.toast.error')}
                </p>
                <p className="text-white/90 text-sm">{toastMessage}</p>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="text-white hover:bg-white/20 rounded p-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="relative bg-black text-white border-t-2 border-white">
        
        {/* Main Content */}
        <div className="max-w-[1800px] mx-auto px-6 lg:px-16 py-20">
          
          {/* Top Section - Brand + Contact */}
          <div className="grid lg:grid-cols-3 gap-16 mb-20 pb-20 border-b border-white/20">
            
            {/* Brand */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-[60px] md:text-[80px] lg:text-[120px] font-bold leading-none tracking-tight mb-6" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                  BETCOM
                </h3>
                <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t('footer.tagline')}
                </p>
              </div>

              {/* Stats Line */}
              {/* <div className="flex flex-wrap items-center gap-8 md:gap-16 text-sm uppercase tracking-widest pt-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <div>
                  <span className="text-white font-bold text-3xl md:text-4xl">2010</span>
                  <span className="text-gray-500 ml-3">{t('footer.stats.founded')}</span>
                </div>
                <div className="w-px h-8 bg-gray-700 hidden sm:block"></div>
                <div>
                  <span className="text-white font-bold text-3xl md:text-4xl">500+</span>
                  <span className="text-gray-500 ml-3">{t('footer.stats.projects')}</span>
                </div>
                <div className="w-px h-8 bg-gray-700 hidden sm:block"></div>
                <div>
                  <span className="text-white font-bold text-3xl md:text-4xl">50+</span>
                  <span className="text-gray-500 ml-3">{t('footer.stats.team')}</span>
                </div>
              </div> */}
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="mb-6">
                <div className="w-16 h-1 bg-white mb-4"></div>
                <span className="text-xs uppercase tracking-widest text-gray-400 font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t('footer.sections.contact')}
                </span>
              </div>

              {contactInfo.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.link}
                    target={item.link.startsWith('http') ? '_blank' : undefined}
                    rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group flex items-center gap-4 py-3 border-b border-gray-800 hover:border-white transition-all duration-300"
                  >
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    <span className="text-gray-300 group-hover:text-white transition-colors flex-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {item.text}
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-white transition-all" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            
            {/* Services */}
            <div>
              <div className="mb-6">
                <div className="w-12 h-px bg-white mb-3"></div>
                <h4 className="text-sm uppercase tracking-widest text-gray-400 font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t('footer.sections.services')}
                </h4>
              </div>
              <ul className="space-y-3">
                {services.map((service, idx) => {
                  const Icon = service.icon;
                  return (
                    <li key={idx}>
                      <NavLink
                        to={service.href}
                        className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        <Icon className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        <span>{service.label}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Navigation */}
            <div>
              <div className="mb-6">
                <div className="w-12 h-px bg-white mb-3"></div>
                <h4 className="text-sm uppercase tracking-widest text-gray-400 font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t('footer.sections.navigation')}
                </h4>
              </div>
              <ul className="space-y-3">
                {quickLinks.slice(0, 4).map((link, idx) => (
                  <li key={idx}>
                    <NavLink
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* More Links */}
            <div>
              <div className="mb-6">
                <div className="w-12 h-px bg-white mb-3"></div>
                <h4 className="text-sm uppercase tracking-widest text-gray-400 font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t('footer.sections.company')}
                </h4>
              </div>
              <ul className="space-y-3">
                {quickLinks.slice(4).map((link, idx) => (
                  <li key={idx}>
                    <NavLink
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <div className="mb-6">
                <div className="w-12 h-px bg-white mb-3"></div>
                <h4 className="text-sm uppercase tracking-widest text-gray-400 font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t('footer.sections.social')}
                </h4>
              </div>
              <div className="space-y-3">
                {socialLinks.map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300"
                    >
                      <Icon className="w-5 h-5" />
                      <span style={{ fontFamily: 'Poppins, sans-serif' }}>{social.name}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 ml-auto transition-all" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-gray-400 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                © {new Date().getFullYear()} BETCOM AI. {t('footer.copyright')}
              </div>

              <div className="flex items-center gap-6 text-sm">
                <a href="/mentions-legales" className="text-gray-400 hover:text-white transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t('footer.legal.terms')}
                </a>
                <span className="text-gray-700">•</span>
                <a href="/politique-confidentialite" className="text-gray-400 hover:text-white transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t('footer.legal.privacy')}
                </a>
                <span className="text-gray-700">•</span>
                <a href="/cgv" className="text-gray-400 hover:text-white transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t('footer.legal.cgv')}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="h-1 bg-white"></div>
      </footer>
    </>
  );
};

export default Footer;