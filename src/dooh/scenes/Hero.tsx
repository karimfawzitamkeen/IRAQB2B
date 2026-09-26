import React from 'react';
import {AbsoluteFill} from 'remotion';
import {backOut, expoIn, expoInOut, expoOut, kf, lerp, ramp, rnd} from '../../theme';
import {DirBlur} from '../../components/Primitives';
import {AdContent, AdKind, LedScreen, Statement} from '../kit';
import {PhotoStage, coverMap} from '../photo';
import {T, TCX, TCY} from '../theme';

/**
 * Scenes 1–3 (0–240f): one continuous screen — spark → outline → power-on & ad cycle → pulled back
 * into a night plaza where it multiplies.
 */

// ---------------------------------------------------------------------------
// Ad cycle with a different transition for every change (base coords 360×640)
// ---------------------------------------------------------------------------
type Cut = {at: number; kind: AdKind; fx: 'on' | 'wipe' | 'slices' | 'split' | 'pixel' | 'glass'};
const HERO_CUTS: Cut[] = [
	{at: 78, kind: 'fashion', fx: 'on'},
	{at: 102, kind: 'tech', fx: 'slices'},
	{at: 114, kind: 'services', fx: 'split'},
	{at: 126, kind: 'retail', fx: 'pixel'},
	{at: 138, kind: 'expo', fx: 'glass'},
	{at: 168, kind: 'food', fx: 'wipe'},
	{at: 196, kind: 'fashion', fx: 'slices'},
	{at: 222, kind: 'tech', fx: 'pixel'},
];

const PIX = Array.from({length: 60}, (_, i) => ({x: (i % 6) * 60, y: Math.floor(i / 6) * 64, r: rnd(`pix${i}`)}));

export const AdCycle: React.FC<{frame: number; cuts: Cut[]; seed?: number}> = ({frame: f, cuts, seed = 0}) => {
	let i = -1;
	cuts.forEach((c, k) => {
		if (f >= c.at) i = k;
	});
	if (i < 0) return null;
	const cur = cuts[i];
	const prev = i > 0 ? cuts[i - 1] : null;
	const t = ramp(f, cur.at, cur.at + 8, 0, 1, expoOut);
	const next = <AdContent kind={cur.kind} frame={f} seed={seed + i} />;
	const old = prev ? <AdContent kind={prev.kind} frame={f} seed={seed + i - 1} /> : null;
	if (t >= 1 || !old) {
		if (cur.fx === 'on') {
			// CRT-style power on: a bright line opens vertically
			const o = ramp(f, cur.at, cur.at + 7, 0, 1, expoOut);
			return (
				<div style={{position: 'absolute', inset: 0}}>
					<div style={{position: 'absolute', inset: 0, transform: `scaleY(${Math.max(0.01, o)})`}}>{next}</div>
					{o < 1 ? <div style={{position: 'absolute', left: 0, right: 0, top: 318, height: 4, background: '#fff', boxShadow: `0 0 30px 10px ${T.cyan}`, opacity: 1 - o}} /> : null}
				</div>
			);
		}
		return next;
	}
	const layer = (clip: React.CSSProperties, child = next, key = 'n') => (
		<div key={key} style={{position: 'absolute', inset: 0, ...clip}}>
			{child}
		</div>
	);
	let incoming: React.ReactNode = null;
	if (cur.fx === 'wipe') incoming = layer({clipPath: `inset(0 0 ${(1 - t) * 100}% 0)`});
	if (cur.fx === 'split')
		incoming = (
			<>
				{layer({clipPath: 'inset(0 0 50% 0)', transform: `translateY(${-(1 - t) * 320}px)`}, next, 'a')}
				{layer({clipPath: 'inset(50% 0 0 0)', transform: `translateY(${(1 - t) * 320}px)`}, next, 'b')}
			</>
		);
	if (cur.fx === 'slices')
		incoming = Array.from({length: 6}, (_, k) => {
			const tk = ramp(f, cur.at + k, cur.at + k + 6, 0, 1, expoOut);
			return (
				<div key={k} style={{position: 'absolute', left: k * 60, top: 0, width: 60, height: 640, overflow: 'hidden', transform: `perspective(600px) rotateY(${(1 - tk) * 90}deg)`, opacity: tk}}>
					<div style={{position: 'absolute', left: -k * 60, top: 0, width: 360, height: 640}}>{next}</div>
				</div>
			);
		});
	if (cur.fx === 'pixel') {
		const d = PIX.filter((p) => p.r < t * 1.15)
			.map((p) => `M${p.x} ${p.y}h60v64h-60z`)
			.join('');
		incoming = d ? layer({clipPath: `path('${d}')`}) : null;
	}
	if (cur.fx === 'glass') {
		const y = lerp(-200, 840, t);
		incoming = (
			<>
				{layer({clipPath: `polygon(0 0, 360px 0, 360px ${y - 120}px, 0 ${y}px)`, filter: t < 0.9 ? `blur(${(1 - t) * 3}px)` : undefined})}
				<div style={{position: 'absolute', left: -20, right: -20, top: y - 70, height: 10, background: T.cyan, boxShadow: `0 0 24px 6px ${T.cyan}`, transform: 'rotate(-18deg)', opacity: 0.9}} />
			</>
		);
	}
	return (
		<div style={{position: 'absolute', inset: 0}}>
			{old}
			{incoming}
		</div>
	);
};

