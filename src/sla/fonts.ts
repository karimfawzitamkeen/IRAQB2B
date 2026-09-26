import '@fontsource/ibm-plex-sans-arabic/latin-300.css';
import '@fontsource/ibm-plex-sans-arabic/latin-400.css';
import '@fontsource/ibm-plex-sans-arabic/latin-500.css';
import '@fontsource/ibm-plex-sans-arabic/latin-600.css';
import '@fontsource/ibm-plex-sans-arabic/arabic-300.css';
import '@fontsource/ibm-plex-sans-arabic/arabic-400.css';
import '@fontsource/ibm-plex-sans-arabic/arabic-500.css';
import '@fontsource/ibm-plex-sans-arabic/arabic-600.css';
import '@fontsource/amiri/latin-400.css';
import '@fontsource/amiri/latin-700.css';
import '@fontsource/amiri/arabic-400.css';
import '@fontsource/amiri/arabic-700.css';

/** [font, sample] — the Arabic sample forces the Arabic subset to load before rendering. */
export const SLA_FONT_FACES: [string, string][] = [
	['300 20px "IBM Plex Sans Arabic"', 'القانون'],
	['400 20px "IBM Plex Sans Arabic"', 'القانون'],
	['500 20px "IBM Plex Sans Arabic"', 'القانون'],
	['600 20px "IBM Plex Sans Arabic"', 'القانون'],
	['400 20px "Amiri"', 'المادة ٢٥'],
	['700 20px "Amiri"', 'المادة ٢٥'],
];
