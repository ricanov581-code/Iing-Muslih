import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EvaluationData } from '../types/kbc';
import { KBC_DIMENSIONS, MAX_POSSIBLE_SCORE } from '../data/kbcFramework';
import {
  calculateDimensionStats,
  calculatePercentage,
  calculateTotalScore,
  getScoreCategory,
} from './evaluationCalculations';

import { getStoredLogos } from './logoStorage';

export function exportKbcToPdf(
  evaluation: EvaluationData,
  logoConfigParam?: { logoYp3i: string; logoRa: string }
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const logos = logoConfigParam || getStoredLogos();

  const totalScore = calculateTotalScore(evaluation.scores);
  const percentage = calculatePercentage(evaluation.scores);
  const category = getScoreCategory(percentage);
  const dimensionStats = KBC_DIMENSIONS.map((dim) =>
    calculateDimensionStats(dim, evaluation.scores)
  );

  const darkTextColor: [number, number, number] = [28, 25, 23]; // Stone 900
  const mutedTextColor: [number, number, number] = [87, 83, 78]; // Stone 600
  const blueBrandColor: [number, number, number] = [0, 86, 179]; // #0056b3

  // --- EMBED LOGOS ASLI JIKA BERFORMAT GAMBAR/BASE64 ---
  if (logos.logoYp3i && logos.logoYp3i.startsWith('data:image')) {
    try {
      doc.addImage(logos.logoYp3i, 'PNG', 14, 10, 24, 15);
    } catch (e) {
      console.warn('Gagal menyematkan logo YP3I ke PDF:', e);
    }
  }

  if (logos.logoRa && logos.logoRa.startsWith('data:image')) {
    try {
      doc.addImage(logos.logoRa, 'PNG', 174, 9.5, 18, 18);
    } catch (e) {
      console.warn('Gagal menyematkan logo RA ke PDF:', e);
    }
  }

  // --- KOP SURAT RESMI SESUAI BERKAS YP3I ASY SYIFA ---
  doc.setTextColor(...darkTextColor);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(
    'YAYASAN PENDIDIKAN PEMBINAAN DAN PENGEMBANGAN ISLAM (YP3I)',
    105,
    13,
    { align: 'center' }
  );

  doc.setTextColor(...blueBrandColor);
  doc.setFontSize(14.5);
  doc.setFont('helvetica', 'bold');
  doc.text('RAUDHATUL ATHFAL (RA) ASY SYIFA', 105, 19.5, { align: 'center' });

  doc.setTextColor(...mutedTextColor);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Alamat Kampus : Jalan Kewadanaan Gang. Kancra No. 292 Lingk. Cibulan Kota Banjar',
    105,
    24.5,
    { align: 'center' }
  );

  // Garis pembatas Kop Surat #0056b3 tebal 3px setara
  doc.setDrawColor(0, 86, 179);
  doc.setLineWidth(0.8);
  doc.line(14, 28, 196, 28);

  // --- JUDUL LAPORAN ---
  doc.setTextColor(...darkTextColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(
    'LAPORAN EVALUASI IMPLEMENTASI KURIKULUM BERBASIS CINTA (KBC)',
    105,
    35.5,
    { align: 'center' }
  );

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedTextColor);
  doc.text(
    'Kerangka Kerja Input - Proses - Output - Dampak & Landasan Panca Cinta Kemenag',
    105,
    39.5,
    { align: 'center' }
  );

  // --- TABEL I: IDENTITAS EVALUASI ---
  autoTable(doc, {
    startY: 43,
    margin: { left: 14, right: 14 },
    theme: 'grid',
    headStyles: {
      fillColor: [245, 245, 244],
      textColor: [28, 25, 23],
      fontStyle: 'bold',
      fontSize: 8,
    },
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: [28, 25, 23],
      lineColor: [214, 211, 209],
      lineWidth: 0.15,
    },
    body: [
      [
        { content: 'Satuan Pendidikan', styles: { fontStyle: 'bold', fillColor: [250, 250, 249] } },
        `: ${evaluation.schoolName}`,
        { content: 'Penilai / Evaluator', styles: { fontStyle: 'bold', fillColor: [250, 250, 249] } },
        `: ${evaluation.evaluatorName}`,
      ],
      [
        { content: 'Tahun Ajaran', styles: { fontStyle: 'bold', fillColor: [250, 250, 249] } },
        `: ${evaluation.academicYear}`,
        { content: 'Jabatan Penilai', styles: { fontStyle: 'bold', fillColor: [250, 250, 249] } },
        `: ${evaluation.evaluatorRole}`,
      ],
      [
        { content: 'Semester', styles: { fontStyle: 'bold', fillColor: [250, 250, 249] } },
        `: ${evaluation.semester}`,
        { content: 'Tanggal Asesmen', styles: { fontStyle: 'bold', fillColor: [250, 250, 249] } },
        `: ${evaluation.evaluationDate}`,
      ],
    ],
  });

  // --- TABEL II: REKAPITULASI CAPAIAN MUTU ---
  const currentYAfterIdentity = (doc as any).lastAutoTable.finalY + 4;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkTextColor);
  doc.text('I. Rekapitulasi Capaian & Interpretasi Mutu KBC', 14, currentYAfterIdentity);

  autoTable(doc, {
    startY: currentYAfterIdentity + 2,
    margin: { left: 14, right: 14 },
    theme: 'plain',
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      lineColor: [214, 211, 209],
      lineWidth: 0.2,
    },
    body: [
      [
        {
          content: `Total Skor: ${totalScore} / ${MAX_POSSIBLE_SCORE} Poin`,
          styles: { fontStyle: 'bold', halign: 'center', fillColor: [240, 253, 244] },
        },
        {
          content: `Persentase Capaian: ${percentage}%`,
          styles: { fontStyle: 'bold', halign: 'center', textColor: [6, 95, 70], fillColor: [240, 253, 244] },
        },
        {
          content: `Kategori: ${category.label}`,
          styles: { fontStyle: 'bold', halign: 'center', fillColor: [240, 253, 244] },
        },
      ],
      [
        {
          colSpan: 3,
          content: `Deskripsi: ${category.description}\nRekomendasi Kebijakan: ${category.recommendedAction}`,
          styles: { fillColor: [250, 250, 249], textColor: [68, 64, 60] },
        },
      ],
    ],
  });

  // --- TABEL III: CAPAIAN 8 DIMENSI PENGUKURAN ---
  const currentYAfterSummary = (doc as any).lastAutoTable.finalY + 4;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkTextColor);
  doc.text('II. Capaian Per Dimensi Pengukuran KBC (PDF Hal. 1-3)', 14, currentYAfterSummary);

  autoTable(doc, {
    startY: currentYAfterSummary + 2,
    margin: { left: 14, right: 14 },
    theme: 'grid',
    head: [
      [
        'No',
        'Dimensi Pengukuran',
        'Tahap',
        'Skor / Maks',
        'Rata-rata',
        '% Capaian',
        'Status Mutu',
      ],
    ],
    headStyles: {
      fillColor: [6, 95, 70],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center',
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 1.8,
      lineColor: [229, 231, 235],
      lineWidth: 0.15,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { fontStyle: 'bold', cellWidth: 58 },
      2: { halign: 'center', cellWidth: 18 },
      3: { halign: 'center', cellWidth: 22 },
      4: { halign: 'center', fontStyle: 'bold', cellWidth: 20 },
      5: { halign: 'center', fontStyle: 'bold', cellWidth: 20 },
      6: { cellWidth: 36 },
    },
    body: dimensionStats.map((dim) => [
      dim.id.toString(),
      dim.name,
      dim.stage,
      `${dim.totalScore} / ${dim.maxScore}`,
      dim.averageScore.toFixed(2),
      `${dim.percentage}%`,
      dim.statusCategory.label,
    ]),
  });

  // --- TABEL IV: FORMAT RINGKASAN HASIL & RTL (HALAMAN 5 PDF) ---
  doc.addPage();
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkTextColor);
  doc.text(
    'III. Format Ringkasan Hasil & Rencana Tindak Lanjut (PDF Hal. 5)',
    14,
    14
  );

  autoTable(doc, {
    startY: 17,
    margin: { left: 14, right: 14 },
    theme: 'grid',
    head: [
      [
        'No',
        'Dimensi',
        'Skor',
        'Temuan Kekuatan',
        'Temuan Kelemahan',
        'Rekomendasi',
        'PJ',
        'Waktu',
      ],
    ],
    headStyles: {
      fillColor: [6, 95, 70],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center',
    },
    styles: {
      fontSize: 7,
      cellPadding: 2,
      lineColor: [214, 211, 209],
      lineWidth: 0.15,
      overflow: 'linebreak',
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 7 },
      1: { fontStyle: 'bold', cellWidth: 28 },
      2: { halign: 'center', fontStyle: 'bold', cellWidth: 12 },
      3: { cellWidth: 34 },
      4: { cellWidth: 34 },
      5: { cellWidth: 37 },
      6: { cellWidth: 15 },
      7: { cellWidth: 15 },
    },
    body: KBC_DIMENSIONS.map((dim) => {
      const stats = calculateDimensionStats(dim, evaluation.scores);
      const finding = evaluation.findings[dim.id] || {
        scoreAverage: stats.averageScore,
        strengths: '-',
        weaknesses: '-',
        recommendation: '-',
        pic: 'Tim KBC',
        timeline: 'Semester Ini',
      };
      return [
        dim.id.toString(),
        dim.name,
        stats.averageScore.toFixed(2),
        finding.strengths,
        finding.weaknesses,
        finding.recommendation,
        finding.pic,
        finding.timeline,
      ];
    }),
  });

  // --- CATATAN TRIANGULASI (4 METODE) ---
  const currentYAfterRtl = (doc as any).lastAutoTable.finalY + 4;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('IV. Catatan Triangulasi Data (4 Metode - Hal. 4 PDF)', 14, currentYAfterRtl);

  autoTable(doc, {
    startY: currentYAfterRtl + 2,
    margin: { left: 14, right: 14 },
    theme: 'grid',
    styles: {
      fontSize: 7,
      cellPadding: 2,
      lineColor: [229, 231, 235],
      lineWidth: 0.15,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45 },
      1: { cellWidth: 137 },
    },
    body: [
      ['1. Telaah Dokumen', evaluation.triangulation.documentReview.notes || 'Tervalidasi sesuai KOSP & RKAM.'],
      ['2. Observasi Lapangan', evaluation.triangulation.observation.notes || 'Observasi 4 titik waktu telah terverifikasi.'],
      ['3. Wawancara Mendalam', evaluation.triangulation.interview.notes || 'Wawancara dengan kepala, guru, wali murid, dan anak terdokumentasi.'],
      ['4. Angket & Kuesioner', evaluation.triangulation.survey.notes || 'Survei kepuasan orang tua dan instrumen refleksi guru terisi lengkap.'],
    ],
  });

  // --- LEMBAR PENGESAHAN 3 TANDA TANGAN ---
  const currentYAfterTriangulation = (doc as any).lastAutoTable.finalY + 6;

  autoTable(doc, {
    startY: currentYAfterTriangulation,
    margin: { left: 14, right: 14 },
    theme: 'plain',
    styles: {
      fontSize: 8,
      cellPadding: 1,
      halign: 'center',
    },
    body: [
      [
        'Penilai / Evaluator,\nSekretaris YP3I Asy Syifa\n\n\n\n\n' +
          'Iing Muslih, S.Ag\n' +
          'NIP / NIY. -',
        'Ketua Tim Pengembang KBC,\nRA Asy Syifa\n\n\n\n\n' +
          'Neng Kurniasih\n' +
          'NIP / NIY. -',
        'Ditetapkan di: RA Asy Syifa\nMengetahui, Kepala RA Asy Syifa\n\n\n\n\n' +
          'Jenab, S.Ag\n' +
          'NIP / NIY. -',
      ],
    ],
  });

  // --- KAKI SURAT / FOOTER DI SETIAP HALAMAN ---
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(199, 210, 254);
    doc.setLineWidth(0.2);
    doc.line(14, 287, 196, 287);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(
      'Dari Generasi ke Generasi, Setia Mendidik Dengan Hati – https://raasysyifa.biz.id',
      105,
      291,
      { align: 'center' }
    );
  }

  // Simpan berkas langsung
  const cleanSchool = evaluation.schoolName.replace(/[\/\s]/g, '_');
  const cleanYear = evaluation.academicYear.replace(/[\/\s]/g, '-');
  const cleanSem = evaluation.semester.replace(/\s+/g, '_');
  const filename = `Laporan_Evaluasi_KBC_${cleanSchool}_${cleanYear}_${cleanSem}.pdf`;

  doc.save(filename);
}

