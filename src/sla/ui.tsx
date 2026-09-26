import React from 'react';
import {expoOut, ramp} from '../theme';
import {S, SF} from './theme';

/**
 * Arabic text revealed WORD BY WORD, right-to-left (never letter by letter — that breaks joining).
 * Each word is its own shaping run (words are separated by spaces), wiped in from the right with blur-to-sharp.
 */
export const ArWords: React.FC<{
	text: string;
	frame: number;
	start: number;
	stagger?: number;
	dur?: number;
	style?: React.CSSProperties;
	wordStyle?: (i: number) => React.CSSProperties;
	justify?: 'center' | 'flex-start' | 'flex-end';
}> = ({text, frame, start, stagger = 4, dur = 22, style, wordStyle, justify = 'center'}) => {
	const words = text.split(' ');
	return (
		<div dir="rtl" lang="ar" style={{display: 'flex', flexDirection: 'row', justifyContent: justify, whiteSpace: 'nowrap', fontFamily: SF.ar, ...style}}>
			{words.map((w, i) => {
				const p = ramp(frame, start + i * stagger, start + i * stagger + dur, 0, 1, expoOut);
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							padding: '0.18em 0.06em 0.26em',
							marginInlineEnd: i < words.length - 1 ? '0.2em' : 0,
							clipPath: `inset(0 0 0 ${(1 - p) * 100}%)`,
							transform: `translateY(${(1 - p) * 0.25}em)`,
							filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
							opacity: 0.25 + 0.75 * p,
							...(wordStyle ? wordStyle(i) : {}),
						}}
					>
						{w}
					</span>
				);
			})}
		</div>
	);
};

/** Small Arabic label (no letter-spacing on Arabic). */
export const ArLabel: React.FC<{children: React.ReactNode; size?: number; color?: string; weight?: number; style?: React.CSSProperties}> = ({
	children,
	size = 32,
	color = S.dim,
	weight = 500,
	style,
}) => (
	<div dir="rtl" lang="ar" style={{fontFamily: SF.ar, fontSize: size, fontWeight: weight, color, whiteSpace: 'nowrap', lineHeight: 1.35, ...style}}>
		{children}
	</div>
);

/** Pointed (equilateral) arch path, springline at y=0, legs down to y=legs, apex at y=-0.866w. */
export const archPath = (w: number, legs: number) => {
	const h = 0.866 * w;
	return `M ${-w / 2} ${legs} L ${-w / 2} 0 A ${w} ${w} 0 0 1 0 ${-h} A ${w} ${w} 0 0 1 ${w / 2} 0 L ${w / 2} ${legs}`;
};

/** The recurring gold arch (portal in S2, emblem in S8): double thin line, drawn on. */
export const Arch: React.FC<{w: number; legs: number; draw: number; glow?: number; stroke?: number; inner?: boolean}> = ({
	w,
	legs,
	draw,
	glow = 0,
	stroke = 2,
	inner = true,
}) => (
	<g>
		<path d={archPath(w, legs)} fill="none" stroke={S.gold} strokeWidth={stroke} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} style={{filter: `drop-shadow(0 0 ${6 + glow * 14}px rgba(201,164,92,${0.35 + glow * 0.4}))`}} />
		{inner ? (
			<path d={archPath(w * 0.86, legs)} fill="none" stroke={S.goldLight} strokeOpacity={0.55} strokeWidth={stroke * 0.6} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ramp(draw, 0.15, 1)} transform={`translate(0 ${w * 0.02})`} />
		) : null}
	</g>
);

/** Glass surface style. */
export const glass = (o = 1, border = S.hair): React.CSSProperties => ({
	background: `linear-gradient(160deg, rgba(244,242,236,${0.075 * o}) 0%, rgba(244,242,236,${0.03 * o}) 60%, rgba(10,15,22,${0.55 * o}) 100%)`,
	border: `1.5px solid ${border}`,
	boxShadow: `0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,${0.1 * o})`,
	borderRadius: 18,
});

/** Text-like bars (the texture of legal text without inventing content). RTL: bars grow from the right. */
export const Bars: React.FC<{widths: number[]; p: number; color?: string; h?: number; gap?: number}> = ({widths, p, color = 'rgba(244,242,236,0.32)', h = 8, gap = 14}) => (
	<div style={{display: 'flex', flexDirection: 'column', gap, alignItems: 'flex-end'}}>
		{widths.map((w, i) => (
			<div key={i} style={{height: h, borderRadius: h, background: color, width: `${w * 100 * ramp(p, i * 0.1, 0.55 + i * 0.1)}%`}} />
		))}
	</div>
);

