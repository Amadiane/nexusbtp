import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import {
  Plus, Image as ImageIcon, Loader2, Edit2, Trash2, X,
  Eye, Save, RefreshCw, FileText, Calendar,
  ChevronLeft, ChevronRight, Check, ArrowLeft, Newspaper
} from "lucide-react";

const NAVY   = "#003893";
const ORANGE = "#EA580C";

const NewsPost = () => {
  const [newsList, setNewsList]         = useState([]);
  const [loading, setLoading]           = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [title_fr, setTitleFr]          = useState("");
  const [title_en, setTitleEn]          = useState("");
  const [content_fr, setContentFr]      = useState("");
  const [content_en, setContentEn]      = useState("");
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isActive, setIsActive]         = useState(true);
  const [editingId, setEditingId]       = useState(null);
  const [view, setView]                 = useState("list"); // "list" | "form" | "detail"
  const [uploadStep, setUploadStep]     = useState("");
  const [currentPage, setCurrentPage]  = useState(1);
  const itemsPerPage = 6;

  /* ── helpers ── */
  const getImage = (item) => {
    if (!item) return null;
    const raw = item.image_url || item.image || null;
    if (!raw) return null;
    if (typeof raw === "string" && (raw.startsWith("/media") || raw.startsWith("media/")))
      return `${CONFIG.BASE_URL}/${raw.replace(/^\//, "")}`;
    return raw;
  };

  const authHeaders = () => {
    const token = localStorage.getItem("access");
    return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  };

  /* ── fetch ── */
  const fetchNews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${CONFIG.BASE_URL}/api/news/`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const data = await res.json();
      setNewsList(Array.isArray(data) ? data : (data.results ?? []));
    } catch (e) { console.error(e); setNewsList([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNews(); }, []);

  /* ── image preview ── */
  useEffect(() => {
    if (!imageFile) { setImagePreview(null); return; }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  /* ── cloudinary ── */
  const uploadImage = async () => {
    if (!imageFile) return null;
    const fd = new FormData();
    fd.append("file", imageFile);
    fd.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`, { method: "POST", body: fd });
    const data = await res.json();
    return data.secure_url ?? null;
  };

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let image_url = editingId ? (getImage(selectedNews) || null) : null;
    if (imageFile) { setUploadStep("uploading"); image_url = await uploadImage(); }
    setUploadStep("saving");
    const payload = { title_fr, title_en, content_fr, content_en, image: image_url, is_active: isActive };
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${CONFIG.BASE_URL}/api/news/${editingId}/` : `${CONFIG.BASE_URL}/api/news/`;
      await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
      await fetchNews();
      resetForm();
      setView("list");
    } catch (err) { console.error(err); }
    setUploadStep(""); setLoading(false);
  };

  /* ── delete ── */
  const deleteNews = async (id) => {
    if (!window.confirm("Supprimer cette actualité ?")) return;
    try {
      await fetch(`${CONFIG.BASE_URL}/api/news/${id}/`, { method: "DELETE", headers: authHeaders() });
      await fetchNews();
      if (view === "detail") setView("list");
      setSelectedNews(null);
    } catch (err) { console.error(err); }
  };

  /* ── edit ── */
  const editNews = (news) => {
    setEditingId(news.id); setSelectedNews(news);
    setTitleFr(news.title_fr ?? ""); setTitleEn(news.title_en ?? "");
    setContentFr(news.content_fr ?? ""); setContentEn(news.content_en ?? "");
    setIsActive(news.is_active ?? true);
    setImageFile(null); setImagePreview(null);
    setView("form");
  };

  const resetForm = () => {
    setEditingId(null); setSelectedNews(null);
    setTitleFr(""); setTitleEn(""); setContentFr(""); setContentEn("");
    setImageFile(null); setImagePreview(null); setIsActive(true);
  };

  /* ── pagination ── */
  const totalPages   = Math.ceil(newsList.length / itemsPerPage);
  const currentItems = newsList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  /* ── common styles ── */
  const card = { background: "#fff", borderRadius: 16, border: "1px solid #ebebeb" };
  const inputCls = {
    width: "100%", padding: "12px 16px", border: "1.5px solid #e5e5e5",
    borderRadius: 10, fontSize: 14, fontFamily: "inherit", outline: "none",
    transition: "border-color 0.2s", background: "#fafafa",
  };
  const labelCls = { fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", marginBottom: 8, display: "block" };
  const btnPrimary = { display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", background: NAVY, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit", transition: "all 0.2s" };
  const btnSecondary = { display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", background: "#f5f5f5", color: "#555", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "inherit", transition: "all 0.2s" };

  /* ════════════════════════════════ RENDER ════════════════════════════════ */
  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", minHeight: "100vh" }}>
      <style>{`
        .ni:hover { background: #f7f9ff !important; border-color: ${NAVY}30 !important; }
        .btn-p:hover { background: #001f5c !important; transform: translateY(-1px); }
        .btn-s:hover { background: #ebebeb !important; }
        .btn-d:hover { background: #fee2e2 !important; }
        input:focus, textarea:focus { border-color: ${NAVY} !important; background: #fff !important; box-shadow: 0 0 0 3px ${NAVY}12 !important; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      {/* ── TOP HEADER ── */}
      <div style={{ ...card, padding: "20px 28px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {view !== "list" && (
            <button onClick={() => { resetForm(); setView("list"); }} style={{ ...btnSecondary, padding: "9px 14px" }} className="btn-s">
              <ArrowLeft size={16} />
            </button>
          )}
          <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${NAVY}, #0052cc)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Newspaper size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: "#0a0a0a", margin: 0, letterSpacing: "-0.02em" }}>
              Gestion des Actualités
            </h1>
            <p style={{ fontSize: 12, color: "#aaa", margin: 0, marginTop: 2 }}>
              {view === "list" ? `${newsList.length} articles` : view === "form" ? (editingId ? "Modifier l'article" : "Nouvel article") : "Aperçu"}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {view === "list" && (
            <>
              <button onClick={fetchNews} disabled={loading} style={btnSecondary} className="btn-s">
                <RefreshCw size={14} style={{ animation: loading ? "spin 0.8s linear infinite" : "none" }} />
                Actualiser
              </button>
              <button onClick={() => { resetForm(); setView("form"); }} style={btnPrimary} className="btn-p">
                <Plus size={16} /> Nouveau post
              </button>
            </>
          )}
        </div>
      </div>

      {/* ════ VIEW: FORM ════ */}
      {view === "form" && (
        <div style={{ ...card, padding: "32px 36px" }} className="fade-up">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ width: 4, height: 24, background: `linear-gradient(${NAVY}, ${ORANGE})`, borderRadius: 2 }} />
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#0a0a0a" }}>
              {editingId ? "Modifier l'actualité" : "Nouvelle actualité"}
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Titres */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              {[
                { label: "Titre français *", val: title_fr, set: setTitleFr, ph: "Entrez le titre...", req: true },
                { label: "Title English", val: title_en, set: setTitleEn, ph: "Enter title..." },
              ].map(({ label, val, set, ph, req }) => (
                <div key={label}>
                  <label style={labelCls}>{label}</label>
                  <input type="text" value={val} onChange={e => set(e.target.value)} placeholder={ph} required={req}
                    style={inputCls} />
                </div>
              ))}
            </div>

            {/* Contenus */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              {[
                { label: "Contenu français *", val: content_fr, set: setContentFr, ph: "Rédigez le contenu...", req: true },
                { label: "Content English", val: content_en, set: setContentEn, ph: "Write content..." },
              ].map(({ label, val, set, ph, req }) => (
                <div key={label}>
                  <label style={labelCls}>{label}</label>
                  <textarea value={val} onChange={e => set(e.target.value)} placeholder={ph} required={req} rows={7}
                    style={{ ...inputCls, resize: "vertical" }} />
                </div>
              ))}
            </div>

            {/* Image + Statut */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
              {/* Image upload */}
              <div>
                <label style={labelCls}>Image de couverture</label>
                <label style={{ display: "block", border: "2px dashed #e0e0e0", borderRadius: 12, padding: 20, cursor: "pointer", transition: "border-color 0.2s", textAlign: "center" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = NAVY}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#e0e0e0"}>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ display: "none" }} />
                  {imagePreview ? (
                    <div style={{ position: "relative" }}>
                      <img src={imagePreview} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8 }} alt="" />
                      <div style={{ marginTop: 8, fontSize: 12, color: NAVY, fontWeight: 600 }}>✓ {imageFile?.name}</div>
                    </div>
                  ) : getImage(selectedNews) ? (
                    <div>
                      <img src={getImage(selectedNews)} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8 }} alt="" />
                      <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>Cliquer pour changer</div>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon size={32} color="#ccc" style={{ margin: "0 auto 8px" }} />
                      <div style={{ fontSize: 13, color: "#aaa" }}>Cliquer pour choisir une image</div>
                      <div style={{ fontSize: 11, color: "#ccc", marginTop: 4 }}>JPG, PNG, WebP</div>
                    </div>
                  )}
                </label>
              </div>

              {/* Statut */}
              <div>
                <label style={labelCls}>Statut de publication</label>
                <div
                  onClick={() => setIsActive(!isActive)}
                  style={{ border: `2px solid ${isActive ? NAVY : "#e0e0e0"}`, borderRadius: 12, padding: 20, cursor: "pointer", background: isActive ? `${NAVY}05` : "#fafafa", transition: "all 0.2s" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${isActive ? NAVY : "#ccc"}`, background: isActive ? NAVY : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}>
                      {isActive && <Check size={12} color="#fff" />}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: isActive ? NAVY : "#888" }}>
                        {isActive ? "Article actif" : "Article inactif"}
                      </div>
                      <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>
                        {isActive ? "Visible sur le site public" : "Non visible pour les visiteurs"}
                      </div>
                    </div>
                    <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: isActive ? "#10b981" : "#d1d5db" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, paddingTop: 24, borderTop: "1px solid #f0f0f0" }}>
              <button type="submit" disabled={loading} style={{ ...btnPrimary, minWidth: 180, justifyContent: "center" }} className="btn-p">
                {uploadStep === "uploading" ? <><Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} /> Upload image...</>
                  : uploadStep === "saving" ? <><Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} /> Sauvegarde...</>
                  : loading ? <><Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} /> Chargement...</>
                  : <><Save size={16} />{editingId ? "Mettre à jour" : "Créer l'article"}</>}
              </button>
              <button type="button" onClick={() => { resetForm(); setView("list"); }} style={btnSecondary} className="btn-s">
                <X size={15} /> Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ════ VIEW: LIST ════ */}
      {view === "list" && (
        <div style={{ ...card, overflow: "hidden" }} className="fade-up">
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <Loader2 size={36} color={NAVY} style={{ animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
              <p style={{ color: "#aaa", fontSize: 13 }}>Chargement...</p>
            </div>
          ) : newsList.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <FileText size={40} color="#ddd" style={{ margin: "0 auto 16px" }} />
              <p style={{ color: "#aaa", fontSize: 15, marginBottom: 20 }}>Aucune actualité pour le moment</p>
              <button onClick={() => { resetForm(); setView("form"); }} style={btnPrimary} className="btn-p">
                <Plus size={15} /> Créer le premier article
              </button>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div style={{ display: "grid", gridTemplateColumns: "56px 1fr 140px 100px 140px", gap: 0, padding: "12px 24px", borderBottom: "1px solid #f5f5f5", background: "#fafafa" }}>
                {["", "Article", "Date", "Statut", "Actions"].map(h => (
                  <span key={h} style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#bbb" }}>{h}</span>
                ))}
              </div>

              {/* Rows */}
              {currentItems.map((item, idx) => {
                const img    = getImage(item);
                const active = item.is_active ?? item.isActive;
                return (
                  <div key={item.id} className="ni" style={{ display: "grid", gridTemplateColumns: "56px 1fr 140px 100px 140px", gap: 0, padding: "16px 24px", borderBottom: "1px solid #f8f8f8", alignItems: "center", cursor: "pointer", transition: "all 0.15s", animation: `fadeUp 0.4s ease ${idx * 0.05}s both` }}
                    onClick={() => { setSelectedNews(item); setView("detail"); }}>
                    {/* Thumbnail */}
                    <div style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", background: "#f5f5f5", flexShrink: 0 }}>
                      {img
                        ? <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                        : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#ccc" }}>📰</div>
                      }
                    </div>
                    {/* Title + excerpt */}
                    <div style={{ paddingLeft: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#0a0a0a", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 360 }}>{item.title_fr}</div>
                      <div style={{ fontSize: 12, color: "#aaa", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 360 }}>{item.content_fr?.slice(0, 80)}…</div>
                    </div>
                    {/* Date */}
                    <div style={{ fontSize: 12, color: "#aaa", display: "flex", alignItems: "center", gap: 5 }}>
                      <Calendar size={11} />
                      {item.created_at ? new Date(item.created_at).toLocaleDateString("fr-FR") : "—"}
                    </div>
                    {/* Status */}
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: active ? "#d1fae5" : "#f3f4f6", color: active ? "#065f46" : "#9ca3af" }}>
                        {active ? "Actif" : "Inactif"}
                      </span>
                    </div>
                    {/* Actions */}
                    <div style={{ display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => editNews(item)} title="Modifier"
                        style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: `${NAVY}12`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = `${NAVY}25`}
                        onMouseLeave={e => e.currentTarget.style.background = `${NAVY}12`}>
                        <Edit2 size={13} color={NAVY} />
                      </button>
                      <button onClick={() => deleteNews(item.id)} title="Supprimer"
                        style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#fee2e2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#fca5a5"}
                        onMouseLeave={e => e.currentTarget.style.background = "#fee2e2"}>
                        <Trash2 size={13} color="#ef4444" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderTop: "1px solid #f5f5f5" }}>
                  <span style={{ fontSize: 12, color: "#aaa" }}>
                    Page {currentPage} sur {totalPages} · {newsList.length} articles
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                      style={{ ...btnSecondary, padding: "7px 12px", opacity: currentPage === 1 ? 0.4 : 1 }}>
                      <ChevronLeft size={14} />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button key={i} onClick={() => setCurrentPage(i + 1)}
                        style={{ width: 32, height: 32, borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, background: currentPage === i + 1 ? NAVY : "#f5f5f5", color: currentPage === i + 1 ? "#fff" : "#555" }}>
                        {i + 1}
                      </button>
                    ))}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                      style={{ ...btnSecondary, padding: "7px 12px", opacity: currentPage === totalPages ? 0.4 : 1 }}>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ════ VIEW: DETAIL ════ */}
      {view === "detail" && selectedNews && (
        <div style={{ ...card, overflow: "hidden" }} className="fade-up">
          {getImage(selectedNews) && (
            <div style={{ height: 300, overflow: "hidden", position: "relative" }}>
              <img src={getImage(selectedNews)} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${NAVY}, ${ORANGE})` }} />
            </div>
          )}
          <div style={{ padding: "32px 36px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: "#aaa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                  {selectedNews.created_at ? new Date(selectedNews.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : ""}
                </div>
                <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0a0a0a", margin: 0, letterSpacing: "-0.02em", fontFamily: "'Creato Display', sans-serif", lineHeight: 1.2 }}>
                  {selectedNews.title_fr}
                </h2>
                {selectedNews.title_en && <p style={{ fontSize: 16, color: "#888", marginTop: 6, fontWeight: 300 }}>{selectedNews.title_en}</p>}
              </div>
              <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                <button onClick={() => editNews(selectedNews)} style={btnPrimary} className="btn-p">
                  <Edit2 size={14} /> Modifier
                </button>
                <button onClick={() => deleteNews(selectedNews.id)} style={{ ...btnSecondary, color: "#ef4444" }} className="btn-d">
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { lang: "Français", content: selectedNews.content_fr, accent: NAVY },
                { lang: "English", content: selectedNews.content_en, accent: ORANGE },
              ].filter(x => x.content).map(({ lang, content, accent }) => (
                <div key={lang} style={{ background: "#fafafa", borderRadius: 12, padding: "20px 24px", borderLeft: `3px solid ${accent}` }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: accent, marginBottom: 12 }}>{lang}</div>
                  <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8, whiteSpace: "pre-wrap", margin: 0 }}>{content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
};

export default NewsPost;