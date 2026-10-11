import React from 'react';
import {
  Heart,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  School,
  Calendar,
  UserCheck,
  ChevronRight,
  BookOpen,
  Leaf,
  Users,
  Flag,
} from 'lucide-react';
import { EvaluationData } from '../types/kbc';
import { KopSurat } from './KopSurat';
import { KBC_DIMENSIONS, MAX_POSSIBLE_SCORE } from '../data/kbcFramework';
import {
  calculateTotalScore,
  calculatePercentage,
  getScoreCategory,
  calculateDimensionStats,
  calculatePancaCintaStats,
  calculatePipelineStats,
} from '../utils/evaluationCalculations';

interface DashboardViewProps {
  evaluation: EvaluationData;
  onNavigateToRubric: (dimensionId?: number) => void;
  onNavigateToTriangulation: () => void;
  onNavigateToPdca: () => void;
  onNavigateToPrint: () => void;
  onUpdateEvaluationMeta: (meta: Partial<EvaluationData>) => void;
  logoRa?: string;
  logoYp3i?: string;
  onOpenLogoManager?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  evaluation,
  onNavigateToRubric,
  onNavigateToTriangulation,
  onNavigateToPdca,
  onNavigateToPrint,
  onUpdateEvaluationMeta,
  logoRa = 'https://infofast.com',
  logoYp3i = 'https://infofast.com',
  onOpenLogoManager,
}) => {
  const totalScore = calculateTotalScore(evaluation.scores);
  const percentage = calculatePercentage(evaluation.scores);
  const category = getScoreCategory(percentage);

  const dimensionStats = KBC_DIMENSIONS.map((dim) =>
    calculateDimensionStats(dim, evaluation.scores)
  );

  const pancaCintaStats = calculatePancaCintaStats(evaluation.scores);
  const pipelineStats = calculatePipelineStats(evaluation.scores);

  // Identify top strength and top improvement need
  const sortedByPercentage = [...dimensionStats].sort(
    (a, b) => b.percentage - a.percentage
  );
  const topStrength = sortedByPercentage[0];
  const priorityDimension = sortedByPercentage[sortedByPercentage.length - 1];

  const getPancaCintaIcon = (shortName: string) => {
    switch (shortName) {
      case 'Allah & Rasul':
        return <Heart className="w-4 h-4 text-emerald-700" />;
      case 'Ilmu':
        return <BookOpen className="w-4 h-4 text-sky-700" />;
      case 'Lingkungan':
        return <Leaf className="w-4 h-4 text-green-700" />;
      case 'Diri & Sesama':
        return <Users className="w-4 h-4 text-amber-700" />;
      case 'Tanah Air':
        return <Flag className="w-4 h-4 text-rose-700" />;
      default:
        return <Heart className="w-4 h-4 text-emerald-700" />;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Official Header Component: Kop Surat Resmi Yayasan & RA Asy Syifa */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 text-[11px] text-stone-500">
          <span className="flex items-center gap-1.5 font-medium text-stone-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Kop Surat Resmi RA Asy Syifa & YP3I (Tinggi 75px Sejajar Simetris)
          </span>
          {onOpenLogoManager && (
            <button
              onClick={onOpenLogoManager}
              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold rounded-lg text-[11px] transition-colors cursor-pointer"
            >
              <span>Unggah / Pilih Berkas RA Trans.png</span>
            </button>
          )}
        </div>
        <KopSurat
          logoYp3i={logoYp3i}
          logoRa={logoRa}
          onOpenLogoManager={onOpenLogoManager}
          marginBottomClass="mb-0"
        />
      </div>

      {/* Hero Banner with Authentic Visual and Document Context */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 shadow-sm">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/hero_kbc_asy_syifa_1791694048390.jpg"
            alt="Pojok Belajar RA Asy Syifa Kurikulum Berbasis Cinta"
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/80 to-stone-900/40" />
        </div>

        <div className="relative px-6 py-8 sm:px-10 sm:py-10 max-w-4xl text-white">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onOpenLogoManager}
              className="group focus:outline-none cursor-pointer"
              title="Klik untuk melihat atau mengunggah logo asli"
            >
              <img
                src={logoRa && !logoRa.includes('logo_ra_asli') ? logoRa : 'https://infofast.com'}
                alt="Logo Resmi RA Asy Syifa"
                className="w-12 h-12 object-contain bg-white/90 rounded-xl p-1 shadow-xs group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            </button>
            <div>
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                <span>RA Asy Syifa</span>
                <span>·</span>
                <span>Kurikulum Berbasis Cinta (KBC) Kemenag</span>
              </div>
              <span className="text-[11px] text-stone-300">
                Penilai: Iing Muslih, S.Ag (Sekretaris YP3I) · Kepala RA: Jenab, S.Ag · Ketua Tim: Neng Kurniasih
              </span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3 text-balance">
            Kerangka Evaluasi Implementasi Kurikulum Berbasis Cinta (KBC)
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
            Memastikan bahwa nilai-nilai cinta benar-benar dijalankan dalam keseharian madrasah, bukan hanya tertulis di dokumen. Berlandaskan <strong>Panca Cinta</strong> dengan pendekatan sistemik <strong>Input - Proses - Output - Dampak</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateToRubric(1)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors shadow-sm"
            >
              <span>Mulai Asesmen 8 Dimensi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateToPdca}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium text-xs sm:text-sm rounded-lg transition-colors"
            >
              <TrendingUp className="w-4 h-4 text-amber-300" />
              <span>Lihat Format Ringkasan & RTL</span>
            </button>
            <button
              onClick={onNavigateToTriangulation}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium text-xs sm:text-sm rounded-lg transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Verifikasi Triangulasi Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Bar / Assessment Metadata */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogoManager}
              className="group focus:outline-none cursor-pointer shrink-0"
              title="Klik untuk mengunggah logo asli"
            >
              <img
                src={logoRa && !logoRa.includes('logo_ra_asli') ? logoRa : 'https://infofast.com'}
                alt="Logo RA Asy Syifa"
                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            </button>
            <div>
              <p className="text-stone-500 font-medium">Satuan Pendidikan</p>
              <input
                type="text"
                value={evaluation.schoolName}
                onChange={(e) =>
                  onUpdateEvaluationMeta({ schoolName: e.target.value })
                }
                className="font-semibold text-stone-900 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-emerald-600 focus:outline-none w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-stone-500 font-medium">Tahun Ajaran & Semester</p>
              <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                <input
                  type="text"
                  value={evaluation.academicYear}
                  onChange={(e) =>
                    onUpdateEvaluationMeta({ academicYear: e.target.value })
                  }
                  className="w-20 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-emerald-600 focus:outline-none"
                />
                <span>·</span>
                <select
                  value={evaluation.semester}
                  onChange={(e) =>
                    onUpdateEvaluationMeta({
                      semester: e.target.value as any,
                    })
                  }
                  className="bg-transparent border-b border-transparent hover:border-stone-300 focus:border-emerald-600 focus:outline-none cursor-pointer"
                >
                  <option value="Semester Ganjil">Semester Ganjil</option>
                  <option value="Semester Genap">Semester Genap</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-stone-500 font-medium">Penilai / Evaluator</p>
              <input
                type="text"
                value={evaluation.evaluatorName}
                onChange={(e) =>
                  onUpdateEvaluationMeta({ evaluatorName: e.target.value })
                }
                className="font-semibold text-stone-900 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-emerald-600 focus:outline-none w-full"
              />
              <input
                type="text"
                value={evaluation.evaluatorRole}
                onChange={(e) =>
                  onUpdateEvaluationMeta({ evaluatorRole: e.target.value })
                }
                className="text-[11px] text-stone-500 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-emerald-600 focus:outline-none w-full mt-0.5"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-stone-500 font-medium">Tanggal Evaluasi</p>
              <input
                type="date"
                value={evaluation.evaluationDate}
                onChange={(e) =>
                  onUpdateEvaluationMeta({ evaluationDate: e.target.value })
                }
                className="font-semibold text-stone-900 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-emerald-600 focus:outline-none w-full cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Score & Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Score & Interpretation Card */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Indeks Capaian KBC
              </span>
              <span className="text-xs text-stone-400">
                Rubrik Skor 1–4
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight tabular-nums">
                {percentage}%
              </span>
              <span className="text-sm font-semibold text-stone-500 tabular-nums">
                ({totalScore} / {MAX_POSSIBLE_SCORE} Poin)
              </span>
            </div>

            {/* Official Kemenag Status Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold mb-4 ${
                category.tone === 'emerald'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : category.tone === 'teal'
                  ? 'bg-teal-100 text-teal-800 border border-teal-200'
                  : category.tone === 'amber'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-rose-100 text-rose-800 border border-rose-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{category.label}</span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              {category.description}
            </p>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <p className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Rekomendasi Tindak Lanjut
            </p>
            <p className="text-xs text-stone-600 leading-relaxed">
              {category.recommendedAction}
            </p>
          </div>
        </div>

        {/* Pipeline Input - Proses - Output - Dampak */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Pendekatan Sistemik KBC
                </h3>
                <p className="text-xs text-stone-500">
                  Input · Proses · Output · Dampak (Kerangka PDF Hal. 1)
                </p>
              </div>
              <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-1 rounded">
                8 Dimensi Terhubung
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
              {pipelineStats.map((pipe) => (
                <div
                  key={pipe.stage}
                  className="p-3.5 rounded-lg border border-stone-200/80 bg-stone-50/50 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-800">
                      Tahap {pipe.stage}
                    </span>
                    <span className="text-xs font-bold text-stone-900 tabular-nums">
                      {pipe.percentage}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, pipe.percentage)}%`,
                        backgroundColor: pipe.color,
                      }}
                    />
                  </div>

                  <p className="text-[11px] text-stone-500 truncate">
                    {pipe.dimensions.join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <span>
              Dimensi Terbaik:{' '}
              <strong className="text-stone-900">
                {topStrength.name} ({topStrength.percentage}%)
              </strong>
            </span>
            <button
              onClick={() => onNavigateToRubric(priorityDimension.id)}
              className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
            >
              <span>Fokus Perbaikan: {priorityDimension.name}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Panca Cinta Barometer */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Landasan: Panca Cinta Kemenag
            </h2>
            <p className="text-xs text-stone-500">
              Lima nilai cinta acuan seluruh indikator di RA Asy Syifa (Hal. 1 PDF)
            </p>
          </div>
          <span className="text-xs text-stone-500">
            Skor Maksimal per Nilai Cinta
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {pancaCintaStats.map((pc, index) => (
            <div
              key={pc.id}
              className="p-4 rounded-xl border border-stone-200 bg-white hover:border-emerald-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                    {getPancaCintaIcon(pc.shortName)}
                  </div>
                  <span className="text-xs font-bold text-stone-800 line-clamp-1">
                    {index + 1}. {pc.shortName}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xl font-black text-stone-900 tabular-nums">
                    {pc.percentage}%
                  </span>
                  <span className="text-[11px] text-stone-500 tabular-nums">
                    {pc.score}/{pc.maxScore} pts
                  </span>
                </div>

                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, pc.percentage)}%`,
                      backgroundColor: pc.color,
                    }}
                  />
                </div>

                <p className="text-[11px] text-stone-500 line-clamp-3 leading-relaxed">
                  {pc.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-100 text-[10px] text-stone-400">
                {pc.indicatorCount} Indikator terkait
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8 Dimensions Quick Navigation & Status */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Delapan (8) Dimensi Pengukuran KBC
            </h2>
            <p className="text-xs text-stone-500">
              Setiap dimensi dinilai lewat indikator dan dibuktikan dengan dokumen atau temuan lapangan (Hal. 1-3 PDF)
            </p>
          </div>
          <button
            onClick={() => onNavigateToRubric(1)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Buka Seluruh Rubrik</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dimensionStats.map((dim) => {
            const isCompleted = dim.completedCount === dim.indicatorCount;
            return (
              <button
                key={dim.id}
                onClick={() => onNavigateToRubric(dim.id)}
                className="text-left p-4 rounded-xl border border-stone-200 hover:border-emerald-500 hover:shadow-xs transition-all bg-stone-50/40 hover:bg-white group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-stone-500">
                      {dim.code} · {dim.stage}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        dim.percentage >= 85
                          ? 'bg-emerald-100 text-emerald-800'
                          : dim.percentage >= 70
                          ? 'bg-teal-100 text-teal-800'
                          : dim.percentage >= 55
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {dim.percentage}%
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors mb-2 line-clamp-2">
                    {dim.id}. {dim.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-black text-stone-900 tabular-nums">
                      {dim.averageScore}
                    </span>
                    <span className="text-xs text-stone-500">/ 4.00</span>
                    <span className="text-xs text-stone-400">
                      ({dim.totalScore}/{dim.maxScore} pt)
                    </span>
                  </div>

                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full ${
                        dim.percentage >= 85
                          ? 'bg-emerald-600'
                          : dim.percentage >= 70
                          ? 'bg-teal-600'
                          : dim.percentage >= 55
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${dim.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                  <span className="flex items-center gap-1">
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    <span>
                      {dim.completedCount}/{dim.indicatorCount} Terisi
                    </span>
                  </span>
                  <span className="text-emerald-700 font-semibold group-hover:translate-x-0.5 transition-transform">
                    Nilai →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Triangulation & PDCA Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Triangulation Status Card */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-bold text-stone-900">
                  Metode Pengumpulan Data (Triangulasi)
                </h3>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Hal. 4 PDF
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              Data dikumpulkan lewat 4 metode agar temuan saling menguatkan: <strong>Telaah Dokumen</strong>, <strong>Observasi Lapangan</strong>, <strong>Wawancara</strong>, dan <strong>Angket Kepuasan</strong>.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
                <span className="font-medium text-stone-800">1. Telaah Dokumen (KOSP, RPPH, SOP, RKAM)</span>
                <span className="text-emerald-700 font-bold">Terverifikasi</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
                <span className="font-medium text-stone-800">2. Observasi 4 Waktu (Datang, Kelas, Istirahat, Pulang)</span>
                <span className="text-emerald-700 font-bold">Terverifikasi</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
                <span className="font-medium text-stone-800">3. Wawancara (Kepala RA, Guru, Ortu, Anak)</span>
                <span className="text-emerald-700 font-bold">Terverifikasi</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
                <span className="font-medium text-stone-800">4. Angket Kepuasan Orang Tua & Refleksi Guru</span>
                <span className="text-emerald-700 font-bold">Terverifikasi</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100 flex justify-end">
            <button
              onClick={onNavigateToTriangulation}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Detail Catatan Triangulasi</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* PDCA Continuous Improvement Cycle */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-700" />
                <h3 className="text-sm font-bold text-stone-900">
                  Siklus Perbaikan Berkelanjutan (PDCA)
                </h3>
              </div>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Hal. 4 & 5 PDF
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              Evaluasi dijalankan setiap semester dengan siklus Plan-Do-Check-Act. Temuan kelemahan langsung dihubungkan ke Rencana Tindak Lanjut (RTL).
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
                <span className="font-bold text-blue-900 block mb-1">1. Plan</span>
                <p className="text-[11px] text-blue-800 line-clamp-2">
                  {evaluation.pdca.plan}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                <span className="font-bold text-emerald-900 block mb-1">2. Do</span>
                <p className="text-[11px] text-emerald-800 line-clamp-2">
                  {evaluation.pdca.do}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100">
                <span className="font-bold text-amber-900 block mb-1">3. Check</span>
                <p className="text-[11px] text-amber-800 line-clamp-2">
                  {evaluation.pdca.check}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-purple-50/60 border border-purple-100">
                <span className="font-bold text-purple-900 block mb-1">4. Act</span>
                <p className="text-[11px] text-purple-800 line-clamp-2">
                  {evaluation.pdca.act}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100 flex justify-end">
            <button
              onClick={onNavigateToPdca}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>Matriks Ringkasan & RTL Halaman 5</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
