import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, expoInOut, expoOut, lerp, ramp, rnd, smooth} from '../../theme';
import {DOC_H, DOC_W} from '../../components/Document';
import {Words} from '../../components/Primitives';
import {docPose} from '../DocJourney';
import {CX} from '../layout';

/** Scene 8 — TAMKEEN (600–750f). Centred lock-up, ≤ 720 px wide, optical centre ≈ 960. */
const COLS = 24;
const ROWS = 32;
const LINE_Y = 866;
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

/** Coherent spiral: all points orbit the same centre in the same direction and collapse onto the hairline. */
const partPos = (p: (typeof PARTS)[number], f: number) => {
	const w = DOC_W * START.s;
	const h = DOC_H * START.s;
	const sx = START.x - w / 2 + p.u * w - VC[0];
	const sy = START.y - h / 2 + p.v * h - VC[1];
	const tx = p.tx * 320 * (0.35 + 0.65 * Math.abs(p.tx));
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
	const push = ramp(f, 610, 750, 0, 1, smooth);
	const hair = ramp(f, 642, 690, 0, 1, expoOut);
	const track = lerp(28, 14, ramp(f, 650, 736, 0, 1, expoOut));
	const letters = 'TAMKEEN'.split('');
	const gleam = ramp(f, 694, 736, -0.3, 1.3, smooth);

	return (
		<AbsoluteFill style={{transform: `scale(${1 + push * 0.035})`, transformOrigin: `${CX}px 960px`}}>
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
					left: CX - 320 * hair,
					width: 640 * hair,
					top: LINE_Y,
					height: 1,
					background: `linear-gradient(90deg, rgba(217,180,106,0) 0%, ${C.gold} 28%, #F6E3B4 50%, ${C.gold} 72%, rgba(217,180,106,0) 100%)`,
					boxShadow: '0 0 16px rgba(217,180,106,0.5)',
				}}
			/>
			<div style={{position: 'absolute', left: CX - 4, top: LINE_Y - 4, width: 8, height: 8, transform: `rotate(45deg) scale(${hair})`, background: C.gold, boxShadow: `0 0 14px ${C.gold}`}} />

			{/* wordmark */}
			<div style={{position: 'absolute', top: 700, left: 0, right: 0, textAlign: 'center'}}>
				<div style={{display: 'inline-flex', marginRight: -track}}>
					{letters.map((ch, i) => {
						const p = ramp(f, 652 + i * 3, 688 + i * 3, 0, 1, expoOut);
						return (
							<span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: 8}}>
								<span
									style={{
										display: 'inline-block',
										fontFamily: F.sans,
										fontWeight: 600,
										fontSize: 120,
										lineHeight: 1,
										letterSpacing: track,
										transform: `translateY(${(1 - p) * 100}%)`,
										filter: p < 1 ? `blur(${(1 - p) * 12}px)` : undefined,
										opacity: p,
										background: `linear-gradient(100deg, ${C.white} 0%, ${C.white} ${gleam * 100 - 12}%, #FFF4D8 ${gleam * 100}%, ${C.white} ${gleam * 100 + 12}%, #C9D6E6 100%)`,
										backgroundSize: `${letters.length * 100}% 100%`,
										backgroundPosition: `${(i / (letters.length - 1)) * 100}% 0`,
										WebkitBackgroundClip: 'text',
										backgroundClip: 'text',
										color: 'transparent',
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
			<div style={{position: 'absolute', top: 904, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				{['Entrepreneurship, Technology', 'Localization & Software'].map((t, i) => (
					<Words key={i} text={t} frame={f} start={672 + i * 6} stagger={3} dur={24} style={{fontFamily: F.sans, fontWeight: 400, fontSize: 36, lineHeight: 1.05, color: 'rgba(244,247,251,0.8)', letterSpacing: 1}} />
				))}
			</div>

			{/* final line — two lines */}
			<div style={{position: 'absolute', top: 1086, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<Words text="Powering Digital Trade" frame={f} start={690} stagger={4} dur={26} style={{fontFamily: F.sans, fontWeight: 300, fontSize: 52, lineHeight: 1.02, color: C.white}} wordStyle={(i) => (i > 0 ? {color: C.cyan} : {})} />
				<Words text="Transformation" frame={f} start={700} dur={26} style={{fontFamily: F.sans, fontWeight: 300, fontSize: 52, lineHeight: 1.02, color: C.white}} />
			</div>
		</AbsoluteFill>
	);
};
