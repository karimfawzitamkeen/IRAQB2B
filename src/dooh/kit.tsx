import React from 'react';
import {expoOut, ramp, rnd} from '../theme';
import {T, TF, glowText} from './theme';

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

/**
 * Giant Arabic statement. Animates per WORD (never per letter) so cursive joining is preserved.
 * mode 'slam': words scale down from large with blur; 'rise': masked rise from below, RTL order.
 */
export const Statement: React.FC<{
	text: string;
	frame: number;
	start: number;
	size: number;
	mode?: 'slam' | 'rise' | 'fly';
	stagger?: number;
	dur?: number;
	color?: string;
	weight?: number;
	glow?: number;
	style?: React.CSSProperties;
}> = ({text, frame, start, size, mode = 'rise', stagger = 3, dur = 12, color = T.white, weight = 900, glow = 1, style}) => {
	const words = text.split(' ');
	return (
		<div dir="rtl" lang="ar" style={{display: 'flex', justifyContent: 'center', flexWrap: 'nowrap', whiteSpace: 'nowrap', fontFamily: TF.ar, fontWeight: weight, fontSize: size, lineHeight: 1.15, color, ...style}}>
			{words.map((w, i) => {
				const p = ramp(frame, start + i * stagger, start + i * stagger + dur, 0, 1, expoOut);
				const tr =
					mode === 'slam'
						? `scale(${1 + (1 - p) * 1.1})`
						: mode === 'fly'
							? `scale(${0.15 + 0.85 * p})`
							: `translateY(${(1 - p) * 0.6}em)`;
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							marginInlineEnd: i < words.length - 1 ? '0.22em' : 0,
							transform: tr,
							opacity: p,
							filter: p < 1 ? `blur(${(1 - p) * (mode === 'rise' ? 10 : 18)}px)` : undefined,
							// restrained glitch accent: a 2–3 frame RGB split as a slam lands
							textShadow: mode === 'slam' && p > 0.55 && p < 0.8 ? `6px 0 rgba(255,40,90,0.55), -6px 0 rgba(52,228,255,0.7), ${glowText(glow)}` : glowText(glow),
						}}
					>
						{w}
					</span>
				);
			})}
		</div>
	);
};

// ---------------------------------------------------------------------------
// Hexagons (TAMKEEN motif)
// ---------------------------------------------------------------------------
export const hexPoints = (r: number, cx = 0, cy = 0, rot = -Math.PI / 2) =>
	Array.from({length: 6}, (_, i) => {
		const a = rot + (Math.PI / 3) * i;
		return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number];
	});
export const hexPath = (r: number, cx = 0, cy = 0, rot = -Math.PI / 2) =>
	hexPoints(r, cx, cy, rot)
		.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`)
		.join('') + 'Z';

/** Hex grid pattern as a single path (cheap). */
export const hexGridPath = (r: number, cols: number, rows: number, ox = 0, oy = 0) => {
	const w = Math.sqrt(3) * r;
	let d = '';
	for (let row = 0; row < rows; row++)
		for (let c = 0; c < cols; c++) {
			const cx = ox + c * w + (row % 2) * (w / 2);
			const cy = oy + row * r * 1.5;
			d += hexPath(r * 0.94, cx, cy);
		}
	return d;
};

// ---------------------------------------------------------------------------
// Generated, brandless ad content (base canvas 360 × 640, scaled by the screen)
// ---------------------------------------------------------------------------
export type AdKind = 'fashion' | 'tech' | 'services' | 'retail' | 'expo' | 'food' | 'brand';
export const AD_ORDER: AdKind[] = ['fashion', 'tech', 'services', 'retail', 'expo', 'food'];

const AD_STYLE: Record<AdKind, {bg: string; accent: string; word: string}> = {
	fashion: {bg: 'linear-gradient(165deg, #3A1142 0%, #1B0A26 60%, #0B0612 100%)', accent: '#FF5FA2', word: 'أزياء'},
	tech: {bg: 'linear-gradient(165deg, #06324A 0%, #041B2B 60%, #020A12 100%)', accent: T.cyan, word: 'تقنية'},
	services: {bg: 'linear-gradient(165deg, #0B4A45 0%, #062825 60%, #02110F 100%)', accent: T.emerald, word: 'خدمات'},
	retail: {bg: 'linear-gradient(165deg, #5A2A05 0%, #2D1503 60%, #120801 100%)', accent: '#FFB23F', word: 'عروض'},
	expo: {bg: `linear-gradient(165deg, ${T.teal} 0%, #06303A 60%, #031419 100%)`, accent: T.turq, word: 'معرض'},
	food: {bg: 'linear-gradient(165deg, #5C1410 0%, #2E0A08 60%, #120403 100%)', accent: '#FF7A45', word: 'مطاعم'},
	brand: {bg: `linear-gradient(165deg, #0B2F3A 0%, ${T.navy2} 60%, ${T.night} 100%)`, accent: T.turq, word: 'علامتك'},
};

