import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import {
  Users, Loader2, Trash2, PlusCircle, Edit2, X, Save,
  RefreshCw, Image as ImageIcon, Check, Sparkles,
  Mail, Linkedin, Crown, ArrowLeft, UserCircle
} from "lucide-react";

const NAVY   = "#003893";
const ORANGE = "#EA580C";

const TeamPost = () => {
  const [membres, setMembres]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError]             = useState(null);
  const [success, setSuccess]         = useState(null);
  const [view, setView]               = useState("list"); // "list" | "form" | "detail"
  const [editingId, setEditingId]     = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [uploadStep, setUploadStep]   = useState("");

  const [formData, setFormData] = useState({
    full_name: "", position_fr: "", position_en: "",
    bio_fr: "", bio_en: "", email: "", linkedin: "",
    role: "membre", is_leader: false, is_active: true,
    photo: null, cover_image: null,
  });
  const [photoPreview, setPhotoPreview]   = useState(null);
  const [coverPreview, setCoverPreview]   = useState(null);

  /* ── Auth headers ── */
  const authHeaders = () => {
    const token = localStorage.getItem("access");
    return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  };

  /* ── Fetch ── */
  const fetchMembres = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(CONFIG.API_TEAM_LIST, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Erreur " + res.status);
      const data = await res.json();
      setMembres(Array.isArray(data) ? data : (data.results ?? []));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setFetchLoading(false);
    }
  };

  useEffect(() => { fetchMembres(); }, []);

  /* ── Cloudinary ── */
  const uploadToCloudinary = async (file) => {
    if (!file || typeof file === "string") return file ?? null;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`, { method: "POST", body: fd });
    const data = await res.json();
    return data.secure_url ?? null;
  };

  /* ── Handlers ── */
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (files) {
      const file = files[0];
      setFormData(p => ({ ...p, [name]: file }));
      const url = URL.createObjectURL(file);
      if (name === "photo")        setPhotoPreview(url);
      if (name === "cover_image")  setCoverPreview(url);
    } else if (type === "checkbox") {
      setFormData(p => ({ ...p, [name]: checked }));
    } else {
      setFormData(p => ({ ...p, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({ full_name: "", position_fr: "", position_en: "", bio_fr: "", bio_en: "", email: "", linkedin: "", role: "membre", is_leader: false, is_active: true, photo: null, cover_image: null });
    setPhotoPreview(null); setCoverPreview(null); setEditingId(null); setSelectedMember(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(null);
    try {
      setUploadStep("uploading");
      const photoUrl = await uploadToCloudinary(formData.photo);
      const coverUrl = await uploadToCloudinary(formData.cover_image);
      setUploadStep("saving");
      const payload = { ...formData, photo: photoUrl, cover_image: coverUrl };
      const method  = editingId ? "PUT" : "POST";
      const url     = editingId ? CONFIG.API_TEAM_UPDATE(editingId) : CONFIG.API_TEAM_CREATE;
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Erreur lors de l'enregistrement");
      setSuccess(editingId ? "Membre mis à jour ✓" : "Membre créé ✓");
      resetForm(); await fetchMembres(); setView("list");
    } catch (err) { setError(err.message); }
    finally { setUploadStep(""); setLoading(false); }
  };

  const handleEdit = (m) => {
    setEditingId(m.id); setSelectedMember(m);
    setFormData({ full_name: m.full_name ?? "", position_fr: m.position_fr ?? "", position_en: m.position_en ?? "", bio_fr: m.bio_fr ?? "", bio_en: m.bio_en ?? "", email: m.email ?? "", linkedin: m.linkedin ?? "", role: m.role ?? "membre", is_leader: m.is_leader ?? false, is_active: m.is_active ?? true, photo: m.photo ?? null, cover_image: m.cover_image ?? null });
    setPhotoPreview(m.photo_url || m.photo || null);
    setCoverPreview(m.cover_image || null);
    setView("form");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce membre ?")) return;
    try {
      await fetch(CONFIG.API_TEAM_DELETE(id), { method: "DELETE", headers: authHeaders() });
      setSuccess("Membre supprimé ✓");
      await fetchMembres();
      if (view === "detail") setView("list");
      setSelectedMember(null);
    } catch (err) { setError(err.message); }
  };

  /* ── Styles ── */
  const card = { background: "#fff", borderRadius: 16, border: "1px solid #ebebeb" };
  const inp  = { width: "100%", padding: "11px 14px", border: "1.5px solid #e5e5e5", borderRadius: 10, fontSize: 13, fontFamily: "inherit", outline: "none", background: "#fafafa" };
  const lbl  = { fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", marginBottom: 6, display: "block" };
  const btnP = { display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", background: NAVY, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" };
  const btnS = { display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "#f5f5f5", color: "#555", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "inherit" };

  if (fetchLoading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div>
        <div style={{ width: 40, height: 40, border: `2px solid #f0f0f0`, borderTopColor: NAVY, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <p style={{ color: "#aaa", fontSize: 13 }}>Chargement...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", minHeight: "100vh" }}>
      <style>{`
        .tm-row:hover { background: #f7f9ff !important; }
        .btn-p:hover { background: #001f5c !important; }
        .btn-s:hover { background: #ebebeb !important; }
        input:focus, textarea:focus, select:focus { border-color: ${NAVY} !important; background: #fff !important; box-shadow: 0 0 0 3px ${NAVY}12 !important; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .fade-up { animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      {/* ── Top header ── */}
      <div style={{ ...card, padding: "18px 24px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {view !== "list" && (
            <button onClick={() => { resetForm(); setView("list"); }} style={{ ...btnS, padding: "8px 12px" }} className="btn-s">
              <ArrowLeft size={16} />
            </button>
          )}
          <div style={{ width: 40, height: 40, borderRadius: 11, background: `linear-gradient(135deg, ${NAVY}, #0052cc)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Users size={19} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 800, color: "#0a0a0a", margin: 0, letterSpacing: "-0.02em" }}>Gestion de l'Équipe</h1>
            <p style={{ fontSize: 12, color: "#aaa", margin: 0, marginTop: 1 }}>
              {view === "list" ? `${membres.length} membre(s)` : view === "form" ? (editingId ? "Modifier le membre" : "Nouveau membre") : "Aperçu"}
            </p>
          </div>
        </div>
        {view === "list" && (
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={fetchMembres} disabled={loading} style={btnS} className="btn-s">
              <RefreshCw size={14} style={{ animation: loading ? "spin 0.8s linear infinite" : "none" }} /> Actualiser
            </button>
            <button onClick={() => { resetForm(); setView("form"); }} style={btnP} className="btn-p">
              <PlusCircle size={15} /> Nouveau membre
            </button>
          </div>
        )}
      </div>

      {/* ── Alerts ── */}
      {success && <div style={{ padding: "12px 20px", background: "#d1fae5", border: "1px solid #6ee7b7", borderRadius: 10, marginBottom: 16, fontSize: 13, color: "#065f46", fontWeight: 600 }}>{success}</div>}
      {error   && <div style={{ padding: "12px 20px", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 10, marginBottom: 16, fontSize: 13, color: "#991b1b", fontWeight: 600 }}>{error}</div>}

      {/* ════ LIST ════ */}
      {view === "list" && (
        <div style={{ ...card, overflow: "hidden" }} className="fade-up">
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "52px 1fr 120px 90px 100px 130px", padding: "12px 20px", background: "#fafafa", borderBottom: "1px solid #f5f5f5" }}>
            {["", "Membre", "Poste", "Rôle", "Statut", "Actions"].map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#bbb" }}>{h}</span>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Loader2 size={32} color={NAVY} style={{ animation: "spin 0.8s linear infinite", margin: "0 auto 10px" }} />
              <p style={{ color: "#aaa", fontSize: 13 }}>Chargement...</p>
            </div>
          ) : membres.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Users size={36} color="#ddd" style={{ margin: "0 auto 12px" }} />
              <p style={{ color: "#aaa", fontSize: 14, marginBottom: 16 }}>Aucun membre</p>
              <button onClick={() => { resetForm(); setView("form"); }} style={btnP} className="btn-p">
                <PlusCircle size={14} /> Ajouter le premier membre
              </button>
            </div>
          ) : (
            membres.map((m, idx) => {
              const photo  = m.photo_url || m.photo || null;
              const active = m.is_active;
              const leader = m.role === "dirigeant" || m.is_leader;
              return (
                <div key={m.id} className="tm-row"
                  style={{ display: "grid", gridTemplateColumns: "52px 1fr 120px 90px 100px 130px", padding: "14px 20px", borderBottom: "1px solid #f8f8f8", alignItems: "center", cursor: "pointer", transition: "background 0.15s", animation: `fadeUp 0.4s ease ${idx * 0.04}s both` }}
                  onClick={() => { setSelectedMember(m); setView("detail"); }}>

                  {/* Avatar */}
                  <div style={{ width: 38, height: 38, borderRadius: "50%", overflow: "hidden", background: "#f0f4f8", flexShrink: 0 }}>
                    {photo
                      ? <img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" onError={e => e.target.style.display = "none"} />
                      : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><UserCircle size={20} color="#aaa" /></div>
                    }
                  </div>

                  {/* Name */}
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0a0a0a", marginBottom: 1 }}>{m.full_name}</div>
                    {m.email && <div style={{ fontSize: 11, color: "#aaa" }}>{m.email}</div>}
                  </div>

                  {/* Position */}
                  <div style={{ fontSize: 12, color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.position_fr || "—"}</div>

                  {/* Role */}
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: leader ? `${NAVY}15` : "#f3f4f6", color: leader ? NAVY : "#9ca3af", display: "flex", alignItems: "center", gap: 4, width: "fit-content" }}>
                      {leader && <Crown size={10} />}
                      {leader ? "Dirigeant" : "Membre"}
                    </span>
                  </div>

                  {/* Status */}
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: active ? "#d1fae5" : "#f3f4f6", color: active ? "#065f46" : "#9ca3af" }}>
                      {active ? "Actif" : "Inactif"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleEdit(m)} title="Modifier"
                      style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: `${NAVY}12`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      onMouseEnter={e => e.currentTarget.style.background = `${NAVY}25`}
                      onMouseLeave={e => e.currentTarget.style.background = `${NAVY}12`}>
                      <Edit2 size={13} color={NAVY} />
                    </button>
                    <button onClick={() => handleDelete(m.id)} title="Supprimer"
                      style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#fee2e2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fca5a5"}
                      onMouseLeave={e => e.currentTarget.style.background = "#fee2e2"}>
                      <Trash2 size={13} color="#ef4444" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ════ FORM ════ */}
      {view === "form" && (
        <div style={{ ...card, padding: "28px 32px" }} className="fade-up">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ width: 4, height: 22, background: `linear-gradient(${NAVY}, ${ORANGE})`, borderRadius: 2 }} />
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>{editingId ? "Modifier le membre" : "Nouveau membre"}</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>

              {/* Cover image */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={lbl}>Image de couverture</label>
                <label style={{ display: "block", border: "2px dashed #e0e0e0", borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = NAVY}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#e0e0e0"}>
                  <input type="file" name="cover_image" accept="image/*" onChange={handleChange} style={{ display: "none" }} />
                  {coverPreview
                    ? <img src={coverPreview} style={{ width: "100%", height: 120, objectFit: "cover" }} alt="" />
                    : <div style={{ padding: "20px", textAlign: "center", color: "#bbb", fontSize: 13 }}>Cliquer pour ajouter une image de couverture</div>
                  }
                </label>
              </div>

              {/* Photo */}
              <div>
                <label style={lbl}>Photo du membre</label>
                <label style={{ display: "block", border: "2px dashed #e0e0e0", borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = NAVY}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#e0e0e0"}>
                  <input type="file" name="photo" accept="image/*" onChange={handleChange} style={{ display: "none" }} />
                  {photoPreview
                    ? <img src={photoPreview} style={{ width: "100%", height: 160, objectFit: "cover" }} alt="" />
                    : <div style={{ padding: "30px", textAlign: "center", color: "#bbb", fontSize: 13 }}><ImageIcon size={24} style={{ margin: "0 auto 8px", display: "block" }} />Photo</div>
                  }
                </label>
              </div>

              {/* Statut + Rôle */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* is_active */}
                <div>
                  <label style={lbl}>Statut</label>
                  <div onClick={() => setFormData(p => ({ ...p, is_active: !p.is_active }))}
                    style={{ border: `2px solid ${formData.is_active ? NAVY : "#e0e0e0"}`, borderRadius: 10, padding: "12px 16px", cursor: "pointer", background: formData.is_active ? `${NAVY}05` : "#fafafa", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${formData.is_active ? NAVY : "#ccc"}`, background: formData.is_active ? NAVY : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {formData.is_active && <Check size={11} color="#fff" />}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: formData.is_active ? NAVY : "#888" }}>{formData.is_active ? "Membre actif" : "Membre inactif"}</span>
                    <div style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: formData.is_active ? "#10b981" : "#d1d5db" }} />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label style={lbl}>Rôle</label>
                  <select name="role" value={formData.role} onChange={handleChange}
                    style={{ ...inp, cursor: "pointer" }}>
                    <option value="membre">Membre</option>
                    <option value="dirigeant">Dirigeant</option>
                  </select>
                </div>

                {/* is_leader */}
                <div onClick={() => setFormData(p => ({ ...p, is_leader: !p.is_leader }))}
                  style={{ border: `2px solid ${formData.is_leader ? ORANGE : "#e0e0e0"}`, borderRadius: 10, padding: "10px 14px", cursor: "pointer", background: formData.is_leader ? `${ORANGE}05` : "#fafafa", display: "flex", alignItems: "center", gap: 10 }}>
                  <Crown size={14} color={formData.is_leader ? ORANGE : "#ccc"} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: formData.is_leader ? ORANGE : "#888" }}>Marquer comme leader</span>
                </div>
              </div>

              {/* Nom */}
              <div>
                <label style={lbl}>Nom complet *</label>
                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Prénom Nom" required style={inp} />
              </div>

              {/* Poste FR */}
              <div>
                <label style={lbl}>Poste (français)</label>
                <input type="text" name="position_fr" value={formData.position_fr} onChange={handleChange} placeholder="Directeur général" style={inp} />
              </div>

              {/* Poste EN */}
              <div>
                <label style={lbl}>Position (English)</label>
                <input type="text" name="position_en" value={formData.position_en} onChange={handleChange} placeholder="Chief Executive Officer" style={inp} />
              </div>

              {/* Email */}
              <div>
                <label style={lbl}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@nexusbtp.com" style={inp} />
              </div>

              {/* LinkedIn */}
              <div>
                <label style={lbl}>LinkedIn</label>
                <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." style={inp} />
              </div>

              {/* Bio FR */}
              <div>
                <label style={lbl}>Biographie (français)</label>
                <textarea name="bio_fr" value={formData.bio_fr} onChange={handleChange} placeholder="Biographie en français..." rows={4} style={{ ...inp, resize: "vertical" }} />
              </div>

              {/* Bio EN */}
              <div>
                <label style={lbl}>Biography (English)</label>
                <textarea name="bio_en" value={formData.bio_en} onChange={handleChange} placeholder="Biography in English..." rows={4} style={{ ...inp, resize: "vertical" }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, paddingTop: 20, borderTop: "1px solid #f0f0f0" }}>
              <button type="submit" disabled={loading} style={{ ...btnP, minWidth: 180, justifyContent: "center" }} className="btn-p">
                {uploadStep === "uploading" ? <><Loader2 size={15} style={{ animation: "spin 0.8s linear infinite" }} />Upload...</>
                  : uploadStep === "saving" ? <><Loader2 size={15} style={{ animation: "spin 0.8s linear infinite" }} />Sauvegarde...</>
                  : loading ? <><Loader2 size={15} style={{ animation: "spin 0.8s linear infinite" }} />Chargement...</>
                  : <><Save size={15} />{editingId ? "Mettre à jour" : "Créer le membre"}</>}
              </button>
              <button type="button" onClick={() => { resetForm(); setView("list"); }} style={btnS} className="btn-s">
                <X size={14} /> Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ════ DETAIL ════ */}
      {view === "detail" && selectedMember && (
        <div style={{ ...card, overflow: "hidden" }} className="fade-up">
          {selectedMember.cover_image && (
            <div style={{ height: 220, overflow: "hidden", position: "relative" }}>
              <img src={selectedMember.cover_image} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${NAVY}, ${ORANGE})` }} />
            </div>
          )}

          <div style={{ padding: "28px 32px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 28 }}>
              {/* Avatar */}
              <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", background: "#f0f4f8", border: `3px solid ${NAVY}20`, flexShrink: 0 }}>
                {(selectedMember.photo_url || selectedMember.photo)
                  ? <img src={selectedMember.photo_url || selectedMember.photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><UserCircle size={32} color="#aaa" /></div>
                }
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0, letterSpacing: "-0.01em" }}>{selectedMember.full_name}</h2>
                  {(selectedMember.role === "dirigeant" || selectedMember.is_leader) && <Crown size={16} color={ORANGE} />}
                </div>
                <p style={{ fontSize: 14, color: NAVY, fontWeight: 600, margin: 0 }}>{selectedMember.position_fr}</p>
                {selectedMember.position_en && <p style={{ fontSize: 12, color: "#aaa", margin: "2px 0 0" }}>{selectedMember.position_en}</p>}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => handleEdit(selectedMember)} style={btnP} className="btn-p"><Edit2 size={14} /> Modifier</button>
                <button onClick={() => handleDelete(selectedMember.id)} style={{ ...btnS, color: "#ef4444" }}>
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>
            </div>

            {/* Contact */}
            {(selectedMember.email || selectedMember.linkedin) && (
              <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                {selectedMember.email && (
                  <a href={`mailto:${selectedMember.email}`} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", background: `${NAVY}10`, borderRadius: 8, color: NAVY, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
                    <Mail size={14} /> {selectedMember.email}
                  </a>
                )}
                {selectedMember.linkedin && (
                  <a href={selectedMember.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", background: `${NAVY}10`, borderRadius: 8, color: NAVY, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
                    <Linkedin size={14} /> LinkedIn
                  </a>
                )}
              </div>
            )}

            {/* Bios */}
            {(selectedMember.bio_fr || selectedMember.bio_en) && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {selectedMember.bio_fr && (
                  <div style={{ background: "#f8faff", borderRadius: 12, padding: "16px 20px", borderLeft: `3px solid ${NAVY}` }}>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: NAVY, marginBottom: 8 }}>Français</div>
                    <p style={{ fontSize: 13, color: "#555", lineHeight: 1.8, margin: 0 }}>{selectedMember.bio_fr}</p>
                  </div>
                )}
                {selectedMember.bio_en && (
                  <div style={{ background: "#fff8f5", borderRadius: 12, padding: "16px 20px", borderLeft: `3px solid ${ORANGE}` }}>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: 8 }}>English</div>
                    <p style={{ fontSize: 13, color: "#555", lineHeight: 1.8, margin: 0 }}>{selectedMember.bio_en}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPost;