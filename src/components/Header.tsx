import { Heart, Printer, FileCheck2, LayoutDashboard, Sparkles, RefreshCcw, ShieldCheck, LogOut } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'rubric' | 'triangulation' | 'pdca' | 'print';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenGuide: () => void;
  logoRa?: string;
  onOpenLogoManager?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenGuide,
  logoRa = 'https://infofast.com',
  onOpenLogoManager,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly single row, three zones separated by gap-8 as per Top Bar Contract */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-left group flex items-center gap-2.5 focus:outline-none cursor-pointer"
            >
              <img
                src={logoRa && !logoRa.includes('logo_ra_asli') ? logoRa : 'https://infofast.com'}
                alt="Logo RA Asy Syifa"
                className="w-9 h-9 object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="text-base font-bold text-stone-900 tracking-tight whitespace-nowrap group-hover:text-emerald-800 transition-colors">
                  KBC RA Asy Syifa
                </span>
                <span className="text-[11px] text-stone-500 whitespace-nowrap">
                  Kurikulum Berbasis Cinta
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'dashboard'
                  ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700'
                  : 'hover:text-stone-900'
              }`}
            >
              Dasbor
            </button>
            <button
              onClick={() => setActiveTab('rubric')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'rubric'
                  ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700'
                  : 'hover:text-stone-900'
              }`}
            >
              Instrumen 8 Dimensi
            </button>
            <button
              onClick={() => setActiveTab('triangulation')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'triangulation'
                  ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700'
                  : 'hover:text-stone-900'
              }`}
            >
              Triangulasi Data
            </button>
            <button
              onClick={() => setActiveTab('pdca')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'pdca'
                  ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700'
                  : 'hover:text-stone-900'
              }`}
            >
              Matriks & RTL
            </button>
            <button
              onClick={() => setActiveTab('print')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'print'
                  ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700'
                  : 'hover:text-stone-900'
              }`}
            >
              Cetak / Unduh PDF
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {onOpenLogoManager && (
              <button
                onClick={onOpenLogoManager}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title="Kelola & Unggah Berkas Logo Asli (100% Otentik)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Atur Logo Asli</span>
              </button>
            )}
            <button
              onClick={onOpenGuide}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Panduan 5 Nilai Panca Cinta"
            >
              <Heart className="w-3.5 h-3.5 text-emerald-700" />
              <span>Panca Cinta</span>
            </button>
            <button
              onClick={() => setActiveTab('print')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Unduh PDF / Cetak</span>
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer hover:border-rose-400"
                title="Keluar dari sesi portal aplikasi"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Keluar</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-between border-t border-stone-100 py-2 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 text-xs whitespace-nowrap rounded-md ${
              activeTab === 'dashboard'
                ? 'bg-emerald-100 text-emerald-900 font-semibold'
                : 'text-stone-600'
            }`}
          >
            Dasbor
          </button>
          <button
            onClick={() => setActiveTab('rubric')}
            className={`px-3 py-1 text-xs whitespace-nowrap rounded-md ${
              activeTab === 'rubric'
                ? 'bg-emerald-100 text-emerald-900 font-semibold'
                : 'text-stone-600'
            }`}
          >
            8 Dimensi
          </button>
          <button
            onClick={() => setActiveTab('triangulation')}
            className={`px-3 py-1 text-xs whitespace-nowrap rounded-md ${
              activeTab === 'triangulation'
                ? 'bg-emerald-100 text-emerald-900 font-semibold'
                : 'text-stone-600'
            }`}
          >
            Triangulasi
          </button>
          <button
            onClick={() => setActiveTab('pdca')}
            className={`px-3 py-1 text-xs whitespace-nowrap rounded-md ${
              activeTab === 'pdca'
                ? 'bg-emerald-100 text-emerald-900 font-semibold'
                : 'text-stone-600'
            }`}
          >
            Matriks & RTL
          </button>
          <button
            onClick={() => setActiveTab('print')}
            className={`px-3 py-1 text-xs whitespace-nowrap rounded-md ${
              activeTab === 'print'
                ? 'bg-emerald-100 text-emerald-900 font-semibold'
                : 'text-stone-600'
            }`}
          >
            Cetak
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1 px-3 py-1 text-xs whitespace-nowrap rounded-md text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 font-bold shrink-0 cursor-pointer"
              title="Keluar dari sesi portal"
            >
              <LogOut className="w-3 h-3 text-rose-600" />
              <span>Keluar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
