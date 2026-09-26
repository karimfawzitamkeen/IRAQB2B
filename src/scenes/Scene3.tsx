import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, expoIn, expoOut, lerp, ramp, smooth} from '../theme';
import {CertificateDoc, DocPlace} from '../components/Document';
import {Chapter, Check, Label} from '../components/Primitives';

/** Scene 3 — Verification (6–9s) */
const CHECKS = [
	['Origin criteria', 'Rules of origin · matched'],
	['HS classification', '8471.30 · confirmed'],
	['Exporter registry', 'Licensed entity · active'],
	['Invoice consistency', 'Values · reconciled'],
];

export const Scene3: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 176 || f > 290) return null;
	const enter = ramp(f, 178, 204, 0, 1, expoOut);
	const scan = ramp(f, 194, 238, 0, 1, smooth);
	const merge = ramp(f, 238, 258, 0, 1, smooth);
	const out = ramp(f, 266, 286, 0, 1, expoIn);
	const listOut = ramp(f, 238, 252);

	const docs = [
		{variant: 'coo' as const, x: lerp(560, 900, merge), ry: lerp(16, 0, merge), rz: lerp(0, -4, merge)},
		{variant: 'invoice' as const, x: lerp(990, 1020, merge), ry: lerp(8, 0, merge), rz: lerp(0, 4, merge)},
	];

	// verified seal
	const ring = ramp(f, 242, 266, 0, 1, expoOut);
	const tick = ramp(f, 252, 268, 0, 1, expoOut);
	const word = ramp(f, 250, 276, 0, 1, expoOut);
	const burst = ramp(f, 262, 290, 0, 1, expoOut);

	return (
		<AbsoluteFill style={{opacity: 1 - out * 0.0}}>
			<Chapter frame={f} start={184} end={250} index="02" title="Verification" sub="Documents are validated against trade rules and registries." />

			{docs.map((d, i) => (
				<DocPlace
					key={i}
					x={d.x}
					y={lerp(560, 540, merge) - out * 20}
					scale={lerp(1.35, 0.64, enter) * lerp(1, 0.86, merge) * (1 - out * 0.4)}
					ry={d.ry}
					rz={d.rz}
					rx={4}
					opacity={enter * lerp(1, 0.22, merge) * (1 - out)}
					blur={(1 - enter) * 14 + merge * 3}
				>
					<CertificateDoc frame={f} id={`s3-${i}`} variant={d.variant} build={1} scan={f < 240 ? scan : -1} glow={0.4 + scan * 0.4} />
				</DocPlace>
			))}

			{/* validation stack */}
			<div style={{position: 'absolute', left: 1360, top: 356, opacity: (1 - listOut) * ramp(f, 196, 212)}}>
				<Label size={13} spacing={5} color={C.cyan} style={{marginBottom: 30}}>
					Validation · 4 checks
				</Label>
				{CHECKS.map(([t, s], i) => {
					const appear = ramp(f, 198 + i * 5, 214 + i * 5);
					const res = ramp(f, 208 + i * 8, 222 + i * 8, 0, 1, (x) => x);
					return (
						<div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, marginBottom: 30, opacity: appear, transform: `translateX(${(1 - appear) * 30}px)`}}>
							<Check p={res} frame={f} size={40} pending />
							<div>
								<div style={{fontFamily: F.sans, fontSize: 25, fontWeight: 400, color: res > 0.5 ? C.white : C.dim}}>{t}</div>
								<Label size={11} spacing={3} color={res > 0.5 ? C.cyan : C.faint} style={{marginTop: 6}}>
									{res > 0.5 ? s : 'Checking…'}
								</Label>
							</div>
						</div>
					);
				})}
			</div>

			{/* Verified */}
			{ring > 0 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, opacity: 1 - out, transform: `scale(${1 - out * 0.45})`, transformOrigin: '960px 470px'}}>
					<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
						<circle cx={960} cy={470} r={170 + (1 - ring) * 60} fill="none" stroke={C.cyan} strokeOpacity={(1 - ring) * 0.6} />
						{burst > 0 && burst < 1 ? (
							<g opacity={1 - burst}>
								<circle cx={960} cy={470} r={112 + burst * 260} fill="none" stroke={C.gold} strokeWidth={2 * (1 - burst) + 0.5} />
								{Array.from({length: 36}, (_, i) => {
									const a = (i / 36) * Math.PI * 2;
									const r0 = 130 + burst * 120;
									const r1 = r0 + 14 + (i % 3) * 10;
									return <line key={i} x1={960 + Math.cos(a) * r0} y1={470 + Math.sin(a) * r0} x2={960 + Math.cos(a) * r1} y2={470 + Math.sin(a) * r1} stroke={i % 2 ? C.gold : C.cyan} strokeWidth={1.2} />;
								})}
							</g>
						) : null}
						<circle cx={960} cy={470} r={112} fill="rgba(6,18,38,0.75)" stroke={C.gold} strokeWidth={1.6} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ring} transform="rotate(-90 960 470)" style={{filter: `drop-shadow(0 0 18px rgba(217,180,106,0.5))`}} />
						<circle cx={960} cy={470} r={126} fill="none" stroke={C.gold} strokeOpacity={0.35} strokeDasharray="2 6" transform={`rotate(${f * 0.6} 960 470)`} />
						<circle cx={960} cy={470} r={96} fill="none" stroke={C.cyan} strokeOpacity={0.35} strokeDasharray="40 20" transform={`rotate(${-f * 1.2} 960 470)`} />
						<path d="M918 472 L948 502 L1006 440" fill="none" stroke={C.white} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - tick} style={{filter: `drop-shadow(0 0 10px ${C.cyan})`}} />
					</svg>
					<div style={{position: 'absolute', top: 640, width: 1920, textAlign: 'center', opacity: word, filter: word < 1 ? `blur(${(1 - word) * 10}px)` : undefined}}>
						<div style={{fontFamily: F.sans, fontWeight: 300, fontSize: 76, color: C.white, letterSpacing: lerp(40, 3, word), marginRight: -lerp(40, 3, word)}}>Verified</div>
						<Label size={13} spacing={5} color={C.dim} style={{marginTop: 14}}>
							4 / 4 checks passed · documents validated
						</Label>
					</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};
