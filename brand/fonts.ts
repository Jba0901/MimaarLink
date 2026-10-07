// Mimaary brand fonts. Import in app/layout.tsx and add all four
// `.variable` classes to <html className=...>.
import { Source_Serif_4, IBM_Plex_Sans, IBM_Plex_Sans_Arabic, Noto_Naskh_Arabic } from 'next/font/google';

export const sourceSerif = Source_Serif_4({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-source-serif', display: 'swap' });
export const plex = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex', display: 'swap' });
export const plexArabic = IBM_Plex_Sans_Arabic({ subsets: ['arabic'], weight: ['400', '500', '600'], variable: '--font-plex-arabic', display: 'swap' });
export const naskh = Noto_Naskh_Arabic({ subsets: ['arabic'], weight: ['500', '600'], variable: '--font-naskh', display: 'swap' });

export const fontVariables = [sourceSerif.variable, plex.variable, plexArabic.variable, naskh.variable].join(' ');
