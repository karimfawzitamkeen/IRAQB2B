import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, expoOut, ramp} from '../../theme';
import {ArText, GoldRule, Scrim, Win} from '../../coo-ar/kit';
import {AF} from '../../coo-ar/theme';
import {Routes} from '../parts';
import {OLD, ST} from '../theme';

/** Scene 1 — the world of trade never stops: papers ride routes out of Iraq; the daily count. */
export const SWorld: React.FC<{frame: number}> = ({frame: f}) => {
	if (f > ST.world[1] + 10) return null;
	const n = Math.round(ramp(f, 62, 128, 0, 1000, expoOut));
	const routesO = 1 - ramp(f, 168, 200);
	return (
		<AbsoluteFill>
			<Routes frame={f} mode="paper" start={30} o={routesO} />
			<Win frame={f} a={44} b={196} top={250} left={1060} width={780} outF={20} exit="zoom">
				<ArText lines="أكثر من" frame={f} start={50} size={64} font={AF.body} weight={600} color="rgba(244,247,251,0.85)" glow="none" maxW={740} />
				<div style={{fontFamily: AF.display, fontWeight: 900, fontSize: 210, lineHeight: 1.1, color: '#F0D48E', textAlign: 'center', direction: 'ltr', textShadow: '0 0 30px rgba(217,180,106,0.5), 0 6px 30px rgba(0,0,0,0.9)', opacity: ramp(f, 58, 70)}}>
					{n.toLocaleString('en-US')}
				</div>
				<ArText lines="معاملة يومياً" frame={f} start={92} size={100} weight={900} maxW={740} />
				<div style={{position: 'relative', height: 40}}>
					<GoldRule p={ramp(f, 112, 136, 0, 1, expoOut)} w={420} top={18} cx={390} />
				</div>
				<ArText lines="لتجار عراقيين حول العالم" frame={f} start={122} size={62} font={AF.body} weight={600} color={OLD.amber} glow="none" maxW={740} />
			</Win>
			{/* the dive into one transaction */}
			{f > 170 ? <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at 960px 540px, rgba(255,236,200,${0.5 * ramp(f, 184, 204) * (1 - ramp(f, 206, 222))}), rgba(0,0,0,0) 45%)`}} /> : null}
		</AbsoluteFill>
	);
};

/** Scene 12 — the bigger meaning: back to the globe, now with digital routes and the attachés. */
export const SMeaning: React.FC<{frame: number}> = ({frame: f}) => {
	const [a, b] = ST.meaning;
	if (f < a - 10 || f > b + 30) return null;
	const o = ramp(f, a, a + 30) * (1 - ramp(f, b - 8, b + 24));
	return (
		<AbsoluteFill style={{opacity: o}}>
			<Routes frame={f} mode="digital" start={a + 16} o={1} />
			<Scrim top={0} h={300} o={0.9} />
			<Win frame={f} a={a + 14} b={a + 112} top={92} outF={14}>
				<ArText lines="لأن التحول الرقمي لا يعني فقط" frame={f} start={a + 18} size={70} weight={800} maxW={1500} />
				<ArText lines="تحويل الورقة إلى شاشة..." frame={f} start={a + 32} size={70} weight={800} color="rgba(244,247,251,0.75)" glow="none" maxW={1500} />
			</Win>
			<Win frame={f} a={a + 116} b={b + 30} top={92} outF={20}>
				<ArText lines="بل أن تنتقل الخدمة إلى المتعامل" frame={f} start={a + 120} size={80} weight={900} maxW={1500} />
				<ArText lines="أينما كان" frame={f} start={a + 138} size={96} weight={900} color="#F0D48E" glow="gold" stagger={6} dur={20} maxW={1500} />
			</Win>
			{/* legend: gold rings are the commercial attachés */}
			<div dir="rtl" style={{position: 'absolute', right: 120, bottom: 120, display: 'flex', alignItems: 'center', gap: 14, opacity: ramp(f, a + 60, a + 80), fontFamily: AF.body, fontWeight: 600, fontSize: 34, color: 'rgba(244,247,251,0.85)'}}>
				<svg width={30} height={30} viewBox="-15 -15 30 30">
					<circle r={11} fill="none" stroke={C.gold} strokeWidth={2.4} />
					<circle r={4} fill={C.gold} />
				</svg>
				الملحقيات التجارية
			</div>
		</AbsoluteFill>
	);
};
