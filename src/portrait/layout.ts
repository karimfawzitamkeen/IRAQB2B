import {expoInOut, kf} from '../theme';
import type {GlobeCam} from '../components/Globe';

/** Native portrait canvas (STORYBOARD.md §2). */
export const PW = 1080;
export const PH = 1920;
export const CX = 540;

/** Critical zone for text & key information. Centred blocks ≤ 720 px (x 180–900). */
export const SAFE = {left: 100, right: 900, top: 250, bottom: 1500, centredMax: 720};

/** Scene ownership windows (STORYBOARD.md §3). */
export const T = {
	s1: [0, 90],
	s2: [90, 180],
	s3: [180, 255],
	s4: [255, 330],
	s5: [330, 420],
	s6: [420, 495],
	s7: [495, 600],
	s8: [600, 750],
} as const;

/**
 * Globe camera across the whole portrait film:
 * dome (S1) → dim dome (S2–S3) → planet horizon (S4) → dim / faint horizon (S5–S8).
 */
export const portraitGlobe = (f: number): GlobeCam => ({
	lon0: 20 + f * 0.08 + kf(f, [[228, 0], [276, 40]]),
	lat0: kf(f, [[0, 20], [228, 20], [276, -20], [750, -22]]),
	cx: CX,
	cy: kf(f, [[0, 620], [74, 600], [104, 250], [236, 250], [276, 1790], [336, 1800], [360, 1960], [750, 2000]]),
	R: kf(
		f,
		[[0, 330], [50, 450], [74, 462], [104, 640], [236, 660], [276, 820], [336, 830], [360, 900], [750, 920]],
		expoInOut,
	),
	opacity: kf(f, [[0, 0], [8, 0], [48, 1], [76, 1], [104, 0.13], [236, 0.13], [272, 1], [312, 1], [336, 0.5], [360, 0.34], [495, 0.3], [600, 0.24], [640, 0.12], [750, 0.12]]),
	blur: kf(f, [[0, 0], [76, 0], [104, 2.5], [236, 2.5], [272, 0], [750, 0]]),
	arcs: kf(f, [[0, 1], [76, 1], [104, 0.6], [236, 0.6], [272, 0.3], [750, 0.3]]),
});
