import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, expoInOut, expoOut, lerp, ramp, smooth} from '../theme';
import {CertificateDoc, DocPlace} from '../components/Document';
import {CITIES, arcPath, arcPoints, globeView, pointAt, project} from '../components/Globe';
import {Chapter, Label, Words} from '../components/Primitives';

/** Scene 5 — Commercial Attaché & digital signature (12–16s) */

export const S5_HANDOFF = 488;
export const s5DocPose = (f: number) => {
	const e = ramp(f, 430, 458, 0, 1, expoOut);
	return {
		x: lerp(1760, 1300, e),
		y: 548 + Math.sin(f / 26) * 4,
		s: 0.74,
		ry: lerp(-34, -12, e),
		rx: 4,
		o: e,
		blur: (1 - e) * 12,
	};
};

const embassyPose = (f: number) => {
	const mv = ramp(f, 426, 452, 0, 1, expoInOut);
	return {x: lerp(1400, 470, mv), y: lerp(430, 380, mv), s: lerp(1, 0.72, mv)};
};

export const Scene5: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 356 || f > 500) return null;
	const v = globeView(f);
	const a = ramp(f, 374, 414, 0, 1, expoInOut);
	const from = CITIES.baghdad;
	const to = CITIES.beijing;
	const pts = arcPoints(from, to, v, 90, 1.5);
	const head = pointAt(pts, a);
	const pa = project(from[0], from[1], v);
	const pb = project(to[0], to[1], v);
	const arrive = ramp(f, 412, 440, 0, 1, (t) => t);
	const arcFade = 1 - ramp(f, 430, 452);

	const emb = embassyPose(f);
	const draw = ramp(f, 384, 426, 0, 1, (t) => t);
	const beam = ramp(f, 412, 426, 0, 1, smooth) * arcFade;
	const baseX = emb.x;
	const baseY = emb.y + 150 * emb.s;

	const doc = s5DocPose(f);
	const sig = ramp(f, 446, 472, 0, 1, (t) => smooth(t));
	const seal = ramp(f, 468, 480, 0, 1, expoOut);
	const out = ramp(f, 476, 492);

	return (
		<AbsoluteFill>
			<Chapter frame={f} start={372} end={482} index="04" title="Attestation" sub="Routed to the Iraqi Commercial Attaché for digital signature." />

			{/* transaction arc */}
			<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: arcFade}}>
				<path d={arcPath(pts, 0, a)} fill="none" stroke={C.gold} strokeOpacity={0.45} strokeWidth={1.5} />
				<path d={arcPath(pts, Math.max(0, a - 0.22), a)} fill="none" stroke="#FFF3D6" strokeWidth={3} strokeLinecap="round" style={{filter: `drop-shadow(0 0 8px ${C.gold})`}} />
				{a > 0 && a < 1 && head.visible ? (
					<>
						<circle cx={head.x} cy={head.y} r={16} fill={C.gold} fillOpacity={0.25} />
						<circle cx={head.x} cy={head.y} r={5} fill="#fff" style={{filter: `drop-shadow(0 0 10px ${C.gold})`}} />
					</>
				) : null}
				{pa.z > 0 ? (
					<g>
						<circle cx={pa.x} cy={pa.y} r={5} fill={C.cyan} />
						<circle cx={pa.x} cy={pa.y} r={10 + ((f * 0.6) % 20)} fill="none" stroke={C.cyan} strokeOpacity={1 - ((f * 0.6) % 20) / 20} />
					</g>
				) : null}
				{pb.z > 0 && a > 0.95 ? (
					<g>
						<circle cx={pb.x} cy={pb.y} r={5} fill={C.gold} />
						<circle cx={pb.x} cy={pb.y} r={6 + arrive * 50} fill="none" stroke={C.gold} strokeOpacity={(1 - arrive) * 0.9} strokeWidth={2} />
					</g>
				) : null}
				{/* beam up to the mission */}
				{beam > 0 && pb.z > 0 ? (
					<path
						d={`M${pb.x} ${pb.y} C ${pb.x + 160} ${pb.y}, ${baseX - 200} ${baseY}, ${baseX - 150 * emb.s} ${baseY}`}
						fill="none"
						stroke={C.gold}
						strokeWidth={1.4}
						strokeOpacity={0.8}
						pathLength={1}
						strokeDasharray="1 1"
						strokeDashoffset={1 - beam}
					/>
				) : null}
			</svg>
			{pa.z > 0 ? (
				<Label size={11} spacing={3} color={C.cyan} style={{position: 'absolute', left: pa.x - 250, top: pa.y + 16, textShadow: '0 0 10px #02040A, 0 0 4px #02040A', opacity: ramp(f, 378, 392) * arcFade}}>
					Attestation platform
				</Label>
			) : null}
			{pb.z > 0 ? (
				<Label size={11} spacing={3} color={C.gold} style={{position: 'absolute', left: pb.x - 30, top: pb.y + 22, textShadow: '0 0 10px #02040A, 0 0 4px #02040A', opacity: ramp(f, 412, 424) * arcFade}}>
					Mission
				</Label>
			) : null}

			{/* mission / embassy representation */}
			<div
				style={{
					position: 'absolute',
					left: emb.x - 220,
					top: emb.y - 165,
					width: 440,
					height: 330,
					transform: `scale(${emb.s})`,
					opacity: ramp(f, 382, 396) * (1 - out),
				}}
			>
				<div style={{position: 'absolute', left: -60, right: -60, top: 230, height: 160, background: 'radial-gradient(ellipse 50% 40% at 50% 40%, rgba(217,180,106,0.22) 0%, rgba(217,180,106,0) 70%)'}} />
				<Mission draw={draw} f={f} />
				<div style={{position: 'absolute', top: 350, width: 440, textAlign: 'center', opacity: ramp(f, 408, 424)}}>
					<Label size={17} spacing={6} color={C.white}>
						Iraqi Commercial Attaché
					</Label>
					<Label size={11} spacing={3.5} style={{marginTop: 10}}>
						Diplomatic mission · trade attestation
					</Label>
				</div>
			</div>

			{/* document being signed */}
			{f < S5_HANDOFF ? (
				<DocPlace x={doc.x} y={doc.y} scale={doc.s} ry={doc.ry} rx={doc.rx} opacity={doc.o} blur={doc.blur}>
					<CertificateDoc frame={f} id="s5" build={1} signature={sig} seal={seal} glow={0.3} gold={seal} />
				</DocPlace>
			) : null}

			{/* statement */}
			<div style={{position: 'absolute', left: 150, top: 690, opacity: 1 - out, transform: `translateY(${-out * 20}px)`}}>
				<Words text="Digitally Attested" frame={f} start={462} stagger={5} dur={26} style={{fontFamily: F.sans, fontWeight: 300, fontSize: 70, color: C.white, letterSpacing: -1, textShadow: '0 4px 30px rgba(2,4,10,0.9)'}} />
				<div style={{width: 380 * ramp(f, 468, 494, 0, 1, expoOut), height: 1, marginTop: 10, background: `linear-gradient(90deg, ${C.gold}, rgba(217,180,106,0))`}} />
				<Label size={12} spacing={4} color={C.gold} style={{marginTop: 16, opacity: ramp(f, 474, 488)}}>
					Signed · Sealed · Time-stamped
				</Label>
			</div>
		</AbsoluteFill>
	);
};

