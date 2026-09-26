import React from 'react';
import {C, F, expoOut, ramp} from '../theme';
import {Label} from '../components/Primitives';
import {SAFE} from './layout';

/** Chapter marker for the portrait top band (x 100, y 270). */
export const PChapter: React.FC<{
	frame: number;
	start: number;
	end: number;
	index: string;
	title: string;
	sub: string;
	dy?: number;
}> = ({frame, start, end, index, title, sub, dy = 0}) => {
	const pin = ramp(frame, start, start + 22);
	const pout = ramp(frame, end - 12, end);
	const o = pin * (1 - pout);
	if (o <= 0) return null;
	return (
		<div style={{position: 'absolute', left: SAFE.left, top: 270 + dy, width: SAFE.right - SAFE.left, opacity: o}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
				<Label color={C.gold} size={22} spacing={3}>
					{index}
				</Label>
				<div style={{width: 56 * pin, height: 1, background: `linear-gradient(90deg, ${C.gold}, rgba(217,180,106,0))`}} />
				<Label color={C.white} size={22} spacing={6} style={{transform: `translateX(${(1 - pin) * 16}px)`}}>
					{title}
				</Label>
			</div>
			<div
				style={{
					marginTop: 14,
					fontFamily: F.sans,
					fontWeight: 300,
					fontSize: 30,
					lineHeight: 1.25,
					color: 'rgba(244,247,251,0.66)',
					transform: `translateY(${(1 - pin) * 10}px)`,
				}}
			>
				{sub}
			</div>
		</div>
	);
};

/** Status pill (mono, tracked) — screen space so it stays legible on a phone. */
export const Chip: React.FC<{text: string; color: string; p: number; dot?: boolean; frame: number; style?: React.CSSProperties}> = ({
	text,
	color,
	p,
	dot = true,
	frame,
	style,
}) => (
	<div
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			gap: 12,
			padding: '10px 20px 10px 16px',
			borderRadius: 40,
			border: `1px solid ${color}`,
			background: 'rgba(4,12,26,0.82)',
			boxShadow: `0 0 ${24 * p}px ${color}55`,
			fontFamily: F.mono,
			fontWeight: 500,
			fontSize: 21,
			letterSpacing: 3.5,
			color,
			whiteSpace: 'nowrap',
			opacity: p,
			transform: `scale(${0.85 + 0.15 * p})`,
			...style,
		}}
	>
		{dot ? <div style={{width: 9, height: 9, borderRadius: 5, background: color, boxShadow: `0 0 10px ${color}`, opacity: 0.55 + 0.45 * Math.sin(frame / 4)}} /> : null}
		{text}
	</div>
);

