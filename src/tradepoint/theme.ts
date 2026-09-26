/** TRADEPOINT commercial — identity, type and editable content constants (STORYBOARD-TRADEPOINT.md). */
export const P = {
	navy: '#0C1E3C',
	deep: '#102A52',
	night: '#050D1C',
	gold: '#D4A629',
	goldLight: '#F0CC6A',
	white: '#F5F5F2',
	gray: '#EAECEF',
	ink: '#15233F',
	teal: '#1FA59A',
	muted: 'rgba(245,245,242,0.7)',
};
export const PF = {
	ar: '"IBM Plex Sans Arabic", sans-serif',
	en: '"Inter", sans-serif',
};
export const PW = 1080;
export const PH = 1920;
export const PDUR = 900;
export const PCX = 540;
export const PSAFE = {left: 100, right: 980, top: 180, bottom: 1580};

/** Wordmark spelling (brief used both TRADPOINT and TradePoint) — single constant. */
export const BRAND = 'TRADEPOINT';
/** Homepage stats: values from the brief; labels to be confirmed with the platform. */
export const STATS: {value: number; suffix: string; label: string}[] = [
	{value: 2500, suffix: '+', label: 'أعضاء'},
	{value: 180, suffix: '+', label: 'شركات دولية'},
	{value: 45, suffix: '+', label: 'قطاعات'},
];

export const goldGlow = (o = 1) => `0 0 ${16 * o}px rgba(212,166,41,${0.5 * o}), 0 0 ${50 * o}px rgba(212,166,41,${0.28 * o}), 0 4px 22px rgba(0,0,0,0.9)`;
export const whiteGlow = (o = 1) => `0 0 ${14 * o}px rgba(245,245,242,${0.35 * o}), 0 4px 24px rgba(0,0,0,0.9)`;
