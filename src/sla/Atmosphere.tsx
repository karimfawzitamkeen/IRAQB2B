import React from 'react';
import {AbsoluteFill} from 'remotion';
import {kf, rnd} from '../theme';
import {S, SLA_H, SLA_W} from './theme';

const DUST = Array.from({length: 150}, (_, i) => ({
	x: rnd(`sd-x${i}`),
	y: rnd(`sd-y${i}`),
	d: 0.2 + rnd(`sd-d${i}`) * 0.8,
	gold: rnd(`sd-g${i}`) > 0.35,
	tw: rnd(`sd-t${i}`) * Math.PI * 2,
}));

const BOKEH = Array.from({length: 9}, (_, i) => ({
	x: rnd(`sb-x${i}`),
	y: rnd(`sb-y${i}`),
	r: 40 + rnd(`sb-r${i}`) * 90,
	s: 0.4 + rnd(`sb-s${i}`) * 0.6,
	emerald: i % 3 === 1,
}));

/**
 * Near-black legal atmosphere: blue-black radial lift (matched in perceived brightness to the
 * Certificate of Origin film), warm gold and emerald glows, sparse rising dust, soft bokeh.
 */
export const Atmosphere: React.FC<{frame: number}> = ({frame: f}) => {
	const emerald = kf(f, [[0, 0], [100, 0.5], [180, 1], [630, 1], [700, 0.4], [750, 0.4]]);
	const warm = kf(f, [[0, 0.5], [100, 0.8], [630, 0.8], [700, 1.2], [750, 1.2]]);
	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 95% 70% at ${50 + Math.sin(f / 130) * 5}% ${45 + Math.cos(f / 160) * 4}%, #121B27 0%, ${S.night2} 38%, #07090D 70%, ${S.night} 100%)`,
				}}
			/>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 75% 35% at 50% -6%, rgba(201,164,92,${0.08 * warm}) 0%, rgba(201,164,92,0) 70%)`}} />
			<AbsoluteFill style={{background: `radial-gradient(ellipse 60% 30% at 50% 46%, rgba(18,179,122,${0.06 * emerald}) 0%, rgba(18,179,122,0) 70%)`}} />
			<AbsoluteFill style={{background: `radial-gradient(ellipse 90% 28% at 50% 108%, rgba(201,164,92,${0.06 * warm}) 0%, rgba(201,164,92,0) 70%)`}} />
			<svg width={SLA_W} height={SLA_H} style={{position: 'absolute', inset: 0}}>
				{DUST.map((p, i) => {
					const y = ((((p.y * SLA_H - f * (0.6 + p.d * 1.4)) % SLA_H) + SLA_H) % SLA_H);
					const x = p.x * SLA_W + Math.sin(f / 70 + i) * 8 * p.d;
					const tw = 0.5 + 0.5 * Math.sin(f / 16 + p.tw);
					return <circle key={i} cx={x} cy={y} r={0.5 + p.d * 1.3} fill={p.gold ? S.goldLight : S.white} opacity={(0.08 + p.d * 0.35) * tw} />;
				})}
			</svg>
			{BOKEH.map((b, i) => {
				const y = ((((b.y * (SLA_H + 300) - f * (0.8 + b.s * 1.2)) % (SLA_H + 300)) + SLA_H + 300) % (SLA_H + 300)) - 150;
				const x = b.x * SLA_W + Math.sin(f / 55 + i) * 26;
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
							background: `radial-gradient(circle, ${b.emerald ? `rgba(18,179,122,${0.07 * emerald})` : 'rgba(201,164,92,0.08)'} 0%, rgba(0,0,0,0) 70%)`,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};
