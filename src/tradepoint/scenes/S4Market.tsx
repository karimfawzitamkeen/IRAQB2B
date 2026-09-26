import React from 'react';
import {AbsoluteFill} from 'remotion';
import {backOut, expoIn, expoInOut, expoOut, lerp, ramp} from '../../theme';
import {Beat, Head, LISTINGS, ListingCard, Scrim} from '../kit';
import {P} from '../theme';

/** Scene 4 — Digital marketplace (240–330f): listings swipe in, products light up, cards flip to requests, all stack into sales. */
const SLOTS = [
	{x: 120, y: 540},
	{x: 560, y: 540},
	{x: 120, y: 1030},
	{x: 560, y: 1030},
];
// front faces (products + requests) and back faces revealed by the flip
const FRONT = [0, 1, 2, 3];
const BACK = [4, 1, 5, 3];

export const S4Market: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 236 || f > 338) return null;
	const flip = ramp(f, 284, 296, 0, 1, expoInOut);
	const stack = ramp(f, 304, 318, 0, 1, expoInOut);
	const exit = ramp(f, 324, 334, 0, 1, expoIn);
	const phase = f < 264 ? 0 : f < 284 ? 1 : f < 304 ? 2 : 3;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{opacity: 1 - exit, transform: `translateY(${-exit * 300}px) scale(${1 - exit * 0.3})`, transformOrigin: '540px 1000px'}}>
				{SLOTS.map((s, i) => {
					const inP = ramp(f, 240 + i * 3, 254 + i * 3, 0, 1, expoOut);
					const card = LISTINGS[flip < 0.5 ? FRONT[i] : BACK[i]];
					const rfq = !!card.rfq;
					// highlight: products in "منتجات", requests in "طلبات", all in "فرص بيع"
					const on = phase === 0 || phase === 3 || (phase === 1 && !rfq) || (phase === 2 && rfq);
					const hi = phase === 1 || phase === 2 ? (on ? 1 : 0) : 0;
					const dim = phase === 1 || phase === 2 ? (on ? 1 : 0.35) : 1;
					const ang = flip * 180;
					const sx = Math.abs(Math.cos((ang * Math.PI) / 180));
					// stack position
					const tx = lerp(s.x, 330 + (i - 1.5) * 16, stack);
					const ty = lerp(s.y, 760 + (i - 1.5) * 26, stack);
					const rot = stack * (i - 1.5) * 5;
					return (
						<div key={i} style={{position: 'absolute', left: tx, top: ty, width: 400, transform: `translateX(${(1 - inP) * 1000}px) rotate(${(1 - inP) * 14 + rot}deg) scaleX(${Math.max(0.02, sx)}) scale(${1 + hi * 0.05 * ramp(f, phase === 1 ? 264 : 294, phase === 1 ? 272 : 302, 0, 1, backOut) + stack * 0.25})`, opacity: lerp(1, dim, ramp(f, phase === 1 ? 264 : 286, phase === 1 ? 270 : 292)) * Math.min(1, inP * 2), filter: hi ? `drop-shadow(0 0 30px ${rfq ? 'rgba(31,165,154,0.9)' : 'rgba(212,166,41,0.9)'})` : undefined, zIndex: i}}>
							<ListingCard l={card} w={400} />
						</div>
					);
				})}
				{/* "sales" burst around the stack */}
				{f >= 312 ? (
					<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
						{Array.from({length: 16}, (_, i) => {
							const a = (i / 16) * Math.PI * 2;
							const p = ramp(f, 312, 330, 0, 1, expoOut);
							const r0 = 420 + p * 80;
							const r1 = r0 + 60 + (i % 3) * 40;
							return <line key={i} x1={540 + Math.cos(a) * r0} y1={1000 + Math.sin(a) * r0} x2={540 + Math.cos(a) * r1} y2={1000 + Math.sin(a) * r1} stroke={i % 2 ? P.gold : P.white} strokeWidth={5} strokeLinecap="round" opacity={(1 - p) * 0.9} />;
						})}
					</svg>
				) : null}
			</AbsoluteFill>
			<Scrim top={140} h={360} />
			<Beat frame={f} a={241} b={264} top={220}>
				<Head text="السوق الرقمي" frame={f} start={241} size={136} mode="slam" stagger={4} dur={8} />
			</Beat>
			<Beat frame={f} a={264} b={284} top={220}>
				<Head text="منتجات" frame={f} start={264} size={150} mode="slam" dur={7} color={P.gold} glow="gold" />
			</Beat>
			<Beat frame={f} a={284} b={304} top={220}>
				<Head text="طلبات" frame={f} start={284} size={150} mode="slam" dur={7} color="#7FE3D9" />
			</Beat>
			<Beat frame={f} a={304} b={332} top={220} out="zoom">
				<Head text="فرص بيع" frame={f} start={304} size={150} mode="slam" stagger={4} dur={8} color={P.gold} glow="gold" />
			</Beat>
		</AbsoluteFill>
	);
};
