import React from 'react';
import {C, F, expoOut, ramp, scramble, smooth} from '../theme';
import {DOC_H, DOC_W, Emblem, QRCode, SERIAL, SIGNATURE_D} from '../components/Document';
import {AF, ASAFE, STEPS} from './theme';

// ---------------------------------------------------------------------------
// Type — Arabic animates per WORD only (never per letter), RTL, no letter-spacing
// ---------------------------------------------------------------------------
export const glowOf = (g: 'gold' | 'white' | 'cyan' | 'none', k = 1) =>
	g === 'gold'
		? `0 0 ${18 * k}px rgba(217,180,106,${0.55 * k}), 0 0 ${50 * k}px rgba(217,180,106,${0.25 * k}), 0 4px 24px rgba(0,0,0,0.9)`
		: g === 'cyan'
			? `0 0 ${16 * k}px rgba(79,216,255,${0.5 * k}), 0 4px 24px rgba(0,0,0,0.9)`
			: g === 'white'
				? `0 0 ${14 * k}px rgba(244,247,251,${0.3 * k}), 0 4px 24px rgba(0,0,0,0.9)`
				: '0 4px 24px rgba(0,0,0,0.9)';

export const ArText: React.FC<{
	lines: string | string[];
	frame: number;
	start: number;
	size: number;
	font?: string;
	weight?: number;
	color?: string;
	glow?: 'gold' | 'white' | 'cyan' | 'none';
	stagger?: number;
	dur?: number;
	lineHeight?: number;
	mode?: 'rise' | 'fade' | 'scale';
	maxW?: number;
	style?: React.CSSProperties;
}> = ({lines, frame, start, size, font = AF.display, weight = 800, color = C.white, glow = 'white', stagger = 3, dur = 14, lineHeight = 1.35, mode = 'rise', maxW = 880, style}) => {
	const ls = Array.isArray(lines) ? lines : [lines];
	// fit the longest line inside the critical zone (per-font average advance, measured on renders)
	const adv = font === AF.naskh ? 0.36 : font === AF.body ? 0.5 : 0.56;
	const longest = Math.max(...ls.map((l) => l.length));
	const fs = Math.min(size, maxW / (longest * adv));
	let k = 0;
	return (
		<div dir="rtl" lang="ar" style={{fontFamily: font, fontWeight: weight, fontSize: fs, lineHeight, color, textAlign: 'center', ...style}}>
			{ls.map((line, li) => (
				<div key={li} style={{display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap'}}>
					{line.split(' ').map((w, wi, arr) => {
						const i = k++;
						const p = ramp(frame, start + i * stagger, start + i * stagger + dur, 0, 1, expoOut);
						return (
							<span
								key={wi}
								style={{
									display: 'inline-block',
									marginInlineEnd: wi < arr.length - 1 ? '0.25em' : 0,
									opacity: p,
									transform: mode === 'rise' ? `translateY(${(1 - p) * 0.45}em)` : mode === 'scale' ? `scale(${1 + (1 - p) * 0.35})` : undefined,
									filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined,
									textShadow: glowOf(glow),
								}}
							>
								{w}
							</span>
						);
					})}
				</div>
			))}
		</div>
	);
};

/** Shows children in [a, b) with a soft in/out. */
export const Win: React.FC<{frame: number; a: number; b: number; top: number; inF?: number; outF?: number; exit?: 'up' | 'fade' | 'zoom'; children: React.ReactNode; style?: React.CSSProperties}> = ({frame: f, a, b, top, inF = 1, outF = 12, exit = 'up', children, style}) => {
	if (f < a || f >= b) return null;
	const i = ramp(f, a, a + inF);
	const o = ramp(f, b - outF, b, 0, 1, (t) => t * t);
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top, opacity: i * (1 - o), transform: exit === 'up' ? `translateY(${-o * 50}px)` : exit === 'zoom' ? `scale(${1 + o * 0.12})` : undefined, filter: o > 0 ? `blur(${o * 8}px)` : undefined, ...style}}>
			{children}
		</div>
	);
};

