import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, expoInOut, expoOut, kf, lerp, ramp, scramble, smooth} from '../theme';
import {CertificateDoc, DOC_H, DOC_W, SERIAL} from '../components/Document';
import {Chapter, Label} from '../components/Primitives';
import {S5_HANDOFF, s5DocPose} from './Scene5';

/** Scene 6 — Final attested certificate (16–20s) */

export const s6DocPose = (f: number) => {
	const h = s5DocPose(S5_HANDOFF);
	const t = ramp(f, S5_HANDOFF, S5_HANDOFF + 34, 0, 1, expoInOut);
	return {
		x: lerp(h.x, 960, t),
		y: lerp(h.y, 548, t),
		s: lerp(h.s, 0.86, t) + ramp(f, 520, 610, 0, 0.04, smooth),
		ry: kf(f, [[S5_HANDOFF, h.ry], [S5_HANDOFF + 34, -16], [610, 7]], smooth),
		rx: lerp(h.rx, 6, t) - ramp(f, 520, 610, 0, 3, smooth),
	};
};

type Callout = {
	start: number;
	ax: number;
	ay: number;
	side: 'l' | 'r';
	ly: number;
	title: string;
	value: (p: number, f: number) => string;
	color: string;
};

const CALLOUTS: Callout[] = [
	{start: 508, ax: 73, ay: 69, side: 'l', ly: 150, title: 'Secure document identity', value: () => 'SHA-256 fingerprint', color: C.cyan},
	{start: 516, ax: 548, ay: 62, side: 'r', ly: 70, title: 'Digital validation', value: () => 'Cryptographically signed', color: C.cyan},
	{start: 524, ax: 60, ay: 745, side: 'l', ly: 690, title: 'Unique serial number', value: (p, f) => scramble(SERIAL, p, f, 'co'), color: C.gold},
	{start: 532, ax: 500, ay: 670, side: 'r', ly: 610, title: 'QR verification', value: () => 'Scan to verify authenticity', color: C.cyan},
];

export const Scene6: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < S5_HANDOFF || f > 616) return null;
	const pose = s6DocPose(f);
	const out = ramp(f, 598, 612);
	const labelsOut = ramp(f, 590, 604);

	return (
		<AbsoluteFill>
			<Chapter frame={f} start={496} end={596} index="05" title="Certificate issued" sub="A verifiable, tamper-evident Certificate of Origin." />

			<div
				style={{
					position: 'absolute',
					left: pose.x - DOC_W / 2,
					top: pose.y - DOC_H / 2,
					width: DOC_W,
					height: DOC_H,
					transform: `perspective(2000px) scale(${pose.s}) rotateX(${pose.rx}deg) rotateY(${pose.ry}deg)`,
					transformStyle: 'preserve-3d',
					opacity: 1 - out,
				}}
			>
				<CertificateDoc
					frame={f}
					id="s6"
					build={1}
					signature={1}
					seal={1}
					gold={1}
					qr={ramp(f, 500, 530, 0, 1, (t) => t)}
					serial={ramp(f, 506, 540, 0, 1, (t) => t)}
					validated={ramp(f, 512, 526, 0, 1, expoOut)}
					identity={ramp(f, 518, 550, 0, 1, (t) => t)}
					sheen={kf(f, [[530, -0.5], [574, 1.5]], smooth)}
					glow={0.5}
				/>

				{/* callouts live in the document's 3D space, floating in front of it */}
				<div style={{position: 'absolute', inset: 0, transform: 'translateZ(70px)', transformStyle: 'preserve-3d', opacity: 1 - labelsOut}}>
					{CALLOUTS.map((c, i) => (
						<CalloutView key={i} c={c} f={f} />
					))}
				</div>
			</div>
		</AbsoluteFill>
	);
};

const CalloutView: React.FC<{c: Callout; f: number}> = ({c, f}) => {
	const line = ramp(f, c.start, c.start + 18, 0, 1, expoOut);
	const text = ramp(f, c.start + 8, c.start + 28, 0, 1, expoOut);
	if (line <= 0) return null;
	const ex = c.side === 'l' ? -80 : DOC_W + 80;
	const elbowX = c.side === 'l' ? -30 : DOC_W + 30;
	const d = `M${c.ax} ${c.ay} L${elbowX} ${c.ly} L${ex} ${c.ly}`;
	return (
		<>
			<svg width={DOC_W} height={DOC_H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<circle cx={c.ax} cy={c.ay} r={5 * line} fill={c.color} style={{filter: `drop-shadow(0 0 6px ${c.color})`}} />
				<circle cx={c.ax} cy={c.ay} r={10 + ((f - c.start) % 30) * 0.7} fill="none" stroke={c.color} strokeOpacity={Math.max(0, 1 - ((f - c.start) % 30) / 30) * 0.8} />
				<path d={d} fill="none" stroke={c.color} strokeOpacity={0.8} strokeWidth={1.3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - line} />
			</svg>
			<div
				style={{
					position: 'absolute',
					top: c.ly - 34,
					...(c.side === 'l' ? {right: DOC_W + 100, textAlign: 'right' as const} : {left: DOC_W + 100}),
					opacity: text,
					transform: `translateX(${(c.side === 'l' ? 1 : -1) * (1 - text) * 20}px)`,
					whiteSpace: 'nowrap',
				}}
			>
				<Label size={13} spacing={4} color={c.color}>
					{c.title}
				</Label>
				<div style={{fontFamily: c.title.startsWith('Unique') ? F.mono : F.sans, fontWeight: c.title.startsWith('Unique') ? 500 : 300, fontSize: 25, color: C.white, marginTop: 10}}>
					{c.value(ramp(f, c.start + 6, c.start + 36, 0, 1, (t) => t), f)}
				</div>
			</div>
		</>
	);
};
