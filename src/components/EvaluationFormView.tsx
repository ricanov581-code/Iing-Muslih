import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  Heart,
  HelpCircle,
  Info,
  Sparkles,
  Tag,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { Dimension, EvaluationData, Indicator } from '../types/kbc';
import { KBC_DIMENSIONS } from '../data/kbcFramework';
import { calculateDimensionStats } from '../utils/evaluationCalculations';

interface EvaluationFormViewProps {
  evaluation: EvaluationData;
  initialDimensionId?: number;
  onUpdateScore: (indicatorId: string, score: number) => void;
  onUpdateIndicatorNote: (indicatorId: string, note: string) => void;
  onNavigateToPdca: () => void;
}

export const EvaluationFormView: React.FC<EvaluationFormViewProps> = ({
  evaluation,
  initialDimensionId = 1,
  onUpdateScore,
  onUpdateIndicatorNote,
  onNavigateToPdca,
}) => {
  const [selectedDimensionId, setSelectedDimensionId] =
    useState<number>(initialDimensionId);

  const currentDimension =
    KBC_DIMENSIONS.find((d) => d.id === selectedDimensionId) ||
    KBC_DIMENSIONS[0];

  const currentStats = calculateDimensionStats(
    currentDimension,
    evaluation.scores
  );

  const handlePrev = () => {
    if (selectedDimensionId > 1) {
      setSelectedDimensionId(selectedDimensionId - 1);
    }
  };

  const handleNext = () => {
    if (selectedDimensionId < KBC_DIMENSIONS.length) {
      setSelectedDimensionId(selectedDimensionId + 1);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header & Dimension Selection Tabs */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <span>Instrumen Asesmen 8 Dimensi</span>
              <span>·</span>
              <span className="text-stone-500">Skor Rubrik 1 sampai 4</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
              {currentDimension.id}. {currentDimension.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-stone-500 block">Capaian Dimensi</span>
              <span className="text-lg font-bold text-stone-900 tabular-nums">
                {currentStats.averageScore} <span className="text-xs font-normal text-stone-500">/ 4.00</span>
                {' · '}
                <span className="text-emerald-700">{currentStats.percentage}%</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
              {currentDimension.code.replace('DIM-', 'D')}
            </div>
          </div>
        </div>

        {/* 8 Dimension Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 p-1 bg-stone-100 rounded-xl">
          {KBC_DIMENSIONS.map((dim) => {
            const stats = calculateDimensionStats(dim, evaluation.scores);
            const isSelected = dim.id === selectedDimensionId;
            const isCompleted = stats.completedCount === stats.indicatorCount;

            return (
              <button
                key={dim.id}
                onClick={() => setSelectedDimensionId(dim.id)}
                className={`flex flex-col items-start p-2 rounded-lg text-left transition-all ${
                  isSelected
                    ? 'bg-white text-stone-900 shadow-xs ring-1 ring-stone-900/10'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[10px] font-bold text-stone-500">
                    D{dim.id}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <span className="text-[10px] text-stone-400 font-mono">
                      {stats.completedCount}/{stats.indicatorCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold line-clamp-1 w-full">
                  {dim.name}
                </span>
                <span className="text-[10px] text-stone-400 font-mono mt-0.5">
                  {stats.percentage}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dimension Context Card (Stage, Description, Evidence) */}
      <div className="bg-emerald-50/60 rounded-xl border border-emerald-100 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-800 text-white rounded text-[10px] font-bold uppercase tracking-wider">
              Tahap {currentDimension.stage}
            </span>
            <span className="text-xs text-emerald-950 font-medium">
              {currentDimension.description}
            </span>
          </div>
          <p className="text-xs text-stone-700">
            <strong>Bukti Dokumen & Temuan Lapangan:</strong>{' '}
            <span className="text-stone-800">{currentDimension.evidenceSummary}</span>
          </p>
        </div>

        <div className="shrink-0 text-xs text-emerald-900 bg-white/80 backdrop-blur-xs px-3 py-2 rounded-lg border border-emerald-200/80">
          <span className="font-semibold block">Skala Rubrik:</span>
          <span className="text-[11px] text-stone-600">
            1 = Belum · 2 = Mulai · 3 = Berkembang · 4 = Membudaya
          </span>
        </div>
      </div>

      {/* List of Indicators for Current Dimension */}
      <div className="space-y-6">
        {currentDimension.indicators.map((ind, indIdx) => {
          const currentScore = evaluation.scores[ind.id] || 0;
          const currentNote = evaluation.indicatorNotes[ind.id] || '';

          return (
            <div
              key={ind.id}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:border-stone-300 transition-colors"
            >
              {/* Indicator Header */}
              <div className="p-4 sm:p-5 border-b border-stone-100 bg-stone-50/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-stone-200 text-stone-800 font-mono text-xs font-bold rounded">
                      {ind.code}
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-stone-900">
                      {ind.title}
                    </h2>
                  </div>

                  {/* Panca Cinta Tags */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {ind.pancaCinta.map((pc) => (
                      <span
                        key={pc}
                        className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100"
                      >
                        {pc}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed mb-2">
                  {ind.description}
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                  <FileCheck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>
                    Contoh Bukti:{' '}
                    <strong className="text-stone-700">
                      {ind.evidenceExamples.join(' · ')}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Rubric Score Choices (1, 2, 3, 4) */}
              <div className="p-4 sm:p-5">
                <p className="text-xs font-semibold text-stone-700 uppercase tracking-wide mb-3">
                  Pilih Tingkat Ketercapaian (Rubrik Skor 1–4):
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      score: 1,
                      label: '1 (Belum)',
                      bgHover: 'hover:border-rose-300 hover:bg-rose-50/30',
                      bgActive: 'border-rose-500 bg-rose-50/60 text-rose-950',
                      badge: 'bg-rose-100 text-rose-800',
                    },
                    {
                      score: 2,
                      label: '2 (Mulai)',
                      bgHover: 'hover:border-amber-300 hover:bg-amber-50/30',
                      bgActive: 'border-amber-500 bg-amber-50/60 text-amber-950',
                      badge: 'bg-amber-100 text-amber-800',
                    },
                    {
                      score: 3,
                      label: '3 (Berkembang)',
                      bgHover: 'hover:border-sky-300 hover:bg-sky-50/30',
                      bgActive: 'border-sky-500 bg-sky-50/60 text-sky-950',
                      badge: 'bg-sky-100 text-sky-800',
                    },
                    {
                      score: 4,
                      label: '4 (Membudaya)',
                      bgHover: 'hover:border-emerald-300 hover:bg-emerald-50/30',
                      bgActive: 'border-emerald-600 bg-emerald-50/60 text-emerald-950',
                      badge: 'bg-emerald-100 text-emerald-800',
                    },
                  ].map((rubricOption) => {
                    const isSelected = currentScore === rubricOption.score;
                    const descriptorText =
                      ind.descriptors[rubricOption.score as 1 | 2 | 3 | 4];

                    return (
                      <button
                        key={rubricOption.score}
                        type="button"
                        onClick={() => onUpdateScore(ind.id, rubricOption.score)}
                        className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? `${rubricOption.bgActive} ring-2 ring-stone-900/10 shadow-xs font-medium`
                            : `border-stone-200 bg-white ${rubricOption.bgHover}`
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded ${rubricOption.badge}`}
                            >
                              Skor {rubricOption.label}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            )}
                          </div>
                          <p className="text-xs text-stone-700 leading-relaxed">
                            {descriptorText}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Evidence Note for this indicator */}
                <div className="mt-4 pt-4 border-t border-stone-100">
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    Catatan Temuan Lapangan / Bukti Khusus untuk Indikator {ind.code}:
                  </label>
                  <input
                    type="text"
                    value={currentNote}
                    onChange={(e) =>
                      onUpdateIndicatorNote(ind.id, e.target.value)
                    }
                    placeholder="Contoh: Dokumen KOSP hal 14 mencantumkan 5 nilai cinta; SK No 12/2026 telah ditandatangani..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-stone-50/40 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation Deck */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={selectedDimensionId === 1}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Dimensi Sebelumnya</span>
        </button>

        <div className="text-center text-xs text-stone-500">
          Dimensi {selectedDimensionId} dari {KBC_DIMENSIONS.length} · Selesai:{' '}
          <strong className="text-stone-900">
            {currentStats.completedCount}/{currentStats.indicatorCount} Indikator
          </strong>
        </div>

        <div className="flex items-center gap-2">
          {selectedDimensionId < KBC_DIMENSIONS.length ? (
            <button
              onClick={handleNext}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <span>Dimensi Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onNavigateToPdca}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Lanjut ke Format Ringkasan & RTL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
