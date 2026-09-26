import React from 'react';
import {Img, staticFile} from 'remotion';
import {expoOut, lerp, ramp} from '../theme';
import {BRAND, P, PF, goldGlow, whiteGlow} from './theme';

// ---------------------------------------------------------------------------
// Arabic headline — animated per WORD (never per letter), RTL, no letter-spacing
// ---------------------------------------------------------------------------
export const Head: React.FC<{
	text: string;
	frame: number;
	start: number;
	size: number;
	mode?: 'slam' | 'rise' | 'wipe';
	stagger?: number;
	dur?: number;
	color?: string;
	glow?: 'gold' | 'white';
	weight?: number;
	style?: React.CSSProperties;
}> = ({text, frame, start, size, mode = 'rise', stagger = 3, dur = 11, color = P.white, glow = 'white', weight = 700, style}) => {
	const words = text.split(' ');
	return (
		<div dir="rtl" lang="ar" style={{display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap', fontFamily: PF.ar, fontWeight: weight, fontSize: size, lineHeight: 1.25, color, ...style}}>
			{words.map((w, i) => {
				const p = ramp(frame, start + i * stagger, start + i * stagger + dur, 0, 1, expoOut);
				const shadow = glow === 'gold' ? goldGlow() : whiteGlow();
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							padding: '0 0.04em',
							marginInlineEnd: i < words.length - 1 ? '0.2em' : 0,
							transform: mode === 'slam' ? `scale(${1 + (1 - p) * 0.9})` : mode === 'rise' ? `translateY(${(1 - p) * 0.55}em)` : undefined,
							clipPath: mode === 'wipe' ? `inset(0 0 0 ${(1 - p) * 100}%)` : undefined,
							opacity: mode === 'wipe' ? 1 : p,
							filter: p < 1 && mode !== 'wipe' ? `blur(${(1 - p) * 14}px)` : undefined,
							textShadow: shadow,
						}}
					>
						{w}
					</span>
				);
			})}
		</div>
	);
};

/** Holds a headline block for [a, b), with a quick lift-out at the end. */
export const Beat: React.FC<{frame: number; a: number; b: number; top: number; children: React.ReactNode; out?: 'up' | 'zoom'}> = ({frame: f, a, b, top, children, out = 'up'}) => {
	if (f < a || f >= b) return null;
	const o = ramp(f, b - 6, b, 0, 1, (t) => t * t);
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top, opacity: 1 - o, transform: out === 'up' ? `translateY(${-o * 60}px)` : `scale(${1 + o * 0.35})`, filter: o > 0 ? `blur(${o * 10}px)` : undefined}}>
			{children}
		</div>
	);
};

/** Dark scrim so type stays readable over busy UI. */
export const Scrim: React.FC<{top: number; h: number; o?: number}> = ({top, h, o = 0.9}) => (
	<div style={{position: 'absolute', left: 20, right: 20, top, height: h, background: `radial-gradient(ellipse 58% 50% at 50% 50%, rgba(5,13,28,${o}), rgba(5,13,28,0))`}} />
);

