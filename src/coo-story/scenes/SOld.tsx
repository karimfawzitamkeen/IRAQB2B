import React from 'react';
import {AbsoluteFill} from 'remotion';
import {expoIn, expoInOut, expoOut, kf, lerp, ramp, smooth} from '../../theme';
import {ArChip, ArIcon} from '../../coo-ar/kit';
import {AF} from '../../coo-ar/theme';
import {Folder, SIcon} from '../parts';
import {OLD, ST} from '../theme';

/**
 * Scenes 2–3 (210–810f): the old journey, read right to left — trader, travel, embassy, waiting,
 * papers, audit — then one missing document sends the file back to the start while the clock runs.
 */
const STATIONS = [
	{x: 1700, label: 'التاجر', icon: 'trader'},
	{x: 1400, label: 'سفر', icon: 'plane'},
	{x: 1100, label: 'السفارة', icon: 'embassy'},
	{x: 800, label: 'انتظار', icon: 'queue'},
	{x: 500, label: 'تقديم الأوراق', icon: 'doc'},
	{x: 220, label: 'تدقيق', icon: 'eye'},
];
const ROAD_Y = 640;
const KIT_ICONS = new Set(['trader', 'doc', 'eye']);

const roadPt = (u: number) => {
	const i = Math.max(0, Math.min(4, Math.floor(u)));
	const t = Math.max(0, Math.min(1, u - i));
	const x = lerp(STATIONS[i].x, STATIONS[i + 1].x, t);
	const y = ROAD_Y + Math.sin(Math.PI * t) * 46 * (i % 2 ? 1 : -1);
	return {x, y};
};
const roadD = (u1: number) => {
	let d = '';
	for (let k = 0; k <= 200; k++) {
		const u = (k / 200) * u1;
		const p = roadPt(u);
		d += `${k ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
	}
	return d;
};

/** Where the file is on the road (station index, fractional). */
const fileU = (f: number) =>
	kf(f, [[290, 0], [304, 0], [340, 1], [352, 1], [384, 2], [398, 2], [424, 3], [474, 3], [498, 4], [518, 4], [548, 5], [612, 5], [672, 0], [706, 0], [790, 0.7]], smooth);

const WORDS = [
	{t: 'وقت', icon: 'clock'},
	{t: 'جهد', icon: 'queue'},
	{t: 'كلفة', icon: 'coin'},
	{t: 'تنقل', icon: 'car'},
];
const CLOCK = [
	{a: 650, t: 'يوم واحد'},
	{a: 682, t: '7 أيام'},
	{a: 714, t: 'أسبوعان'},
	{a: 746, t: 'شهر'},
];

export const SOld: React.FC<{frame: number}> = ({frame: f}) => {
	const [a] = ST.journey;
	const [, b] = ST.rewind;
	if (f < a - 6 || f > b + 24) return null;
	// intro: the dot from the globe becomes a paper folder, then takes its place at the trader
	const grow = ramp(f, a - 6, a + 30, 0, 1, expoOut);
	const toRoad = ramp(f, a + 44, a + 84, 0, 1, expoInOut);
	// outro: the road dissolves, the folder flies to the centre for the transformation
	const dissolve = ramp(f, b - 26, b + 6, 0, 1, smooth);
	const toCentre = ramp(f, b - 24, b + 4, 0, 1, expoInOut);
	const roadIn = ramp(f, a + 26, a + 90, 0, 1, smooth);
	const red = ramp(f, 606, 622) * (1 - ramp(f, 700, 760));
	const u = fileU(f);
	const rp = roadPt(u);
	const moving = Math.abs(fileU(f + 1) - u) > 0.004;
	const rewinding = f >= 612 && f < 672;
	const onRoad = {x: rp.x, y: rp.y - 118};
	let fx = lerp(960, onRoad.x, toRoad);
	let fy = lerp(540, onRoad.y, toRoad);
	let fw = lerp(260 * grow, 124, toRoad);
	fx = lerp(fx, 960, toCentre);
	fy = lerp(fy, 560, toCentre);
	fw = lerp(fw, 300, toCentre);
	const clockO = ramp(f, 640, 656) * (1 - ramp(f, 784, 800));
	const hands = f < 640 ? 0 : Math.pow(ramp(f, 640, 790, 0, 1, (t) => t), 1.6) * 360 * 10;
	return (
		<AbsoluteFill>
			{/* era tag */}
			<div style={{position: 'absolute', right: 110, top: 80, opacity: ramp(f, a + 20, a + 36) * (1 - dissolve)}}>
				<ArChip text="سابقاً" color={OLD.amber} p={1} frame={f} size={44} icon="clock" />
			</div>

			{/* road and stations */}
			<div style={{position: 'absolute', inset: 0, opacity: (1 - dissolve) * (1 - 0.55 * clockO), filter: dissolve > 0 ? `blur(${dissolve * 10}px)` : undefined}}>
				<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
					<path d={roadD(5 * roadIn)} fill="none" stroke={OLD.road} strokeWidth={6} strokeDasharray="18 14" strokeLinecap="round" />
					{red > 0 ? <path d={roadD(5)} fill="none" stroke={OLD.red} strokeOpacity={red} strokeWidth={7} strokeLinecap="round" style={{filter: `drop-shadow(0 0 12px ${OLD.red})`}} /> : null}
				</svg>
				{STATIONS.map((s, i) => {
					const p = ramp(f, a + 34 + i * 9, a + 54 + i * 9, 0, 1, expoOut);
					const here = Math.abs(u - i) < 0.08 && !moving && f > a + 84;
					const y = ROAD_Y + 0;
					const hot = i === 5 && red > 0;
					const col = hot ? OLD.red : OLD.amber;
					return (
						<div key={i} style={{position: 'absolute', left: s.x - 120, width: 240, top: y - 64, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: p, transform: `scale(${0.7 + 0.3 * p})`}}>
							<div style={{width: 128, height: 128, borderRadius: '50%', border: `3px solid ${col}`, background: here ? 'rgba(224,164,88,0.18)' : 'rgba(20,14,8,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: here ? `0 0 34px ${col}` : '0 10px 30px rgba(0,0,0,0.6)'}}>
								{KIT_ICONS.has(s.icon) ? <ArIcon name={s.icon} size={70} color={col} /> : <SIcon name={s.icon} size={70} color={col} />}
							</div>
							<div dir="rtl" style={{marginTop: 18, fontFamily: AF.display, fontWeight: 800, fontSize: 44, lineHeight: 1.3, color: here ? '#FFE6C2' : 'rgba(244,236,222,0.86)', whiteSpace: 'nowrap', textShadow: '0 4px 20px rgba(0,0,0,0.9)'}}>{s.label}</div>
						</div>
					);
				})}
			</div>

			{/* cost words */}
			<div dir="rtl" style={{position: 'absolute', left: 0, right: 0, top: 230, display: 'flex', justifyContent: 'center', gap: 70, opacity: 1 - ramp(f, 540, 556)}}>
				{WORDS.map((w, i) => {
					const p = ramp(f, 414 + i * 12, 432 + i * 12, 0, 1, expoOut);
					return (
						<div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${0.8 + 0.2 * p})`, filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined}}>
							{['clock', 'coin'].includes(w.icon) ? <ArIcon name={w.icon} size={64} color={OLD.amber} /> : <SIcon name={w.icon} size={64} color={OLD.amber} />}
							<div style={{fontFamily: AF.display, fontWeight: 900, fontSize: 84, lineHeight: 1.2, color: '#FFE6C2', textShadow: '0 0 24px rgba(224,164,88,0.45), 0 4px 20px rgba(0,0,0,0.9)'}}>{w.t}</div>
						</div>
					);
				})}
			</div>

			{/* rewind trail */}
			{rewinding
				? [1, 2, 3, 4].map((k) => {
						const q = roadPt(fileU(f - k * 2));
						return (
							<div key={k} style={{position: 'absolute', left: q.x - 62, top: q.y - 118 - 47, opacity: 0.22 - k * 0.04, filter: 'blur(3px)'}}>
								<Folder w={124} color={OLD.red} />
							</div>
						);
					})
				: null}

			{/* the file */}
			{grow > 0 && f < b + 8 ? (
				<div style={{position: 'absolute', left: fx - fw / 2, top: fy - fw * 0.38, opacity: Math.min(1, grow * 2) * (1 - ramp(f, b - 2, b + 8)), transform: `rotate(${moving && toCentre === 0 ? Math.sin(f / 3) * 3 : 0}deg)`}}>
					<Folder w={fw} color={red > 0.5 ? '#C9584A' : OLD.amber} glow={red > 0.2 ? 'rgba(255,90,95,0.7)' : undefined} />
					{/* the car under the moving file on the land legs */}
					{moving && !rewinding && u < 2 && toCentre === 0 ? (
						<div style={{position: 'absolute', left: fw / 2 - 28, top: fw * 0.8}}>
							<SIcon name="car" size={56} color={OLD.amber} />
						</div>
					) : null}
					{/* audit scan */}
					{f >= 548 && f < 600 ? (
						<div style={{position: 'absolute', left: -14, right: -14, top: fw * 0.76 * ramp(f, 550, 586, 0, 1, smooth), height: 3, background: '#FFE6C2', boxShadow: `0 0 16px 4px ${OLD.amber}`}} />
					) : null}
				</div>
			) : null}

			{/* waiting: the queue clock above the embassy line */}
			{f >= 420 && f < 480 ? (
				<div style={{position: 'absolute', left: STATIONS[3].x - 40, top: ROAD_Y - 300, opacity: ramp(f, 424, 432) * (1 - ramp(f, 470, 480)), transform: `rotate(${(f - 420) * 9}deg)`}}>
					<ArIcon name="clock" size={80} color="#FFE6C2" />
				</div>
			) : null}

			{/* incomplete */}
			<div style={{position: 'absolute', left: 90, top: 330, opacity: f < 572 ? 0 : 1 - ramp(f, 630, 648)}}>
				<ArChip text={f < 598 ? 'مستند ناقص' : 'يتطلب استكمال'} color={OLD.red} p={ramp(f, 572, 584, 0, 1, expoOut)} frame={f} size={50} />
			</div>

			{/* the clock runs: a day, a week, two weeks, a month */}
			{clockO > 0 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: clockO}}>
					<svg width={260} height={260} viewBox="-130 -130 260 260" style={{overflow: 'visible', filter: `drop-shadow(0 0 22px rgba(255,90,95,0.45))`}}>
						<circle r={118} fill="rgba(20,8,8,0.7)" stroke={OLD.red} strokeWidth={5} />
						{Array.from({length: 12}, (_, i) => {
							const t = (i / 12) * Math.PI * 2;
							return <line key={i} x1={Math.cos(t) * 96} y1={Math.sin(t) * 96} x2={Math.cos(t) * 108} y2={Math.sin(t) * 108} stroke="#FFD9D0" strokeWidth={i % 3 ? 2 : 4} />;
						})}
						<line x1={0} y1={0} x2={0} y2={-62} stroke="#FFD9D0" strokeWidth={8} strokeLinecap="round" transform={`rotate(${hands / 12})`} />
						<line x1={0} y1={0} x2={0} y2={-92} stroke={OLD.red} strokeWidth={4} strokeLinecap="round" transform={`rotate(${hands})`} />
						<circle r={9} fill="#FFD9D0" />
					</svg>
					<div style={{position: 'relative', height: 140, width: 900, marginTop: 16}}>
						{CLOCK.map((c, i) => {
							const next = CLOCK[i + 1]?.a ?? 9999;
							const p = ramp(f, c.a + 5, c.a + 15, 0, 1, expoOut);
							const o = ramp(f, next, next + 5, 0, 1, expoIn);
							if (f < c.a || o >= 1) return null;
							return (
								<div key={i} dir="rtl" style={{position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: AF.display, fontWeight: 900, fontSize: 108, lineHeight: 1.2, color: i === 3 ? OLD.red : '#FFE6C2', opacity: p * (1 - o), transform: `translateY(${(1 - p) * 40 - o * 40}px) scale(${1 + (i === 3 ? 0.1 * p : 0)})`, textShadow: '0 4px 24px rgba(0,0,0,0.9)'}}>
									{c.t}
								</div>
							);
						})}
					</div>
				</div>
			) : null}
			{/* desaturating veil while the clock runs */}
			<AbsoluteFill style={{background: 'rgba(30,8,8,0.25)', opacity: clockO, pointerEvents: 'none'}} />
		</AbsoluteFill>
	);
};
