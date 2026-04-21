import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Shield, ArrowRight, Building2 } from 'lucide-react';
import CONFIG from '../../config/config.js';

/**
 * 🏗️ LOGIN PAGE - BETCOM AI ULTRA MODERNE
 * Charte: Noir #000000, Blanc #ffffff, Gris
 * Style: Architecture minimaliste + Micro-interactions sophistiquées
 */

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.API_LOGIN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
      setError("Impossible de se connecter au serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && username && password) {
      handleLogin(e);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center p-4">
      
      {/* Animated Background Effects - Minimaliste */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Subtle orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gray-50 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-100 rounded-full blur-3xl animate-float-delayed"></div>
        
        {/* Grid pattern ultra subtil */}
        <div className="absolute inset-0 opacity-[0.015]" 
             style={{
               backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
               backgroundSize: '50px 50px'
             }}
        ></div>

        {/* Lignes architecturales */}
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="absolute bottom-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>

      {/* Floating dots minimalistes */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-[10%] w-1 h-1 bg-black rounded-full animate-pulse-slow"></div>
        <div className="absolute top-[30%] right-[15%] w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-[20%] left-[20%] w-1 h-1 bg-gray-600 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[40%] right-[10%] w-1.5 h-1.5 bg-black rounded-full animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Main Login Card */}
      <div className="relative w-full max-w-md z-10">
        
        {/* Ombre portée sophistiquée */}
        <div className="absolute -inset-2 bg-black/5 rounded-3xl blur-2xl"></div>
        
        {/* Card Container */}
        <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-black overflow-hidden">
          
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-black"></div>

          {/* Content */}
          <div className="relative p-8 md:p-12">
            
            {/* Logo & Header */}
            <div className="text-center mb-12">
              {/* Animated Logo */}
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-black/10 blur-2xl rounded-2xl animate-pulse-slow"></div>
                <div className="relative w-24 h-24 bg-black rounded-2xl flex items-center justify-center mx-auto shadow-2xl transform hover:rotate-6 transition-all duration-500 group">
                  <Building2 className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-black rounded-full flex items-center justify-center animate-bounce-slow">
                    <Shield className="w-3 h-3 text-black" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-3 text-black tracking-tight" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                BETCOM
              </h1>
              <p className="text-gray-600 text-sm font-semibold tracking-wider uppercase mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Espace Administration
              </p>
              
              {/* Divider ultra-minimaliste */}
              <div className="flex items-center justify-center gap-3">
                <div className="w-16 h-px bg-gray-300"></div>
                <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                <div className="w-16 h-px bg-gray-300"></div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-8 relative animate-shake">
                <div className="absolute inset-0 bg-red-500/10 blur-xl rounded-2xl"></div>
                <div className="relative bg-red-50 border-2 border-red-500 rounded-2xl p-5 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">!</span>
                    </div>
                    <div>
                      <p className="text-red-700 text-sm font-bold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Erreur de connexion
                      </p>
                      <p className="text-red-600 text-xs leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-7">
              
              {/* Username Field */}
              <div className="space-y-3">
                <label className="text-black text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                  Nom d'utilisateur
                </label>
                <div className="relative group">
                  {/* Focus effect */}
                  <div className={`absolute -inset-1 bg-black rounded-2xl opacity-0 ${focusedField === 'username' ? 'opacity-100' : 'group-hover:opacity-5'} transition-opacity duration-300 blur-sm`}></div>
                  
                  <div className="relative flex items-center">
                    {/* Icon container */}
                    <div className="absolute left-4 w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    
                    <input
                      type="text"
                      className="w-full pl-20 pr-6 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl text-black placeholder-gray-400 focus:outline-none focus:border-black focus:bg-white focus:shadow-xl transition-all duration-300 font-medium text-base"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                      placeholder="admin@betcom.ma"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <label className="text-black text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                  Mot de passe
                </label>
                <div className="relative group">
                  {/* Focus effect */}
                  <div className={`absolute -inset-1 bg-black rounded-2xl opacity-0 ${focusedField === 'password' ? 'opacity-100' : 'group-hover:opacity-5'} transition-opacity duration-300 blur-sm`}></div>
                  
                  <div className="relative flex items-center">
                    {/* Icon container */}
                    <div className="absolute left-4 w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                    
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className="w-full pl-20 pr-16 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl text-black placeholder-gray-400 focus:outline-none focus:border-black focus:bg-white focus:shadow-xl transition-all duration-300 font-medium text-base"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                      placeholder="••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                    />
                    
                    {/* Toggle visibility */}
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-4 p-3 hover:bg-gray-100 rounded-xl transition-all duration-300 group/eye"
                    >
                      {passwordVisible ? (
                        <EyeOff className="w-5 h-5 text-gray-600 group-hover/eye:text-black transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400 group-hover/eye:text-black transition-colors" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-6 h-6 rounded-lg border-2 border-gray-300 bg-white flex items-center justify-center group-hover:border-black transition-all duration-300 relative">
                    <div className="w-3 h-3 bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-black font-medium transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Se souvenir de moi
                  </span>
                </label>
                
                <a 
                  href="#" 
                  className="text-sm text-gray-600 hover:text-black font-semibold transition-all duration-300 flex items-center gap-2 group"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Mot de passe oublié ?
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !username || !password}
                className="relative w-full group/btn overflow-hidden mt-10"
              >
                {/* Background layers */}
                <div className="absolute inset-0 bg-black group-hover/btn:bg-gray-900 transition-colors duration-300"></div>
                
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                
                {/* Button content */}
                <div className="relative flex items-center justify-center gap-3 py-5 px-6 rounded-2xl font-bold text-lg group-hover/btn:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-xl"
                     style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-white tracking-wider">CONNEXION...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-6 h-6 text-white group-hover/btn:rotate-12 transition-transform duration-300" />
                      <span className="text-white tracking-wider">SE CONNECTER</span>
                      <ArrowRight className="w-6 h-6 text-white group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Security Badge */}
            <div className="mt-10 pt-8 border-t-2 border-gray-100">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="flex items-center gap-3 px-5 py-3 bg-green-50 border-2 border-green-500 rounded-full">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 text-xs font-bold tracking-wide" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    CONNEXION SÉCURISÉE SSL
                  </span>
                </div>
              </div>
              
              {/* Version & Copyright */}
              <div className="text-center space-y-2">
                <p className="text-gray-400 text-xs font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  BETCOM AI Admin Portal
                </p>
                <p className="text-gray-300 text-xs" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  © 2026 Tous droits réservés
                </p>
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-black"></div>
        </div>
      </div>

      {/* Animated CSS */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 20px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;