import React from 'react';
import {AbsoluteFill} from 'remotion';
import {backOut, expoIn, expoOut, ramp} from '../../theme';
import {BrandMark, Head, Wordmark} from '../kit';
import {P, PCX, PF, goldGlow} from '../theme';

/** Scene 8 — TradePoint closing hit (615–675f): the network collapses into the brand. */
const MY = 600;

export const S8Close: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 612 || f > 686) return null;
	const hit = ramp(f, 618, 632, 0, 1, backOut);
	const ring = ramp(f, 620, 642, 0, 1, expoOut);
	const line = ramp(f, 634, 648, 0, 1, expoOut);
	const en = ramp(f, 636, 648, 0, 1, expoOut);
	const exit = ramp(f, 664, 675, 0, 1, expoIn);
	return (
		<AbsoluteFill style={{opacity: 1 - exit, transform: `scale(${1 - exit * 0.12})`, transformOrigin: `${PCX}px 900px`}}>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<circle cx={PCX} cy={MY} r={280} fill={P.gold} opacity={0.12 * hit} style={{filter: 'blur(60px)'}} />
				{ring > 0 && ring < 1 ? <circle cx={PCX} cy={MY} r={120 + ring * 520} fill="none" stroke={P.goldLight} strokeWidth={8 * (1 - ring) + 1} strokeOpacity={1 - ring} /> : null}
			</svg>
			<div style={{position: 'absolute', left: PCX - 190, top: MY - 190, transform: `scale(${hit})`}}>
				<BrandMark size={380} draw={1} frame={f} glow={1.3} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 860}}>
				<Wordmark frame={f} start={626} size={112} sweep={ramp(f, 646, 668, -0.3, 1.3)} />
			</div>
			<div style={{position: 'absolute', left: PCX - 360 * line, width: 720 * line, top: 1000, height: 4, borderRadius: 2, background: `linear-gradient(90deg, rgba(212,166,41,0), ${P.gold}, rgba(212,166,41,0))`}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 1026, textAlign: 'center', fontFamily: PF.en, fontWeight: 700, fontSize: 40, letterSpacing: 10, color: P.gold, opacity: en, textShadow: goldGlow(0.6)}}>IRAQ TRADE ECOSYSTEM</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1140}}>
				<Head text="بوابة التاجر" frame={f} start={640} size={104} mode="rise" stagger={3} dur={9} />
				<Head text="نحو العالم" frame={f} start={645} size={104} mode="rise" stagger={3} dur={9} color={P.gold} glow="gold" />
			</div>
		</AbsoluteFill>
	);
};