// ---------------------------------------------------------------------------
// TradePoint mark: a gold point, diamond rings, trade routes radiating to the world
// ---------------------------------------------------------------------------
export const BrandMark: React.FC<{size: number; draw: number; frame: number; glow?: number}> = ({size, draw, frame, glow = 1}) => {
	const R = size / 2;
	return (
		<svg width={size} height={size} viewBox={`${-R} ${-R} ${size} ${size}`} style={{overflow: 'visible'}}>
			{Array.from({length: 8}, (_, i) => {
				const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
				const d = ramp(draw, 0.35 + i * 0.03, 0.8 + i * 0.03);
				const r0 = R * 0.46;
				const r1 = r0 + (R * 0.95 - r0) * d;
				return (
					<g key={i} opacity={d}>
						<line x1={r0 * Math.cos(a)} y1={r0 * Math.sin(a)} x2={r1 * Math.cos(a)} y2={r1 * Math.sin(a)} stroke={P.gold} strokeWidth={size * 0.012} strokeLinecap="round" />
						<circle cx={r1 * Math.cos(a)} cy={r1 * Math.sin(a)} r={size * 0.022} fill={i % 2 ? P.white : P.goldLight} />
					</g>
				);
			})}
			{[0.44, 0.3].map((k, i) => {
				const d = ramp(draw, 0.05 + i * 0.12, 0.45 + i * 0.12);
				const s = R * k * 2;
				const per = s * 4;
				return (
					<rect key={i} x={-s / 2} y={-s / 2} width={s} height={s} fill={i ? 'rgba(212,166,41,0.12)' : 'none'} stroke={i ? P.goldLight : P.gold} strokeWidth={size * (i ? 0.014 : 0.02)} strokeDasharray={`${per} ${per}`} strokeDashoffset={per * (1 - d)} transform={`rotate(${45 + (i ? -frame * 0.3 : frame * 0.15)})`} />
				);
			})}
			<circle r={size * 0.06 * ramp(draw, 0, 0.25)} fill={P.goldLight} style={{filter: `drop-shadow(0 0 ${size * 0.06 * glow}px ${P.gold})`}} />
		</svg>
	);
};

/** TRAD (white) + POINT (gold) wordmark; Latin letters may animate individually. */
export const Wordmark: React.FC<{frame: number; start: number; size: number; sweep?: number}> = ({frame: f, start, size, sweep = -1}) => {
	const split = BRAND.toUpperCase().indexOf('POINT');
	return (
		<div style={{display: 'flex', justifyContent: 'center'}}>
			{BRAND.split('').map((ch, i) => {
				const p = ramp(f, start + i * 1.5, start + i * 1.5 + 12, 0, 1, expoOut);
				const isGold = split >= 0 && i >= split;
				const lit = Math.max(0, 1 - Math.abs(i / (BRAND.length - 1) - sweep) * 4);
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							fontFamily: PF.en,
							fontWeight: 900,
							fontSize: size,
							lineHeight: 1,
							letterSpacing: size * 0.02,
							color: isGold ? (lit > 0 ? '#FFE9A8' : P.gold) : lit > 0 ? '#FFFFFF' : P.white,
							opacity: p,
							transform: `translateY(${(1 - p) * size * 0.5}px) scale(${1 + (1 - p) * 0.6})`,
							filter: p < 1 ? `blur(${(1 - p) * 12}px)` : undefined,
							textShadow: isGold ? goldGlow(0.8 + lit) : whiteGlow(0.6 + lit),
						}}
					>
						{ch}
					</span>
				);
			})}
		</div>
	);
};

