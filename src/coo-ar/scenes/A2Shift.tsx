import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, expoIn, expoOut, lerp, ramp, rnd, smooth} from '../../theme';
import {DocPlace} from '../../components/Document';
import {ArDoc, ArText, Win, useLand} from '../kit';

/** From paper to one digital platform (780–1020f). */
const SHEETS = Array.from({length: 11}, (_, i) => ({
	x: 160 + rnd(`sx${i}`) * 760,
	y: 700 + rnd(`sy${i}`) * 820,
	r: (rnd(`sr${i}`) - 0.5) * 40,
	d: rnd(`sd${i}`) * 12,
	s: 0.8 + rnd(`ss${i}`) * 0.5,
}));

export const A2Shift: React.FC<{frame: number}> = ({frame: f}) => {
	const land = useLand();
	// sheets are laid out on a unit field, then mapped to the format's stage
	const map = (sx: number, sy: number) => (land ? {x: 200 + ((sx - 160) / 760) * 1520, y: 470 + ((sy - 700) / 820) * 420} : {x: sx, y: sy});
	const C0 = land ? {x: 960, y: 660} : {x: 540, y: 1100};
	const docS = land ? 0.6 : 0.78;
	if (f < 776 || f > 1030) return null;
	const pull = (d: number) => ramp(f, 884 + d, 920 + d, 0, 1, expoIn);
	const doc = ramp(f, 912, 962, 0, 1, (t) => t);
	const docOut = ramp(f, 1000, 1024, 0, 1, expoIn);
	return (
		<AbsoluteFill>
			{SHEETS.map((s, i) => {
				const inP = ramp(f, 780 + s.d, 800 + s.d, 0, 1, expoOut);
				const p = pull(s.d * 0.6);
				if (p >= 1 || inP <= 0) return null;
				const q = map(s.x, s.y);
				const x = lerp(q.x, C0.x, p);
				const y = lerp(q.y + Math.sin((f + i * 20) / 18) * 12, C0.y, p);
				return (
					<div key={i} style={{position: 'absolute', left: x - 110, top: y - 150, width: 220, height: 300, borderRadius: 6, background: 'linear-gradient(170deg, rgba(236,232,220,0.9), rgba(196,190,175,0.85))', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', transform: `rotate(${s.r * (1 - p) + (f - 780) * 0.05 * (i % 2 ? 1 : -1)}deg) scale(${s.s * (land ? 0.8 : 1) * (1 - p * 0.8)})`, opacity: inP * (1 - p), padding: 24, boxSizing: 'border-box'}}>
						{[0.8, 0.6, 0.7, 0.5, 0.65, 0.4].map((w, k) => (
							<div key={k} style={{height: 8, width: `${w * 100}%`, marginLeft: 'auto', borderRadius: 4, background: 'rgba(40,40,40,0.35)', marginBottom: 18}} />
						))}
						<div style={{position: 'absolute', left: 22, bottom: 24, width: 64, height: 64, borderRadius: '50%', border: '3px solid rgba(150,40,40,0.45)'}} />
					</div>
				);
			})}
			{f >= 900 ? (
				<>
					<div style={{position: 'absolute', left: C0.x - 420, top: C0.y - 420, width: 840, height: 840, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,216,255,0.2), rgba(79,216,255,0) 62%)', opacity: doc * (1 - docOut)}} />
					<DocPlace x={C0.x} y={lerp(C0.y, C0.y - (land ? 200 : 400), docOut)} scale={docS * (1 - docOut * 0.6)} ry={lerp(-12, 4, ramp(f, 912, 1000, 0, 1, smooth))} rx={5} opacity={Math.min(1, doc * 3) * (1 - docOut)}>
						<ArDoc frame={f} build={doc} glow={0.8} />
					</DocPlace>
				</>
			) : null}
			<Win frame={f} a={784} b={900} top={land ? 70 : 220} outF={14}>
				<ArText lines="من المعاملة الورقية" frame={f} start={788} size={112} weight={900} />
				<ArText lines="مراجعات متعددة ووقت وجهد أطول" frame={f} start={800} size={54} font='"IBM Plex Sans Arabic", sans-serif' weight={600} color="rgba(244,247,251,0.8)" glow="none" stagger={2} style={{marginTop: 14}} />
			</Win>
			<Win frame={f} a={904} b={1022} top={land ? 70 : 220} outF={14}>
				<ArText lines="إلى منصة رقمية موحدة" frame={f} start={906} size={108} weight={900} color={C.cyan} glow="cyan" />
				<ArText lines="طلب إلكتروني · متابعة الحالة · شهادة موثقة" frame={f} start={918} size={50} font='"IBM Plex Sans Arabic", sans-serif' weight={600} color="rgba(244,247,251,0.86)" glow="none" stagger={2} style={{marginTop: 14}} />
			</Win>
		</AbsoluteFill>
	);
};
