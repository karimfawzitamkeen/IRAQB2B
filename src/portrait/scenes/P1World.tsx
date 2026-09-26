import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, expoInOut, kf, lerp, ramp, smooth} from '../../theme';
import {CertificateDoc, DocPlace} from '../../components/Document';
import {DirBlur, Label, Words} from '../../components/Primitives';
import {CX, SAFE} from '../layout';

/** Scene 1 — World & title (0–90f). Globe dome top · certificate mid · title low. */
const pose = (f: number) => {
	const out = ramp(f, 74, 104, 0, 1, expoInOut);
	return {
		x: CX + Math.sin(f / 34) * 6 * (1 - out),
		y: lerp(780 + Math.sin(f / 22) * 8, 1360, out),
		s: lerp(kf(f, [[20, 0.64], [74, 0.68]]), 0.24, out),
		ry: lerp(-10 + Math.sin(f / 40) * 3, 0, out),
		rx: lerp(8, 20, out),
		o: 1 - ramp(f, 94, 106),
	};
};

const title: React.CSSProperties = {fontFamily: F.sans, fontSize: 96, letterSpacing: -2, lineHeight: 1};

export const P1World: React.FC<{frame: number}> = ({frame: f}) => {
	if (f > 108) return null;
	const p = pose(f);
	const q = pose(f - 1);
	const build = ramp(f, 22, 64, 0, 1, (t) => t);
	const out = ramp(f, 70, 92, 0, 1, smooth);
	const streak = ramp(f, 4, 26) * (1 - ramp(f, 26, 58, 0, 1, smooth));

	return (
		<AbsoluteFill>
			{/* anamorphic streak across the rising globe */}
			<div
				style={{
					position: 'absolute',
					left: -200,
					right: -200,
					top: 560,
					height: 2,
					opacity: streak,
					background: 'linear-gradient(90deg, rgba(79,216,255,0) 0%, rgba(79,216,255,0.7) 32%, #fff 50%, rgba(79,216,255,0.7) 68%, rgba(79,216,255,0) 100%)',
					filter: 'blur(1px)',
					transform: `scaleX(${0.3 + streak * 0.9})`,
					boxShadow: '0 0 40px 8px rgba(79,216,255,0.25)',
				}}
			/>

			<DirBlur id="p1doc" vx={p.x - q.x} vy={p.y - q.y} k={0.3}>
				<DocPlace x={p.x} y={p.y} scale={p.s} ry={p.ry} rx={p.rx} opacity={p.o}>
					<CertificateDoc frame={f} id="p1" build={build} glow={0.6} />
				</DocPlace>
			</DirBlur>

			{/* scrim for title legibility */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					opacity: ramp(f, 24, 50) * (1 - out),
					background: 'radial-gradient(ellipse 95% 26% at 45% 78%, rgba(2,4,10,0.85) 0%, rgba(2,4,10,0.5) 50%, rgba(2,4,10,0) 100%)',
				}}
			/>

			<div
				style={{
					position: 'absolute',
					left: SAFE.left,
					top: 1236,
					width: SAFE.right - SAFE.left,
					opacity: 1 - out,
					transform: `translateY(${-out * 40}px)`,
					filter: out > 0 ? `blur(${out * 10}px)` : undefined,
				}}
			>
				<div style={{display: 'flex', alignItems: 'center', gap: 16, opacity: ramp(f, 28, 46)}}>
					<div style={{width: 56 * ramp(f, 28, 52), height: 2, background: C.cyan}} />
					<Label color={C.cyan} size={32} spacing={3}>
						Digital Trade Services
					</Label>
				</div>
				<div style={{marginTop: 14}}>
					<Words text="Digital Certificate" frame={f} start={32} stagger={4} dur={28} style={{...title, fontWeight: 300, color: C.white}} />
					<Words text="of Origin" frame={f} start={40} stagger={4} dur={28} style={{...title, fontWeight: 300, color: C.white}} />
					<Words
						text="Attestation"
						frame={f}
						start={48}
						dur={30}
						style={{...title, fontWeight: 600}}
						wordStyle={() => {
							// solid gold + a glow swell (no background-clip: text — it glitches in parallel renders)
							const sheen = Math.sin(Math.PI * ramp(f, 56, 92, 0, 1, (t) => t));
							return {color: C.gold, textShadow: `0 0 ${10 + 26 * sheen}px rgba(242,221,170,${0.25 + 0.45 * sheen})`};
						}}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};
