import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, expoIn, expoInOut, expoOut, kf, lerp, ramp, smooth} from '../../theme';
import {DOC_H, DOC_W, DocPlace} from '../../components/Document';
import {PortalStation, SecureCore, TraderEmblem, ReceiptCard, Packet} from '../../portrait/ui';
import {ArChip, ArDoc, ArIcon, ArText, Rail, StepHeader, Win, useLand} from '../kit';
import {AF, AT, STEPS} from '../theme';

/** Platform workflow (1020–2400f): overview chart, then the six steps with one continuous certificate. */
const ICON_OF = ['trader', 'doc', 'eye', 'coin', 'seal', 'qr'];

// ---------------------------------------------------------------------------
// Overview chart
// ---------------------------------------------------------------------------
const OverviewLand: React.FC<{f: number}> = ({f}) => {
	const [a, b] = AT.overview;
	const out = ramp(f, b - 16, b, 0, 1, expoIn);
	const line = ramp(f, a + 20, a + 80, 0, 1, (t) => t);
	const x0 = 1685;
	const dx = 290;
	const y = 560;
	return (
		<AbsoluteFill style={{opacity: 1 - out, transform: `scale(${1 - out * 0.06})`}}>
			<Win frame={f} a={a} b={b} top={80} outF={1}>
				<ArText lines="مخطط عمل المنصة" frame={f} start={a + 4} size={112} weight={900} color="#F0D48E" glow="gold" maxW={1500} />
				<ArText lines="ست مراحل من الطلب إلى الشهادة المصدّقة" frame={f} start={a + 14} size={50} font={AF.body} weight={600} color="rgba(244,247,251,0.85)" glow="none" stagger={2} maxW={1500} style={{marginTop: 6}} />
			</Win>
			<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
				<line x1={x0} y1={y} x2={x0 - dx * 5 * line} y2={y} stroke={C.gold} strokeWidth={4} strokeOpacity={0.7} />
			</svg>
			{STEPS.map((st, i) => {
				const p = ramp(f, a + 24 + i * 11, a + 40 + i * 11, 0, 1, expoOut);
				const x = x0 - i * dx;
				return (
					<div key={i} style={{position: 'absolute', left: x - 140, width: 280, top: y - 170, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
						<ArIcon name={ICON_OF[i]} size={70} color={C.cyan} />
						<div style={{marginTop: 20, width: 120, height: 120, borderRadius: '50%', background: C.gold, color: '#061226', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: AF.display, fontWeight: 900, fontSize: 64, boxShadow: '0 0 30px rgba(217,180,106,0.45)'}}>{st.n}</div>
						<div dir="rtl" style={{marginTop: 22, fontFamily: AF.display, fontWeight: 800, fontSize: 44, lineHeight: 1.3, color: C.white, textAlign: 'center', textShadow: '0 4px 20px rgba(0,0,0,0.9)'}}>{st.title}</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

const Overview: React.FC<{f: number}> = ({f}) => {
	const [a, b] = AT.overview;
	const land = useLand();
	if (f < a - 4 || f >= b) return null;
	if (land) return <OverviewLand f={f} />;
	const out = ramp(f, b - 16, b, 0, 1, expoIn);
	const line = ramp(f, a + 20, a + 80, 0, 1, (t) => t);
	const y0 = 540;
	const dy = 172;
	return (
		<AbsoluteFill style={{opacity: 1 - out, transform: `scale(${1 - out * 0.06})`}}>
			<Win frame={f} a={a} b={b} top={170} outF={1}>
				<ArText lines="مخطط عمل المنصة" frame={f} start={a + 4} size={120} weight={900} color="#F0D48E" glow="gold" />
				<ArText lines="ست مراحل من الطلب إلى الشهادة المصدّقة" frame={f} start={a + 14} size={50} font={AF.body} weight={600} color="rgba(244,247,251,0.85)" glow="none" stagger={2} style={{marginTop: 6}} />
			</Win>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<line x1={880} y1={y0} x2={880} y2={y0 + dy * 5 * line} stroke={C.gold} strokeWidth={4} strokeOpacity={0.7} />
			</svg>
			{STEPS.map((s, i) => {
				const p = ramp(f, a + 24 + i * 11, a + 40 + i * 11, 0, 1, expoOut);
				const y = y0 + i * dy;
				return (
					<div key={i} dir="rtl" style={{position: 'absolute', right: 1080 - 940, left: 120, top: y - 60, height: 120, display: 'flex', alignItems: 'center', gap: 30, opacity: p, transform: `translateX(${(1 - p) * -60}px)`}}>
						<div style={{width: 120, height: 120, borderRadius: '50%', background: C.gold, color: '#061226', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: AF.display, fontWeight: 900, fontSize: 64, flexShrink: 0, boxShadow: '0 0 30px rgba(217,180,106,0.45)'}}>{s.n}</div>
						<div style={{flex: 1, minWidth: 0, fontFamily: AF.display, fontWeight: 800, fontSize: 52, color: C.white, whiteSpace: 'nowrap', textShadow: '0 4px 20px rgba(0,0,0,0.9)'}}>{s.title}</div>
						<ArIcon name={ICON_OF[i]} size={70} color={C.cyan} />
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------
// The certificate from step 2 to step 6 is ONE object
// ---------------------------------------------------------------------------
const J0 = 1400;
const J1 = 2400;
const pose = (f: number, land = false) => ({
	x: land ? 520 : 540,
	y: (land ? kf(f, [[1400, 540], [1760, 540], [1790, 470], [1960, 470], [1995, 540], [2400, 540]], expoInOut) : kf(f, [[1400, 1140], [1760, 1120], [1790, 1010], [1960, 1010], [1995, 1100], [2400, 1100]], expoInOut)) + Math.sin(f / 26) * 4,
	s: land
		? kf(f, [[1400, 0.7], [1420, 0.9], [1760, 0.9], [1790, 0.5], [1960, 0.5], [1995, 1.0], [2400, 1.0]], expoInOut)
		: kf(f, [[1400, 0.6], [1420, 0.78], [1760, 0.78], [1790, 0.5], [1960, 0.5], [1995, 0.95], [2400, 0.95]], expoInOut),
	o: kf(f, [[1400, 0], [1416, 1], [1774, 1], [1796, 0.14], [1956, 0.14], [1990, 1], [2384, 1], [2400, 0]], smooth),
	ry: kf(f, [[1400, -14], [1430, -4], [1760, 4], [1995, -6], [2200, 4], [2400, -4]], smooth),
});
const docPt = (f: number, u: number, v: number, land: boolean) => {
	const p = pose(f, land);
	return {x: p.x + (u - DOC_W / 2) * p.s, y: p.y + (v - DOC_H / 2) * p.s};
};

const Journey: React.FC<{f: number}> = ({f}) => {
	const land = useLand();
	if (f < J0 || f > J1) return null;
	const p = pose(f, land);
	const lens = ramp(f, 1600, 1660, 0, 1, smooth);
	const shock = ramp(f, 2080, 2108, 0, 1, (t) => t);
	const sealPt = docPt(f, 254, 664, land);
	const qrPt = docPt(f, 103, 673, land);
	const verify = ramp(f, 2290, 2304, 0, 1, expoOut);
	return (
		<AbsoluteFill>
			<DocPlace x={p.x} y={p.y} scale={p.s} ry={p.ry} rx={4} opacity={p.o}>
				<ArDoc
					frame={f}
					glow={0.5}
					scan={f >= 1420 && f <= 1500 ? ramp(f, 1420, 1500, 0, 1, smooth) : -1}
					gold={kf(f, [[1640, 0], [1690, 0.5], [1990, 0.5], [2020, 1]])}
					review={ramp(f, 1662, 1690, 0, 1, (t) => t)}
					signature={ramp(f, 2020, 2068, 0, 1, smooth)}
					seal={ramp(f, 2074, 2088, 0, 1, expoOut)}
					qr={ramp(f, 2196, 2232, 0, 1, (t) => t)}
					serial={ramp(f, 2200, 2240, 0, 1, (t) => t)}
					validated={ramp(f, 2214, 2228, 0, 1, expoOut)}
					sheen={kf(f, [[2240, -0.5], [2290, 1.5]], smooth)}
				/>
				{lens > 0 && lens < 1 ? <div style={{position: 'absolute', left: 26, right: 26, top: 140 + lens * 540, height: 100, borderRadius: 10, border: `2.5px solid ${C.gold}`, background: 'rgba(217,180,106,0.08)', boxShadow: '0 0 30px rgba(217,180,106,0.4)', opacity: Math.sin(lens * Math.PI) * 1.4}} /> : null}
			</DocPlace>
			<svg width={land ? 1920 : 1080} height={land ? 1080 : 1920} style={{position: 'absolute', inset: 0}}>
				{shock > 0 && shock < 1 ? <circle cx={sealPt.x} cy={sealPt.y} r={60 + shock * 260} fill="none" stroke={C.gold} strokeOpacity={(1 - shock) * 0.9} strokeWidth={3 * (1 - shock) + 0.5} /> : null}
				{verify > 0 && f < 2392
					? [
							[-1, -1],
							[1, -1],
							[-1, 1],
							[1, 1],
						].map(([sx, sy], i) => {
							const r = 95 + 10 * Math.sin(f / 5);
							const x = qrPt.x + sx * r;
							const y = qrPt.y + sy * r;
							return <path key={i} d={`M${x} ${y - sy * 34} V${y} H${x - sx * 34}`} fill="none" stroke={C.cyan} strokeWidth={5} opacity={verify} style={{filter: `drop-shadow(0 0 8px ${C.cyan})`}} />;
						})
					: null}
			</svg>
		</AbsoluteFill>
	);
};

const ChipAt: React.FC<{f: number; a: number; b: number; y: number; text: string; color: string; icon?: string}> = ({f, a, b, y, text, color, icon}) => {
	const land = useLand();
	const p = ramp(f, a, a + 12, 0, 1, expoOut) * (1 - ramp(f, b - 10, b));
	if (p <= 0) return null;
	return (
		<div style={{position: 'absolute', ...(land ? {left: 1000, width: 820} : {left: 0, right: 0}), top: land ? 680 : y, display: 'flex', justifyContent: 'center'}}>
			<ArChip text={text} color={color} p={p} frame={f} icon={icon} />
		</div>
	);
};

// ---------------------------------------------------------------------------
// Step 1 — submission
// ---------------------------------------------------------------------------
const Step1: React.FC<{f: number}> = ({f}) => {
	const [a, b] = AT.step1;
	const land = useLand();
	if (f < a || f >= b) return null;
	const X = land ? 520 : 540;
	const PY = land ? 330 : 820;
	const TY = land ? 830 : 1400;
	const DY0 = land ? 760 : 1330;
	const out = ramp(f, b - 16, b);
	const enter = ramp(f, a + 6, a + 30, 0, 1, expoOut);
	const rise = (d: number) => ramp(f, 1244 + d, 1300 + d, 0, 1, expoInOut);
	const absorbed = (d: number) => ramp(f, 1296 + d, 1310 + d);
	const pulses = [ramp(f, 1300, 1330), ramp(f, 1308, 1338), ramp(f, 1350, 1380)];
	const fee = ramp(f, 1318, 1350, 0, 1, expoInOut);
	const feePt = {x: X, y: lerp(DY0, PY - 20, fee)};
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<PortalStation x={X} y={PY} f={f} enter={enter} pulses={pulses} />
			<TraderEmblem x={X} y={TY} f={f} enter={enter} scale={land ? 0.8 : 0.9} pulse={ramp(f, 1236, 1250) * (1 - ramp(f, 1250, 1270))} />
			{[
				{variant: 'coo' as const, dx: 90, d: 0},
				{variant: 'invoice' as const, dx: -90, d: 8},
			].map((d, i) => {
				const r = rise(d.d);
				const ab = absorbed(d.d);
				if (ab >= 1 || f < 1236) return null;
				return (
					<DocPlace key={i} x={X + d.dx * (1 - r)} y={lerp(DY0, PY + 10, r)} scale={lerp(0.36, 0.2, r) * (1 - ab * 0.6)} ry={i ? 8 : -8} opacity={ramp(f, 1236 + d.d, 1250 + d.d) * (1 - ab)}>
						<ArDoc frame={f} variant={d.variant} build={1} glow={0.8} />
					</DocPlace>
				);
			})}
			{fee > 0 && fee < 1 ? (
				<svg width={land ? 1920 : 1080} height={land ? 1080 : 1920} style={{position: 'absolute', inset: 0}}>
					<Packet x={feePt.x} y={feePt.y} trail={Array.from({length: 8}, (_, k) => ({x: X, y: lerp(DY0, PY - 20, Math.max(0, fee - k * 0.03))}))} color={C.cyan} />
				</svg>
			) : null}
			<ChipAt f={f} a={1322} b={b} y={1120} text="رسم الخدمة الرقمية" color={C.cyan} icon="coin" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------
// Step 4 — sovereign fee (the certificate waits, dimmed, behind the core)
// ---------------------------------------------------------------------------
const FEE_ITEMS = [
	{t: 'إشعار بالرسم السيادي', icon: 'doc', at: 1792},
	{t: 'دفع التاجر للرسم', icon: 'coin', at: 1830},
	{t: 'رفع إيصال الدفع', icon: 'paperStack', at: 1868},
	{t: 'تأكيد المحاسب', icon: 'check', at: 1910},
];
const Step4: React.FC<{f: number}> = ({f}) => {
	const [a, b] = AT.step4;
	const land = useLand();
	if (f < a || f >= b) return null;
	const X = land ? 520 : 540;
	const Y = land ? 470 : 960;
	const out = ramp(f, b - 18, b);
	const scale = ramp(f, a + 4, a + 30, 0, 1, expoOut) * (land ? 0.8 : 0.86);
	const lit = FEE_ITEMS.reduce((s, it) => s + ramp(f, it.at, it.at + 10), 0) / 4;
	const close = ramp(f, 1920, 1934, 0, 1, expoOut);
	const receipt = ramp(f, 1872, 1904, 0, 1, expoInOut);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<SecureCore x={X} y={Y} f={f} scale={scale} close={close} energy={lit} lit={lit} hit={ramp(f, 1904, 1924)} burst={ramp(f, 1934, 1962)} />
			{receipt > 0 && receipt < 1 ? (
				<div style={{position: 'absolute', left: lerp(land ? 880 : 900, X, receipt) - 75, top: lerp(land ? 900 : 1500, Y, receipt) - 94, transform: `scale(${1 - receipt * 0.6}) rotate(${(1 - receipt) * 14}deg)`, opacity: 1 - ramp(receipt, 0.8, 1)}}>
					<ReceiptCard w={150} />
				</div>
			) : null}
			<div dir="rtl" style={{position: 'absolute', ...(land ? {left: 1040, width: 740, top: 530} : {left: 150, right: 150, top: 1260}), display: 'flex', flexDirection: 'column', gap: 14}}>
				{FEE_ITEMS.map((it, i) => {
					const p = ramp(f, it.at, it.at + 12, 0, 1, expoOut);
					const done = i === 3 ? close : ramp(f, FEE_ITEMS[i + 1].at, FEE_ITEMS[i + 1].at + 8);
					return (
						<div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, height: 74, padding: '0 26px', borderRadius: 18, border: `2px solid ${p > 0 ? C.gold : 'rgba(244,247,251,0.18)'}`, background: `rgba(217,180,106,${0.04 + 0.1 * p})`, opacity: 0.35 + 0.65 * p, transform: `translateX(${(1 - p) * -30}px)`}}>
							<div style={{width: 50, height: 50, borderRadius: '50%', background: p > 0 ? C.gold : 'transparent', border: `2px solid ${C.gold}`, color: '#061226', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: AF.display, fontWeight: 900, fontSize: 30, flexShrink: 0}}>{['١', '٢', '٣', '٤'][i]}</div>
							<div style={{flex: 1, fontFamily: AF.display, fontWeight: 800, fontSize: 46, color: C.white, whiteSpace: 'nowrap'}}>{it.t}</div>
							<ArIcon name={done > 0.5 ? 'check' : it.icon} size={48} color={done > 0.5 ? C.cyan : C.gold} stroke={3} />
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------
export const A3Flow: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < AT.overview[0] - 4 || f > AT.step6[1] + 2) return null;
	const cur = f < AT.step2[0] ? 0 : f < AT.step3[0] ? 1 : f < AT.step4[0] ? 2 : f < AT.step5[0] ? 3 : f < AT.step6[0] ? 4 : 5;
	return (
		<AbsoluteFill>
			<Overview f={f} />
			<Step1 f={f} />
			<Step4 f={f} />
			<Journey f={f} />
			{/* chips per step */}
			<ChipAt f={f} a={1412} b={1500} y={1520} text="قيد التدقيق" color={C.white} />
			<ChipAt f={f} a={1504} b={AT.step2[1]} y={1520} text="المستندات مكتملة" color={C.cyan} icon="check" />
			<ChipAt f={f} a={1694} b={AT.step3[1]} y={1520} text="مؤهلة للتصديق" color={C.gold} icon="check" />
			<ChipAt f={f} a={2094} b={AT.step5[1]} y={1520} text="تم التصديق" color={C.gold} icon="seal" />
			<ChipAt f={f} a={2300} b={2392} y={1520} text="شهادة صحيحة وموثّقة" color={C.cyan} icon="check" />
			{/* headers */}
			<StepHeader frame={f} a={AT.step1[0]} b={AT.step1[1]} i={0} lines={['يرفع التاجر شهادة المنشأ والفاتورة التجارية', 'ويسدد رسم الخدمة الرقمية']} />
			<StepHeader frame={f} a={AT.step2[0]} b={AT.step2[1]} i={1} lines={['يراجع المدقق المستندات المرفوعة', 'ويتأكد من اكتمالها وصحة بياناتها']} />
			<StepHeader frame={f} a={AT.step3[0]} b={AT.step3[1]} i={2} lines={['التحقق من استيفاء متطلبات التصديق', 'دون توقيع أو ختم في هذه المرحلة']} />
			<StepHeader frame={f} a={AT.step4[0]} b={AT.step4[1]} i={3} lines={['يُستوفى بعد مراجعة الملحق التجاري', 'وقبل التصديق']} />
			<StepHeader frame={f} a={AT.step5[0]} b={AT.step5[1]} i={4} lines={['توقيع الملحق التجاري وختمه الرسمي', 'بعد تأكيد استيفاء الرسم']} />
			<StepHeader frame={f} a={AT.step6[0]} b={AT.step6[1]} i={5} lines={['شهادة مصدّقة برقم تسلسلي ورمز QR', 'يمكن التحقق من صحتها في أي وقت']} />
			<Rail frame={f} current={cur} a={AT.step1[0]} b={AT.step6[1]} />
		</AbsoluteFill>
	);
};
