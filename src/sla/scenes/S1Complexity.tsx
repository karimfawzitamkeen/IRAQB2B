import React from 'react';
import {AbsoluteFill} from 'remotion';
import {expoInOut, expoOut, lerp, ramp, rnd, smooth} from '../../theme';
import {DirBlur} from '../../components/Primitives';
import {S, SCX, SF} from '../theme';
import {ArWords, glass} from '../ui';

/** Scene 1 — Legal complexity (0–90f): fragments in depth → a gold line brings order → a structured document. */

// generic, fictional legal fragments (no real citations)
const ROW_FRAGS = ['المادة ٢٥', 'البند الثالث', 'الطرف الأول', 'الالتزامات', 'مدة الطعن ٣٠ يوماً', 'الفقرة ب', 'ملحق العقد', 'النفاذ', 'إشعار'];
const EXTRA_FRAGS = ['حكم', 'مذكرة', '١٤ تشرين الأول', '؟', 'الطرف الثاني', 'دعوى', 'تبليغ', 'المادة ٧', 'سند'];

export const DOC1 = {x: SCX, y: 830, w: 500, h: 610};
const ROW0 = DOC1.y - DOC1.h / 2 + 118;
const ROW_H = 50;

type Frag = {text: string; row: number; x0: number; y0: number; vx: number; vy: number; rot: number; vr: number; layer: number};
const FRAGS: Frag[] = [...ROW_FRAGS, ...EXTRA_FRAGS].map((text, i) => ({
	text,
	row: i < ROW_FRAGS.length ? i : -1,
	x0: 180 + rnd(`f1x${i}`) * 780,
	y0: 300 + rnd(`f1y${i}`) * 1300,
	vx: (rnd(`f1vx${i}`) - 0.5) * 1.3,
	vy: (rnd(`f1vy${i}`) - 0.5) * 1.1,
	rot: (rnd(`f1r${i}`) - 0.5) * 22,
	vr: (rnd(`f1vr${i}`) - 0.5) * 0.12,
	layer: i < ROW_FRAGS.length ? 1 : i % 3 === 0 ? 2 : 0,
}));
const LAYER = [
	{size: 30, o: 0.28, blur: 1.6, color: S.goldLight},
	{size: 40, o: 0.7, blur: 0, color: S.white},
	{size: 66, o: 0.22, blur: 5, color: S.gold},
];

export const docPose1 = (f: number) => {
	const up = ramp(f, 84, 110, 0, 1, expoInOut);
	return {y: lerp(DOC1.y, 600, up), s: lerp(1, 0.34, up), o: 1 - ramp(f, 102, 112)};
};

