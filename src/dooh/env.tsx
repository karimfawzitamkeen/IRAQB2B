import React from 'react';
import {AbsoluteFill} from 'remotion';
import {rnd} from '../theme';
import {hexGridPath} from './kit';
import {T} from './theme';

/** Global backdrop: navy radial, drifting hex grid, rising particles. */
const PARTS = Array.from({length: 120}, (_, i) => ({x: rnd(`dp-x${i}`), y: rnd(`dp-y${i}`), d: 0.2 + rnd(`dp-d${i}`) * 0.8, c: rnd(`dp-c${i}`) > 0.5}));
const HEX_BG = hexGridPath(70, 10, 20, -60, -80);

export const Backdrop: React.FC<{frame: number; energy?: number}> = ({frame: f, energy = 1}) => (
	<AbsoluteFill>
		<AbsoluteFill style={{background: `radial-gradient(ellipse 90% 65% at 50% 48%, #0B2A38 0%, ${T.navy2} 35%, ${T.navy} 65%, ${T.night} 100%)`}} />
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
			<path d={HEX_BG} fill="none" stroke={T.turq} strokeOpacity={0.05 + 0.03 * energy} strokeWidth={1.2} transform={`translate(0 ${(f * 0.8) % 210})`} />
			{PARTS.map((p, i) => {
				const y = ((((p.y * 1920 - f * (1.5 + p.d * 5) * energy) % 1920) + 1920) % 1920);
				return <circle key={i} cx={p.x * 1080} cy={y} r={0.7 + p.d * 1.8} fill={p.c ? T.cyan : T.turq} opacity={0.12 + p.d * 0.4} />;
			})}
		</svg>
	</AbsoluteFill>
);

// ---------------------------------------------------------------------------
// Night outdoor environment (stylised — no photographs were available)
// ---------------------------------------------------------------------------
const BUILDINGS = Array.from({length: 26}, (_, i) => ({
	x: -120 + i * 52 + rnd(`bx${i}`) * 30,
	w: 60 + rnd(`bw${i}`) * 90,
	h: 120 + rnd(`bh${i}`) * 380,
	lit: Array.from({length: 10}, (_, k) => ({x: rnd(`bl${i}-${k}`), y: rnd(`bly${i}-${k}`), warm: rnd(`blw${i}-${k}`) > 0.6})),
}));
const LAMPS = Array.from({length: 16}, (_, i) => ({x: rnd(`lx${i}`) * 1300 - 110, y: rnd(`ly${i}`) * 90, r: 10 + rnd(`lr${i}`) * 30, warm: rnd(`lw${i}`) > 0.45}));
const CROWD = Array.from({length: 14}, (_, i) => ({x: -80 + i * 90 + rnd(`cx${i}`) * 40, s: 0.8 + rnd(`cs${i}`) * 0.5, sway: rnd(`cw${i}`) * 6}));

export const HORIZON = 1180;

export const Plaza: React.FC<{frame: number; pan?: number; tint?: string; crowd?: number; horizon?: number}> = ({frame: f, pan = 0, tint = T.turq, crowd = 1, horizon = HORIZON}) => (
	<AbsoluteFill>
		{/* sky */}
		<AbsoluteFill style={{background: `linear-gradient(180deg, ${T.night} 0%, #03101A 45%, #0A2A36 ${(horizon / 1920) * 100}%, #020A10 ${(horizon / 1920) * 100 + 0.1}%, #01060A 100%)`}} />
		{/* skyline (slow parallax) */}
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
			<g transform={`translate(${pan * 0.25} 0)`}>
				{BUILDINGS.map((b, i) => (
					<g key={i}>
						<rect x={b.x} y={horizon - b.h} width={b.w} height={b.h} fill="#041119" />
						{b.lit.map((l, k) => (
							<rect key={k} x={b.x + 6 + l.x * (b.w - 14)} y={horizon - b.h + 10 + l.y * (b.h - 20)} width={4} height={6} fill={l.warm ? '#FFC36B' : T.cyan} opacity={0.25 + 0.2 * Math.sin(f / 9 + i + k)} />
						))}
					</g>
				))}
			</g>
			{/* lamp bokeh along the horizon */}
			<g transform={`translate(${pan * 0.45} 0)`}>
				{LAMPS.map((l, i) => (
					<circle key={i} cx={l.x} cy={horizon - 30 - l.y} r={l.r} fill={l.warm ? '#FFB85C' : T.cyan} opacity={0.12} style={{filter: 'blur(6px)'}} />
				))}
			</g>
			{/* wet ground: perspective lines + tint reflection */}
			<defs>
				<linearGradient id="gnd" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor={tint} stopOpacity={0.18} />
					<stop offset="100%" stopColor={tint} stopOpacity={0} />
				</linearGradient>
			</defs>
			<rect x={0} y={horizon} width={1080} height={1920 - horizon} fill="url(#gnd)" />
			{Array.from({length: 17}, (_, i) => {
				const x = -800 + i * 170 + pan;
				return <line key={i} x1={540 + (x - 540) * 0.08} y1={horizon} x2={x} y2={1920} stroke={T.teal} strokeOpacity={0.35} strokeWidth={1.2} />;
			})}
			{Array.from({length: 8}, (_, i) => {
				const t = ((i + (f * 0.04) % 1) / 8) ** 2.2;
				const y = horizon + t * (1920 - horizon);
				return <line key={i} x1={0} y1={y} x2={1080} y2={y} stroke={T.teal} strokeOpacity={0.12 + t * 0.2} />;
			})}
		</svg>
		{/* foreground crowd silhouettes (fast parallax, rim-lit by the screens) */}
		{crowd > 0 ? (
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: crowd}}>
				<g transform={`translate(${pan * 1.4} 0)`}>
					{CROWD.map((c, i) => {
						const x = c.x + Math.sin(f / 20 + i) * c.sway;
						const s = c.s;
						const y = 1920 + 30;
						return (
							<g key={i} transform={`translate(${x} ${y}) scale(${s})`} style={{filter: 'blur(5px)'}} opacity={0.9}>
								<path d="M -70 0 C -70 -150, -50 -210, 0 -215 C 50 -210, 70 -150, 70 0 Z" fill="#01050A" />
								<circle cx={0} cy={-265} r={44} fill="#01050A" />
								<path d="M -44 -265 A 44 44 0 0 1 30 -300" fill="none" stroke={T.turq} strokeOpacity={0.45} strokeWidth={3} />
							</g>
						);
					})}
				</g>
			</svg>
		) : null}
	</AbsoluteFill>
);

/** Mirror reflection of a screen on the wet ground. */
export const Reflection: React.FC<{x: number; y: number; w: number; o?: number; color?: string}> = ({x, y, w, o = 1, color = T.turq}) => (
	<div style={{position: 'absolute', left: x - w / 2, top: y, width: w, height: w * 0.9, background: `linear-gradient(180deg, ${color}55 0%, ${color}00 100%)`, opacity: 0.5 * o, filter: 'blur(8px)', transform: 'scaleY(1)'}} />
);
