import React from 'react';

interface KopSuratProps {
  logoYp3i?: string;
  logoRa?: string;
  onOpenLogoManager?: () => void;
  className?: string;
  marginBottomClass?: string;
}

/**
 * Kop Surat Resmi YP3I & RA Asy Syifa
 * Dirancang khusus presisi dan simetris di seluruh resolusi layar:
 * - Mobile (< 640px): Logo dan tipografi diskalakan proporsional simetris agar tidak berantakan/terhimpit.
 * - Tablet (640px - 1024px): Proporsi seimbang, teks judul tetap utuh tanpa pemotongan canggung.
 * - Desktop & Print (>= 1024px & Cetak A4): Sesuai spesifikasi baku (Logo H: 75px, Kontainer: 100px, H3: 14px, H1: 22px #0056b3, Alamat: 11px).
 */
export const KopSurat: React.FC<KopSuratProps> = ({
  logoYp3i = 'https://infofast.com',
  logoRa = 'https://infofast.com',
  onOpenLogoManager,
  className = '',
  marginBottomClass = 'mb-4 md:mb-5',
}) => {
  return (
    <div
      className={`w-full flex items-center justify-between border-b-[2.5px] sm:border-b-[3px] border-[#0056b3] pb-2 sm:pb-2.5 md:pb-2.5 ${marginBottomClass} font-sans ${className}`}
      style={{
        // Menjaga kompatibilitas standar jika diproses renderer pihak ketiga
        borderBottomColor: '#0056b3',
      }}
    >
      {/* Logo Kiri (YP3I) - Lebar dan penataan simetris dengan Logo Kanan */}
      <div className="w-14 sm:w-20 md:w-[100px] shrink-0 flex items-center justify-start print:w-[100px]">
        {onOpenLogoManager ? (
          <button
            type="button"
            onClick={onOpenLogoManager}
            className="group focus:outline-none cursor-pointer flex items-center justify-start"
            title="Klik untuk melihat / mengubah logo Yayasan (YP3I)"
          >
            <img
              src={logoYp3i || 'https://infofast.com'}
              alt="Logo YP3I"
              className="h-12 sm:h-16 md:h-[75px] w-auto max-w-full object-contain group-hover:scale-105 transition-transform print:h-[75px]"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== '/src/assets/images/logo_yp3i_asli.svg') {
                  target.src = '/src/assets/images/logo_yp3i_asli.svg';
                }
              }}
            />
          </button>
        ) : (
          <img
            src={logoYp3i || 'https://infofast.com'}
            alt="Logo YP3I"
            className="h-12 sm:h-16 md:h-[75px] w-auto max-w-full object-contain print:h-[75px]"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== '/src/assets/images/logo_yp3i_asli.svg') {
                target.src = '/src/assets/images/logo_yp3i_asli.svg';
              }
            }}
          />
        )}
      </div>

      {/* Teks Tengah - Presisi di tengah layar (flex-1 dengan padding responsif) */}
      <div className="flex-1 text-center px-2 sm:px-3 md:px-4 min-w-0">
        <h3 className="m-0 text-[10px] sm:text-xs md:text-[14px] font-bold text-black uppercase tracking-tight sm:tracking-normal leading-tight print:text-[14px]">
          YAYASAN PENDIDIKAN PEMBINAAN DAN PENGEMBANGAN ISLAM (YP3I)
        </h3>
        <h1 className="my-0.5 sm:my-1 text-sm sm:text-lg md:text-[22px] font-bold text-[#0056b3] uppercase tracking-normal sm:tracking-wide leading-tight print:text-[22px]">
          RAUDHATUL ATHFAL (RA) ASY SYIFA
        </h1>
        <p className="m-0 text-[8.5px] sm:text-[10px] md:text-[11px] font-bold text-[#333333] leading-snug print:text-[11px]">
          Alamat Kampus : Jalan Kewadanaan Gang. Kancra No. 292 Lingk. Cibulan Kota Banjar
        </p>
      </div>

      {/* Logo Kanan (RA Asy Syifa) - Lebar dan penataan simetris dengan Logo Kiri */}
      <div className="w-14 sm:w-20 md:w-[100px] shrink-0 flex items-center justify-end print:w-[100px]">
        {onOpenLogoManager ? (
          <button
            type="button"
            onClick={onOpenLogoManager}
            className="group focus:outline-none cursor-pointer flex items-center justify-end"
            title="Klik untuk melihat atau memperbarui Logo RA Asy Syifa (RA Trans.png)"
          >
            <img
              src={logoRa || 'https://infofast.com'}
              alt="Logo RA Asy Syifa"
              className="h-12 sm:h-16 md:h-[75px] w-auto max-w-full object-contain group-hover:scale-105 transition-transform print:h-[75px]"
              referrerPolicy="no-referrer"
            />
          </button>
        ) : (
          <img
            src={logoRa || 'https://infofast.com'}
            alt="Logo RA Asy Syifa"
            className="h-12 sm:h-16 md:h-[75px] w-auto max-w-full object-contain print:h-[75px]"
            referrerPolicy="no-referrer"
          />
        )}
      </div>
    </div>
  );
};
