import React, { useState } from 'react';
import {
  Printer,
  ArrowLeft,
  Heart,
  Download,
  Loader2,
  ExternalLink,
  FileCheck2,
  Check,
} from 'lucide-react';
import { EvaluationData } from '../types/kbc';
import { KBC_DIMENSIONS, MAX_POSSIBLE_SCORE } from '../data/kbcFramework';
import {
  calculateDimensionStats,
  calculatePercentage,
  calculateTotalScore,
  getScoreCategory,
} from '../utils/evaluationCalculations';
import { exportKbcToPdf, openStandalonePrintPage } from '../utils/pdfGenerator';
import { LogoConfig } from '../utils/logoStorage';
import { KopSurat } from './KopSurat';
import { Image as ImageIcon, ShieldCheck } from 'lucide-react';

interface PrintReportViewProps {
  evaluation: EvaluationData;
  onBack: () => void;
  logoConfig: LogoConfig;
  onOpenLogoManager: () => void;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  evaluation,
  onBack,
  logoConfig,
  onOpenLogoManager,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const totalScore = calculateTotalScore(evaluation.scores);
  const percentage = calculatePercentage(evaluation.scores);
  const category = getScoreCategory(percentage);
  const dimensionStats = KBC_DIMENSIONS.map((dim) =>
    calculateDimensionStats(dim, evaluation.scores)
  );

  const handleDownloadPdf = () => {
    setIsExporting(true);
    try {
      exportKbcToPdf(evaluation, logoConfig);
      setSuccessToast('Berkas PDF resmi berhasil diunduh!');
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err) {
      console.error('Gagal membuat PDF:', err);
      // Fallback: buka halaman cetak mandiri
      openStandalonePrintPage(evaluation, logoConfig);
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenPrintPage = () => {
    openStandalonePrintPage(evaluation, logoConfig);
    setSuccessToast('Membuka dokumen cetak di tab baru...');
    setTimeout(() => setSuccessToast(null), 3500);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Action Control Bar */}
      <div className="print:hidden bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors self-start md:self-auto cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dasbor</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          {successToast && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successToast}</span>
            </span>
          )}

          {/* Tombol Pengaturan Logo Asli */}
          <button
            onClick={onOpenLogoManager}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            title="Unggah berkas logo asli tanpa modifikasi"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>
              {logoConfig.isCustomRa || logoConfig.isCustomYp3i
                ? 'Kelola Logo Asli (Aktif)'
                : 'Unggah Logo Asli Anda'}
            </span>
          </button>