export const AdContent: React.FC<{kind: AdKind; frame: number; seed?: number}> = ({kind, frame: f, seed = 0}) => {
	const st = AD_STYLE[kind];
	const t = f + seed * 13;
	const a = st.accent;
	return (
		<div style={{position: 'absolute', inset: 0, background: st.bg, overflow: 'hidden'}}>
			<svg width={360} height={640} viewBox="0 0 360 640" style={{position: 'absolute', inset: 0}}>
				<defs>
					<radialGradient id={`adg-${kind}-${seed}`} cx="50%" cy="42%" r="55%">
						<stop offset="0%" stopColor={a} stopOpacity={0.55} />
						<stop offset="100%" stopColor={a} stopOpacity={0} />
					</radialGradient>
				</defs>
				<circle cx={180} cy={270} r={230} fill={`url(#adg-${kind}-${seed})`} />
				{kind === 'fashion' ? (
					<g fill="none" stroke={a} strokeWidth={3}>
						<circle cx={180} cy={150} r={34} fill={a} fillOpacity={0.25} />
						<path d="M150 200 Q180 186 210 200 L250 420 Q180 440 110 420 Z" fill={a} fillOpacity={0.3} />
						<path d={`M60 ${480 + Math.sin(t / 8) * 6} Q180 ${440 + Math.cos(t / 7) * 8} 300 480`} strokeOpacity={0.7} />
					</g>
				) : null}
				{kind === 'tech' ? (
					<g transform={`translate(180 270) rotate(${-12 + Math.sin(t / 12) * 4})`}>
						<rect x={-70} y={-140} width={140} height={280} rx={24} fill="#0A2233" stroke={a} strokeWidth={3} />
						<rect x={-58} y={-120} width={116} height={236} rx={12} fill={a} fillOpacity={0.25} />
						<circle cx={0} cy={0} r={40 + Math.sin(t / 5) * 4} fill="none" stroke={a} strokeWidth={4} />
					</g>
				) : null}
				{kind === 'services' ? (
					<g fill="none" stroke={a} strokeWidth={4} transform="translate(180 270)">
						{[60, 100, 140].map((r, i) => (
							<circle key={i} r={r} strokeOpacity={0.9 - i * 0.25} strokeDasharray={i === 1 ? '14 10' : undefined} transform={`rotate(${t * (i % 2 ? -2 : 2)})`} />
						))}
						<path d="M-28 2 L-6 24 L32 -20" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
					</g>
				) : null}
				{kind === 'retail' ? (
					<g>
						<text x={180} y={330} textAnchor="middle" fontFamily={TF.en} fontWeight={900} fontSize={230} fill={a}>
							%
						</text>
						<path d="M70 120 L150 120 L190 160 L110 240 L70 200 Z" fill="none" stroke={a} strokeWidth={4} transform={`rotate(${Math.sin(t / 9) * 6} 120 180)`} />
					</g>
				) : null}
				{kind === 'expo' ? <path d={hexGridPath(34, 7, 9, 0, 60)} fill="none" stroke={a} strokeOpacity={0.55} strokeWidth={2} transform={`translate(0 ${-(t * 1.5) % 51})`} /> : null}
				{kind === 'food' ? (
					<g fill="none" stroke={a} strokeWidth={4} transform="translate(180 290)">
						<ellipse rx={130} ry={40} fill={a} fillOpacity={0.2} />
						<ellipse cy={-20} rx={90} ry={60} fill={a} fillOpacity={0.35} />
						{[-40, 0, 40].map((x, i) => (
							<path key={i} d={`M${x} -110 q 16 -24 0 -48 q -16 -24 0 -48`} strokeOpacity={0.5 + 0.3 * Math.sin(t / 5 + i)} />
						))}
					</g>
				) : null}
				{kind === 'brand' ? null : <line x1={40} y1={560} x2={320} y2={560} stroke={a} strokeOpacity={0.4} />}
			</svg>
			{kind !== 'brand' ? (
				<>
					<div dir="rtl" style={{position: 'absolute', left: 0, right: 0, top: 430, textAlign: 'center', fontFamily: TF.ar, fontWeight: 900, fontSize: 92, color: T.white, textShadow: `0 0 30px ${a}`}}>
						{st.word}
					</div>
					<div style={{position: 'absolute', left: 110, right: 110, top: 580, height: 36, borderRadius: 18, background: a, opacity: 0.9}} />
				</>
			) : null}
		</div>
	);
};