// ---------------------------------------------------------------------------
// Icons (48×48, stroke)
// ---------------------------------------------------------------------------
const ICON: Record<string, React.ReactNode> = {
	check: <path d="M12 25 L20 33 L36 15" />,
	diamond: <path d="M10 18 L17 9 H31 L38 18 L24 40 Z M10 18 H38 M17 9 L24 18 L31 9 M24 18 V40" />,
	pin: (
		<g>
			<path d="M24 42 C 14 30, 11 24, 11 19 A 13 13 0 0 1 37 19 C 37 24, 34 30, 24 42 Z" />
			<circle cx={24} cy={19} r={5} />
		</g>
	),
	box: (
		<g>
			<path d="M8 16 L24 8 L40 16 V34 L24 42 L8 34 Z M8 16 L24 24 L40 16 M24 24 V42" />
		</g>
	),
	cert: (
		<g>
			<rect x={8} y={8} width={32} height={24} rx={2} />
			<line x1={14} y1={16} x2={34} y2={16} />
			<line x1={14} y1={22} x2={28} y2={22} />
			<circle cx={31} cy={33} r={6} />
			<path d="M27 37 L25 44 L31 41 L37 44 L35 37" />
		</g>
	),
	law: (
		<g>
			<path d="M12 6 H30 L38 14 V42 H12 Z M30 6 V14 H38" />
			<path d="M29 21 C 27 18, 20 18, 20 22 C 20 26, 29 25, 29 30 C 29 34, 21 34, 20 31 M24 17 V35" strokeWidth={2.2} />
		</g>
	),
	growth: (
		<g>
			<path d="M8 40 H40 M8 40 V8" />
			<path d="M12 33 L20 25 L27 29 L38 15" />
			<path d="M31 15 H38 V22" />
		</g>
	),
	users: (
		<g>
			<circle cx={18} cy={17} r={6} />
			<path d="M7 38 C 8 29, 28 29, 29 38" />
			<circle cx={32} cy={15} r={5} />
			<path d="M30 25 C 38 25, 42 30, 42 36" />
		</g>
	),
	store: (
		<g>
			<path d="M8 18 L11 8 H37 L40 18 Z M8 18 V40 H40 V18" />
			<rect x={19} y={28} width={10} height={12} />
		</g>
	),
	handshake: (
		<g>
			<path d="M4 22 L12 16 L20 20 L28 16 L36 16 L44 22" />
			<path d="M12 16 V30 L22 38 C 24 40, 27 40, 29 38 L36 30 V16" />
			<path d="M20 20 L26 26" />
		</g>
	),
	globe: (
		<g>
			<circle cx={24} cy={24} r={16} />
			<ellipse cx={24} cy={24} rx={7} ry={16} />
			<line x1={8} y1={24} x2={40} y2={24} />
		</g>
	),
};
export type IconName = keyof typeof ICON;
export const Icon: React.FC<{name: string; size: number; color: string; stroke?: number}> = ({name, size, color, stroke = 2.4}) => (
	<svg width={size} height={size} viewBox="0 0 48 48" style={{overflow: 'visible', flexShrink: 0}}>
		<g fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
			{ICON[name]}
		</g>
	</svg>
);

// ---------------------------------------------------------------------------
// Recreated platform UI (generic content — no invented brands or prices)
// ---------------------------------------------------------------------------
const chip = (bg: string, fg: string, size = 26): React.CSSProperties => ({display: 'inline-flex', alignItems: 'center', gap: 8, padding: `${size * 0.22}px ${size * 0.6}px`, borderRadius: 999, background: bg, color: fg, fontFamily: PF.ar, fontWeight: 600, fontSize: size, whiteSpace: 'nowrap'});

export type Listing = {title: string; cat: string; rfq?: boolean; art: 'steel' | 'grain' | 'solar' | 'med' | 'pack' | 'fabric'};
export const LISTINGS: Listing[] = [
	{title: 'حديد تسليح', cat: 'مواد بناء', art: 'steel'},
	{title: 'طلب: ألواح شمسية', cat: 'طاقة', rfq: true, art: 'solar'},
	{title: 'أرز وحبوب', cat: 'مواد غذائية', art: 'grain'},
	{title: 'طلب: معدات طبية', cat: 'قطاع صحي', rfq: true, art: 'med'},
	{title: 'مواد تغليف', cat: 'صناعة', art: 'pack'},
	{title: 'أقمشة ومنسوجات', cat: 'نسيج', art: 'fabric'},
];

