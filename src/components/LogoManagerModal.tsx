import React, { useRef, useState } from 'react';
import { X, Upload, Check, RotateCcw, Image as ImageIcon, ShieldCheck, Link2 } from 'lucide-react';
import {
  LogoConfig,
  saveStoredLogo,
  removeStoredLogo,
  DEFAULT_LOGO_YP3I,
  DEFAULT_LOGO_RA,
  FALLBACK_VECTOR_YP3I,
  FALLBACK_VECTOR_RA,
} from '../utils/logoStorage';

interface LogoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  logoConfig: LogoConfig;
  onLogosUpdated: (newConfig: LogoConfig) => void;
}

export const LogoManagerModal: React.FC<LogoManagerModalProps> = ({
  isOpen,
  onClose,
  logoConfig,
  onLogosUpdated,
}) => {
  const [yp3iPreview, setYp3iPreview] = useState(logoConfig.logoYp3i);
  const [raPreview, setRaPreview] = useState(logoConfig.logoRa);
  const [yp3iUrlInput, setYp3iUrlInput] = useState(logoConfig.logoYp3i);
  const [raUrlInput, setRaUrlInput] = useState(logoConfig.logoRa);
  const [isCustomYp3i, setIsCustomYp3i] = useState(logoConfig.isCustomYp3i);
  const [isCustomRa, setIsCustomRa] = useState(logoConfig.isCustomRa);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const yp3iInputRef = useRef<HTMLInputElement>(null);
  const raInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleApplyUrl = (type: 'yp3i' | 'ra') => {
    const url = type === 'yp3i' ? yp3iUrlInput.trim() : raUrlInput.trim();
    if (!url) return;

    if (type === 'yp3i') {
      setYp3iPreview(url);
      setIsCustomYp3i(true);
      saveStoredLogo('yp3i', url);
      setFeedbackMsg('Tautan langsung Logo Yayasan berhasil disimpan!');
    } else {
      setRaPreview(url);
      setIsCustomRa(true);
      saveStoredLogo('ra', url);
      setFeedbackMsg('Tautan langsung Logo RA Asy Syifa berhasil disimpan!');
    }

    onLogosUpdated({
      logoYp3i: type === 'yp3i' ? url : yp3iPreview,
      logoRa: type === 'ra' ? url : raPreview,
      isCustomYp3i: type === 'yp3i' ? true : isCustomYp3i,
      isCustomRa: type === 'ra' ? true : isCustomRa,
    });

    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleFileChange = (type: 'yp3i' | 'ra', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      if (type === 'yp3i') {
        setYp3iPreview(dataUrl);
        setYp3iUrlInput(dataUrl.substring(0, 40) + '... (berkas data)');
        setIsCustomYp3i(true);
        saveStoredLogo('yp3i', dataUrl);
        setFeedbackMsg('Logo Yayasan berhasil dimuat langsung dari berkas asli Anda!');
      } else {
        setRaPreview(dataUrl);
        setRaUrlInput(dataUrl.substring(0, 40) + '... (berkas data)');
        setIsCustomRa(true);
        saveStoredLogo('ra', dataUrl);
        setFeedbackMsg('Logo RA Asy Syifa (RA Trans) berhasil dimuat langsung dari berkas asli Anda!');
      }

      onLogosUpdated({
        logoYp3i: type === 'yp3i' ? dataUrl : yp3iPreview,
        logoRa: type === 'ra' ? dataUrl : raPreview,
        isCustomYp3i: type === 'yp3i' ? true : isCustomYp3i,
        isCustomRa: type === 'ra' ? true : isCustomRa,
      });

      setTimeout(() => setFeedbackMsg(null), 3500);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = (type: 'yp3i' | 'ra') => {
    if (type === 'yp3i') {
      removeStoredLogo('yp3i');
      setYp3iPreview(DEFAULT_LOGO_YP3I);
      setYp3iUrlInput(DEFAULT_LOGO_YP3I);
      setIsCustomYp3i(false);
      onLogosUpdated({
        logoYp3i: DEFAULT_LOGO_YP3I,
        logoRa: raPreview,
        isCustomYp3i: false,
        isCustomRa: isCustomRa,
      });
      setFeedbackMsg('Logo Yayasan dikembalikan ke tautan langsung awal.');
    } else {
      removeStoredLogo('ra');
      setRaPreview(DEFAULT_LOGO_RA);
      setRaUrlInput(DEFAULT_LOGO_RA);
      setIsCustomRa(false);
      onLogosUpdated({
        logoYp3i: yp3iPreview,
        logoRa: DEFAULT_LOGO_RA,
        isCustomYp3i: isCustomYp3i,
        isCustomRa: false,
      });
      setFeedbackMsg('Logo RA dikembalikan ke tautan langsung awal.');
    }
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-200">
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white px-6 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-200">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                Pengaturan Logo Asli Kop Surat & Header
              </h2>
              <p className="text-xs text-emerald-200">
                Gunakan tautan langsung atau berkas logo asli tanpa modifikasi AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-emerald-800 text-emerald-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {feedbackMsg && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl font-medium animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Jaminan Keaslian Banner */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-stone-700 space-y-1">
            <div className="flex items-center gap-2 font-bold text-stone-900">
              <ImageIcon className="w-4 h-4 text-emerald-700" />
              <span>Prinsip Keaslian Logo Otentik</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Sesuai arahan Anda, aplikasi menggunakan tautan langsung <strong>https://infofast.com</strong> pada atribut <code>src</code> gambar dan mengatur tinggi kedua logo agar sama besar serta sejajar secara horizontal dengan teks judul yayasan dan sekolah di tengah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Box 1: Logo Yayasan (Kiri) */}
            <div className="border border-stone-200 rounded-xl p-4 flex flex-col justify-between bg-white hover:border-emerald-500/50 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    1. Logo Sebelah Kiri (YP3I)
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Direct Link Aktif
                  </span>
                </div>

                {/* Preview Box dengan Tinggi Sejajar */}
                <div className="h-28 bg-stone-50 border border-dashed border-stone-300 rounded-lg flex items-center justify-center p-3 mb-3">
                  <img
                    src={yp3iPreview}
                    alt="Logo Yayasan YP3I"
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== FALLBACK_VECTOR_YP3I) {
                        target.src = FALLBACK_VECTOR_YP3I;
                      }
                    }}
                  />
                </div>

                <p className="text-[11px] text-stone-500 mb-2">
                  Posisi: Sebelah <strong>Kiri</strong> pada Kop Surat.
                </p>

                {/* Direct Link Input */}
                <div className="space-y-1.5 mb-3">
                  <label className="text-[10px] font-bold text-stone-700 uppercase flex items-center gap-1">
                    <Link2 className="w-3 h-3 text-emerald-600" />
                    <span>Tautan Langsung (Direct Link):</span>
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={yp3iUrlInput}
                      onChange={(e) => setYp3iUrlInput(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                    />
                    <button
                      onClick={() => handleApplyUrl('yp3i')}
                      className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-[11px] font-semibold rounded-lg shrink-0 cursor-pointer"
                    >
                      Terapkan
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-100">
                <input
                  type="file"
                  ref={yp3iInputRef}
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                  onChange={(e) => handleFileChange('yp3i', e)}
                />
                <button
                  onClick={() => yp3iInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-stone-600" />
                  <span>Atau Unggah Berkas Gambar Asli</span>
                </button>
                <button
                  onClick={() => handleReset('yp3i')}
                  className="w-full flex items-center justify-center gap-1.5 px-2 py-1 text-stone-500 hover:text-stone-800 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Kembalikan ke infofast.com</span>
                </button>
              </div>
            </div>

            {/* Box 2: Logo RA Asy Syifa (Kanan) */}
            <div className="border border-stone-200 rounded-xl p-4 flex flex-col justify-between bg-white hover:border-emerald-500/50 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    2. Logo Kanan (RA Asy Syifa - RA Trans.png)
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {isCustomRa ? 'Berkas Asli Aktif' : 'Menunggu Berkas'}
                  </span>
                </div>

                {/* Preview Box dengan Pola Transparan Checkerboard */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const dataUrl = ev.target?.result as string;
                        if (dataUrl) {
                          setRaPreview(dataUrl);
                          setRaUrlInput('Berkas Asli RA Trans.png');
                          setIsCustomRa(true);
                          saveStoredLogo('ra', dataUrl);
                          setFeedbackMsg('Berkas asli RA Trans.png berhasil dimuat langsung tanpa modifikasi AI!');
                          onLogosUpdated({
                            logoYp3i: yp3iPreview,
                            logoRa: dataUrl,
                            isCustomYp3i: isCustomYp3i,
                            isCustomRa: true,
                          });
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="h-28 bg-stone-50 border border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center p-3 mb-3 relative overflow-hidden group cursor-pointer hover:border-emerald-500 transition-colors"
                  onClick={() => raInputRef.current?.click()}
                  title="Klik atau seret berkas RA Trans.png ke sini"
                >
                  <img
                    src={raPreview && !raPreview.includes('logo_ra_asli') ? raPreview : DEFAULT_LOGO_RA}
                    alt="Logo RA Asy Syifa"
                    className="max-h-full max-w-full object-contain relative z-10"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== DEFAULT_LOGO_RA) {
                        target.src = DEFAULT_LOGO_RA;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-medium z-20">
                    <span>Klik / Seret RA Trans.png</span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-500 mb-2">
                  Posisi: Sebelah <strong>Kanan</strong> pada Kop Surat. Format 100% asli dari berkas <code>RA Trans.png</code> Anda.
                </p>

                {/* Direct Link Input */}
                <div className="space-y-1.5 mb-3">
                  <label className="text-[10px] font-bold text-stone-700 uppercase flex items-center gap-1">
                    <Link2 className="w-3 h-3 text-emerald-600" />
                    <span>Tautan Langsung (Direct Link):</span>
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={raUrlInput}
                      onChange={(e) => setRaUrlInput(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                    />
                    <button
                      onClick={() => handleApplyUrl('ra')}
                      className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-[11px] font-semibold rounded-lg shrink-0 cursor-pointer"
                    >
                      Terapkan
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-100">
                <input
                  type="file"
                  ref={raInputRef}
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                  onChange={(e) => handleFileChange('ra', e)}
                />
                <button
                  onClick={() => raInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-white" />
                  <span>Pilih Berkas RA Trans.png Asli</span>
                </button>
                <button
                  onClick={() => handleReset('ra')}
                  className="w-full flex items-center justify-center gap-1.5 px-2 py-1 text-stone-500 hover:text-stone-800 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Kembalikan ke Tautan Default</span>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
            <span>Tinggi kedua logo diatur sama besar & sejajar secara horizontal pada Kop Surat.</span>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 hover:bg-black text-white font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Tutup & Terapkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
