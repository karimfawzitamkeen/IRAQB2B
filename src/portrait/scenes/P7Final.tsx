import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, expoOut, ramp, scramble} from '../../theme';
import {SERIAL} from '../../components/Document';
import {Label} from '../../components/Primitives';
import {docToScreen} from '../DocJourney';
import {SAFE} from '../layout';

/**
 * Scene 7 — Final attested certificate (495–600f).
 * The hero certificate is the DocJourney layer; this scene adds callouts in the top & bottom bands.
 */
type Callout = {
	start: number;
	u: number;
	v: number;
	/** where the label block sits: x of its left edge, y of its rule line; labels sit above (top) or below (bottom) the rule */
	x: number;
	rule: number;
	side: 'above' | 'below';
	title: string;
	value: (p: number, f: number) => string;
	mono?: boolean;
	color: string;
};

// Sized for a display screen read at 4 m: titles 34 px mono, values 48 px (serial 40 px mono).
const CALLOUTS: Callout[] = [
	{start: 520, u: 73, v: 69, x: SAFE.left, rule: 360, side: 'above', title: 'Secure identity', value: () => 'Unique fingerprint', color: C.cyan},
	{start: 528, u: 452, v: 66, x: 560, rule: 360, side: 'above', title: 'Validation', value: () => 'Valid · Attested', color: C.cyan},
	{start: 536, u: 28, v: 752, x: SAFE.left, rule: 1340, side: 'below', title: 'Serial number', value: (p, f) => scramble(SERIAL, p, f, 'p7'), mono: true, color: C.gold},
	{start: 544, u: 499, v: 742, x: SAFE.left, rule: 1510, side: 'below', title: 'QR verification', value: () => 'Scan to verify', color: C.cyan},
];

export const P7Final: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 512 || f > 606) return null;
	const out = ramp(f, 588, 600);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			{CALLOUTS.map((c, i) => (
				<CalloutView key={i} c={c} f={f} />
			))}
		</AbsoluteFill>
	);
};

const CalloutView: React.FC<{c: Callout; f: number}> = ({c, f}) => {
	const line = ramp(f, c.start, c.start + 18, 0, 1, expoOut);
	const text = ramp(f, c.start + 8, c.start + 28, 0, 1, expoOut);
	if (line <= 0) return null;
	const a = docToScreen(f, c.u, c.v);
	// leader: anchor → vertical to the rule → horizontal underline to the label's left edge
	const d = `M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${a.x.toFixed(1)} ${c.rule} L${c.x} ${c.rule}`;
	const pulse = ((f - c.start) % 30) / 30;
	return (
		<>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<circle cx={a.x} cy={a.y} r={8 * line} fill={c.color} style={{filter: `drop-shadow(0 0 8px ${c.color})`}} />
				<circle cx={a.x} cy={a.y} r={12 + pulse * 26} fill="none" stroke={c.color} strokeWidth={2} strokeOpacity={(1 - pulse) * 0.8} />
				<path d={d} fill="none" stroke={c.color} strokeOpacity={0.9} strokeWidth={2.2} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - line} />
			</svg>
			<div
				style={{
					position: 'absolute',
					left: c.x,
					...(c.side === 'above' ? {top: c.rule - 118} : {top: c.rule + 14}),
					opacity: text,
					transform: `translateY(${(c.side === 'above' ? 1 : -1) * (1 - text) * 14}px)`,
					whiteSpace: 'nowrap',
				}}
			>
				<Label size={32} spacing={2} color={c.color}>
					{c.title}
				</Label>
				<div style={{fontFamily: c.mono ? F.mono : F.sans, fontWeight: c.mono ? 500 : 400, fontSize: c.mono ? 42 : 46, lineHeight: 1.1, color: C.white, marginTop: 10}}>
					{c.value(ramp(f, c.start + 6, c.start + 36, 0, 1, (t) => t), f)}
				</div>
			</div>
		</>
	);
};
