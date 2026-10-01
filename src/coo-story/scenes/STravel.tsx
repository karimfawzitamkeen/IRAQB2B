import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, kf, lerp, ramp} from '../../theme';
import {ArIcon, ArText, Scrim, Win} from '../../coo-ar/kit';
import {AF} from '../../coo-ar/theme';
import {ST} from '../theme';

/**
 * Scene 6 (1350–1770f): the transaction travels, not the trader. The camera rides behind a packet
 * of light through six gates set along a winding path in depth.
 */
const GATES = [
	{t: 'التاجر', icon: 'trader'},
	{t: 'التدقيق', icon: 'doc'},
	{t: 'المراجعة', icon: 'eye'},
	{t: 'الرسوم', icon: 'coin'},
	{t: 'الملحق التجاري', icon: 'building'},
	{t: 'التصديق', icon: 'seal'},
];
const D = 1000; // spacing between gates (world units)
const FOV = 900;
const CX = 960;
const CY = 470;
const BACK = 760; // camera distance behind the packet
const pathX = (z: number) => 560 * Math.cos((z / D) * Math.PI);
const PACKET_Y = 0;
const CAM_Y = -170;
// arrival frame at each gate
const AT = [1392, 1456, 1520, 1584, 1648, 1706];

const zOf = (f: number) =>
	kf(
		f,
		[[1350, -700], ...AT.map((t, i): [number, number] => [t, i * D]), [1770, 5 * D]],
		(t) => 0.45 * t + 0.55 * (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
	);

export const STravel: React.FC<{frame: number}> = ({frame: f}) => {
	const [a, b] = ST.travels;
	if (f < a - 4 || f > b + 8) return null;
	const o = ramp(f, a - 4, a + 14) * (1 - ramp(f, b - 18, b + 4));
	const zp = zOf(f);
	const xp = pathX(zp);
	const zc = zp - BACK;
	const xc = xp * 0.6;
	const proj = (x: number, y: number, z: number) => {
		const dz = z - zc;
		const s = FOV / Math.max(dz, 1);
		return {x: CX + (x - xc) * s, y: CY + (y - CAM_Y) * s, s, dz};
	};
	// path ribbon
	const segs: React.ReactNode[] = [];
	let prev: ReturnType<typeof proj> | null = null;
	for (let z = Math.max(-700, zc + 80); z < Math.min(5 * D + 600, zc + 5200); z += 36) {
		const q = proj(pathX(z), PACKET_Y + 60, z);
		if (prev) {
			const done = z < zp;
			const fade = Math.min(1, 900 / q.dz);
			segs.push(<line key={z} x1={prev.x} y1={prev.y} x2={q.x} y2={q.y} stroke={done ? C.gold : C.cyan} strokeOpacity={(done ? 0.85 : 0.45) * fade} strokeWidth={Math.max(1, 10 * q.s)} strokeLinecap="round" />);
		}
		prev = q;
	}
	// floor grid for depth
	const grid: React.ReactNode[] = [];
	const z0 = Math.ceil((zc + 100) / 400) * 400;
	for (let z = z0; z < zc + 5200; z += 400) {
		const l = proj(-2400, 260, z);
		const r = proj(2400, 260, z);
		grid.push(<line key={`g${z}`} x1={l.x} y1={l.y} x2={r.x} y2={r.y} stroke="rgba(79,216,255,0.14)" strokeWidth={1} opacity={Math.min(1, 1600 / l.dz)} />);
	}
	for (const gx of [-2000, -1200, -400, 400, 1200, 2000]) {
		const n = proj(gx, 260, zc + 120);
		const fz = proj(gx, 260, zc + 5200);
		grid.push(<line key={`x${gx}`} x1={n.x} y1={n.y} x2={fz.x} y2={fz.y} stroke="rgba(79,216,255,0.1)" strokeWidth={1} />);
	}
	const packet = proj(xp, PACKET_Y, zp);
	// the gate the packet is at or just passed
	const near = GATES.map((_, i) => Math.abs(zp - i * D));
	const cur = near.indexOf(Math.min(...near));
	return (
		<AbsoluteFill style={{opacity: o}}>
			<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
				{grid}
				{segs}
			</svg>
			{/* gates, far to near */}
			{GATES.map((g, i) => ({g, i, z: i * D}))
				.filter(({z}) => z - zc > 380 && z - zc < 2900)
				.sort((p, q) => q.z - p.z)
				.map(({g, i, z}) => {
					const q = proj(pathX(z), PACKET_Y, z);
					const R = 230 * q.s;
					const passed = zp >= z - 20;
					const hit = ramp(f, AT[i] - 6, AT[i] + 4) * (1 - ramp(f, AT[i] + 8, AT[i] + 40));
					const fade = ramp(q.dz, 400, 640) * (1 - ramp(q.dz, 2300, 2900));
					const col = passed ? C.gold : C.cyan;
					const label = Math.min(64, Math.max(20, 120 * q.s));
					return (
						<div key={i} style={{position: 'absolute', left: q.x, top: q.y, opacity: fade}}>
							<svg width={R * 2.6} height={R * 2.6} viewBox="-130 -130 260 260" style={{position: 'absolute', left: -R * 1.3, top: -R * 1.3, overflow: 'visible'}}>
								<circle r={100} fill="none" stroke={col} strokeWidth={5} strokeOpacity={0.9} style={{filter: `drop-shadow(0 0 ${8 + hit * 20}px ${col})`}} />
								<circle r={88} fill="none" stroke={col} strokeOpacity={0.5} strokeWidth={1.6} strokeDasharray="4 8" transform={`rotate(${f * (i % 2 ? 0.8 : -0.8)})`} />
								{hit > 0 ? <circle r={100 + hit * 40} fill="none" stroke={C.gold} strokeOpacity={hit} strokeWidth={4} /> : null}
							</svg>
							<div style={{position: 'absolute', left: -R * 0.32, top: -R * 1.12, opacity: 0.9}}>
								<ArIcon name={g.icon} size={R * 0.64} color={col} stroke={2.6} />
							</div>
							<div dir="rtl" style={{position: 'absolute', left: -300, width: 600, top: Math.min(R * 0.98, 250), textAlign: 'center', fontFamily: AF.display, fontWeight: 800, fontSize: label, lineHeight: 1.3, color: passed ? '#F0D48E' : C.white, whiteSpace: 'nowrap', textShadow: '0 4px 20px rgba(0,0,0,0.95)'}}>
								{g.t}
								{passed && i < 5 ? <span style={{color: C.cyan, marginInlineStart: '0.3em'}}>✓</span> : null}
							</div>
						</div>
					);
				})}
			{/* the packet: the transaction itself */}
			<div style={{position: 'absolute', left: packet.x, top: packet.y}}>
				{[1, 2, 3, 4, 5].map((k) => {
					const t = proj(pathX(zp - k * 40), PACKET_Y, zp - k * 40);
					return <div key={k} style={{position: 'absolute', left: t.x - packet.x - 10, top: t.y - packet.y - 10, width: 20, height: 20, borderRadius: '50%', background: C.cyan, opacity: 0.25 - k * 0.04, filter: 'blur(4px)'}} />;
				})}
				<div style={{position: 'absolute', left: -26, top: -34, width: 52, height: 68, borderRadius: 8, background: 'linear-gradient(180deg, #F2FCFF, #9FE7FF)', boxShadow: `0 0 30px 10px rgba(79,216,255,0.6), 0 0 80px 20px rgba(217,180,106,0.25)`, transform: `rotate(${Math.sin(f / 10) * 6}deg)`}}>
					{[0.7, 0.5, 0.6].map((w, k) => (
						<div key={k} style={{position: 'absolute', right: 8, top: 14 + k * 12, width: `${w * 70}%`, height: 4, borderRadius: 2, background: 'rgba(6,18,38,0.45)'}} />
					))}
				</div>
			</div>
			{/* idea title */}
			<Scrim top={0} h={240} o={0.9} />
			<Win frame={f} a={a + 4} b={a + 150} top={70} outF={16}>
				<ArText lines="المعاملة هي التي تسافر... وليس التاجر" frame={f} start={a + 8} size={84} weight={900} color="#F0D48E" glow="gold" maxW={1600} />
			</Win>
			<Win frame={f} a={a + 158} b={b} top={84} outF={16}>
				<ArText lines="مسار إلكتروني واضح ومترابط" frame={f} start={a + 162} size={70} weight={800} maxW={1600} />
			</Win>
			{/* HUD rail */}
			<div dir="rtl" style={{position: 'absolute', left: 360, right: 360, bottom: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: ramp(f, a + 20, a + 40)}}>
				{GATES.map((g, i) => {
					const done = zp >= i * D - 20;
					return (
						<div key={i} style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: AF.body, fontWeight: 600, fontSize: 26, color: done ? '#F0D48E' : 'rgba(244,247,251,0.5)'}}>
							<div style={{width: 14, height: 14, borderRadius: '50%', background: done ? C.gold : 'transparent', border: `2px solid ${done ? C.gold : 'rgba(244,247,251,0.4)'}`, boxShadow: i === cur ? `0 0 12px ${C.gold}` : undefined}} />
							{g.t}
						</div>
					);
				})}
			</div>
			{/* arrival at attestation */}
			<div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at ${packet.x}px ${packet.y}px, rgba(217,180,106,${0.35 * ramp(f, 1704, 1716) * (1 - ramp(f, 1720, 1760))}), rgba(0,0,0,0) 40%)`}} />
		</AbsoluteFill>
	);
};
