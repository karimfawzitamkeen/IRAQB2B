import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, expoIn, expoInOut, qbez, ramp, smooth} from '../../theme';
import {CertificateDoc, DOC_H, DOC_W} from '../../components/Document';
import {Check, DirBlur, Label} from '../../components/Primitives';
import {CX, SAFE} from '../layout';
import {Packet, PChapter, PortalStation, TraderEmblem} from '../ui';

/** Scene 2 — Trader submission + digital service fee (90–180f). Platform top · flight mid · trader bottom. */
const PORTAL: [number, number] = [CX, 770];
const TRADER: [number, number] = [CX, 1300];

const CARDS = [
	{title: 'Certificate of Origin', variant: 'coo' as const, born: 92, launch: 100, dur: 30, lane: 372},
	{title: 'Commercial Invoice', variant: 'invoice' as const, born: 102, launch: 114, dur: 30, lane: 708},
];
const FEE = {launch: 146, dur: 22};
const CARD_S = 0.42;

const cubic = (t: number): [number, number] => {
	// conduit: gentle S from the trader up to the portal
	const p0 = [CX, 1170];
	const p1 = [CX + 110, 1080];
	const p2 = [CX - 110, 990];
	const p3 = [CX, 900];
	const u = 1 - t;
	const a = u * u * u;
	const b = 3 * u * u * t;
	const c = 3 * u * t * t;
	const d = t * t * t;
	return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
};

const cardPos = (f: number, c: (typeof CARDS)[number]) => {
	const t = ramp(f, c.launch, c.launch + c.dur, 0, 1, expoInOut);
	const [x, y] = qbez([c.lane, 1160], [c.lane, 880], PORTAL, t);
	return {x, y, t};
};

const feePos = (f: number) => {
	const t = ramp(f, FEE.launch, FEE.launch + FEE.dur, 0, 1, expoInOut);
	const [x, y] = cubic(t);
	return {x, y, t};
};

const LEDGER = [
	{title: 'Certificate of Origin', status: 'Received', at: CARDS[0].launch + CARDS[0].dur, color: C.cyan},
	{title: 'Commercial Invoice', status: 'Received', at: CARDS[1].launch + CARDS[1].dur, color: C.cyan},
	{title: 'Digital service fee', status: 'Paid', at: FEE.launch + FEE.dur, color: C.cyan},
];

