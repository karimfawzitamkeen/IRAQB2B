import React from 'react';
import {AbsoluteFill} from 'remotion';
import {expoIn, expoOut, kf, lerp, ramp, rnd} from '../../theme';
import {AD_ORDER, AdKind, Statement, hexPath, project} from '../kit';
import {T} from '../theme';

/**
 * Screen-network flight engine: perspective map grid, a tunnel of LED screens, data lines with
 * running pulses, velocity streaks and flying hexagon rings. Used by Scene 4 (network) and
 * Scene 7 (hyper-tunnel).
 */
const GROUND = 330;
const SCREEN_H = 320;
const KIND_BG: Record<AdKind, [string, string]> = {
	fashion: ['#FF5FA2', '#3A1142'],
	tech: [T.cyan, '#06324A'],
	services: [T.emerald, '#0B4A45'],
	retail: ['#FFB23F', '#5A2A05'],
	expo: [T.turq, T.teal],
	food: ['#FF7A45', '#5C1410'],
	brand: [T.turq, T.navy2],
};
const WORD: Record<AdKind, string> = {fashion: 'أزياء', tech: 'تقنية', services: 'خدمات', retail: 'عروض', expo: 'معرض', food: 'مطاعم', brand: ''};

type Node = {x: number; z: number; kind: AdKind; tunnel: boolean};
const NODES: Node[] = [
	...Array.from({length: 60}, (_, k) => ({x: (k % 2 ? 1 : -1) * (300 + rnd(`tx${k}`) * 60), z: 700 + Math.floor(k / 2) * 460, kind: AD_ORDER[k % 6], tunnel: true})),
	...Array.from({length: 50}, (_, k) => ({x: (rnd(`nx${k}`) - 0.5) * 5200, z: 400 + rnd(`nz${k}`) * 14000, kind: AD_ORDER[k % 6], tunnel: false})),
].filter((n) => n.tunnel || Math.abs(n.x) > 700);
const LINKS = NODES.map((n, i) => {
	// connect each node to its nearest neighbour ahead
	let best = -1;
	let bd = 1e9;
	NODES.forEach((m, j) => {
		if (j === i || m.z <= n.z) return;
		const d = Math.hypot(m.x - n.x, (m.z - n.z) * 0.5);
		if (d < bd) {
			bd = d;
			best = j;
		}
	});
	return [i, best] as [number, number];
}).filter(([, b]) => b >= 0);
const STREAKS = Array.from({length: 140}, (_, i) => ({x: (rnd(`sx${i}`) - 0.5) * 3000, y: (rnd(`sy${i}`) - 0.8) * 1600, z: rnd(`sz${i}`) * 12000, c: rnd(`sc${i}`) > 0.5}));

