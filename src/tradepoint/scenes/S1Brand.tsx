import React from 'react';
import {AbsoluteFill} from 'remotion';
import {backOut, expoIn, expoOut, lerp, ramp, rnd} from '../../theme';
import {BrandMark, Head, Wordmark} from '../kit';
import {P, PCX, PF, goldGlow} from '../theme';

/** Scene 1 — Brand impact (0–90f): gold point → route structure → TRADEPOINT. */
const SPARKS = Array.from({length: 26}, (_, i) => ({a: (i / 26) * Math.PI * 2 + rnd(`s1a${i}`) * 0.2, r: 380 + rnd(`s1r${i}`) * 420, d: rnd(`s1d${i}`) * 4}));
const MY = 560;

export const S1Brand: React.FC<{frame: number}> = ({frame: f}) => {
	if (f > 100) return null;
	const point = ramp(f, 2, 12, 0, 1, backOut);
	const draw = ramp(f, 10, 40, 0, 1, expoOut);
	const pull = ramp(f, 0, 44, 0, 1, expoOut);
	const exit = ramp(f, 84, 98, 0, 1, expoIn);
	const cam = lerp(1.35, 1, pull) * (1 + exit * 2.2);
	const line = ramp(f, 40, 58, 0, 1, expoOut);
	const en = ramp(f, 44, 58, 0, 1, expoOut);
	return (
		<AbsoluteFill style={{transform: `scale(${cam})`, transformOrigin: `${PCX}px ${MY}px`, opacity: 1 - ramp(f, 88, 98), filter: exit > 0 ? `blur(${exit * 10}px)` : undefined}}>
			{/* the gold point ignites, sparks shoot out along the routes */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<circle cx={PCX} cy={MY} r={300} fill={P.gold} opacity={0.1 * draw} style={{filter: 'blur(60px)'}} />
				{SPARKS.map((s, i) => {
					const p = ramp(f, 8 + s.d, 30 + s.d, 0, 1, expoOut);
					if (p <= 0 || p >= 1) return null;
					const r1 = s.r * p;
					const r0 = Math.max(0, r1 - 140);
					return <line key={i} x1={PCX + Math.cos(s.a) * r0} y1={MY + Math.sin(s.a) * r0} x2={PCX + Math.cos(s.a) * r1} y2={MY + Math.sin(s.a) * r1} stroke={i % 3 ? P.gold : P.white} strokeWidth={3} strokeLinecap="round" opacity={1 - p} />;
				})}
				{f < 16 ? <circle cx={PCX} cy={MY} r={18 * point} fill={P.goldLight} style={{filter: `drop-shadow(0 0 24px ${P.gold})`}} /> : null}
			</svg>
			<div style={{position: 'absolute', left: PCX - 230, top: MY - 230}}>
				<BrandMark size={460} draw={draw} frame={f} glow={1.2} />
			</div>
			{/* wordmark */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 850}}>
				<Wordmark frame={f} start={26} size={112} sweep={ramp(f, 52, 80, -0.3, 1.3)} />
			</div>
			<div style={{position: 'absolute', left: PCX - 360 * line, width: 720 * line, top: 990, height: 4, borderRadius: 2, background: `linear-gradient(90deg, rgba(212,166,41,0), ${P.gold}, rgba(212,166,41,0))`}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 1016, textAlign: 'center', fontFamily: PF.en, fontWeight: 700, fontSize: 40, letterSpacing: 10, color: P.gold, opacity: en, transform: `translateY(${(1 - en) * 20}px)`, textShadow: goldGlow(0.6)}}>
				IRAQ TRADE ECOSYSTEM
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1110}}>
				<Head text="نقطة تجارة" frame={f} start={52} size={120} mode="slam" stagger={4} dur={10} glow="gold" />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1290}}>
				<Head text="بوابة التاجر نحو العالم" frame={f} start={62} size={66} mode="rise" stagger={3} dur={10} color={P.white} weight={600} />
			</div>
		</AbsoluteFill>
	);
};