export const P2Submission: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 84 || f > 198) return null;
	const push = ramp(f, 166, 194, 0, 1, expoIn);
	const conduit = ramp(f, 92, 120, 0, 1, smooth);
	const pulses = [...LEDGER.map((l) => ramp(f, l.at - 2, l.at + 22, 0, 1, (t) => t))];
	const traderPulse = ramp(f, FEE.launch - 4, FEE.launch + 16) * (1 - ramp(f, FEE.launch + 16, FEE.launch + 30));

	const cd = (() => {
		let d = '';
		for (let i = 0; i <= 40; i++) {
			const [x, y] = cubic(i / 40);
			d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
		}
		return d;
	})();

	const fee = feePos(f);
	const feeTrail = Array.from({length: 10}, (_, k) => feePos(f - k * 0.8));

	return (
		<AbsoluteFill
			style={{
				transformOrigin: `${PORTAL[0]}px ${PORTAL[1]}px`,
				transform: `scale(${1 + push * 3.4})`,
				opacity: 1 - push,
				filter: push > 0 ? `blur(${push * 14}px)` : undefined,
			}}
		>
			<PChapter frame={f} start={94} end={170} index="01" title="Submission" sub="The trader submits the documents digitally." />

			{/* conduit + upward data motes */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<path d={cd} fill="none" stroke={C.white} strokeOpacity={0.28} strokeWidth={1} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - conduit} />
				<path d={cd} fill="none" stroke={C.cyan} strokeOpacity={0.7 * conduit} strokeWidth={1.4} strokeDasharray="2 14" strokeDashoffset={f * 2.2} />
				{Array.from({length: 6}, (_, k) => {
					const t = (f * 0.014 + k / 6) % 1;
					const [x, y] = cubic(t);
					return <circle key={k} cx={x} cy={y} r={2.6} fill="#DFF8FF" opacity={conduit * Math.sin(Math.PI * t) * 0.9} style={{filter: `drop-shadow(0 0 6px ${C.cyan})`}} />;
				})}
			</svg>

			<PortalStation x={PORTAL[0]} y={PORTAL[1]} f={f} enter={ramp(f, 92, 124)} pulses={pulses} />
			{/* platform label, instrument-style at the side */}
			<div style={{position: 'absolute', left: 700, top: 736, opacity: ramp(f, 104, 122), display: 'flex', alignItems: 'center', gap: 12}}>
				<div style={{width: 18 * ramp(f, 104, 122), height: 1, background: C.cyan}} />
				<div>
					<Label size={20} spacing={2} color={C.white}>
						Attestation
					</Label>
					<Label size={20} spacing={2} color={C.white} style={{marginTop: 6}}>
						Platform
					</Label>
				</div>
			</div>

			<TraderEmblem x={TRADER[0]} y={TRADER[1]} f={f} enter={ramp(f, 86, 112)} pulse={traderPulse} />
			<div style={{position: 'absolute', top: 1446, left: 0, right: 0, textAlign: 'center', opacity: ramp(f, 96, 114)}}>
				<Label size={20} spacing={4} color={C.white}>
					Trader · Registered Exporter
				</Label>
			</div>

			{/* flying documents: rise with trails + vertical motion blur */}
			{CARDS.map((c, i) => {
				const born = ramp(f, c.born, c.born + 14);
				if (born <= 0) return null;
				const p = cardPos(f, c);
				const p1 = cardPos(f - 1, c);
				const absorbed = ramp(p.t, 0.8, 1, 0, 1, smooth);
				if (absorbed >= 1) return null;
				// cards emerge small from the trader and grow as they rise, keeping the emblem readable
				const s = CARD_S * born * (0.5 + 0.5 * ramp(p.t, 0, 0.45)) * (1 - absorbed * 0.85);
				const trail = Array.from({length: 12}, (_, k) => cardPos(f - k * 0.7, c));
				return (
					<React.Fragment key={i}>
						<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
							{trail.slice(1).map((q, k) => (
								<line key={k} x1={trail[k].x} y1={trail[k].y} x2={q.x} y2={q.y} stroke={i === 0 ? C.cyan : '#DDF6FF'} strokeOpacity={(1 - k / 12) * 0.55 * (1 - absorbed)} strokeWidth={7 * (1 - k / 12)} strokeLinecap="round" />
							))}
						</svg>
						<DirBlur id={`p2c${i}`} vx={p.x - p1.x} vy={p.y - p1.y} k={0.26}>
							<div
								style={{
									position: 'absolute',
									left: p.x - DOC_W / 2,
									top: p.y - DOC_H / 2,
									width: DOC_W,
									height: DOC_H,
									opacity: born * (1 - absorbed),
									transform: `perspective(1400px) scale(${s}) rotateX(${14 - p.t * 10}deg) rotateY(${(i ? 1 : -1) * (10 - p.t * 10)}deg)`,
								}}
							>
								<CertificateDoc frame={f} id={`p2-${i}`} variant={c.variant} build={ramp(f, c.born, c.born + 16, 0.4, 1)} glow={0.8} />
							</div>
						</DirBlur>
						{/* upload rail leads above each rising card */}
						<div
							style={{
								position: 'absolute',
								left: p.x - 135,
								top: p.y - (DOC_H * s) / 2 - 64,
								width: 270,
								opacity: born * (1 - ramp(p.t, 0.45, 0.7)),
							}}
						>
							<Label size={18} spacing={2} color={C.white}>
								{c.title}
							</Label>
							<div style={{height: 2, background: 'rgba(255,255,255,0.14)', marginTop: 8}}>
								<div style={{height: 2, width: `${p.t * 100}%`, background: C.cyan, boxShadow: `0 0 10px ${C.cyan}`}} />
							</div>
							<Label size={16} spacing={2} color={C.cyan} style={{marginTop: 6}}>
								Uploading · {Math.round(p.t * 100)}%
							</Label>
						</div>
					</React.Fragment>
				);
			})}

			{/* digital service fee — brief, part of submission */}
			{fee.t > 0 && fee.t < 1 ? (
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
					<Packet x={fee.x} y={fee.y} trail={feeTrail} color={C.cyan} />
				</svg>
			) : null}
			{fee.t > 0 && fee.t < 0.85 ? (
				<div style={{position: 'absolute', left: fee.x + 34, top: fee.y - 16, opacity: ramp(fee.t, 0, 0.15) * (1 - ramp(fee.t, 0.6, 0.85))}}>
					<Label size={18} spacing={3} color={C.cyan}>
						Service fee
					</Label>
				</div>
			) : null}

			{/* receipt ledger above the portal */}
			<div style={{position: 'absolute', left: SAFE.left, top: 414, width: SAFE.right - SAFE.left}}>
				{LEDGER.map((l, i) => {
					const a = ramp(f, l.at, l.at + 14);
					return (
						<div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, height: 50, opacity: a, transform: `translateY(${(1 - a) * 12}px)`, borderBottom: '1px solid rgba(244,247,251,0.08)'}}>
							<Check p={ramp(f, l.at + 2, l.at + 18, 0, 1, (t) => t)} frame={f} size={30} color={l.color} />
							<div style={{fontFamily: F.sans, fontSize: 28, fontWeight: 400, color: C.white}}>{l.title}</div>
							<Label size={20} spacing={4} color={l.color} style={{marginLeft: 'auto'}}>
								{l.status}
							</Label>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