const Mission: React.FC<{draw: number; f: number}> = ({draw, f}) => {
	const seg = (i: number, n: number) => ramp(draw, (i / n) * 0.7, (i / n) * 0.7 + 0.3, 0, 1, smooth);
	const cols = [92, 144, 196, 244, 296, 348];
	const N = 12;
	const S = {fill: 'none', strokeWidth: 1.4, pathLength: 1, strokeDasharray: '1 1'} as const;
	return (
		<svg width={440} height={330} viewBox="0 0 440 330" style={{overflow: 'visible', filter: 'drop-shadow(0 0 8px rgba(217,180,106,0.35))'}}>
			<path d="M10 312 H430" stroke={C.gold} {...S} strokeDashoffset={1 - seg(0, N)} />
			<path d="M28 296 H412" stroke={C.gold} {...S} strokeDashoffset={1 - seg(1, N)} />
			<path d="M46 280 H394" stroke={C.white} strokeOpacity={0.7} {...S} strokeDashoffset={1 - seg(2, N)} />
			{cols.map((x, i) => (
				<g key={i}>
					<path d={`M${x} 280 V132 H${x + 22} V280`} stroke={C.white} strokeOpacity={0.75} {...S} strokeDashoffset={1 - seg(3 + i * 0.5, N)} />
					<path d={`M${x - 4} 132 H${x + 26}`} stroke={C.white} strokeOpacity={0.6} {...S} strokeDashoffset={1 - seg(3 + i * 0.5, N)} />
					<path d={`M${x + 11} 140 V272`} stroke={C.white} strokeOpacity={0.18} {...S} strokeDashoffset={1 - seg(4 + i * 0.5, N)} />
				</g>
			))}
			<path d="M52 128 H388 V108 H52 Z" stroke={C.gold} {...S} strokeDashoffset={1 - seg(8, N)} />
			<path d="M40 104 L220 34 L400 104 Z" stroke={C.gold} strokeWidth={1.6} fill="rgba(217,180,106,0.04)" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - seg(9, N)} />
			<circle cx={220} cy={78} r={15} stroke={C.gold} {...S} strokeDashoffset={1 - seg(10, N)} />
			<g transform={`translate(220 78) rotate(${f * 0.8})`} opacity={seg(11, N)}>
				<rect x={-6} y={-6} width={12} height={12} fill="none" stroke={C.gold} />
				<rect x={-6} y={-6} width={12} height={12} fill="none" stroke={C.gold} transform="rotate(45)" />
			</g>
			{/* windows of light between the columns */}
			{cols.slice(0, -1).map((x, i) => (
				<rect key={i} x={x + 26} y={160} width={22} height={120} fill={C.gold} opacity={0.05 + 0.04 * Math.sin(f / 10 + i) * seg(11, N)} />
			))}
		</svg>
	);
};
