import React from 'react';
import {geoContains, geoInterpolate} from 'd3-geo';
import {feature} from 'topojson-client';
import landTopo from 'world-atlas/land-110m.json';
import {C, kf, ramp, smooth, expoInOut} from '../theme';

const DEG = Math.PI / 180;

export type View = {lon0: number; lat0: number; R: number; cx: number; cy: number};

// ---------------------------------------------------------------------------
// Land dot-matrix (computed once per render tab)
// ---------------------------------------------------------------------------
let DOTS: [number, number][] | null = null;
const getDots = () => {
	if (DOTS) return DOTS;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const topo = landTopo as any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const land = feature(topo, topo.objects.land) as any;
	const out: [number, number][] = [];
	const step = 1.25;
	for (let lat = -58; lat <= 80; lat += step) {
		const n = Math.max(1, Math.round((360 * Math.cos(lat * DEG)) / step));
		for (let i = 0; i < n; i++) {
			const lon = -180 + ((i + 0.5) * 360) / n;
			if (geoContains(land, [lon, lat])) out.push([lat, lon]);
		}
	}
	DOTS = out;
	return out;
};

export const project = (lat: number, lon: number, v: View, alt = 0) => {
	const la = lat * DEG;
	const lo = (lon - v.lon0) * DEG;
	const x = Math.cos(la) * Math.sin(lo);
	const y = Math.sin(la);
	const z = Math.cos(la) * Math.cos(lo);
	const a = v.lat0 * DEG;
	const y2 = y * Math.cos(a) - z * Math.sin(a);
	const z2 = y * Math.sin(a) + z * Math.cos(a);
	const s = v.R * (1 + alt);
	const sx = v.cx + s * x;
	const sy = v.cy - s * y2;
	const r2 = (s * s * (x * x + y2 * y2)) / (v.R * v.R);
	return {x: sx, y: sy, z: z2, visible: z2 > 0 || r2 > 1};
};

export const CITIES: Record<string, [number, number]> = {
	rotterdam: [51.9, 4.5],
	hamburg: [53.5, 10],
	shanghai: [31.2, 121.5],
	dubai: [25.2, 55.3],
	mumbai: [19, 72.8],
	singapore: [1.3, 103.8],
	istanbul: [41, 29],
	newyork: [40.7, -74],
	baghdad: [33.3, 44.4],
	basra: [30.5, 47.8],
	lagos: [6.5, 3.4],
	capetown: [-33.9, 18.4],
	jeddah: [21.5, 39.2],
	busan: [35.1, 129],
	saopaulo: [-23.5, -46.6],
	beijing: [39.9, 116.4],
	genoa: [44.4, 8.9],
	mombasa: [-4, 39.7],
};

/** Great-circle arc lifted above the surface; returns projected polyline. */
export const arcPoints = (a: [number, number], b: [number, number], v: View, n = 72, lift = 1) => {
	const interp = geoInterpolate([a[1], a[0]], [b[1], b[0]]);
	const dLon = (b[1] - a[1]) * DEG;
	const cosd =
		Math.sin(a[0] * DEG) * Math.sin(b[0] * DEG) +
		Math.cos(a[0] * DEG) * Math.cos(b[0] * DEG) * Math.cos(dLon);
	const dist = Math.acos(Math.max(-1, Math.min(1, cosd)));
	const h = (0.04 + dist * 0.17) * lift;
	const pts: {x: number; y: number; visible: boolean}[] = [];
	for (let i = 0; i <= n; i++) {
		const t = i / n;
		const [lon, lat] = interp(t);
		pts.push(project(lat, lon, v, h * Math.sin(Math.PI * t)));
	}
	return pts;
};

