import { useEffect, useState, useContext } from "react";
import axios from "axios";
import CONFIG from "../../config/config.js";
import { ThemeContext } from "../../context/ThemeContext";
import {
  PlusCircle, Edit2, Trash2, Save, X, Loader2,
  ArrowLeft, FolderOpen, RefreshCw
} from "lucide-react";

const NAVY   = "#003893";
const ORANGE = "#EA580C";

const MissionPost = () => {
  const { darkMode: dk } = useContext(ThemeContext);

  const [aboutList, setAboutList]   = useState([]);
  const [loading, setLoading]       = useState(false);
  const [fetchLoad, setFetchLoad]   = useState(true);
  const [error, setError]           = useState(null);
  const [success, setSuccess]       = useState(null);
  const [view, setView]             = useState("list"); // list | form | detail
  const [editingId, setEditingId]   = useState(null);
  const [selected, setSelected]     = useState(null);

  /* ── Previews for file inputs ── */
  const [previews, setPreviews] = useState({
    historique_image: null,
    vision_image: null,
    organisation_image: null,
    direction_image: null,
    cover_image_partner: null,
  });

  const emptyForm = {
    historique_title_fr: "", historique_title_en: "",
    historique_description_fr: "", historique_description_en: "",
    historique_image: null,
    vision_title_fr: "", vision_title_en: "",
    vision_description_fr: "", vision_description_en: "",
    vision_image: null,
    organisation_title_fr: "", organisation_title_en: "",
    organisation_description_fr: "", organisation_description_en: "",
    organisation_image: null,
    direction_title_fr: "", direction_title_en: "",
    direction_message_fr: "", direction_message_en: "",
    direction_image: null,
    name_fr_partner: "", website_url: "",
    cover_image_partner: null,
    is_active: true,
  };

  const [formData, setFormData] = useState(emptyForm);

  /* ── Auth ── */
  const authConfig = () => {
    const token = localStorage.getItem("access");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  /* ── Fetch ── */
  const fetchAbout = async () => {
    setFetchLoad(true);
    try {
      const res = await axios.get(CONFIG.API_ABOUT_LIST, authConfig());
      setAboutList(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement");
    } finally {
      setFetchLoad(false);
    }
  };

  useEffect(() => { fetchAbout(); }, []);

  /* ── Handlers ── */
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData(p => ({ ...p, [name]: checked }));
      return;
    }
    if (files && files[0]) {
      setFormData(p => ({ ...p, [name]: files[0] }));
      // Generate preview
      const url = URL.createObjectURL(files[0]);
      setPreviews(p => ({ ...p, [name]: url }));
      return;
    }
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val !== null && val !== "" && val !== undefined) {
        data.append(key, val);
      }
    });

    try {
      if (editingId) {
        await axios.put(
          CONFIG.API_ABOUT_UPDATE(editingId),
          data,
          { ...authConfig(), headers: { ...authConfig().headers, "Content-Type": "multipart/form-data" } }
        );
        setSuccess("Modifié avec succès ✓");
      } else {
        await axios.post(
          CONFIG.API_ABOUT_CREATE,
          data,
          { ...authConfig(), headers: { ...authConfig().headers, "Content-Type": "multipart/form-data" } }
        );
        setSuccess("Créé avec succès ✓");
      }
      await fetchAbout();
      resetForm();
      setView("list");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setSelected(item);
    setFormData({
      historique_title_fr: item.historique_title_fr || "",
      historique_title_en: item.historique_title_en || "",
      historique_description_fr: item.historique_description_fr || "",
      historique_description_en: item.historique_description_en || "",
      historique_image: null,
      vision_title_fr: item.vision_title_fr || "",
      vision_title_en: item.vision_title_en || "",
      vision_description_fr: item.vision_description_fr || "",
      vision_description_en: item.vision_description_en || "",
      vision_image: null,
      organisation_title_fr: item.organisation_title_fr || "",
      organisation_title_en: item.organisation_title_en || "",
      organisation_description_fr: item.organisation_description_fr || "",
      organisation_description_en: item.organisation_description_en || "",
      organisation_image: null,
      direction_title_fr: item.direction_title_fr || "",
      direction_title_en: item.direction_title_en || "",
      direction_message_fr: item.direction_message_fr || "",
      direction_message_en: item.direction_message_en || "",
      direction_image: null,
      name_fr_partner: item.name_fr_partner || "",
      website_url: item.website_url || "",
      cover_image_partner: null,
      is_active: item.is_active ?? true,
    });
    // Show existing images as previews
    setPreviews({
      historique_image:     item.historique_image_url || null,
      vision_image:         item.vision_image_url || null,
      organisation_image:   item.organisation_image_url || null,
      direction_image:      item.direction_image_url || null,
      cover_image_partner:  item.cover_image_partner_url || null,
    });
    setView("form");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet élément ?")) return;
    try {
      await axios.delete(CONFIG.API_ABOUT_DELETE(id), authConfig());
      setSuccess("Supprimé ✓");
      await fetchAbout();
      if (view !== "list") setView("list");
      setSelected(null);
    } catch {
      setError("Erreur lors de la suppression");
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setSelected(null);
    setPreviews({ historique_image: null, vision_image: null, organisation_image: null, direction_image: null, cover_image_partner: null });
  };

  /* ── Theme-aware styles ── */
  const bg     = dk ? "#0a1628" : "#fff";
  const border = dk ? "#1e3a5f" : "#ebebeb";
  const text   = dk ? "#e2e8f0" : "#0a0a0a";
  const sub    = dk ? "#94a3b8" : "#888";
  const surfBg = dk ? "#0f172a" : "#fff";
  const inputBg= dk ? "#1e293b" : "#fafafa";
  const inputBorder = dk ? "#1e3a5f" : "#e5e5e5";

  const cardS = { background: surfBg, borderRadius: 16, border: `1px solid ${border}` };
  const inp = {
    width: "100%", padding: "11px 14px",
    border: `1.5px solid ${inputBorder}`,
    borderRadius: 10, fontSize: 13,
    fontFamily: "inherit", outline: "none",
    background: inputBg, color: text,
    transition: "border-color .2s",
  };
  const lbl = {
    fontSize: 10, fontWeight: 800,
    letterSpacing: "0.12em", textTransform: "uppercase",
    color: sub, marginBottom: 6, display: "block",
  };
  const btnP = {
    display: "flex", alignItems: "center", gap: 8,
    padding: "10px 22px", background: NAVY, color: "#fff",
    border: "none", borderRadius: 10, cursor: "pointer",
    fontWeight: 700, fontSize: 13, fontFamily: "inherit",
  };
  const btnS = {
    display: "flex", alignItems: "center", gap: 8,
    padding: "10px 18px",
    background: dk ? "#1e293b" : "#f5f5f5",
    color: dk ? "#94a3b8" : "#555",
    border: "none", borderRadius: 10, cursor: "pointer",
    fontWeight: 600, fontSize: 13, fontFamily: "inherit",
  };

  /* ── Reusable field components ── */
  const Field = ({ label, name, placeholder, textarea }) => (
    <div>
      <label style={lbl}>{label}</label>
      {textarea
        ? <textarea name={name} value={formData[name]} onChange={handleChange}
            placeholder={placeholder} rows={4}
            style={{ ...inp, resize: "vertical" }} />
        : <input type="text" name={name} value={formData[name]} onChange={handleChange}
            placeholder={placeholder} style={inp} />
      }
    </div>
  );

  const FileField = ({ label, name }) => (
    <div>
      <label style={lbl}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Thumbnail preview — compact 80x80 */}
        <div style={{
          width: 80, height: 80, borderRadius: 10, overflow: "hidden", flexShrink: 0,
          border: `1.5px solid ${inputBorder}`, background: inputBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          {previews[name]
            ? <img src={previews[name]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
            : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={sub} strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          }
        </div>

        {/* Upload button + filename */}
        <label style={{
          flex: 1, display: "flex", flexDirection: "column", gap: 6,
          border: `1.5px dashed ${previews[name] ? NAVY : inputBorder}`,
          borderRadius: 10, padding: "12px 16px", cursor: "pointer",
          background: previews[name] ? `${NAVY}06` : inputBg,
          transition: "border-color .2s, background .2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = NAVY; e.currentTarget.style.background = `${NAVY}08`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = previews[name] ? NAVY : inputBorder; e.currentTarget.style.background = previews[name] ? `${NAVY}06` : inputBg; }}>
          <input type="file" name={name} accept="image/*" onChange={handleChange} style={{ display: "none" }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: previews[name] ? NAVY : sub }}>
            {formData[name] instanceof File
              ? `✓ ${formData[name].name}`
              : previews[name]
                ? "Image actuelle — cliquer pour changer"
                : "Cliquer pour ajouter une image"
            }
          </div>
          <div style={{ fontSize: 11, color: sub }}>JPG, PNG, WebP · Max 5 MB</div>
        </label>

        {/* Remove button if preview */}
        {previews[name] && (
          <button type="button"
            onClick={() => {
              setFormData(p => ({ ...p, [name]: null }));
              setPreviews(p => ({ ...p, [name]: null }));
            }}
            style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#fee2e2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.background = "#fca5a5"}
            onMouseLeave={e => e.currentTarget.style.background = "#fee2e2"}>
            <X size={14} color="#ef4444" />
          </button>
        )}
      </div>
    </div>
  );

  const SectionBlock = ({ title, children }) => (
    <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: `1px solid ${border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <div style={{ width: 4, height: 20, background: `linear-gradient(${NAVY},${ORANGE})`, borderRadius: 2 }} />
        <h4 style={{ fontSize: 14, fontWeight: 800, color: text, margin: 0, letterSpacing: "-0.01em" }}>{title}</h4>
      </div>
      {children}
    </div>
  );

  if (fetchLoad) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", background: bg }}>
      <div style={{ width: 40, height: 40, border: `2px solid ${border}`, borderTopColor: NAVY, borderRadius: "50%", animation: "spin .8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", minHeight: "100vh", background: bg, color: text }}>
      <style>{`
        .btn-p:hover { background:#001f5c!important; }
        .btn-s:hover { background:${dk?"#1e3a5f":"#ebebeb"}!important; }
        input:focus,textarea:focus { border-color:${NAVY}!important; box-shadow:0 0 0 3px ${NAVY}12!important; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        .fade-up { animation:fadeUp .4s cubic-bezier(.22,1,.36,1) both; }
        .mp-row:hover { background:${dk?"#1e293b":"#f7f9ff"}!important; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ ...cardS, padding: "18px 24px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {view !== "list" && (
            <button onClick={() => { resetForm(); setView("list"); }} style={btnS} className="btn-s">
              <ArrowLeft size={16} />
            </button>
          )}
          <div style={{ width: 40, height: 40, borderRadius: 11, background: `linear-gradient(135deg,${NAVY},#0052cc)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FolderOpen size={19} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 800, color: text, margin: 0, letterSpacing: "-0.02em" }}>
              Gestion des Missions
            </h1>
            <p style={{ fontSize: 12, color: sub, margin: 0, marginTop: 1 }}>
              {view === "list" ? `${aboutList.length} élément(s)` : view === "form" ? (editingId ? "Modifier" : "Nouveau") : "Détail"}
            </p>
          </div>
        </div>

        {view === "list" && (
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={fetchAbout} disabled={fetchLoad} style={btnS} className="btn-s">
              <RefreshCw size={14} style={{ animation: fetchLoad ? "spin .8s linear infinite" : "none" }} />
            </button>
            <button onClick={() => { resetForm(); setView("form"); }} style={btnP} className="btn-p">
              <PlusCircle size={15} /> Nouveau
            </button>
          </div>
        )}
      </div>

      {/* ── Alerts ── */}
      {success && (
        <div style={{ padding: "12px 20px", background: "#d1fae5", border: "1px solid #6ee7b7", borderRadius: 10, marginBottom: 16, fontSize: 13, color: "#065f46", fontWeight: 600 }}>
          {success}
        </div>
      )}
      {error && (
        <div style={{ padding: "12px 20px", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 10, marginBottom: 16, fontSize: 13, color: "#991b1b", fontWeight: 600 }}>
          {error}
        </div>
      )}

      {/* ════ FORM ════ */}
      {view === "form" && (
        <div style={{ ...cardS, padding: "28px 32px" }} className="fade-up">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${border}` }}>
            <div style={{ width: 4, height: 22, background: `linear-gradient(${NAVY},${ORANGE})`, borderRadius: 2 }} />
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: text }}>
              {editingId ? "Modifier le contenu" : "Nouveau contenu"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} encType="multipart/form-data">

            {/* Historique */}
            <SectionBlock title="Historique">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
                <Field label="Titre (FR)" name="historique_title_fr" placeholder="Titre historique en français" />
                <Field label="Title (EN)" name="historique_title_en" placeholder="History title in English" />
                <Field label="Description (FR)" name="historique_description_fr" placeholder="Description..." textarea />
                <Field label="Description (EN)" name="historique_description_en" placeholder="Description..." textarea />
              </div>
              <FileField label="Image historique" name="historique_image" />
              {editingId && !formData.historique_image && <p style={{ fontSize: 11, color: sub, marginTop: 4 }}>Laissez vide pour conserver l'image actuelle.</p>}
            </SectionBlock>

            {/* Vision */}
            <SectionBlock title="Vision">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
                <Field label="Titre (FR)" name="vision_title_fr" placeholder="Titre vision" />
                <Field label="Title (EN)" name="vision_title_en" placeholder="Vision title" />
                <Field label="Description (FR)" name="vision_description_fr" placeholder="Description..." textarea />
                <Field label="Description (EN)" name="vision_description_en" placeholder="Description..." textarea />
              </div>
              <FileField label="Image vision" name="vision_image" />
              {editingId && !formData.vision_image && <p style={{ fontSize: 11, color: sub, marginTop: 4 }}>Laissez vide pour conserver l'image actuelle.</p>}
            </SectionBlock>

            {/* Organisation */}
            <SectionBlock title="Organisation">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
                <Field label="Titre (FR)" name="organisation_title_fr" placeholder="Titre organisation" />
                <Field label="Title (EN)" name="organisation_title_en" placeholder="Organisation title" />
                <Field label="Description (FR)" name="organisation_description_fr" placeholder="Description..." textarea />
                <Field label="Description (EN)" name="organisation_description_en" placeholder="Description..." textarea />
              </div>
              <FileField label="Image organisation" name="organisation_image" />
              {editingId && !formData.organisation_image && <p style={{ fontSize: 11, color: sub, marginTop: 4 }}>Laissez vide pour conserver l'image actuelle.</p>}
            </SectionBlock>

            {/* Direction */}
            <SectionBlock title="Direction">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
                <Field label="Titre (FR)" name="direction_title_fr" placeholder="Titre direction" />
                <Field label="Title (EN)" name="direction_title_en" placeholder="Direction title" />
                <Field label="Message (FR)" name="direction_message_fr" placeholder="Message du directeur..." textarea />
                <Field label="Message (EN)" name="direction_message_en" placeholder="Director's message..." textarea />
              </div>
              <FileField label="Photo direction" name="direction_image" />
              {editingId && !formData.direction_image && <p style={{ fontSize: 11, color: sub, marginTop: 4 }}>Laissez vide pour conserver la photo actuelle.</p>}
            </SectionBlock>

            {/* Partenaire */}
            <SectionBlock title="Partenaire (logo & lien)">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
                <Field label="Nom du partenaire (FR)" name="name_fr_partner" placeholder="Nom du partenaire" />
                <div>
                  <label style={lbl}>Site web (URL)</label>
                  <input type="url" name="website_url" value={formData.website_url} onChange={handleChange}
                    placeholder="https://partenaire.com" style={inp} />
                </div>
              </div>
              <FileField label="Logo / Image partenaire" name="cover_image_partner" />
              {editingId && !formData.cover_image_partner && <p style={{ fontSize: 11, color: sub, marginTop: 4 }}>Laissez vide pour conserver le logo actuel.</p>}
            </SectionBlock>

            {/* Statut */}
            <div style={{ marginBottom: 28 }}>
              <div onClick={() => setFormData(p => ({ ...p, is_active: !p.is_active }))}
                style={{ border: `2px solid ${formData.is_active ? NAVY : inputBorder}`, borderRadius: 10, padding: "12px 16px", cursor: "pointer", background: formData.is_active ? `${NAVY}08` : inputBg, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${formData.is_active ? NAVY : "#ccc"}`, background: formData.is_active ? NAVY : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {formData.is_active && <svg width="10" height="10" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg>}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: formData.is_active ? NAVY : sub }}>
                  {formData.is_active ? "Actif — visible sur le site" : "Inactif — masqué"}
                </span>
                <div style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: formData.is_active ? "#10b981" : "#d1d5db" }} />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, paddingTop: 20, borderTop: `1px solid ${border}` }}>
              <button type="submit" disabled={loading} style={{ ...btnP, minWidth: 180, justifyContent: "center" }} className="btn-p">
                {loading
                  ? <><Loader2 size={15} style={{ animation: "spin .8s linear infinite" }} />Enregistrement...</>
                  : <><Save size={15} />{editingId ? "Mettre à jour" : "Créer"}</>
                }
              </button>
              <button type="button" onClick={() => { resetForm(); setView("list"); }} style={btnS} className="btn-s">
                <X size={14} /> Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ════ LIST ════ */}
      {view === "list" && (
        <div className="fade-up">
          {aboutList.length === 0 ? (
            <div style={{ ...cardS, padding: "60px 0", textAlign: "center" }}>
              <FolderOpen size={40} color={sub} style={{ margin: "0 auto 16px" }} />
              <p style={{ color: sub, fontSize: 14, marginBottom: 20 }}>Aucun contenu</p>
              <button onClick={() => { resetForm(); setView("form"); }} style={btnP} className="btn-p">
                <PlusCircle size={14} /> Créer le premier élément
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {aboutList.map((item, idx) => (
                <div key={item.id} className="mp-row"
                  style={{ ...cardS, padding: "20px 24px", cursor: "pointer", transition: "background .15s", animation: `fadeUp .4s ease ${idx*.05}s both` }}
                  onClick={() => { setSelected(item); setView("detail"); }}>

                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Title */}
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: text, margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.historique_title_fr || item.vision_title_fr || "Sans titre"}
                      </h3>
                      {/* Sections présentes */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                        {[
                          ["Historique", item.historique_title_fr],
                          ["Vision",     item.vision_title_fr],
                          ["Organisation", item.organisation_title_fr],
                          ["Direction", item.direction_title_fr],
                          ["Partenaire", item.name_fr_partner],
                        ].filter(([, v]) => v).map(([label]) => (
                          <span key={label} style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: `${NAVY}15`, color: NAVY, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                            {label}
                          </span>
                        ))}
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: item.is_active ? "#d1fae5" : "#f3f4f6", color: item.is_active ? "#065f46" : "#9ca3af" }}>
                          {item.is_active ? "Actif" : "Inactif"}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleEdit(item)}
                        style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: `${NAVY}12`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        onMouseEnter={e => e.currentTarget.style.background = `${NAVY}25`}
                        onMouseLeave={e => e.currentTarget.style.background = `${NAVY}12`}>
                        <Edit2 size={14} color={NAVY} />
                      </button>
                      <button onClick={() => handleDelete(item.id)}
                        style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: "#fee2e2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#fca5a5"}
                        onMouseLeave={e => e.currentTarget.style.background = "#fee2e2"}>
                        <Trash2 size={14} color="#ef4444" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════ DETAIL ════ */}
      {view === "detail" && selected && (
        <div style={{ ...cardS, padding: "28px 32px" }} className="fade-up">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${border}` }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: text }}>
              {selected.historique_title_fr || selected.vision_title_fr || "Détail"}
            </h2>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => handleEdit(selected)} style={btnP} className="btn-p">
                <Edit2 size={14} /> Modifier
              </button>
              <button onClick={() => handleDelete(selected.id)} style={{ ...btnS, color: "#ef4444" }}>
                <Trash2 size={14} /> Supprimer
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { label: "Historique",    titleFr: selected.historique_title_fr, descFr: selected.historique_description_fr, img: selected.historique_image_url },
              { label: "Vision",        titleFr: selected.vision_title_fr,     descFr: selected.vision_description_fr,     img: selected.vision_image_url },
              { label: "Organisation",  titleFr: selected.organisation_title_fr, descFr: selected.organisation_description_fr, img: selected.organisation_image_url },
              { label: "Direction",     titleFr: selected.direction_title_fr,   descFr: selected.direction_message_fr,       img: selected.direction_image_url },
            ].filter(s => s.titleFr || s.img).map(({ label, titleFr, descFr, img }) => (
              <div key={label} style={{ background: dk ? "#1e293b" : "#f8faff", borderRadius: 12, padding: "16px 20px", borderLeft: `3px solid ${NAVY}` }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: NAVY, marginBottom: 10 }}>{label}</div>
                {titleFr && <div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 6 }}>{titleFr}</div>}
                {descFr && <p style={{ fontSize: 13, color: sub, lineHeight: 1.7, margin: "0 0 10px" }}>{descFr}</p>}
                {img && <img src={img} style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 8 }} alt="" />}
              </div>
            ))}

            {/* Partenaire */}
            {(selected.name_fr_partner || selected.cover_image_partner_url) && (
              <div style={{ background: dk ? "#1e293b" : "#fff8f5", borderRadius: 12, padding: "16px 20px", borderLeft: `3px solid ${ORANGE}` }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: 10 }}>Partenaire</div>
                {selected.cover_image_partner_url && (
                  <img src={selected.cover_image_partner_url} style={{ height: 48, objectFit: "contain", marginBottom: 8 }} alt="" />
                )}
                {selected.name_fr_partner && <div style={{ fontSize: 14, fontWeight: 700, color: text }}>{selected.name_fr_partner}</div>}
                {selected.website_url && (
                  <a href={selected.website_url} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 12, color: NAVY, textDecoration: "none", display: "block", marginTop: 4 }}>
                    {selected.website_url}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionPost;