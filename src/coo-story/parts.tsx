import React from 'react';
import {C, kf, ramp, smooth} from '../theme';
import {CITIES, arcPath, arcPoints, pointAt, project, type GlobeCam} from '../components/Globe';
import {AF} from '../coo-ar/theme';
import {OLD, ST, VO} from './theme';

// ---------------------------------------------------------------------------
// Globe camera: a full planet for the opening, a dive into Iraq, then back for the meaning.
// Baghdad sits at the view centre whenever lat0 = 33 and lon0 = 44.
// ---------------------------------------------------------------------------
export const storyCam = (f: number): GlobeCam => {
	const R = kf(f, [[0, 420], [150, 440], [212, 2600], [3030, 360], [3080, 400], [3240, 420]]);
	const lat0 = kf(f, [[0, 20], [150, 33], [3030, 30], [3240, 30]]);
	const lon0 = f < 1000 ? kf(f, [[0, 6], [150, 44], [212, 44]]) : 30 + (f - 3030) * 0.05;
	const cx = kf(f, [[0, 700], [120, 700], [200, 960], [3030, 960]]);
	const cy = f < 1000 ? kf(f, [[0, 560], [120, 560], [200, 540]]) : 640;
	return {
		lon0,
		lat0,
		cx,
		cy,
		R,
		opacity: kf(f, [[0, 0], [24, 0], [70, 1], [170, 1], [212, 0], [3030, 0], [3070, 0.95], [3226, 0.95], [3262, 0]]),
		blur: kf(f, [[0, 0], [170, 0], [212, 4]]),
		arcs: 0,
	};
};

const DESTS = ['rotterdam', 'hamburg', 'shanghai', 'dubai', 'mumbai', 'singapore', 'istanbul', 'newyork', 'lagos', 'capetown', 'jeddah', 'busan', 'saopaulo', 'beijing', 'genoa', 'mombasa'];

/**
 * Routes out of Iraq. `paper`: small documents ride the arcs (the old world);
 * `digital`: light packets and gold attaché rings at each destination.
 */
export const Routes: React.FC<{frame: number; mode: 'paper' | 'digital'; start: number; o: number}> = ({frame: f, mode, start, o}) => {
	if (o <= 0) return null;
	const v = storyCam(f);
	const home = CITIES.baghdad;
	const ph = project(home[0], home[1], v);
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: o * v.opacity, overflow: 'visible'}}>
			{DESTS.map((d, i) => {
				const s = start + i * 5;
				const head = ramp(f, s, s + 34, 0, 1, smooth);
				if (head <= 0) return null;
				const pts = arcPoints(home, CITIES[d], v, 64, 1.1);
				const end = project(CITIES[d][0], CITIES[d][1], v);
				const digital = mode === 'digital';
				const col = digital ? C.cyan : OLD.amber;
				const items = [0, 0.5].map((off) => {
					const t = (((f - s) / (digital ? 40 : 70) + off + i * 0.13) % 1 + 1) % 1;
					return {t, p: pointAt(pts, t)};
				});
				return (
					<g key={d}>
						<path d={arcPath(pts, 0, head)} stroke={col} strokeOpacity={digital ? 0.55 : 0.4} strokeWidth={digital ? 1.8 : 1.4} fill="none" />
						{head >= 1
							? items.map(({t, p}, k) =>
									p.visible ? (
										digital ? (
											<circle key={k} cx={p.x} cy={p.y} r={3.2} fill="#E6FBFF" opacity={Math.sin(t * Math.PI)} style={{filter: `drop-shadow(0 0 6px ${C.cyan})`}} />
										) : (
											<rect key={k} x={p.x - 6} y={p.y - 8} width={12} height={16} rx={1.5} fill={OLD.paper} opacity={Math.sin(t * Math.PI) * 0.95} transform={`rotate(${(t * 90 + i * 30) % 40 - 20} ${p.x} ${p.y})`} style={{filter: 'drop-shadow(0 0 4px rgba(224,164,88,0.8))'}} />
										)
									) : null,
								)
							: null}
						{end.z > 0 && head >= 1 ? (
							digital ? (
								<g>
									<circle cx={end.x} cy={end.y} r={7} fill="none" stroke={C.gold} strokeWidth={1.6} />
									<circle cx={end.x} cy={end.y} r={2.6} fill={C.gold} />
								</g>
							) : (
								<circle cx={end.x} cy={end.y} r={2.6} fill={OLD.amber} />
							)
						) : null}
					</g>
				);
			})}
			{ph.z > 0 ? (
				<g>
					<circle cx={ph.x} cy={ph.y} r={10 + 3 * Math.sin(f / 6)} fill={mode === 'digital' ? C.gold : OLD.amber} style={{filter: `drop-shadow(0 0 14px ${mode === 'digital' ? C.gold : OLD.amber})`}} />
					<circle cx={ph.x} cy={ph.y} r={22 + ((f % 40) / 40) * 30} fill="none" stroke={mode === 'digital' ? C.gold : OLD.amber} strokeOpacity={1 - (f % 40) / 40} strokeWidth={2} />
				</g>
			) : null}
		</svg>
	);
};