// ---------------------------------------------------------------------------
// LED screen: bezel, content, scan-lines, glare. Base 360×640 content scaled to width w.
// ---------------------------------------------------------------------------
export const LedScreen: React.FC<{
	w: number;
	children?: React.ReactNode;
	power?: number; // 0 off … 1 on
	glow?: number;
	glare?: number; // 0..1 sweep position
	stand?: boolean;
	style?: React.CSSProperties;
}> = ({w, children, power = 1, glow = 1, glare = -1, stand = false, style}) => {
	const h = (w * 16) / 9;
	const s = w / 360;
	const bez = Math.max(4, w * 0.035);
	return (
		<div style={{position: 'relative', width: w, height: h, ...style}}>
			{/* light spill */}
			<div style={{position: 'absolute', left: -w * 0.5, right: -w * 0.5, top: -h * 0.2, bottom: -h * 0.2, background: `radial-gradient(ellipse 50% 50% at 50% 50%, rgba(19,198,179,${0.28 * glow * power}) 0%, rgba(19,198,179,0) 70%)`, pointerEvents: 'none'}} />
			<div style={{position: 'absolute', inset: -bez, borderRadius: bez * 1.2, background: 'linear-gradient(160deg, #1C2A33, #070C10)', boxShadow: `0 0 ${40 * glow * power}px rgba(19,198,179,${0.45 * power}), 0 ${h * 0.05}px ${h * 0.12}px rgba(0,0,0,0.7)`}} />
			<div style={{position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: bez * 0.4, background: '#020608'}}>
				<div style={{position: 'absolute', left: 0, top: 0, width: 360, height: 640, transform: `scale(${s})`, transformOrigin: '0 0', opacity: power}}>{children}</div>
				{/* LED scan-lines + glare */}
				<div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 3px)', opacity: 0.6}} />
				{glare > -0.5 && glare < 1.5 ? (
					<div style={{position: 'absolute', top: -h * 0.2, bottom: -h * 0.2, width: w * 0.5, left: -w * 0.6 + glare * w * 1.7, transform: 'rotate(18deg)', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.22), rgba(255,255,255,0))'}} />
				) : null}
				<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(170deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 35%)'}} />
			</div>
			{stand ? (
				<>
					<div style={{position: 'absolute', left: w * 0.42, width: w * 0.16, top: h + bez, height: h * 0.16, background: 'linear-gradient(90deg, #0B141A, #1F2E37, #0B141A)'}} />
					<div style={{position: 'absolute', left: w * 0.2, width: w * 0.6, top: h + bez + h * 0.16, height: h * 0.035, borderRadius: 4, background: '#101B22'}} />
				</>
			) : null}
		</div>
	);
};

// ---------------------------------------------------------------------------
// Tiny 3D camera: project world (x, y, z) with the camera looking down +z.
// ---------------------------------------------------------------------------
export const FOCAL = 900;
export const project = (x: number, y: number, z: number, cam: {x: number; y: number; z: number}) => {
	const dz = z - cam.z;
	const k = FOCAL / Math.max(1, dz);
	return {sx: 540 + (x - cam.x) * k, sy: 960 + (y - cam.y) * k, k, dz};
};

/** Deterministic random helper re-export. */
export const r01 = (s: string) => rnd(s);
