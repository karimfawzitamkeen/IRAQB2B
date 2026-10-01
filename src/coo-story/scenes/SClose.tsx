import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, expoInOut, expoOut, lerp, ramp, rnd, smooth} from '../../theme';
import {QRCode} from '../../components/Document';
import {ArChip, ArText, GoldRule, MinistryLogo, Win} from '../../coo-ar/kit';
import {AF} from '../../coo-ar/theme';
import {Paper} from '../parts';
import {OLD, ST, TXT} from '../theme';

// ---------------------------------------------------------------------------
// Scene 11 — what the project delivers: five quick shots, one idea each
// ---------------------------------------------------------------------------
const GAINS = ['اختصار الوقت', 'الشفافية', 'التتبع', 'تقليل الإجراءات الورقية', 'سهولة التحقق'];
const SHOT = 60;
const VY = 380; // visual centre line

const ShotRoute: React.FC<{f: number; a: number}> = ({f, a}) => {
	const t = ramp(f, a + 8, a + 34, 0, 1, expoInOut);
	const pts = Array.from({length: 9}, (_, i) => ({x: lerp(1560, 360, i / 8), y: VY + (i % 2 ? 1 : -1) * (i === 0 || i === 8 ? 0 : 150) * (1 - t)}));
	const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join('');
	const head = ramp(f, a + 30, a + 54, 0, 1, smooth);
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
			<path d={d} fill="none" stroke={t > 0.5 ? C.cyan : OLD.amber} strokeWidth={6} strokeLinejoin="round" strokeDasharray={t > 0.5 ? undefined : '16 12'} style={{filter: `drop-shadow(0 0 10px ${t > 0.5 ? C.cyan : OLD.amber})`}} />
			<circle cx={1560} cy={VY} r={14} fill={C.gold} />
			<circle cx={360} cy={VY} r={14} fill={C.gold} />
			{t >= 1 ? <circle cx={lerp(1560, 360, head)} cy={VY} r={16} fill="#E6FBFF" style={{filter: `drop-shadow(0 0 14px ${C.cyan})`}} /> : null}
		</svg>
	);
};

