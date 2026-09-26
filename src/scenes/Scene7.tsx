import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, expoInOut, expoOut, lerp, ramp, rnd, smooth} from '../theme';
import {DOC_H, DOC_W} from '../components/Document';
import {Label, Words} from '../components/Primitives';
import {s6DocPose} from './Scene6';

/** Scene 7 — TAMKEEN resolve (20–25s) */
const COLS = 26;
const ROWS = 36;
const LINE_Y = 598;

const PARTS = (() => {
	const out: {u: number; v: number; ang: number; mag: number; tx: number; delay: number; col: string; r: number}[] = [];
	for (let j = 0; j < ROWS; j++)
		for (let i = 0; i < COLS; i++) {
			const k = j * COLS + i;
			const c = rnd(`pc${k}`);
			out.push({
				u: (i + 0.5 + (rnd(`pu${k}`) - 0.5) * 0.6) / COLS,
				v: (j + 0.5 + (rnd(`pv${k}`) - 0.5) * 0.6) / ROWS,
				ang: rnd(`pa${k}`) * Math.PI * 2,
				mag: 90 + rnd(`pm${k}`) * 360,
				tx: (rnd(`pt${k}`) - 0.5) * 2,
				delay: rnd(`pd${k}`) * 14 + (j / ROWS) * 6,
				col: c > 0.72 ? C.gold : c > 0.3 ? C.cyan : '#FFFFFF',
				r: 0.8 + rnd(`pr${k}`) * 1.6,
			});
		}
	return out;
})();

const START = s6DocPose(600);

const VC: [number, number] = [960, LINE_Y];

/** Coherent spiral: every point orbits the same centre, in the same direction,
 *  while its radius collapses onto the brand hairline. */
const partPos = (p: (typeof PARTS)[number], f: number) => {
	const w = DOC_W * START.s;
	const h = DOC_H * START.s;
	const sx = START.x - w / 2 + p.u * w - VC[0];
	const sy = START.y - h / 2 + p.v * h - VC[1];
	const tx = p.tx * 460 * (0.35 + 0.65 * Math.abs(p.tx));
	const r0 = Math.hypot(sx, sy);
	const a0 = Math.atan2(sy, sx);
	const r1 = Math.abs(tx);
	let a1 = tx >= 0 ? 0 : Math.PI;
	while (a1 < a0 + Math.PI * 0.7) a1 += Math.PI * 2;
	const m = ramp(f, 600 + p.delay, 650 + p.delay, 0, 1, expoInOut);
	const r = lerp(r0, r1, m) * (1 + 0.35 * Math.sin(Math.PI * m));
	const a = lerp(a0, a1, m);
	return {x: VC[0] + r * Math.cos(a), y: VC[1] + r * Math.sin(a) * lerp(1, 0.02, m * m), m};
};

export const Scene7: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 596) return null;
	const push = ramp(f, 610, 750, 0, 1, smooth);
	const hair = ramp(f, 642, 690, 0, 1, expoOut);
	const track = lerp(64, 30, ramp(f, 650, 736, 0, 1, expoOut));
	const letters = 'TAMKEEN'.split('');
	const gleam = ramp(f, 694, 736, -0.3, 1.3, smooth);

	return (
		<AbsoluteFill style={{transform: `scale(${1 + push * 0.035})`}}>
			{/* dissolving document → converging particles (drawn as velocity streaks) */}
			{f < 700 ? (
				<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
					{PARTS.map((p, i) => {
						const a = partPos(p, f);
						const b0 = partPos(p, f - 1.5);
						// clamp streak length: motion-blur look without long chords
						const dx = b0.x - a.x;
						const dy = b0.y - a.y;
						const len = Math.hypot(dx, dy);
						const k = len > 28 ? 28 / len : 1;
						const b = {x: a.x + dx * k, y: a.y + dy * k};
						const appear = ramp(f, 598 + p.delay * 0.3, 606 + p.delay * 0.3);
						const fade = 1 - ramp(a.m, 0.9, 1) * ramp(f, 650, 690);
						const o = appear * fade * 0.9;
						if (o <= 0.01) return null;
						return (
							<line
								key={i}
								x1={b.x}
								y1={b.y}
								x2={a.x + 0.01}
								y2={a.y}
								stroke={p.col}
								strokeOpacity={o}
								strokeWidth={p.r * 0.9}
								strokeLinecap="round"
							/>
						);
					})}
				</svg>
			) : null}

			{/* gold hairline */}
			<div
				style={{
					position: 'absolute',
					left: 960 - 460 * hair,
					width: 920 * hair,
					top: LINE_Y,
					height: 1,
					background: `linear-gradient(90deg, rgba(217,180,106,0) 0%, ${C.gold} 30%, #F6E3B4 50%, ${C.gold} 70%, rgba(217,180,106,0) 100%)`,
					boxShadow: '0 0 16px rgba(217,180,106,0.5)',
				}}
			/>
			<div style={{position: 'absolute', left: 960 - 4, top: LINE_Y - 4, width: 8, height: 8, transform: `rotate(45deg) scale(${hair})`, background: C.gold, boxShadow: `0 0 14px ${C.gold}`}} />

			{/* wordmark */}
			<div style={{position: 'absolute', top: 408, width: 1920, textAlign: 'center'}}>
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
										fontSize: 150,
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

			{/* subtitle */}
			<div style={{position: 'absolute', top: 626, width: 1920, display: 'flex', justifyContent: 'center'}}>
				<Words
					text="Entrepreneurship, Technology Localization & Software"
					frame={f}
					start={672}
					stagger={3}
					dur={24}
					style={{fontFamily: F.sans, fontWeight: 400, fontSize: 28, color: 'rgba(244,247,251,0.78)', letterSpacing: 1.5}}
				/>
			</div>

			{/* final line */}
			<div style={{position: 'absolute', top: 800, width: 1920, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<Label size={12} spacing={6} color={C.cyan} style={{opacity: ramp(f, 684, 700), marginBottom: 18}}>
					— &nbsp;Digital Certificate of Origin Attestation&nbsp; —
				</Label>
				<Words
					text="Powering Digital Trade Transformation"
					frame={f}
					start={688}
					stagger={4}
					dur={26}
					style={{fontFamily: F.sans, fontWeight: 300, fontSize: 40, color: C.white, letterSpacing: 0.5}}
					wordStyle={(i) => (i === 1 || i === 2 ? {color: C.cyan} : {})}
				/>
			</div>
		</AbsoluteFill>
	);
};

