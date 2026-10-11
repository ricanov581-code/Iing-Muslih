import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Printer,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  Calendar,
  User,
  ArrowRight,
  Info,
} from 'lucide-react';
import { DimensionFinding, EvaluationData } from '../types/kbc';
import { KBC_DIMENSIONS } from '../data/kbcFramework';
import {
  calculateDimensionStats,
  generateSuggestedRecommendations,
} from '../utils/evaluationCalculations';

interface PdcaAndRtlViewProps {
  evaluation: EvaluationData;
  onUpdateFinding: (dimensionId: number, finding: Partial<DimensionFinding>) => void;
  onUpdatePdca: (key: 'plan' | 'do' | 'check' | 'act', value: string) => void;
  onNavigateToPrint: () => void;
}

export const PdcaAndRtlView: React.FC<PdcaAndRtlViewProps> = ({
  evaluation,
  onUpdateFinding,
  onUpdatePdca,
  onNavigateToPrint,
}) => {
  const [editingDimId, setEditingDimId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<DimensionFinding | null>(null);

  const startEdit = (dimId: number) => {
    const current = evaluation.findings[dimId] || {
      scoreAverage: 0,
      strengths: '',
      weaknesses: '',
      recommendation: '',
      pic: '',
      timeline: '',
    };
    setEditingDimId(dimId);
    setEditFormData({ ...current });
  };

  const saveEdit = (dimId: number) => {
    if (editFormData) {
      onUpdateFinding(dimId, editFormData);
    }
    setEditingDimId(null);
    setEditFormData(null);
  };

  const handleAutoSuggest = (dimId: number) => {
    const dim = KBC_DIMENSIONS.find((d) => d.id === dimId);
    if (!dim) return;

    const suggested = generateSuggestedRecommendations(dim, evaluation.scores);
    const existing = evaluation.findings[dimId] || {
      scoreAverage: 0,
      strengths: '',
      weaknesses: '',
      recommendation: '',
      pic: 'Tim Pengembang KBC',
      timeline: 'Semester Ini',
    };

    onUpdateFinding(dimId, {
      strengths: suggested.strengths,
      weaknesses: suggested.weaknesses,
      recommendation: suggested.recommendation,
      pic: existing.pic || 'Tim Pengembang KBC',
      timeline: existing.timeline || 'Semester Berjalan',
    });
  };

  const handleAutoSuggestAll = () => {
    KBC_DIMENSIONS.forEach((dim) => {
      handleAutoSuggest(dim.id);
    });
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <span>Bagian F Kerangka Evaluasi</span>
              <span>·</span>
              <span className="text-stone-500">Hal. 5 PDF</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
              Format Ringkasan Hasil & Rencana Tindak Lanjut (RTL)
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-3xl mt-1 leading-relaxed">
              Tabel resmi hasil evaluasi setiap dimensi mencakup <strong>Skor</strong>, <strong>Temuan Kekuatan</strong>, <strong>Temuan Kelemahan</strong>, <strong>Rekomendasi</strong>, <strong>Penanggung Jawab (PJ)</strong>, dan <strong>Target Waktu</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleAutoSuggestAll}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
              title="Buat draf rekomendasi otomatis berbasis skor indikator"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Auto-Rekomendasi Skor</span>
            </button>
            <button
              onClick={onNavigateToPrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Pratinjau Cetak Resmi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Table: Format Ringkasan Hasil (PDF Page 5) */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs uppercase tracking-wider text-stone-700">
              Matriks Ringkasan Evaluasi 8 Dimensi
            </span>
            <span className="text-xs text-stone-400">·</span>
            <span className="text-xs text-stone-500">
              Sinkronisasi Otomatis dengan Rubrik Asesmen
            </span>
          </div>
          <span className="text-[11px] text-stone-500">
            Klik tombol ubah pada baris untuk mengedit catatan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-800">
            <thead className="bg-stone-100 text-[11px] font-bold text-stone-700 uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 w-48">Dimensi</th>
                <th className="py-3 px-3 w-20 text-center">Skor</th>
                <th className="py-3 px-4 min-w-[180px]">Temuan Kekuatan</th>
                <th className="py-3 px-4 min-w-[180px]">Temuan Kelemahan</th>
                <th className="py-3 px-4 min-w-[200px]">Rekomendasi</th>
                <th className="py-3 px-3 w-28">PJ</th>
                <th className="py-3 px-3 w-28">Waktu</th>
                <th className="py-3 px-3 w-20 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {KBC_DIMENSIONS.map((dim) => {
                const stats = calculateDimensionStats(dim, evaluation.scores);
                const finding = evaluation.findings[dim.id] || {
                  scoreAverage: stats.averageScore,
                  strengths: '-',
                  weaknesses: '-',
                  recommendation: '-',
                  pic: 'Tim KBC',
                  timeline: 'Semester Ini',
                };

                const isEditing = editingDimId === dim.id;

                return (
                  <tr
                    key={dim.id}
                    className={`hover:bg-stone-50/60 transition-colors ${
                      isEditing ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center font-bold text-stone-500">
                      {dim.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-stone-900">
                      <div>{dim.name}</div>
                      <span className="text-[10px] text-stone-400 font-normal">
                        Tahap {dim.stage} · {stats.indicatorCount} Indikator
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-block px-2 py-1 rounded bg-stone-100 font-bold font-mono text-stone-900 text-xs">
                        {stats.averageScore.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-stone-400 mt-0.5 font-mono">
                        {stats.percentage}%
                      </div>
                    </td>

                    {/* Strengths */}
                    <td className="py-3.5 px-4 text-stone-700 leading-relaxed">
                      {isEditing && editFormData ? (
                        <textarea
                          rows={3}
                          value={editFormData.strengths}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              strengths: e.target.value,
                            })
                          }
                          className="w-full p-1.5 text-xs rounded border border-stone-300 bg-white"
                        />
                      ) : (
                        <div className="line-clamp-4">{finding.strengths}</div>
                      )}
                    </td>

                    {/* Weaknesses */}
                    <td className="py-3.5 px-4 text-stone-700 leading-relaxed">
                      {isEditing && editFormData ? (
                        <textarea
                          rows={3}
                          value={editFormData.weaknesses}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              weaknesses: e.target.value,
                            })
                          }
                          className="w-full p-1.5 text-xs rounded border border-stone-300 bg-white"
                        />
                      ) : (
                        <div className="line-clamp-4">{finding.weaknesses}</div>
                      )}
                    </td>

                    {/* Recommendations */}
                    <td className="py-3.5 px-4 text-stone-800 leading-relaxed">
                      {isEditing && editFormData ? (
                        <textarea
                          rows={3}
                          value={editFormData.recommendation}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              recommendation: e.target.value,
                            })
                          }
                          className="w-full p-1.5 text-xs rounded border border-stone-300 bg-white font-medium"
                        />
                      ) : (
                        <div className="line-clamp-4 font-medium">
                          {finding.recommendation}
                        </div>
                      )}
                    </td>

                    {/* PIC */}
                    <td className="py-3.5 px-3 text-stone-700 font-medium">
                      {isEditing && editFormData ? (
                        <input
                          type="text"
                          value={editFormData.pic}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              pic: e.target.value,
                            })
                          }
                          className="w-full p-1 text-xs rounded border border-stone-300 bg-white"
                        />
                      ) : (
                        finding.pic
                      )}
                    </td>

                    {/* Timeline */}
                    <td className="py-3.5 px-3 text-stone-600">
                      {isEditing && editFormData ? (
                        <input
                          type="text"
                          value={editFormData.timeline}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              timeline: e.target.value,
                            })
                          }
                          className="w-full p-1 text-xs rounded border border-stone-300 bg-white"
                        />
                      ) : (
                        finding.timeline
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-3 text-center">
                      {isEditing ? (
                        <button
                          onClick={() => saveEdit(dim.id)}
                          className="p-1.5 rounded-md bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
                          title="Simpan Perubahan"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(dim.id)}
                          className="p-1.5 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
                          title="Ubah Rencana Tindak Lanjut"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Siklus Perbaikan Berkelanjutan (PDCA) Section E */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <span>Bagian E Kerangka Evaluasi</span>
              <span>·</span>
              <span className="text-stone-500">Hal. 4 PDF</span>
            </div>
            <h2 className="text-lg font-bold text-stone-900">
              Siklus Perbaikan Berkelanjutan (Plan-Do-Check-Act)
            </h2>
            <p className="text-xs text-stone-600">
              Evaluasi dijalankan setiap semester dengan siklus PDCA berulang untuk menjaga mutu berkelanjutan di RA Asy Syifa.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {/* Plan */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                  Plan (Perencanaan)
                </h3>
              </div>
              <p className="text-[11px] text-blue-900/80 mb-3">
                Tetapkan target mutu dan indikator ketercapaian per semester.
              </p>
              <textarea
                rows={4}
                value={evaluation.pdca.plan}
                onChange={(e) => onUpdatePdca('plan', e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-blue-200 bg-white text-stone-800 focus:outline-none focus:border-blue-600 transition-colors"
                placeholder="Rencana target semester..."
              />
            </div>
          </div>

          {/* Do */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Do (Pelaksanaan)
                </h3>
              </div>
              <p className="text-[11px] text-emerald-900/80 mb-3">
                Laksanakan seluruh program KBC di kelas dan lingkungan.
              </p>
              <textarea
                rows={4}
                value={evaluation.pdca.do}
                onChange={(e) => onUpdatePdca('do', e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-emerald-200 bg-white text-stone-800 focus:outline-none focus:border-emerald-600 transition-colors"
                placeholder="Pelaksanaan program KBC..."
              />
            </div>
          </div>

          {/* Check */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  Check (Evaluasi)
                </h3>
              </div>
              <p className="text-[11px] text-amber-900/80 mb-3">
                Evaluasi tiap semester memakai kerangka instrumen ini.
              </p>
              <textarea
                rows={4}
                value={evaluation.pdca.check}
                onChange={(e) => onUpdatePdca('check', e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-amber-200 bg-white text-stone-800 focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="Evaluasi kerangka KBC..."
              />
            </div>
          </div>

          {/* Act */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <h3 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                  Act (Tindak Lanjut)
                </h3>
              </div>
              <p className="text-[11px] text-purple-900/80 mb-3">
                Susun RTL, tetapkan prioritas perbaikan, lalu ulangi siklus.
              </p>
              <textarea
                rows={4}
                value={evaluation.pdca.act}
                onChange={(e) => onUpdatePdca('act', e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-purple-200 bg-white text-stone-800 focus:outline-none focus:border-purple-600 transition-colors"
                placeholder="Rencana tindak lanjut & prioritas..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
