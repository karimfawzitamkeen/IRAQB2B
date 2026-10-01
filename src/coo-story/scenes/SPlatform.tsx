import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, expoIn, expoInOut, expoOut, lerp, ramp, rnd, smooth} from '../../theme';
import {ArChip, ArDoc, ArIcon, ArText, Ornament, Win} from '../../coo-ar/kit';
import {AF} from '../../coo-ar/theme';
import {DOC_H, DOC_W} from '../../components/Document';
import {Paper, SIcon} from '../parts';
import {OLD, ST} from '../theme';

const TXN = 'IQ-COO-2026-0847';

// ---------------------------------------------------------------------------
// Shared platform UI
// ---------------------------------------------------------------------------
type RowState = 'idle' | 'ok' | 'need';
const DocRow: React.FC<{label: string; prog: number; state: RowState; frame: number; w: number; o?: number; hi?: number}> = ({label, prog, state, frame, w, o = 1, hi = 0}) => {
	const col = state === 'need' ? OLD.amber : state === 'ok' ? C.cyan : 'rgba(244,247,251,0.35)';
	return (
		<div dir="rtl" style={{width: w, height: 76, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 22, padding: '0 26px', borderRadius: 14, border: `2px solid ${state === 'need' ? `rgba(224,164,88,${0.5 + 0.5 * hi})` : 'rgba(244,247,251,0.12)'}`, background: state === 'need' ? `rgba(224,164,88,${0.08 + 0.1 * hi})` : 'rgba(255,255,255,0.04)', opacity: o, boxShadow: state === 'need' ? `0 0 ${30 * hi}px rgba(224,164,88,0.6)` : undefined}}>
			<ArIcon name="doc" size={42} color={state === 'need' ? OLD.amber : C.gold} />
			<div style={{fontFamily: AF.display, fontWeight: 700, fontSize: 32, color: C.white, whiteSpace: 'nowrap', width: w * 0.36}}>{label}</div>
			<div style={{flex: 1, height: 8, borderRadius: 4, background: 'rgba(244,247,251,0.1)', overflow: 'hidden', display: 'flex', justifyContent: 'flex-start'}}>
				<div style={{width: `${prog * 100}%`, height: '100%', background: state === 'need' ? OLD.amber : `linear-gradient(270deg, ${C.cyan}, ${C.gold})`}} />
			</div>
			<div style={{width: 44, height: 44, borderRadius: '50%', border: `2px solid ${col}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: state === 'ok' ? 'rgba(79,216,255,0.15)' : undefined}}>
				{state === 'ok' ? <ArIcon name="check" size={30} color={C.cyan} stroke={4} /> : state === 'need' ? <div style={{fontFamily: AF.display, fontWeight: 900, fontSize: 30, color: OLD.amber, opacity: 0.6 + 0.4 * Math.sin(frame / 4)}}>!</div> : null}
			</div>
		</div>
	);
};

const Glass: React.FC<{x: number; y: number; w: number; h: number; o: number; children?: React.ReactNode; glow?: number}> = ({x, y, w, h, o, children, glow = 0.3}) => (
	<div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: 26, opacity: o, overflow: 'hidden', border: '2px solid rgba(79,216,255,0.55)', background: 'linear-gradient(200deg, rgba(14,36,66,0.92), rgba(5,14,30,0.95))', boxShadow: `0 40px 120px rgba(0,0,0,0.6), 0 0 ${80 * glow}px rgba(79,216,255,${0.35 * glow})`}}>
		<svg width={w} height={h} style={{position: 'absolute', inset: 0, opacity: 0.25}}>
			{Array.from({length: Math.ceil(w / 60)}, (_, i) => <line key={`v${i}`} x1={i * 60} y1={0} x2={i * 60} y2={h} stroke="rgba(79,216,255,0.18)" />)}
			{Array.from({length: Math.ceil(h / 60)}, (_, i) => <line key={`h${i}`} x1={0} y1={i * 60} x2={w} y2={i * 60} stroke="rgba(79,216,255,0.18)" />)}
		</svg>
		{children}
	</div>
);

// ---------------------------------------------------------------------------
// Scene 4 — the paper breaks into data and becomes the platform
// ---------------------------------------------------------------------------
const PW = 300;
const PH = 400;
const COLS = 15;
const ROWS = 20;
const PANEL = {x: 960, y: 560, w: 1200, h: 660};
const perim = (t: number) => {
	const {x, y, w, h} = PANEL;
	const L = 2 * (w + h);
	let d = ((t % 1) + 1) % 1 * L;
	if (d < w) return {x: x - w / 2 + d, y: y - h / 2};
	d -= w;
	if (d < h) return {x: x + w / 2, y: y - h / 2 + d};
	d -= h;
	if (d < w) return {x: x + w / 2 - d, y: y + h / 2};
	d -= w;
	return {x: x - w / 2, y: y + h / 2 - d};
};
const PARTS = Array.from({length: COLS * ROWS}, (_, i) => {
	const c = i % COLS;
	const r = Math.floor(i / COLS);
	const a = rnd(`pa${i}`) * Math.PI * 2;
	return {
		hx: 960 - PW / 2 + (c + 0.5) * (PW / COLS),
		hy: 560 - PH / 2 + (r + 0.5) * (PH / ROWS),
		dx: Math.cos(a) * (120 + rnd(`pd${i}`) * 380),
		dy: Math.sin(a) * (80 + rnd(`pe${i}`) * 260),
		order: (1 - c / (COLS - 1)) * 0.55 + rnd(`po${i}`) * 0.45,
		t: rnd(`pt${i}`),
		late: rnd(`pl${i}`) * 22,
	};
});

const Turn: React.FC<{f: number}> = ({f}) => {
	const [a, b] = ST.turn;
	if (f < a - 12 || f > b + 50) return null;
	const paperO = ramp(f, a - 8, a + 6) * (1 - ramp(f, a + 40, a + 92));
	const panelIn = ramp(f, a + 138, a + 176, 0, 1, expoOut);
	return (
		<AbsoluteFill>
			{paperO > 0 ? (
				<div style={{position: 'absolute', left: 960 - PW / 2, top: 560 - PH / 2, opacity: paperO, transform: `scale(${1 + ramp(f, a, a + 90) * 0.04})`}}>
					<Paper w={PW} h={PH} />
				</div>
			) : null}
			{f >= a + 30 && f < a + 190 ? (
				<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
					{PARTS.map((p, i) => {
						const p1 = ramp(f, a + 36 + p.order * 50, a + 76 + p.order * 50, 0, 1, expoOut);
						if (p1 <= 0) return null;
						const p2 = ramp(f, a + 100 + p.late, a + 150 + p.late, 0, 1, expoInOut);
						const tgt = perim(p.t);
						const sx = p.hx + p.dx * p1 + Math.sin(f / 9 + i) * 6 * p1;
						const sy = p.hy + p.dy * p1 + Math.cos(f / 11 + i) * 6 * p1;
						const x = lerp(sx, tgt.x, p2);
						const y = lerp(sy, tgt.y, p2);
						const sz = lerp(lerp(PW / COLS, 5, p1), 3, p2);
						const cyan = p1;
						const fill = cyan > 0.5 ? (i % 7 === 0 ? C.gold : '#BDF1FF') : OLD.paper;
						return <rect key={i} x={x - sz / 2} y={y - sz / 2} width={sz} height={sz} rx={sz * 0.3} fill={fill} opacity={(1 - ramp(f, a + 166, a + 190)) * (0.6 + 0.4 * p1)} style={cyan > 0.5 ? {filter: `drop-shadow(0 0 4px ${C.cyan})`} : undefined} />;
					})}
				</svg>
			) : null}
			<Win frame={f} a={a + 22} b={a + 132} top={110} outF={14}>
				<ArText lines="اليوم..." frame={f} start={a + 26} size={84} weight={900} color={C.cyan} glow="cyan" maxW={1500} />
				<ArText lines="تبدأ رحلة مختلفة" frame={f} start={a + 40} size={110} weight={900} maxW={1500} />
			</Win>
			{panelIn > 0 && f < b + 6 ? (
				<Glass x={PANEL.x} y={PANEL.y} w={PANEL.w} h={PANEL.h} o={panelIn * (1 - ramp(f, b - 2, b + 6))} glow={0.6}>
					<div style={{position: 'absolute', left: 0, right: 0, top: 120}}>
						<div style={{display: 'flex', justifyContent: 'center', opacity: ramp(f, a + 146, a + 166)}}>
							<Ornament size={130} draw={ramp(f, a + 146, a + 200, 0, 1, (t) => t)} frame={f} />
						</div>
						<ArText lines="الخدمة الإلكترونية" frame={f} start={a + 150} size={110} weight={900} maxW={1100} style={{marginTop: 20}} />
						<ArText lines="لتصديق شهادة المنشأ" frame={f} start={a + 160} size={92} weight={900} color="#F0D48E" glow="gold" maxW={1100} />
					</div>
				</Glass>
			) : null}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------
// Scene 5 — from anywhere: submit, upload, follow
// ---------------------------------------------------------------------------
const SCR = {x: 640, y: 480, w: 1000, h: 580};
const UPLOADS = [
	{label: 'شهادة المنشأ', at: 1124, variant: 'coo' as const},
	{label: 'الفاتورة التجارية', at: 1158, variant: 'invoice' as const},
	{label: 'المستندات المطلوبة', at: 1192, variant: 'paper' as const},
];
const STEPS5 = [
	{t: 'قدّم معاملتك إلكترونياً', icon: 'remote', at: 1084},
	{t: 'ارفع المستندات', icon: 'upload', at: 1118},
	{t: 'تابع حالتها', icon: 'eye', at: 1240},
];

const Anywhere: React.FC<{f: number}> = ({f}) => {
	const [a, b] = ST.anywhere;
	if (f < a - 4 || f > b + 10) return null;
	const m = ramp(f, a - 4, a + 36, 0, 1, expoInOut);
	const x = lerp(PANEL.x, SCR.x, m);
	const y = lerp(PANEL.y, SCR.y, m);
	const w = lerp(PANEL.w, SCR.w, m);
	const h = lerp(PANEL.h, SCR.h, m);
	const merge = ramp(f, 1262, 1290, 0, 1, expoInOut);
	// outro: the merged file becomes a packet of light and leaves for the journey
	const out = ramp(f, b - 34, b - 4, 0, 1, expoIn);
	const ui = ramp(f, a + 30, a + 46) * (1 - out);
	return (
		<AbsoluteFill>
			{/* laptop base */}
			<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: ramp(f, a + 20, a + 44) * (1 - out)}}>
				<path d={`M${SCR.x - SCR.w / 2 - 20} ${SCR.y + SCR.h / 2 + 6} H${SCR.x + SCR.w / 2 + 20} L${SCR.x + SCR.w / 2 + 110} ${SCR.y + SCR.h / 2 + 56} H${SCR.x - SCR.w / 2 - 110} Z`} fill="url(#lapbase)" stroke="rgba(170,230,255,0.4)" strokeWidth={2} />
				<rect x={SCR.x - 90} y={SCR.y + SCR.h / 2 + 22} width={180} height={12} rx={6} fill="rgba(170,230,255,0.18)" />
				<defs>
					<linearGradient id="lapbase" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#1B3354" />
						<stop offset="1" stopColor="#0A1628" />
					</linearGradient>
				</defs>
			</svg>
			<Glass x={x} y={y} w={w} h={h} o={1 - out} glow={0.4}>
				{/* splash title carried over from scene 4 */}
				<div style={{position: 'absolute', left: 0, right: 0, top: 120, opacity: 1 - ramp(f, a - 4, a + 14)}}>
					<div style={{height: 150}} />
					<ArText lines="الخدمة الإلكترونية" frame={f} start={0} size={110} weight={900} maxW={1100} />
					<ArText lines="لتصديق شهادة المنشأ" frame={f} start={0} size={92} weight={900} color="#F0D48E" glow="gold" maxW={1100} />
				</div>
				<div dir="rtl" style={{position: 'absolute', inset: 0, opacity: ui}}>
					{/* app bar */}
					<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 78, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', borderBottom: '1px solid rgba(244,247,251,0.12)', background: 'rgba(255,255,255,0.03)'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
							<Ornament size={50} draw={1} frame={f} glow={0.2} />
							<div style={{fontFamily: AF.display, fontWeight: 800, fontSize: 28, color: C.white}}>الخدمة الإلكترونية لتصديق شهادة المنشأ</div>
						</div>
						{f >= 1214 ? <ArChip text="قيد المتابعة" color={C.cyan} p={ramp(f, 1214, 1226, 0, 1, expoOut)} frame={f} size={26} /> : null}
					</div>
					<div style={{position: 'absolute', right: 40, top: 104, fontFamily: AF.display, fontWeight: 800, fontSize: 40, color: '#F0D48E', opacity: ramp(f, a + 40, a + 54)}}>طلب تصديق شهادة منشأ</div>
					{/* upload rows → one electronic file */}
					{UPLOADS.map((u, i) => {
						const top = lerp(186 + i * 96, 300, merge);
						const prog = ramp(f, u.at + 4, u.at + 22, 0, 1, smooth);
						return (
							<div key={i} style={{position: 'absolute', right: 40, top, opacity: ramp(f, a + 46 + i * 6, a + 60 + i * 6) * (1 - merge), transform: `scale(${1 - merge * 0.1})`}}>
								<DocRow label={u.label} prog={prog} state={prog >= 1 ? 'ok' : 'idle'} frame={f} w={SCR.w - 80} />
							</div>
						);
					})}
					{merge > 0 ? (
						<div style={{position: 'absolute', right: 40, left: 40, top: 230, height: 230, borderRadius: 20, border: `2px solid ${C.gold}`, background: 'rgba(217,180,106,0.08)', opacity: merge, transform: `scale(${0.9 + 0.1 * merge})`, display: 'flex', alignItems: 'center', gap: 34, padding: '0 40px', boxShadow: '0 0 40px rgba(217,180,106,0.3)'}}>
							<div style={{position: 'relative', width: 110, height: 140}}>
								{[2, 1, 0].map((k) => (
									<div key={k} style={{position: 'absolute', right: k * 12, top: k * 10, width: 92, height: 120, borderRadius: 8, border: `2px solid ${C.gold}`, background: '#0D2140'}} />
								))}
							</div>
							<div>
								<div style={{fontFamily: AF.display, fontWeight: 900, fontSize: 50, color: C.white, lineHeight: 1.3}}>ملف إلكتروني واحد</div>
								<div style={{fontFamily: F.mono, fontSize: 28, color: C.gold, direction: 'ltr', textAlign: 'right', marginTop: 6}}>{TXN}</div>
								<div style={{fontFamily: AF.body, fontWeight: 600, fontSize: 28, color: 'rgba(244,247,251,0.75)', marginTop: 6}}>٣ مستندات مرفقة</div>
							</div>
						</div>
					) : null}
				</div>
			</Glass>
			{/* documents fly into the screen */}
			{UPLOADS.map((u, i) => {
				const p = ramp(f, u.at - 30, u.at, 0, 1, expoInOut);
				if (p <= 0 || p >= 1) return null;
				const tx = SCR.x + SCR.w / 2 - 100;
				const ty = SCR.y - SCR.h / 2 + 186 + i * 96 + 38;
				const sx = 1300 + i * 130;
				const sy = 1180;
				const cx = lerp(sx, tx, p);
				const cy = lerp(sy, ty, p) - Math.sin(p * Math.PI) * 160;
				const sc = lerp(0.22, 0.06, p);
				return (
					<div key={i} style={{position: 'absolute', left: cx - DOC_W / 2, top: cy - DOC_H / 2, width: DOC_W, height: DOC_H, transform: `scale(${sc}) rotate(${(1 - p) * -12}deg)`, opacity: Math.min(1, (1 - p) * 4)}}>
						{u.variant === 'paper' ? <Paper w={DOC_W} h={DOC_H} stamp={false} tint="rgba(79,216,255,0.15)" /> : <ArDoc frame={f} variant={u.variant} glow={0.6} />}
					</div>
				);
			})}
			{/* packet leaving */}
			{out > 0 ? (
				<div style={{position: 'absolute', left: lerp(SCR.x, 960, out) - 20, top: lerp(SCR.y, 760, out) - 20, width: 40, height: 40, borderRadius: '50%', background: '#E6FBFF', boxShadow: `0 0 40px 16px ${C.cyan}, 0 0 90px 30px rgba(217,180,106,0.35)`, opacity: out, transform: `scale(${lerp(3, 1, out)})`}} />
			) : null}
			{/* right column */}
			<Win frame={f} a={a + 4} b={b - 6} top={130} left={1180} width={660} outF={20}>
				<ArText lines="من أي مكان" frame={f} start={a + 8} size={100} weight={900} color="#F0D48E" glow="gold" maxW={640} />
				<div style={{height: 70}} />
				{STEPS5.map((s, i) => {
					const p = ramp(f, s.at, s.at + 16, 0, 1, expoOut);
					const active = f >= s.at && (i === STEPS5.length - 1 || f < STEPS5[i + 1].at);
					return (
						<div key={i} dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 26, marginBottom: 46, opacity: p * (active ? 1 : 0.7), transform: `translateX(${(1 - p) * 40}px)`}}>
							<div style={{width: 92, height: 92, borderRadius: '50%', border: `2px solid ${active ? C.cyan : C.gold}`, background: active ? 'rgba(79,216,255,0.14)' : 'rgba(217,180,106,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: active ? `0 0 30px rgba(79,216,255,0.45)` : undefined}}>
								{s.icon === 'upload' ? <SIcon name="upload" size={54} color={active ? C.cyan : C.gold} /> : <ArIcon name={s.icon} size={54} color={active ? C.cyan : C.gold} />}
							</div>
							<div style={{fontFamily: AF.display, fontWeight: 800, fontSize: 56, lineHeight: 1.3, color: C.white, whiteSpace: 'nowrap', textShadow: '0 4px 20px rgba(0,0,0,0.9)'}}>{s.t}</div>
						</div>
					);
				})}
			</Win>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------
// Scene 7 — a missing document no longer restarts the journey
// ---------------------------------------------------------------------------
const NODES7 = ['التاجر', 'التدقيق', 'المراجعة', 'الرسوم', 'الملحق التجاري', 'التصديق'];
const Missing: React.FC<{f: number}> = ({f}) => {
	const [a, b] = ST.missing;
	if (f < a - 4 || f > b + 6) return null;
	const o = ramp(f, a, a + 16) * (1 - ramp(f, b - 16, b));
	const need = f >= a + 30 && f < 1890;
	const fixed = ramp(f, 1868, 1890);
	const status = f < a + 30 ? null : f < 1890 ? {t: 'مطلوب استكمال', c: OLD.amber} : f < 1940 ? {t: 'تم الاستلام', c: C.cyan} : {t: 'قيد المعالجة', c: C.gold};
	const statusAt = f < 1890 ? a + 30 : f < 1940 ? 1890 : 1940;
	// packet on the mini path: waits at the review stage, then carries on from the same place
	const pos = lerp(2, 3, ramp(f, 1934, 1984, 0, 1, expoInOut));
	const CX = 620;
	const railW = 860;
	const nx = (i: number) => CX + railW / 2 - (i * railW) / 5;
	return (
		<AbsoluteFill style={{opacity: o}}>
			<Glass x={CX} y={500} w={1000} h={720} o={1} glow={0.3}>
				<div dir="rtl" style={{position: 'absolute', inset: 0}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 92, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 34px', borderBottom: '1px solid rgba(244,247,251,0.12)'}}>
						<div>
							<div style={{fontFamily: AF.display, fontWeight: 800, fontSize: 34, color: C.white}}>معاملة شهادة منشأ</div>
							<div style={{fontFamily: F.mono, fontSize: 22, color: C.gold, direction: 'ltr', textAlign: 'right'}}>{TXN}</div>
						</div>
						{status ? <ArChip key={status.t} text={status.t} color={status.c} p={ramp(f, statusAt, statusAt + 12, 0, 1, expoOut)} frame={f} size={34} /> : null}
					</div>
					<div style={{position: 'absolute', right: 34, top: 124, display: 'flex', flexDirection: 'column', gap: 16}}>
						<DocRow label="شهادة المنشأ" prog={1} state="ok" frame={f} w={932} />
						<DocRow label="الفاتورة التجارية" prog={1} state="ok" frame={f} w={932} />
						<DocRow label="مستند مُكمِّل" prog={need ? 0.15 : ramp(f, 1870, 1888, 0.15, 1, smooth)} state={need ? 'need' : 'ok'} frame={f} w={932} hi={need ? 0.5 + 0.5 * Math.sin(f / 5) : 0} />
					</div>
					{/* the trader uploads the missing document */}
					{f >= 1836 && f < 1890 ? (
						<div style={{position: 'absolute', left: 120, top: lerp(470, 330, ramp(f, 1840, 1870, 0, 1, expoInOut)), opacity: ramp(f, 1836, 1846) * (1 - ramp(f, 1878, 1890)), display: 'flex', alignItems: 'center', gap: 12, fontFamily: AF.display, fontWeight: 800, fontSize: 30, color: C.cyan}}>
							<SIcon name="upload" size={56} color={C.cyan} />
							رفع المستند
						</div>
					) : null}
					{/* mini path */}
					<div style={{position: 'absolute', left: 0, right: 0, top: 480, height: 200}}>
						<svg width={1000} height={200} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
							<line x1={nx(0) - CX + 500} y1={50} x2={nx(5) - CX + 500} y2={50} stroke={C.line} strokeWidth={4} />
							<line x1={nx(0) - CX + 500} y1={50} x2={lerp(nx(0), nx(5), pos / 5) - CX + 500} y2={50} stroke={C.gold} strokeWidth={4} />
							{NODES7.map((_, i) => {
								const on = i < pos + 0.01;
								return <circle key={i} cx={nx(i) - CX + 500} cy={50} r={16} fill={on ? C.gold : '#0B1D3A'} stroke={on ? C.gold : 'rgba(244,247,251,0.4)'} strokeWidth={2} />;
							})}
							<circle cx={lerp(nx(0), nx(5), pos / 5) - CX + 500} cy={50} r={13 + 3 * Math.sin(f / 4)} fill={need ? OLD.amber : '#E6FBFF'} style={{filter: `drop-shadow(0 0 12px ${need ? OLD.amber : C.cyan})`}} />
						</svg>
						{NODES7.map((n, i) => (
							<div key={i} dir="rtl" style={{position: 'absolute', left: nx(i) - CX + 500 - 90, width: 180, top: 82, textAlign: 'center', fontFamily: AF.display, fontWeight: 700, fontSize: 25, color: i <= pos + 0.01 ? C.white : 'rgba(244,247,251,0.55)', whiteSpace: 'nowrap'}}>{n}</div>
						))}
					</div>
				</div>
			</Glass>
			<Win frame={f} a={a + 10} b={b} top={250} left={1180} width={660} outF={16}>
				<ArText lines="حتى عند وجود نقص" frame={f} start={a + 14} size={58} font={AF.body} weight={600} color="rgba(244,247,251,0.85)" glow="none" maxW={640} />
				<ArText lines={['لا تبدأ الرحلة', 'من جديد']} frame={f} start={a + 26} size={104} weight={900} color="#F0D48E" glow="gold" lineHeight={1.3} maxW={640} style={{marginTop: 16}} />
				<ArText lines="تستمر المعاملة من نفس المرحلة" frame={f} start={1936} size={50} font={AF.body} weight={600} color={C.cyan} glow="cyan" maxW={640} style={{marginTop: 40}} />
			</Win>
		</AbsoluteFill>
	);
};

export const SPlatform: React.FC<{frame: number}> = ({frame: f}) => (
	<>
		<Turn f={f} />
		<Anywhere f={f} />
		<Missing f={f} />
	</>
);