// ---------------------------------------------------------------------------
// Hero screen pose across S1–S3
// ---------------------------------------------------------------------------
const heroPose = (f: number) => {
	const push = ramp(f, 26, 80, 0, 1, (t) => t);
	const up = ramp(f, 84, 100, 0, 1, expoInOut);
	const back = ramp(f, 148, 174, 0, 1, expoInOut);
	const w = lerp(lerp(640 * (1 + push * 0.08), 520, up), LAND.w, back);
	const cy = lerp(lerp(TCY, 770, up), LAND.cy, back);
	const cx = lerp(TCX, LAND.cx, back);
	return {w, cy, cx, back};
};

// Real screens in the fair photograph (photo pixels, measured): big totem, mid totem, far totem.
const FAIR = coverMap('fair');
const quad = (pts: [number, number][]) => pts.map(([x, y]) => [FAIR.x(x), FAIR.y(y)] as [number, number]);
const REAL: {pts: [number, number][]; at: number; cuts: Cut[]}[] = [
	{pts: quad([[154, 480], [226.5, 484], [232.5, 644], [154, 644]]), at: 168, cuts: HERO_CUTS},
	{pts: quad([[331.5, 596], [364, 596], [364, 660], [331.5, 660]]), at: 180, cuts: [{at: 176, kind: 'retail', fx: 'on'}, {at: 204, kind: 'services', fx: 'wipe'}]},
	{pts: quad([[398.5, 630], [416, 630], [416, 668], [398.5, 668]]), at: 196, cuts: [{at: 192, kind: 'expo', fx: 'on'}, {at: 216, kind: 'food', fx: 'split'}]},
];
const bbox = (pts: [number, number][]) => {
	const xs = pts.map((p) => p[0]);
	const ys = pts.map((p) => p[1]);
	return {x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys)};
};
const BIG = bbox(REAL[0].pts);
/** Where the hero screen lands: the big real totem (content height matched, width cropped). */
const LAND = {cx: BIG.x + BIG.w / 2, cy: BIG.y + BIG.h / 2, w: (BIG.h * 9) / 16};

/** Screen replacement: our animated ad, clipped to a real screen's quad, locked to the photo. */
const ScreenReplace: React.FC<{f: number; pts: [number, number][]; cuts: Cut[]; o: number; seed: number}> = ({f, pts, cuts, o, seed}) => {
	const b = bbox(pts);
	const s = b.h / 640;
	const poly = pts.map(([x, y]) => `${(x - b.x).toFixed(1)}px ${(y - b.y).toFixed(1)}px`).join(', ');
	return (
		<div style={{position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, opacity: o}}>
			<div style={{position: 'absolute', inset: -b.w * 0.6, background: `radial-gradient(ellipse 50% 50% at 50% 50%, rgba(19,198,179,${0.35 * o}), rgba(19,198,179,0) 70%)`}} />
			<div style={{position: 'absolute', inset: 0, clipPath: `polygon(${poly})`, overflow: 'hidden', background: '#02070B', boxShadow: `0 0 30px ${T.turq}`}}>
				<div style={{position: 'absolute', left: (b.w - 360 * s) / 2, top: 0, width: 360, height: 640, transform: `scale(${s})`, transformOrigin: '0 0'}}>
					<AdCycle frame={f} cuts={cuts} seed={seed} />
				</div>
				<div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 3px)'}} />
			</div>
		</div>
	);
};

