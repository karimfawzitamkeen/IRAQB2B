import React from 'react';
import {C, F, expoOut, ramp} from '../theme';

/** Velocity-proportional directional blur (SVG filter on the axis of travel). */
export const DirBlur: React.FC<{
	id: string;
	vx: number;
	vy: number;
	k?: number;
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({id, vx, vy, k = 0.35, children, style}) => {
	const bx = Math.min(Math.abs(vx) * k, 28);
	const by = Math.min(Math.abs(vy) * k, 28);
	const on = bx > 0.25 || by > 0.25;
	return (
		<div style={{position: 'absolute', inset: 0, ...style}}>
			<svg style={{position: 'absolute', width: 0, height: 0}}>
				<defs>
					<filter id={id} x="-40%" y="-40%" width="180%" height="180%">
						<feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} />
					</filter>
				</defs>
			</svg>
			<div style={{position: 'absolute', inset: 0, filter: on ? `url(#${id})` : undefined}}>
				{children}
			</div>
		</div>
	);
};

/** Confirmation grammar: spinning arc → full ring → check stroke → glow. */
export const Check: React.FC<{
	/** 0..1 resolve progress; negative values = spinning (pending) */
	p: number;
	frame: number;
	size?: number;
	color?: string;
	stroke?: number;
	pending?: boolean;
}> = ({p, frame, size = 40, color = C.cyan, stroke = 1.6, pending}) => {
	const ring = ramp(p, 0, 0.55, 0, 1, expoOut);
	const tick = ramp(p, 0.4, 1, 0, 1, expoOut);
	const glow = ramp(p, 0.6, 1, 0, 1) * (1 - ramp(p, 1, 1.01));
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 40 40"
			style={{overflow: 'visible', filter: `drop-shadow(0 0 ${4 + glow * 8}px ${color})`}}
		>
			<circle cx={20} cy={20} r={18} fill="none" stroke={color} strokeOpacity={0.18} strokeWidth={stroke} />
			{pending && p <= 0 ? (
				<circle
					cx={20}
					cy={20}
					r={18}
					fill="none"
					stroke={color}
					strokeWidth={stroke}
					strokeLinecap="round"
					pathLength={1}
					strokeDasharray="0.22 0.78"
					transform={`rotate(${frame * 14} 20 20)`}
				/>
			) : null}
			{p > 0 ? (
				<>
					<circle
						cx={20}
						cy={20}
						r={18}
						fill={color}
						fillOpacity={0.08 * ring}
						stroke={color}
						strokeWidth={stroke}
						pathLength={1}
						strokeDasharray="1 1"
						strokeDashoffset={1 - ring}
						transform="rotate(-90 20 20)"
					/>
					<path
						d="M12.5 20.5 L17.8 25.8 L28 15"
						fill="none"
						stroke={color}
						strokeWidth={stroke + 0.6}
						strokeLinecap="round"
						strokeLinejoin="round"
						pathLength={1}
						strokeDasharray="1 1"
						strokeDashoffset={1 - tick}
					/>
				</>
			) : null}
		</svg>
	);
};

/** Word-by-word masked rise with blur-to-sharp. */
export const Words: React.FC<{
	text: string;
	frame: number;
	start: number;
	stagger?: number;
	dur?: number;
	style?: React.CSSProperties;
	wordStyle?: (i: number) => React.CSSProperties;
}> = ({text, frame, start, stagger = 4, dur = 26, style, wordStyle}) => {
	const words = text.split(' ');
	return (
		<div style={{whiteSpace: 'nowrap', ...style}}>
			{words.map((w, i) => {
				const p = ramp(frame, start + i * stagger, start + i * stagger + dur);
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							overflow: 'hidden',
							verticalAlign: 'top',
							padding: '0.08em 0 0.16em',
							marginRight: i < words.length - 1 ? '0.26em' : 0,
						}}
					>
						<span
							style={{
								display: 'inline-block',
								transform: `translateY(${(1 - p) * 105}%)`,
								filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
								opacity: 0.2 + 0.8 * p,
								...(wordStyle ? wordStyle(i) : {}),
							}}
						>
							{w}
						</span>
					</span>
				);
			})}
		</div>
	);
};

/** Mono, tracked, uppercase instrumentation label. */
export const Label: React.FC<{
	children: React.ReactNode;
	color?: string;
	size?: number;
	spacing?: number;
	style?: React.CSSProperties;
}> = ({children, color = C.dim, size = 15, spacing = 5, style}) => (
	<div
		style={{
			fontFamily: F.mono,
			fontWeight: 500,
			fontSize: size,
			letterSpacing: spacing,
			textTransform: 'uppercase',
			color,
			whiteSpace: 'nowrap',
			...style,
		}}
	>
		{children}
	</div>
);

/** Chapter marker, top-left: index · hairline · title. */
export const Chapter: React.FC<{
	frame: number;
	start: number;
	end: number;
	index: string;
	title: string;
	sub: string;
}> = ({frame, start, end, index, title, sub}) => {
	const pin = ramp(frame, start, start + 24);
	const pout = ramp(frame, end - 14, end, 0, 1);
	const o = pin * (1 - pout);
	if (o <= 0) return null;
	return (
		<div style={{position: 'absolute', left: 120, top: 96, opacity: o}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
				<Label color={C.gold} size={15} spacing={3}>
					{index}
				</Label>
				<div style={{width: 64 * pin, height: 1, background: `linear-gradient(90deg, ${C.gold}, rgba(217,180,106,0))`}} />
				<Label color={C.white} size={15} spacing={6} style={{transform: `translateX(${(1 - pin) * 16}px)`}}>
					{title}
				</Label>
			</div>
			<div
				style={{
					marginTop: 14,
					fontFamily: F.sans,
					fontWeight: 300,
					fontSize: 22,
					color: C.dim,
					letterSpacing: 0.3,
					transform: `translateY(${(1 - pin) * 10}px)`,
				}}
			>
				{sub}
			</div>
		</div>
	);
};
