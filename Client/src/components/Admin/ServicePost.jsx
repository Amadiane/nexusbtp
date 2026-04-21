import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js"; // ✅ On utilise seulement CONFIG
import { Loader2, PlusCircle, X, Save } from "lucide-react";

const ServicePost = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    title_fr: "",
    title_en: "",
    description_fr: "",
    description_en: "",
    image: null,
    is_active: true,
  });

  // 🔹 Fetch services depuis CONFIG.API_SERVICE_LIST
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(CONFIG.API_SERVICE_LIST);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setServices(data);
      setError(null);
    } catch (err) {
      console.error("Erreur fetch services:", err);
      setError("Erreur lors du chargement des services");
    } finally {
      setLoading(false);
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 🔹 Upload Cloudinary (preset UNSIGNED défini dans CONFIG)
  const uploadToCloudinary = async (file) => {
    if (!file) return null;

    const formDataCloud = new FormData();
    formDataCloud.append("file", file);
    formDataCloud.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`,
        { method: "POST", body: formDataCloud }
      );
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error("Erreur upload Cloudinary:", err);
      return null;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file" && files[0]) {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData({
      title_fr: "",
      title_en: "",
      description_fr: "",
      description_en: "",
      image: null,
      is_active: true,
    });
    setPreview(null);
    setEditingId(null);
  };

  // 🔹 Create / Update via CONFIG.API_SERVICE_CREATE ou API_SERVICE_UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = null;
      if (formData.image && typeof formData.image !== "string") {
        imageUrl = await uploadToCloudinary(formData.image);
      } else if (typeof formData.image === "string") {
        imageUrl = formData.image;
      }

      const payload = { ...formData, image: imageUrl };

      const method = editingId ? "PATCH" : "POST";
      const url = editingId
        ? CONFIG.API_SERVICE_UPDATE(editingId)
        : CONFIG.API_SERVICE_CREATE;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erreur lors de l'enregistrement");

      setSuccessMessage("✨ Succès !");
      resetForm();
      await fetchServices();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div>Chargement...</div>;

  return (
    <div className="p-8">
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <button onClick={() => setShowForm(true)}>
        <PlusCircle /> Nouveau Service
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-2">
          <input type="text" name="title_fr" placeholder="Titre FR" value={formData.title_fr} onChange={handleChange} required />
          <input type="text" name="title_en" placeholder="Titre EN" value={formData.title_en} onChange={handleChange} />
          <textarea name="description_fr" placeholder="Description FR" value={formData.description_fr} onChange={handleChange} required />
          <textarea name="description_en" placeholder="Description EN" value={formData.description_en} onChange={handleChange} />
          <input type="file" name="image" onChange={handleChange} />
          {preview && <img src={preview} className="w-48 mt-2" alt="Preview" />}
          <label>
            Actif
            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Enregistrement..." : editingId ? "Mettre à jour" : "Créer"}
          </button>
        </form>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((s) => (
          <div key={s.id} className="border p-4 rounded">
            <h3>{s.title_fr} / {s.title_en}</h3>
            <p>{s.description_fr}</p>
            {s.image && <img src={s.image} alt={s.title_fr} className="w-full mt-2" />}
            <p>{s.is_active ? "Actif" : "Inactif"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicePost;