export const Flight: React.FC<{frame: number; camZ: (f: number) => number; opacity?: number; streaks?: number; rings?: number; labels?: boolean}> = ({
	frame: f,
	camZ,
	opacity = 1,
	streaks = 0,
	rings = 0,
	labels = true,
}) => {
	const cam = {x: Math.sin(f / 30) * 40, y: 0, z: camZ(f)};
	const camPrev = {x: Math.sin((f - 1) / 30) * 40, y: 0, z: camZ(f - 1)};
	const speed = cam.z - camPrev.z;
	const LOOP = 14000;
	const wrapZ = (z: number) => {
		let zz = z;
		while (zz < cam.z + 60) zz += LOOP;
		return zz;
	};

	// ground grid
	const grid: string[] = [];
	for (let x = -3000; x <= 3000; x += 300) {
		const a = project(x, GROUND, cam.z + 80, cam);
		const b = project(x, GROUND, cam.z + 9000, cam);
		grid.push(`M${a.sx.toFixed(1)} ${a.sy.toFixed(1)}L${b.sx.toFixed(1)} ${b.sy.toFixed(1)}`);
	}
	const z0 = Math.ceil((cam.z + 80) / 400) * 400;
	for (let z = z0; z < cam.z + 9000; z += 400) {
		const a = project(-3000, GROUND, z, cam);
		const b = project(3000, GROUND, z, cam);
		grid.push(`M${a.sx.toFixed(1)} ${a.sy.toFixed(1)}L${b.sx.toFixed(1)} ${b.sy.toFixed(1)}`);
	}

	const vis = NODES.map((n, i) => ({...n, i, zz: wrapZ(n.z)}))
		.map((n) => {
			const top = project(n.x, GROUND - SCREEN_H, n.zz, cam);
			const bot = project(n.x, GROUND, n.zz, cam);
			const h = bot.sy - top.sy;
			return {...n, top, bot, h, w: (h * 9) / 16, dz: top.dz};
		})
		.filter((n) => n.dz > 60 && n.dz < 11000 && n.top.sx > -400 && n.top.sx < 1480)
		.sort((a, b) => b.dz - a.dz);
	const fade = (dz: number) => Math.min(1, (11000 - dz) / 4000) * Math.min(1, (dz - 60) / 200);

	return (
		<AbsoluteFill style={{opacity}}>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<defs>
					<linearGradient id="fog" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor={T.night} stopOpacity={0} />
						<stop offset="100%" stopColor={T.turq} stopOpacity={0.12} />
					</linearGradient>
				</defs>
				<rect x={0} y={960} width={1080} height={960} fill="url(#fog)" />
				<path d={grid.join('')} fill="none" stroke={T.teal} strokeOpacity={0.55} strokeWidth={1.3} />
				{/* data lines + pulses */}
				{LINKS.map(([a, b], k) => {
					const A = NODES[a];
					const B = NODES[b];
					const za = wrapZ(A.z);
					let zb = za + (B.z - A.z);
					if (zb < za) zb += LOOP;
					const pa = project(A.x, GROUND, za, cam);
					const pb = project(B.x, GROUND, zb, cam);
					if (pa.dz < 60 || pa.dz > 9000) return null;
					const t = ((f * 0.05 + k * 0.13) % 1 + 1) % 1;
					const o = fade(pa.dz);
					return (
						<g key={k} opacity={o}>
							<line x1={pa.sx} y1={pa.sy} x2={pb.sx} y2={pb.sy} stroke={T.turq} strokeWidth={Math.max(1, 3 * pa.k)} strokeOpacity={0.75} />
							<circle cx={lerp(pa.sx, pb.sx, t)} cy={lerp(pa.sy, pb.sy, t)} r={Math.max(2, 7 * pa.k)} fill={T.cyan} style={{filter: `drop-shadow(0 0 6px ${T.cyan})`}} />
						</g>
					);
				})}
				{/* velocity streaks */}
				{streaks > 0
					? STREAKS.map((s, i) => {
							const zz = wrapZ(s.z);
							const a = project(s.x, s.y, zz, cam);
							const b = project(s.x, s.y, zz, {...camPrev, z: camPrev.z - speed * 2});
							if (a.dz < 40 || a.dz > 9000) return null;
							const dx = b.sx - a.sx;
							const dy = b.sy - a.sy;
							const len = Math.hypot(dx, dy);
							const k2 = len > 260 ? 260 / len : 1;
							return <line key={i} x1={a.sx} y1={a.sy} x2={a.sx + dx * k2} y2={a.sy + dy * k2} stroke={s.c ? T.cyan : T.turq} strokeWidth={Math.max(1.2, 4 * a.k)} strokeOpacity={streaks * 0.8 * fade(a.dz)} strokeLinecap="round" />;
						})
					: null}
				{/* hexagon rings flying at the camera */}
				{rings > 0
					? Array.from({length: 8}, (_, i) => {
							const zz = wrapZ(1200 + i * 1500);
							const c = project(0, 40, zz, cam);
							if (c.dz < 80) return null;
							return <path key={i} d={hexPath(700 * c.k, c.sx, c.sy, 0)} fill="none" stroke={i % 2 ? T.cyan : T.turq} strokeWidth={Math.max(1.5, 10 * c.k)} strokeOpacity={rings * fade(c.dz) * 0.9} />;
						})
					: null}
			</svg>
			{/* screens (painter's order) */}
			{vis.map((n) => {
				const [acc, bg] = KIND_BG[n.kind];
				const o = fade(n.dz);
				if (n.h < 6) return null;
				return (
					<div key={n.i} style={{position: 'absolute', left: n.top.sx - n.w / 2, top: n.top.sy, width: n.w, height: n.h, opacity: o, borderRadius: Math.max(2, n.w * 0.03), border: `${Math.max(1, n.w * 0.025)}px solid #1C2A33`, background: `linear-gradient(170deg, ${acc} 0%, ${bg} 45%, ${T.night} 100%)`, boxShadow: `0 0 ${Math.min(80, n.w * 0.4)}px ${acc}88`, overflow: 'hidden'}}>
						{labels && n.w > 70 ? (
							<div dir="rtl" style={{position: 'absolute', left: 0, right: 0, top: '58%', textAlign: 'center', fontFamily: '"Cairo", sans-serif', fontWeight: 900, fontSize: n.w * 0.26, color: T.white, textShadow: `0 0 ${n.w * 0.08}px ${acc}`}}>
								{WORD[n.kind]}
							</div>
						) : null}
						<div style={{position: 'absolute', left: '22%', right: '22%', top: '82%', height: '4%', borderRadius: 99, background: acc}} />
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

/** Scene 4 — The network (240–330f). */
const camS4 = (f: number) => kf(f, [[236, 0], [262, 500], [300, 2400], [334, 5600]], (t) => t * t * (3 - 2 * t));

export const S4Network: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 234 || f > 340) return null;
	const inn = ramp(f, 236, 254, 0, 1, expoOut);
	const out = ramp(f, 326, 338, 0, 1, expoIn);
	const aOut = ramp(f, 282, 290, 0, 1, expoIn);
	// "تعمل من أجلك" flies from deep space to the viewer, holds, then rushes past the camera
	const flyIn = ramp(f, 290, 303, 0, 1, expoOut);
	const past = ramp(f, 320, 332, 0, 1, expoIn);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<Flight frame={f} camZ={camS4} opacity={inn} streaks={ramp(f, 296, 320) * 0.6} />
			{f >= 250 && aOut < 1 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 230, opacity: 1 - aOut, transform: `translateY(${-aOut * 80}px)`}}>
					<div style={{position: 'absolute', left: 60, right: 60, top: -30, height: 420, background: 'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(2,7,11,0.85), rgba(2,7,11,0))'}} />
					<Statement text="شبكة إعلانية" frame={f} start={252} size={132} mode="slam" stagger={4} dur={10} style={{position: 'relative'}} />
					<Statement text="رقمية" frame={f} start={262} size={160} mode="rise" dur={10} color={T.cyan} style={{position: 'relative', marginTop: -10}} />
				</div>
			) : null}
			{f >= 290 ? (
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: 860,
						transform: `scale(${lerp(0.12, 1, flyIn) * (1 + past * 3.2)})`,
						opacity: ramp(f, 290, 296) * (1 - ramp(past, 0.5, 1)),
						filter: past > 0 ? `blur(${past * 16}px)` : flyIn < 1 ? `blur(${(1 - flyIn) * 6}px)` : undefined,
					}}
				>
					<div style={{position: 'absolute', left: 80, right: 80, top: -60, height: 300, background: 'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(2,7,11,0.9), rgba(2,7,11,0))'}} />
					<Statement text="تعمل من أجلك" frame={f} start={290} size={124} mode="fly" stagger={0} dur={1} style={{position: 'relative'}} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/** Scene 7 — TAMKEEN advantage (525–615f): everything accelerates. */
const camS7 = (f: number) => kf(f, [[520, 0], [560, 2600], [600, 8000], [620, 12500]], (t) => t * t);
const ADV = [
	{a: 'مواقع مميزة', b: '', at: 530, end: 557},
	{a: 'شاشات', b: 'عالية الوضوح', at: 558, end: 585},
	{a: 'محتوى رقمي', b: 'متحرك', at: 586, end: 614},
];

export const S7Advantage: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 518 || f > 626) return null;
	const inn = ramp(f, 527, 536, 0, 1, expoOut);
	const out = ramp(f, 610, 624, 0, 1, expoIn);
	return (
		<AbsoluteFill style={{opacity: inn * (1 - out)}}>
			<Flight frame={f} camZ={camS7} streaks={1} rings={1} labels={false} />
			{ADV.map((s, i) => {
				if (f < s.at || f > s.end) return null;
				const o = ramp(f, s.end - 5, s.end, 0, 1, expoIn);
				return (
					<div key={i} style={{position: 'absolute', left: 0, right: 0, top: s.b ? 760 : 840, opacity: 1 - o, transform: `scale(${1 + o * 0.12})`, filter: o > 0 ? `blur(${o * 12}px)` : undefined}}>
						<div style={{position: 'absolute', left: 40, right: 40, top: -80, height: s.b ? 500 : 340, background: 'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(2,7,11,0.92), rgba(2,7,11,0))'}} />
						<Statement text={s.a} frame={f} start={s.at} size={150} mode="slam" stagger={3} dur={8} style={{position: 'relative'}} />
						{s.b ? <Statement text={s.b} frame={f} start={s.at + 5} size={130} mode="slam" stagger={3} dur={8} color={T.cyan} style={{position: 'relative'}} /> : null}
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
