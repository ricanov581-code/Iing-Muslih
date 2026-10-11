import React from 'react';
import {
  FileText,
  Eye,
  MessageSquare,
  ClipboardList,
  CheckCircle2,
  ShieldCheck,
  Plus,
  Trash2,
} from 'lucide-react';
import { EvaluationData } from '../types/kbc';

interface TriangulationViewProps {
  evaluation: EvaluationData;
  onUpdateTriangulationNote: (
    methodKey: 'documentReview' | 'observation' | 'interview' | 'survey',
    note: string
  ) => void;
  onToggleItem: (
    methodKey: 'documentReview' | 'observation' | 'interview' | 'survey',
    itemId: string
  ) => void;
  onNavigateToPdca: () => void;
}

export const TriangulationView: React.FC<TriangulationViewProps> = ({
  evaluation,
  onUpdateTriangulationNote,
  onToggleItem,
  onNavigateToPdca,
}) => {
  const methods = [
    {
      key: 'documentReview' as const,
      data: evaluation.triangulation.documentReview,
      icon: <FileText className="w-5 h-5 text-blue-700" />,
      tag: '1. Telaah Dokumen',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      key: 'observation' as const,
      data: evaluation.triangulation.observation,
      icon: <Eye className="w-5 h-5 text-emerald-700" />,
      tag: '2. Observasi Lapangan',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      key: 'interview' as const,
      data: evaluation.triangulation.interview,
      icon: <MessageSquare className="w-5 h-5 text-amber-700" />,
      tag: '3. Wawancara Mendalam',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      key: 'survey' as const,
      data: evaluation.triangulation.survey,
      icon: <ClipboardList className="w-5 h-5 text-purple-700" />,
      tag: '4. Angket & Kuesioner',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    },
  ];

  // Triangulation readiness count
  const allVerified = methods.every((m) =>
    m.data.items.some((i) => i.checked) && m.data.notes.trim().length > 0
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Title & Introduction Banner */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <span>Bagian D Kerangka Evaluasi</span>
              <span>·</span>
              <span className="text-stone-500">Hal. 4 PDF</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
              Metode Pengumpulan Data (Triangulasi)
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-3xl mt-1 leading-relaxed">
              Data dikumpulkan lewat <strong>empat cara</strong> agar temuan saling menguatkan dan menjamin keabsahan evaluasi implementasi KBC di RA Asy Syifa: tidak hanya bersandar pada klaim dokumen, namun terbukti pada perilaku anak, observasi kelas, dan kepuasan orang tua.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 shrink-0">
            <ShieldCheck className="w-8 h-8 text-emerald-700" />
            <div>
              <span className="text-[11px] text-stone-500 block font-medium">
                Status Triangulasi
              </span>
              <span className="text-xs font-bold text-stone-900">
                {allVerified ? 'Lengkap & Tervalidasi' : 'Dalam Proses Verifikasi'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {methods.map(({ key, data, icon, tag, badgeColor }) => {
          const checkedCount = data.items.filter((i) => i.checked).length;

          return (
            <div
              key={key}
              className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                      {icon}
                    </div>
                    <h2 className="text-sm font-bold text-stone-900">
                      {tag}
                    </h2>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${badgeColor}`}
                  >
                    {checkedCount}/{data.items.length} Bukti
                  </span>
                </div>

                <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                  {data.description}
                </p>

                {/* Checklist items */}
                <div className="space-y-2 mb-4">
                  <span className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider block">
                    Daftar Bukti Fisik / Sasaran Verifikasi:
                  </span>
                  {data.items.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-start gap-2.5 p-2 rounded-lg border border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => onToggleItem(key, item.id)}
                        className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span
                        className={`text-xs ${
                          item.checked
                            ? 'text-stone-900 font-medium'
                            : 'text-stone-500'
                        }`}
                      >
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes Field */}
              <div className="pt-3 border-t border-stone-100">
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Catatan Temuan & Analisis {tag}:
                </label>
                <textarea
                  rows={3}
                  value={data.notes}
                  onChange={(e) =>
                    onUpdateTriangulationNote(key, e.target.value)
                  }
                  placeholder={`Tuliskan rangkuman temuan dari ${data.name.toLowerCase()}...`}
                  className="w-full p-2.5 text-xs rounded-lg border border-stone-200 bg-stone-50/50 text-stone-800 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Cross-Validation Synthesis */}
      <div className="bg-stone-900 text-white rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white mb-1">
            Siap untuk Rencana Tindak Lanjut (RTL)?
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed max-w-2xl">
            Hasil triangulasi dokumen, observasi, wawancara, dan angket telah siap disintesiskan ke dalam Format Ringkasan Hasil Halaman 5 (Temuan Kekuatan, Temuan Kelemahan, Rekomendasi, PJ, dan Waktu).
          </p>
        </div>

        <button
          onClick={onNavigateToPdca}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0"
        >
          Buka Matriks Ringkasan & RTL (Hal. 5) →
        </button>
      </div>
    </div>
  );
};
