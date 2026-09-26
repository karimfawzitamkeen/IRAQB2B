/** TAMKEEN DOOH commercial — palette & type (STORYBOARD-TAMKEEN-DOOH.md). */
export const T = {
	night: '#02070B',
	navy: '#04131C',
	navy2: '#071E2B',
	turq: '#13C6B3',
	teal: '#0A5663',
	cyan: '#34E4FF',
	emerald: '#19D38A',
	white: '#F7FBFC',
};
export const TF = {
	ar: '"Cairo", sans-serif',
	en: '"Inter", sans-serif',
};
export const TW = 1080;
export const TH = 1920;
export const TDUR = 750;
export const TCX = 540;
export const TCY = 960;
/** Critical text zone for the outdoor LED screen. */
export const TSAFE = {left: 100, right: 980, top: 180, bottom: 1580};
/** Turquoise glow used on all key type (LED legibility day & night). */
export const glowText = (o = 1) => `0 0 ${18 * o}px rgba(19,198,179,${0.55 * o}), 0 0 ${60 * o}px rgba(19,198,179,${0.35 * o}), 0 4px 24px rgba(0,0,0,0.9)`;
