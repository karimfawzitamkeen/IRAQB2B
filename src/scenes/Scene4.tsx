import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, backOut, expoIn, expoInOut, expoOut, qbez, ramp, scramble} from '../theme';
import {Chapter, Check, DirBlur, Label} from '../components/Primitives';

/** Scene 4 — Fees & settlement (9–12s) */
const CORE: [number, number] = [960, 500];

const FEES = [
	{label: 'Digital Service Fee', sub: 'Platform processing', color: C.cyan, y: 380, launch: 288, dur: 24},
	{label: 'Sovereign Fee', sub: 'State attestation fee', color: C.gold, y: 640, launch: 298, dur: 24},
];

const packetPos = (f: number, fee: (typeof FEES)[number]) => {
	const t = ramp(f, fee.launch, fee.launch + fee.dur, 0, 1, expoInOut);
	const start: [number, number] = [470, fee.y];
	const ctrl: [number, number] = [720, fee.y + (fee.y < 500 ? -60 : 60)];
	const [x, y] = qbez(start, ctrl, CORE, t);
	return {x, y, t};
};

export const Scene4: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 266 || f > 374) return null;
	const enter = ramp(f, 270, 296, 0, 1, expoOut);
	const close = ramp(f, 318, 326, 0, 1, backOut);
	const burst = ramp(f, 324, 346, 0, 1, (t) => t);
	const out = ramp(f, 350, 370, 0, 1, expoIn);
	const hits = FEES.map((fee) => ramp(f, fee.launch + fee.dur - 1, fee.launch + fee.dur + 16, 0, 1, (t) => t));
	const energy = hits.reduce((a, h) => a + (h > 0 && h < 1 ? 1 - h : 0), 0) + (burst > 0 && burst < 1 ? 1 - burst : 0);

	return (
		<AbsoluteFill>
			<Chapter frame={f} start={278} end={352} index="03" title="Settlement" sub="Service and sovereign fees are paid and confirmed securely." />

			<div style={{position: 'absolute', inset: 0, transformOrigin: `${CORE[0]}px ${CORE[1]}px`, transform: `scale(${(0.7 + 0.3 * enter) * (1 - out * 0.9)})`, opacity: enter * (1 - out)}}>
				{/* fee sources */}
				{FEES.map((fee, i) => {
					const a = ramp(f, 276 + i * 6, 298 + i * 6);
					return (
						<div key={i} style={{position: 'absolute', left: 150, top: fee.y - 42, width: 300, opacity: a, transform: `translateX(${(1 - a) * -40}px)`}}>
							<div style={{height: 84, borderLeft: `2px solid ${fee.color}`, background: `linear-gradient(90deg, ${fee.color}1A, rgba(255,255,255,0))`, padding: '16px 24px', boxSizing: 'border-box'}}>
								<div style={{fontFamily: F.sans, fontSize: 22, color: C.white, fontWeight: 400}}>{fee.label}</div>
								<Label size={10.5} spacing={3} color={fee.color} style={{marginTop: 8}}>
									{fee.sub}
								</Label>
							</div>
							<div style={{position: 'absolute', right: -10, top: 38, width: 8, height: 8, borderRadius: 4, background: fee.color, boxShadow: `0 0 12px ${fee.color}`}} />
						</div>
					);
				})}

				{/* packet paths */}
				<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
					{FEES.map((fee, i) => {
						const ctrl = [720, fee.y + (fee.y < 500 ? -60 : 60)];
						return <path key={i} d={`M470 ${fee.y} Q${ctrl[0]} ${ctrl[1]} ${CORE[0]} ${CORE[1]}`} fill="none" stroke={fee.color} strokeOpacity={0.25} strokeDasharray="2 10" strokeDashoffset={-f * 1.5} />;
					})}
				</svg>
				{FEES.map((fee, i) => {
					const p = packetPos(f, fee);
					if (p.t <= 0 || p.t >= 1) return null;
					const q = packetPos(f - 1, fee);
					const trail = Array.from({length: 10}, (_, k) => packetPos(f - k * 0.8, fee));
					return (
						<DirBlur key={i} id={`pk${i}`} vx={p.x - q.x} vy={p.y - q.y} k={0.2}>
							<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
								{trail.slice(1).map((t, k) => (
									<line key={k} x1={trail[k].x} y1={trail[k].y} x2={t.x} y2={t.y} stroke={fee.color} strokeWidth={5 * (1 - k / 10)} strokeOpacity={0.7 * (1 - k / 10)} strokeLinecap="round" />
								))}
								<g transform={`translate(${p.x} ${p.y}) rotate(45)`} style={{filter: `drop-shadow(0 0 10px ${fee.color})`}}>
									<rect x={-9} y={-9} width={18} height={18} fill="#fff" />
									<rect x={-14} y={-14} width={28} height={28} fill="none" stroke={fee.color} />
								</g>
							</svg>
						</DirBlur>
					);
				})}

				{/* secure core */}
				<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
					<defs>
						<radialGradient id="core-g">
							<stop offset="0%" stopColor={C.cyan} stopOpacity={0.35 + energy * 0.3} />
							<stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
						</radialGradient>
						<linearGradient id="lock-g" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#12305A" />
							<stop offset="100%" stopColor="#061429" />
						</linearGradient>
					</defs>
					<g transform={`translate(${CORE[0]} ${CORE[1]})`}>
						<circle r={260} fill="url(#core-g)" />
						<circle r={240} fill="none" stroke={C.white} strokeOpacity={0.08} />
						<circle r={228} fill="none" stroke={C.gold} strokeOpacity={0.45} strokeDasharray="1 9" transform={`rotate(${f * 0.25})`} />
						<circle r={192} fill="none" stroke={C.cyan} strokeOpacity={0.55 + energy * 0.3} strokeWidth={2} strokeDasharray="44 16" transform={`rotate(${-f * (0.5 + energy * 3)})`} />
						<circle r={158} fill="none" stroke={C.white} strokeOpacity={0.35} strokeDasharray="2 5" transform={`rotate(${f * (0.9 + energy * 4)})`} />
						{Array.from({length: 24}, (_, i) => {
							const lit = ramp(f, 300 + i * 0.8, 304 + i * 0.8);
							const a = (i / 24) * 360;
							return <rect key={i} x={-2} y={-138} width={4} height={10} fill={lit > 0.5 ? C.cyan : 'rgba(255,255,255,0.15)'} transform={`rotate(${a})`} />;
						})}
						{hits.map((h, i) =>
							h > 0 && h < 1 ? <circle key={i} r={110 + h * 180} fill="none" stroke={FEES[i].color} strokeOpacity={(1 - h) * 0.9} strokeWidth={2} /> : null,
						)}
						{burst > 0 && burst < 1 ? (
							<>
								<circle r={100 + burst * 420} fill="none" stroke={C.white} strokeOpacity={(1 - burst) * 0.8} strokeWidth={3 * (1 - burst)} />
								<circle r={120} fill={C.cyan} fillOpacity={(1 - burst) * 0.25} />
							</>
						) : null}
						{/* lock */}
						<g>
							<path
								d="M-26 -8 V-38 A26 26 0 0 1 26 -38 V-8"
								fill="none"
								stroke={close >= 1 ? C.gold : C.white}
								strokeWidth={7}
								strokeLinecap="round"
								transform={`translate(0 ${-18 * (1 - close)})`}
							/>
							<path d={Array.from({length: 6}, (_, i) => { const a = (Math.PI / 3) * i; return `${i ? 'L' : 'M'}${(62 * Math.cos(a)).toFixed(1)} ${(8 + 54 * Math.sin(a)).toFixed(1)}`; }).join('') + 'Z'} fill="url(#lock-g)" stroke={close >= 1 ? C.gold : C.cyan} strokeWidth={2} style={{filter: `drop-shadow(0 0 ${12 + energy * 20}px rgba(79,216,255,0.6))`}} />
							<circle cx={0} cy={2} r={8} fill={close >= 1 ? C.gold : C.cyan} />
							<rect x={-3} y={4} width={6} height={20} rx={3} fill={close >= 1 ? C.gold : C.cyan} />
						</g>
					</g>
				</svg>

				{/* encrypted reference */}
				<div style={{position: 'absolute', top: CORE[1] + 280, width: 1920, textAlign: 'center', opacity: ramp(f, 300, 312)}}>
					<Label size={16} spacing={4} color={close >= 1 ? C.gold : C.cyan}>
						{scramble('TX 7F3A 91C2 E04B 5D18 · SECURED', ramp(f, 302, 332, 0, 1, (t) => t), f, 'tx')}
					</Label>
				</div>

				{/* confirmations */}
				<div style={{position: 'absolute', left: 1370, top: 400}}>
					<Label size={13} spacing={5} color={C.dim} style={{marginBottom: 34, opacity: ramp(f, 296, 312)}}>
						Secure settlement
					</Label>
					{FEES.map((fee, i) => {
						const arrive = fee.launch + fee.dur;
						const a = ramp(f, arrive, arrive + 16);
						const res = ramp(f, arrive + 2, arrive + 22, 0, 1, (t) => t);
						return (
							<div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 34, opacity: a, transform: `translateX(${(1 - a) * 30}px)`}}>
								<Check p={res} frame={f} size={40} color={fee.color} pending />
								<div>
									<div style={{fontFamily: F.sans, fontSize: 24, color: C.white}}>{fee.label}</div>
									<Label size={11} spacing={3} color={res > 0.5 ? fee.color : C.faint} style={{marginTop: 6}}>
										{res > 0.5 ? 'Confirmed' : 'Processing…'}
									</Label>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};
