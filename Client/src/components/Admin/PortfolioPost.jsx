import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import { PlusCircle, Loader2, Edit2, Trash2, Check, Save, X, MapPin, User, Ruler, Calendar, FolderOpen, ImageIcon } from "lucide-react";

const CATEGORY_OPTIONS = [
  { value: "", label: "-- Choisir une catégorie --" },
  { value: "selected_projects", label: "Selected Projects" },
  { value: "adaptive_transformation", label: "Adaptive Transformation" },
  { value: "advisory_services", label: "Advisory Services" },
  { value: "aviation", label: "Aviation" },
  { value: "branded_environments", label: "Branded Environments" },
  { value: "corporate_commercial", label: "Corporate and Commercial" },
  { value: "cultural_civic", label: "Cultural and Civic" },
  { value: "federal", label: "Federal" },
  { value: "health", label: "Health" },
  { value: "health_education", label: "Health Education" },
  { value: "higher_education", label: "Higher Education" },
  { value: "hospitality", label: "Hospitality" },
  { value: "k12_education", label: "K-12 Education" },
  { value: "landscape_architecture", label: "Landscape Architecture" },
  { value: "residential", label: "Residential" },
  { value: "science_technology", label: "Science and Technology" },
  { value: "sports_entertainment", label: "Sports, Recreation, and Entertainment" },
  { value: "transportation", label: "Transportation" },
  { value: "urban_design", label: "Urban Design" },
  { value: "workplace", label: "Workplace" },
];

