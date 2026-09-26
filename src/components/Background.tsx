import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, kf, rnd} from '../theme';

const STARS = Array.from({length: 220}, (_, i) => ({
	x: rnd(`sx${i}`),
	y: rnd(`sy${i}`),
	d: 0.15 + rnd(`sd${i}`) * 0.85,
	tw: rnd(`st${i}`) * Math.PI * 2,
	gold: rnd(`sg${i}`) > 0.86,
}));

const BOKEH = Array.from({length: 11}, (_, i) => ({
	x: rnd(`bx${i}`),
	y: rnd(`by${i}`),
	r: 30 + rnd(`br${i}`) * 90,
	s: 0.3 + rnd(`bs${i}`) * 0.7,
	gold: i % 3 === 0,
}));

/** Global camera drift used for parallax on the far layers. */
export const camDrift = (f: number) => ({
	x: -f * 0.9 + Math.sin(f / 70) * 18,
	y: Math.sin(f / 90) * 10,
});

export const Background: React.FC<{frame: number; w?: number; h?: number; vertical?: boolean}> = ({
	frame,
	w = 1920,
	h = 1080,
	vertical = false,
}) => {
	// landscape: lateral camera drift · portrait: particles rise (vertical storytelling)
	const cam = vertical ? {x: Math.sin(frame / 80) * 14, y: -frame * 1.1} : camDrift(frame);
	const warm = kf(frame, [[0, 0], [420, 0], [520, 1], [750, 1]]);
	return (
		<AbsoluteFill>
			{/* base: black → deep navy radial, slowly breathing */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 80% 70% at ${50 + Math.sin(frame / 120) * 6}% ${46 + Math.cos(frame / 150) * 4}%, #0A1B36 0%, ${C.navy} 34%, #030813 68%, ${C.black} 100%)`,
				}}
			/>
			{/* volumetric light cone from above */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse ${vertical ? '70% 40%' : '35% 60%'} at 50% -10%, rgba(79,216,255,${0.07 - warm * 0.03}) 0%, rgba(79,216,255,0) 70%)`,
				}}
			/>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse ${vertical ? '90% 30%' : '45% 40%'} at ${vertical ? 50 : 70}% 110%, rgba(217,180,106,${0.02 + warm * 0.05}) 0%, rgba(217,180,106,0) 70%)`,
				}}
			/>
			{/* star field / particles in depth */}
			<svg width={w} height={h} style={{position: 'absolute', inset: 0}}>
				{STARS.map((s, i) => {
					const x = (((s.x * w + cam.x * s.d * 0.6) % w) + w) % w;
					const y = (((s.y * h + cam.y * s.d - frame * 0.08 * s.d) % h) + h) % h;
					const tw = 0.55 + 0.45 * Math.sin(frame / 14 + s.tw);
					return (
						<circle
							key={i}
							cx={x}
							cy={y}
							r={0.5 + s.d * 1.1}
							fill={s.gold ? C.gold : '#CFEFFF'}
							opacity={(0.12 + s.d * 0.45) * tw}
						/>
					);
				})}
			</svg>
			{/* out-of-focus foreground bokeh */}
			{BOKEH.map((b, i) => {
				const x = vertical
					? b.x * w + Math.sin(frame / 60 + i) * 30
					: (((b.x * w + cam.x * (1.2 + b.s)) % 2200) + 2200) % 2200 - 140;
				const y = vertical
					? ((((b.y * (h + 280) + cam.y * (0.8 + b.s)) % (h + 280)) + h + 280) % (h + 280)) - 140
					: b.y * h + Math.sin(frame / 50 + i) * 20;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x - b.r,
							top: y - b.r,
							width: b.r * 2,
							height: b.r * 2,
							borderRadius: '50%',
							background: `radial-gradient(circle, ${b.gold ? 'rgba(217,180,106,0.10)' : 'rgba(79,216,255,0.08)'} 0%, rgba(0,0,0,0) 70%)`,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>',
)}")`;

/** Lens finishing: vignette + animated film grain + subtle letterbox falloff. */
export const Finish: React.FC<{frame: number; vertical?: boolean}> = ({frame, vertical}) => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>
		<AbsoluteFill
			style={{
				background:
					vertical
						? 'radial-gradient(ellipse 85% 70% at 50% 48%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.5) 86%, rgba(0,0,0,0.82) 100%)'
						: 'radial-gradient(ellipse 75% 75% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.85) 100%)',
			}}
		/>
		<AbsoluteFill
			style={{
				backgroundImage: GRAIN,
				backgroundPosition: `${Math.floor(rnd(`gx${frame}`) * 220)}px ${Math.floor(rnd(`gy${frame}`) * 220)}px`,
				opacity: 0.05,
				mixBlendMode: 'overlay',
			}}
		/>
	</AbsoluteFill>
);
