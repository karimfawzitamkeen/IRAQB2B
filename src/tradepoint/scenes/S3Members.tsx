import React from 'react';
import {AbsoluteFill} from 'remotion';
import {backOut, expoIn, expoInOut, expoOut, lerp, ramp} from '../../theme';
import {Beat, Head, Icon, SHOTS, Scrim, Shot} from '../kit';
import {P, PCX, PF} from '../theme';

/**
 * Scene 3 — Members directory (165–240f), built on the real platform screenshots:
 * the Members Directory page swings in, its featured banner lifts off the page,
 * then the real Verified + Diamond member card comes forward.
 */
const PW3 = 620;
const PH3 = (PW3 * SHOTS.members.h) / SHOTS.members.w;
const K = PW3 / SHOTS.members.w;
const CARD_W = 860;
const CK = CARD_W / SHOTS.memberDiamond.w;

export const S3Members: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 160 || f > 250) return null;
	const inP = ramp(f, 162, 182, 0, 1, expoOut);
	const lift = ramp(f, 180, 194, 0, 1, backOut);
	const back = ramp(f, 198, 212, 0, 1, expoInOut);
	const card = ramp(f, 202, 216, 0, 1, backOut);
	const exit = ramp(f, 234, 246, 0, 1, expoIn);
	const pageTop = 1000 - PH3 / 2;
	// banner position inside the page (screenshot px → screen)
	const bx = PCX - PW3 / 2 + 53 * K;
	const by = pageTop + (959 - 0) * K;
	const bw = SHOTS.membersBanner.w * K;
	const ring = (t: number) => ramp(f, t, t + 8) * (1 - ramp(f, t + 14, t + 24));
	return (
		<AbsoluteFill style={{opacity: 1 - ramp(f, 238, 246)}}>
			<AbsoluteFill style={{transform: `scale(${lerp(1, 0.86, back) * (1 + exit * 0.1)})`, transformOrigin: '540px 1000px', opacity: lerp(1, 0.28, back), filter: back > 0 ? `blur(${back * 4}px)` : undefined}}>
				{/* the real Members Directory page */}
				<div style={{position: 'absolute', left: PCX - PW3 / 2, top: pageTop, transform: `perspective(2000px) translateX(${(1 - inP) * 700}px) rotateY(${lerp(-48, -8, inP)}deg) scale(${lerp(0.7, 1, inP)})`, opacity: Math.min(1, inP * 2)}}>
					<Shot shot={SHOTS.members} w={PW3} radius={34} sweep={ramp(f, 176, 196, -0.4, 1.4)} />
				</div>
				{/* its featured banner lifts off the page toward the camera */}
				{f >= 178 ? (
					<div style={{position: 'absolute', left: bx, top: by, transform: `perspective(2000px) translate(${lift * -60}px, ${lift * -40}px) rotateY(${lerp(-8, 0, lift)}deg) scale(${1 + lift * 0.28})`, transformOrigin: '50% 50%', opacity: ramp(f, 178, 182)}}>
						<Shot shot={SHOTS.membersBanner} w={bw} radius={22} />
					</div>
				) : null}
			</AbsoluteFill>
			{/* the real verified + diamond member card comes forward */}
			{card > 0 ? (
				<div style={{position: 'absolute', left: PCX - CARD_W / 2, top: 640, transform: `translateX(${exit * -1100}px) perspective(1600px) rotateX(${(1 - Math.min(1, card)) * -55}deg) scale(${lerp(1.5, 1, Math.min(1, card))})`, opacity: Math.min(1, card * 2)}}>
					<Shot shot={SHOTS.memberDiamond} w={CARD_W} radius={30}>
						{/* badge highlights on the real Verified and Diamond badges */}
						<div style={{position: 'absolute', left: 22 * CK, top: 34 * CK, width: 236 * CK, height: 78 * CK, borderRadius: 40, border: `5px solid ${P.teal}`, boxShadow: `0 0 30px ${P.teal}`, opacity: ring(214)}} />
						<div style={{position: 'absolute', left: 734 * CK, top: 34 * CK, width: 258 * CK, height: 78 * CK, borderRadius: 40, border: `5px solid ${P.gold}`, boxShadow: `0 0 30px ${P.gold}`, opacity: ring(220)}} />
					</Shot>
				</div>
			) : null}
			{/* Arabic reading of the two badges */}
			<div dir="rtl" style={{position: 'absolute', left: 0, right: 0, top: 1220, display: 'flex', justifyContent: 'center', gap: 36, transform: `translateX(${exit * 1100}px)`}}>
				{[
					{t: 'موثّق', icon: 'check', bg: P.teal, fg: P.white, at: 214},
					{t: 'عضو ماسي', icon: 'diamond', bg: P.gold, fg: P.navy, at: 220},
				].map((b, i) => {
					const p = ramp(f, b.at, b.at + 10, 0, 1, backOut);
					return (
						<div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, height: 96, padding: '0 38px', borderRadius: 999, background: b.bg, color: b.fg, fontFamily: PF.ar, fontWeight: 700, fontSize: 52, transform: `scale(${p})`, opacity: Math.min(1, p), boxShadow: `0 16px 40px rgba(0,0,0,0.45)`}}>
							<Icon name={b.icon} size={52} color={b.fg} stroke={3.4} />
							{b.t}
						</div>
					);
				})}
			</div>
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