export const GoldRule: React.FC<{p: number; w?: number; top: number}> = ({p, w = 560, top}) => (
	<div style={{position: 'absolute', left: 540 - (w / 2) * p, width: w * p, top, height: 3, borderRadius: 2, background: `linear-gradient(90deg, rgba(217,180,106,0), ${C.gold}, rgba(217,180,106,0))`, boxShadow: `0 0 16px rgba(217,180,106,0.5)`}} />
);

/** Scrim behind type that sits over busy visuals. */
export const Scrim: React.FC<{top: number; h: number; o?: number}> = ({top, h, o = 0.85}) => (
	<div style={{position: 'absolute', left: 0, right: 0, top, height: h, background: `radial-gradient(ellipse 62% 50% at 50% 50%, rgba(2,4,10,${o}), rgba(2,4,10,0))`}} />
);

// ---------------------------------------------------------------------------
// Ceremonial ornament: eight-point star within rings (geometric, not an official emblem)
// ---------------------------------------------------------------------------
export const Ornament: React.FC<{size: number; draw: number; frame: number; glow?: number}> = ({size, draw, frame, glow = 1}) => {
	const R = size / 2;
	const sq = (k: number) => R * k * 2;
	return (
		<svg width={size} height={size} viewBox={`${-R} ${-R} ${size} ${size}`} style={{overflow: 'visible', filter: `drop-shadow(0 0 ${14 * glow}px rgba(217,180,106,0.55))`}}>
			<circle r={R * 0.96} fill="none" stroke={C.gold} strokeWidth={size * 0.006} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ramp(draw, 0, 0.5)} transform="rotate(-90)" />
			<circle r={R * 0.88} fill="none" stroke={C.gold} strokeOpacity={0.6} strokeWidth={size * 0.003} strokeDasharray="2 6" transform={`rotate(${frame * 0.2})`} opacity={ramp(draw, 0.3, 0.7)} />
			{[0, 45].map((rot, i) => (
				<rect key={i} x={-sq(0.5) / 2} y={-sq(0.5) / 2} width={sq(0.5)} height={sq(0.5)} fill={i ? 'rgba(217,180,106,0.08)' : 'none'} stroke={C.gold} strokeWidth={size * 0.008} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ramp(draw, 0.15 + i * 0.1, 0.65 + i * 0.1)} transform={`rotate(${rot + frame * 0.05})`} />
			))}
			{[0, 45].map((rot, i) => (
				<rect key={`s${i}`} x={-sq(0.26) / 2} y={-sq(0.26) / 2} width={sq(0.26)} height={sq(0.26)} fill="none" stroke="#F3DDA6" strokeWidth={size * 0.005} opacity={ramp(draw, 0.5, 0.9)} transform={`rotate(${rot - frame * 0.08})`} />
			))}
			{Array.from({length: 16}, (_, i) => {
				const a = (i / 16) * Math.PI * 2;
				const d = ramp(draw, 0.55 + (i % 4) * 0.05, 0.95);
				return <line key={i} x1={Math.cos(a) * R * 0.62} y1={Math.sin(a) * R * 0.62} x2={Math.cos(a) * R * (0.62 + 0.18 * d)} y2={Math.sin(a) * R * (0.62 + 0.18 * d)} stroke={C.gold} strokeOpacity={0.7} strokeWidth={size * 0.004} />;
			})}
			<circle r={R * 0.07 * ramp(draw, 0, 0.3)} fill="#F3DDA6" style={{filter: `drop-shadow(0 0 ${R * 0.1}px ${C.gold})`}} />
		</svg>
	);
};

