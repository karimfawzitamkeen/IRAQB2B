import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, backOut, expoIn, expoInOut, expoOut, lerp, ramp} from '../../theme';
import {Check, Label} from '../../components/Primitives';
import {CX, SAFE} from '../layout';
import {AccountantMark, Packet, PChapter, ReceiptCard, SecureCore, TraderEmblem} from '../ui';

/**
 * Scene 5 — Sovereign fee & Accountant confirmation (330–420f).
 * Strictly sequential: instruction (DUE) → trader payment → receipt submitted → accountant confirmation.
 */
const CARD = {top: 440, h: 170};
const CORE: [number, number] = [CX, 890];
const TRADER: [number, number] = [CX, 1262];
const RAIL_Y = 1420;
const STEPS = [
	{label: 'Due', at: 350, x: 190},
	{label: 'Paid', at: 372, x: 397},
	{label: 'Receipt', at: 392, x: 603},
	{label: 'Confirmed', at: 410, x: 810},
];

const payPos = (f: number) => {
	const t = ramp(f, 350, 368, 0, 1, expoInOut);
	return {x: CX, y: lerp(TRADER[1] - 70, CORE[1], t), t};
};

export const P5SovereignFee: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 326 || f > 424) return null;
	const crane = ramp(f, 406, 422, 0, 1, expoIn);
	const unfold = ramp(f, 328, 344, 0, 1, expoOut);
	const toReceipt = ramp(f, 388, 396);
	const flip = ramp(f, 394, 412, 0, 1, expoInOut);
	const flipBack = flip > 0.5;

	const pay = payPos(f);
	const payTrail = Array.from({length: 10}, (_, k) => payPos(f - k * 0.8));
	const close = ramp(f, 366, 374, 0, 1, backOut);
	const hit = ramp(f, 366, 386, 0, 1, (t) => t);
	const burst = ramp(f, 370, 394, 0, 1, (t) => t);
	const energy = (hit > 0 && hit < 1 ? 1 - hit : 0) + (burst > 0 && burst < 1 ? 1 - burst : 0);

	const rIn = ramp(f, 372, 380, 0, 1, expoOut);
	const rFly = ramp(f, 380, 394, 0, 1, expoInOut);
	const receiptO = rIn * (1 - ramp(f, 390, 396));

	const streak = ramp(f, 404, 418, 0, 1, expoIn);

	return (
		<AbsoluteFill style={{transform: `translateY(${crane * 340}px)`, opacity: 1 - crane, filter: crane > 0 ? `blur(${crane * 12}px)` : undefined}}>
			<PChapter frame={f} start={332} end={410} index="04" title="Sovereign Fee" sub="Paid by the trader, confirmed by the accountant." />

			{/* instruction / receipt / confirmation card (authority, top) */}
			<div style={{position: 'absolute', left: SAFE.left, top: CARD.top, width: SAFE.right - SAFE.left, height: CARD.h, perspective: 1400}}>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						transformStyle: 'preserve-3d',
						transform: `scaleY(${unfold}) rotateX(${flip * 180}deg)`,
						opacity: unfold,
					}}
				>
					{/* front: fee due → receipt submitted */}
					<div style={{...face, visibility: flipBack ? 'hidden' : 'visible'}}>
						<div style={{position: 'relative', height: 64}}>
							<CardRow title="Sovereign Attestation Fee" sub="Issued after Attaché review" status="Due" color={C.gold} f={f} o={1 - toReceipt} />
							<CardRow title="Payment Receipt" sub="Proof submitted by trader" status="Submitted" color={C.cyan} f={f} o={toReceipt} />
						</div>
					</div>
					{/* back: accountant confirmation */}
					<div style={{...face, transform: 'rotateX(180deg)', visibility: flipBack ? 'visible' : 'hidden', borderLeftColor: C.gold, boxShadow: `0 0 ${40 * ramp(f, 404, 418)}px rgba(217,180,106,0.35)`}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 22}}>
							<AccountantMark size={66} p={ramp(f, 402, 416)} />
							<div>
								<div style={{fontFamily: F.sans, fontSize: 32, color: C.white}}>Confirmed by Accountant</div>
								<Label size={18} spacing={3} color={C.gold} style={{marginTop: 8}}>
									Sovereign fee · confirmed
								</Label>
							</div>
							<div style={{marginLeft: 'auto'}}>
								<Check p={ramp(f, 404, 420, 0, 1, (t) => t)} frame={f} size={48} color={C.gold} />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* secure core */}
			<div style={{position: 'absolute', inset: 0, opacity: ramp(f, 330, 346)}}>
				<SecureCore x={CORE[0]} y={CORE[1]} f={f} scale={0.78 + 0.04 * ramp(f, 330, 346)} close={close} energy={energy} lit={ramp(f, 352, 374, 0, 1, (t) => t)} hit={hit} burst={burst} />
			</div>

			{/* trader */}
			<TraderEmblem x={TRADER[0]} y={TRADER[1]} f={f} enter={ramp(f, 338, 356)} scale={0.6} pulse={ramp(f, 348, 356) * (1 - ramp(f, 356, 372))} />
			<div style={{position: 'absolute', top: 1340, left: 0, right: 0, textAlign: 'center', opacity: ramp(f, 344, 360)}}>
				<Label size={20} spacing={5} color={C.white}>
					Trader
				</Label>
			</div>

			{/* payment rises into the core */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				{pay.t > 0 && pay.t < 1 ? <Packet x={pay.x} y={pay.y} trail={payTrail} color={C.gold} /> : null}
				{/* confirmation streak rises toward the mission (→ Scene 6) */}
				{streak > 0 && streak < 1 ? (
					<line x1={CX} y1={CARD.top + CARD.h / 2} x2={CX} y2={lerp(CARD.top, -200, streak)} stroke={C.gold} strokeWidth={4} strokeLinecap="round" opacity={1 - streak * 0.4} style={{filter: `drop-shadow(0 0 12px ${C.gold})`}} />
				) : null}
			</svg>
			{pay.t > 0.1 && pay.t < 0.9 ? (
				<div style={{position: 'absolute', left: CX + 36, top: pay.y - 14}}>
					<Label size={18} spacing={3} color={C.gold}>
						Sovereign fee
					</Label>
				</div>
			) : null}

			{/* receipt leaves the core and is submitted upward */}
			{receiptO > 0 ? (
				<div
					style={{
						position: 'absolute',
						left: CX - 75,
						top: lerp(CORE[1] - 94, CARD.top + CARD.h / 2 - 94, rFly),
						opacity: receiptO,
						transform: `scale(${rIn * lerp(1, 0.45, rFly)}) rotate(${lerp(-6, 0, rFly)}deg)`,
					}}
				>
					<ReceiptCard w={150} />
				</div>
			) : null}

			{/* status rail */}
			<div style={{position: 'absolute', inset: 0, opacity: ramp(f, 340, 356)}}>
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
					<line x1={STEPS[0].x} y1={RAIL_Y} x2={STEPS[3].x} y2={RAIL_Y} stroke={C.white} strokeOpacity={0.15} />
					{STEPS.slice(0, -1).map((s, i) => {
						const n = STEPS[i + 1];
						const p = ramp(f, s.at, n.at, 0, 1, (t) => t);
						return <line key={i} x1={s.x} y1={RAIL_Y} x2={lerp(s.x, n.x, p)} y2={RAIL_Y} stroke={C.gold} strokeWidth={2} />;
					})}
					{STEPS.map((s, i) => {
						const on = ramp(f, s.at, s.at + 8);
						return (
							<g key={i}>
								<circle cx={s.x} cy={RAIL_Y} r={9} fill={on > 0.5 ? C.gold : '#0A1830'} stroke={on > 0.5 ? C.gold : 'rgba(244,247,251,0.35)'} strokeWidth={1.5} style={{filter: on > 0.5 ? `drop-shadow(0 0 8px ${C.gold})` : undefined}} />
								{on > 0 && on < 1 ? <circle cx={s.x} cy={RAIL_Y} r={9 + on * 20} fill="none" stroke={C.gold} strokeOpacity={1 - on} /> : null}
							</g>
						);
					})}
				</svg>
				{STEPS.map((s, i) => {
					const on = ramp(f, s.at, s.at + 8);
					return (
						<Label key={i} size={20} spacing={2} color={on > 0.5 ? C.gold : 'rgba(244,247,251,0.4)'} style={{position: 'absolute', top: RAIL_Y + 22, left: s.x - 100, width: 200, textAlign: 'center'}}>
							{s.label}
						</Label>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

const face: React.CSSProperties = {
	position: 'absolute',
	inset: 0,
	backfaceVisibility: 'hidden',
	WebkitBackfaceVisibility: 'hidden',
	borderLeft: `3px solid ${C.gold}`,
	background: 'linear-gradient(90deg, rgba(217,180,106,0.14), rgba(10,22,42,0.88) 40%, rgba(10,22,42,0.7))',
	padding: '24px 30px',
	boxSizing: 'border-box',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
};

const CardRow: React.FC<{title: string; sub: string; status: string; color: string; f: number; o: number}> = ({title, sub, status, color, f, o}) =>
	o <= 0 ? null : (
		<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', opacity: o}}>
			<div>
				<div style={{fontFamily: F.sans, fontSize: 32, color: C.white}}>{title}</div>
				<Label size={18} spacing={3} color="rgba(244,247,251,0.6)" style={{marginTop: 8}}>
					{sub}
				</Label>
			</div>
			<div
				style={{
					marginLeft: 'auto',
					padding: '8px 16px',
					borderRadius: 30,
					border: `1px solid ${color}`,
					fontFamily: F.mono,
					fontSize: 20,
					letterSpacing: 3,
					color,
					textTransform: 'uppercase',
					boxShadow: `0 0 ${10 + 8 * Math.sin(f / 5)}px ${color}44`,
				}}
			>
				{status}
			</div>
		</div>
	);
