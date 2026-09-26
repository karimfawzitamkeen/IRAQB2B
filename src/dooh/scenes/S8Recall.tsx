import React from 'react';
import {AbsoluteFill} from 'remotion';
import {backOut, expoInOut, expoOut, lerp, ramp, rnd, smooth} from '../../theme';
import {Statement, hexPath, hexPoints} from '../kit';
import {T, TCX, TF} from '../theme';

/** Scene 8 — Brand recall (615–750f): convergence → hexagon motif → TAMKEEN → message → contact. */
const EMB = {x: TCX, y: 596};
const CONV = Array.from({length: 190}, (_, i) => ({a: rnd(`cv-a${i}`) * Math.PI * 2, r: 500 + rnd(`cv-r${i}`) * 900, d: rnd(`cv-d${i}`) * 10, c: rnd(`cv-c${i}`) > 0.5}));

/**
 * TAMKEEN logo — hexagon cluster measured from the supplied logo (690-px-wide reference, centre x 343).
 * Reversed for a dark LED screen: navy hexagons render white, turquoise stays turquoise.
 */
type LogoHex = {x: number; y: number; r: number; navy: boolean};
const LOGO_HEX: LogoHex[] = [
	...[[343, 72], [225, 128], [463, 128], [122, 178], [565, 178], [122, 418], [565, 418], [225, 470], [463, 470]].map(([x, y]) => ({x, y, r: 40, navy: true})),
	...[[343, 178], [225, 237], [463, 237], [343, 297], [343, 418]].map(([x, y]) => ({x, y, r: 58, navy: false})),
	...[[122, 298], [565, 298], [343, 523]].map(([x, y]) => ({x, y, r: 40, navy: false})),
	...[[225, 360], [463, 360]].map(([x, y]) => ({x, y, r: 58, navy: true})),
];
const LOGO_K = 0.72;
const LOGO_CY = 297;

const convPos = (p: (typeof CONV)[number], f: number) => {
	const m = ramp(f, 604 + p.d, 632 + p.d, 0, 1, expoInOut);
	const r = lerp(p.r, 0, m);
	return {x: EMB.x + r * Math.cos(p.a + m * 0.8), y: EMB.y + r * Math.sin(p.a + m * 0.8), m};
};