const Art: React.FC<{k: Listing['art']}> = ({k}) => (
	<svg width="100%" height="100%" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
		<defs>
			<linearGradient id={`la-${k}`} x1="0" y1="0" x2="1" y2="1">
				<stop offset="0%" stopColor={P.deep} />
				<stop offset="100%" stopColor={P.navy} />
			</linearGradient>
		</defs>
		<rect width={400} height={240} fill={`url(#la-${k})`} />
		<circle cx={300} cy={60} r={120} fill={P.gold} opacity={0.12} />
		<g fill="none" stroke={P.goldLight} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
			{k === 'steel' ? [0, 1, 2, 3, 4].map((i) => <line key={i} x1={80} y1={80 + i * 22} x2={320} y2={60 + i * 22} />) : null}
			{k === 'solar' ? (
				<g>
					<path d="M110 170 L150 70 H290 L250 170 Z" />
					<path d="M130 120 H270 M200 70 L180 170 M150 70 L130 120" />
				</g>
			) : null}
			{k === 'grain' ? (
				<g>
					<path d="M140 180 C 130 120, 170 80, 200 70 C 230 80, 270 120, 260 180 Z" />
					<path d="M200 70 V180 M160 130 H240" />
				</g>
			) : null}
			{k === 'med' ? (
				<g>
					<rect x={140} y={70} width={120} height={110} rx={14} />
					<path d="M200 95 V155 M170 125 H230" strokeWidth={9} />
				</g>
			) : null}
			{k === 'pack' ? <path d="M120 100 L200 60 L280 100 V170 L200 210 L120 170 Z M120 100 L200 140 L280 100 M200 140 V210" /> : null}
			{k === 'fabric' ? [0, 1, 2].map((i) => <path key={i} d={`M100 ${90 + i * 35} C 160 ${60 + i * 35}, 240 ${120 + i * 35}, 300 ${90 + i * 35}`} />) : null}
		</g>
	</svg>
);

export const ListingCard: React.FC<{l: Listing; w?: number}> = ({l, w = 420}) => (
	<div dir="rtl" style={{width: w, borderRadius: 24, overflow: 'hidden', background: P.white, boxShadow: '0 30px 70px rgba(0,0,0,0.5)'}}>
		<div style={{height: w * 0.58, position: 'relative'}}>
			<Art k={l.art} />
			<span style={{position: 'absolute', right: 18, top: 18, ...chip(l.rfq ? P.teal : P.gold, l.rfq ? P.white : P.navy, 24)}}>{l.rfq ? 'طلب عرض سعر' : 'منتج'}</span>
		</div>
		<div style={{padding: '22px 24px 26px'}}>
			<div style={{fontFamily: PF.ar, fontWeight: 700, fontSize: 42, color: P.ink, whiteSpace: 'nowrap'}}>{l.title}</div>
			<div style={{display: 'flex', marginTop: 12}}>
				<span style={chip(P.gray, P.ink, 24)}>{l.cat}</span>
			</div>
		</div>
	</div>
);