const PANELS: {photo: 'tower' | 'park' | 'building'; at: number}[] = [
	{photo: 'building', at: 208},
	{photo: 'tower', at: 212},
	{photo: 'park', at: 216},
];

export const Hero: React.FC<{frame: number}> = ({frame: f}) => {
	if (f > 250) return null;
	const pose = heroPose(f);
	const prev = heroPose(f - 1);
	const hh = (pose.w * 16) / 9;
	const open = ramp(f, 14, 30, 0, 1, expoOut);
	const plaza = ramp(f, 146, 168);
	const exit = ramp(f, 236, 250, 0, 1, expoIn);

	// S1: spark → outline
	const spark = ramp(f, 8, 14, 0, 1, backOut) * (1 - ramp(f, 16, 24));
	const ow = lerp(8, 640, open) * (1 + ramp(f, 26, 80, 0, 1, (t) => t) * 0.08);
	const oh = lerp(8, 1138, ramp(f, 16, 32, 0, 1, expoOut)) * (1 + ramp(f, 26, 80, 0, 1, (t) => t) * 0.08);
	const edge = ramp(f, 26, 30) * (1 - ramp(f, 30, 40));
	const power = ramp(f, 76, 84);

	// statements
	const s1out = ramp(f, 70, 80, 0, 1, expoIn);
	const s2a = f >= 94 && f < 126;
	const s2aOut = ramp(f, 118, 126, 0, 1, expoIn);
	const s2bOut = ramp(f, 146, 156, 0, 1, expoIn);
	const s3aOut = ramp(f, 204, 212, 0, 1, expoIn);
	const s3bOut = ramp(f, 234, 244, 0, 1, expoIn);

	return (
		<AbsoluteFill style={{opacity: 1 - exit, transform: `scale(${1 + exit * 0.3})`, filter: exit > 0 ? `blur(${exit * 10}px)` : undefined}}>
			{/* the real fair plaza (photo), settling around the landing screen so the screen stays locked */}
			{plaza > 0 ? (
				<AbsoluteFill style={{opacity: plaza}}>
					<PhotoStage photo="fair" scale={lerp(1.35, 1, ramp(f, 146, 172, 0, 1, expoOut)) * lerp(1, 1.1, ramp(f, 176, 240, 0, 1, (t) => t))} origin={`${LAND.cx}px ${LAND.cy}px`}>
						{REAL.map((r, k) => {
							const o = ramp(f, r.at, r.at + 8);
							if (o <= 0) return null;
							const flash = ramp(f, r.at, r.at + 16, 0, 1, expoOut);
							const b = bbox(r.pts);
							return (
								<React.Fragment key={k}>
									<ScreenReplace f={f} pts={r.pts} cuts={r.cuts} o={o} seed={k * 11} />
									{k > 0 && flash < 1 ? <div style={{position: 'absolute', left: b.x + b.w / 2 - 10 - flash * 90, top: b.y + b.h / 2 - 10 - flash * 90, width: 20 + flash * 180, height: 20 + flash * 180, borderRadius: '50%', border: `3px solid ${T.cyan}`, opacity: 1 - flash}} /> : null}
								</React.Fragment>
							);
						})}
					</PhotoStage>
					{/* night grade for cohesion */}
					<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(2,7,11,0.55) 0%, rgba(2,7,11,0) 30%, rgba(2,7,11,0) 70%, rgba(2,7,11,0.6) 100%)'}} />
				</AbsoluteFill>
			) : null}
			{/* …then several screens: real TAMKEEN screens as vertical panels */}
			{PANELS.map((p, k) => {
				const a = ramp(f, p.at, p.at + 12, 0, 1, expoOut);
				if (a <= 0) return null;
				return (
					<div key={k} style={{position: 'absolute', left: k * 360, top: 0, width: 360, height: 1920, overflow: 'hidden', transform: `translateY(${(1 - a) * (k % 2 ? -1920 : 1920)}px)`, borderLeft: k ? `3px solid ${T.turq}` : undefined, boxShadow: `0 0 30px rgba(19,198,179,0.5)`}}>
						<div style={{position: 'absolute', left: -k * 360, top: 0, width: 1080, height: 1920}}>
							<PhotoStage photo={p.photo} scale={1.15 + ramp(f, p.at, 250) * 0.1} origin={`${k * 360 + 180}px 960px`} x={(1 - k) * 0} />
						</div>
						<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(2,7,11,0.75) 0%, rgba(2,7,11,0) 35%)'}} />
					</div>
				);
			})}

			{/* the hero screen */}
			{f >= 8 && f < 76 ? (
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
					{spark > 0 ? (
						<g>
							<circle cx={TCX} cy={TCY} r={10 * spark} fill={T.turq} style={{filter: `drop-shadow(0 0 20px ${T.turq})`}} />
							{[0, 8].map((d, k) => {
								const r = ramp(f, 10 + d, 40 + d, 0, 1, expoOut);
								return r > 0 && r < 1 ? <circle key={k} cx={TCX} cy={TCY} r={20 + r * 300} fill="none" stroke={T.cyan} strokeWidth={3} strokeOpacity={(1 - r) * 0.8} /> : null;
							})}
						</g>
					) : null}
					{open > 0 ? (
						<g>
							<rect x={TCX - ow / 2} y={TCY - oh / 2} width={ow} height={oh} rx={10} fill="rgba(19,198,179,0.04)" stroke={T.turq} strokeWidth={4} style={{filter: `drop-shadow(0 0 ${14 + edge * 30}px ${T.turq})`}} />
							{[
								[-1, -1],
								[1, -1],
								[-1, 1],
								[1, 1],
							].map(([sx, sy], k) => (
								<path key={k} d={`M${TCX + (sx * ow) / 2} ${TCY + (sy * oh) / 2 - sy * 60} V${TCY + (sy * oh) / 2} H${TCX + (sx * ow) / 2 - sx * 60}`} fill="none" stroke={T.cyan} strokeWidth={8} strokeLinecap="round" />
							))}
							{/* LED scan-lines pass through the type */}
							<rect x={TCX - ow / 2} y={TCY - oh / 2 + ((f * 18) % oh)} width={ow} height={60} fill={T.cyan} opacity={0.08} />
						</g>
					) : null}
				</svg>
			) : null}
			{f >= 76 && f < 178 ? (
				<DirBlur id="hero" vx={0} vy={pose.cy - prev.cy} k={0.3}>
					<div style={{position: 'absolute', left: pose.cx - pose.w / 2, top: pose.cy - hh / 2, opacity: 1 - ramp(f, 168, 176)}}>
						<LedScreen w={pose.w} power={power} glare={kf(f, [[100, -0.6], [118, 1.6]], (t) => t)}>
							<AdCycle frame={f} cuts={HERO_CUTS} />
						</LedScreen>
					</div>
				</DirBlur>
			) : null}

			{/* S1 — "اجعل علامتك تُرى" lit by the screen */}
			{f >= 30 && s1out < 1 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 690, opacity: 1 - s1out, transform: `translateY(${-s1out * 120}px) scale(${1 + s1out * 0.2})`}}>
					<Statement text="اجعل علامتك" frame={f} start={48} size={128} mode="rise" stagger={3} dur={10} />
					<Statement text="تُرى" frame={f} start={32} size={300} mode="slam" dur={10} style={{marginTop: -30}} />
				</div>
			) : null}

			{/* S2 — two statements, two motion styles, lower band */}
			{s2a ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1330, opacity: 1 - s2aOut, transform: `translateY(${-s2aOut * 90}px)`}}>
					<Statement text="إعلانك هنا" frame={f} start={94} size={150} mode="slam" stagger={3} dur={9} />
				</div>
			) : null}
			{f >= 122 && s2bOut < 1 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1340, opacity: 1 - s2bOut, transform: `translateY(${s2bOut * 60}px)`}}>
					<Statement text="في قلب الحدث" frame={f} start={122} size={132} mode="rise" stagger={4} dur={12} />
					<div style={{margin: '4px auto 0', height: 10, borderRadius: 5, width: 700 * ramp(f, 128, 142, 0, 1, expoOut), background: `linear-gradient(90deg, ${T.cyan}, ${T.turq})`, boxShadow: `0 0 24px ${T.turq}`}} />
				</div>
			) : null}

			{/* S3 — real-world impact, top band over the night sky */}
			{f >= 178 && s3aOut < 1 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 250, opacity: 1 - s3aOut, transform: `translateX(${s3aOut * 200}px)`}}>
					<Statement text="حضور أقوى" frame={f} start={178} size={160} mode="slam" stagger={4} dur={10} />
				</div>
			) : null}
			{f >= 206 && s3bOut < 1 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 256, opacity: 1 - s3bOut}}>
					<Statement text="مشاهدة أكثر" frame={f} start={206} size={136} mode="rise" stagger={4} dur={10} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};
