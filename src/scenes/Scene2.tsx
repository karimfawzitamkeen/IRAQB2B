import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, expoIn, expoInOut, qbez, ramp, smooth} from '../theme';
import {CertificateDoc, DOC_H, DOC_W} from '../components/Document';
import {Chapter, Check, DirBlur, Label} from '../components/Primitives';

/** Scene 2 — Submission (3–6s) */
const TRADER: [number, number] = [430, 540];
const PORTAL: [number, number] = [1490, 520];
const CTRL: [number, number] = [960, 250];

const CARDS = [
	{title: 'Certificate of Origin', variant: 'coo' as const, born: 92, launch: 104, dur: 30, offset: -50},
	{title: 'Commercial Invoice', variant: 'invoice' as const, born: 100, launch: 116, dur: 30, offset: 50},
];

const cardPos = (f: number, c: (typeof CARDS)[number]) => {
	const t = ramp(f, c.launch, c.launch + c.dur, 0, 1, expoInOut);
	const start: [number, number] = [TRADER[0] + 190 + c.offset * 0.6, TRADER[1] - 190 + c.offset * 1.4];
	const ctrl: [number, number] = [CTRL[0], CTRL[1] + c.offset * 2.2];
	const [x, y] = qbez(start, ctrl, PORTAL, t);
	return {x, y, t};
};