export const S1Complexity: React.FC<{frame: number}> = ({frame: f}) => {
	if (f > 114) return null;
	const line = ramp(f, 28, 60, 0, 1, smooth);
	const rule = ramp(f, 54, 70, 0, 1, expoOut);
	const body = ramp(f, 60, 80, 0, 1, smooth);
	const h1out = ramp(f, 40, 52);
	const h2out = ramp(f, 84, 98);
	const pose = docPose1(f);
	const prev = docPose1(f - 1);
	const top = DOC1.y - DOC1.h / 2;

	return (
		<AbsoluteFill>
			{/* the structured document, rising toward the portal at the end */}
			<DirBlur id="s1doc" vx={0} vy={(pose.y - prev.y) * pose.s} k={0.25}>
				<div style={{position: 'absolute', inset: 0, transformOrigin: `${SCX}px ${DOC1.y}px`, transform: `translateY(${pose.y - DOC1.y}px) scale(${pose.s})`, opacity: pose.o}}>
					<div style={{position: 'absolute', left: DOC1.x - DOC1.w / 2, top, width: DOC1.w, height: DOC1.h, ...glass(body), opacity: body}} />
					{/* gold line: descends the centre axis, then becomes the document's header rule */}
					<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
						<line x1={SCX} y1={140} x2={SCX} y2={lerp(140, top + 70, line)} stroke={S.gold} strokeWidth={2} strokeOpacity={1 - rule * 0.85} style={{filter: `drop-shadow(0 0 8px ${S.gold})`}} />
						{line > 0 && line < 1 ? <circle cx={SCX} cy={lerp(140, top + 70, line)} r={4} fill={S.goldLight} style={{filter: `drop-shadow(0 0 10px ${S.gold})`}} /> : null}
						<line x1={SCX - (DOC1.w / 2 - 40) * rule} y1={top + 70} x2={SCX + (DOC1.w / 2 - 40) * rule} y2={top + 70} stroke={S.gold} strokeWidth={2} style={{filter: `drop-shadow(0 0 6px ${S.gold})`}} />
						{/* clause lines extend from each snapped fragment */}
						{ROW_FRAGS.map((_, i) => {
							const p = ramp(f, 70 + i * 1.2, 86 + i * 1.2, 0, 1, expoOut);
							const y = ROW0 + i * ROW_H + 4;
							const right = SCX + DOC1.w / 2 - 40 - 150 - (i % 3) * 40;
							const left = SCX - DOC1.w / 2 + 40;
							return p > 0 ? <line key={i} x1={right} y1={y} x2={lerp(right, left + (i % 2) * 60, p)} y2={y} stroke={S.white} strokeOpacity={0.22} strokeWidth={6} strokeLinecap="round" /> : null;
						})}
					</svg>
					<div dir="rtl" style={{position: 'absolute', left: SCX - 170, width: 340, top: top + 22, textAlign: 'center', fontFamily: SF.law, fontWeight: 700, fontSize: 34, color: S.goldLight, opacity: rule}}>
						وثيقة قانونية
					</div>
					{/* fragments: float in depth, then snap into the document's rows */}
					{FRAGS.map((fr, i) => {
						const L = LAYER[fr.layer];
						const fx = fr.x0 + fr.vx * f;
						const fy = fr.y0 + fr.vy * f;
						const appear = ramp(f, 4 + (i % 7) * 3, 24 + (i % 7) * 3);
						if (fr.row >= 0) {
							const m = ramp(f, 50 + fr.row * 1.5, 76 + fr.row * 1.5, 0, 1, expoInOut);
							const tx = SCX + DOC1.w / 2 - 40;
							const ty = ROW0 + fr.row * ROW_H;
							return (
								<div
									key={i}
									dir="rtl"
									style={{
										position: 'absolute',
										right: 1080 - lerp(fx, tx, m),
										top: lerp(fy, ty, m),
										transform: `translateY(-50%) rotate(${lerp(fr.rot + fr.vr * f, 0, m)}deg)`,
										fontFamily: SF.law,
										fontSize: lerp(L.size, 27, m),
										color: m > 0.5 ? S.white : L.color,
										opacity: appear * lerp(L.o, 0.92, m),
										whiteSpace: 'nowrap',
										lineHeight: 1.4,
									}}
								>
									{fr.text}
								</div>
							);
						}
						const pull = ramp(f, 46 + (i % 5) * 3, 78 + (i % 5) * 3, 0, 1, expoInOut);
						return (
							<div
								key={i}
								dir="rtl"
								style={{
									position: 'absolute',
									right: 1080 - lerp(fx, SCX + 20, pull),
									top: lerp(fy, lerp(fy, top + 70, 0.6), pull),
									transform: `translateY(-50%) rotate(${fr.rot + fr.vr * f}deg) scale(${1 - pull * 0.7})`,
									fontFamily: SF.law,
									fontSize: L.size,
									color: L.color,
									opacity: appear * L.o * (1 - pull),
									filter: L.blur ? `blur(${L.blur}px)` : undefined,
									whiteSpace: 'nowrap',
								}}
							>
								{fr.text}
							</div>
						);
					})}
				</div>
			</DirBlur>

			{/* headline 1 */}
			{h1out < 1 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 760, opacity: 1 - h1out, transform: `translateY(${-h1out * 40}px)`, filter: h1out > 0 ? `blur(${h1out * 10}px)` : undefined}}>
					<div style={{position: 'absolute', left: 140, right: 140, top: -40, height: 220, background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(5,6,7,0.8) 0%, rgba(5,6,7,0) 100%)'}} />
					<ArWords text="القانون معقد..." frame={f} start={10} stagger={6} dur={22} style={{fontSize: 100, fontWeight: 300, color: S.white, lineHeight: 1.3, position: 'relative'}} />
				</div>
			) : null}

			{/* headline 2 (lower band) */}
			{f >= 44 && h2out < 1 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1210, opacity: 1 - h2out, transform: `translateY(${-h2out * 30}px)`}}>
					<div style={{position: 'absolute', left: 60, right: 60, top: -40, height: 340, background: 'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(5,6,7,0.85) 0%, rgba(5,6,7,0) 100%)', opacity: ramp(f, 40, 56)}} />
					<ArWords text="الوصول إليه" frame={f} start={46} stagger={5} dur={22} style={{fontSize: 80, fontWeight: 300, color: S.white, lineHeight: 1.25, position: 'relative'}} />
					<ArWords
						text="لا يجب أن يكون كذلك"
						frame={f}
						start={54}
						stagger={4}
						dur={22}
						style={{fontSize: 80, fontWeight: 600, color: S.goldLight, lineHeight: 1.25, position: 'relative'}}
						wordStyle={() => {
							const sheen = Math.sin(Math.PI * ramp(f, 64, 96, 0, 1, (t) => t));
							return {textShadow: `0 0 ${8 + 22 * sheen}px rgba(230,205,148,${0.2 + 0.4 * sheen})`};
						}}
					/>
				</div>
			) : null}
		</AbsoluteFill>
	);
};
