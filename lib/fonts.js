// Mimaary brand fonts (brand/fonts.ts). The woff2 files live in lib/font-files/ so the
// build never downloads from Google Fonts (a Google outage used to fail Vercel builds).
// Files are Google Fonts' own subsets: latin for the Latin families, arabic for the Arabic ones.
// next/font needs literal options, so the unicode ranges are repeated per family.
// Each face is limited to its script with unicode-range, and the Arabic families skip the
// metric fallback, so Latin characters in Arabic text fall through to IBM Plex Sans / Source Serif.
import localFont from 'next/font/local';

export const sourceSerif = localFont({ src: [{ path: './font-files/SourceSerif4-latin-var.woff2', weight: '400 500', style: 'normal' }], declarations: [{ prop: 'unicode-range', value: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD' }], variable: '--font-source-serif', display: 'swap', adjustFontFallback: 'Times New Roman' });
export const plex = localFont({ src: [{ path: './font-files/IBMPlexSans-latin-var.woff2', weight: '400 600', style: 'normal' }], declarations: [{ prop: 'unicode-range', value: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD' }], variable: '--font-plex', display: 'swap', adjustFontFallback: 'Arial' });
export const plexArabic = localFont({
  src: [
    { path: './font-files/IBMPlexSansArabic-arabic-400.woff2', weight: '400', style: 'normal' },
    { path: './font-files/IBMPlexSansArabic-arabic-500.woff2', weight: '500', style: 'normal' },
    { path: './font-files/IBMPlexSansArabic-arabic-600.woff2', weight: '600', style: 'normal' },
  ],
  declarations: [{ prop: 'unicode-range', value: 'U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC' }],
  variable: '--font-plex-arabic',
  display: 'swap',
  adjustFontFallback: false,
});
export const naskh = localFont({ src: [{ path: './font-files/NotoNaskhArabic-arabic-var.woff2', weight: '500 600', style: 'normal' }], declarations: [{ prop: 'unicode-range', value: 'U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC' }], variable: '--font-naskh', display: 'swap', adjustFontFallback: false });

export const fontVariables = [sourceSerif.variable, plex.variable, plexArabic.variable, naskh.variable].join(' ');