/** Thin-line service icons (48×48 viewBox). */
export const ICONS = {
	library: (
		<g>
			<rect x={9} y={10} width={7} height={29} rx={1} />
			<rect x={18} y={8} width={7} height={31} rx={1} />
			<path d="M28 11 L34 9.5 L40.5 37 L34.5 38.5 Z" />
			<line x1={6} y1={41} x2={42} y2={41} />
		</g>
	),
	contract: (
		<g>
			<path d="M12 6 H30 L38 14 V42 H12 Z" />
			<path d="M30 6 V14 H38" />
			<line x1={17} y1={20} x2={33} y2={20} />
			<line x1={17} y1={26} x2={33} y2={26} />
			<path d="M17 36 C 20 31, 22 39, 25 34 S 30 35, 33 33" />
		</g>
	),
	translation: (
		<g>
			<rect x={6} y={8} width={22} height={26} rx={2} />
			<rect x={20} y={15} width={22} height={26} rx={2} />
			<path d="M11 19 C 13 16, 17 16, 17 20 L 17 24 M 11 24 H 21" />
			<path d="M26 35 L 31 22 L 36 35 M 28 31 H 34" />
		</g>
	),
	consultation: (
		<g>
			<path d="M7 10 H33 V28 H18 L11 34 V28 H7 Z" />
			<path d="M20 16 C 20 13, 26 13, 26 17 C 26 19.5, 23 19.5, 23 22" />
			<circle cx={23} cy={25} r={0.6} />
			<path d="M36 18 H41 V34 H37 V39 L32 34 H22 V31" />
		</g>
	),
	cases: (
		<g>
			<path d="M6 14 H19 L23 18 H42 V40 H6 Z" />
			<line x1={6} y1={22} x2={42} y2={22} />
			<line x1={13} y1={29} x2={30} y2={29} />
			<line x1={13} y1={34} x2={24} y2={34} />
		</g>
	),
	smart: (
		<g>
			<rect x={13} y={13} width={22} height={22} />
			<rect x={13} y={13} width={22} height={22} transform="rotate(45 24 24)" />
			<circle cx={24} cy={24} r={4} />
		</g>
	),
	shield: (
		<g>
			<path d="M24 5 L40 11 V23 C 40 33, 33 40, 24 43 C 15 40, 8 33, 8 23 V11 Z" />
			<path d="M17 24 L22 29 L31 19" />
		</g>
	),
	document: (
		<g>
			<path d="M12 6 H30 L38 14 V42 H12 Z" />
			<path d="M30 6 V14 H38" />
			<line x1={17} y1={22} x2={33} y2={22} />
			<line x1={17} y1={28} x2={33} y2={28} />
			<line x1={17} y1={34} x2={27} y2={34} />
		</g>
	),
	mobile: (
		<g>
			<rect x={14} y={5} width={20} height={38} rx={4} />
			<line x1={21} y1={9} x2={27} y2={9} />
			<circle cx={24} cy={38} r={1.4} />
		</g>
	),
	gauge: (
		<g>
			<path d="M8 32 A 16 16 0 0 1 40 32" />
			<line x1={24} y1={32} x2={32} y2={21} />
			<circle cx={24} cy={32} r={2} />
		</g>
	),
	timeline: (
		<g>
			<line x1={12} y1={8} x2={12} y2={40} />
			<circle cx={12} cy={12} r={3} />
			<circle cx={12} cy={24} r={3} />
			<circle cx={12} cy={36} r={3} />
			<line x1={20} y1={12} x2={38} y2={12} />
			<line x1={20} y1={24} x2={34} y2={24} />
			<path d="M20 36 L24 40 L32 31" />
		</g>
	),
};
export type IconName = keyof typeof ICONS;

export const Icon: React.FC<{name: IconName; size: number; color?: string; stroke?: number; style?: React.CSSProperties}> = ({name, size, color = S.gold, stroke = 1.6, style}) => (
	<svg width={size} height={size} viewBox="0 0 48 48" style={{overflow: 'visible', ...style}}>
		<g fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
			{ICONS[name]}
		</g>
	</svg>
);

/** Service title in the top band (Arabic, centred, 92 px). */
export const TopTitle: React.FC<{text: string; frame: number; start: number; end: number; y?: number}> = ({text, frame, start, end, y = 262}) => {
	const out = ramp(frame, end - 12, end);
	if (frame < start || out >= 1) return null;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y, opacity: 1 - out, transform: `translateY(${-out * 24}px)`, filter: out > 0 ? `blur(${out * 8}px)` : undefined}}>
			<ArWords text={text} frame={frame} start={start} stagger={5} dur={20} style={{fontSize: 92, fontWeight: 600, color: S.white, lineHeight: 1.3}} />
		</div>
	);
};

/** Supporting line in the lower band: Arabic phrases separated by gold dots. */
export const LowerLine: React.FC<{parts: string[]; frame: number; start: number; end: number; y?: number; size?: number}> = ({parts, frame, start, end, y = 1340, size = 42}) => {
	const out = ramp(frame, end - 10, end);
	if (frame < start || out >= 1) return null;
	return (
		<div dir="rtl" style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: 1 - out}}>
			{parts.map((t, i) => {
				const p = ramp(frame, start + i * 5, start + i * 5 + 18, 0, 1, expoOut);
				return (
					<React.Fragment key={i}>
						{i > 0 ? <div style={{width: 9, height: 9, borderRadius: 5, background: S.gold, opacity: p, boxShadow: `0 0 10px ${S.gold}`}} /> : null}
						<span style={{fontFamily: SF.ar, fontSize: size, fontWeight: 400, color: 'rgba(244,242,236,0.86)', opacity: p, transform: `translateY(${(1 - p) * 14}px)`, display: 'inline-block', whiteSpace: 'nowrap'}}>{t}</span>
					</React.Fragment>
				);
			})}
		</div>
	);
};