// ---------------------------------------------------------------------------
// Icons (48×48, stroke)
// ---------------------------------------------------------------------------
const ICONS: Record<string, React.ReactNode> = {
	building: (
		<g>
			<path d="M6 18 L24 7 L42 18 Z" />
			<path d="M10 22 V36 M18 22 V36 M30 22 V36 M38 22 V36" />
			<path d="M6 40 H42 M8 36 H40" />
		</g>
	),
	trader: (
		<g>
			<circle cx={24} cy={16} r={7} />
			<path d="M10 40 C 11 29, 37 29, 38 40" />
		</g>
	),
	check: <path d="M11 25 L20 34 L37 15" />,
	clock: (
		<g>
			<circle cx={24} cy={24} r={17} />
			<path d="M24 14 V24 L31 29" />
		</g>
	),
	eye: (
		<g>
			<path d="M4 24 C 12 12, 36 12, 44 24 C 36 36, 12 36, 4 24 Z" />
			<circle cx={24} cy={24} r={6} />
		</g>
	),
	shield: (
		<g>
			<path d="M24 5 L40 11 V23 C 40 33, 33 40, 24 44 C 15 40, 8 33, 8 23 V11 Z" />
			<path d="M17 24 L22 29 L32 19" />
		</g>
	),
	remote: (
		<g>
			<rect x={14} y={5} width={20} height={38} rx={4} />
			<line x1={21} y1={37} x2={27} y2={37} />
			<path d="M19 20 L23 24 L30 16" />
		</g>
	),
	archive: (
		<g>
			<rect x={6} y={8} width={36} height={10} rx={2} />
			<path d="M9 18 V40 H39 V18" />
			<path d="M19 26 H29" />
		</g>
	),
	globe: (
		<g>
			<circle cx={24} cy={24} r={17} />
			<ellipse cx={24} cy={24} rx={7.5} ry={17} />
			<path d="M7 24 H41 M10 15 H38 M10 33 H38" />
		</g>
	),
	doc: (
		<g>
			<path d="M11 5 H30 L38 13 V43 H11 Z M30 5 V13 H38" />
			<path d="M17 21 H32 M17 28 H32 M17 35 H26" />
		</g>
	),
	paperStack: (
		<g>
			<rect x={10} y={12} width={26} height={30} rx={2} />
			<path d="M14 8 H40 V38" />
			<path d="M16 22 H30 M16 28 H30 M16 34 H24" />
		</g>
	),
	coin: (
		<g>
			<circle cx={24} cy={24} r={16} />
			<path d="M24 14 V34 M29 18 C 27 16, 19 16, 19 21 C 19 26, 29 23, 29 28 C 29 33, 20 32, 18 30" />
		</g>
	),
	seal: (
		<g>
			<circle cx={24} cy={20} r={12} />
			<path d="M18 30 L14 44 L24 39 L34 44 L30 30" />
			<path d="M19 20 L23 24 L30 16" />
		</g>
	),
	qr: (
		<g>
			<rect x={6} y={6} width={14} height={14} />
			<rect x={28} y={6} width={14} height={14} />
			<rect x={6} y={28} width={14} height={14} />
			<path d="M28 28 H34 V34 M40 28 V42 H30 M28 38 V42" />
		</g>
	),
};
export const ArIcon: React.FC<{name: keyof typeof ICONS | string; size: number; color?: string; stroke?: number}> = ({name, size, color = C.gold, stroke = 2.4}) => (
	<svg width={size} height={size} viewBox="0 0 48 48" style={{overflow: 'visible', flexShrink: 0}}>
		<g fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
			{ICONS[name]}
		</g>
	</svg>
);

