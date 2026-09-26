import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, expoInOut, kf, lerp, ramp, smooth} from '../theme';
import {CertificateDoc, DocPlace} from '../components/Document';
import {DirBlur, Label, Words} from '../components/Primitives';

/** Scene 1 — World & title (0–3s) */
const docPose = (f: number) => {
	const out = ramp(f, 74, 102, 0, 1, expoInOut);
	return {
		x: lerp(1590, 360, out) + Math.sin(f / 30) * 6,
		y: lerp(560, 520, out) + Math.sin(f / 22) * 7,
		s: lerp(kf(f, [[20, 0.58], [74, 0.62]]), 0.26, out),
		ry: lerp(-20 + Math.sin(f / 40) * 3, 10, out),
		rx: 6,
		o: 1 - ramp(f, 94, 104),
	};
};

export const Scene1: React.FC<{frame: number}> = ({frame: f}) => {
	if (f > 106) return null;
	const pose = docPose(f);
	const prev = docPose(f - 1);
	const build = ramp(f, 20, 64, 0, 1, (t) => t);
	const titleOut = ramp(f, 70, 92, 0, 1, smooth);

	// anamorphic lens streak on world reveal
	const streak = ramp(f, 4, 26) * (1 - ramp(f, 26, 58, 0, 1, smooth));

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 548,
					height: 2,
					opacity: streak,
					background: 'linear-gradient(90deg, rgba(79,216,255,0) 0%, rgba(79,216,255,0.7) 35%, #fff 56%, rgba(79,216,255,0.7) 75%, rgba(79,216,255,0) 100%)',
					filter: 'blur(1px)',
					transform: `scaleX(${0.3 + streak * 0.9})`,
					boxShadow: '0 0 40px 8px rgba(79,216,255,0.25)',
				}}
			/>

			<DirBlur id="s1doc" vx={pose.x - prev.x} vy={pose.y - prev.y} k={0.3}>
				<DocPlace x={pose.x} y={pose.y} scale={pose.s} ry={pose.ry} rx={pose.rx} opacity={pose.o}>
					<CertificateDoc frame={f} id="s1" build={build} glow={0.6} />
				</DocPlace>
			</DirBlur>

			{/* scrim keeps the title legible over the globe */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					opacity: ramp(f, 24, 50) * (1 - titleOut),
					background: 'radial-gradient(ellipse 55% 45% at 22% 78%, rgba(2,4,10,0.82) 0%, rgba(2,4,10,0.5) 45%, rgba(2,4,10,0) 100%)',
				}}
			/>
			{/* Title block */}
			<div
				style={{
					position: 'absolute',
					left: 130,
					top: 690,
					opacity: 1 - titleOut,
					transform: `translateY(${-titleOut * 40}px)`,
					filter: titleOut > 0 ? `blur(${titleOut * 10}px)` : undefined,
				}}
			>
				<div style={{display: 'flex', alignItems: 'center', gap: 18, opacity: ramp(f, 28, 46)}}>
					<div style={{width: 48 * ramp(f, 28, 52), height: 1, background: C.cyan}} />
					<Label color={C.cyan} size={15} spacing={6}>
						International Trade · Digital Services
					</Label>
				</div>
				<Words
					text="Digital Certificate of Origin"
					frame={f}
					start={34}
					stagger={4}
					dur={28}
					style={{fontFamily: F.sans, fontWeight: 300, fontSize: 84, color: C.white, letterSpacing: -1.8, marginTop: 18, lineHeight: 1.02}}
				/>
				<Words
					text="Attestation"
					frame={f}
					start={48}
					dur={30}
					style={{fontFamily: F.sans, fontWeight: 600, fontSize: 84, letterSpacing: -1.8, lineHeight: 1.02}}
					wordStyle={() => ({
						background: `linear-gradient(90deg, ${C.gold} 0%, #F2DDAA 50%, ${C.gold} 100%)`,
						backgroundSize: '200% 100%',
						backgroundPosition: `${100 - ramp(f, 50, 90) * 100}% 0`,
						WebkitBackgroundClip: 'text',
						backgroundClip: 'text',
						color: 'transparent',
					})}
				/>
			</div>
		</AbsoluteFill>
	);
};