const PortfolioPost = () => {
  const [portfolioList, setPortfolioList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // FORM STATES
  const [category, setCategory] = useState("");
  const [project_name_fr, setProjectNameFr] = useState("");
  const [project_name_en, setProjectNameEn] = useState("");
  const [description_title_fr, setDescriptionTitleFr] = useState("");
  const [description_title_en, setDescriptionTitleEn] = useState("");
  const [description_fr, setDescriptionFr] = useState("");
  const [description_en, setDescriptionEn] = useState("");
  const [location_fr, setLocationFr] = useState("");
  const [location_en, setLocationEn] = useState("");
  const [client_fr, setClientFr] = useState("");
  const [client_en, setClientEn] = useState("");
  const [surface_fr, setSurfaceFr] = useState("");
  const [surface_en, setSurfaceEn] = useState("");
  const [completion_date_fr, setCompletionDateFr] = useState("");
  const [completion_date_en, setCompletionDateEn] = useState("");

  const [coverPhoto, setCoverPhoto] = useState(null);
  const [images, setImages] = useState(Array(20).fill(null));
  const [isActive, setIsActive] = useState(true);

  const [showForm, setShowForm] = useState(false);

  // Fetch portfolio
  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/portfolio/`);
      const data = await res.json();
      setPortfolioList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPortfolio(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      if (category) formData.append("category", category);
      if (project_name_fr) formData.append("project_name_fr", project_name_fr);
      if (project_name_en) formData.append("project_name_en", project_name_en);
      if (description_title_fr) formData.append("description_title_fr", description_title_fr);
      if (description_title_en) formData.append("description_title_en", description_title_en);
      if (description_fr) formData.append("description_fr", description_fr);
      if (description_en) formData.append("description_en", description_en);
      if (location_fr) formData.append("location_fr", location_fr);
      if (location_en) formData.append("location_en", location_en);
      if (client_fr) formData.append("client_fr", client_fr);
      if (client_en) formData.append("client_en", client_en);
      if (surface_fr) formData.append("surface_fr", surface_fr);
      if (surface_en) formData.append("surface_en", surface_en);
      if (completion_date_fr) formData.append("completion_date_fr", completion_date_fr);
      if (completion_date_en) formData.append("completion_date_en", completion_date_en);
      formData.append("is_active", isActive);

      if (coverPhoto) formData.append("cover_photo", coverPhoto);
      images.forEach((img, idx) => { if (img) formData.append(`image_${idx+1}`, img); });

      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${CONFIG.BASE_URL}/api/portfolio/${editingId}/`
        : `${CONFIG.BASE_URL}/api/portfolio/`;

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Erreur API:", errorData);
        throw new Error("Erreur sauvegarde");
      }

      await fetchPortfolio();
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setCategory("");
    setProjectNameFr(""); setProjectNameEn("");
    setDescriptionTitleFr(""); setDescriptionTitleEn("");
    setDescriptionFr(""); setDescriptionEn("");
    setLocationFr(""); setLocationEn("");
    setClientFr(""); setClientEn("");
    setSurfaceFr(""); setSurfaceEn("");
    setCompletionDateFr(""); setCompletionDateEn("");
    setCoverPhoto(null);
    setImages(Array(20).fill(null));
    setIsActive(true);
  };

  const editPortfolio = (item) => {
    setEditingId(item.id);
    setCategory(item.category || "");
    setProjectNameFr(item.project_name_fr || "");
    setProjectNameEn(item.project_name_en || "");
    setDescriptionTitleFr(item.description_title_fr || "");
    setDescriptionTitleEn(item.description_title_en || "");
    setDescriptionFr(item.description_fr || "");
    setDescriptionEn(item.description_en || "");
    setLocationFr(item.location_fr || "");
    setLocationEn(item.location_en || "");
    setClientFr(item.client_fr || "");
    setClientEn(item.client_en || "");
    setSurfaceFr(item.surface_fr || "");
    setSurfaceEn(item.surface_en || "");
    setCompletionDateFr(item.completion_date_fr || "");
    setCompletionDateEn(item.completion_date_en || "");
    setIsActive(item.is_active);
    setShowForm(true);
  };

  const deletePortfolio = async (id) => {
    if (!window.confirm("Supprimer ce portfolio ?")) return;
    try {
      await fetch(`${CONFIG.BASE_URL}/api/portfolio/${id}/`, { method: "DELETE" });
      await fetchPortfolio();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
              <FolderOpen className="w-10 h-10 text-orange-500" />
              Gestion des Portfolios
            </h1>
            <p className="text-gray-600 mt-2">
              {portfolioList.length} projet{portfolioList.length > 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); if(!showForm) resetForm(); }}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
          >
            {showForm ? <X className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            {showForm ? "Fermer" : "Nouveau Portfolio"}
          </button>
        </div>

        {/* FORMULAIRE */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {editingId ? "Modifier le Portfolio" : "Créer un nouveau Portfolio"}
            </h2>
            
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
              
              {/* CATÉGORIE */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="block font-semibold text-gray-700 mb-2">Catégorie</label>
                <select 
                  value={category} 
                  onChange={e=>setCategory(e.target.value)}
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none"
                >
                  {CATEGORY_OPTIONS.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* NOM DU PROJET */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Nom du projet (FR) *</label>
                  <input 
                    type="text"
                    placeholder="Nom du projet en français" 
                    value={project_name_fr} 
                    onChange={e=>setProjectNameFr(e.target.value)}
                    required
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Project Name (EN)</label>
                  <input 
                    type="text"
                    placeholder="Project name in English" 
                    value={project_name_en} 
                    onChange={e=>setProjectNameEn(e.target.value)}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* TITRE DESCRIPTION */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Titre Description (FR)</label>
                  <input 
                    type="text"
                    placeholder="Titre de la description" 
                    value={description_title_fr} 
                    onChange={e=>setDescriptionTitleFr(e.target.value)}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Description Title (EN)</label>
                  <input 
                    type="text"
                    placeholder="Description title" 
                    value={description_title_en} 
                    onChange={e=>setDescriptionTitleEn(e.target.value)}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Description (FR)</label>
                  <textarea 
                    placeholder="Description détaillée" 
                    value={description_fr} 
                    onChange={e=>setDescriptionFr(e.target.value)}
                    rows={5}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Description (EN)</label>
                  <textarea 
                    placeholder="Detailed description" 
                    value={description_en} 
                    onChange={e=>setDescriptionEn(e.target.value)}
                    rows={5}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* LOCALISATION */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Localisation (FR)
                  </label>
                  <input 
                    type="text"
                    placeholder="Paris, France" 
                    value={location_fr} 
                    onChange={e=>setLocationFr(e.target.value)}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Location (EN)
                  </label>
                  <input 
                    type="text"
                    placeholder="Paris, France" 
                    value={location_en} 
                    onChange={e=>setLocationEn(e.target.value)}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* CLIENT */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" /> Client (FR)
                  </label>
                  <input 
                    type="text"
                    placeholder="Nom du client" 
                    value={client_fr} 
                    onChange={e=>setClientFr(e.target.value)}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" /> Client (EN)
                  </label>
                  <input 
                    type="text"
                    placeholder="Client name" 
                    value={client_en} 
                    onChange={e=>setClientEn(e.target.value)}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* SURFACE */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Ruler className="w-4 h-4" /> Surface (FR)
                  </label>
                  <input 
                    type="text"
                    placeholder="Ex: 5000 m²" 
                    value={surface_fr} 
                    onChange={e=>setSurfaceFr(e.target.value)}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Ruler className="w-4 h-4" /> Surface (EN)
                  </label>
                  <input 
                    type="text"
                    placeholder="Ex: 5000 m²" 
                    value={surface_en} 
                    onChange={e=>setSurfaceEn(e.target.value)}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* DATE DE RÉALISATION */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Date de réalisation (FR)
                  </label>
                  <input 
                    type="text"
                    placeholder="Ex: 2024" 
                    value={completion_date_fr} 
                    onChange={e=>setCompletionDateFr(e.target.value)}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Completion Date (EN)
                  </label>
                  <input 
                    type="text"
                    placeholder="Ex: 2024" 
                    value={completion_date_en} 
                    onChange={e=>setCompletionDateEn(e.target.value)}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* COVER PHOTO */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="block font-semibold text-gray-700 mb-2">Photo de couverture</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e=>setCoverPhoto(e.target.files[0])}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
              </div>

              {/* IMAGES 1 À 20 */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <label className="block font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" /> Images du Projet (jusqu'à 20)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Image {idx+1}</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e=>{
                          const newImages = [...images]; 
                          newImages[idx]=e.target.files[0]; 
                          setImages(newImages);
                        }}
                        className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-orange-50 file:text-orange-700"
                      />
                      {img && (
                        <div className="mt-2 relative">
                          <img src={URL.createObjectURL(img)} alt={`Preview ${idx+1}`} className="w-full h-20 object-cover rounded"/>
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = [...images];
                              newImages[idx] = null;
                              setImages(newImages);
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* STATUT */}
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                <input 
                  type="checkbox" 
                  checked={isActive} 
                  onChange={()=>setIsActive(!isActive)}
                  className="w-5 h-5"
                />
                <label className="font-semibold text-gray-700">Portfolio actif</label>
              </div>

              {/* BOUTONS */}
              <div className="flex gap-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin"/> Enregistrement...</>
                  ) : (
                    <><Save className="w-5 h-5"/> {editingId ? "Mettre à jour" : "Créer"}</>
                  )}
                </button>
                <button 
                  type="button"
                  onClick={() => { resetForm(); setShowForm(false); }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-semibold"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LISTE */}
        <div className="grid gap-6">
          {portfolioList.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {item.project_name_fr || item.project_name_en || "Sans titre"}
                  </h2>
                  {item.category && (
                    <span className="inline-block mt-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                      {CATEGORY_OPTIONS.find(c => c.value === item.category)?.label || item.category}
                    </span>
                  )}
                  {(item.location_fr || item.location_en) && (
                    <p className="text-gray-600 flex items-center gap-2 mt-2">
                      <MapPin className="w-4 h-4"/> {item.location_fr || item.location_en}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>editPortfolio(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                    <Edit2 className="w-5 h-5"/>
                  </button>
                  <button onClick={()=>deletePortfolio(item.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                    <Trash2 className="w-5 h-5"/>
                  </button>
                </div>
              </div>
              
              {(item.description_fr || item.description_en) && (
                <p className="text-gray-700 mb-4">{item.description_fr || item.description_en}</p>
              )}

              {item.cover_photo_url && (
                <img src={item.cover_photo_url} alt="Cover" className="w-full h-64 object-cover rounded-lg mb-4"/>
              )}

              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 20 }, (_, idx) => {
                  const imageUrl = item[`image_${idx+1}_url`];
                  return imageUrl ? (
                    <img key={idx} src={imageUrl} alt={`Image ${idx+1}`} className="w-full h-20 object-cover rounded-lg"/>
                  ) : null;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPost;