import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, expoInOut, expoOut, lerp, ramp, rnd, smooth} from '../../theme';
import {DOC_H, DOC_W} from '../../components/Document';
import {Words} from '../../components/Primitives';
import {docPose} from '../DocJourney';
import {CX} from '../layout';

/**
 * Scene 8 — TAMKEEN (600–900f, 10 s). Centred lock-up for a display screen read at 4 m,
 * ending on the contact line "Contact us : 07803158768".
 */
const COLS = 24;
const ROWS = 32;
const LINE_Y = 640;
const VC: [number, number] = [CX, LINE_Y];

const PARTS = (() => {
	const out: {u: number; v: number; tx: number; delay: number; col: string; r: number}[] = [];
	for (let j = 0; j < ROWS; j++)
		for (let i = 0; i < COLS; i++) {
			const k = j * COLS + i;
			const c = rnd(`ppc${k}`);
			out.push({
				u: (i + 0.5 + (rnd(`ppu${k}`) - 0.5) * 0.6) / COLS,
				v: (j + 0.5 + (rnd(`ppv${k}`) - 0.5) * 0.6) / ROWS,
				tx: (rnd(`ppt${k}`) - 0.5) * 2,
				delay: rnd(`ppd${k}`) * 14 + (j / ROWS) * 6,
				col: c > 0.72 ? C.gold : c > 0.3 ? C.cyan : '#FFFFFF',
				r: 0.8 + rnd(`ppr${k}`) * 1.6,
			});
		}
	return out;
})();

const START = docPose(600);

/** White → warm highlight, 0..1. */
const mixWarm = (t: number) => {
	const a = [244, 247, 251];
	const b = [255, 233, 182];
	return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * t)).join(',')})`;
};

/** Coherent spiral: all points orbit the same centre in the same direction and collapse onto the hairline. */
const partPos = (p: (typeof PARTS)[number], f: number) => {
	const w = DOC_W * START.s;
	const h = DOC_H * START.s;
	const sx = START.x - w / 2 + p.u * w - VC[0];
	const sy = START.y - h / 2 + p.v * h - VC[1];
	const tx = p.tx * 420 * (0.35 + 0.65 * Math.abs(p.tx));
	const r0 = Math.hypot(sx, sy);
	const a0 = Math.atan2(sy, sx);
	const r1 = Math.abs(tx);
	let a1 = tx >= 0 ? 0 : Math.PI;
	while (a1 < a0 + Math.PI * 0.7) a1 += Math.PI * 2;
	const m = ramp(f, 600 + p.delay, 650 + p.delay, 0, 1, expoInOut);
	const r = lerp(r0, r1, m) * (1 + 0.3 * Math.sin(Math.PI * m));
	const a = lerp(a0, a1, m);
	return {x: VC[0] + r * Math.cos(a), y: VC[1] + r * Math.sin(a) * lerp(1, 0.02, m * m), m};
};

export const P8Brand: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 596) return null;
	const push = ramp(f, 610, 900, 0, 1, smooth);
	const hair = ramp(f, 642, 690, 0, 1, expoOut);
	const track = lerp(28, 10, ramp(f, 650, 740, 0, 1, expoOut));
	const letters = 'TAMKEEN'.split('');
	// a light gleam crosses the wordmark twice during the long hold
	const gleam = f < 800 ? ramp(f, 694, 740, -0.3, 1.3, smooth) : ramp(f, 810, 856, -0.3, 1.3, smooth);
	const contact = ramp(f, 722, 750, 0, 1, expoOut);
	const breathe = 0.5 + 0.5 * Math.sin((f - 750) / 14);

	return (
		<AbsoluteFill style={{transform: `scale(${1 + push * 0.03})`, transformOrigin: `${CX}px 960px`}}>
			{f < 700 ? (
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
					{PARTS.map((p, i) => {
						const a = partPos(p, f);
						const b0 = partPos(p, f - 1.5);
						const dx = b0.x - a.x;
						const dy = b0.y - a.y;
						const len = Math.hypot(dx, dy);
						const k = len > 26 ? 26 / len : 1;
						const appear = ramp(f, 598 + p.delay * 0.3, 606 + p.delay * 0.3);
						const fade = 1 - ramp(a.m, 0.9, 1) * ramp(f, 650, 690);
						const o = appear * fade * 0.9;
						if (o <= 0.01) return null;
						return <line key={i} x1={a.x + dx * k} y1={a.y + dy * k} x2={a.x + 0.01} y2={a.y} stroke={p.col} strokeOpacity={o} strokeWidth={p.r * 0.9} strokeLinecap="round" />;
					})}
				</svg>
			) : null}

			{/* gold hairline + centre diamond */}
			<div
				style={{
					position: 'absolute',
					left: CX - 420 * hair,
					width: 840 * hair,
					top: LINE_Y,
					height: 1,
					background: `linear-gradient(90deg, rgba(217,180,106,0) 0%, ${C.gold} 28%, #F6E3B4 50%, ${C.gold} 72%, rgba(217,180,106,0) 100%)`,
					boxShadow: '0 0 16px rgba(217,180,106,0.5)',
				}}
			/>
			<div style={{position: 'absolute', left: CX - 4, top: LINE_Y - 4, width: 8, height: 8, transform: `rotate(45deg) scale(${hair})`, background: C.gold, boxShadow: `0 0 14px ${C.gold}`}} />

			{/* wordmark */}
			<div style={{position: 'absolute', top: 460, left: 0, right: 0, textAlign: 'center'}}>
				<div style={{display: 'inline-flex', marginRight: -track}}>
					{letters.map((ch, i) => {
						const p = ramp(f, 652 + i * 3, 688 + i * 3, 0, 1, expoOut);
						// per-letter gleam: the light band passes letter by letter (solid colour + glow, no background-clip)
						const hl = Math.max(0, 1 - Math.abs((i + 0.5) / letters.length - gleam) / 0.2);
						return (
							<span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: 8}}>
								<span
									style={{
										display: 'inline-block',
										fontFamily: F.sans,
										fontWeight: 600,
										fontSize: 150,
										lineHeight: 1,
										letterSpacing: track,
										transform: `translateY(${(1 - p) * 100}%)`,
										filter: p < 1 ? `blur(${(1 - p) * 12}px)` : undefined,
										opacity: p,
										color: hl > 0.01 ? mixWarm(hl) : C.white,
										textShadow: hl > 0.01 ? `0 0 ${30 * hl}px rgba(255,236,190,${0.75 * hl})` : undefined,
									}}
								>
									{ch}
								</span>
							</span>
						);
					})}
				</div>
			</div>

			{/* subtitle — two lines */}
			<div style={{position: 'absolute', top: 690, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				{['Entrepreneurship, Technology', 'Localization & Software'].map((t, i) => (
					<Words key={i} text={t} frame={f} start={672 + i * 6} stagger={3} dur={24} style={{fontFamily: F.sans, fontWeight: 400, fontSize: 50, lineHeight: 1.04, color: 'rgba(244,247,251,0.88)'}} />
				))}
			</div>

			{/* final line — two lines */}
			<div style={{position: 'absolute', top: 900, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<Words text="Powering Digital Trade" frame={f} start={690} stagger={4} dur={26} style={{fontFamily: F.sans, fontWeight: 300, fontSize: 76, lineHeight: 1.02, color: C.white, letterSpacing: -1}} wordStyle={(i) => (i > 0 ? {color: C.cyan} : {})} />
				<Words text="Transformation" frame={f} start={700} dur={26} style={{fontFamily: F.sans, fontWeight: 300, fontSize: 76, lineHeight: 1.02, color: C.white, letterSpacing: -1}} />
			</div>

			{/* contact — the call to action, held for the rest of the film */}
			<div style={{position: 'absolute', top: 1230, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: contact}}>
				<div
					style={{
						position: 'relative',
						width: 880,
						padding: '44px 0 50px',
						borderRadius: 28,
						border: `2px solid rgba(217,180,106,${0.35 + 0.35 * contact})`,
						background: 'linear-gradient(180deg, rgba(217,180,106,0.10), rgba(8,18,36,0.72))',
						boxShadow: `0 0 ${40 + 30 * breathe * contact}px rgba(217,180,106,${0.18 + 0.12 * breathe}), inset 0 1px 0 rgba(255,255,255,0.12)`,
						transform: `translateY(${(1 - contact) * 40}px) scale(${0.96 + 0.04 * contact})`,
						textAlign: 'center',
					}}
				>
					<div style={{fontFamily: F.sans, fontWeight: 400, fontSize: 58, color: C.gold, letterSpacing: 1}}>Contact us :</div>
					<div style={{marginTop: 14, fontFamily: F.sans, fontWeight: 600, fontSize: 104, lineHeight: 1, color: C.white, letterSpacing: 2, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
						{'07803158768'.split('').map((d, i) => {
							const p = ramp(f, 730 + i * 2, 752 + i * 2, 0, 1, expoOut);
							return (
								<span key={i} style={{display: 'inline-block', transform: `translateY(${(1 - p) * 30}px)`, opacity: p, filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined}}>
									{d}
								</span>
							);
						})}
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