export const S8Recall: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 600) return null;
	const push = ramp(f, 640, 750, 0, 1, smooth);
	const seg = hexPoints(150, 0, 0);
	const core = ramp(f, 628, 642, 0, 1, backOut);
	const breathe = 0.5 + 0.5 * Math.sin((f - 690) / 10);
	const word = ramp(f, 640, 668, 0, 1, expoOut);
	const contact = ramp(f, 668, 684, 0, 1, expoOut);

	return (
		<AbsoluteFill style={{transform: `scale(${1 + push * 0.025})`, transformOrigin: '540px 960px'}}>
			{/* everything converges */}
			{f < 660 ? (
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
					{CONV.map((p, i) => {
						const a = convPos(p, f);
						const b = convPos(p, f - 1.5);
						const dx = b.x - a.x;
						const dy = b.y - a.y;
						const len = Math.hypot(dx, dy);
						const k = len > 90 ? 90 / len : 1;
						const o = ramp(f, 602, 608) * (1 - ramp(a.m, 0.85, 1));
						return <line key={i} x1={a.x + dx * k} y1={a.y + dy * k} x2={a.x + 0.01} y2={a.y} stroke={p.c ? T.cyan : T.turq} strokeWidth={4} strokeOpacity={o} strokeLinecap="round" style={{filter: `drop-shadow(0 0 6px ${T.turq})`}} />;
					})}
				</svg>
			) : null}

			{/* the TAMKEEN logo cluster assembles from the converging light, hexagon by hexagon */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<circle cx={EMB.x} cy={EMB.y} r={300} fill={T.turq} opacity={(0.07 + 0.05 * breathe * ramp(f, 690, 700)) * core} style={{filter: 'blur(40px)'}} />
				{LOGO_HEX.map((h, i) => {
					const dx = (h.x - 343) * LOGO_K;
					const dy = (h.y - LOGO_CY) * LOGO_K;
					const order = Math.hypot(dx, dy) / 200; // centre first, then outward
					const p = ramp(f, 616 + order * 14 + (i % 3), 632 + order * 14 + (i % 3), 0, 1, backOut);
					if (p <= 0) return null;
					const fromX = dx * 3.2;
					const fromY = dy * 3.2;
					const x = EMB.x + lerp(fromX, dx, Math.min(1, p));
					const y = EMB.y + lerp(fromY, dy, Math.min(1, p));
					const sweep = Math.max(0, 1 - Math.abs((dx + 200) / 400 - ramp(f, 700, 730, -0.2, 1.2, (t) => t)) * 4);
					return (
						<path
							key={i}
							d={hexPath(h.r * LOGO_K * 0.9 * p, x, y, 0)}
							fill={h.navy ? T.white : T.turq}
							opacity={Math.min(1, p)}
							style={{filter: `drop-shadow(0 0 ${10 + sweep * 18}px ${h.navy ? 'rgba(247,251,252,0.45)' : 'rgba(19,198,179,0.8)'})`}}
						/>
					);
				})}
			</svg>

			{/* TAMKEEN wordmark (Latin letters may animate individually) */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 830, display: 'flex', justifyContent: 'center'}}>
				{'TAMKEEN'.split('').map((ch, i) => {
					const p = ramp(f, 642 + i * 2, 662 + i * 2, 0, 1, expoOut);
					return (
						<span key={i} style={{display: 'inline-block', fontFamily: TF.en, fontWeight: 500, fontSize: 138, lineHeight: 1, letterSpacing: lerp(40, 12, word), color: T.turq, opacity: p, transform: `translateY(${(1 - p) * 60}px) scale(${1 + (1 - p) * 0.4})`, filter: p < 1 ? `blur(${(1 - p) * 12}px)` : undefined, textShadow: `0 0 30px rgba(19,198,179,0.6)`}}>
							{ch}
						</span>
					);
				})}
			</div>
			<div style={{position: 'absolute', left: TCX - 360 * word, width: 720 * word, top: 994, height: 5, borderRadius: 3, background: `linear-gradient(90deg, rgba(19,198,179,0), ${T.turq}, ${T.cyan}, ${T.turq}, rgba(19,198,179,0))`, boxShadow: `0 0 20px ${T.turq}`}} />

			{/* message */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 1030}}>
				<Statement text="إعلانك في قلب الحدث" frame={f} start={652} size={86} mode="rise" stagger={3} dur={10} weight={800} />
			</div>

			{/* contact */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 1190, textAlign: 'center', opacity: contact, transform: `translateY(${(1 - contact) * 30}px)`}}>
				<div style={{fontFamily: TF.en, fontWeight: 700, fontSize: 58, color: T.turq, textShadow: '0 0 20px rgba(19,198,179,0.6)'}}>Contact us :</div>
				<div style={{fontFamily: TF.en, fontWeight: 900, fontSize: 116, lineHeight: 1.05, color: T.white, fontVariantNumeric: 'tabular-nums', letterSpacing: 2, textShadow: `0 0 ${20 + 16 * breathe * ramp(f, 690, 700)}px rgba(52,228,255,0.55)`}}>
					{'07803158768'.split('').map((d, i) => {
						const p = ramp(f, 670 + i, 684 + i, 0, 1, expoOut);
						return (
							<span key={i} style={{display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 26}px)`}}>
								{d}
							</span>
						);
					})}
				</div>
				<div style={{marginTop: 26, fontFamily: TF.en, fontWeight: 600, fontSize: 52, color: 'rgba(247,251,252,0.85)', opacity: ramp(f, 680, 692)}}>www.tamkeen-tech.com</div>
			</div>
		</AbsoluteFill>
	);
};
