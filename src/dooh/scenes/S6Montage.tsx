import React from 'react';
import {AbsoluteFill} from 'remotion';
import {expoIn, expoInOut, expoOut, lerp, ramp} from '../../theme';
import {Statement} from '../kit';
import {PhotoKey, PhotoStage} from '../photo';
import {T, TCX} from '../theme';

/**
 * Scene 6 — High visibility (435–525f): montage of four generated outdoor locations with
 * vertical-slice, zoom-through and light-streak transitions.
 */
const V2 = 470;
const V3 = 492;
const V4 = 512;

/** A real TAMKEEN screen photograph as a moving plate with a light sweep and cohesive night grade. */
const Plate: React.FC<{f: number; photo: PhotoKey; t0: number; t1: number; from: number; to: number; rot?: number; panX?: number; y?: number; origin?: string}> = ({f, photo, t0, t1, from, to, rot = 0, panX = 0, y = 0, origin}) => {
	const t = ramp(f, t0, t1, 0, 1, (x) => x);
	const sweep = ramp(f, t0 + 2, t0 + 16, -0.3, 1.3, expoInOut);
	return (
		<AbsoluteFill>
			<PhotoStage photo={photo} scale={lerp(from, to, t)} rotate={rot * (1 - t)} x={panX * t} y={y} origin={origin} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(2,7,11,0.7) 0%, rgba(2,7,11,0.1) 32%, rgba(2,7,11,0.1) 68%, rgba(2,7,11,0.65) 100%)'}} />
			{sweep > -0.3 && sweep < 1.3 ? (
				<div style={{position: 'absolute', top: -300, height: 2600, width: 220, left: -300 + sweep * 1500, transform: 'rotate(16deg)', background: 'linear-gradient(90deg, rgba(52,228,255,0), rgba(255,255,255,0.16), rgba(52,228,255,0))', mixBlendMode: 'screen'}} />
			) : null}
		</AbsoluteFill>
	);
};

export const S6Montage: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 440 || f > 534) return null;
	const inn = ramp(f, 442, 452, 0, 1, expoOut);
	const out = ramp(f, 520, 529, 0, 1, expoIn);
	// V1 → V2: vertical slices (one clipped copy of V2, 8 staggered bars)
	const slices = Array.from({length: 8}, (_, k) => ramp(f, V2 - 6 + k, V2 + k, 0, 1, expoOut));
	const slicePath = slices.map((s, k) => `M${k * 135} 0h135v${(s * 1920).toFixed(0)}h-135z`).join('');
	// V2 → V3: zoom through
	const zoom = ramp(f, V3 - 6, V3 + 2, 0, 1, expoIn);
	const v3in = ramp(f, V3 - 2, V3 + 8, 0, 1, expoOut);
	// V3 → V4: light-streak wipe
	const streak = ramp(f, V4 - 4, V4 + 6, 0, 1, expoInOut);
	const sx = lerp(-400, 1500, streak);

	const aOut = ramp(f, 486, 493, 0, 1, expoIn);
	return (
		<AbsoluteFill style={{opacity: inn * (1 - ramp(out, 0.4, 1)), transform: `scale(${1 + out * 1.6})`, filter: out > 0 ? `blur(${out * 14}px)` : undefined}}>
			{f < V2 + 4 ? (
				<Plate f={f} photo="tower" t0={444} t1={474} from={1.28} to={1.08} rot={-3} origin="560px 900px" />
			) : null}
			{f >= V2 - 6 && f < V3 + 2 ? (
				<AbsoluteFill style={{clipPath: f < V2 + 8 ? `path('${slicePath}')` : undefined, transform: `scale(${1 + zoom * 2.4})`, filter: zoom > 0 ? `blur(${zoom * 14}px)` : undefined, opacity: 1 - ramp(zoom, 0.6, 1)}}>
					<Plate f={f} photo="billboard" t0={V2 - 6} t1={V3 + 2} from={1.02} to={1.12} panX={-30} y={250} origin="560px 900px" />
				</AbsoluteFill>
			) : null}
			{f >= V3 - 2 && f < V4 + 7 ? (
				<AbsoluteFill style={{transform: `scale(${lerp(0.7, 1, v3in)})`, opacity: v3in}}>
					<Plate f={f} photo="park" t0={V3 - 2} t1={V4 + 7} from={1.12} to={1.3} origin="540px 820px" />
				</AbsoluteFill>
			) : null}
			{f >= V4 - 4 ? (
				<AbsoluteFill style={{clipPath: streak < 1 ? `polygon(0 0, ${sx}px 0, ${sx - 500}px 1920px, 0 1920px)` : undefined}}>
					<Plate f={f} photo="building" t0={V4 - 4} t1={534} from={1.1} to={1.26} rot={2} origin="520px 900px" />
				</AbsoluteFill>
			) : null}
			{streak > 0 && streak < 1 ? (
				<div style={{position: 'absolute', top: -200, height: 2400, width: 40, left: sx - 270, transform: 'rotate(14.6deg)', background: `linear-gradient(90deg, rgba(52,228,255,0), #fff, rgba(52,228,255,0))`, boxShadow: `0 0 60px 20px ${T.cyan}`}} />
			) : null}

			{/* statements */}
			{f >= 458 && aOut < 1 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 220, opacity: 1 - aOut, transform: `scale(${1 - aOut * 0.3})`}}>
					<div style={{position: 'absolute', left: 30, right: 30, top: -40, height: 470, background: 'radial-gradient(ellipse 58% 50% at 50% 50%, rgba(2,7,11,0.9), rgba(2,7,11,0))'}} />
					<Statement text="علامتك" frame={f} start={458} size={160} mode="slam" dur={9} style={{position: 'relative'}} />
					<Statement text="أمام الجمهور" frame={f} start={463} size={140} mode="rise" stagger={4} dur={10} color={T.cyan} style={{position: 'relative'}} />
				</div>
			) : null}
			{f >= 492 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 700}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: -60, height: 520, background: 'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(2,7,11,0.96), rgba(2,7,11,0.6) 60%, rgba(2,7,11,0))'}} />
					<Statement text="كل يوم" frame={f} start={492} size={262} mode="slam" stagger={4} dur={9} style={{position: 'relative'}} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};