// ---------------------------------------------------------------------------
// Status chip (Arabic)
// ---------------------------------------------------------------------------
export const ArChip: React.FC<{text: string; color: string; p: number; frame: number; icon?: string; size?: number}> = ({text, color, p, frame, icon, size = 46}) => (
	<div
		dir="rtl"
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			gap: 16,
			padding: `${size * 0.26}px ${size * 0.7}px`,
			borderRadius: 999,
			border: `2px solid ${color}`,
			background: 'rgba(4,12,26,0.86)',
			boxShadow: `0 0 ${30 * p}px ${color}66`,
			fontFamily: AF.display,
			fontWeight: 800,
			fontSize: size,
			lineHeight: 1.2,
			color,
			whiteSpace: 'nowrap',
			opacity: p,
			transform: `scale(${0.8 + 0.2 * p})`,
		}}
	>
		{icon ? <ArIcon name={icon} size={size * 0.95} color={color} stroke={3} /> : <div style={{width: size * 0.3, height: size * 0.3, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}`, opacity: 0.55 + 0.45 * Math.sin(frame / 4)}} />}
		{text}
	</div>
);

// ---------------------------------------------------------------------------
// Step header + progress rail
// ---------------------------------------------------------------------------
export const StepHeader: React.FC<{frame: number; a: number; b: number; i: number; lines: string[]; titleSize?: number}> = ({frame: f, a, b, i, lines, titleSize = 100}) => (
	<Win frame={f} a={a} b={b} top={ASAFE.top + 20} outF={14}>
		<div style={{display: 'flex', justifyContent: 'center'}}>
			<div dir="rtl" style={{display: 'inline-flex', alignItems: 'center', gap: 16, padding: '6px 28px', borderRadius: 999, border: `2px solid ${C.gold}`, background: 'rgba(217,180,106,0.1)', fontFamily: AF.display, fontWeight: 800, fontSize: 44, lineHeight: 1.3, color: C.gold, opacity: ramp(f, a, a + 10), transform: `scale(${0.8 + 0.2 * ramp(f, a, a + 12, 0, 1, expoOut)})`}}>
				الخطوة {STEPS[i].n}
			</div>
		</div>
		<ArText lines={STEPS[i].long} frame={f} start={a + 4} size={titleSize} weight={900} style={{marginTop: 14}} />
		<ArText lines={lines} frame={f} start={a + 14} size={50} font={AF.body} weight={600} color="rgba(244,247,251,0.86)" glow="none" stagger={2} lineHeight={1.45} style={{marginTop: 8}} />
	</Win>
);

export const Rail: React.FC<{frame: number; current: number; a: number; b: number; done?: boolean}> = ({frame: f, current, a, b, done}) => {
	const o = ramp(f, a, a + 12) * (1 - ramp(f, b - 12, b));
	if (o <= 0) return null;
	const W = 760;
	const x0 = 540 + W / 2;
	const step = W / 5;
	return (
		<div style={{position: 'absolute', left: 0, top: 1640, width: 1080, height: 140, opacity: o}}>
			<svg width={1080} height={140} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<line x1={x0} y1={40} x2={x0 - W} y2={40} stroke={C.line} strokeWidth={4} />
				<line x1={x0} y1={40} x2={x0 - step * current} y2={40} stroke={C.gold} strokeWidth={4} />
				{STEPS.map((s, i) => {
					const x = x0 - i * step;
					const on = done || i < current;
					const cur = i === current && !done;
					return (
						<g key={i}>
							{cur ? <circle cx={x} cy={40} r={34 + 4 * Math.sin(f / 6)} fill="none" stroke={C.gold} strokeOpacity={0.5} strokeWidth={2} /> : null}
							<circle cx={x} cy={40} r={26} fill={on || cur ? C.gold : '#0B1D3A'} stroke={on || cur ? C.gold : 'rgba(244,247,251,0.4)'} strokeWidth={2} />
							<text x={x} y={52} textAnchor="middle" fontFamily="Cairo" fontWeight={800} fontSize={32} fill={on || cur ? '#061226' : 'rgba(244,247,251,0.7)'}>
								{s.n}
							</text>
						</g>
					);
				})}
			</svg>
		</div>
	);
};

// ---------------------------------------------------------------------------
// Arabic certificate (600×820, same footprint as the original certificate)
// ---------------------------------------------------------------------------
export type ArDocState = {
	variant?: 'coo' | 'invoice';
	build?: number;
	scan?: number;
	signature?: number;
	seal?: number;
	qr?: number;
	serial?: number;
	validated?: number;
	sheen?: number;
	glow?: number;
	gold?: number;
	review?: number;
};

const Bars: React.FC<{bars: number[]; p: number}> = ({bars, p}) => (
	<div style={{display: 'flex', flexDirection: 'column', gap: 9, marginTop: 10, alignItems: 'flex-end'}}>
		{bars.map((w, i) => (
			<div key={i} style={{height: 7, width: `${w * 100 * ramp(p, i * 0.12, 0.6 + i * 0.12)}%`, borderRadius: 4, background: 'linear-gradient(270deg, rgba(244,247,251,0.42), rgba(244,247,251,0.16))'}} />
		))}
	</div>
);

const lbl: React.CSSProperties = {fontFamily: AF.body, fontWeight: 600, fontSize: 19, color: 'rgba(244,247,251,0.55)'};
const val: React.CSSProperties = {fontFamily: AF.body, fontWeight: 600, fontSize: 21, color: C.white, marginTop: 4};

export const ArSeal: React.FC<{size: number; frame: number}> = ({size, frame}) => (
	<div style={{position: 'relative', width: size, height: size}}>
		<svg width={size} height={size} viewBox="0 0 140 140" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			<circle cx={70} cy={70} r={66} fill="rgba(217,180,106,0.08)" stroke={C.gold} strokeWidth={1.8} />
			<circle cx={70} cy={70} r={60} fill="none" stroke={C.gold} strokeWidth={0.7} strokeDasharray="1.5 2.5" transform={`rotate(${frame * 0.4} 70 70)`} />
			<circle cx={70} cy={70} r={44} fill="none" stroke={C.gold} strokeWidth={1} />
			<g transform="translate(70 70)" fill="none" stroke={C.gold} strokeWidth={1}>
				<rect x={-30} y={-30} width={60} height={60} transform="rotate(45)" strokeOpacity={0.5} />
			</g>
		</svg>
		<div dir="rtl" style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: AF.display, fontWeight: 800, color: C.gold, lineHeight: 1.1}}>
			<div style={{fontSize: size * 0.2}}>مُصدَّقة</div>
			<div style={{fontSize: size * 0.1, fontWeight: 700, opacity: 0.85}}>الملحق التجاري</div>
		</div>
	</div>
);

export const ArDoc: React.FC<ArDocState & {frame: number}> = ({frame, variant = 'coo', build = 1, scan = -1, signature = 0, seal = 0, qr = 0, serial = 0, validated = 0, sheen = -1, glow = 0, gold = 0, review = 0}) => {
	const outline = ramp(build, 0, 0.38, 0, 1, smooth);
	const body = ramp(build, 0.22, 0.6, 0, 1, smooth);
	const content = (i: number) => ramp(build, 0.38 + i * 0.07, 0.72 + i * 0.07, 0, 1, expoOut);
	const perim = 2 * (DOC_W + DOC_H);
	const scanY = scan * DOC_H;
	const coo = variant === 'coo';
	return (
		<div dir="rtl" style={{position: 'relative', width: DOC_W, height: DOC_H}}>
			<div style={{position: 'absolute', inset: 0, borderRadius: 8, opacity: body, overflow: 'hidden', background: 'linear-gradient(200deg, rgba(22,44,78,0.94) 0%, rgba(10,24,46,0.96) 45%, rgba(6,15,31,0.98) 100%)', boxShadow: `0 60px 140px rgba(0,0,0,0.65), 0 0 ${60 + glow * 60}px rgba(79,216,255,${0.05 + glow * 0.2}), inset 0 1px 0 rgba(255,255,255,0.12)`}}>
				<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 7, background: `linear-gradient(270deg, ${C.cyan}, ${C.gold} 60%, rgba(217,180,106,0.2))`}} />
				<svg width={DOC_W} height={DOC_H} style={{position: 'absolute', inset: 0, opacity: 0.1 + gold * 0.06}}>
					{Array.from({length: 10}, (_, k) => (
						<circle key={k} cx={300} cy={430} r={120 + k * 12} fill="none" stroke={C.gold} strokeWidth={0.6} strokeDasharray={`${3 + k} 6`} />
					))}
				</svg>
			</div>
			<svg width={DOC_W} height={DOC_H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<rect x={0.5} y={0.5} width={DOC_W - 1} height={DOC_H - 1} rx={8} fill="none" stroke={gold > 0 ? `rgba(217,180,106,${0.35 + gold * 0.55})` : 'rgba(170,230,255,0.55)'} strokeWidth={1.6} strokeDasharray={`${perim} ${perim}`} strokeDashoffset={perim * (1 - outline)} />
			</svg>
			{/* header */}
			<div style={{position: 'absolute', right: 40, top: 38, display: 'flex', alignItems: 'center', gap: 18, opacity: content(0)}}>
				<Emblem size={62} frame={frame} />
				<div>
					<div style={{fontFamily: AF.display, fontWeight: 800, fontSize: 40, color: C.white, lineHeight: 1.15}}>{coo ? 'شهادة المنشأ' : 'فاتورة تجارية'}</div>
					<div style={{...lbl, fontSize: 18, marginTop: 4}}>{coo ? 'جمهورية العراق · نموذج تصديق' : 'مستند تجاري مرفق'}</div>
				</div>
			</div>
			{validated > 0 ? (
				<div style={{position: 'absolute', left: 34, top: 52, padding: '6px 16px', borderRadius: 30, border: `1.5px solid rgba(79,216,255,${0.8 * validated})`, background: 'rgba(79,216,255,0.1)', fontFamily: AF.display, fontWeight: 800, fontSize: 20, color: C.cyan, opacity: validated, transform: `scale(${0.8 + 0.2 * validated})`}}>
					✓ موثّقة
				</div>
			) : null}
			<div style={{position: 'absolute', left: 40, right: 40, top: 130, height: 1.5, background: `linear-gradient(270deg, ${C.gold}, rgba(217,180,106,0.1))`, transform: `scaleX(${content(0)})`, transformOrigin: 'right'}} />
			{coo ? (
				<>
					<div style={{position: 'absolute', left: 40, right: 40, top: 152, opacity: content(1)}}>
						<div style={lbl}>المُصدِّر</div>
						<Bars bars={[0.62, 0.4]} p={content(1)} />
					</div>
					<div style={{position: 'absolute', left: 40, right: 40, top: 238, opacity: content(2)}}>
						<div style={lbl}>المستورد</div>
						<Bars bars={[0.55, 0.34]} p={content(2)} />
					</div>
					<div style={{position: 'absolute', left: 40, right: 40, top: 324, display: 'flex', gap: 24, opacity: content(3)}}>
						{[
							['رمز البضاعة', '8471.30.00'],
							['وسيلة النقل', 'بحري'],
							['رقم الفاتورة', 'INV-58213'],
						].map(([l, v], i) => (
							<div key={i} style={{flex: 1}}>
								<div style={lbl}>{l}</div>
								<div style={{...val, fontFamily: /[0-9]/.test(v) ? F.mono : AF.body, direction: 'ltr', textAlign: 'right'}}>{v}</div>
							</div>
						))}
					</div>
					<div style={{position: 'absolute', left: 40, right: 40, top: 410, opacity: content(4)}}>
						<div style={lbl}>وصف البضائع</div>
						<Bars bars={[0.86, 0.72, 0.5]} p={content(4)} />
					</div>
					<div style={{position: 'absolute', left: 40, right: 40, top: 510, opacity: content(5)}}>
						<div style={lbl}>بلد المنشأ</div>
						<div style={{...val, color: C.gold}}>جمهورية العراق</div>
					</div>
					<div style={{position: 'absolute', left: 40, right: 40, top: 588, height: 1, background: C.line, opacity: content(6)}} />
					<div style={{position: 'absolute', right: 40, top: 602, opacity: content(6)}}>
						<div style={lbl}>مصادقة الملحق التجاري</div>
						<svg width={240} height={80} viewBox="0 0 260 82" style={{marginTop: 4, overflow: 'visible'}}>
							<line x1={0} y1={78} x2={250} y2={78} stroke={C.line} />
							<path d={SIGNATURE_D} fill="none" stroke="#EAF8FF" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - signature} style={{filter: `drop-shadow(0 0 4px ${C.cyan})`}} />
						</svg>
					</div>
					{review > 0 ? (
						<svg width={70} height={70} viewBox="0 0 40 40" style={{position: 'absolute', left: 40, top: 500, overflow: 'visible', opacity: Math.min(1, review * 2), filter: 'drop-shadow(0 0 8px rgba(217,180,106,0.7))'}}>
							<circle cx={20} cy={20} r={17} fill="rgba(217,180,106,0.08)" stroke={C.gold} strokeWidth={1.4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ramp(review, 0, 0.6)} transform="rotate(-90 20 20)" />
							<path d="M12.5 20.5 L17.8 25.8 L28 15" fill="none" stroke={C.gold} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ramp(review, 0.45, 1)} />
						</svg>
					) : null}
					{seal > 0 ? (
						<div style={{position: 'absolute', left: 190, top: 600, opacity: Math.min(1, seal * 2), transform: `scale(${1 + (1 - seal) * 0.9}) rotate(${(1 - seal) * 35}deg)`, filter: `drop-shadow(0 0 ${6 + (1 - seal) * 20}px rgba(217,180,106,0.6))`}}>
							<ArSeal size={128} frame={frame} />
						</div>
					) : null}
					<div style={{position: 'absolute', left: 44, top: 614, width: 118, height: 118, opacity: qr > 0 ? 1 : 0}}>
						<div style={{position: 'absolute', inset: -8, border: `1px solid rgba(79,216,255,${0.4 * qr})`, borderRadius: 4}} />
						<QRCode p={qr} size={118} />
					</div>
					<div style={{position: 'absolute', right: 40, top: 712, opacity: serial > 0 ? 1 : 0}}>
						<div style={lbl}>الرقم التسلسلي</div>
						<div style={{fontFamily: F.mono, fontWeight: 500, fontSize: 20, color: C.gold, marginTop: 4, direction: 'ltr', textAlign: 'right'}}>{scramble(SERIAL, serial, frame, 'serial-ar')}</div>
					</div>
				</>
			) : (
				<>
					{[
						['البائع', [0.58, 0.38]],
						['المشتري', [0.5, 0.32]],
						['المواد', [0.8, 0.7, 0.76, 0.64, 0.72]],
					].map(([l, bars], i) => (
						<div key={i} style={{position: 'absolute', left: 40, right: 40, top: 152 + i * 90, opacity: content(i + 1)}}>
							<div style={lbl}>{l as string}</div>
							<Bars bars={bars as number[]} p={content(i + 1)} />
						</div>
					))}
					<div style={{position: 'absolute', left: 40, right: 40, top: 560, opacity: content(5)}}>
						<div style={lbl}>المبلغ الإجمالي</div>
						<Bars bars={[0.3]} p={content(5)} />
					</div>
				</>
			)}
			{scan >= 0 && scan <= 1 ? (
				<div style={{position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 8, pointerEvents: 'none'}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: scanY - 140, height: 140, background: 'linear-gradient(180deg, rgba(79,216,255,0) 0%, rgba(79,216,255,0.16) 100%)'}} />
					<div style={{position: 'absolute', left: -10, right: -10, top: scanY - 1, height: 2, background: '#DFF8FF', boxShadow: `0 0 18px 4px ${C.cyan}, 0 0 60px 10px rgba(79,216,255,0.4)`}} />
				</div>
			) : null}
			{sheen > -0.5 && sheen < 1.5 ? (
				<div style={{position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 8, pointerEvents: 'none', mixBlendMode: 'screen'}}>
					<div style={{position: 'absolute', top: -200, bottom: -200, width: 260, left: -300 + sheen * (DOC_W + 400), transform: 'rotate(18deg)', background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(79,216,255,0.1) 30%, rgba(255,255,255,0.22) 50%, rgba(217,180,106,0.12) 70%, rgba(255,255,255,0) 100%)'}} />
				</div>
			) : null}
		</div>
	);
};
