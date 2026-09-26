import React from 'react';
import {AbsoluteFill} from 'remotion';
import {backOut, expoIn, expoOut, lerp, ramp} from '../../theme';
import {Beat, Head, MEMBERS, MemberCard, Scrim} from '../kit';
import {P, PCX} from '../theme';

/** Scene 3 — Member directory (165–240f): member cards stream through depth, trusted partners lock in. */
const FOCAL = 900;
const STREAM = [2, 5, 4, 6, 7, 2, 5, 6].map((m, i) => ({m: MEMBERS[m], t0: 164 + i * 4.5, x: (i % 2 ? 1 : -1) * (260 + (i % 3) * 90), y: 960 + (((i * 3) % 5) - 2) * 260}));
const FEATURED = [
	{m: MEMBERS[0], y: 620, t: 200},
	{m: MEMBERS[1], y: 870, t: 205},
	{m: MEMBERS[3], y: 1120, t: 210},
];

export const S3Members: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 158 || f > 250) return null;
	const exit = ramp(f, 234, 246, 0, 1, expoIn);
	return (
		<AbsoluteFill style={{opacity: 1 - ramp(f, 238, 246)}}>
			{/* depth stream */}
			{STREAM.map((s, i) => {
				const t = ramp(f, s.t0, s.t0 + 30, 0, 1, (x) => x);
				if (t <= 0 || t >= 1) return null;
				const z = lerp(1700, -600, t);
				const k = FOCAL / (FOCAL + z);
				const o = ramp(t, 0, 0.15) * ramp(z, -300, 150);
				return (
					<div key={i} style={{position: 'absolute', left: PCX + s.x * k - 310, top: 960 + (s.y - 960) * k - 85, transform: `scale(${k})`, opacity: o, filter: z < 0 ? `blur(${-z / 40}px)` : undefined}}>
						<MemberCard m={s.m} w={620} />
					</div>
				);
			})}
			{/* trusted partners land and stack */}
			{FEATURED.map((c, i) => {
				const p = ramp(f, c.t, c.t + 12, 0, 1, backOut);
				if (p <= 0) return null;
				const glow = ramp(f, c.t + 8, c.t + 16) * (1 - ramp(f, c.t + 16, c.t + 30));
				return (
					<div key={i} style={{position: 'absolute', left: PCX - 390, top: c.y, transform: `translateX(${exit * (i % 2 ? 1 : -1) * 1100}px) perspective(1600px) rotateX(${(1 - Math.min(1, p)) * -60}deg) scale(${lerp(1.6, 1, Math.min(1, p))})`, opacity: Math.min(1, p * 2), filter: `drop-shadow(0 0 ${glow * 40}px rgba(212,166,41,0.8))`}}>
						<MemberCard m={c.m} w={780} />
					</div>
				);
			})}
			<Scrim top={140} h={360} />
			<Beat frame={f} a={163} b={202} top={220}>
				<Head text="دليل الأعضاء" frame={f} start={166} size={136} mode="slam" stagger={4} dur={9} />
			</Beat>
			<Beat frame={f} a={202} b={242} top={220}>
				<Head text="شركاء موثوقون" frame={f} start={202} size={136} mode="rise" stagger={4} dur={10} color={P.gold} glow="gold" />
			</Beat>
		</AbsoluteFill>
	);
};
