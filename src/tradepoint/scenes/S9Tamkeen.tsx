import React from 'react';
import {AbsoluteFill} from 'remotion';
import {expoInOut, expoOut, lerp, ramp} from '../../theme';
import {Head, TamkeenLogo} from '../kit';
import {P, PCX, PF} from '../theme';

/**
 * Scene 9 — TAMKEEN ending (675–900f).
 * 675–750: developed & operated by TAMKEEN. 744–900: resolves into the TAMKEEN contact end card
 * (same card as the TAMKEEN outdoor film), settled by ~790f and held to the fade.
 */
const TURQ = '#1DB597';

export const S9Tamkeen: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 672) return null;
	const word = ramp(f, 690, 708, 0, 1, expoOut);
	const line = ramp(f, 696, 712, 0, 1, expoOut);
	const mv = ramp(f, 744, 764, 0, 1, expoInOut);
	const contact = ramp(f, 764, 780, 0, 1, expoOut);
	const breathe = 0.5 + 0.5 * Math.sin((f - 790) / 10);
	const logoY = lerp(720, 600, mv);
	return (
		<AbsoluteFill style={{opacity: ramp(f, 674, 682)}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: lerp(330, 250, mv), opacity: 1 - ramp(f, 744, 756)}}>
				<Head text="تطوير وتشغيل" frame={f} start={678} size={72} mode="rise" stagger={3} dur={10} color={P.muted} weight={600} />
			</div>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<circle cx={PCX} cy={logoY} r={260} fill={TURQ} opacity={(0.08 + 0.04 * breathe * ramp(f, 790, 800)) * ramp(f, 684, 700)} style={{filter: 'blur(50px)'}} />
			</svg>
			<TamkeenLogo cx={PCX} cy={logoY} k={0.62} frame={f} start={682} />
			<div style={{position: 'absolute', left: 0, right: 0, top: lerp(1000, 850, mv), display: 'flex', justifyContent: 'center'}}>
				{'TAMKEEN'.split('').map((ch, i) => {
					const p = ramp(f, 690 + i * 1.5, 704 + i * 1.5, 0, 1, expoOut);
					return (
						<span key={i} style={{display: 'inline-block', fontFamily: PF.en, fontWeight: 500, fontSize: 132, lineHeight: 1, letterSpacing: lerp(36, 12, word), color: TURQ, opacity: p, transform: `translateY(${(1 - p) * 50}px)`, filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined, textShadow: '0 0 28px rgba(29,181,151,0.55)'}}>
							{ch}
						</span>
					);
				})}
			</div>
			<div style={{position: 'absolute', left: PCX - 330 * line, width: 660 * line, top: lerp(1164, 1012, mv), height: 4, borderRadius: 2, background: `linear-gradient(90deg, rgba(29,181,151,0), ${TURQ}, rgba(29,181,151,0))`}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 1200, opacity: 1 - ramp(f, 744, 752)}}>
				<Head text="حلول رقمية للتجارة والأعمال" frame={f} start={700} size={60} mode="rise" stagger={2} dur={10} weight={600} />
			</div>
			{/* TAMKEEN contact end card */}
			{f >= 756 ? (
				<>
					<div style={{position: 'absolute', left: 0, right: 0, top: 1040}}>
						<Head text="إعلانك في قلب الحدث" frame={f} start={756} size={86} mode="rise" stagger={3} dur={10} />
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 1200, textAlign: 'center', opacity: contact, transform: `translateY(${(1 - contact) * 30}px)`}}>
						<div style={{fontFamily: PF.en, fontWeight: 700, fontSize: 58, color: TURQ, textShadow: '0 0 20px rgba(29,181,151,0.6)'}}>Contact us :</div>
						<div style={{fontFamily: PF.en, fontWeight: 900, fontSize: 116, lineHeight: 1.05, color: P.white, fontVariantNumeric: 'tabular-nums', letterSpacing: 2, textShadow: `0 0 ${20 + 16 * breathe * ramp(f, 790, 800)}px rgba(29,181,151,0.55)`}}>
							{'07803158768'.split('').map((d, i) => {
								const p = ramp(f, 766 + i, 780 + i, 0, 1, expoOut);
								return (
									<span key={i} style={{display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 26}px)`}}>
										{d}
									</span>
								);
							})}
						</div>
						<div style={{marginTop: 26, fontFamily: PF.en, fontWeight: 600, fontSize: 52, color: 'rgba(245,245,242,0.85)', opacity: ramp(f, 778, 790)}}>www.tamkeen-tech.com</div>
					</div>
				</>
			) : null}
		</AbsoluteFill>
	);
};