/** Polyline between t0..t1 (fractions), split where hidden. */
export const arcPath = (pts: {x: number; y: number; visible: boolean}[], t0: number, t1: number) => {
	const n = pts.length - 1;
	const i0 = Math.max(0, Math.floor(t0 * n));
	const i1 = Math.min(n, Math.ceil(t1 * n));
	let d = '';
	let pen = false;
	for (let i = i0; i <= i1; i++) {
		const p = pts[i];
		if (!p.visible) {
			pen = false;
			continue;
		}
		d += `${pen ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
		pen = true;
	}
	return d;
};

export const pointAt = (pts: {x: number; y: number; visible: boolean}[], t: number) => {
	const n = pts.length - 1;
	const f = Math.max(0, Math.min(n, t * n));
	const i = Math.floor(f);
	const j = Math.min(n, i + 1);
	const u = f - i;
	return {
		x: pts[i].x + (pts[j].x - pts[i].x) * u,
		y: pts[i].y + (pts[j].y - pts[i].y) * u,
		visible: pts[i].visible,
	};
};

// ---------------------------------------------------------------------------
// Camera path for the globe across the whole film (continuity layer)
// ---------------------------------------------------------------------------
export type GlobeCam = View & {opacity: number; blur: number; arcs: number};

export const globeView = (f: number): GlobeCam => ({
	lon0: 14 + f * 0.085,
	lat0: kf(f, [[0, 20], [355, 22], [392, 26], [452, 44], [750, 46]]),
	cx: kf(f, [[0, 1190], [85, 1210], [108, 960], [355, 960], [392, 660], [428, 660], [458, 900], [750, 960]]),
	cy: kf(f, [[0, 570], [85, 540], [108, 560], [355, 560], [392, 560], [428, 560], [458, 1420], [750, 1460]]),
	R: kf(f, [[0, 320], [50, 400], [85, 418], [108, 560], [355, 580], [392, 380], [428, 392], [458, 1050], [750, 1100]], expoInOut),
	opacity: kf(f, [[0, 0], [8, 0], [48, 1], [82, 1], [108, 0.1], [352, 0.1], [392, 1], [428, 1], [458, 0.42], [490, 0.3], [600, 0.26], [640, 0.1], [750, 0.1]]),
	blur: kf(f, [[0, 0], [85, 0], [108, 2.5], [352, 2.5], [392, 0], [750, 0]]),
	arcs: kf(f, [[0, 1], [85, 1], [108, 0.6], [352, 0.6], [392, 0.35], [750, 0.35]]),
});

const ARCS: {a: string; b: string; s: number; d: number}[] = [
	{a: 'rotterdam', b: 'dubai', s: 8, d: 34},
	{a: 'shanghai', b: 'basra', s: 14, d: 40},
	{a: 'newyork', b: 'hamburg', s: 18, d: 36},
	{a: 'mumbai', b: 'istanbul', s: 23, d: 30},
	{a: 'singapore', b: 'jeddah', s: 28, d: 36},
	{a: 'lagos', b: 'rotterdam', s: 33, d: 32},
	{a: 'capetown', b: 'dubai', s: 38, d: 36},
	{a: 'baghdad', b: 'genoa', s: 44, d: 32},
	{a: 'busan', b: 'mumbai', s: 48, d: 38},
	{a: 'saopaulo', b: 'lagos', s: 54, d: 34},
	{a: 'mombasa', b: 'basra', s: 58, d: 28},
	{a: 'istanbul', b: 'shanghai', s: 64, d: 40},
];

const dotPath = (pts: {x: number; y: number; r: number}[]) =>
	pts
		.map(
			(p) =>
				`M${(p.x - p.r).toFixed(1)} ${p.y.toFixed(1)}a${p.r} ${p.r} 0 1 0 ${(2 * p.r).toFixed(2)} 0a${p.r} ${p.r} 0 1 0 ${(-2 * p.r).toFixed(2)} 0`,
		)
		.join('');

export const Globe: React.FC<{frame: number; cam?: (f: number) => GlobeCam; w?: number; h?: number}> = ({
	frame,
	cam = globeView,
	w = 1920,
	h = 1080,
}) => {
	const v = cam(frame);
	if (v.opacity <= 0.001) return null;
	const dots = getDots();

	// depth-bucketed land dots → 4 paths (cheap DOM)
	const buckets: {x: number; y: number; r: number}[][] = [[], [], [], []];
	const rs = Math.min(v.R / 400, 1.2);
	for (const [lat, lon] of dots) {
		const p = project(lat, lon, v);
		if (p.z <= 0.02) continue;
		if (p.y < -20 || p.y > h + 20 || p.x < -20 || p.x > w + 20) continue;
		const b = Math.min(3, Math.floor(p.z * 4));
		buckets[b].push({x: p.x, y: p.y, r: (0.9 + p.z * 1.05) * rs});
	}

	// graticule
	const grat: string[] = [];
	for (let lon = -180; lon < 180; lon += 20) {
		let d = '';
		let pen = false;
		for (let lat = -90; lat <= 90; lat += 4) {
			const p = project(lat, lon, v);
			if (p.z < 0) {
				pen = false;
				continue;
			}
			d += `${pen ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
			pen = true;
		}
		grat.push(d);
	}
	for (let lat = -60; lat <= 60; lat += 20) {
		let d = '';
		let pen = false;
		for (let lon = -180; lon <= 180; lon += 4) {
			const p = project(lat, lon, v);
			if (p.z < 0) {
				pen = false;
				continue;
			}
			d += `${pen ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
			pen = true;
		}
		grat.push(d);
	}

	const bucketStyle = [
		{fill: C.cyan, o: 0.16},
		{fill: '#8FE6FF', o: 0.32},
		{fill: '#CFF4FF', o: 0.5},
		{fill: '#FFFFFF', o: 0.72},
	];

	return (
		<svg
			width={w}
			height={h}
			style={{
				position: 'absolute',
				inset: 0,
				opacity: v.opacity,
				filter: v.blur > 0.3 ? `blur(${v.blur}px)` : undefined,
			}}
		>
			<defs>
				<radialGradient id="g-body" cx="38%" cy="30%" r="75%">
					<stop offset="0%" stopColor="#0E2A4E" />
					<stop offset="55%" stopColor="#061429" />
					<stop offset="100%" stopColor="#020610" />
				</radialGradient>
				<radialGradient id="g-atmo" cx="50%" cy="50%" r="50%">
					<stop offset="80%" stopColor={C.cyan} stopOpacity={0} />
					<stop offset="84.5%" stopColor={C.cyan} stopOpacity={0.22} />
					<stop offset="88%" stopColor={C.cyan} stopOpacity={0.07} />
					<stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
				</radialGradient>
				<linearGradient id="g-rim" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stopColor={C.cyan} stopOpacity={0.9} />
					<stop offset="45%" stopColor={C.cyan} stopOpacity={0.05} />
					<stop offset="100%" stopColor={C.gold} stopOpacity={0.35} />
				</linearGradient>
			</defs>
			<circle cx={v.cx} cy={v.cy} r={v.R * 1.19} fill="url(#g-atmo)" />
			<circle cx={v.cx} cy={v.cy} r={v.R} fill="url(#g-body)" />
			<g stroke="rgba(160,220,255,0.07)" strokeWidth={1} fill="none">
				{grat.map((d, i) => (
					<path key={i} d={d} />
				))}
			</g>
			{buckets.map((b, i) => (
				<path key={i} d={dotPath(b)} fill={bucketStyle[i].fill} fillOpacity={bucketStyle[i].o} />
			))}
			<circle cx={v.cx} cy={v.cy} r={v.R} fill="none" stroke="url(#g-rim)" strokeWidth={1.4} />
			<g opacity={v.arcs}>
				{ARCS.map((arc, i) => (
					<TradeArc key={i} frame={frame} arc={arc} v={v} idx={i} />
				))}
			</g>
		</svg>
	);
};

const TradeArc: React.FC<{frame: number; arc: (typeof ARCS)[number]; v: View; idx: number}> = ({
	frame,
	arc,
	v,
	idx,
}) => {
	const head = ramp(frame, arc.s, arc.s + arc.d, 0, 1, smooth);
	if (head <= 0) return null;
	const a = CITIES[arc.a];
	const b = CITIES[arc.b];
	const pts = arcPoints(a, b, v);
	const tailBright = Math.max(0, head - 0.28);
	const land = ramp(frame, arc.s + arc.d - 4, arc.s + arc.d + 18);
	const pa = project(a[0], a[1], v);
	const pb = project(b[0], b[1], v);
	// recurring data pulses once the route exists
	const period = 46 + (idx % 4) * 9;
	const pulseT = ((frame - arc.s - arc.d + idx * 11) % period) / period;
	const pulse = frame > arc.s + arc.d ? pointAt(pts, pulseT) : null;
	const hp = pointAt(pts, head);
	return (
		<g>
			<path d={arcPath(pts, 0, head)} stroke={C.cyan} strokeOpacity={0.34} strokeWidth={1.2} fill="none" />
			{head < 1 ? (
				<path
					d={arcPath(pts, tailBright, head)}
					stroke="#BDF1FF"
					strokeOpacity={0.9}
					strokeWidth={1.8}
					fill="none"
					strokeLinecap="round"
				/>
			) : null}
			{head < 1 && hp.visible ? <circle cx={hp.x} cy={hp.y} r={3} fill="#fff" style={{filter: `drop-shadow(0 0 6px ${C.cyan})`}} /> : null}
			{pulse && pulse.visible ? (
				<circle cx={pulse.x} cy={pulse.y} r={2.2} fill={idx % 3 === 0 ? C.gold : '#DFF8FF'} opacity={Math.sin(pulseT * Math.PI)} />
			) : null}
			{pa.z > 0 ? <circle cx={pa.x} cy={pa.y} r={2.4} fill={C.cyan} /> : null}
			{pb.z > 0 && land > 0 ? (
				<>
					<circle cx={pb.x} cy={pb.y} r={2.6} fill="#fff" />
					<circle
						cx={pb.x}
						cy={pb.y}
						r={4 + land * 16}
						fill="none"
						stroke={C.cyan}
						strokeOpacity={(1 - land) * 0.8}
					/>
				</>
			) : null}
		</g>
	);
};
