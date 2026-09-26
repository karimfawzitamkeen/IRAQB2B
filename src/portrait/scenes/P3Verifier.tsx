import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, expoIn, expoInOut, expoOut, lerp, ramp, smooth} from '../../theme';
import {CertificateDoc, DocPlace} from '../../components/Document';
import {Check, Label} from '../../components/Primitives';
import {CITIES, portraitProject} from '../geo';
import {CX, SAFE} from '../layout';
import {PChapter} from '../ui';

/** Scene 3 — Verifier review (180–255f). Neutral, human review language only. */
const ROWS = ['Certificate reviewed', 'Invoice attached', 'Required information checked', 'Documents complete'];
const RING: [number, number] = [CX, 700];

export const P3Verifier: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 176 || f > 272) return null;
	const enter = ramp(f, 178, 204, 0, 1, expoOut);
	const sweep = ramp(f, 194, 228, 0, 1, smooth);
	const merge = ramp(f, 232, 250, 0, 1, smooth);
	const rowsOut = ramp(f, 232, 242);
	const ring = ramp(f, 236, 254, 0, 1, expoOut);
	const tick = ramp(f, 244, 258, 0, 1, expoOut);
	const word = ramp(f, 242, 262, 0, 1, expoOut);
	const collapse = ramp(f, 252, 262, 0, 1, expoIn);
	const docsOut = ramp(f, 250, 262);

	const docs = [
		{variant: 'coo' as const, x: lerp(362, CX - 14, merge), ry: lerp(12, 0, merge), rz: lerp(0, -3, merge)},
		{variant: 'invoice' as const, x: lerp(718, CX + 14, merge), ry: lerp(-12, 0, merge), rz: lerp(0, 3, merge)},
	];

	// the verified mark contracts into the transaction packet, which flies to the platform node on the globe
	const node = portraitProject(CITIES.baghdad, f);
	const fly = ramp(f, 258, 270, 0, 1, expoInOut);
	const px = lerp(RING[0], node.x, fly);
	const py = lerp(RING[1], node.y, fly);

	return (
		<AbsoluteFill>
			<PChapter frame={f} start={184} end={246} index="02" title="Verifier Review" sub="The verifier reviews the documents." />

			{docs.map((d, i) => (
				<DocPlace
					key={i}
					x={d.x}
					y={lerp(660, 690, merge)}
					scale={lerp(1.3, 0.56, enter) * lerp(1, 0.9, merge)}
					ry={d.ry}
					rz={d.rz}
					rx={4}
					opacity={enter * lerp(1, 0.2, merge) * (1 - docsOut)}
					blur={(1 - enter) * 14 + merge * 3}
				>
					<CertificateDoc frame={f} id={`p3-${i}`} variant={d.variant} build={1} scan={f < 232 ? sweep : -1} glow={0.35 + sweep * 0.3} />
				</DocPlace>
			))}

			{/* review rows */}
			<div style={{position: 'absolute', left: SAFE.left, top: 1000, width: SAFE.right - SAFE.left, opacity: 1 - rowsOut}}>
				{ROWS.map((t, i) => {
					const appear = ramp(f, 198 + i * 5, 212 + i * 5);
					const res = ramp(f, 204 + i * 7, 218 + i * 7, 0, 1, (x) => x);
					return (
						<div key={i} style={{display: 'flex', alignItems: 'center', gap: 28, height: 116, opacity: appear, transform: `translateY(${(1 - appear) * 24}px)`}}>
							<Check p={res} frame={f} size={66} stroke={2.2} pending />
							<div style={{fontFamily: F.sans, fontSize: 50, fontWeight: 400, color: res > 0.5 ? C.white : 'rgba(244,247,251,0.5)'}}>{t}</div>
						</div>
					);
				})}
			</div>

			{/* Verified */}
			{ring > 0 ? (
				<>
					<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
						<g transform={`translate(${RING[0]} ${RING[1]}) scale(${1 - collapse})`} opacity={1 - collapse * 0.3}>
							<circle r={170 + (1 - ring) * 60} fill="none" stroke={C.cyan} strokeOpacity={(1 - ring) * 0.6} />
							<circle r={130} fill="rgba(6,18,38,0.78)" stroke={C.cyan} strokeWidth={1.8} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ring} transform="rotate(-90)" style={{filter: `drop-shadow(0 0 18px rgba(79,216,255,0.55))`}} />
							<circle r={146} fill="none" stroke={C.cyan} strokeOpacity={0.3} strokeDasharray="2 6" transform={`rotate(${f * 0.6})`} />
							<circle r={112} fill="none" stroke={C.white} strokeOpacity={0.25} strokeDasharray="40 20" transform={`rotate(${-f * 1.2})`} />
							<path d="M-46 2 L-14 34 L50 -32" fill="none" stroke={C.white} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - tick} style={{filter: `drop-shadow(0 0 10px ${C.cyan})`}} />
						</g>
						{collapse > 0 ? (
							<g style={{filter: `drop-shadow(0 0 14px ${C.cyan})`}}>
								<circle cx={px} cy={py} r={7 + (1 - fly) * 6} fill="#fff" opacity={1 - ramp(f, 268, 272)} />
							</g>
						) : null}
					</svg>
					<div style={{position: 'absolute', top: 940, left: 0, right: 0, textAlign: 'center', opacity: word * (1 - ramp(f, 250, 260)), filter: word < 1 ? `blur(${(1 - word) * 10}px)` : undefined}}>
						<div style={{fontFamily: F.sans, fontWeight: 300, fontSize: 132, color: C.white, letterSpacing: lerp(36, 2, word), marginRight: -lerp(36, 2, word)}}>Verified</div>
						<Label size={36} spacing={3} color={C.cyan} style={{marginTop: 18}}>
							Review complete
						</Label>
					</div>
				</>
			) : null}
		</AbsoluteFill>
	);
};
