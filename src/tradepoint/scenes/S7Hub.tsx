import React from 'react';
import {AbsoluteFill} from 'remotion';
import {backOut, expoIn, expoInOut, expoOut, lerp, ramp, rnd} from '../../theme';
import {Beat, BrandMark, Head, Icon, Scrim} from '../kit';
import {P, PCX, PF} from '../theme';

/** Scene 7 — One platform (510–615f): every section converges into one hub, then the network opens to the world. */
export const HUB = {x: PCX, y: 960};
export const NODES = [
	{x: 250, y: 700, icon: 'users', label: 'الأعضاء'},
	{x: 830, y: 700, icon: 'store', label: 'السوق'},
	{x: 250, y: 1230, icon: 'handshake', label: 'الفرص'},
	{x: 830, y: 1230, icon: 'cert', label: 'الخدمات'},
];
const WORLD = Array.from({length: 18}, (_, i) => {
	const a = (i / 18) * Math.PI * 2 + rnd(`w7${i}`) * 0.2;
	return {a, r: 820 + rnd(`w7r${i}`) * 300, d: rnd(`w7d${i}`) * 6};
});

export const NodeTile: React.FC<{icon: string; label: string; glow?: number}> = ({icon, label, glow = 0}) => (
	<div style={{width: 210, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
		<div style={{width: 150, height: 150, borderRadius: 36, background: `linear-gradient(150deg, ${P.deep}, ${P.navy})`, border: `3px solid ${P.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 ${20 + glow * 40}px rgba(212,166,41,${0.3 + glow * 0.5})`}}>
			<Icon name={icon} size={88} color={P.goldLight} stroke={2.6} />
		</div>
		<div dir="rtl" style={{marginTop: 14, fontFamily: PF.ar, fontWeight: 700, fontSize: 46, color: P.white, textShadow: '0 4px 20px rgba(0,0,0,0.9)', whiteSpace: 'nowrap'}}>
			{label}
		</div>
	</div>
);

export const S7Hub: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 506 || f > 630) return null;
	const world = ramp(f, 560, 580, 0, 1, expoInOut);
	const collapse = ramp(f, 612, 626, 0, 1, expoIn);
	const cam = lerp(1, 0.88, world) * lerp(1, 0.15, collapse);
	const hubIn = ramp(f, 512, 528, 0, 1, backOut);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{transform: `scale(${cam})`, transformOrigin: `${HUB.x}px ${HUB.y}px`, opacity: 1 - ramp(f, 620, 628)}}>
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
					{/* world routes */}
					{WORLD.map((w, i) => {
						const p = ramp(f, 562 + w.d, 582 + w.d, 0, 1, expoOut);
						if (p <= 0) return null;
						const x1 = HUB.x + Math.cos(w.a) * w.r * p;
						const y1 = HUB.y + Math.sin(w.a) * w.r * p;
						const pulse = ((f - 566 - w.d) / 18) % 1;
						return (
							<g key={i}>
								<line x1={HUB.x} y1={HUB.y} x2={x1} y2={y1} stroke={P.gold} strokeWidth={2} strokeOpacity={0.45} strokeDasharray="10 12" strokeDashoffset={-f * 3} />
								{pulse > 0 ? <circle cx={lerp(HUB.x, x1, pulse)} cy={lerp(HUB.y, y1, pulse)} r={6} fill={i % 2 ? P.white : P.goldLight} /> : null}
							</g>
						);
					})}
					{/* hub ↔ sections */}
					{NODES.map((n, i) => {
						const d = ramp(f, 522 + i * 3, 538 + i * 3, 0, 1, expoOut);
						const x = lerp(HUB.x, n.x, d);
						const y = lerp(HUB.y, n.y, d);
						const pulses = [0, 0.5].map((o) => ((f - 536 + o * 16) / 16) % 1);
						return (
							<g key={i}>
								<line x1={HUB.x} y1={HUB.y} x2={x} y2={y} stroke={P.gold} strokeWidth={5} strokeLinecap="round" style={{filter: `drop-shadow(0 0 8px ${P.gold})`}} />
								{f > 538
									? pulses.map((p, k) => (p > 0 ? <circle key={k} cx={lerp(HUB.x, n.x, p)} cy={lerp(HUB.y, n.y, p)} r={9} fill={P.white} style={{filter: `drop-shadow(0 0 10px ${P.goldLight})`}} /> : null))
									: null}
							</g>
						);
					})}
					{/* ring */}
					<circle cx={HUB.x} cy={HUB.y} r={200 * hubIn} fill="none" stroke={P.gold} strokeOpacity={0.35} strokeWidth={2} />
				</svg>
				{/* hub */}
				<div style={{position: 'absolute', left: HUB.x - 150, top: HUB.y - 150, transform: `scale(${hubIn})`}}>
					<BrandMark size={300} draw={ramp(f, 510, 534)} frame={f} glow={1 + 0.4 * Math.sin(f / 5)} />
				</div>
				{/* sections fly in from depth */}
				{NODES.map((n, i) => {
					const p = ramp(f, 510 + i * 3, 526 + i * 3, 0, 1, expoOut);
					const glow = ramp(f, 540 + i * 4, 546 + i * 4) * (1 - ramp(f, 546 + i * 4, 560 + i * 4));
					return (
						<div key={i} style={{position: 'absolute', left: n.x - 105, top: n.y - 75, transform: `translate(${(n.x - HUB.x) * (1 - p) * 1.6}px, ${(n.y - HUB.y) * (1 - p) * 1.6}px) scale(${lerp(2.2, 1, p)})`, opacity: p, filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined}}>
							<NodeTile icon={n.icon} label={n.label} glow={glow} />
						</div>
					);
				})}
			</AbsoluteFill>
			<Scrim top={140} h={380} />
			<Beat frame={f} a={512} b={560} top={220}>
				<Head text="منصة واحدة" frame={f} start={512} size={150} mode="slam" stagger={5} dur={9} color={P.gold} glow="gold" />
			</Beat>
			<Beat frame={f} a={560} b={622} top={190} out="zoom">
				<Head text="للتاجر العراقي" frame={f} start={560} size={112} mode="rise" stagger={4} dur={9} />
				<Head text="نحو العالم" frame={f} start={568} size={124} mode="slam" stagger={4} dur={9} color={P.gold} glow="gold" />
			</Beat>
		</AbsoluteFill>
	);
};
