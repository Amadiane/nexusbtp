import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';
import NexusLogo from '../../assets/logo.jpg';
import CONFIG from '../../config/config.js';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [remembered, setRemembered] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.API_LOGIN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.access) {
        localStorage.setItem('access', data.access);
        localStorage.setItem('user', JSON.stringify({ username }));
        navigate('/dashboardAdmin');
      } else {
        setError(data.detail || "Nom d'utilisateur ou mot de passe incorrect");
      }
    } catch (err) {
      console.log(err);
      setError('Impossible de se connecter au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && username && password) handleLogin(e);
  };

  return (
    <div style={styles.page}>
      {/* Background elements */}
      <div style={styles.bgDots} />
      <div style={styles.bgShape1} />
      <div style={styles.bgShape2} />
      <div style={styles.bgShapeTriangle} />

      {/* Card */}
      <div style={styles.cardWrapper}>
        <div style={styles.card}>
          {/* Top accent bar */}
          <div style={styles.topBar} />

          <div style={styles.cardBody}>
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.logoArea}>
                <div style={styles.logoBox}>
                  <img src={NexusLogo} alt="Nexus BTP Consulting" style={styles.logoImg} />
                </div>
                <div style={styles.logoTextCol}>
                  <div style={styles.brandName}>
                    NEX<span style={styles.brandNameOrange}>US</span>
                  </div>
                  <div style={styles.brandSub}>BTP Consulting</div>
                </div>
              </div>

              <div style={styles.dividerRow}>
                <div style={styles.dividerLine} />
                <div style={styles.dividerDot} />
                <div style={styles.dividerLine} />
              </div>

              <p style={styles.headerTitle}>Espace Administration</p>
              <p style={styles.headerSubtitle}>Accès sécurisé · Portail de gestion</p>
            </div>

            {/* Error */}
            {error && (
              <div style={styles.errorBox}>
                <div style={styles.errorIcon}>!</div>
                <div>
                  <p style={styles.errorTitle}>Erreur de connexion</p>
                  <p style={styles.errorText}>{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin}>

              {/* Username */}
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>
                  <span style={styles.labelDot} />
                  Nom d'utilisateur
                </label>
                <div
                  style={{
                    ...styles.inputRow,
                    ...(focusedField === 'username' ? styles.inputRowFocused : {}),
                  }}
                >
                  <div style={styles.inputIcon}>
                    <User size={18} color="#fff" strokeWidth={1.8} />
                  </div>
                  <input
                    type="text"
                    placeholder="admin@nexusbtp.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    style={styles.fieldInput}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>
                  <span style={styles.labelDot} />
                  Mot de passe
                </label>
                <div
                  style={{
                    ...styles.inputRow,
                    ...(focusedField === 'password' ? styles.inputRowFocused : {}),
                  }}
                >
                  <div style={styles.inputIcon}>
                    <Lock size={18} color="#fff" strokeWidth={1.8} />
                  </div>
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    style={styles.fieldInput}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    style={styles.toggleBtn}
                  >
                    {passwordVisible
                      ? <EyeOff size={17} strokeWidth={1.8} />
                      : <Eye size={17} strokeWidth={1.8} />}
                  </button>
                </div>
              </div>

              {/* Remember / Forgot */}
              <div style={styles.formFooter}>
                <div
                  style={styles.rememberLabel}
                  onClick={() => setRemembered(!remembered)}
                >
                  <div style={{ ...styles.checkbox, ...(remembered ? styles.checkboxChecked : {}) }}>
                    {remembered && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span style={styles.rememberText}>Se souvenir de moi</span>
                </div>

                <a href="#" style={styles.forgotLink}>
                  Mot de passe oublié ?
                  <ArrowRight size={13} strokeWidth={2} />
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !username || !password}
                style={{
                  ...styles.submitBtn,
                  ...(loading || !username || !password ? styles.submitBtnDisabled : {}),
                }}
              >
                {loading ? (
                  <>
                    <div style={styles.spinner} />
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  <>
                    <Shield size={17} color="#fff" strokeWidth={2} />
                    <span>SE CONNECTER</span>
                    <ArrowRight size={17} color="#fff" strokeWidth={2} />
                  </>
                )}
                <div style={styles.btnAccent} />
              </button>
            </form>

            {/* Security */}
            <div style={styles.securityStrip}>
              <div style={styles.sslBadge}>
                <div style={styles.sslDot} />
                <span style={styles.sslText}>CONNEXION SSL SÉCURISÉE</span>
              </div>
            </div>

            <p style={styles.copyright}>
              NEXUS BTP Consulting · © 2026 Tous droits réservés
            </p>
          </div>

          {/* Bottom accent bar */}
          <div style={styles.bottomBar} />
        </div>
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body, #root { height: 100%; margin: 0; padding: 0; overflow: hidden; }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes sslBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .nexus-submit:hover:not(:disabled) {
          background: #00276a !important;
        }
      `}</style>
    </div>
  );
};

/* ─────────────── Styles ─────────────── */
const NAVY = '#003893';
const ORANGE = '#EA580C';

const styles = {
  page: {
    height: '100vh',
    maxHeight: '100vh',
    background: '#f0f4f8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
  },
  bgDots: {
    position: 'fixed',
    inset: 0,
    backgroundImage: 'radial-gradient(circle, rgba(0,56,147,0.11) 1px, transparent 1px)',
    backgroundSize: '32px 32px',
    pointerEvents: 'none',
  },
  bgShape1: {
    position: 'fixed',
    width: 520,
    height: 520,
    borderRadius: '50%',
    background: 'rgba(0,56,147,0.06)',
    top: -140,
    right: -100,
    pointerEvents: 'none',
  },
  bgShape2: {
    position: 'fixed',
    width: 420,
    height: 420,
    borderRadius: '50%',
    background: 'rgba(234,88,12,0.05)',
    bottom: -100,
    left: -80,
    pointerEvents: 'none',
  },
  bgShapeTriangle: {
    position: 'fixed',
    width: 0,
    height: 0,
    borderLeft: '200px solid transparent',
    borderRight: '200px solid transparent',
    borderBottom: `350px solid rgba(0,56,147,0.03)`,
    top: '30%',
    left: '5%',
    pointerEvents: 'none',
  },
  cardWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: 460,
    zIndex: 2,
    animation: 'fadeInUp 0.5s cubic-bezier(0.22,1,0.36,1) both',
  },
  card: {
    background: '#fff',
    borderRadius: 20,
    border: '1.5px solid #e2e8f0',
    overflow: 'hidden',
    boxShadow: '0 4px 32px rgba(0,56,147,0.10), 0 1px 4px rgba(0,0,0,0.06)',
  },
  topBar: {
    height: 5,
    background: `linear-gradient(90deg, ${NAVY} 0%, ${NAVY} 60%, ${ORANGE} 100%)`,
  },
  bottomBar: {
    height: 5,
    background: `linear-gradient(90deg, ${ORANGE} 0%, ${NAVY} 100%)`,
  },
  cardBody: {
    padding: '1.1rem 1.75rem 1rem',
  },

  /* Header */
  header: { textAlign: 'center', marginBottom: '1rem' },
  logoArea: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: '0.5rem',
  },
  logoBox: {
    width: 52,
    height: 52,
    background: '#fff',
    borderRadius: 12,
    border: '1.5px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  logoImg: { width: 42, height: 42, objectFit: 'contain' },
  logoTextCol: { textAlign: 'left' },
  brandName: {
    fontSize: 22,
    fontWeight: 800,
    color: NAVY,
    letterSpacing: '0.04em',
    lineHeight: 1,
  },
  brandNameOrange: { color: ORANGE },
  brandSub: {
    fontSize: 11,
    fontWeight: 600,
    color: '#64748b',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  dividerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: '0.35rem',
  },
  dividerLine: { flex: 1, maxWidth: 60, height: 1, background: '#e2e8f0' },
  dividerDot: { width: 6, height: 6, background: ORANGE, borderRadius: '50%' },
  headerTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1e293b',
    marginTop: '0.35rem',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
    letterSpacing: '0.06em',
  },

  /* Error */
  errorBox: {
    background: '#fff5f5',
    border: `1.5px solid ${ORANGE}`,
    borderRadius: 12,
    padding: '12px 14px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: '1.25rem',
  },
  errorIcon: {
    width: 22,
    height: 22,
    flexShrink: 0,
    background: ORANGE,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
    color: '#fff',
  },
  errorTitle: { fontSize: 12, fontWeight: 700, color: '#c2410c', marginBottom: 2 },
  errorText: { fontSize: 12, color: '#c2410c', lineHeight: 1.5 },

  /* Fields */
  fieldGroup: { marginBottom: '0.6rem' },
  fieldLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: NAVY,
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  labelDot: { width: 5, height: 5, background: ORANGE, borderRadius: '50%', display: 'inline-block' },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    background: '#f8fafc',
    border: '1.5px solid #e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
    transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
  },
  inputRowFocused: {
    borderColor: NAVY,
    background: '#fff',
    boxShadow: `0 0 0 3px rgba(0,56,147,0.08)`,
  },
  inputIcon: {
    width: 44,
    height: 46,
    flexShrink: 0,
    background: NAVY,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldInput: {
    flex: 1,
    padding: '0 12px',
    height: 46,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: 14,
    color: '#1e293b',
    fontFamily: 'inherit',
  },
  toggleBtn: {
    width: 40,
    height: 46,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
    transition: 'color 0.2s',
    padding: 0,
  },

  /* Remember / Forgot */
  formFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '0.4rem 0 0.75rem',
  },
  rememberLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    userSelect: 'none',
  },
  checkbox: {
    width: 18,
    height: 18,
    border: '1.5px solid #cbd5e1',
    borderRadius: 5,
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s, border-color 0.2s',
    flexShrink: 0,
  },
  checkboxChecked: { background: NAVY, borderColor: NAVY },
  rememberText: { fontSize: 13, color: '#475569' },
  forgotLink: {
    fontSize: 12,
    fontWeight: 600,
    color: ORANGE,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    transition: 'gap 0.2s',
  },

  /* Submit button */
  submitBtn: {
    width: '100%',
    height: 48,
    background: NAVY,
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '0.1em',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    transition: 'background 0.2s, transform 0.1s',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'inherit',
  },
  submitBtnDisabled: {
    background: '#94a3b8',
    cursor: 'not-allowed',
  },
  btnAccent: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 6,
    background: ORANGE,
  },
  spinner: {
    width: 20,
    height: 20,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },

  /* Security */
  securityStrip: {
    marginTop: '0.75rem',
    paddingTop: '0.65rem',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sslBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: '#f0fdf4',
    border: '1px solid #86efac',
    borderRadius: 20,
    padding: '5px 14px',
  },
  sslDot: {
    width: 7,
    height: 7,
    background: '#16a34a',
    borderRadius: '50%',
    animation: 'sslBlink 2s ease-in-out infinite',
  },
  sslText: {
    fontSize: 11,
    fontWeight: 700,
    color: '#15803d',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  copyright: {
    textAlign: 'center',
    marginTop: '0.4rem',
    fontSize: 11,
    color: '#94a3b8',
  },
};

export default Login;