/**
 * Membuka dokumen versi cetak mandiri di tab baru dengan CSS cetak terpadu
 * dan Kop Surat resmi YP3I Asy Syifa Kota Banjar.
 */
export function openStandalonePrintPage(
  evaluation: EvaluationData,
  logoConfigParam?: { logoYp3i: string; logoRa: string }
): void {
  const logos = logoConfigParam || getStoredLogos();
  const totalScore = calculateTotalScore(evaluation.scores);
  const percentage = calculatePercentage(evaluation.scores);
  const category = getScoreCategory(percentage);
  const dimensionStats = KBC_DIMENSIONS.map((dim) =>
    calculateDimensionStats(dim, evaluation.scores)
  );

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan Evaluasi KBC RA Asy Syifa - Cetak</title>
  <style>
    @page { size: A4; margin: 12mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; font-size: 10pt; color: #1c1917; line-height: 1.4; margin: 0; padding: 20px; }
    .header-kop { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #1c1917; padding-bottom: 8px; margin-bottom: 16px; }
    .kop-logo { width: 80px; height: 75px; display: flex; align-items: center; justify-content: center; }
    .kop-logo img { width: 70px; height: 70px; object-fit: contain; }
    .kop-center { flex: 1; text-align: center; padding: 0 10px; }
    .kop-yp3i { font-size: 9pt; font-weight: bold; letter-spacing: 0.5px; color: #1c1917; text-transform: uppercase; margin: 0; }
    .kop-title { font-size: 15pt; font-weight: 900; color: #0284c7; margin: 2px 0; text-transform: uppercase; }
    .kop-address { font-size: 8pt; color: #44403c; margin: 0; }
    .doc-title { text-align: center; margin: 14px 0; }
    .doc-title h2 { font-size: 11.5pt; font-weight: bold; text-decoration: underline; margin: 0; }
    .doc-title p { font-size: 8pt; color: #57534e; margin-top: 3px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 8pt; }
    th, td { border: 1px solid #d6d3d1; padding: 4px 6px; }
    th { background-color: #f5f5f4; font-weight: bold; text-align: left; }
    .th-green { background-color: #065f46; color: white; text-align: center; }
    .center { text-align: center; }
    .bold { font-weight: bold; }
    .bg-light { background-color: #fafaf9; }
    .rekap-box { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 10px; }
    .rekap-item { flex: 1; border: 1px solid #d6d3d1; padding: 6px; text-align: center; background: #fafaf9; border-radius: 4px; }
    .rekap-item .val { font-size: 13pt; font-weight: 900; color: #065f46; }
    .signatures { display: flex; justify-content: space-between; text-align: center; margin-top: 20px; font-size: 8pt; }
    .sig-col { width: 30%; }
    .sig-space { height: 50px; }
    .footer-bar { margin-top: 30px; padding-top: 8px; border-top: 1px solid #c7d2fe; text-align: center; font-size: 8pt; color: #475569; }
    .btn-print { position: fixed; top: 15px; right: 15px; padding: 10px 18px; background: #065f46; color: white; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
    @media print { .btn-print { display: none; } body { padding: 0; } .page-break { page-break-before: always; } }
  </style>
</head>
<body>
  <button class="btn-print" onclick="window.print()">🖨️ Cetak / Simpan PDF (Ctrl+P)</button>

  <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; border-bottom: 3px solid #0056b3; padding-bottom: 10px; margin-bottom: 20px; font-family: sans-serif;">
    
    <!-- Logo Kiri -->
    <div style="flex: 0 0 100px; text-align: left;">
      <img src="${logos.logoYp3i || 'https://infofast.com'}" alt="Logo YP3I" onerror="this.onerror=null;this.src='/src/assets/images/logo_yp3i_asli.svg';" style="height: 75px; width: auto; object-fit: contain;">
    </div>

    <!-- Teks Tengah -->
    <div style="flex: 1; text-align: center; padding: 0 15px;">
      <h3 style="margin: 0; font-size: 14px; font-weight: bold; color: #000; text-transform: uppercase;">YAYASAN PENDIDIKAN PEMBINAAN DAN PENGEMBANGAN ISLAM (YP3I)</h3>
      <h1 style="margin: 5px 0; font-size: 22px; font-weight: bold; color: #0056b3; text-transform: uppercase;">RAUDHATUL ATHFAL (RA) ASY SYIFA</h1>
      <p style="margin: 0; font-size: 11px; color: #333; font-weight: bold;">Alamat Kampus : Jalan Kewadanaan Gang. Kancra No. 292 Lingk. Cibulan Kota Banjar</p>
    </div>

    <!-- Logo Kanan -->
    <div style="flex: 0 0 100px; text-align: right;">
      <img src="${logos.logoRa || 'https://infofast.com'}" alt="Logo RA Asy Syifa" style="height: 75px; width: auto; object-fit: contain;">
    </div>

  </div>

  <div class="doc-title">
    <h2>LAPORAN EVALUASI IMPLEMENTASI KURIKULUM BERBASIS CINTA (KBC)</h2>
    <p>Kerangka Kerja Input - Proses - Output - Dampak dan Landasan Panca Cinta Kemenag</p>
  </div>

  <table>
    <tr>
      <th style="width: 20%;">Satuan Pendidikan</th>
      <td style="width: 30%; font-weight: bold;">: ${evaluation.schoolName}</td>
      <th style="width: 20%;">Penilai / Evaluator</th>
      <td style="width: 30%; font-weight: bold;">: ${evaluation.evaluatorName}</td>
    </tr>
    <tr>
      <th>Tahun Ajaran</th>
      <td>: ${evaluation.academicYear}</td>
      <th>Jabatan Penilai</th>
      <td>: ${evaluation.evaluatorRole}</td>
    </tr>
    <tr>
      <th>Semester</th>
      <td>: ${evaluation.semester}</td>
      <th>Tanggal Asesmen</th>
      <td>: ${evaluation.evaluationDate}</td>
    </tr>
  </table>

  <h4 style="margin: 8px 0 4px 0; font-size: 9pt;">I. Rekapitulasi Capaian & Interpretasi Skor Total</h4>
  <div class="rekap-box">
    <div class="rekap-item">
      <div style="font-size: 7.5pt; color: #78716c;">Total Skor</div>
      <div class="val">${totalScore} / ${MAX_POSSIBLE_SCORE}</div>
    </div>
    <div class="rekap-item">
      <div style="font-size: 7.5pt; color: #78716c;">Persentase Capaian</div>
      <div class="val">${percentage}%</div>
    </div>
    <div class="rekap-item">
      <div style="font-size: 7.5pt; color: #78716c;">Kategori Mutu</div>
      <div class="val" style="font-size: 10pt; margin-top: 2px;">${category.label}</div>
    </div>
  </div>

  <div style="border: 1px solid #d6d3d1; padding: 6px 8px; font-size: 7.5pt; background: #fafaf9; margin-bottom: 10px; border-radius: 4px;">
    <strong>Deskripsi:</strong> ${category.description}<br>
    <strong>Rekomendasi Kebijakan:</strong> ${category.recommendedAction}
  </div>

  <h4 style="margin: 8px 0 4px 0; font-size: 9pt;">II. Capaian Per Dimensi Pengukuran (PDF Hal. 1-3)</h4>
  <table>
    <thead>
      <tr>
        <th class="th-green" style="width: 5%;">No</th>
        <th class="th-green">Dimensi Pengukuran</th>
        <th class="th-green" style="width: 10%;">Tahap</th>
        <th class="th-green" style="width: 14%;">Skor (Maks)</th>
        <th class="th-green" style="width: 12%;">Rata-rata</th>
        <th class="th-green" style="width: 12%;">% Capaian</th>
        <th class="th-green" style="width: 25%;">Status Mutu</th>
      </tr>
    </thead>
    <tbody>
      ${dimensionStats
        .map(
          (dim) => `<tr>
        <td class="center bold">${dim.id}</td>
        <td class="bold">${dim.name}</td>
        <td class="center">${dim.stage}</td>
        <td class="center">${dim.totalScore} / ${dim.maxScore}</td>
        <td class="center bold">${dim.averageScore.toFixed(2)}</td>
        <td class="center bold" style="color: #065f46;">${dim.percentage}%</td>
        <td>${dim.statusCategory.label}</td>
      </tr>`
        )
        .join('')}
    </tbody>
  </table>

  <div class="page-break"></div>

  <h4 style="margin: 8px 0 4px 0; font-size: 9pt;">III. Format Ringkasan Hasil & Rencana Tindak Lanjut (PDF Hal. 5)</h4>
  <table>
    <thead>
      <tr>
        <th class="th-green" style="width: 4%;">No</th>
        <th class="th-green" style="width: 18%;">Dimensi</th>
        <th class="th-green" style="width: 8%;">Skor</th>
        <th class="th-green">Temuan Kekuatan</th>
        <th class="th-green">Temuan Kelemahan</th>
        <th class="th-green">Rekomendasi</th>
        <th class="th-green" style="width: 10%;">PJ</th>
        <th class="th-green" style="width: 10%;">Waktu</th>
      </tr>
    </thead>
    <tbody>
      ${KBC_DIMENSIONS.map((dim) => {
        const stats = calculateDimensionStats(dim, evaluation.scores);
        const finding = evaluation.findings[dim.id] || {
          scoreAverage: stats.averageScore,
          strengths: '-',
          weaknesses: '-',
          recommendation: '-',
          pic: 'Tim KBC',
          timeline: 'Semester Ini',
        };
        return `<tr>
          <td class="center bold">${dim.id}</td>
          <td class="bold">${dim.name}</td>
          <td class="center bold">${stats.averageScore.toFixed(2)}</td>
          <td>${finding.strengths}</td>
          <td>${finding.weaknesses}</td>
          <td class="bold">${finding.recommendation}</td>
          <td>${finding.pic}</td>
          <td>${finding.timeline}</td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>

  <h4 style="margin: 8px 0 4px 0; font-size: 9pt;">IV. Catatan Triangulasi Data (4 Metode)</h4>
  <table>
    <tr><th style="width: 25%;">1. Telaah Dokumen</th><td>${evaluation.triangulation.documentReview.notes}</td></tr>
    <tr><th>2. Observasi Lapangan</th><td>${evaluation.triangulation.observation.notes}</td></tr>
    <tr><th>3. Wawancara Mendalam</th><td>${evaluation.triangulation.interview.notes}</td></tr>
    <tr><th>4. Angket & Kuesioner</th><td>${evaluation.triangulation.survey.notes}</td></tr>
  </table>

  <div class="signatures">
    <div class="sig-col">
      <p style="margin:0;">Penilai / Evaluator,</p>
      <p style="margin:0; font-size: 7.5pt; color:#57534e;">Sekretaris YP3I Asy Syifa</p>
      <div class="sig-space"></div>
      <p style="margin:0; font-weight:bold; text-decoration: underline;">Iing Muslih, S.Ag</p>
      <p style="margin:0; color:#78716c;">NIP / NIY. -</p>
    </div>
    <div class="sig-col">
      <p style="margin:0;">Ketua Tim Pengembang KBC,</p>
      <p style="margin:0; font-size: 7.5pt; color:#57534e;">RA Asy Syifa</p>
      <div class="sig-space"></div>
      <p style="margin:0; font-weight:bold; text-decoration: underline;">Neng Kurniasih</p>
      <p style="margin:0; color:#78716c;">NIP / NIY. -</p>
    </div>
    <div class="sig-col">
      <p style="margin:0; font-size: 7.5pt; color:#57534e;">Ditetapkan di: RA Asy Syifa</p>
      <p style="margin:0;">Mengetahui, Kepala RA Asy Syifa</p>
      <div class="sig-space"></div>
      <p style="margin:0; font-weight:bold; text-decoration: underline;">Jenab, S.Ag</p>
      <p style="margin:0; color:#78716c;">NIP / NIY. -</p>
    </div>
  </div>

  <div class="footer-bar">
    Dari Generasi ke Generasi, Setia Mendidik Dengan Hati – <a href="https://raasysyifa.biz.id" target="_blank" style="color: #0284c7; text-decoration: underline; font-weight: bold;">https://raasysyifa.biz.id</a>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const printWindow = window.open(url, '_blank');
  if (!printWindow) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Evaluasi_KBC_Cetak_${evaluation.schoolName.replace(/[\/\s]/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}
