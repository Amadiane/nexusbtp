import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import {
  Users, Loader2, Trash2, PlusCircle, Edit2, X, Save,
  RefreshCw, Eye, ChevronLeft, ChevronRight, Image as ImageIcon,
  Check, Sparkles, Archive, Mail, Linkedin, Briefcase, UserCircle, Crown
} from "lucide-react";

const TeamPost = () => {
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [preview, setPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    position_fr: "",
    position_en: "",
    bio_fr: "",
    bio_en: "",
    photo: null,
    cover_image: null,
    email: "",
    linkedin: "",
    role: "membre",
    is_leader: false,
    is_active: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const fetchMembres = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${CONFIG.API_TEAM_LIST}`);
      if (!response.ok) throw new Error("Erreur lors du chargement");
      const data = await response.json();
      setMembres(data.results || data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des membres");
    } finally {
      setLoading(false);
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchMembres();
  }, []);

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
    const { name, value, files, type, checked } = e.target;

    if (files) {
      if (name === "cover_image") {
        setFormData((prev) => ({ ...prev, cover_image: files[0] }));
        setCoverPreview(URL.createObjectURL(files[0]));
      } else if (name === "photo") {
        setFormData((prev) => ({ ...prev, photo: files[0] }));
        setPreview(URL.createObjectURL(files[0]));
      }
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: "",
      position_fr: "",
      position_en: "",
      bio_fr: "",
      bio_en: "",
      photo: null,
      cover_image: null,
      email: "",
      linkedin: "",
      role: "membre",
      is_leader: false,
      is_active: true,
    });
    setPreview(null);
    setCoverPreview(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let imageUrl = null;
      let coverImageUrl = null;

      if (formData.photo && typeof formData.photo !== "string") {
        imageUrl = await uploadToCloudinary(formData.photo);
      } else if (typeof formData.photo === "string") {
        imageUrl = formData.photo;
      }

      if (formData.cover_image && typeof formData.cover_image !== "string") {
        coverImageUrl = await uploadToCloudinary(formData.cover_image);
      } else if (typeof formData.cover_image === "string") {
        coverImageUrl = formData.cover_image;
      }

      const payload = {
        ...formData,
        photo: imageUrl,
        cover_image: coverImageUrl,
      };

      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? CONFIG.API_TEAM_UPDATE(editingId)
        : CONFIG.API_TEAM_CREATE;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

      setSuccessMessage("✓ Enregistré avec succès");
      resetForm();
      await fetchMembres();
      setShowForm(false);
      setShowList(true);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (membre) => {
    setFormData({
      full_name: membre.full_name,
      position_fr: membre.position_fr,
      position_en: membre.position_en,
      bio_fr: membre.bio_fr,
      bio_en: membre.bio_en,
      email: membre.email,
      linkedin: membre.linkedin,
      role: membre.role,
      is_leader: membre.is_leader,
      is_active: membre.is_active,
      photo: membre.photo,
      cover_image: membre.cover_image,
    });

    setPreview(membre.photo_url || membre.photo);
    setCoverPreview(membre.cover_image);
    setEditingId(membre.id);
    setShowForm(true);
    setShowList(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce membre ?")) return;
    try {
      await fetch(CONFIG.API_TEAM_DELETE(id), { method: "DELETE" });
      setSuccessMessage("✓ Membre supprimé");
      await fetchMembres();
      setSelectedMember(null);
      setSelectedCards([]);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

  const filteredMembres = membres;

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-gray-600">
            Chargement de l'équipe...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative pb-32">
      <div className="relative max-w-[1800px] mx-auto px-6 py-12">

        {/* HEADER */}
        <div className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold">Notre Équipe</h1>
            <p className="text-gray-600">
              {filteredMembres.length} membre(s)
            </p>
          </div>

          <button
            onClick={() => {
              setShowForm(true);
              setShowList(false);
              resetForm();
            }}
            className="px-6 py-3 bg-black text-white rounded-lg flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Ajouter un membre
          </button>
        </div>

        {/* GRID MEMBRES */}
        {showList && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMembres.map((membre) => (
              <div
                key={membre.id}
                className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
              >
                {/* COVER IMAGE */}
                {membre.cover_image && (
                  <div className="h-32 w-full overflow-hidden">
                    <img
                      src={membre.cover_image}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* PHOTO */}
                <div className="flex justify-center -mt-10">
                  {membre.photo && (
                    <img
                      src={membre.photo}
                      alt={membre.full_name}
                      className="w-20 h-20 object-cover rounded-full border-4 border-white"
                    />
                  )}
                </div>

                <div className="p-5 text-center">
                  <h3 className="text-lg font-bold">{membre.full_name}</h3>
                  <p className="text-sm text-gray-600">
                    {membre.position_fr}
                  </p>

                  <div className="flex justify-center gap-3 mt-4">
                    <button
                      onClick={() => handleEdit(membre)}
                      className="p-2 border rounded-lg hover:bg-gray-100"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(membre.id)}
                      className="p-2 border rounded-lg hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FORM DRAWER */}
        {showForm && (
          <div className="fixed top-0 right-0 bottom-0 w-full md:w-[700px] bg-white border-l-2 border-black z-50 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">

              {/* COVER IMAGE */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Image de couverture
                </label>

                {coverPreview ? (
                  <div className="relative">
                    <img
                      src={coverPreview}
                      alt="Cover Preview"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverPreview(null);
                        setFormData({ ...formData, cover_image: null });
                      }}
                      className="absolute top-2 right-2 bg-black text-white p-1 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    name="cover_image"
                    accept="image/*"
                    onChange={handleChange}
                  />
                )}
              </div>

              {/* NOM */}
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Nom complet"
                className="w-full border p-3 rounded-lg"
                required
              />

              {/* POSTES */}
              <input
                type="text"
                name="position_fr"
                value={formData.position_fr}
                onChange={handleChange}
                placeholder="Poste (FR)"
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="text"
                name="position_en"
                value={formData.position_en}
                onChange={handleChange}
                placeholder="Position (EN)"
                className="w-full border p-3 rounded-lg"
              />

              {/* PHOTO */}
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg"
              >
                {loading ? "Enregistrement..." : "Enregistrer"}
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default TeamPost;
