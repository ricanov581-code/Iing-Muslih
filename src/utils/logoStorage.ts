export const DEFAULT_LOGO_YP3I = 'https://infofast.com';
export const DEFAULT_LOGO_RA = 'https://infofast.com';

export const FALLBACK_VECTOR_YP3I = '/src/assets/images/logo_yp3i_asli.svg';
export const FALLBACK_VECTOR_RA = 'https://infofast.com';

export const STORAGE_KEY_LOGO_YP3I = 'kbc_custom_logo_yp3i_v5';
export const STORAGE_KEY_LOGO_RA = 'kbc_custom_logo_ra_v5';

export interface LogoConfig {
  logoYp3i: string;
  logoRa: string;
  isCustomYp3i: boolean;
  isCustomRa: boolean;
}

export function getStoredLogos(): LogoConfig {
  let logoYp3i = DEFAULT_LOGO_YP3I;
  let logoRa = DEFAULT_LOGO_RA;
  let isCustomYp3i = false;
  let isCustomRa = false;

  try {
    const savedYp3i = localStorage.getItem(STORAGE_KEY_LOGO_YP3I);
    if (savedYp3i) {
      logoYp3i = savedYp3i;
      isCustomYp3i = true;
    }
  } catch (e) {
    console.warn('Gagal membaca logo YP3I dari storage', e);
  }

  try {
    const savedRa = localStorage.getItem(STORAGE_KEY_LOGO_RA);
    if (savedRa && !savedRa.includes('logo_ra_asli')) {
      logoRa = savedRa;
      isCustomRa = true;
    } else if (savedRa && savedRa.includes('logo_ra_asli')) {
      localStorage.removeItem(STORAGE_KEY_LOGO_RA);
      logoRa = DEFAULT_LOGO_RA;
      isCustomRa = false;
    }
  } catch (e) {
    console.warn('Gagal membaca logo RA dari storage', e);
  }

  return { logoYp3i, logoRa, isCustomYp3i, isCustomRa };
}

export function saveStoredLogo(type: 'yp3i' | 'ra', dataUrlOrLink: string): void {
  try {
    if (type === 'yp3i') {
      localStorage.setItem(STORAGE_KEY_LOGO_YP3I, dataUrlOrLink);
    } else {
      localStorage.setItem(STORAGE_KEY_LOGO_RA, dataUrlOrLink);
    }
  } catch (e) {
    console.error('Gagal menyimpan logo ke localStorage', e);
  }
}

export function removeStoredLogo(type: 'yp3i' | 'ra'): void {
  try {
    if (type === 'yp3i') {
      localStorage.removeItem(STORAGE_KEY_LOGO_YP3I);
    } else {
      localStorage.removeItem(STORAGE_KEY_LOGO_RA);
    }
  } catch (e) {
    console.error('Gagal mereset logo di localStorage', e);
  }
}
