const BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : "https://nexusbtp.onrender.com"; 

const CONFIG = {
  BASE_URL,
  API_LOGIN: `/api/login/`,



  // Ajoute à ton CONFIG
API_TRACK: `${BASE_URL}/api/track/`, // 🔹 endpoint Django pour tracker les actions

// 📸 Dossier media (pour les images directes)
MEDIA_URL: `${BASE_URL}/media/`,

CLOUDINARY_NAME: "dqculak64",
CLOUDINARY_UPLOAD_PRESET: "ml_default", // 👈 le nom exact de ton preset UNSIGNED
 
};

export default CONFIG;




