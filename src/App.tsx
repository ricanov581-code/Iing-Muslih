import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { EvaluationFormView } from './components/EvaluationFormView';
import { TriangulationView } from './components/TriangulationView';
import { PdcaAndRtlView } from './components/PdcaAndRtlView';
import { PrintReportView } from './components/PrintReportView';
import { PancaCintaModal } from './components/PancaCintaModal';
import { LogoManagerModal } from './components/LogoManagerModal';
import { EvaluationData } from './types/kbc';
import { INITIAL_EVALUATION } from './data/initialData';
import { getStoredLogos, LogoConfig } from './utils/logoStorage';
import { Download, Upload, RotateCcw, Heart, Check, Sparkles, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'kbc_ra_asysyifa_evaluation_data_v3';

export default function App() {
  const [logoConfig, setLogoConfig] = useState<LogoConfig>(() => getStoredLogos());
  const [isLogoManagerOpen, setIsLogoManagerOpen] = useState(false);

  const [evaluation, setEvaluation] = useState<EvaluationData>(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem('kbc_ra_asysyifa_evaluation_data_v2') ||
        localStorage.getItem('kbc_ra_asysyifa_evaluation_data_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          !parsed.evaluatorName ||
          parsed.evaluatorName.includes('@Ricanov') ||
          parsed.evaluatorName === 'Neng Kurniasih'
        ) {
          parsed.evaluatorName = 'Iing Muslih, S.Ag';
          parsed.evaluatorRole = 'Sekretaris YP3I Asy Syifa';
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to load saved evaluation data', e);
    }
    return INITIAL_EVALUATION;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [targetDimensionId, setTargetDimensionId] = useState<number>(1);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save to localStorage automatically on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(evaluation));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [evaluation]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleUpdateScore = (indicatorId: string, score: number) => {
    setEvaluation((prev) => {
      const newScores = { ...prev.scores, [indicatorId]: score };
      return {
        ...prev,
        scores: newScores,
      };
    });
  };

  const handleUpdateIndicatorNote = (indicatorId: string, note: string) => {
    setEvaluation((prev) => ({
      ...prev,
      indicatorNotes: {
        ...prev.indicatorNotes,
        [indicatorId]: note,
      },
    }));
  };

  const handleUpdateFinding = (
    dimensionId: number,
    partialFinding: any
  ) => {
    setEvaluation((prev) => ({
      ...prev,
      findings: {
        ...prev.findings,
        [dimensionId]: {
          ...(prev.findings[dimensionId] || {
            scoreAverage: 0,
            strengths: '',
            weaknesses: '',
            recommendation: '',
            pic: 'Tim KBC',
            timeline: 'Semester Ini',
          }),
          ...partialFinding,
        },
      },
    }));
    showToast('Catatan ringkasan dimensi berhasil disimpan');
  };

  const handleUpdateTriangulationNote = (
    methodKey: 'documentReview' | 'observation' | 'interview' | 'survey',
    note: string
  ) => {
    setEvaluation((prev) => ({
      ...prev,
      triangulation: {
        ...prev.triangulation,
        [methodKey]: {
          ...prev.triangulation[methodKey],
          notes: note,
        },
      },
    }));
  };

  const handleToggleTriangulationItem = (
    methodKey: 'documentReview' | 'observation' | 'interview' | 'survey',
    itemId: string
  ) => {
    setEvaluation((prev) => {
      const method = prev.triangulation[methodKey];
      const newItems = method.items.map((it) =>
        it.id === itemId ? { ...it, checked: !it.checked } : it
      );
      return {
        ...prev,
        triangulation: {
          ...prev.triangulation,
          [methodKey]: {
            ...method,
            items: newItems,
          },
        },
      };
    });
  };

  const handleUpdatePdca = (
    key: 'plan' | 'do' | 'check' | 'act',
    value: string
  ) => {
    setEvaluation((prev) => ({
      ...prev,
      pdca: {
        ...prev.pdca,
        [key]: value,
      },
    }));
  };

  const handleUpdateEvaluationMeta = (meta: Partial<EvaluationData>) => {
    setEvaluation((prev) => ({
      ...prev,
      ...meta,
    }));
  };

  const handleResetToDefault = () => {
    if (
      window.confirm(
        'Kembalikan seluruh data evaluasi ke draf awal RA Asy Syifa? Perubahan kustom saat ini akan diganti dengan data referensi.'
      )
    ) {
      setEvaluation(INITIAL_EVALUATION);
      showToast('Data berhasil dikembalikan ke standar awal RA Asy Syifa');
    }
  };

  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(evaluation, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `Evaluasi_KBC_RA_Asy_Syifa_${evaluation.academicYear.replace(
        '/',
        '-'
      )}_${evaluation.semester}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('File backup evaluasi JSON berhasil diunduh');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.scores && parsed.findings) {
          setEvaluation(parsed);
          showToast('Data evaluasi berhasil diimpor!');
        } else {
          alert('Format file JSON tidak sesuai dengan skema KBC RA Asy Syifa.');
        }
      } catch (err) {
        alert('Gagal membaca file JSON. Pastikan file valid.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleNavigateToRubricWithDim = (dimId?: number) => {
    if (dimId) {
      setTargetDimensionId(dimId);
    }
    setActiveTab('rubric');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Top Navigation Bar adhering to Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenGuide={() => setIsGuideOpen(true)}
        logoRa={logoConfig.logoRa}
        onOpenLogoManager={() => setIsLogoManagerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            evaluation={evaluation}
            onNavigateToRubric={handleNavigateToRubricWithDim}
            onNavigateToTriangulation={() => setActiveTab('triangulation')}
            onNavigateToPdca={() => setActiveTab('pdca')}
            onNavigateToPrint={() => setActiveTab('print')}
            onUpdateEvaluationMeta={handleUpdateEvaluationMeta}
            logoRa={logoConfig.logoRa}
            logoYp3i={logoConfig.logoYp3i}
            onOpenLogoManager={() => setIsLogoManagerOpen(true)}
          />
        )}

        {activeTab === 'rubric' && (
          <EvaluationFormView
            evaluation={evaluation}
            initialDimensionId={targetDimensionId}
            onUpdateScore={handleUpdateScore}
            onUpdateIndicatorNote={handleUpdateIndicatorNote}
            onNavigateToPdca={() => setActiveTab('pdca')}
          />
        )}

        {activeTab === 'triangulation' && (
          <TriangulationView
            evaluation={evaluation}
            onUpdateTriangulationNote={handleUpdateTriangulationNote}
            onToggleItem={handleToggleTriangulationItem}
            onNavigateToPdca={() => setActiveTab('pdca')}
          />
        )}

        {activeTab === 'pdca' && (
          <PdcaAndRtlView
            evaluation={evaluation}
            onUpdateFinding={handleUpdateFinding}
            onUpdatePdca={handleUpdatePdca}
            onNavigateToPrint={() => setActiveTab('print')}
          />
        )}

        {activeTab === 'print' && (
          <PrintReportView
            evaluation={evaluation}
            onBack={() => setActiveTab('dashboard')}
            logoConfig={logoConfig}
            onOpenLogoManager={() => setIsLogoManagerOpen(true)}
          />
        )}
      </main>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Philosophical Guide Modal */}
      <PancaCintaModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Logo Manager Modal: Memastikan Logo 100% Berkas Asli */}
      <LogoManagerModal
        isOpen={isLogoManagerOpen}
        onClose={() => setIsLogoManagerOpen(false)}
        logoConfig={logoConfig}
        onLogosUpdated={(newConfig) => {
          setLogoConfig(newConfig);
          showToast('Logo berhasil diperbarui langsung dari berkas asli!');
        }}
      />

      {/* Institutional Footer */}
      <footer className="print:hidden border-t border-stone-200 bg-white py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLogoManagerOpen(true)}
              className="cursor-pointer focus:outline-none"
              title="Atur Logo Asli"
            >
              <img
                src={logoConfig.logoRa && !logoConfig.logoRa.includes('logo_ra_asli') ? logoConfig.logoRa : 'https://infofast.com'}
                alt="Logo RA Asy Syifa"
                className="w-5 h-5 object-contain"
                referrerPolicy="no-referrer"
              />
            </button>
            <span className="font-semibold text-stone-800">
              RA Asy Syifa
            </span>
            <span>·</span>
            <span className="text-stone-500">YP3I Kota Banjar</span>
            <span>·</span>
            <a
              href="https://raasysyifa.biz.id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-700 hover:underline"
            >
              raasysyifa.biz.id
            </a>
          </div>

          <div className="flex items-center gap-4">
            <label className="hover:text-stone-900 cursor-pointer flex items-center gap-1 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Impor JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
            </label>
            <span>·</span>
            <button
              onClick={handleExportJson}
              className="hover:text-stone-900 flex items-center gap-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor JSON</span>
            </button>
            <span>·</span>
            <button
              onClick={handleResetToDefault}
              className="hover:text-stone-900 flex items-center gap-1 transition-colors text-stone-500"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