const ShotLight: React.FC<{f: number; a: number}> = ({f, a}) => (
	<>
		<div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse ${lerp(5, 70, ramp(f, a + 4, a + 40, 0, 1, expoOut))}% 40% at 50% ${(VY / 1080) * 100}%, rgba(79,216,255,0.16), rgba(0,0,0,0) 100%)`}} />
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
			<line x1={360} y1={VY + 40} x2={1560} y2={VY + 40} stroke={C.line} strokeWidth={3} />
			{Array.from({length: 7}, (_, i) => {
				const x = 1560 - i * 200;
				const p = ramp(f, a + 8 + i * 5, a + 18 + i * 5, 0, 1, expoOut);
				return (
					<g key={i} opacity={0.15 + 0.85 * p}>
						<circle cx={x} cy={VY + 40} r={12} fill={p > 0.5 ? C.cyan : '#0B1D3A'} stroke={C.cyan} strokeWidth={2} style={p > 0.5 ? {filter: `drop-shadow(0 0 10px ${C.cyan})`} : undefined} />
						<rect x={x - 70} y={VY - 110 + (1 - p) * 20} width={140} height={90} rx={12} fill="rgba(79,216,255,0.08)" stroke="rgba(79,216,255,0.5)" />
						<rect x={x - 50} y={VY - 86} width={100 * p} height={8} rx={4} fill="rgba(244,247,251,0.6)" />
						<rect x={x - 50} y={VY - 64} width={70 * p} height={8} rx={4} fill="rgba(244,247,251,0.35)" />
						<line x1={x} y1={VY - 20} x2={x} y2={VY + 28} stroke="rgba(79,216,255,0.5)" />
					</g>
				);
			})}
		</svg>
	</>
);

const TRACK = ['تقديم', 'تدقيق', 'مراجعة', 'رسوم', 'تصديق'];
const ShotTrack: React.FC<{f: number; a: number}> = ({f, a}) => {
	const pos = ramp(f, a + 6, a + 52, 0, 4, (t) => t);
	const x = (i: number) => 1500 - i * 270;
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
				<line x1={x(0)} y1={VY} x2={x(4)} y2={VY} stroke={C.line} strokeWidth={5} />
				<line x1={x(0)} y1={VY} x2={lerp(x(0), x(4), pos / 4)} y2={VY} stroke={C.gold} strokeWidth={5} />
				{TRACK.map((_, i) => (
					<circle key={i} cx={x(i)} cy={VY} r={16} fill={pos >= i - 0.02 ? C.gold : '#0B1D3A'} stroke={C.gold} strokeWidth={2} />
				))}
			</svg>
			{/* location pin */}
			<div style={{position: 'absolute', left: lerp(x(0), x(4), pos / 4) - 30, top: VY - 112}}>
				<svg width={60} height={84} viewBox="0 0 60 84" style={{filter: `drop-shadow(0 0 12px ${C.cyan})`}}>
					<path d="M30 82 C 30 82, 4 46, 4 30 A 26 26 0 1 1 56 30 C 56 46, 30 82, 30 82 Z" fill={C.cyan} />
					<circle cx={30} cy={30} r={10} fill="#061226" />
				</svg>
			</div>
			{TRACK.map((t, i) => (
				<div key={i} dir="rtl" style={{position: 'absolute', left: x(i) - 100, width: 200, top: VY + 34, textAlign: 'center', fontFamily: AF.display, fontWeight: 800, fontSize: 36, color: pos >= i - 0.02 ? C.white : 'rgba(244,247,251,0.45)'}}>
					{t}
				</div>
			))}
		</>
	);
};

const ShotPaper: React.FC<{f: number; a: number}> = ({f, a}) => (
	<>
		{[0, 1, 2].map((k) => {
			const p = ramp(f, a + 10 + k * 6, a + 36 + k * 6, 0, 1, expoInOut);
			return (
				<div key={k} style={{position: 'absolute', left: lerp(1260 + k * 70, 860, p), top: lerp(VY - 150 + k * 16, VY - 40, p), opacity: 1 - p, transform: `rotate(${(k - 1) * 8 * (1 - p)}deg) scale(${1 - p * 0.7})`}}>
					<Paper w={200} h={260} />
				</div>
			);
		})}
		<div dir="rtl" style={{position: 'absolute', left: 520, width: 520, top: VY - 140, display: 'flex', flexDirection: 'column', gap: 18}}>
			{Array.from({length: 6}, (_, i) => {
				const p = ramp(f, a + 26 + i * 4, a + 40 + i * 4, 0, 1, expoOut);
				return (
					<div key={i} style={{display: 'flex', gap: 14, alignItems: 'center', opacity: p}}>
						<div style={{width: 14, height: 14, borderRadius: 3, background: i % 2 ? C.gold : C.cyan}} />
						<div style={{height: 14, width: `${(0.5 + rnd(`gp${i}`) * 0.5) * 100 * p}%`, borderRadius: 7, background: 'linear-gradient(270deg, rgba(79,216,255,0.8), rgba(79,216,255,0.2))'}} />
					</div>
				);
			})}
		</div>
	</>
);

const ShotVerify: React.FC<{f: number; a: number}> = ({f, a}) => {
	const scan = ramp(f, a + 8, a + 30, 0, 1, smooth);
	const ok = ramp(f, a + 30, a + 42, 0, 1, expoOut);
	return (
		<>
			<div style={{position: 'absolute', left: 1060, top: VY - 130, width: 260, height: 260, padding: 0}}>
				<QRCode p={1} size={260} />
				{scan < 1 ? <div style={{position: 'absolute', left: -12, right: -12, top: scan * 260, height: 3, background: '#DFF8FF', boxShadow: `0 0 18px 4px ${C.cyan}`}} /> : null}
			</div>
			<div style={{position: 'absolute', left: 560, top: VY - 50}}>
				{ok > 0 ? <ArChip text="موثّقة" color={C.cyan} p={ok} frame={f} icon="shield" size={64} /> : null}
			</div>
		</>
	);
};

const SHOTS = [ShotRoute, ShotLight, ShotTrack, ShotPaper, ShotVerify];

const Gains: React.FC<{f: number}> = ({f}) => {
	const [a, b] = ST.gains;
	if (f < a - 4 || f > b + 6) return null;
	const i = Math.min(4, Math.floor((f - a) / SHOT));
	const s = a + i * SHOT;
	const Shot = SHOTS[i];
	const o = ramp(f, s, s + 8) * (1 - ramp(f, s + SHOT - 8, s + SHOT));
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{opacity: o, transform: `scale(${1 + ramp(f, s, s + SHOT, 0, 0.03, (t) => t)})`}}>
				<Shot f={f} a={s} />
				<div style={{position: 'absolute', left: 0, right: 0, top: 640}}>
					<ArText lines={GAINS[i]} frame={f} start={s + 6} size={124} weight={900} color={i % 2 ? '#F0D48E' : C.white} glow={i % 2 ? 'gold' : 'white'} maxW={1600} />
				</div>
			</AbsoluteFill>
			{/* progress */}
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 120, display: 'flex', justifyContent: 'center', gap: 22, flexDirection: 'row-reverse', opacity: ramp(f, a, a + 12) * (1 - ramp(f, b - 10, b))}}>
				{GAINS.map((_, k) => (
					<div key={k} style={{width: k === i ? 60 : 16, height: 16, borderRadius: 8, background: k <= i ? C.gold : 'rgba(244,247,251,0.25)'}} />
				))}
			</div>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------
// Scene 13 — official launch: patronage, the service, the entities. Held to the end.
// ---------------------------------------------------------------------------
const GOLD_DUST = Array.from({length: 90}, (_, i) => ({a: rnd(`ga${i}`) * Math.PI * 2, r: 500 + rnd(`gr${i}`) * 700, d: rnd(`gd${i}`) * 20}));

const Launch: React.FC<{f: number}> = ({f}) => {
	const [a] = ST.launch;
	if (f < a - 4) return null;
	const B = a + 132; // the slate
	const toSlate = ramp(f, B - 6, B + 30, 0, 1, expoInOut);
	const logoX = lerp(960, 1410, toSlate);
	const logoY = lerp(250, 190, toSlate);
	const logoS = lerp(230, 190, toSlate);
	const mw = 780;
	return (
		<AbsoluteFill>
			{f < a + 40 ? (
				<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
					{GOLD_DUST.map((d, i) => {
						const p = ramp(f, a + d.d, a + 30 + d.d * 0.3, 0, 1, expoInOut);
						const r = d.r * (1 - p);
						return <circle key={i} cx={960 + Math.cos(d.a) * r} cy={250 + Math.sin(d.a) * r * 0.7} r={2.6} fill={i % 3 ? '#F3DDA6' : C.cyan} opacity={(1 - ramp(f, a + 30, a + 40)) * 0.9} style={{filter: `drop-shadow(0 0 5px ${C.gold})`}} />;
					})}
				</svg>
			) : null}
			<div style={{position: 'absolute', left: logoX - logoS / 2, top: logoY - logoS / 2}}>
				<MinistryLogo size={logoS} p={ramp(f, a + 24, a + 60, 0, 1, expoOut)} frame={f} sweep={ramp(f, a + 60, a + 100, -0.3, 1.3)} />
			</div>
			{/* stage A — patronage */}
			<Win frame={f} a={a + 40} b={B + 4} top={420} outF={14}>
				<ArText lines={TXT.patron1} frame={f} start={a + 44} size={70} font={AF.naskh} weight={700} color="rgba(217,180,106,0.9)" glow="none" lineHeight={1.5} maxW={1500} />
				<ArText lines={TXT.patron2} frame={f} start={a + 54} size={100} font={AF.naskh} weight={700} lineHeight={1.5} maxW={1500} />
			</Win>
			{f >= a + 40 && f < B + 4 ? <GoldRule p={ramp(f, a + 70, a + 92, 0, 1, expoOut) * (1 - ramp(f, B - 10, B + 4))} w={620} top={712} cx={960} /> : null}
			<Win frame={f} a={a + 40} b={B + 4} top={732} outF={14}>
				<ArText lines={TXT.patron3} frame={f} start={a + 76} size={126} font={AF.naskh} weight={700} color="#F0D48E" glow="gold" lineHeight={1.5} stagger={5} dur={18} maxW={1500} />
			</Win>
			{/* stage B — the slate, held to the end */}
			{f >= B ? (
				<>
					<div style={{position: 'absolute', top: 330, left: 1000, width: 820}}>
						<ArText lines={TXT.launch1} frame={f} start={B + 10} size={74} weight={800} color={C.cyan} glow="cyan" maxW={mw} />
						<ArText lines={TXT.launch2} frame={f} start={B + 18} size={112} weight={900} maxW={mw} />
						<ArText lines={TXT.launch3} frame={f} start={B + 28} size={96} weight={900} color="#F0D48E" glow="gold" maxW={mw} />
					</div>
					<div style={{position: 'absolute', left: 958, top: 540 - 380 * ramp(f, B + 30, B + 56, 0, 1, expoOut), width: 3, height: 760 * ramp(f, B + 30, B + 56, 0, 1, expoOut), background: `linear-gradient(180deg, rgba(217,180,106,0), ${C.gold}, rgba(217,180,106,0))`, boxShadow: '0 0 16px rgba(217,180,106,0.5)'}} />
					<div style={{position: 'absolute', top: 120, left: 100, width: 820}}>
						<ArText lines={`${TXT.patron1} ${TXT.patron2}`} frame={f} start={B + 36} size={56} font={AF.naskh} weight={700} color="rgba(244,247,251,0.9)" glow="none" lineHeight={1.5} stagger={2} maxW={mw} />
						<ArText lines={TXT.patron3} frame={f} start={B + 42} size={72} font={AF.naskh} weight={700} color="#F0D48E" glow="gold" lineHeight={1.5} stagger={3} maxW={mw} />
						<div style={{height: 30}} />
						<ArText lines={TXT.beneficiaryLabel} frame={f} start={B + 50} size={38} font={AF.body} weight={600} color={C.gold} glow="none" lineHeight={1.4} maxW={mw} />
						<ArText lines={TXT.beneficiary} frame={f} start={B + 52} size={48} font={AF.body} weight={600} color="rgba(244,247,251,0.92)" glow="none" stagger={1} lineHeight={1.4} maxW={mw} />
						<ArText lines={TXT.executorLabel} frame={f} start={B + 58} size={38} font={AF.body} weight={600} color={C.gold} glow="none" lineHeight={1.4} maxW={mw} style={{marginTop: 18}} />
						<ArText lines={TXT.executor} frame={f} start={B + 60} size={48} font={AF.body} weight={600} color="rgba(244,247,251,0.92)" glow="none" stagger={1} lineHeight={1.4} maxW={mw} />
						<ArText lines={TXT.partnerLabel} frame={f} start={B + 68} size={38} font={AF.body} weight={600} color={C.gold} glow="none" lineHeight={1.4} maxW={mw} style={{marginTop: 18}} />
						<ArText lines={TXT.partner} frame={f} start={B + 72} size={66} weight={900} color="#F0D48E" glow="gold" stagger={2} maxW={mw} />
					</div>
				</>
			) : null}
		</AbsoluteFill>
	);
};

export const SClose: React.FC<{frame: number}> = ({frame: f}) => (
	<>
		<Gains f={f} />
		<Launch f={f} />
	</>
);
