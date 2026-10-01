import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, expoIn, expoInOut, expoOut, kf, lerp, ramp, rnd, smooth} from '../../theme';
import {DocPlace} from '../../components/Document';
import {ArChip, ArDoc, ArIcon, ArText, Win} from '../../coo-ar/kit';
import {AF} from '../../coo-ar/theme';
import {SIcon} from '../parts';
import {OLD, ST} from '../theme';

// ---------------------------------------------------------------------------
// Scene 8 — weeks collapse into a faster digital path
// ---------------------------------------------------------------------------
const SLOW = ['أسبوع', 'أسبوعان', 'أسابيع'];
const Faster: React.FC<{f: number}> = ({f}) => {
	const [a, b] = ST.faster;
	if (f < a - 4 || f > b + 6) return null;
	const o = ramp(f, a - 4, a + 10) * (1 - ramp(f, b - 14, b));
	const fall = (i: number) => ramp(f, 2096 + i * 5, 2134 + i * 5, 0, 1, expoIn);
	const squeeze = ramp(f, 2100, 2142, 0, 1, expoInOut);
	const barW = lerp(1500, 380, squeeze);
	return (
		<AbsoluteFill style={{opacity: o}}>
			{SLOW.map((w, i) => {
				const p = ramp(f, a + 10 + i * 16, a + 26 + i * 16, 0, 1, expoOut);
				const q = fall(i);
				if (q >= 1) return null;
				return (
					<div key={i} dir="rtl" style={{position: 'absolute', left: 0, right: 0, top: 120 + i * 150, textAlign: 'center', fontFamily: AF.display, fontWeight: 900, fontSize: 124, lineHeight: 1.2, color: '#FFE6C2', opacity: p * (1 - q), transform: `translateY(${(1 - p) * 30 + q * q * 420}px) rotate(${q * (i % 2 ? 14 : -11)}deg) scale(${1 - q * 0.3})`, filter: q > 0 ? `blur(${q * 10}px)` : undefined, textShadow: '0 0 30px rgba(224,164,88,0.35), 0 6px 30px rgba(0,0,0,0.9)'}}>
						{w}
					</div>
				);
			})}
			{/* the time bar compresses */}
			<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: ramp(f, a + 12, a + 30)}}>
				<rect x={960 - barW / 2} y={700} width={barW} height={18} rx={9} fill={squeeze > 0.5 ? C.cyan : OLD.amber} opacity={0.9} style={{filter: `drop-shadow(0 0 ${10 + squeeze * 16}px ${squeeze > 0.5 ? C.cyan : OLD.amber})`}} />
				{Array.from({length: 31}, (_, i) => {
					const x = 960 - barW / 2 + (i / 30) * barW;
					return <line key={i} x1={x} y1={i % 7 === 0 ? 670 : 684} x2={x} y2={736} stroke={squeeze > 0.5 ? '#BDF1FF' : '#FFE6C2'} strokeOpacity={(1 - squeeze) * 0.7} strokeWidth={i % 7 === 0 ? 3 : 1.5} />;
				})}
			</svg>
			{f >= 2128 ? (
				<div style={{position: 'absolute', left: 960 - 46, top: 610, opacity: ramp(f, 2134, 2146), transform: `scale(${0.6 + 0.4 * ramp(f, 2134, 2150, 0, 1, expoOut)})`}}>
					<SIcon name="bolt" size={92} color={C.gold} stroke={3} />
				</div>
			) : null}
			<Win frame={f} a={2128} b={b + 6} top={250} outF={16}>
				<ArText lines="إجراءات إلكترونية أسرع" frame={f} start={2132} size={132} weight={900} color={C.cyan} glow="cyan" maxW={1600} mode="scale" />
				<ArText lines="تقليل كبير للوقت والجهد" frame={f} start={2150} size={62} font={AF.body} weight={600} color="rgba(244,247,251,0.88)" glow="none" maxW={1600} style={{marginTop: 18}} />
			</Win>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------