export const Scene2: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 84 || f > 196) return null;
	const enter = ramp(f, 86, 116);
	const push = ramp(f, 164, 192, 0, 1, expoIn);
	const conduit = ramp(f, 94, 124, 0, 1, smooth);

	// conduit bezier path
	const cd = `M${TRADER[0] + 110} ${TRADER[1] - 60} Q${CTRL[0]} ${CTRL[1]} ${PORTAL[0] - 110} ${PORTAL[1]}`;

	const arrivals = CARDS.map((c) => c.launch + c.dur);
	const pulse = (i: number) => ramp(f, arrivals[i] - 2, arrivals[i] + 22, 0, 1, (t) => t);

	return (
		<AbsoluteFill
			style={{
				transformOrigin: `${PORTAL[0]}px ${PORTAL[1]}px`,
				transform: `scale(${1 + push * 3.2})`,
				opacity: 1 - push,
				filter: push > 0 ? `blur(${push * 14}px)` : undefined,
			}}
		>
			<Chapter frame={f} start={92} end={170} index="01" title="Submission" sub="The exporter files the trade documents digitally." />

			{/* conduit */}
			<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
				<defs>
					<linearGradient id="cd-g" x1="0" x2="1">
						<stop offset="0%" stopColor={C.white} stopOpacity={0.5} />
						<stop offset="100%" stopColor={C.cyan} stopOpacity={0.9} />
					</linearGradient>
				</defs>
				<path d={cd} fill="none" stroke="url(#cd-g)" strokeOpacity={0.3} strokeWidth={1} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - conduit} />
				<path d={cd} fill="none" stroke={C.cyan} strokeOpacity={0.7 * conduit} strokeWidth={1.4} strokeDasharray="2 14" strokeDashoffset={-f * 2.2} />
				{Array.from({length: 7}, (_, k) => {
					const t = (f * 0.011 + k / 7) % 1;
					const [x, y] = qbez([TRADER[0] + 110, TRADER[1] - 60], CTRL, [PORTAL[0] - 110, PORTAL[1]], t);
					return <circle key={k} cx={x} cy={y} r={2.6} fill="#DFF8FF" opacity={conduit * Math.sin(Math.PI * t) * 0.9} style={{filter: `drop-shadow(0 0 6px ${C.cyan})`}} />;
				})}
			</svg>

			<Trader f={f} enter={enter} />
			<Portal f={f} enter={ramp(f, 92, 124)} pulses={[pulse(0), pulse(1)]} />

			{/* flying documents with trails + motion blur */}
			{CARDS.map((c, i) => {
				const born = ramp(f, c.born, c.born + 14);
				if (born <= 0) return null;
				const p = cardPos(f, c);
				const p1 = cardPos(f - 1, c);
				const absorbed = ramp(p.t, 0.82, 1, 0, 1, smooth);
				if (absorbed >= 1) return null;
				const s = 0.34 * born * (1 - absorbed * 0.85);
				const vx = p.x - p1.x;
				const vy = p.y - p1.y;
				const trail = Array.from({length: 12}, (_, k) => cardPos(f - k * 0.7, c));
				const ang = Math.atan2(vy, vx) * (180 / Math.PI);
				return (
					<React.Fragment key={i}>
						<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
							{trail.slice(1).map((q, k) => (
								<line
									key={k}
									x1={trail[k].x}
									y1={trail[k].y}
									x2={q.x}
									y2={q.y}
									stroke={i === 0 ? C.cyan : '#DDF6FF'}
									strokeOpacity={(1 - k / 12) * 0.55 * (1 - absorbed)}
									strokeWidth={6 * (1 - k / 12)}
									strokeLinecap="round"
								/>
							))}
						</svg>
						<DirBlur id={`s2c${i}`} vx={vx} vy={vy} k={0.28}>
							<div
								style={{
									position: 'absolute',
									left: p.x - DOC_W / 2,
									top: p.y - DOC_H / 2,
									width: DOC_W,
									height: DOC_H,
									opacity: born * (1 - absorbed),
									transform: `perspective(1400px) scale(${s}) rotateZ(${p.t > 0 && p.t < 1 ? ang * 0.08 : 0}deg) rotateY(${-14 + p.t * 20}deg)`,
								}}
							>
								<CertificateDoc frame={f} id={`s2-${i}`} variant={c.variant} build={ramp(f, c.born, c.born + 16, 0.4, 1)} glow={0.8} />
							</div>
						</DirBlur>
						{/* upload rail */}
						<div
							style={{
								position: 'absolute',
								left: p.x - 100,
								top: p.y + DOC_H * s * 0.5 + 16,
								width: 200,
								opacity: born * (1 - absorbed) * (1 - ramp(p.t, 0.6, 0.8)),
							}}
						>
							<Label size={11} spacing={2.5} color={C.white}>
								{c.title}
							</Label>
							<div style={{height: 2, background: 'rgba(255,255,255,0.12)', marginTop: 8}}>
								<div style={{height: 2, width: `${p.t * 100}%`, background: C.cyan, boxShadow: `0 0 10px ${C.cyan}`}} />
							</div>
							<Label size={10} spacing={2} color={C.cyan} style={{marginTop: 6}}>
								Uploading · {Math.round(p.t * 100)}%
							</Label>
						</div>
					</React.Fragment>
				);
			})}

			{/* receipt ledger */}
			<div style={{position: 'absolute', left: PORTAL[0] - 170, top: 836}}>
				{CARDS.map((c, i) => {
					const a = ramp(f, arrivals[i], arrivals[i] + 16);
					return (
						<div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, opacity: a, transform: `translateY(${(1 - a) * 12}px)`}}>
							<Check p={ramp(f, arrivals[i] + 2, arrivals[i] + 20, 0, 1, (t) => t)} frame={f} size={24} />
							<div style={{fontFamily: '"Inter"', fontSize: 19, fontWeight: 400, color: C.white, width: 220}}>{c.title}</div>
							<Label size={11} spacing={3} color={C.cyan}>
								Received
							</Label>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

const Trader: React.FC<{f: number; enter: number}> = ({f, enter}) => {
	const hex = (r: number) =>
		Array.from({length: 6}, (_, i) => {
			const a = (Math.PI / 3) * i - Math.PI / 2;
			return `${i ? 'L' : 'M'}${(r * Math.cos(a)).toFixed(1)} ${(r * Math.sin(a)).toFixed(1)}`;
		}).join('') + 'Z';
	return (
		<div style={{position: 'absolute', left: TRADER[0] - 150, top: TRADER[1] - 150, width: 300, height: 300, opacity: enter, transform: `scale(${0.85 + 0.15 * enter})`}}>
			<div style={{position: 'absolute', inset: -60, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,216,255,0.14) 0%, rgba(79,216,255,0) 65%)'}} />
			<svg width={300} height={300} viewBox="-150 -150 300 300" style={{overflow: 'visible'}}>
				<g transform={`rotate(${f * 0.3})`}>
					{Array.from({length: 72}, (_, i) => {
						const a = (i / 72) * Math.PI * 2;
						const l = i % 6 === 0 ? 10 : 4;
						return <line key={i} x1={Math.cos(a) * 128} y1={Math.sin(a) * 128} x2={Math.cos(a) * (128 - l)} y2={Math.sin(a) * (128 - l)} stroke={C.white} strokeOpacity={i % 6 === 0 ? 0.5 : 0.2} />;
					})}
				</g>
				<path d={hex(104)} fill="none" stroke={C.white} strokeOpacity={0.35} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - enter} />
				<path d={hex(92)} fill="rgba(79,216,255,0.05)" stroke={C.cyan} strokeOpacity={0.6} strokeWidth={1.2} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ramp(enter, 0.2, 1)} />
				<circle r={112} fill="none" stroke={C.cyan} strokeOpacity={0.4} strokeDasharray="30 200" transform={`rotate(${-f * 1.6})`} />
				{/* abstract figure */}
				<circle cx={0} cy={-26} r={18} fill="none" stroke={C.white} strokeWidth={2} />
				<path d="M-38 42 C -34 6, 34 6, 38 42" fill="none" stroke={C.white} strokeWidth={2} strokeLinecap="round" />
				<line x1={-38} y1={42} x2={38} y2={42} stroke={C.cyan} strokeOpacity={0.6} />
			</svg>
			<div style={{position: 'absolute', top: 318, width: 300, textAlign: 'center'}}>
				<Label size={15} spacing={6} color={C.white}>
					Exporter
				</Label>
				<Label size={11} spacing={3} style={{marginTop: 8}}>
					Trader · Registered Entity
				</Label>
			</div>
		</div>
	);
};

