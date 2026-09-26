import React from 'react';
import {AbsoluteFill} from 'remotion';
import {expoIn, expoInOut, expoOut, kf, lerp, ramp} from '../../theme';
import {Head, SHOTS, Shot} from '../kit';
import {P, PCX, PF, STATS, goldGlow} from '../theme';

/** Scene 2 — Homepage hero (90–165f): the platform flies in, then the ecosystem in numbers. */
export const S2Home: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 86 || f > 172) return null;
	const inP = ramp(f, 88, 108, 0, 1, expoOut);
	const up = ramp(f, 112, 127, 0, 1, expoInOut);
	const exit = ramp(f, 156, 166, 0, 1, expoIn);
	const scale = lerp(lerp(0.55, 0.92, inP), 0.44, up);
	const cy = lerp(lerp(1300, 950, inP), 500, up);
	const PANEL_H = (880 * SHOTS.home.h) / SHOTS.home.w;
	const rotX = lerp(38, 0, inP) + up * 10;
	const sweep = ramp(f, 98, 118, -0.4, 1.4);
	return (
		<AbsoluteFill style={{opacity: 1 - exit, transform: `scale(${1 + exit * 0.3})`, transformOrigin: '540px 900px'}}>
			<div style={{position: 'absolute', left: PCX - 440, top: cy - PANEL_H / 2, width: 880, height: PANEL_H, transform: `perspective(2200px) rotateX(${rotX}deg) scale(${scale})`, opacity: ramp(f, 88, 96)}}>
				<Shot shot={SHOTS.home} w={880} radius={40} sweep={sweep} />
			</div>
			{/* تواصل · اكتشف · نمِّ أعمالك */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 850}}>
				<Head text="تواصل · اكتشف" frame={f} start={127} size={100} mode="slam" stagger={4} dur={9} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 985}}>
				<Head text="نمِّ أعمالك" frame={f} start={135} size={116} mode="slam" stagger={4} dur={9} color={P.gold} glow="gold" />
			</div>
			{/* counters */}
			<div style={{position: 'absolute', left: 110, right: 110, top: 1235, display: 'flex', justifyContent: 'space-between', direction: 'rtl'}}>
				{STATS.map((s, i) => {
					const p = ramp(f, 140 + i * 3, 150 + i * 3, 0, 1, expoOut);
					const n = Math.round(s.value * kf(f, [[140 + i * 3, 0], [156, 1]], expoOut));
					return (
						<div key={i} style={{width: 286, textAlign: 'center', direction: 'ltr', opacity: p, transform: `translateY(${(1 - p) * 50}px)`, borderRight: i ? '2px solid rgba(212,166,41,0.35)' : undefined}}>
							<div style={{fontFamily: PF.en, fontWeight: 900, fontSize: 72, lineHeight: 1, color: P.white, fontVariantNumeric: 'tabular-nums', textShadow: goldGlow(0.5)}}>
								{n.toLocaleString('en-US')}
								<span style={{color: P.gold}}>{s.suffix}</span>
							</div>
							<div dir="rtl" style={{marginTop: 16, fontFamily: PF.ar, fontWeight: 600, fontSize: 42, color: P.muted}}>
								{s.label}
							</div>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
