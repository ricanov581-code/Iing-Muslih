import React from 'react';
import { X, Heart, BookOpen, Leaf, Users, Flag, Sparkles } from 'lucide-react';
import { PANCA_CINTA_LIST, SCORE_CATEGORIES } from '../data/kbcFramework';

interface PancaCintaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PancaCintaModal: React.FC<PancaCintaModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <Heart className="w-4 h-4 fill-emerald-100" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Landasan Filosofis: Panca Cinta Kemenag
              </h2>
              <p className="text-xs text-stone-500">
                Lima Nilai Cinta Acuan Implementasi KBC di RA Asy Syifa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Intro text from PDF */}
          <div className="text-xs text-stone-700 leading-relaxed bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
            <strong>Kerangka Evaluasi KBC RA Asy Syifa:</strong> Membantu RA Asy Syifa memastikan bahwa Kurikulum Berbasis Cinta (KBC) benar-benar dijalankan, bukan hanya tertulis di dokumen. Pendekatannya adalah <strong>Input - Proses - Output - Dampak</strong>, dengan landasan lima nilai cinta (Panca Cinta) dalam KBC Kemenag.
          </div>

          {/* 5 Nilai Cinta */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              A. Lima Nilai Panca Cinta (PDF Halaman 1)
            </h3>
            <div className="space-y-2.5">
              {PANCA_CINTA_LIST.map((pc, idx) => (
                <div
                  key={pc.id}
                  className="p-3 rounded-xl border border-stone-200 bg-white hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-5 h-5 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0"
                      style={{ backgroundColor: pc.color }}
                    >
                      {idx + 1}
                    </span>
                    <h4 className="text-xs font-bold text-stone-900">
                      {pc.name}
                    </h4>
                  </div>
                  <p className="text-xs text-stone-600 pl-7 leading-relaxed">
                    {pc.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Skor Rubrik & Interpretasi PDF Halaman 4 */}
          <div className="space-y-3 pt-3 border-t border-stone-100">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              B. Interpretasi Skor Total Kemenag (PDF Halaman 4)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {SCORE_CATEGORIES.map((cat) => (
                <div
                  key={cat.label}
                  className={`p-3 rounded-lg border ${
                    cat.tone === 'emerald'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : cat.tone === 'teal'
                      ? 'bg-teal-50 border-teal-200 text-teal-950'
                      : cat.tone === 'amber'
                      ? 'bg-amber-50 border-amber-200 text-amber-950'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span>{cat.label}</span>
                    <span className="font-mono">
                      {cat.minPercentage}% - {cat.maxPercentage}%
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-90">
                    {cat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-stone-100 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
