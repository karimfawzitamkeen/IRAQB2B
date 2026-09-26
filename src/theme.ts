import {Easing, interpolate, random} from 'remotion';

export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 30;
export const DURATION = 750;

export const C = {
	black: '#02040A',
	navy: '#061226',
	navy2: '#0B1D3A',
	white: '#F4F7FB',
	dim: 'rgba(244,247,251,0.56)',
	faint: 'rgba(244,247,251,0.28)',
	line: 'rgba(244,247,251,0.14)',
	cyan: '#4FD8FF',
	cyanSoft: 'rgba(79,216,255,0.35)',
	gold: '#D9B46A',
	goldSoft: 'rgba(217,180,106,0.35)',
};

export const F = {
	sans: '"Inter", sans-serif',
	mono: '"JetBrains Mono", monospace',
	serif: '"Cormorant Garamond", serif',
};

// Easing vocabulary (see STORYBOARD.md §2)
export const expoOut = Easing.bezier(0.16, 1, 0.3, 1);
export const expoIn = Easing.bezier(0.7, 0, 0.84, 0);
export const expoInOut = Easing.bezier(0.87, 0, 0.13, 1);
export const smooth = Easing.bezier(0.65, 0, 0.35, 1);
export const backOut = Easing.bezier(0.34, 1.56, 0.64, 1);
export const linear = (t: number) => t;

/** Clamped ramp: maps frame in [a,b] to [from,to] with easing. */
export const ramp = (
	f: number,
	a: number,
	b: number,
	from = 0,
	to = 1,
	ease: (t: number) => number = expoOut,
) =>
	interpolate(f, [a, b], [from, to], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: ease,
	});

/** Piecewise keyframes, each segment eased with `ease`. */
export const kf = (
	f: number,
	pts: [number, number][],
	ease: (t: number) => number = smooth,
) => {
	if (f <= pts[0][0]) return pts[0][1];
	for (let i = 0; i < pts.length - 1; i++) {
		const [f0, v0] = pts[i];
		const [f1, v1] = pts[i + 1];
		if (f <= f1) {
			const t = f1 === f0 ? 1 : ease((f - f0) / (f1 - f0));
			return v0 + (v1 - v0) * t;
		}
	}
	return pts[pts.length - 1][1];
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const rnd = (seed: string | number) => random(seed);

/** Quadratic Bézier point. */
export const qbez = (
	p0: [number, number],
	c: [number, number],
	p1: [number, number],
	t: number,
): [number, number] => {
	const u = 1 - t;
	return [
		u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0],
		u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1],
	];
};

const GLYPHS = 'ABCDEF0123456789#%&$@*+=/<>';
/** Decode-style text: characters resolve left to right out of random glyphs. */
export const scramble = (text: string, p: number, frame: number, seed = 's') => {
	const n = text.length;
	const head = p * (n + 6);
	return text
		.split('')
		.map((ch, i) => {
			if (ch === ' ') return ' ';
			if (head >= i + 6) return ch;
			if (head >= i) {
				const g = Math.floor(rnd(`${seed}-${i}-${Math.floor(frame / 2)}`) * GLYPHS.length);
				return GLYPHS[g];
			}
			return ' ';
		})
		.join('');
};