// ---------------------------------------------------------------------------
// Old-world paper sheet
// ---------------------------------------------------------------------------
export const Paper: React.FC<{w: number; h: number; stamp?: boolean; style?: React.CSSProperties; tint?: string}> = ({w, h, stamp = true, style, tint}) => (
	<div style={{position: 'relative', width: w, height: h, borderRadius: w * 0.03, background: `linear-gradient(170deg, ${OLD.paper}, ${OLD.paperDark})`, boxShadow: '0 18px 44px rgba(0,0,0,0.55)', padding: w * 0.11, boxSizing: 'border-box', overflow: 'hidden', ...style}}>
		{[0.8, 0.6, 0.7, 0.5, 0.65, 0.4].map((k, i) => (
			<div key={i} style={{height: Math.max(2, h * 0.025), width: `${k * 100}%`, marginLeft: 'auto', borderRadius: 4, background: OLD.ink, marginBottom: h * 0.055}} />
		))}
		{stamp ? <div style={{position: 'absolute', left: w * 0.1, bottom: w * 0.1, width: w * 0.28, height: w * 0.28, borderRadius: '50%', border: `${Math.max(1.5, w * 0.014)}px solid rgba(150,40,40,0.45)`}} /> : null}
		{tint ? <div style={{position: 'absolute', inset: 0, background: tint}} /> : null}
	</div>
);

/** A paper folder: tab + two sheets peeking out. */
export const Folder: React.FC<{w: number; color?: string; glow?: string}> = ({w, color = OLD.amber, glow}) => {
	const h = w * 0.76;
	return (
		<div style={{position: 'relative', width: w, height: h, filter: glow ? `drop-shadow(0 0 ${w * 0.12}px ${glow})` : 'drop-shadow(0 10px 20px rgba(0,0,0,0.6))'}}>
			<div style={{position: 'absolute', left: w * 0.12, top: -h * 0.08, width: w * 0.7, height: h * 0.8, background: OLD.paper, borderRadius: 3, transform: 'rotate(-4deg)'}} />
			<div style={{position: 'absolute', left: w * 0.2, top: -h * 0.02, width: w * 0.7, height: h * 0.8, background: '#F6F0E2', borderRadius: 3, transform: 'rotate(3deg)'}} />
			<div style={{position: 'absolute', left: 0, top: h * 0.12, width: w * 0.38, height: h * 0.14, background: color, borderRadius: `${w * 0.04}px ${w * 0.04}px 0 0`}} />
			<div style={{position: 'absolute', left: 0, top: h * 0.22, width: w, height: h * 0.78, background: `linear-gradient(180deg, ${color}, #A9722F)`, borderRadius: w * 0.04}} />
		</div>
	);
};

