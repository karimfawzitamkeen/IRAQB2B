import React from 'react';
import {AbsoluteFill} from 'remotion';
import {backOut, expoIn, expoOut, lerp, ramp} from '../../theme';
import {Beat, Head, SERVICES, Scrim, ServiceCard} from '../kit';
import {P, PCX} from '../theme';

/** Scene 6 — Services & support (405–510f): each service slams in under its own headline and locks into the stack. */
const T0 = 425;
const LEN = 21;
const Y0 = 620;
const GAP = 200;

export const S6Services: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 400 || f > 520) return null;
	const exit = ramp(f, 502, 512, 0, 1, expoIn);
	const slotsIn = ramp(f, 408, 422, 0, 1, expoOut);
	return (
		<AbsoluteFill style={{opacity: 1 - exit, transform: `scale(${1 - exit * 0.25})`, transformOrigin: '540px 1000px'}}>
			{/* empty service slots draw in */}
			{SERVICES.map((_, i) => (
				<div key={`s${i}`} style={{position: 'absolute', left: PCX - 410, top: Y0 + i * GAP, width: 820, height: 180, borderRadius: 30, border: '3px dashed rgba(212,166,41,0.45)', boxSizing: 'border-box', opacity: slotsIn * (1 - ramp(f, T0 + i * LEN, T0 + i * LEN + 6)), transform: `scaleX(${slotsIn})`}} />
			))}
			{SERVICES.map((s, i) => {
				const t = T0 + i * LEN;
				const p = ramp(f, t, t + 10, 0, 1, backOut);
				if (p <= 0) return null;
				const press = ramp(f, t + 9, t + 13) * (1 - ramp(f, t + 13, t + 20));
				const active = f < t + LEN || i === SERVICES.length - 1;
				return (
					<div key={i} style={{position: 'absolute', left: PCX - 410, top: Y0 + i * GAP, transform: `translateX(${(1 - Math.min(1, p)) * (i % 2 ? -1100 : 1100)}px) scale(${lerp(1.25, 1, Math.min(1, p))})`, opacity: active ? 1 : 0.62, filter: active ? `drop-shadow(0 0 ${24 * ramp(f, t + 8, t + 12)}px rgba(212,166,41,0.7))` : undefined}}>
						<ServiceCard s={s} w={820} press={press} />
					</div>
				);
			})}
			<Scrim top={140} h={420} />
			<Beat frame={f} a={405} b={T0} top={230}>
				<Head text="خدمات ودعم" frame={f} start={405} size={140} mode="slam" stagger={4} dur={8} color={P.gold} glow="gold" />
			</Beat>
			<Beat frame={f} a={T0} b={T0 + LEN} top={240}>
				<Head text="مستندات التصدير" frame={f} start={T0} size={116} mode="rise" stagger={3} dur={8} />
			</Beat>
			<Beat frame={f} a={T0 + LEN} b={T0 + 2 * LEN} top={240}>
				<Head text="شهادة المنشأ" frame={f} start={T0 + LEN} size={128} mode="rise" stagger={3} dur={8} color={P.gold} glow="gold" />
			</Beat>
			<Beat frame={f} a={T0 + 2 * LEN} b={T0 + 3 * LEN} top={190}>
				<Head text="استشارات قانونية" frame={f} start={T0 + 2 * LEN} size={108} mode="rise" stagger={3} dur={8} />
				<Head text="وتجارية" frame={f} start={T0 + 2 * LEN + 4} size={108} mode="rise" dur={8} color={P.gold} glow="gold" />
			</Beat>
			<Beat frame={f} a={T0 + 3 * LEN} b={507} top={190}>
				<Head text="استشارات" frame={f} start={T0 + 3 * LEN} size={108} mode="rise" dur={8} />
				<Head text="نمو الأعمال" frame={f} start={T0 + 3 * LEN + 4} size={108} mode="rise" stagger={3} dur={8} color={P.gold} glow="gold" />
			</Beat>
		</AbsoluteFill>
	);
};