          {/* Primary Action: Direct Download PDF via jsPDF Vector Engine */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyiapkan PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-emerald-200" />
                <span>Unduh File PDF (.pdf)</span>
              </>
            )}
          </button>

          {/* Secondary Action: Open Clean Printable Page in New Tab */}
          <button
            onClick={handleOpenPrintPage}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            title="Buka dokumen cetak di tab baru bebas hambatan iframe"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>Cetak / Pratinjau Tab Baru</span>
          </button>
        </div>
      </div>

      {/* Helper Guidance Banner */}
      <div className="print:hidden bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 px-4 text-xs text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            Kop surat menggunakan logo asli Anda tanpa modifikasi AI. Klik <strong>"Unggah Logo Asli Anda"</strong> jika ingin memperbarui berkas <em>RA Trans.png</em> atau Logo Yayasan langsung dari perangkat.
          </span>
        </div>
        <span className="text-[11px] text-emerald-700 font-medium shrink-0">
          Standar Kementerian Agama RI
        </span>
      </div>

      {/* Official Paper Document Area */}
      <div
        id="printable-report"
        className="bg-white border border-stone-300 rounded-xl p-3.5 sm:p-8 md:p-12 print:p-0 print:border-none shadow-sm max-w-5xl mx-auto print:max-w-none text-stone-900 font-sans"
      >
        {/* Kop Surat Resmi Yayasan & RA Asy Syifa - Presisi & Simetris di Mobile, Tablet & Desktop */}
        <KopSurat
          logoYp3i={logoConfig.logoYp3i}
          logoRa={logoConfig.logoRa}
          onOpenLogoManager={onOpenLogoManager}
          marginBottomClass="mb-4 sm:mb-6 md:mb-8"
        />

        {/* Judul Dokumen */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-bold text-stone-900 uppercase underline tracking-wide">
            LAPORAN EVALUASI IMPLEMENTASI KURIKULUM BERBASIS CINTA (KBC)
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Berdasarkan Kerangka Kerja Input - Proses - Output - Dampak dan Landasan Panca Cinta Kemenag
          </p>
        </div>

        {/* Identitas Evaluasi */}
        <div className="grid grid-cols-2 gap-4 text-xs mb-8 bg-stone-50 p-4 rounded-lg border border-stone-200 print:bg-transparent print:border-stone-400">
          <div>
            <table className="w-full text-left">
              <tbody>
                <tr>
                  <td className="py-1 font-semibold text-stone-600 w-36">Satuan Pendidikan</td>
                  <td className="py-1 text-stone-900 font-bold">: {evaluation.schoolName}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold text-stone-600">Tahun Ajaran</td>
                  <td className="py-1 text-stone-900">: {evaluation.academicYear}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold text-stone-600">Semester</td>
                  <td className="py-1 text-stone-900">: {evaluation.semester}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <table className="w-full text-left">
              <tbody>
                <tr>
                  <td className="py-1 font-semibold text-stone-600 w-36">Penilai / Evaluator</td>
                  <td className="py-1 text-stone-900 font-bold">: {evaluation.evaluatorName}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold text-stone-600">Jabatan Penilai</td>
                  <td className="py-1 text-stone-900">: {evaluation.evaluatorRole}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold text-stone-600">Tanggal Asesmen</td>
                  <td className="py-1 text-stone-900">: {evaluation.evaluationDate}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Rekapitulasi Nilai & Interpretasi */}
        <div className="mb-8 border border-stone-200 rounded-lg p-5 print:border-stone-400">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
            I. Rekapitulasi Capaian & Interpretasi Skor Total
          </h3>

          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div className="p-3 bg-stone-50 rounded border border-stone-200 print:border-stone-300">
              <span className="text-[11px] text-stone-500 block">Total Skor Perolehan</span>
              <span className="text-2xl font-black text-stone-900 font-mono">
                {totalScore} <span className="text-xs text-stone-500 font-normal">/ {MAX_POSSIBLE_SCORE}</span>
              </span>
            </div>
            <div className="p-3 bg-stone-50 rounded border border-stone-200 print:border-stone-300">
              <span className="text-[11px] text-stone-500 block">Persentase Ketercapaian</span>
              <span className="text-2xl font-black text-emerald-800 font-mono">
                {percentage}%
              </span>
            </div>
            <div className="p-3 bg-stone-50 rounded border border-stone-200 print:border-stone-300">
              <span className="text-[11px] text-stone-500 block">Kategori Status Mutu</span>
              <span className="text-sm font-bold text-stone-900 mt-1 block">
                {category.label}
              </span>
            </div>
          </div>

          <div className="text-xs text-stone-700 bg-emerald-50/50 p-3 rounded border border-emerald-100 print:border-stone-300">
            <strong>Deskripsi Mutu:</strong> {category.description}
            <br />
            <strong>Rekomendasi Kebijakan:</strong> {category.recommendedAction}
          </div>
        </div>

        {/* Tabel 8 Dimensi */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
            II. Capaian Per Dimensi Pengukuran
          </h3>

          <table className="w-full text-left text-xs border border-stone-300">
            <thead className="bg-stone-100 font-bold text-stone-800 border-b border-stone-300">
              <tr>
                <th className="p-2 border-r border-stone-300 w-10 text-center">No</th>
                <th className="p-2 border-r border-stone-300">Dimensi Pengukuran</th>
                <th className="p-2 border-r border-stone-300 w-20 text-center">Tahap</th>
                <th className="p-2 border-r border-stone-300 w-24 text-center">Skor (Maks)</th>
                <th className="p-2 border-r border-stone-300 w-24 text-center">Rata-rata</th>
                <th className="p-2 border-r border-stone-300 w-20 text-center">% Capaian</th>
                <th className="p-2 w-44">Kategori</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {dimensionStats.map((dim) => (
                <tr key={dim.id}>
                  <td className="p-2 border-r border-stone-300 text-center font-bold">{dim.id}</td>
                  <td className="p-2 border-r border-stone-300 font-semibold text-stone-900">{dim.name}</td>
                  <td className="p-2 border-r border-stone-300 text-center text-stone-600">{dim.stage}</td>
                  <td className="p-2 border-r border-stone-300 text-center font-mono">{dim.totalScore} / {dim.maxScore}</td>
                  <td className="p-2 border-r border-stone-300 text-center font-mono font-bold">{dim.averageScore.toFixed(2)}</td>
                  <td className="p-2 border-r border-stone-300 text-center font-mono font-bold text-emerald-800">{dim.percentage}%</td>
                  <td className="p-2 text-stone-700 text-[11px]">{dim.statusCategory.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tabel Halaman 5 PDF: Format Ringkasan Hasil & RTL */}
        <div className="mb-10 page-break-before">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
            III. Format Ringkasan Hasil & Rencana Tindak Lanjut (PDF Hal. 5)
          </h3>

          <table className="w-full text-left text-xs border border-stone-300">
            <thead className="bg-stone-100 font-bold text-stone-800 border-b border-stone-300">
              <tr>
                <th className="p-2 border-r border-stone-300 w-8 text-center">No</th>
                <th className="p-2 border-r border-stone-300 w-36">Dimensi</th>
                <th className="p-2 border-r border-stone-300 w-16 text-center">Skor</th>
                <th className="p-2 border-r border-stone-300">Temuan Kekuatan</th>
                <th className="p-2 border-r border-stone-300">Temuan Kelemahan</th>
                <th className="p-2 border-r border-stone-300">Rekomendasi</th>
                <th className="p-2 border-r border-stone-300 w-24">PJ</th>
                <th className="p-2 w-24">Waktu</th>
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

                return (
                  <tr key={dim.id}>
                    <td className="p-2 border-r border-stone-300 text-center font-bold">{dim.id}</td>
                    <td className="p-2 border-r border-stone-300 font-semibold">{dim.name}</td>
                    <td className="p-2 border-r border-stone-300 text-center font-mono font-bold">{stats.averageScore.toFixed(2)}</td>
                    <td className="p-2 border-r border-stone-300 text-stone-700 leading-tight">{finding.strengths}</td>
                    <td className="p-2 border-r border-stone-300 text-stone-700 leading-tight">{finding.weaknesses}</td>
                    <td className="p-2 border-r border-stone-300 text-stone-900 font-medium leading-tight">{finding.recommendation}</td>
                    <td className="p-2 border-r border-stone-300 text-stone-700">{finding.pic}</td>
                    <td className="p-2 text-stone-700">{finding.timeline}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Ringkasan Triangulasi */}
        <div className="mb-10 text-xs">
          <h3 className="font-bold text-stone-900 uppercase tracking-wider mb-2">
            IV. Catatan Triangulasi Data (4 Metode)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 bg-stone-50 border border-stone-200 rounded print:border-stone-300">
              <span className="font-bold text-stone-900 block mb-1">1. Telaah Dokumen</span>
              <p className="text-stone-600">{evaluation.triangulation.documentReview.notes}</p>
            </div>
            <div className="p-2.5 bg-stone-50 border border-stone-200 rounded print:border-stone-300">
              <span className="font-bold text-stone-900 block mb-1">2. Observasi Lapangan</span>
              <p className="text-stone-600">{evaluation.triangulation.observation.notes}</p>
            </div>
            <div className="p-2.5 bg-stone-50 border border-stone-200 rounded print:border-stone-300">
              <span className="font-bold text-stone-900 block mb-1">3. Wawancara Mendalam</span>
              <p className="text-stone-600">{evaluation.triangulation.interview.notes}</p>
            </div>
            <div className="p-2.5 bg-stone-50 border border-stone-200 rounded print:border-stone-300">
              <span className="font-bold text-stone-900 block mb-1">4. Angket & Kuesioner</span>
              <p className="text-stone-600">{evaluation.triangulation.survey.notes}</p>
            </div>
          </div>
        </div>

        {/* Lembar Tanda Tangan & Pengesahan */}
        <div className="pt-6 border-t border-stone-300 text-xs">
          <div className="grid grid-cols-3 gap-4 text-center">
            {/* Penilai / Evaluator */}
            <div>
              <p className="text-stone-600 mb-1">
                Penilai / Evaluator,
              </p>
              <p className="text-stone-500 text-[11px] mb-14">
                Sekretaris YP3I Asy Syifa
              </p>
              <p className="font-bold text-stone-900 underline">
                Iing Muslih, S.Ag
              </p>
              <p className="text-stone-500">NIP / NIY. -</p>
            </div>

            {/* Ketua Tim Pengembang KBC */}
            <div>
              <p className="text-stone-600 mb-1">
                Ketua Tim Pengembang KBC,
              </p>
              <p className="text-stone-500 text-[11px] mb-14">
                RA Asy Syifa
              </p>
              <p className="font-bold text-stone-900 underline">
                Neng Kurniasih
              </p>
              <p className="text-stone-500">NIP / NIY. -</p>
            </div>

            {/* Kepala RA */}
            <div>
              <p className="text-stone-600 text-[11px] mb-0.5">
                Ditetapkan di: RA Asy Syifa
              </p>
              <p className="text-stone-600 mb-1">
                Mengetahui, Kepala RA Asy Syifa
              </p>
              <div className="mb-14"></div>
              <p className="font-bold text-stone-900 underline">
                Jenab, S.Ag
              </p>
              <p className="text-stone-500">NIP / NIY. -</p>
            </div>
          </div>
        </div>

        {/* Footer Kaki Surat Resmi Sesuai Dokumen YP3I */}
        <div className="mt-10 pt-3 border-t border-stone-300 text-center">
          <p className="text-[11px] sm:text-xs text-stone-600 font-medium">
            Dari Generasi ke Generasi, Setia Mendidik Dengan Hati –{' '}
            <a
              href="https://raasysyifa.biz.id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-700 hover:text-sky-800 underline font-semibold"
            >
              https://raasysyifa.biz.id
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
