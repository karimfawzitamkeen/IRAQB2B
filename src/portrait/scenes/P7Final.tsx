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
type Callout = {start: number; u: number; v: number; band: 'top' | 'bottom'; col: 0 | 1; title: string; value: (p: number, f: number) => string; mono?: boolean; color: string};

const CALLOUTS: Callout[] = [
	{start: 520, u: 73, v: 69, band: 'top', col: 0, title: 'Secure digital identity', value: () => 'Unique document fingerprint', color: C.cyan},
	{start: 528, u: 452, v: 66, band: 'top', col: 1, title: 'Validation status', value: () => 'Valid · Attested', color: C.cyan},
	{start: 536, u: 28, v: 752, band: 'bottom', col: 0, title: 'Unique serial number', value: (p, f) => scramble(SERIAL, p, f, 'p7'), mono: true, color: C.gold},
	{start: 544, u: 499, v: 742, band: 'bottom', col: 1, title: 'QR verification', value: () => 'Scan to verify authenticity', color: C.cyan},
];

const COL_X = [SAFE.left, 540];
const TOP_LINE = 404;
const BOTTOM_LINE = 1322;

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
	const yBand = c.band === 'top' ? TOP_LINE : BOTTOM_LINE;
	const colX = COL_X[c.col];
	// leader: anchor → vertical to the band rule → horizontal underline to the column start
	const d = `M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${a.x.toFixed(1)} ${yBand} L${colX} ${yBand}`;
	const pulse = ((f - c.start) % 30) / 30;
	return (
		<>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<circle cx={a.x} cy={a.y} r={6 * line} fill={c.color} style={{filter: `drop-shadow(0 0 6px ${c.color})`}} />
				<circle cx={a.x} cy={a.y} r={10 + pulse * 20} fill="none" stroke={c.color} strokeOpacity={(1 - pulse) * 0.8} />
				<path d={d} fill="none" stroke={c.color} strokeOpacity={0.85} strokeWidth={1.5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - line} />
			</svg>
			<div
				style={{
					position: 'absolute',
					left: colX,
					width: 360,
					...(c.band === 'top' ? {top: yBand - 112} : {top: yBand + 16}),
					opacity: text,
					transform: `translateY(${(c.band === 'top' ? 1 : -1) * (1 - text) * 14}px)`,
				}}
			>
				<Label size={20} spacing={3} color={c.color}>
					{c.title}
				</Label>
				<div style={{fontFamily: c.mono ? F.mono : F.sans, fontWeight: c.mono ? 500 : 300, fontSize: 26, color: C.white, marginTop: 12, whiteSpace: 'nowrap', letterSpacing: c.mono ? 0.5 : 0}}>
					{c.value(ramp(f, c.start + 6, c.start + 36, 0, 1, (t) => t), f)}
				</div>
			</div>
		</>
	);
};
