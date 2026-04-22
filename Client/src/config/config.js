const BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : "https://nexusbtp.onrender.com"; 

const CONFIG = {
  BASE_URL,
  API_LOGIN: `/api/login/`,


  API_ABOUT_LIST: `${BASE_URL}/api/about/`,
  API_ABOUT_CREATE: `${BASE_URL}/api/about/`,
  API_ABOUT_UPDATE: (id) => `${BASE_URL}/api/about/${id}/`, // fonction qui retourne URL complète
  API_ABOUT_DELETE: (id) => `${BASE_URL}/api/about/${id}/`,


    // =======================
  API_PORTFOLIO_LIST: `${BASE_URL}/api/portfolio/`,
  API_PORTFOLIO_CREATE: `${BASE_URL}/api/portfolio/`,
  API_PORTFOLIO_UPDATE: (id) => `${BASE_URL}/api/portfolio/${id}/`,
  API_PORTFOLIO_DELETE: (id) => `${BASE_URL}/api/portfolio/${id}/`,


  
  // 👥 TEAM
  API_TEAM_LIST: `${BASE_URL}/api/equipe-members/`,
  API_TEAM_CREATE: `${BASE_URL}/api/equipe-members/`,
  API_TEAM_UPDATE: (id) => `${BASE_URL}/api/equipe-members/${id}/`,
  API_TEAM_DELETE: (id) => `${BASE_URL}/api/equipe-members/${id}/`,


  
// 🛠️ SERVICES
API_SERVICE_LIST: `${BASE_URL}/api/services/`,
API_SERVICE_CREATE: `${BASE_URL}/api/services/`,
API_SERVICE_UPDATE: (id) => `${BASE_URL}/api/services/${id}/`,
API_SERVICE_DELETE: (id) => `${BASE_URL}/api/services/${id}/`,



   // 📰 NEWS CRUD
  API_NEWS_LIST: `${BASE_URL}/api/news/`,
  API_NEWS_CREATE: `${BASE_URL}/api/news/`,
  API_NEWS_UPDATE: (id) => `${BASE_URL}/api/news/${id}/`,
  API_NEWS_DELETE: (id) => `${BASE_URL}/api/news/${id}/`,

  // Ajoute à ton CONFIG
API_TRACK: `${BASE_URL}/api/track/`, // 🔹 endpoint Django pour tracker les actions

// 📸 Dossier media (pour les images directes)
MEDIA_URL: `${BASE_URL}/media/`,

CLOUDINARY_NAME: "dqculak64",
CLOUDINARY_UPLOAD_PRESET: "default", // 👈 le nom exact de ton preset UNSIGNED
  
// CLOUDINARY_UPLOAD_PRESET: "ml_default", // 👈 nom exact du preset créé
};

export default CONFIG;