export const SERVICES = [
	{title: 'مستندات التصدير', en: 'Export Documentation Assistance', icon: 'box'},
	{title: 'شهادة المنشأ', en: 'Certificate of Origin', icon: 'cert'},
	{title: 'استشارات قانونية وتجارية', en: 'Trade Law & Legal Advisory', icon: 'law'},
	{title: 'استشارات نمو الأعمال', en: 'Business Growth Consulting', icon: 'growth'},
];
export const ServiceCard: React.FC<{s: (typeof SERVICES)[number]; w?: number; press?: number}> = ({s, w = 820, press = 0}) => (
	<div dir="rtl" style={{width: w, padding: '30px 34px', boxSizing: 'border-box', borderRadius: 30, background: P.white, boxShadow: `0 40px 90px rgba(0,0,0,0.55), 0 0 ${press * 40}px rgba(212,166,41,0.8)`, display: 'flex', alignItems: 'center', gap: 26, transform: `scale(${1 + press * 0.03})`}}>
		<div style={{width: 120, height: 120, borderRadius: 28, background: `linear-gradient(145deg, ${P.teal}, #137C74)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
			<Icon name={s.icon} size={72} color={P.white} stroke={2.6} />
		</div>
		<div style={{flex: 1, minWidth: 0}}>
			<div style={{fontFamily: PF.ar, fontWeight: 700, fontSize: 48, lineHeight: 1.25, color: P.ink, whiteSpace: 'nowrap'}}>{s.title}</div>
			<div style={{fontFamily: PF.en, fontWeight: 600, fontSize: 26, color: '#5B6B85', direction: 'ltr', textAlign: 'right', marginTop: 4}}>{s.en}</div>
		</div>
	</div>
);

/** A real platform screenshot (public/tradepoint/) as a floating device panel, with a passing light sweep. */
export const SHOTS = {
	home: {src: 'tradepoint/home.jpg', w: 1280, h: 2050},
	members: {src: 'tradepoint/members.jpg', w: 1280, h: 2380},
	membersBanner: {src: 'tradepoint/members-banner.jpg', w: 1175, h: 806},
	memberDiamond: {src: 'tradepoint/member-diamond.jpg', w: 1014, h: 589},
	investHero: {src: 'tradepoint/invest-hero.jpg', w: 1280, h: 1715},
};
export const Shot: React.FC<{shot: (typeof SHOTS)[keyof typeof SHOTS]; w: number; radius?: number; sweep?: number; children?: React.ReactNode; style?: React.CSSProperties}> = ({shot, w, radius = 28, sweep = -1, children, style}) => {
	const h = (w * shot.h) / shot.w;
	return (
		<div style={{width: w, height: h, borderRadius: radius, overflow: 'hidden', position: 'relative', border: '3px solid rgba(245,245,242,0.22)', boxShadow: '0 50px 120px rgba(0,0,0,0.7), 0 0 60px rgba(212,166,41,0.18)', background: P.navy, ...style}}>
			<Img src={staticFile(shot.src)} style={{width: '100%', height: '100%', display: 'block'}} />
			{sweep > -0.5 && sweep < 1.5 ? <div style={{position: 'absolute', inset: 0, background: `linear-gradient(115deg, rgba(255,255,255,0) ${sweep * 100 - 18}%, rgba(255,255,255,0.16) ${sweep * 100}%, rgba(255,255,255,0) ${sweep * 100 + 18}%)`}} /> : null}
			{children}
		</div>
	);
};

// ---------------------------------------------------------------------------
// TAMKEEN logo — vector rebuild of the supplied logo, reversed for dark screens
// ---------------------------------------------------------------------------
const hexPath = (r: number, cx: number, cy: number) =>
	Array.from({length: 6}, (_, i) => {
		const a = (Math.PI / 3) * i;
		return `${i ? 'L' : 'M'}${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
	}).join('') + 'Z';
const T_HEX: {x: number; y: number; r: number; navy: boolean}[] = [
	...[[343, 72], [225, 128], [463, 128], [122, 178], [565, 178], [122, 418], [565, 418], [225, 470], [463, 470]].map(([x, y]) => ({x, y, r: 40, navy: true})),
	...[[343, 178], [225, 237], [463, 237], [343, 297], [343, 418]].map(([x, y]) => ({x, y, r: 58, navy: false})),
	...[[122, 298], [565, 298], [343, 523]].map(([x, y]) => ({x, y, r: 40, navy: false})),
	...[[225, 360], [463, 360]].map(([x, y]) => ({x, y, r: 58, navy: true})),
];
export const TamkeenLogo: React.FC<{cx: number; cy: number; k: number; frame: number; start: number}> = ({cx, cy, k, frame: f, start}) => (
	<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
		{T_HEX.map((h, i) => {
			const dx = (h.x - 343) * k;
			const dy = (h.y - 297) * k;
			const order = Math.hypot(dx, dy) / (200 * k * 1.4);
			const p = ramp(f, start + order * 10 + (i % 3), start + order * 10 + (i % 3) + 14, 0, 1, expoOut);
			if (p <= 0) return null;
			return <path key={i} d={hexPath(h.r * k * 0.9 * p, cx + lerp(dx * 2.6, dx, p), cy + lerp(dy * 2.6, dy, p))} fill={h.navy ? P.white : '#1DB597'} opacity={p} style={{filter: `drop-shadow(0 0 10px ${h.navy ? 'rgba(245,245,242,0.35)' : 'rgba(29,181,151,0.7)'})`}} />;
		})}
	</svg>
);