// Scene 9 — the certificate is born · Scene 10 — trusted wherever it is checked
// ---------------------------------------------------------------------------
const DUST = Array.from({length: 140}, (_, i) => {
	const side = i % 4;
	const r = rnd(`cd${i}`);
	return {
		x: side === 0 ? -40 : side === 1 ? 1960 : r * 1920,
		y: side === 2 ? -40 : side === 3 ? 1120 : r * 1080,
		d: rnd(`ce${i}`) * 24,
		tx: (rnd(`cx${i}`) - 0.5) * 520,
		ty: (rnd(`cy${i}`) - 0.5) * 720,
	};
});
const FEATURES = [
	{t: 'توقيع رقمي', icon: 'check', at: 2300},
	{t: 'رقم تسلسلي', icon: 'doc', at: 2346},
	{t: 'رمز تحقق', icon: 'qr', at: 2360},
];
const NODES = [
	{t: 'الجمارك', icon: 'customs', x: 1500},
	{t: 'الجهات المصرفية', icon: 'bank', x: 960},
	{t: ['الجهات الحكومية', 'ذات العلاقة'], icon: 'gov', x: 420},
];

const Cert: React.FC<{f: number}> = ({f}) => {
	const [a] = ST.born;
	const [, b] = ST.trusted;
	if (f < a - 4 || f > b + 6) return null;
	const o = ramp(f, a - 4, a + 8) * (1 - ramp(f, b - 16, b));
	const move = ramp(f, 2490, 2534, 0, 1, expoInOut);
	const build = ramp(f, a + 16, a + 82, 0, 1, (t) => t);
	const docX = lerp(640, 960, move);
	const docY = lerp(540, 400, move);
	const docS = lerp(0.92, 0.42, move);
	const scan = ramp(f, 2402, 2430, 0, 1, smooth);
	const verified = ramp(f, 2430, 2446, 0, 1, expoOut);
	// QR on screen (doc-local 44,614 + 59 to its centre) while the doc is in its scene-9 place
	const qrX = 640 + (44 + 59 - 300) * 0.92;
	const qrY = 540 + (614 + 59 - 410) * 0.92;
	return (
		<AbsoluteFill style={{opacity: o}}>
			{/* data dust converges into the certificate */}
			{f < a + 70 ? (
				<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
					{DUST.map((d, i) => {
						const p = ramp(f, a - 4 + d.d, a + 34 + d.d, 0, 1, expoInOut);
						const x = lerp(d.x, 640 + d.tx, p);
						const y = lerp(d.y, 540 + d.ty, p);
						return <circle key={i} cx={x} cy={y} r={2.4} fill={i % 5 ? '#BDF1FF' : C.gold} opacity={(1 - ramp(f, a + 40 + d.d, a + 66)) * 0.9} style={{filter: `drop-shadow(0 0 4px ${C.cyan})`}} />;
					})}
				</svg>
			) : null}
			<div style={{position: 'absolute', left: docX - 420, top: docY - 420, width: 840, height: 840, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,216,255,0.16), rgba(79,216,255,0) 62%)', opacity: build}} />
			<DocPlace x={docX} y={docY} scale={docS} ry={kf(f, [[a, -14], [2380, 0], [2490, 0]], smooth)} rx={0} opacity={Math.min(1, build * 3)}>
				<ArDoc
					frame={f}
					build={build}
					glow={0.6 + verified * 0.4}
					gold={ramp(f, 2326, 2360)}
					signature={ramp(f, 2300, 2328, 0, 1, smooth)}
					seal={ramp(f, 2326, 2344, 0, 1, expoOut)}
					serial={ramp(f, 2346, 2380, 0, 1, (t) => t)}
					qr={ramp(f, 2360, 2398, 0, 1, (t) => t)}
					validated={verified}
					sheen={kf(f, [[2440, -0.5], [2484, 1.5]], smooth)}
				/>
			</DocPlace>
			{/* reading the QR */}
			{f >= 2396 && f < 2456 ? (
				<div style={{position: 'absolute', left: qrX - 82, top: qrY - 82, width: 164, height: 164, opacity: ramp(f, 2396, 2404) * (1 - ramp(f, 2444, 2456))}}>
					{[0, 1, 2, 3].map((k) => (
						<div key={k} style={{position: 'absolute', width: 34, height: 34, borderColor: C.cyan, borderStyle: 'solid', borderWidth: 0, ...(k === 0 ? {left: 0, top: 0, borderLeftWidth: 4, borderTopWidth: 4} : k === 1 ? {right: 0, top: 0, borderRightWidth: 4, borderTopWidth: 4} : k === 2 ? {left: 0, bottom: 0, borderLeftWidth: 4, borderBottomWidth: 4} : {right: 0, bottom: 0, borderRightWidth: 4, borderBottomWidth: 4})}} />
					))}
					<div style={{position: 'absolute', left: 6, right: 6, top: 8 + scan * 148, height: 3, background: '#DFF8FF', boxShadow: `0 0 18px 4px ${C.cyan}`}} />
				</div>
			) : null}
			{/* scene 9 — right column */}
			<Win frame={f} a={a + 14} b={2492} top={150} left={1140} width={700} outF={18}>
				<ArText lines="الشهادة تولد" frame={f} start={a + 18} size={96} weight={900} color="#F0D48E" glow="gold" maxW={680} />
				<div style={{height: 40}} />
				{FEATURES.map((ft, i) => {
					const p = ramp(f, ft.at, ft.at + 14, 0, 1, expoOut);
					return (
						<div key={i} dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 22, marginBottom: 26, opacity: p, transform: `translateX(${(1 - p) * 40}px)`}}>
							<div style={{width: 70, height: 70, borderRadius: '50%', border: `2px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(217,180,106,0.08)'}}>
								<ArIcon name={ft.icon} size={42} />
							</div>
							<div style={{fontFamily: AF.display, fontWeight: 800, fontSize: 50, color: C.white, lineHeight: 1.3}}>{ft.t}</div>
						</div>
					);
				})}
				<div style={{display: 'flex', justifyContent: 'center', marginTop: 34, height: 80}}>
					{verified > 0 ? <ArChip text="تم التصديق بنجاح" color={C.cyan} p={verified} frame={f} icon="check" size={48} /> : null}
				</div>
				<ArText lines="شهادة إلكترونية قابلة للتحقق" frame={f} start={2448} size={56} weight={800} maxW={680} style={{marginTop: 26}} />
			</Win>
			{/* scene 10 — trusted wherever it is presented */}
			<Win frame={f} a={2500} b={b} top={60} outF={16}>
				<ArText lines="وثيقة موثوقة يمكن التحقق منها" frame={f} start={2504} size={76} weight={900} maxW={1600} />
			</Win>
			{f >= 2530 ? (
				<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
					{NODES.map((n, i) => {
						const p0 = {x: 960, y: 580};
						const p1 = {x: n.x, y: 760};
						const c = {x: (p0.x + p1.x) / 2, y: 600};
						const d = `M${p0.x} ${p0.y} Q${c.x} ${c.y} ${p1.x} ${p1.y}`;
						const draw = ramp(f, 2536 + i * 8, 2576 + i * 8, 0, 1, smooth);
						const pt = ((f - 2580 - i * 7) % 36) / 36;
						const u = 1 - pt;
						const px = u * u * p0.x + 2 * u * pt * c.x + pt * pt * p1.x;
						const py = u * u * p0.y + 2 * u * pt * c.y + pt * pt * p1.y;
						return (
							<g key={i}>
								<path d={d} fill="none" stroke={C.cyan} strokeOpacity={0.6} strokeWidth={3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
								{f > 2580 + i * 7 ? <circle cx={px} cy={py} r={6} fill="#E6FBFF" opacity={Math.sin(pt * Math.PI)} style={{filter: `drop-shadow(0 0 8px ${C.cyan})`}} /> : null}
							</g>
						);
					})}
				</svg>
			) : null}
			{NODES.map((n, i) => {
				const p = ramp(f, 2556 + i * 10, 2576 + i * 10, 0, 1, expoOut);
				const ok = ramp(f, 2606 + i * 12, 2620 + i * 12, 0, 1, expoOut);
				if (p <= 0) return null;
				return (
					<div key={i} style={{position: 'absolute', left: n.x - 200, width: 400, top: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
						<div style={{position: 'relative', width: 128, height: 128, borderRadius: '50%', border: `3px solid ${ok > 0 ? C.cyan : C.gold}`, background: 'rgba(6,18,38,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 ${20 + ok * 30}px rgba(79,216,255,${0.2 + ok * 0.4})`}}>
							<SIcon name={n.icon} size={72} color={C.gold} />
							{ok > 0 ? (
								<div style={{position: 'absolute', right: -10, top: -10, width: 50, height: 50, borderRadius: '50%', background: C.cyan, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${ok})`}}>
									<ArIcon name="check" size={34} color="#061226" stroke={5} />
								</div>
							) : null}
						</div>
						<ArText lines={n.t} frame={f} start={2560 + i * 10} size={44} weight={800} maxW={400} lineHeight={1.3} style={{marginTop: 18}} />
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

export const SCert: React.FC<{frame: number}> = ({frame: f}) => (
	<>
		<Faster f={f} />
		<Cert f={f} />
	</>
);
