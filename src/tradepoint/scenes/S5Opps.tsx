import React from 'react';
import {AbsoluteFill} from 'remotion';
import {expoIn, expoInOut, expoOut, lerp, ramp, rnd} from '../../theme';
import {Beat, BrandMark, Head, OPPS, OppCard, Scrim} from '../kit';
import {P, PCX} from '../theme';

/** Scene 5 — Investment & partnerships (330–405f): refined opportunity cards deal in, then routes open to wider markets. */
const ROUTES = Array.from({length: 14}, (_, i) => {
	const a = -Math.PI / 2 + ((i - 6.5) / 14) * Math.PI * 1.9 + rnd(`r5-${i}`) * 0.1;
	return {a, len: 520 + rnd(`r5l${i}`) * 260, d: rnd(`r5d${i}`) * 5};
});
const HUB = {x: PCX, y: 1020};

export const S5Opps: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 326 || f > 412) return null;
	const wide = ramp(f, 378, 392, 0, 1, expoInOut);
	const exit = ramp(f, 398, 408, 0, 1, expoIn);
	return (
		<AbsoluteFill style={{opacity: 1 - exit}}>
			{/* the deck of opportunity cards: each new card deals to the front, the older ones recede */}
			<AbsoluteFill style={{opacity: 1 - wide, transform: `scale(${1 - wide * 0.4})`, transformOrigin: `${HUB.x}px ${HUB.y}px`}}>
				{OPPS.map((o, i) => {
					const t = 332 + i * 14;
					const p = ramp(f, t, t + 12, 0, 1, expoOut);
					if (p <= 0) return null;
					const back = OPPS.slice(i + 1).reduce((acc, _, k) => acc + ramp(f, 332 + (i + 1 + k) * 14, 342 + (i + 1 + k) * 14), 0);
					return (
						<div key={i} style={{position: 'absolute', left: PCX - 430, top: 860 - back * 100, transform: `perspective(1800px) translateX(${(1 - p) * (i % 2 ? -900 : 900)}px) rotateY(${(1 - p) * (i % 2 ? 50 : -50)}deg) scale(${1 - back * 0.1})`, opacity: Math.min(1, p * 2) * (1 - back * 0.3), zIndex: i}}>
							<OppCard o={o} w={860} frame={f} />
						</div>
					);
				})}
			</AbsoluteFill>
			{/* routes open to wider markets */}
			{f >= 374 ? (
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
					{ROUTES.map((r, i) => {
						const p = ramp(f, 376 + r.d, 392 + r.d, 0, 1, expoOut);
						const x1 = HUB.x + Math.cos(r.a) * r.len * p;
						const y1 = HUB.y + Math.sin(r.a) * r.len * p * 0.9;
						const cx = (HUB.x + x1) / 2 + Math.sin(r.a) * 80;
						const cy = (HUB.y + y1) / 2 - Math.abs(Math.cos(r.a)) * 80;
						const pulse = ((f - 380 - r.d) / 14) % 1;
						return (
							<g key={i} opacity={p}>
								<path d={`M ${HUB.x} ${HUB.y} Q ${cx} ${cy} ${x1} ${y1}`} fill="none" stroke={P.gold} strokeWidth={3} strokeOpacity={0.8} />
								<circle cx={x1} cy={y1} r={9} fill={i % 3 ? P.goldLight : P.teal} style={{filter: `drop-shadow(0 0 10px ${P.gold})`}} />
								{pulse > 0 ? <circle cx={lerp(HUB.x, x1, pulse)} cy={lerp(HUB.y, y1, pulse)} r={5} fill={P.white} /> : null}
							</g>
						);
					})}
				</svg>
			) : null}
			{f >= 376 ? (
				<div style={{position: 'absolute', left: HUB.x - 110, top: HUB.y - 110, opacity: wide}}>
					<BrandMark size={220} draw={wide} frame={f} />
				</div>
			) : null}
			<Scrim top={140} h={360} />
			<Beat frame={f} a={331} b={356} top={220}>
				<Head text="فرص استثمار" frame={f} start={331} size={136} mode="slam" stagger={4} dur={8} color={P.gold} glow="gold" />
			</Beat>
			<Beat frame={f} a={356} b={380} top={220}>
				<Head text="شراكات استراتيجية" frame={f} start={356} size={112} mode="rise" stagger={4} dur={9} />
			</Beat>
			<Beat frame={f} a={380} b={412} top={220} out="zoom">
				<Head text="نحو أسواق أوسع" frame={f} start={380} size={124} mode="slam" stagger={4} dur={8} color={P.gold} glow="gold" />
			</Beat>
		</AbsoluteFill>
	);
};