// ---------------------------------------------------------------------------
// Extra icons (48×48 stroke), same drawing grammar as the ceremony kit
// ---------------------------------------------------------------------------
const PATHS: Record<string, React.ReactNode> = {
	plane: <path d="M44 22 C44 20 42 19 40 19 H30 L20 5 H15 L21 19 H11 L7 13 H3 L6 24 L3 35 H7 L11 29 H21 L15 43 H20 L30 29 H40 C42 29 44 28 44 26 Z" />,
	car: (
		<g>
			<path d="M6 30 V24 L11 14 H37 L42 24 V30 Z" />
			<path d="M6 24 H42" />
			<circle cx={14} cy={33} r={4} />
			<circle cx={34} cy={33} r={4} />
		</g>
	),
	embassy: (
		<g>
			<path d="M6 18 L24 7 L42 18 Z" />
			<path d="M10 22 V36 M18 22 V36 M30 22 V36 M38 22 V36" />
			<path d="M6 40 H42 M8 36 H40" />
			<path d="M24 7 V1 L31 3 L24 5" />
		</g>
	),
	queue: (
		<g>
			{[9, 24, 39].map((x) => (
				<g key={x}>
					<circle cx={x} cy={16} r={5} />
					<path d={`M${x - 8} 40 C ${x - 7} 27, ${x + 7} 27, ${x + 8} 40`} />
				</g>
			))}
		</g>
	),
	upload: (
		<g>
			<path d="M24 32 V8 M14 18 L24 8 L34 18" />
			<path d="M8 30 V40 H40 V30" />
		</g>
	),
	customs: (
		<g>
			<rect x={5} y={16} width={38} height={22} rx={2} />
			<path d="M12 16 V38 M19 16 V38 M26 16 V38 M33 16 V38" />
			<path d="M10 10 H38" />
		</g>
	),
	bank: (
		<g>
			<path d="M5 17 L24 6 L43 17 Z" />
			<path d="M10 21 V35 M18 21 V35 M30 21 V35 M38 21 V35" />
			<path d="M5 40 H43" />
			<circle cx={24} cy={13} r={2.2} />
		</g>
	),
	gov: (
		<g>
			<path d="M14 18 C14 10 34 10 34 18" />
			<path d="M24 6 V10" />
			<path d="M8 18 H40 M10 22 V38 M17 22 V38 M24 22 V38 M31 22 V38 M38 22 V38 M6 42 H42" />
		</g>
	),
	bolt: <path d="M27 4 L10 27 H23 L20 44 L38 19 H25 Z" />,
	route: (
		<g>
			<circle cx={10} cy={38} r={4} />
			<circle cx={38} cy={10} r={4} />
			<path d="M13 35 C 30 30, 14 18, 35 13" strokeDasharray="3 4" />
		</g>
	),
};
export const SIcon: React.FC<{name: string; size: number; color?: string; stroke?: number}> = ({name, size, color = C.gold, stroke = 2.4}) => (
	<svg width={size} height={size} viewBox="0 0 48 48" style={{overflow: 'visible', flexShrink: 0}}>
		<g fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
			{PATHS[name]}
		</g>
	</svg>
);

// ---------------------------------------------------------------------------
// Burned-in voice-over captions for review copies (the narrator records to these cues).
// ---------------------------------------------------------------------------
export const Captions: React.FC<{frame: number}> = ({frame: f}) => {
	const cue = VO.find((c) => f >= c.a && f < c.b);
	if (!cue) return null;
	const o = ramp(f, cue.a, cue.a + 6) * (1 - ramp(f, cue.b - 6, cue.b));
	return (
		<div style={{position: 'absolute', left: 160, right: 160, bottom: 34, display: 'flex', justifyContent: 'center', opacity: o}}>
			<div dir="rtl" lang="ar" style={{maxWidth: 1500, padding: '10px 30px', borderRadius: 14, background: 'rgba(0,0,0,0.72)', fontFamily: AF.body, fontWeight: 600, fontSize: 34, lineHeight: 1.5, color: '#FFFFFF', textAlign: 'center'}}>
				{cue.text}
			</div>
		</div>
	);
};

/** True while f is inside [a-pre, b+post) of a scene window. */
export const inScene = (f: number, w: readonly [number, number], pre = 0, post = 0) => f >= w[0] - pre && f < w[1] + post;
export {ST};
