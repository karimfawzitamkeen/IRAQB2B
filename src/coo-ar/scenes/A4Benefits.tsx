import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, backOut, expoIn, expoOut, ramp} from '../../theme';
import {ArIcon, ArText, Ornament, useLand} from '../kit';
import {AF, AT} from '../theme';

/** Platform benefits (2400–3060f): title, six benefits one at a time, then a summary grid. */
export const BENEFITS = [
	{icon: 'clock', t: 'اختصار الوقت والجهد', s: 'إنجاز المعاملة إلكترونياً من مكان واحد'},
	{icon: 'eye', t: 'شفافية كاملة', s: 'متابعة حالة الطلب في كل مرحلة'},
	{icon: 'shield', t: 'أمان وموثوقية', s: 'توقيع وختم رقمي ورمز تحقق QR'},
	{icon: 'remote', t: 'تقليل المراجعات الحضورية', s: 'تقديم الطلب ومتابعته عن بُعد'},
	{icon: 'archive', t: 'توثيق وأرشفة إلكترونية', s: 'سجل رقمي آمن لكل شهادة'},
	{icon: 'globe', t: 'دعم التجارة الخارجية', s: 'تعزيز الثقة بالشهادة العراقية دولياً'},
];
const B0 = 2474;
const BL = 84;
const G0 = B0 + BL * 6; // 2978

export const A4Benefits: React.FC<{frame: number}> = ({frame: f}) => {
	const [a, b] = AT.benefits;
	const land = useLand();
	const CX = land ? 960 : 540;
	// portrait / landscape positions
	const Y = land ? {orn: 540, title: 460, head: 60, icon: 200, ring: 370, text: 570} : {orn: 900, title: 790, head: 170, icon: 500, ring: 670, text: 920};
	if (f < a || f >= b) return null;
	const titleOut = ramp(f, B0 - 14, B0, 0, 1, expoIn);
	const headIn = ramp(f, B0 - 6, B0 + 10);
	return (
		<AbsoluteFill style={{opacity: 1 - ramp(f, b - 14, b)}}>
			{/* title card */}
			{f < B0 ? (
				<AbsoluteFill style={{opacity: 1 - titleOut, transform: `scale(${1 + titleOut * 0.2})`}}>
					<div style={{position: 'absolute', left: CX - 260, top: Y.orn - 260}}>
						<Ornament size={520} draw={ramp(f, a, a + 50)} frame={f} glow={0.7} />
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: Y.title}}>
						<ArText lines="فوائد المنصة" frame={f} start={a + 8} size={150} weight={900} color="#F0D48E" glow="gold" mode="scale" />
					</div>
				</AbsoluteFill>
			) : null}
			{/* persistent heading */}
			{f >= B0 - 6 ? (
				<div dir="rtl" style={{position: 'absolute', left: 0, right: 0, top: Y.head, textAlign: 'center', fontFamily: AF.display, fontWeight: 900, fontSize: 72, color: '#F0D48E', opacity: headIn, textShadow: '0 0 20px rgba(217,180,106,0.4)'}}>
					فوائد المنصة
				</div>
			) : null}
			{/* one benefit at a time */}
			{BENEFITS.map((bn, i) => {
				const s = B0 + i * BL;
				if (f < s || f >= s + BL) return null;
				const p = ramp(f, s, s + 14, 0, 1, backOut);
				const o = ramp(f, s + BL - 10, s + BL);
				return (
					<AbsoluteFill key={i} style={{opacity: 1 - o, transform: `translateY(${-o * 40}px)`}}>
						<div style={{position: 'absolute', left: CX - 170, top: Y.icon, width: 340, height: 340, borderRadius: '50%', border: `3px solid ${C.gold}`, background: 'radial-gradient(circle, rgba(217,180,106,0.16), rgba(217,180,106,0.02) 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${Math.min(1.05, p)})`, opacity: Math.min(1, p * 2), boxShadow: '0 0 60px rgba(217,180,106,0.3)'}}>
							<ArIcon name={bn.icon} size={190} color="#F0D48E" stroke={2.2} />
						</div>
						<svg width={CX * 2} height={land ? 1080 : 1920} style={{position: 'absolute', inset: 0}}>
							<circle cx={CX} cy={Y.ring} r={210} fill="none" stroke={C.cyan} strokeOpacity={0.5} strokeWidth={2} strokeDasharray="6 14" transform={`rotate(${f * 0.8} ${CX} ${Y.ring})`} />
						</svg>
						<div style={{position: 'absolute', left: 0, right: 0, top: Y.text}}>
							<div style={{display: 'flex', justifyContent: 'center', marginBottom: 12}}>
								<div style={{width: 76, height: 76, borderRadius: '50%', border: `2px solid ${C.cyan}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: AF.display, fontWeight: 900, fontSize: 44, color: C.cyan, opacity: ramp(f, s + 2, s + 10)}}>{['١', '٢', '٣', '٤', '٥', '٦'][i]}</div>
							</div>
							<ArText lines={bn.t} frame={f} start={s + 4} size={100} weight={900} />
							<ArText lines={bn.s} frame={f} start={s + 12} size={56} font={AF.body} weight={600} color="rgba(244,247,251,0.86)" glow="none" stagger={2} style={{marginTop: 16}} />
						</div>
					</AbsoluteFill>
				);
			})}
			{/* summary grid */}
			{f >= G0
				? BENEFITS.map((bn, i) => {
						const col = land ? i % 3 : i % 2;
						const row = land ? Math.floor(i / 3) : Math.floor(i / 2);
						const pos = land ? {left: 1300 - col * 580, top: 190 + row * 420, w: 520, h: 380} : {left: col ? 110 : 560, top: 380 + row * 410, w: 410, h: 370};
						const p = ramp(f, G0 + i * 3, G0 + 16 + i * 3, 0, 1, expoOut);
						return (
							<div key={i} dir="rtl" style={{position: 'absolute', left: pos.left, top: pos.top, width: pos.w, height: pos.h, borderRadius: 28, border: `2px solid rgba(217,180,106,0.6)`, background: 'rgba(11,29,58,0.72)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 24, boxSizing: 'border-box', opacity: p, transform: `scale(${0.85 + 0.15 * p})`}}>
								<ArIcon name={bn.icon} size={110} color="#F0D48E" />
								<div style={{fontFamily: AF.display, fontWeight: 800, fontSize: 46, lineHeight: 1.25, color: C.white, textAlign: 'center'}}>{bn.t}</div>
							</div>
						);
					})
				: null}
		</AbsoluteFill>
	);
};
