import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, LogIn, AlertCircle, ShieldCheck, Building2 } from 'lucide-react';

interface LoginPageProps {
  logoRa: string;
  onLoginSuccess: (user: { username: string; name: string; role: string }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ logoRa, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    // Standardize input
    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Validation:
    // Username default: raasysyifa
    // Password default: 58199
    const isValid =
      (cleanUsername === 'raasysyifa' || cleanUsername === 'raasysyifa@gmail.com') &&
      cleanPassword === '58199';

    setTimeout(() => {
      setIsLoading(false);
      if (isValid) {
        onLoginSuccess({
          username: 'raasysyifa',
          name: 'Iing Muslih, S.Ag',
          role: 'Sekretaris YP3I / Tim Evaluator KBC',
        });
      } else {
        setErrorMessage('Username atau password salah!');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-stone-900 to-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Islamic Geometric Pattern Accents */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Decorative Glow Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card Container */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden z-10">
        {/* Top Header Banner with Emerald Ribbon */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white px-6 pt-7 pb-6 text-center relative">
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded-full text-[10px] text-emerald-200 border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3 text-emerald-300" />
            <span>Portal Terproteksi</span>
          </div>

          {/* Logo Display Section */}
          <div className="flex justify-center mb-3">
            <div className="w-24 h-24 bg-white rounded-2xl p-2 shadow-lg flex items-center justify-center border-2 border-emerald-100/80 transition-transform hover:scale-105 duration-200">
              {!imgError ? (
                <img
                  src={logoRa}
                  alt="Logo RA Asy Syifa"
                  onError={() => setImgError(true)}
                  style={{ height: '75px', width: 'auto', objectFit: 'contain' }}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <Building2 className="w-9 h-9 text-emerald-700" />
                  <span className="text-[10px] font-bold text-emerald-900 uppercase mt-0.5 leading-tight">
                    RA Asy Syifa
                  </span>
                </div>
              )}
            </div>
          </div>

          <h2 className="text-xs font-semibold tracking-wider text-emerald-200 uppercase">
            Yayasan Pendidikan Pembinaan dan Pengembangan Islam (YP3I)
          </h2>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase mt-1">
            RAUDHATUL ATHFAL (RA) ASY SYIFA
          </h1>
          <p className="text-xs text-emerald-100 mt-1 font-medium">
            Sistem Evaluasi Kurikulum Berbasis Cinta (KBC)
          </p>
        </div>

        {/* Card Body & Form */}
        <div className="p-6 sm:p-8 bg-white">
          <div className="mb-5 text-center">
            <h3 className="text-base font-semibold text-stone-900">
              Masuk ke Portal Evaluasi
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Silakan masukkan kredensial akun untuk mengakses sistem
            </p>
          </div>

          {/* Error Alert Display */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 p-3.5 bg-rose-50 border-l-4 border-rose-500 rounded-r-lg flex items-start gap-2.5 text-rose-800 animate-shake"
            >
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-rose-900">Akses Ditolak</p>
                <p className="text-xs font-medium text-rose-700 mt-0.5">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wider"
              >
                Username / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username atau email"
                  required
                  autoFocus
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-stone-700 uppercase tracking-wider"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Aplikasi</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Institutional Footer Info */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-100 text-center">
          <p className="text-[10px] text-stone-500 leading-relaxed font-medium">
            Alamat Kampus: Jalan Kewadanaan Gang. Kancra No. 292 Lingk. Cibulan Kota Banjar
          </p>
          <p className="text-[10px] text-stone-400 mt-0.5">
            © {new Date().getFullYear()} RA Asy Syifa · YP3I Kota Banjar
          </p>
        </div>
      </div>
    </div>
  );
};