const hexPath = (r: number, rot = -Math.PI / 2, cy = 0) =>
	Array.from({length: 6}, (_, i) => {
		const a = (Math.PI / 3) * i + rot;
		return `${i ? 'L' : 'M'}${(r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
	}).join('') + 'Z';

/** Trader station emblem, centred on (x, y). */
export const TraderEmblem: React.FC<{x: number; y: number; f: number; enter: number; scale?: number; pulse?: number}> = ({
	x,
	y,
	f,
	enter,
	scale = 1,
	pulse = 0,
}) => (
	<div style={{position: 'absolute', left: x - 150, top: y - 150, width: 300, height: 300, opacity: enter, transform: `scale(${(0.85 + 0.15 * enter) * scale})`}}>
		<div style={{position: 'absolute', inset: -60, borderRadius: '50%', background: `radial-gradient(circle, rgba(79,216,255,${0.14 + pulse * 0.2}) 0%, rgba(79,216,255,0) 65%)`}} />
		<svg width={300} height={300} viewBox="-150 -150 300 300" style={{overflow: 'visible'}}>
			<g transform={`rotate(${f * 0.3})`}>
				{Array.from({length: 72}, (_, i) => {
					const a = (i / 72) * Math.PI * 2;
					const l = i % 6 === 0 ? 10 : 4;
					return <line key={i} x1={Math.cos(a) * 128} y1={Math.sin(a) * 128} x2={Math.cos(a) * (128 - l)} y2={Math.sin(a) * (128 - l)} stroke={C.white} strokeOpacity={i % 6 === 0 ? 0.5 : 0.2} />;
				})}
			</g>
			<path d={hexPath(104)} fill="none" stroke={C.white} strokeOpacity={0.35} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - enter} />
			<path d={hexPath(92)} fill="rgba(79,216,255,0.05)" stroke={C.cyan} strokeOpacity={0.6} strokeWidth={1.2} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ramp(enter, 0.2, 1)} />
			<circle r={112} fill="none" stroke={C.cyan} strokeOpacity={0.4} strokeDasharray="30 200" transform={`rotate(${-f * 1.6})`} />
			<circle cx={0} cy={-26} r={18} fill="none" stroke={C.white} strokeWidth={2} />
			<path d="M-38 42 C -34 6, 34 6, 38 42" fill="none" stroke={C.white} strokeWidth={2} strokeLinecap="round" />
			<line x1={-38} y1={42} x2={38} y2={42} stroke={C.cyan} strokeOpacity={0.6} />
		</svg>
	</div>
);

/** Attestation platform portal: stacked elliptical rings, light column and core. */
export const PortalStation: React.FC<{x: number; y: number; f: number; enter: number; pulses: number[]}> = ({x, y, f, enter, pulses}) => {
	const W = 420;
	const boost = pulses.reduce((a, p) => a + (p > 0 && p < 1 ? 1 - p : 0), 0);
	return (
		<div style={{position: 'absolute', left: x - W / 2, top: y - 230, width: W, height: 460, opacity: enter}}>
			<div style={{position: 'absolute', left: W / 2 - 2, top: 30, width: 4, height: 400, background: 'linear-gradient(180deg, rgba(79,216,255,0) 0%, rgba(79,216,255,0.7) 50%, rgba(79,216,255,0) 100%)', filter: 'blur(3px)', opacity: 0.6 + boost * 0.4}} />
			<div style={{position: 'absolute', left: W / 2 - 120, top: 110, width: 240, height: 240, borderRadius: '50%', background: `radial-gradient(circle, rgba(79,216,255,${0.25 + boost * 0.35}) 0%, rgba(79,216,255,0) 65%)`}} />
			<svg width={W} height={460} viewBox={`${-W / 2} -230 ${W} 460`} style={{overflow: 'visible'}}>
				{[-120, -60, 0, 60, 120].map((yy, i) => {
					const rx = (150 - Math.abs(yy) * 0.35) * (0.7 + 0.3 * enter);
					const ry = rx * 0.26;
					return (
						<g key={i}>
							<ellipse cx={0} cy={yy} rx={rx} ry={ry} fill={i === 2 ? 'rgba(79,216,255,0.06)' : 'none'} stroke={i === 2 ? C.cyan : C.white} strokeOpacity={i === 2 ? 0.8 : 0.22} strokeWidth={i === 2 ? 1.4 : 1} />
							<ellipse cx={0} cy={yy} rx={rx} ry={ry} fill="none" stroke={C.cyan} strokeOpacity={0.9} strokeWidth={2} pathLength={1} strokeDasharray="0.12 0.88" strokeDashoffset={(f * (0.012 + boost * 0.03) * (i % 2 ? 1 : -1)) % 1} />
						</g>
					);
				})}
				{pulses.map((p, i) =>
					p > 0 && p < 1 ? <ellipse key={i} cx={0} cy={0} rx={60 + p * 220} ry={(60 + p * 220) * 0.26} fill="none" stroke={i === 2 ? C.cyan : '#DFF8FF'} strokeOpacity={(1 - p) * 0.9} strokeWidth={2} /> : null,
				)}
				<circle r={10 + boost * 6} fill="#E8FAFF" style={{filter: `drop-shadow(0 0 16px ${C.cyan})`}} />
			</svg>
		</div>
	);
};

/** Secure settlement core: counter-rotating segmented rings around a hex lock. */
export const SecureCore: React.FC<{
	x: number;
	y: number;
	f: number;
	scale: number;
	close: number;
	energy: number;
	lit: number;
	hit: number;
	burst: number;
}> = ({x, y, f, scale, close, energy, lit, hit, burst}) => {
	const locked = close >= 1;
	const hex = hexPath(62, 0, 8);
	return (
		<svg width={600} height={600} viewBox="-300 -300 600 600" style={{position: 'absolute', left: x - 300, top: y - 300, overflow: 'visible', transform: `scale(${scale})`}}>
			<defs>
				<radialGradient id="pcore-g">
					<stop offset="0%" stopColor={C.gold} stopOpacity={0.18 + energy * 0.25} />
					<stop offset="45%" stopColor={C.cyan} stopOpacity={0.12 + energy * 0.12} />
					<stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
				</radialGradient>
				<linearGradient id="plock-g" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#12305A" />
					<stop offset="100%" stopColor="#061429" />
				</linearGradient>
			</defs>
			<circle r={270} fill="url(#pcore-g)" />
			<circle r={240} fill="none" stroke={C.white} strokeOpacity={0.08} />
			<circle r={228} fill="none" stroke={C.gold} strokeOpacity={0.5} strokeDasharray="1 9" transform={`rotate(${f * 0.25})`} />
			<circle r={192} fill="none" stroke={C.gold} strokeOpacity={0.45 + energy * 0.35} strokeWidth={2} strokeDasharray="44 16" transform={`rotate(${-f * (0.5 + energy * 3)})`} />
			<circle r={158} fill="none" stroke={C.white} strokeOpacity={0.35} strokeDasharray="2 5" transform={`rotate(${f * (0.9 + energy * 4)})`} />
			{Array.from({length: 24}, (_, i) => (
				<rect key={i} x={-2} y={-138} width={4} height={10} fill={lit * 24 > i ? C.gold : 'rgba(255,255,255,0.15)'} transform={`rotate(${(i / 24) * 360})`} />
			))}
			{hit > 0 && hit < 1 ? <circle r={110 + hit * 180} fill="none" stroke={C.gold} strokeOpacity={(1 - hit) * 0.9} strokeWidth={2} /> : null}
			{burst > 0 && burst < 1 ? (
				<>
					<circle r={100 + burst * 380} fill="none" stroke={C.white} strokeOpacity={(1 - burst) * 0.8} strokeWidth={3 * (1 - burst)} />
					<circle r={120} fill={C.gold} fillOpacity={(1 - burst) * 0.22} />
				</>
			) : null}
			<path d="M-26 -8 V-38 A26 26 0 0 1 26 -38 V-8" fill="none" stroke={locked ? C.gold : C.white} strokeWidth={7} strokeLinecap="round" transform={`translate(0 ${-18 * (1 - close)})`} />
			<path d={hex} fill="url(#plock-g)" stroke={locked ? C.gold : C.cyan} strokeWidth={2} style={{filter: `drop-shadow(0 0 ${12 + energy * 20}px ${locked ? 'rgba(217,180,106,0.6)' : 'rgba(79,216,255,0.6)'})`}} />
			<circle cx={0} cy={2} r={8} fill={locked ? C.gold : C.cyan} />
			<rect x={-3} y={4} width={6} height={20} rx={3} fill={locked ? C.gold : C.cyan} />
		</svg>
	);
};

/** Accountant emblem: a geometric ledger mark (columns + balance rule). */
export const AccountantMark: React.FC<{size: number; p: number}> = ({size, p}) => (
	<svg width={size} height={size} viewBox="0 0 60 60" style={{overflow: 'visible'}}>
		<circle cx={30} cy={30} r={28} fill="rgba(217,180,106,0.07)" stroke={C.gold} strokeWidth={1.3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ramp(p, 0, 0.5, 0, 1, expoOut)} transform="rotate(-90 30 30)" />
		<g stroke={C.gold} strokeWidth={1.4} fill="none" opacity={ramp(p, 0.2, 0.7)}>
			<rect x={17} y={16} width={26} height={28} rx={2} />
			<line x1={22} y1={23} x2={38} y2={23} />
			<line x1={22} y1={29} x2={38} y2={29} />
			<line x1={22} y1={35} x2={32} y2={35} />
			<line x1={34} y1={35} x2={38} y2={35} strokeWidth={2.2} />
		</g>
	</svg>
);

/** Small payment receipt card. */
export const ReceiptCard: React.FC<{w?: number}> = ({w = 150}) => {
	const h = w * 1.25;
	return (
		<div
			style={{
				width: w,
				height: h,
				borderRadius: 5,
				background: 'linear-gradient(160deg, rgba(40,58,86,0.95), rgba(12,24,44,0.97))',
				border: `1px solid rgba(217,180,106,0.7)`,
				boxShadow: '0 0 30px rgba(217,180,106,0.35), 0 20px 50px rgba(0,0,0,0.6)',
				padding: w * 0.1,
				boxSizing: 'border-box',
				display: 'flex',
				flexDirection: 'column',
				gap: w * 0.06,
			}}
		>
			<div style={{fontFamily: F.mono, fontSize: w * 0.085, letterSpacing: 1.5, color: C.gold}}>RECEIPT</div>
			<div style={{height: 1, background: 'rgba(217,180,106,0.5)'}} />
			{[0.8, 0.6, 0.72, 0.5].map((x, i) => (
				<div key={i} style={{height: w * 0.035, width: `${x * 100}%`, borderRadius: 3, background: 'rgba(244,247,251,0.35)'}} />
			))}
			<div style={{marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
				<div style={{height: w * 0.045, width: '40%', borderRadius: 3, background: C.gold}} />
				<div style={{width: w * 0.16, height: w * 0.16, borderRadius: '50%', border: `1.5px solid ${C.gold}`}} />
			</div>
		</div>
	);
};

/** Glowing value packet (diamond) with a light trail, drawn in a full-canvas SVG. */
export const Packet: React.FC<{
	x: number;
	y: number;
	trail: {x: number; y: number}[];
	color: string;
	o?: number;
}> = ({x, y, trail, color, o = 1}) => (
	<g opacity={o}>
		{trail.slice(1).map((t, k) => (
			<line key={k} x1={trail[k].x} y1={trail[k].y} x2={t.x} y2={t.y} stroke={color} strokeWidth={6 * (1 - k / trail.length)} strokeOpacity={0.7 * (1 - k / trail.length)} strokeLinecap="round" />
		))}
		<g transform={`translate(${x} ${y}) rotate(45)`} style={{filter: `drop-shadow(0 0 12px ${color})`}}>
			<rect x={-9} y={-9} width={18} height={18} fill="#fff" />
			<rect x={-15} y={-15} width={30} height={30} fill="none" stroke={color} />
		</g>
	</g>
);
