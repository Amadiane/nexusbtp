import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import {
  Handshake, Loader2, Trash2, PlusCircle, Edit2, X, Save,
  RefreshCw, Image as ImageIcon, Check, Globe, ArrowLeft, ExternalLink
} from "lucide-react";

const NAVY   = "#003893";
const ORANGE = "#EA580C";

const PartnerPost = () => {
  const [partners, setPartners]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError]             = useState(null);
  const [success, setSuccess]         = useState(null);
  const [view, setView]               = useState("list"); // "list"|"form"|"detail"
  const [editingId, setEditingId]     = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [preview, setPreview]         = useState(null);
  const [uploadStep, setUploadStep]   = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const itemsPerPage = 12;

  const [formData, setFormData] = useState({
    name_fr: "", name_en: "",
    description_fr: "", description_en: "",
    website_url: "", is_active: true, cover_image: null,
  });

  /* ── helpers ── */
  const authH = () => {
    const t = localStorage.getItem("access");
    return { "Content-Type": "application/json", ...(t ? { Authorization: `Bearer ${t}` } : {}) };
  };
  const getImg = (p) => p.cover_image_url || p.cover_image || null;

  /* ── fetch ── */
  const fetchPartners = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${CONFIG.BASE_URL}/api/partners/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Erreur " + res.status);
      const data = await res.json();
      setPartners(Array.isArray(data) ? data : (data.results ?? []));
      setError(null);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); setFetchLoading(false); }
  };

  useEffect(() => { fetchPartners(); }, []);

  /* ── cloudinary ── */
  const uploadToCloudinary = async (file) => {
    if (!file || typeof file === "string") return file ?? null;
    const fd = new FormData();
    fd.append("file", file); fd.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`, { method: "POST", body: fd });
    return (await res.json()).secure_url ?? null;
  };

  /* ── change ── */
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (files) {
      setFormData(p => ({ ...p, cover_image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else if (type === "checkbox") {
      setFormData(p => ({ ...p, [name]: checked }));
    } else {
      setFormData(p => ({ ...p, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({ name_fr: "", name_en: "", description_fr: "", description_en: "", website_url: "", is_active: true, cover_image: null });
    setPreview(null); setEditingId(null); setSelectedPartner(null);
  };

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(null); setSuccess(null);
    try {
      setUploadStep("uploading");
      const imgUrl = await uploadToCloudinary(formData.cover_image);
      setUploadStep("saving");
      const payload = { ...formData, cover_image: imgUrl };
      const method  = editingId ? "PATCH" : "POST";
      const url     = editingId ? `${CONFIG.BASE_URL}/api/partners/${editingId}/` : `${CONFIG.BASE_URL}/api/partners/`;
      const res = await fetch(url, { method, headers: authH(), body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Erreur enregistrement");
      setSuccess(editingId ? "Partenaire mis à jour ✓" : "Partenaire créé ✓");
      resetForm(); await fetchPartners(); setView("list");
    } catch (err) { setError(err.message); }
    finally { setUploadStep(""); setLoading(false); }
  };

  /* ── edit ── */
  const handleEdit = (p) => {
    setEditingId(p.id); setSelectedPartner(p);
    setFormData({ name_fr: p.name_fr ?? "", name_en: p.name_en ?? "", description_fr: p.description_fr ?? "", description_en: p.description_en ?? "", website_url: p.website_url ?? "", is_active: p.is_active ?? true, cover_image: p.cover_image ?? null });
    setPreview(getImg(p)); setView("form");
  };

  /* ── delete ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce partenaire ?")) return;
    try {
      await fetch(`${CONFIG.BASE_URL}/api/partners/${id}/`, { method: "DELETE", headers: authH() });
      setSuccess("Partenaire supprimé ✓");
      await fetchPartners();
      if (view === "detail") setView("list");
      setSelectedPartner(null);
    } catch (err) { setError(err.message); }
  };

  /* ── pagination + filter ── */
  const filtered = partners.filter(p => {
    if (filterStatus === "active")   return p.is_active;
    if (filterStatus === "inactive") return !p.is_active;
    return true;
  });
  const totalPages   = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  /* ── styles ── */
  const card = { background: "#fff", borderRadius: 16, border: "1px solid #ebebeb" };
  const inp  = { width: "100%", padding: "11px 14px", border: "1.5px solid #e5e5e5", borderRadius: 10, fontSize: 13, fontFamily: "inherit", outline: "none", background: "#fafafa" };
  const lbl  = { fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", marginBottom: 6, display: "block" };
  const btnP = { display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", background: NAVY, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" };
  const btnS = { display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "#f5f5f5", color: "#555", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "inherit" };

  if (fetchLoading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div>
        <div style={{ width: 40, height: 40, border: `2px solid #f0f0f0`, borderTopColor: NAVY, borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 12px" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", minHeight: "100vh" }}>
      <style>{`
        .pp-row:hover { background: #f7f9ff !important; }
        .pp-card:hover { border-color: ${NAVY}40 !important; box-shadow: 0 8px 24px rgba(0,56,147,0.10) !important; transform: translateY(-3px); }
        .pp-card { transition: all .2s cubic-bezier(.22,1,.36,1); }
        .btn-p:hover { background: #001f5c !important; }
        .btn-s:hover { background: #ebebeb !important; }
        input:focus,textarea:focus,select:focus { border-color: ${NAVY} !important; background:#fff !important; box-shadow:0 0 0 3px ${NAVY}12 !important; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        .fade-up { animation: fadeUp .4s cubic-bezier(.22,1,.36,1) both; }
        .pp-img { transition: transform .5s ease; }
        .pp-card:hover .pp-img { transform: scale(1.05); }
        .pp-overlay { opacity:0; transition: opacity .25s; }
        .pp-card:hover .pp-overlay { opacity:1; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ ...card, padding: "18px 24px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {view !== "list" && (
            <button onClick={() => { resetForm(); setView("list"); }} style={{ ...btnS, padding: "8px 12px" }} className="btn-s"><ArrowLeft size={16} /></button>
          )}
          <div style={{ width: 40, height: 40, borderRadius: 11, background: `linear-gradient(135deg, ${NAVY}, #0052cc)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Handshake size={19} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 800, color: "#0a0a0a", margin: 0, letterSpacing: "-0.02em" }}>Gestion des Partenaires</h1>
            <p style={{ fontSize: 12, color: "#aaa", margin: 0, marginTop: 1 }}>
              {view === "list" ? `${filtered.length} partenaire(s)` : view === "form" ? (editingId ? "Modifier" : "Nouveau partenaire") : "Aperçu"}
            </p>
          </div>
        </div>

        {view === "list" && (
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {/* Filters */}
            <div style={{ display: "flex", gap: 6 }}>
              {[["all","Tous"],["active","Actifs"],["inactive","Inactifs"]].map(([val,label]) => (
                <button key={val} onClick={() => { setFilterStatus(val); setCurrentPage(1); }}
                  style={{ padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 12,
                    background: filterStatus === val ? NAVY : "#f5f5f5",
                    color: filterStatus === val ? "#fff" : "#666" }}>
                  {label}
                </button>
              ))}
            </div>
            <button onClick={fetchPartners} disabled={loading} style={btnS} className="btn-s">
              <RefreshCw size={14} style={{ animation: loading ? "spin .8s linear infinite" : "none" }} />
            </button>
            <button onClick={() => { resetForm(); setView("form"); }} style={btnP} className="btn-p">
              <PlusCircle size={15} /> Nouveau partenaire
            </button>
          </div>
        )}
      </div>

      {/* ── Alerts ── */}
      {success && <div style={{ padding: "12px 20px", background: "#d1fae5", border: "1px solid #6ee7b7", borderRadius: 10, marginBottom: 16, fontSize: 13, color: "#065f46", fontWeight: 600 }}>{success}</div>}
      {error   && <div style={{ padding: "12px 20px", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 10, marginBottom: 16, fontSize: 13, color: "#991b1b", fontWeight: 600 }}>{error}</div>}

      {/* ════ FORM ════ */}
      {view === "form" && (
        <div style={{ ...card, padding: "28px 32px" }} className="fade-up">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ width: 4, height: 22, background: `linear-gradient(${NAVY},${ORANGE})`, borderRadius: 2 }} />
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>{editingId ? "Modifier le partenaire" : "Nouveau partenaire"}</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>

              {/* Logo upload */}
              <div style={{ gridColumn: "1/-1" }}>
                <label style={lbl}>Logo du partenaire</label>
                <label style={{ display: "block", border: "2px dashed #e0e0e0", borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "border-color .2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = NAVY}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#e0e0e0"}>
                  <input type="file" accept="image/*" onChange={handleChange} style={{ display: "none" }} />
                  {preview
                    ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "#f8fafc" }}>
                        <img src={preview} style={{ maxHeight: 120, maxWidth: "100%", objectFit: "contain" }} alt="" />
                      </div>
                    : <div style={{ padding: "24px", textAlign: "center", color: "#bbb" }}>
                        <ImageIcon size={28} style={{ margin: "0 auto 8px", display: "block" }} />
                        <span style={{ fontSize: 13 }}>Cliquer pour ajouter le logo</span>
                      </div>
                  }
                </label>
              </div>

              {/* Nom FR */}
              <div>
                <label style={lbl}>Nom (français) *</label>
                <input type="text" name="name_fr" value={formData.name_fr} onChange={handleChange} placeholder="Nom du partenaire" required style={inp} />
              </div>

              {/* Nom EN */}
              <div>
                <label style={lbl}>Name (English)</label>
                <input type="text" name="name_en" value={formData.name_en} onChange={handleChange} placeholder="Partner name" style={inp} />
              </div>

              {/* Site web */}
              <div style={{ gridColumn: "1/-1" }}>
                <label style={lbl}>Site web</label>
                <div style={{ position: "relative" }}>
                  <Globe size={14} color="#aaa" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                  <input type="url" name="website_url" value={formData.website_url} onChange={handleChange} placeholder="https://partenaire.com" style={{ ...inp, paddingLeft: 36 }} />
                </div>
              </div>

              {/* Description FR */}
              <div>
                <label style={lbl}>Description (français)</label>
                <textarea name="description_fr" value={formData.description_fr} onChange={handleChange} placeholder="Description en français..." rows={3} style={{ ...inp, resize: "vertical" }} />
              </div>

              {/* Description EN */}
              <div>
                <label style={lbl}>Description (English)</label>
                <textarea name="description_en" value={formData.description_en} onChange={handleChange} placeholder="Description in English..." rows={3} style={{ ...inp, resize: "vertical" }} />
              </div>

              {/* Statut */}
              <div style={{ gridColumn: "1/-1" }}>
                <div onClick={() => setFormData(p => ({ ...p, is_active: !p.is_active }))}
                  style={{ border: `2px solid ${formData.is_active ? NAVY : "#e0e0e0"}`, borderRadius: 10, padding: "12px 16px", cursor: "pointer", background: formData.is_active ? `${NAVY}05` : "#fafafa", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${formData.is_active ? NAVY : "#ccc"}`, background: formData.is_active ? NAVY : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {formData.is_active && <Check size={11} color="#fff" />}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: formData.is_active ? NAVY : "#888" }}>{formData.is_active ? "Partenaire actif — visible sur le site" : "Partenaire inactif — masqué"}</span>
                  <div style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: formData.is_active ? "#10b981" : "#d1d5db" }} />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, paddingTop: 20, borderTop: "1px solid #f0f0f0" }}>
              <button type="submit" disabled={loading} style={{ ...btnP, minWidth: 190, justifyContent: "center" }} className="btn-p">
                {uploadStep === "uploading" ? <><Loader2 size={15} style={{ animation: "spin .8s linear infinite" }} />Upload logo...</>
                  : uploadStep === "saving"   ? <><Loader2 size={15} style={{ animation: "spin .8s linear infinite" }} />Sauvegarde...</>
                  : loading ? <><Loader2 size={15} style={{ animation: "spin .8s linear infinite" }} />Chargement...</>
                  : <><Save size={15} />{editingId ? "Mettre à jour" : "Créer le partenaire"}</>}
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
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Loader2 size={32} color={NAVY} style={{ animation: "spin .8s linear infinite", margin: "0 auto 10px" }} />
            </div>
          ) : currentItems.length === 0 ? (
            <div style={{ ...card, padding: "60px 0", textAlign: "center" }}>
              <Handshake size={40} color="#ddd" style={{ margin: "0 auto 16px" }} />
              <p style={{ color: "#aaa", fontSize: 14, marginBottom: 20 }}>Aucun partenaire</p>
              <button onClick={() => { resetForm(); setView("form"); }} style={btnP} className="btn-p">
                <PlusCircle size={14} /> Ajouter le premier partenaire
              </button>
            </div>
          ) : (
            <>
              {/* Card grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 18 }}>
                {currentItems.map((p, idx) => {
                  const img  = getImg(p);
                  const name = p.name_fr || p.name_en || "Partenaire";
                  return (
                    <div key={p.id} className="pp-card"
                      style={{ ...card, overflow: "hidden", cursor: "pointer", animation: `fadeUp .4s ease ${idx * .04}s both` }}
                      onClick={() => { setSelectedPartner(p); setView("detail"); }}>

                      {/* Logo */}
                      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                        {img ? (
                          <img className="pp-img" src={img} alt={name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} onError={e => e.target.style.display = "none"} />
                        ) : (
                          <span style={{ fontSize: 36, fontWeight: 900, color: `${NAVY}18`, fontFamily: "'Creato Display',sans-serif" }}>{name[0]?.toUpperCase()}</span>
                        )}
                        {/* Status dot */}
                        <div style={{ position: "absolute", top: 10, right: 10, width: 8, height: 8, borderRadius: "50%", background: p.is_active ? "#10b981" : "#d1d5db" }} />
                        {/* Bottom stripe */}
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${NAVY},${ORANGE})`, transform: "scaleX(0)", transformOrigin: "left", transition: "transform .35s" }} className="pp-stripe" />
                      </div>

                      {/* Info */}
                      <div style={{ padding: "12px 14px", borderTop: "1px solid #f5f5f5" }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#0a0a0a", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
                        {p.website_url && (
                          <div style={{ fontSize: 11, color: "#aaa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4 }}>
                            <Globe size={10} />{p.website_url.replace(/^https?:\/\//, "")}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: 0, borderTop: "1px solid #f5f5f5" }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => handleEdit(p)} style={{ flex: 1, padding: "10px 0", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: NAVY, fontSize: 12, fontWeight: 600, gap: 5, transition: "background .15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = `${NAVY}08`}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <Edit2 size={13} /> Modifier
                        </button>
                        <div style={{ width: 1, background: "#f5f5f5" }} />
                        <button onClick={() => handleDelete(p.id)} style={{ flex: 1, padding: "10px 0", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444", fontSize: 12, fontWeight: 600, gap: 5, transition: "background .15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <Trash2 size={13} /> Supprimer
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0 0", marginTop: 20, borderTop: "1px solid #f5f5f5" }}>
                  <span style={{ fontSize: 12, color: "#aaa" }}>Page {currentPage} / {totalPages}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                      style={{ ...btnS, padding: "7px 12px", opacity: currentPage === 1 ? .4 : 1 }}>←</button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button key={i} onClick={() => setCurrentPage(i + 1)}
                        style={{ width: 32, height: 32, borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, background: currentPage === i + 1 ? NAVY : "#f5f5f5", color: currentPage === i + 1 ? "#fff" : "#555" }}>
                        {i + 1}
                      </button>
                    ))}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                      style={{ ...btnS, padding: "7px 12px", opacity: currentPage === totalPages ? .4 : 1 }}>→</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ════ DETAIL ════ */}
      {view === "detail" && selectedPartner && (
        <div style={{ ...card, overflow: "hidden" }} className="fade-up">
          <div style={{ padding: "28px 32px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: 24 }}>
              {/* Logo */}
              <div style={{ width: 80, height: 80, borderRadius: 14, border: "1px solid #ebebeb", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                {getImg(selectedPartner)
                  ? <img src={getImg(selectedPartner)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", padding: 6 }} alt="" />
                  : <span style={{ fontSize: 28, fontWeight: 900, color: `${NAVY}30` }}>{(selectedPartner.name_fr || "P")[0]}</span>
                }
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>{selectedPartner.name_fr || selectedPartner.name_en}</h2>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: selectedPartner.is_active ? "#d1fae5" : "#f3f4f6", color: selectedPartner.is_active ? "#065f46" : "#9ca3af" }}>
                    {selectedPartner.is_active ? "Actif" : "Inactif"}
                  </span>
                </div>
                {selectedPartner.website_url && (
                  <a href={selectedPartner.website_url} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: NAVY, fontWeight: 600, textDecoration: "none" }}>
                    <Globe size={13} />{selectedPartner.website_url.replace(/^https?:\/\//, "")}
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => handleEdit(selectedPartner)} style={btnP} className="btn-p"><Edit2 size={14} /> Modifier</button>
                <button onClick={() => handleDelete(selectedPartner.id)} style={{ ...btnS, color: "#ef4444" }}><Trash2 size={14} /> Supprimer</button>
              </div>
            </div>

            {(selectedPartner.description_fr || selectedPartner.description_en) && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {selectedPartner.description_fr && (
                  <div style={{ background: "#f8faff", borderRadius: 12, padding: "16px 20px", borderLeft: `3px solid ${NAVY}` }}>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: NAVY, marginBottom: 8 }}>Français</div>
                    <p style={{ fontSize: 13, color: "#555", lineHeight: 1.8, margin: 0 }}>{selectedPartner.description_fr}</p>
                  </div>
                )}
                {selectedPartner.description_en && (
                  <div style={{ background: "#fff8f5", borderRadius: 12, padding: "16px 20px", borderLeft: `3px solid ${ORANGE}` }}>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: 8 }}>English</div>
                    <p style={{ fontSize: 13, color: "#555", lineHeight: 1.8, margin: 0 }}>{selectedPartner.description_en}</p>
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

export default PartnerPost;