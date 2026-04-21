import { useEffect, useState } from "react";
import axios from "axios";
import CONFIG from "../../config/config.js";

const MissionPost = () => {
  const [aboutList, setAboutList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [formData, setFormData] = useState({
    historique_title_fr: "", historique_title_en: "", historique_description_fr: "", historique_description_en: "",
    vision_title_fr: "", vision_title_en: "", vision_description_fr: "", vision_description_en: "",
    organisation_title_fr: "", organisation_title_en: "", organisation_description_fr: "", organisation_description_en: "",
    direction_title_fr: "", direction_title_en: "", direction_message_fr: "", direction_message_en: "",
    historique_image: null, vision_image: null, organisation_image: null, direction_image: null, is_active: true,
  });

  const fetchAbout = async () => {
    setFetchLoading(true);
    try {
      const res = await axios.get(CONFIG.API_ABOUT_LIST);
      console.log("Data received:", res.data);
      setAboutList(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Erreur chargement:", error);
      setAboutList([]);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => { fetchAbout(); }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") data.append(key, formData[key]);
    });

    try {
      if (editingId) {
        await axios.put(CONFIG.API_ABOUT_UPDATE(editingId), data, { headers: { "Content-Type": "multipart/form-data" } });
        alert("Modifié ✅");
      } else {
        await axios.post(CONFIG.API_ABOUT_CREATE, data, { headers: { "Content-Type": "multipart/form-data" } });
        alert("Créé ✅");
      }
      fetchAbout();
      setShowForm(false);
      resetForm();
    } catch (error) {
      alert("Erreur ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      historique_title_fr: item.historique_title_fr || "", historique_title_en: item.historique_title_en || "",
      historique_description_fr: item.historique_description_fr || "", historique_description_en: item.historique_description_en || "",
      vision_title_fr: item.vision_title_fr || "", vision_title_en: item.vision_title_en || "",
      vision_description_fr: item.vision_description_fr || "", vision_description_en: item.vision_description_en || "",
      organisation_title_fr: item.organisation_title_fr || "", organisation_title_en: item.organisation_title_en || "",
      organisation_description_fr: item.organisation_description_fr || "", organisation_description_en: item.organisation_description_en || "",
      direction_title_fr: item.direction_title_fr || "", direction_title_en: item.direction_title_en || "",
      direction_message_fr: item.direction_message_fr || "", direction_message_en: item.direction_message_en || "",
      historique_image: null, vision_image: null, organisation_image: null, direction_image: null, is_active: item.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ?")) return;
    try {
      await axios.delete(CONFIG.API_ABOUT_DELETE(id));
      alert("Supprimé ✅");
      fetchAbout();
    } catch (error) {
      alert("Erreur ❌");
    }
  };

  const resetForm = () => {
    setFormData({
      historique_title_fr: "", historique_title_en: "", historique_description_fr: "", historique_description_en: "",
      vision_title_fr: "", vision_title_en: "", vision_description_fr: "", vision_description_en: "",
      organisation_title_fr: "", organisation_title_en: "", organisation_description_fr: "", organisation_description_en: "",
      direction_title_fr: "", direction_title_en: "", direction_message_fr: "", direction_message_en: "",
      historique_image: null, vision_image: null, organisation_image: null, direction_image: null, is_active: true,
    });
    setEditingId(null);
  };

  const InputField = ({ label, name, value, type = "text", rows }) => (
    <div>
      <label className="block text-xs font-bold text-gray-600 uppercase mb-2">{label}</label>
      {type === "textarea" ? (
        <textarea name={name} value={value} onChange={handleChange} rows={rows || 4} placeholder={`Entrez ${label.toLowerCase()}`}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-2 focus:ring-black/10 outline-none text-sm" />
      ) : type === "file" ? (
        <input type="file" name={name} onChange={handleChange} accept="image/*"
          className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg hover:border-black cursor-pointer file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-black file:text-white file:text-xs file:font-semibold text-sm" />
      ) : (
        <input type="text" name={name} value={value} onChange={handleChange} placeholder={`Entrez ${label.toLowerCase()}`}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-2 focus:ring-black/10 outline-none text-sm" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-black to-[#1d1d1b] py-12 px-6 mb-10">
        <div className="max-w-6xl mx-auto">
          <span className="inline-block mb-2 px-3 py-1 bg-white/10 rounded-full text-white/80 text-xs font-bold uppercase">Gestion</span>
          <h1 className="text-4xl font-bold text-white mb-2">À Propos / Mission</h1>
          <p className="text-gray-300">Contenu institutionnel BETCOM AI</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16">
        {/* Actions */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Contenus</h2>
            <p className="text-gray-500 text-sm">{aboutList.length} élément{aboutList.length > 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}
            className="flex items-center gap-2 px-6 py-2.5 bg-black text-white font-semibold text-sm rounded-xl hover:bg-[#1d1d1b] transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
            </svg>
            {showForm ? "Annuler" : "Nouveau"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-xl border mb-10">
            <div className="bg-black px-6 py-4">
              <h3 className="text-lg font-bold text-white">{editingId ? "Modifier" : "Créer"}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Historique */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b"><div className="w-1 h-5 bg-black rounded"/><h4 className="font-bold">Historique</h4></div>
                <div className="grid md:grid-cols-2 gap-3">
                  <InputField label="Titre FR" name="historique_title_fr" value={formData.historique_title_fr} />
                  <InputField label="Title EN" name="historique_title_en" value={formData.historique_title_en} />
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <InputField label="Description FR" name="historique_description_fr" value={formData.historique_description_fr} type="textarea" />
                  <InputField label="Description EN" name="historique_description_en" value={formData.historique_description_en} type="textarea" />
                </div>
                <InputField label="Image" name="historique_image" type="file" />
              </div>

              {/* Vision */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b"><div className="w-1 h-5 bg-black rounded"/><h4 className="font-bold">Vision</h4></div>
                <div className="grid md:grid-cols-2 gap-3">
                  <InputField label="Titre FR" name="vision_title_fr" value={formData.vision_title_fr} />
                  <InputField label="Title EN" name="vision_title_en" value={formData.vision_title_en} />
                  <InputField label="Description FR" name="vision_description_fr" value={formData.vision_description_fr} type="textarea" />
                  <InputField label="Description EN" name="vision_description_en" value={formData.vision_description_en} type="textarea" />
                </div>
                <InputField label="Image" name="vision_image" type="file" />
              </div>

              {/* Organisation */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b"><div className="w-1 h-5 bg-black rounded"/><h4 className="font-bold">Organisation</h4></div>
                <div className="grid md:grid-cols-2 gap-3">
                  <InputField label="Titre FR" name="organisation_title_fr" value={formData.organisation_title_fr} />
                  <InputField label="Title EN" name="organisation_title_en" value={formData.organisation_title_en} />
                  <InputField label="Description FR" name="organisation_description_fr" value={formData.organisation_description_fr} type="textarea" />
                  <InputField label="Description EN" name="organisation_description_en" value={formData.organisation_description_en} type="textarea" />
                </div>
                <InputField label="Image" name="organisation_image" type="file" />
              </div>

              {/* Direction */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b"><div className="w-1 h-5 bg-black rounded"/><h4 className="font-bold">Direction</h4></div>
                <div className="grid md:grid-cols-2 gap-3">
                  <InputField label="Titre FR" name="direction_title_fr" value={formData.direction_title_fr} />
                  <InputField label="Title EN" name="direction_title_en" value={formData.direction_title_en} />
                  <InputField label="Message FR" name="direction_message_fr" value={formData.direction_message_fr} type="textarea" />
                  <InputField label="Message EN" name="direction_message_en" value={formData.direction_message_en} type="textarea" />
                </div>
                <InputField label="Photo" name="direction_image" type="file" />
              </div>

              {/* Submit */}
              <div className="pt-4 border-t flex gap-2">
                <button type="submit" disabled={loading}
                  className="flex-1 px-6 py-2.5 bg-black text-white font-semibold text-sm rounded-xl hover:bg-[#1d1d1b] transition disabled:opacity-50">
                  {loading ? "..." : (editingId ? "Modifier" : "Créer")}
                </button>
                {editingId && <button type="button" onClick={() => { setShowForm(false); resetForm(); }}
                  className="px-6 py-2.5 bg-gray-100 font-semibold text-sm rounded-xl hover:bg-gray-200 transition">Annuler</button>}
              </div>
            </form>
          </div>
        )}

        {/* Liste */}
        {fetchLoading ? (
          <div className="bg-white rounded-xl shadow border p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            <p className="text-gray-500">Chargement des contenus...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {aboutList.length === 0 ? (
            <div className="bg-white rounded-xl shadow border p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Aucun contenu</h3>
              <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-5 py-2 bg-black text-white font-semibold text-sm rounded-lg hover:bg-[#1d1d1b] transition">Créer</button>
            </div>
          ) : (
            aboutList.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow border p-6 hover:shadow-lg transition">
                <div className="flex justify-between mb-4 pb-3 border-b">
                  <div>
                    <h3 className="text-lg font-bold">{item.historique_title_fr || "Sans titre"}</h3>
                    {item.historique_title_en && <p className="text-sm text-gray-500">{item.historique_title_en}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-lg transition">Modifier</button>
                    <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs rounded-lg transition">Supprimer</button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  {/* Historique */}
                  {(item.historique_description_fr || item.historique_image_url) && (
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        <div className="w-0.5 h-4 bg-black rounded"/>
                        <strong className="text-xs">Historique</strong>
                      </div>
                      {item.historique_description_fr && (
                        <p className="text-gray-700 line-clamp-3 mb-2">{item.historique_description_fr}</p>
                      )}
                      {item.historique_image_url && (
                        <img src={item.historique_image_url} alt="Historique" className="w-full h-32 object-cover rounded-lg" />
                      )}
                    </div>
                  )}
                  
                  {/* Vision */}
                  {(item.vision_description_fr || item.vision_image_url) && (
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        <div className="w-0.5 h-4 bg-black rounded"/>
                        <strong className="text-xs">Vision</strong>
                      </div>
                      {item.vision_description_fr && (
                        <p className="text-gray-700 line-clamp-3 mb-2">{item.vision_description_fr}</p>
                      )}
                      {item.vision_image_url && (
                        <img src={item.vision_image_url} alt="Vision" className="w-full h-32 object-cover rounded-lg" />
                      )}
                    </div>
                  )}
                  
                  {/* Organisation */}
                  {(item.organisation_description_fr || item.organisation_image_url) && (
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        <div className="w-0.5 h-4 bg-black rounded"/>
                        <strong className="text-xs">Organisation</strong>
                      </div>
                      {item.organisation_description_fr && (
                        <p className="text-gray-700 line-clamp-3 mb-2">{item.organisation_description_fr}</p>
                      )}
                      {item.organisation_image_url && (
                        <img src={item.organisation_image_url} alt="Organisation" className="w-full h-32 object-cover rounded-lg" />
                      )}
                    </div>
                  )}
                  
                  {/* Direction */}
                  {(item.direction_message_fr || item.direction_image_url) && (
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        <div className="w-0.5 h-4 bg-black rounded"/>
                        <strong className="text-xs">Direction</strong>
                      </div>
                      {item.direction_message_fr && (
                        <p className="text-gray-700 line-clamp-3 mb-2">{item.direction_message_fr}</p>
                      )}
                      {item.direction_image_url && (
                        <img src={item.direction_image_url} alt="Direction" className="w-full h-32 object-cover rounded-lg" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default MissionPost;