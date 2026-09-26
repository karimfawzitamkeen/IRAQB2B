import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, expoInOut, expoOut, lerp, ramp, smooth} from '../../theme';
import {arcPath, arcPoints, pointAt} from '../../components/Globe';
import {Label} from '../../components/Primitives';
import {Mission} from '../../scenes/Scene5';
import {CITIES, portraitProject} from '../geo';
import {CX, portraitGlobe} from '../layout';
import {PChapter} from '../ui';

/**
 * Scene 4 — Commercial Attaché review (255–330f).
 * Eligibility only: "Reviewed" / "Requirements satisfied". No signature, no seal.
 * (The certificate itself is the continuous DocJourney layer.)
 */
export const MISSION_REVIEW = {x: CX, y: 480, s: 0.8};

export const P4AttacheReview: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 255 || f > 340) return null;
	const v = portraitGlobe(f);
	const from = CITIES.baghdad;
	const to = CITIES.beijing;
	const pts = arcPoints(from, to, v, 90, 1.5);
	const a = ramp(f, 266, 294, 0, 1, expoInOut);
	const head = pointAt(pts, a);
	const pa = portraitProject(from, f);
	const pb = portraitProject(to, f);
	const arrive = ramp(f, 292, 316, 0, 1, (t) => t);
	const arcFade = 1 - ramp(f, 304, 320);
	const beam = ramp(f, 292, 306, 0, 1, smooth) * arcFade;

	const draw = ramp(f, 272, 306, 0, 1, (t) => t);
	const out = ramp(f, 318, 332);
	const m = MISSION_REVIEW;
	const baseY = m.y + 150 * m.s;

	const word = ramp(f, 312, 334, 0, 1, expoOut);

	// instruction packet: issued by the mission once the review succeeds (→ Scene 5 "fee due")
	const issue = ramp(f, 318, 332, 0, 1, expoInOut);

	return (
		<AbsoluteFill>
			<PChapter frame={f} start={262} end={330} index="03" title="Attaché Review" sub="Reviewed by the Commercial Attaché." />

			{/* transaction arc from the platform node to the mission node */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: arcFade}}>
				<path d={arcPath(pts, 0, a)} fill="none" stroke={C.gold} strokeOpacity={0.5} strokeWidth={1.8} />
				<path d={arcPath(pts, Math.max(0, a - 0.22), a)} fill="none" stroke="#FFF3D6" strokeWidth={3.4} strokeLinecap="round" style={{filter: `drop-shadow(0 0 8px ${C.gold})`}} />
				{a > 0 && a < 1 && head.visible ? (
					<>
						<circle cx={head.x} cy={head.y} r={18} fill={C.gold} fillOpacity={0.25} />
						<circle cx={head.x} cy={head.y} r={6} fill="#fff" style={{filter: `drop-shadow(0 0 10px ${C.gold})`}} />
					</>
				) : null}
				{pa.z > 0 ? (
					<g>
						<circle cx={pa.x} cy={pa.y} r={6} fill={C.cyan} />
						<circle cx={pa.x} cy={pa.y} r={10 + ((f * 0.6) % 22)} fill="none" stroke={C.cyan} strokeOpacity={1 - ((f * 0.6) % 22) / 22} />
					</g>
				) : null}
				{pb.z > 0 && a > 0.95 ? (
					<g>
						<circle cx={pb.x} cy={pb.y} r={6} fill={C.gold} />
						<circle cx={pb.x} cy={pb.y} r={6 + arrive * 56} fill="none" stroke={C.gold} strokeOpacity={(1 - arrive) * 0.9} strokeWidth={2} />
					</g>
				) : null}
				{beam > 0 ? (
					<path
						d={`M${pb.x} ${pb.y} C ${pb.x} ${pb.y - 220}, ${m.x + 140} ${baseY + 160}, ${m.x + 60} ${baseY + 4}`}
						fill="none"
						stroke={C.gold}
						strokeWidth={1.6}
						strokeOpacity={0.85}
						pathLength={1}
						strokeDasharray="1 1"
						strokeDashoffset={1 - beam}
						style={{filter: `drop-shadow(0 0 6px ${C.gold})`}}
					/>
				) : null}
			</svg>
			{pa.z > 0 ? (
				<Label size={32} spacing={2} color={C.cyan} style={{position: 'absolute', left: Math.max(80, pa.x - 40), top: pa.y + 24, opacity: ramp(f, 268, 282) * arcFade, textShadow: '0 0 12px #02040A, 0 0 4px #02040A'}}>
					Platform
				</Label>
			) : null}
			{pb.z > 0 ? (
				<Label size={32} spacing={2} color={C.gold} style={{position: 'absolute', right: Math.max(1080 - 1000, 1080 - pb.x - 20), top: pb.y + 24, opacity: ramp(f, 292, 304) * arcFade, textShadow: '0 0 12px #02040A, 0 0 4px #02040A'}}>
					Mission
				</Label>
			) : null}

			{/* mission representation */}
			<div style={{position: 'absolute', left: m.x - 220, top: m.y - 165, width: 440, height: 330, transform: `scale(${m.s})`, opacity: ramp(f, 270, 284) * (1 - out)}}>
				<div style={{position: 'absolute', left: -60, right: -60, top: 230, height: 160, background: 'radial-gradient(ellipse 50% 40% at 50% 40%, rgba(217,180,106,0.24) 0%, rgba(217,180,106,0) 70%)'}} />
				<Mission draw={draw} f={f} />
			</div>
			<div style={{position: 'absolute', top: 634, left: 0, right: 0, textAlign: 'center', opacity: ramp(f, 290, 304) * (1 - out)}}>
				<Label size={34} spacing={3} color={C.white}>
					Iraqi Commercial Attaché
				</Label>
			</div>

			{/* statement */}
			<div style={{position: 'absolute', top: 1330, left: 0, right: 0, textAlign: 'center', opacity: word * (1 - out), filter: word < 1 ? `blur(${(1 - word) * 10}px)` : undefined}}>
				<div style={{fontFamily: F.sans, fontWeight: 300, fontSize: 128, color: C.white, letterSpacing: lerp(30, 1, word), marginRight: -lerp(30, 1, word), textShadow: '0 4px 30px rgba(2,4,10,0.9)'}}>Reviewed</div>
				<Label size={36} spacing={3} color={C.gold} style={{marginTop: 16}}>
					Requirements satisfied
				</Label>
			</div>

			{/* instruction packet leaves the mission */}
			{issue > 0 && f < 336 ? (
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 1 - ramp(f, 330, 336)}}>
					{Array.from({length: 8}, (_, k) => {
						const t = Math.max(0, ramp(f - k * 0.8, 318, 332, 0, 1, expoInOut));
						return <circle key={k} cx={m.x} cy={lerp(m.y - 60, 470, t)} r={6 * (1 - k / 8)} fill={C.gold} opacity={(1 - k / 8) * 0.8} />;
					})}
					<g transform={`translate(${m.x} ${lerp(m.y - 60, 470, issue)}) rotate(45)`} style={{filter: `drop-shadow(0 0 12px ${C.gold})`}}>
						<rect x={-9} y={-9} width={18} height={18} fill="#fff" />
						<rect x={-15} y={-15} width={30} height={30} fill="none" stroke={C.gold} />
					</g>
				</svg>
			) : null}
		</AbsoluteFill>
	);
};