const Portal: React.FC<{f: number; enter: number; pulses: number[]}> = ({f, enter, pulses}) => {
	const W = 420;
	const boost = pulses.reduce((a, p) => a + (p > 0 && p < 1 ? 1 - p : 0), 0);
	return (
		<div style={{position: 'absolute', left: PORTAL[0] - W / 2, top: PORTAL[1] - 230, width: W, height: 460, opacity: enter}}>
			<div style={{position: 'absolute', left: W / 2 - 2, top: 30, width: 4, height: 400, background: 'linear-gradient(180deg, rgba(79,216,255,0) 0%, rgba(79,216,255,0.7) 50%, rgba(79,216,255,0) 100%)', filter: 'blur(3px)', opacity: 0.6 + boost * 0.4}} />
			<div style={{position: 'absolute', left: W / 2 - 110, top: 120, width: 220, height: 220, borderRadius: '50%', background: `radial-gradient(circle, rgba(79,216,255,${0.25 + boost * 0.35}) 0%, rgba(79,216,255,0) 65%)`}} />
			<svg width={W} height={460} viewBox={`${-W / 2} -230 ${W} 460`} style={{overflow: 'visible'}}>
				{[-120, -60, 0, 60, 120].map((y, i) => {
					const rx = (150 - Math.abs(y) * 0.35) * (0.7 + 0.3 * enter);
					const ry = rx * 0.26;
					return (
						<g key={i}>
							<ellipse cx={0} cy={y} rx={rx} ry={ry} fill={i === 2 ? 'rgba(79,216,255,0.06)' : 'none'} stroke={i === 2 ? C.cyan : C.white} strokeOpacity={i === 2 ? 0.8 : 0.22} strokeWidth={i === 2 ? 1.4 : 1} />
							<ellipse cx={0} cy={y} rx={rx} ry={ry} fill="none" stroke={C.cyan} strokeOpacity={0.9} strokeWidth={2} pathLength={1} strokeDasharray="0.12 0.88" strokeDashoffset={(f * (0.012 + boost * 0.03) * (i % 2 ? 1 : -1)) % 1} />
						</g>
					);
				})}
				{pulses.map((p, i) =>
					p > 0 && p < 1 ? (
						<ellipse key={i} cx={0} cy={0} rx={60 + p * 220} ry={(60 + p * 220) * 0.26} fill="none" stroke={C.cyan} strokeOpacity={(1 - p) * 0.9} strokeWidth={2} />
					) : null,
				)}
				<circle r={10 + boost * 6} fill="#E8FAFF" style={{filter: `drop-shadow(0 0 16px ${C.cyan})`}} />
			</svg>
			<div style={{position: 'absolute', top: 470, width: W, textAlign: 'center'}}>
				<Label size={15} spacing={6} color={C.white}>
					Attestation Platform
				</Label>
			</div>
		</div>
	);
};
