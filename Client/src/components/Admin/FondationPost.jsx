import { useEffect, useState } from "react";
import axios from "axios";
import CONFIG from "../../config/config.js";

const FondationPost = () => {
  const [loading, setLoading] = useState(false);
  const [aboutId, setAboutId] = useState(null);

  const [formData, setFormData] = useState({
    historique_title_fr: "",
    historique_title_en: "",
    historique_description_fr: "",
    historique_description_en: "",

    vision_title_fr: "",
    vision_title_en: "",
    vision_description_fr: "",
    vision_description_en: "",

    organisation_title_fr: "",
    organisation_title_en: "",
    organisation_description_fr: "",
    organisation_description_en: "",

    direction_title_fr: "",
    direction_title_en: "",
    direction_message_fr: "",
    direction_message_en: "",
  });

  const [images, setImages] = useState({
    historique_image: null,
    vision_image: null,
    organisation_image: null,
    direction_image: null,
  });

  // =========================
  // 🔄 Charger les données existantes
  // =========================
  useEffect(() => {
    axios
      .get(CONFIG.API_ABOUT_LIST)
      .then((res) => {
        if (res.data.length > 0) {
          const data = res.data[0];
          setAboutId(data.id);
          setFormData({ ...formData, ...data });
        }
      })
      .catch((err) => console.error("Erreur chargement About", err));
    // eslint-disable-next-line
  }, []);

  // =========================
  // 🧾 Handle text inputs
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // 📸 Handle image upload
  // =========================
  const handleImageChange = (e) => {
    setImages({
      ...images,
      [e.target.name]: e.target.files[0],
    });
  };

  // =========================
  // 🚀 Submit (POST / PUT)
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    Object.keys(images).forEach((key) => {
      if (images[key]) {
        data.append(key, images[key]);
      }
    });

    try {
      if (aboutId) {
        await axios.put(CONFIG.API_ABOUT_UPDATE(aboutId), data);
        alert("Fondation mise à jour avec succès");
      } else {
        await axios.post(CONFIG.API_ABOUT_CREATE, data);
        alert("Fondation créée avec succès");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Fondation / À propos</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ================= HISTORIQUE ================= */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Historique</h2>

          <input
            type="text"
            name="historique_title_fr"
            placeholder="Titre historique (FR)"
            value={formData.historique_title_fr}
            onChange={handleChange}
            className="input"
          />

          <input
            type="text"
            name="historique_title_en"
            placeholder="History title (EN)"
            value={formData.historique_title_en}
            onChange={handleChange}
            className="input"
          />

          <textarea
            name="historique_description_fr"
            placeholder="Description historique (FR)"
            value={formData.historique_description_fr}
            onChange={handleChange}
            className="textarea"
          />

          <textarea
            name="historique_description_en"
            placeholder="History description (EN)"
            value={formData.historique_description_en}
            onChange={handleChange}
            className="textarea"
          />

          <input
            type="file"
            name="historique_image"
            onChange={handleImageChange}
          />
        </section>

        {/* ================= VISION ================= */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Vision</h2>

          <input
            type="text"
            name="vision_title_fr"
            placeholder="Titre vision (FR)"
            value={formData.vision_title_fr}
            onChange={handleChange}
            className="input"
          />

          <input
            type="text"
            name="vision_title_en"
            placeholder="Vision title (EN)"
            value={formData.vision_title_en}
            onChange={handleChange}
            className="input"
          />

          <textarea
            name="vision_description_fr"
            placeholder="Description vision (FR)"
            value={formData.vision_description_fr}
            onChange={handleChange}
            className="textarea"
          />

          <textarea
            name="vision_description_en"
            placeholder="Vision description (EN)"
            value={formData.vision_description_en}
            onChange={handleChange}
            className="textarea"
          />

          <input
            type="file"
            name="vision_image"
            onChange={handleImageChange}
          />
        </section>

        {/* ================= ORGANISATION ================= */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Organisation</h2>

          <input
            type="text"
            name="organisation_title_fr"
            placeholder="Titre organisation (FR)"
            value={formData.organisation_title_fr}
            onChange={handleChange}
            className="input"
          />

          <input
            type="text"
            name="organisation_title_en"
            placeholder="Organization title (EN)"
            value={formData.organisation_title_en}
            onChange={handleChange}
            className="input"
          />

          <textarea
            name="organisation_description_fr"
            placeholder="Description organisation (FR)"
            value={formData.organisation_description_fr}
            onChange={handleChange}
            className="textarea"
          />

          <textarea
            name="organisation_description_en"
            placeholder="Organization description (EN)"
            value={formData.organisation_description_en}
            onChange={handleChange}
            className="textarea"
          />

          <input
            type="file"
            name="organisation_image"
            onChange={handleImageChange}
          />
        </section>

        {/* ================= DIRECTION ================= */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Message de la direction</h2>

          <input
            type="text"
            name="direction_title_fr"
            placeholder="Titre direction (FR)"
            value={formData.direction_title_fr}
            onChange={handleChange}
            className="input"
          />

          <input
            type="text"
            name="direction_title_en"
            placeholder="Direction title (EN)"
            value={formData.direction_title_en}
            onChange={handleChange}
            className="input"
          />

          <textarea
            name="direction_message_fr"
            placeholder="Message direction (FR)"
            value={formData.direction_message_fr}
            onChange={handleChange}
            className="textarea"
          />

          <textarea
            name="direction_message_en"
            placeholder="Direction message (EN)"
            value={formData.direction_message_en}
            onChange={handleChange}
            className="textarea"
          />

          <input
            type="file"
            name="direction_image"
            onChange={handleImageChange}
          />
        </section>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-black text-white rounded"
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
};

export default FondationPost;
