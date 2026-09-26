import React from 'react';
import {AbsoluteFill} from 'remotion';
import {rnd} from '../theme';
import {P} from './theme';

/** Global backdrop: navy depth, faint trade-route grid, drifting gold dust. Constant luminance (flash-safe). */
const DUST = Array.from({length: 90}, (_, i) => ({x: rnd(`tp-x${i}`), y: rnd(`tp-y${i}`), d: 0.2 + rnd(`tp-d${i}`) * 0.8, w: rnd(`tp-w${i}`) > 0.7}));
const ARCS = Array.from({length: 9}, (_, i) => ({x0: rnd(`ta-x${i}`) * 1080, x1: rnd(`ta-y${i}`) * 1080, y0: 200 + rnd(`ta-a${i}`) * 1500, bend: 200 + rnd(`ta-b${i}`) * 400}));

export const Backdrop: React.FC<{frame: number; energy?: number}> = ({frame: f, energy = 1}) => (
	<AbsoluteFill>
		<AbsoluteFill style={{background: `radial-gradient(ellipse 95% 62% at 50% 46%, #173A6E 0%, ${P.deep} 32%, ${P.navy} 62%, ${P.night} 100%)`}} />
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
			<g stroke={P.gold} strokeOpacity={0.05} strokeWidth={1.2}>
				{Array.from({length: 13}, (_, i) => (
					<line key={`v${i}`} x1={i * 90} y1={0} x2={i * 90} y2={1920} />
				))}
				{Array.from({length: 23}, (_, i) => {
					const y = ((i * 90 + f * 0.9 * energy) % 2070) - 90;
					return <line key={`h${i}`} x1={0} y1={y} x2={1080} y2={y} />;
				})}
			</g>
			{ARCS.map((a, i) => (
				<path key={i} d={`M ${a.x0} ${a.y0} Q ${(a.x0 + a.x1) / 2} ${a.y0 - a.bend} ${a.x1} ${a.y0}`} fill="none" stroke={P.gold} strokeOpacity={0.08} strokeWidth={2} strokeDasharray="4 14" strokeDashoffset={-f * 1.5} />
			))}
			{DUST.map((p, i) => {
				const y = (((p.y * 1920 - f * (0.8 + p.d * 3) * energy) % 1920) + 1920) % 1920;
				return <circle key={i} cx={p.x * 1080} cy={y} r={0.8 + p.d * 2} fill={p.w ? P.white : P.goldLight} opacity={0.1 + p.d * 0.35} />;
			})}
		</svg>
	</AbsoluteFill>
);
