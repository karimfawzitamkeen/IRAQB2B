import React from 'react';
import {AbsoluteFill} from 'remotion';
import {expoInOut, expoOut, lerp, ramp, rnd, smooth} from '../../theme';
import {S, SCX, SF} from '../theme';
import {ArWords, Arch} from '../ui';

/** Scene 8 — Brand resolve (630–750f). Minimal centred lock-up; final hold ≥ 1.2 s. */
const EMBLEM = {x: SCX, y: 700};
const STREAKS = Array.from({length: 150}, (_, i) => ({
	a: rnd(`s8a${i}`) * Math.PI * 2,
	r: 180 + rnd(`s8r${i}`) * 620,
	delay: rnd(`s8d${i}`) * 14,
	gold: rnd(`s8g${i}`) > 0.3,
	w: 0.8 + rnd(`s8w${i}`) * 1.4,
}));

const streakPos = (s: (typeof STREAKS)[number], f: number) => {
	const m = ramp(f, 616 + s.delay, 652 + s.delay, 0, 1, expoInOut);
	const r = lerp(s.r, 0, m);
	const a = s.a + m * 1.2;
	return {x: EMBLEM.x + r * Math.cos(a), y: EMBLEM.y - 30 + r * Math.sin(a) * 0.9, m};
};

export const S8Brand: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 612) return null;
	const push = ramp(f, 640, 750, 0, 1, smooth);
	const arch = ramp(f, 640, 670, 0, 1, expoOut);
	const point = ramp(f, 666, 678, 0, 1, expoOut);
	const sweep = Math.sin(Math.PI * ramp(f, 706, 734, 0, 1, (t) => t));
	const track = lerp(34, 10, ramp(f, 664, 700, 0, 1, expoOut));
	const eng = ramp(f, 664, 684, 0, 1, expoOut);
	const rule = ramp(f, 668, 690, 0, 1, expoOut);

	return (
		<AbsoluteFill style={{transform: `scale(${1 + push * 0.02})`, transformOrigin: '540px 960px'}}>
			{/* convergence streaks */}
			{f < 690 ? (
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
					{STREAKS.map((s, i) => {
						const a = streakPos(s, f);
						const b = streakPos(s, f - 1.5);
						const dx = b.x - a.x;
						const dy = b.y - a.y;
						const len = Math.hypot(dx, dy);
						const k = len > 30 ? 30 / len : 1;
						const o = ramp(f, 614 + s.delay * 0.3, 622 + s.delay * 0.3) * (1 - ramp(a.m, 0.85, 1));
						return o > 0.01 ? <line key={i} x1={a.x + dx * k} y1={a.y + dy * k} x2={a.x + 0.01} y2={a.y} stroke={s.gold ? S.goldLight : S.emerald} strokeWidth={s.w * 1.3} strokeOpacity={o} strokeLinecap="round" style={{filter: `drop-shadow(0 0 4px ${s.gold ? S.gold : S.emerald})`}} /> : null;
					})}
				</svg>
			) : null}

			{/* the gold arch emblem, with a single emerald point */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<defs>
					<radialGradient id="s8g">
						<stop offset="0%" stopColor={S.gold} stopOpacity={0.22 + sweep * 0.2} />
						<stop offset="100%" stopColor={S.gold} stopOpacity={0} />
					</radialGradient>
				</defs>
				<circle cx={EMBLEM.x} cy={EMBLEM.y - 20} r={180} fill="url(#s8g)" opacity={arch} />
				{f < 672 ? <circle cx={EMBLEM.x} cy={EMBLEM.y - 30} r={10 + ramp(f, 640, 668, 0, 1, expoOut) * 120} fill="none" stroke={S.goldLight} strokeWidth={2} strokeOpacity={ramp(f, 636, 644) * (1 - ramp(f, 644, 670))} /> : null}
				<g transform={`translate(${EMBLEM.x} ${EMBLEM.y})`}>
					<Arch w={140} legs={62} draw={arch} glow={0.4 + sweep * 0.8} stroke={2.6} />
					<line x1={-96 * arch} y1={62} x2={96 * arch} y2={62} stroke={S.gold} strokeWidth={1.6} strokeOpacity={0.8} />
					<circle cx={0} cy={-14} r={7 * point} fill={S.emerald} style={{filter: `drop-shadow(0 0 ${10 + sweep * 10}px ${S.emerald})`}} />
				</g>
			</svg>

			{/* lock-up — one measured column, centred on x 540 (no absolute stacking → no collisions) */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 800, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<ArWords text="منصة المستشار" frame={f} start={650} stagger={5} dur={22} style={{fontSize: 96, fontWeight: 600, color: S.white, lineHeight: 1.12}} />
				<ArWords text="القانوني الذكي" frame={f} start={658} stagger={5} dur={22} style={{fontSize: 96, fontWeight: 600, color: S.white, lineHeight: 1.12, marginTop: -34}} />
				<div style={{marginTop: 18, opacity: eng, transform: `translateY(${(1 - eng) * 14}px)`, whiteSpace: 'nowrap'}}>
					<span style={{fontFamily: SF.en, fontWeight: 500, fontSize: 34, letterSpacing: track, marginRight: -track, color: S.gold}}>SMART LEGAL ADVISOR</span>
				</div>
				<div style={{width: 300 * rule, height: 1.5, marginTop: 26, background: `linear-gradient(90deg, rgba(201,164,92,0), ${S.gold}, rgba(201,164,92,0))`}} />
				<ArWords text="بوابتك إلى الخدمات القانونية الرقمية" frame={f} start={672} stagger={3} dur={20} style={{fontSize: 42, fontWeight: 400, color: 'rgba(244,242,236,0.9)', lineHeight: 1.2, marginTop: 14}} />
				<ArWords text="المعرفة القانونية. بصورة أذكى." frame={f} start={680} stagger={3} dur={18} style={{fontSize: 36, fontWeight: 300, color: '#BFEBD8', lineHeight: 1.2, marginTop: 6}} />
			</div>
		</AbsoluteFill>
	);
};
