import React from 'react';
import {C, F, expoOut, ramp, rnd, scramble, smooth} from '../theme';

export const DOC_W = 600;
export const DOC_H = 820;
export const SERIAL = 'IQ-COO-2026-0847-3921';
export const DOC_HASH = 'SHA-256 · 9F2C 41D7 B08E 6A13 … E41A';

// ---------------------------------------------------------------------------
// Security guilloche rosette (generated once)
// ---------------------------------------------------------------------------
const GUILLOCHE = (() => {
	const paths: string[] = [];
	for (let k = 0; k < 14; k++) {
		let d = '';
		for (let i = 0; i <= 360; i++) {
			const th = (i / 360) * Math.PI * 2;
			const r = 150 + k * 6 + 22 * Math.sin(9 * th + k * 0.45) + 8 * Math.sin(23 * th - k * 0.3);
			const x = 300 + r * Math.cos(th);
			const y = 420 + r * Math.sin(th);
			d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
		}
		paths.push(d + 'Z');
	}
	return paths;
})();

// ---------------------------------------------------------------------------
// QR code (deterministic, with real finder / timing patterns)
// ---------------------------------------------------------------------------
const QN = 25;
const QR = (() => {
	const m: boolean[][] = Array.from({length: QN}, () => Array(QN).fill(false));
	const reserved: boolean[][] = Array.from({length: QN}, () => Array(QN).fill(false));
	const finder = (ox: number, oy: number) => {
		for (let y = -1; y <= 7; y++)
			for (let x = -1; x <= 7; x++) {
				const X = ox + x;
				const Y = oy + y;
				if (X < 0 || Y < 0 || X >= QN || Y >= QN) continue;
				reserved[Y][X] = true;
				const ring = Math.max(Math.abs(x - 3), Math.abs(y - 3));
				m[Y][X] = x >= 0 && y >= 0 && x <= 6 && y <= 6 && ring !== 2;
			}
	};
	finder(0, 0);
	finder(QN - 7, 0);
	finder(0, QN - 7);
	// alignment
	for (let y = -2; y <= 2; y++)
		for (let x = -2; x <= 2; x++) {
			const ring = Math.max(Math.abs(x), Math.abs(y));
			m[18 + y][18 + x] = ring !== 1;
			reserved[18 + y][18 + x] = true;
		}
	for (let i = 8; i < QN - 8; i++) {
		m[6][i] = i % 2 === 0;
		m[i][6] = i % 2 === 0;
		reserved[6][i] = reserved[i][6] = true;
	}
	const cells: {x: number; y: number; order: number}[] = [];
	for (let y = 0; y < QN; y++)
		for (let x = 0; x < QN; x++) {
			const on = reserved[y][x] ? m[y][x] : rnd(`q${x}-${y}`) > 0.52;
			if (on) cells.push({x, y, order: reserved[y][x] ? rnd(`qo${x}${y}`) * 0.25 : 0.2 + rnd(`qo${x}${y}`) * 0.8});
		}
	return cells;
})();

export const QRCode: React.FC<{p: number; size: number}> = ({p, size}) => {
	const s = size / QN;
	return (
		<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{overflow: 'visible'}}>
			{QR.map((c, i) => {
				const q = ramp(p, c.order * 0.75, c.order * 0.75 + 0.25);
				if (q <= 0) return null;
				const sc = 0.4 + 0.6 * q;
				return (
					<rect
						key={i}
						x={c.x * s + (s * (1 - sc)) / 2}
						y={c.y * s + (s * (1 - sc)) / 2}
						width={s * sc + 0.3}
						height={s * sc + 0.3}
						fill={q < 1 ? C.cyan : C.white}
						opacity={q}
					/>
				);
			})}
		</svg>
	);
};

// ---------------------------------------------------------------------------
// Seal with circular text
// ---------------------------------------------------------------------------
export const Seal: React.FC<{size: number; frame: number; color?: string; id: string}> = ({
	size,
	frame,
	color = C.gold,
	id,
}) => (
	<svg width={size} height={size} viewBox="0 0 140 140" style={{overflow: 'visible'}}>
		<defs>
			<path id={`sealtext-${id}`} d="M70 70 m-52 0 a52 52 0 1 1 104 0 a52 52 0 1 1 -104 0" />
		</defs>
		<circle cx={70} cy={70} r={66} fill="rgba(217,180,106,0.07)" stroke={color} strokeWidth={1.6} />
		<circle cx={70} cy={70} r={61} fill="none" stroke={color} strokeWidth={0.6} strokeDasharray="1.5 2.5" />
		<circle cx={70} cy={70} r={42} fill="none" stroke={color} strokeWidth={1} />
		<g transform={`rotate(${frame * 0.4} 70 70)`}>
			<text fill={color} fontFamily="JetBrains Mono" fontSize={8.6} fontWeight={500} letterSpacing={2.2}>
				<textPath href={`#sealtext-${id}`}>DIGITALLY ATTESTED · COMMERCIAL ATTACHÉ · </textPath>
			</text>
		</g>
		<g transform="translate(70 70)" fill="none" stroke={color} strokeWidth={1.1}>
			<rect x={-20} y={-20} width={40} height={40} />
			<rect x={-20} y={-20} width={40} height={40} transform="rotate(45)" />
			<circle r={11} />
			<path d="M-6 0.5 L-1.8 4.8 L6.5 -4.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
		</g>
	</svg>
);

export const Emblem: React.FC<{size: number; color?: string; frame: number}> = ({size, color = C.gold, frame}) => (
	<svg width={size} height={size} viewBox="0 0 60 60">
		<circle cx={30} cy={30} r={28} fill="none" stroke={color} strokeWidth={1.2} />
		<circle cx={30} cy={30} r={24.5} fill="none" stroke={color} strokeWidth={0.5} strokeDasharray="1 2" transform={`rotate(${frame * 0.3} 30 30)`} />
		<g transform="translate(30 30)" fill="none" stroke={color} strokeWidth={1}>
			<rect x={-12} y={-12} width={24} height={24} />
			<rect x={-12} y={-12} width={24} height={24} transform="rotate(45)" />
			<circle r={5} fill={color} fillOpacity={0.5} />
		</g>
	</svg>
);

// Hand-authored signature: tall capital loop, flowing script, crossing flourish.
let SIG_PATH: SVGPathElement | null = null;
/** Point along the signature stroke (0..1), for the pen's light head. Uses the live DOM. */
const sigPoint = (t: number) => {
	if (typeof document === 'undefined') return null;
	if (!SIG_PATH) {
		const ns = 'http://www.w3.org/2000/svg';
		const svg = document.createElementNS(ns, 'svg');
		svg.setAttribute('style', 'position:absolute;width:0;height:0;visibility:hidden');
		SIG_PATH = document.createElementNS(ns, 'path');
		SIG_PATH.setAttribute('d', SIGNATURE_D);
		svg.appendChild(SIG_PATH);
		document.body.appendChild(svg);
	}
	return SIG_PATH.getPointAtLength(SIG_PATH.getTotalLength() * t);
};

export const SIGNATURE_D =
	'M18 64 C 22 44, 30 18, 42 10 C 52 4, 54 20, 44 34 C 36 46, 24 52, 30 44 C 40 34, 58 36, 62 48 C 64 56, 58 60, 60 54 C 64 42, 74 38, 78 46 C 80 52, 78 58, 84 54 C 90 50, 92 40, 98 40 C 104 40, 100 54, 108 54 C 116 54, 120 30, 128 16 C 132 10, 136 14, 132 26 C 126 42, 122 56, 130 56 C 138 56, 142 44, 150 44 C 156 44, 152 56, 160 56 C 170 56, 176 44, 186 42 C 200 40, 214 40, 232 34 M 10 70 C 70 60, 150 58, 250 50';

// ---------------------------------------------------------------------------
// Document
// ---------------------------------------------------------------------------
export type DocState = {
	variant?: 'coo' | 'invoice';
	build?: number; // 0..1 wireframe → body → content
	scan?: number; // 0..1 beam position; <0 off
	signature?: number;
	seal?: number;
	qr?: number;
	serial?: number;
	validated?: number;
	identity?: number;
	sheen?: number; // band position -0.5..1.5
	glow?: number; // outer glow 0..1
	gold?: number; // gold frame intensity 0..1
	review?: number; // Attaché review mark (ring + tick, deliberately unlike the seal) 0..1
};

type Row = {y: number; h: number; label: string; bars?: number[]; text?: string; cols?: {label: string; text: string}[]};

const COO_ROWS: Row[] = [
	{y: 156, h: 70, label: 'Exporter', bars: [0.62, 0.41]},
	{y: 240, h: 70, label: 'Consignee', bars: [0.55, 0.34]},
	{
		y: 324,
		h: 56,
		label: '',
		cols: [
			{label: 'HS Code', text: '8471.30.00'},
			{label: 'Transport', text: 'SEA · FCL'},
			{label: 'Invoice No.', text: 'INV-58213'},
		],
	},
	{y: 394, h: 96, label: 'Description of goods', bars: [0.86, 0.72, 0.52]},
	{y: 504, h: 52, label: 'Country of origin', bars: [0.3]},
];

const INV_ROWS: Row[] = [
	{y: 156, h: 70, label: 'Seller', bars: [0.58, 0.38]},
	{y: 240, h: 70, label: 'Buyer', bars: [0.5, 0.32]},
	{y: 324, h: 200, label: 'Items', bars: [0.8, 0.7, 0.76, 0.64, 0.72]},
	{y: 540, h: 50, label: 'Total amount', bars: [0.28]},
];

const Bars: React.FC<{bars: number[]; p: number; gold?: boolean; table?: boolean}> = ({bars, p, gold, table}) => (
	<div style={{display: 'flex', flexDirection: 'column', gap: table ? 14 : 9, marginTop: 10}}>
		{bars.map((w, i) => (
			<div key={i} style={{display: 'flex', gap: 12, alignItems: 'center'}}>
				<div
					style={{
						height: 7,
						width: `${w * 100 * ramp(p, i * 0.12, 0.6 + i * 0.12, 0, 1)}%`,
						borderRadius: 4,
						background: gold
							? 'linear-gradient(90deg, rgba(217,180,106,0.8), rgba(217,180,106,0.35))'
							: 'linear-gradient(90deg, rgba(244,247,251,0.42), rgba(244,247,251,0.16))',
					}}
				/>
				{table ? (
					<div style={{marginLeft: 'auto', height: 7, width: 60 * ramp(p, 0.3 + i * 0.1, 0.9), borderRadius: 4, background: 'rgba(79,216,255,0.35)'}} />
				) : null}
			</div>
		))}
	</div>
);

export const CertificateDoc: React.FC<DocState & {frame: number; id: string}> = ({
	frame,
	id,
	variant = 'coo',
	build = 1,
	scan = -1,
	signature = 0,
	seal = 0,
	qr = 0,
	serial = 0,
	validated = 0,
	identity = 0,
	sheen = -1,
	glow = 0,
	gold = 0,
	review = 0,
}) => {
	const outline = ramp(build, 0, 0.38, 0, 1, smooth);
	const body = ramp(build, 0.22, 0.6, 0, 1, smooth);
	const content = (i: number) => ramp(build, 0.38 + i * 0.07, 0.72 + i * 0.07, 0, 1, expoOut);
	const rows = variant === 'coo' ? COO_ROWS : INV_ROWS;
	const scanY = scan * DOC_H;
	const title = variant === 'coo' ? 'Certificate of Origin' : 'Commercial Invoice';
	const perim = 2 * (DOC_W + DOC_H);

	return (
		<div style={{position: 'relative', width: DOC_W, height: DOC_H}}>
			{/* body */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: 6,
					opacity: body,
					overflow: 'hidden',
					background:
						'linear-gradient(160deg, rgba(22,44,78,0.92) 0%, rgba(10,24,46,0.95) 45%, rgba(6,15,31,0.97) 100%)',
					boxShadow: `0 60px 140px rgba(0,0,0,0.65), 0 0 ${60 + glow * 60}px rgba(79,216,255,${0.05 + glow * 0.2}), inset 0 1px 0 rgba(255,255,255,0.12)`,
				}}
			>
				<svg width={DOC_W} height={DOC_H} style={{position: 'absolute', inset: 0, opacity: 0.08 + gold * 0.06}}>
					{GUILLOCHE.map((d, i) => (
						<path key={i} d={d} fill="none" stroke={C.gold} strokeWidth={0.6} />
					))}
				</svg>
				{/* micro-line security band at top */}
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: 0,
						height: 6,
						background: `linear-gradient(90deg, ${C.cyan}, ${C.gold} 60%, rgba(217,180,106,0.2))`,
						opacity: 0.85,
					}}
				/>
			</div>

			{/* wireframe draw-on */}
			<svg width={DOC_W} height={DOC_H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<rect
					x={0.5}
					y={0.5}
					width={DOC_W - 1}
					height={DOC_H - 1}
					rx={6}
					fill="none"
					stroke={gold > 0 ? `rgba(217,180,106,${0.35 + gold * 0.5})` : 'rgba(170,230,255,0.55)'}
					strokeWidth={1.2}
					strokeDasharray={`${perim} ${perim}`}
					strokeDashoffset={perim * (1 - outline)}
				/>
				{outline < 1 && outline > 0 ? (
					<rect x={0.5} y={0.5} width={DOC_W - 1} height={DOC_H - 1} rx={6} fill="none" stroke="#fff" strokeWidth={2.4} strokeDasharray={`18 ${perim}`} strokeDashoffset={perim * (1 - outline) - perim + 18} style={{filter: `drop-shadow(0 0 6px ${C.cyan})`}} />
				) : null}
				{/* corner registration marks */}
				{[
					[14, 14, 1, 1],
					[DOC_W - 14, 14, -1, 1],
					[14, DOC_H - 14, 1, -1],
					[DOC_W - 14, DOC_H - 14, -1, -1],
				].map(([x, y, sx, sy], i) => (
					<path key={i} d={`M${x} ${y + sy * 14} V${y} H${x + sx * 14}`} stroke={C.cyan} strokeOpacity={0.6 * outline} fill="none" strokeWidth={1.2} />
				))}
			</svg>

			{/* header */}
			<div style={{position: 'absolute', left: 44, top: 40, display: 'flex', alignItems: 'center', gap: 18, opacity: content(0), transform: `translateY(${(1 - content(0)) * 10}px)`}}>
				<Emblem size={58} frame={frame} />
				<div>
					<div style={{fontFamily: F.serif, fontWeight: 600, fontSize: 33, color: C.white, letterSpacing: 0.4, lineHeight: 1}}>{title}</div>
					<div style={{fontFamily: F.mono, fontSize: 12.5, letterSpacing: 2.4, color: C.dim, marginTop: 9, textTransform: 'uppercase'}}>
						{variant === 'coo' ? 'International Trade · Attestation Form' : 'Trade Document · Invoice Record'}
					</div>
				</div>
			</div>
			{/* validated badge */}
			{validated > 0 ? (
				<div
					style={{
						position: 'absolute',
						right: 34,
						top: 50,
						padding: '7px 12px 7px 10px',
						border: `1px solid rgba(79,216,255,${0.7 * validated})`,
						borderRadius: 30,
						display: 'flex',
						alignItems: 'center',
						gap: 8,
						fontFamily: F.mono,
						fontSize: 12,
						letterSpacing: 2.4,
						color: C.cyan,
						opacity: validated,
						transform: `scale(${0.8 + 0.2 * validated})`,
						background: 'rgba(79,216,255,0.08)',
						boxShadow: `0 0 ${18 * validated}px rgba(79,216,255,0.35)`,
					}}
				>
					<div style={{width: 7, height: 7, borderRadius: 4, background: C.cyan, boxShadow: `0 0 8px ${C.cyan}`, opacity: 0.6 + 0.4 * Math.sin(frame / 4)}} />
					VALIDATED
				</div>
			) : null}
			<div style={{position: 'absolute', left: 44, right: 44, top: 128, height: 1, background: `linear-gradient(90deg, ${C.gold}, rgba(217,180,106,0.1))`, transform: `scaleX(${content(0)})`, transformOrigin: 'left'}} />

			{/* rows */}
			{rows.map((row, i) => {
				const p = content(i + 1);
				const locked = scan >= 0 ? ramp(scanY, row.y + row.h * 0.5, row.y + row.h * 0.5 + 70) : 0;
				return (
					<div key={i} style={{position: 'absolute', left: 44, right: 44, top: row.y, height: row.h, opacity: p}}>
						{row.cols ? (
							<div style={{display: 'flex', gap: 30}}>
								{row.cols.map((c, j) => (
									<div key={j} style={{flex: 1}}>
										<div style={{fontFamily: F.mono, fontSize: 13, letterSpacing: 2, color: C.faint, textTransform: 'uppercase'}}>{c.label}</div>
										<div style={{fontFamily: F.mono, fontSize: 15, color: C.white, marginTop: 8, letterSpacing: 0.5}}>{c.text}</div>
									</div>
								))}
							</div>
						) : (
							<>
								<div style={{fontFamily: F.mono, fontSize: 13, letterSpacing: 2, color: C.faint, textTransform: 'uppercase'}}>{row.label}</div>
								<Bars bars={row.bars!} p={p} gold={row.label === 'Total amount'} table={row.label === 'Items'} />
							</>
						)}
						{scan >= 0 ? <Brackets p={locked} /> : null}
					</div>
				);
			})}

			{/* attestation zone */}
			{variant === 'coo' ? (
				<>
					<div style={{position: 'absolute', left: 44, right: 44, top: 578, height: 1, background: C.line, opacity: content(6)}} />
					<div style={{position: 'absolute', left: 44, top: 596, opacity: content(6)}}>
						<div style={{fontFamily: F.mono, fontSize: 13, letterSpacing: 2, color: C.faint}}>ATTESTED BY · COMMERCIAL ATTACHÉ</div>
						<svg width={260} height={82} viewBox="0 0 260 82" style={{marginTop: 6, overflow: 'visible'}}>
							<line x1={0} y1={78} x2={250} y2={78} stroke={C.line} />
							<path
								d={SIGNATURE_D}
								fill="none"
								stroke="#EAF8FF"
								strokeWidth={2.2}
								strokeLinecap="round"
								strokeLinejoin="round"
								pathLength={1}
								strokeDasharray="1 1"
								strokeDashoffset={1 - signature}
								style={{filter: `drop-shadow(0 0 ${3 + (signature < 1 ? 5 : 1)}px ${C.cyan})`}}
							/>
							{signature > 0 && signature < 1
								? (() => {
										const pt = sigPoint(signature);
										return pt ? (
											<g style={{filter: `drop-shadow(0 0 10px ${C.cyan})`}}>
												<circle cx={pt.x} cy={pt.y} r={9} fill={C.cyan} fillOpacity={0.3} />
												<circle cx={pt.x} cy={pt.y} r={3.4} fill="#FFFFFF" />
											</g>
										) : null;
									})()
								: null}
						</svg>
					</div>
					{/* Attaché review mark: a simple ring + tick in the margin, never the official seal */}
					{review > 0 ? (
						<svg width={64} height={64} viewBox="0 0 40 40" style={{position: 'absolute', left: 494, top: 494, overflow: 'visible', opacity: Math.min(1, review * 2), filter: `drop-shadow(0 0 ${4 + (1 - review) * 10}px rgba(217,180,106,0.7))`}}>
							<circle cx={20} cy={20} r={17} fill="rgba(217,180,106,0.08)" stroke={C.gold} strokeWidth={1.4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ramp(review, 0, 0.6)} transform="rotate(-90 20 20)" />
							<path d="M12.5 20.5 L17.8 25.8 L28 15" fill="none" stroke={C.gold} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ramp(review, 0.45, 1)} />
						</svg>
					) : null}
					{/* seal stamp */}
					{seal > 0 ? (
						<div
							style={{
								position: 'absolute',
								left: 318,
								top: 604,
								opacity: Math.min(1, seal * 2),
								transform: `scale(${1 + (1 - seal) * 0.9}) rotate(${(1 - seal) * -35}deg)`,
								filter: `drop-shadow(0 0 ${6 + (1 - seal) * 20}px rgba(217,180,106,0.6))`,
							}}
						>
							<Seal size={120} frame={frame} id={id} />
						</div>
					) : null}
					{/* QR */}
					<div style={{position: 'absolute', left: 440, top: 612, width: 118, height: 118, opacity: qr > 0 ? 1 : 0}}>
						<div style={{position: 'absolute', inset: -8, border: `1px solid rgba(79,216,255,${0.4 * qr})`, borderRadius: 4}} />
						<QRCode p={qr} size={118} />
					</div>
					{/* serial */}
					<div style={{position: 'absolute', left: 44, top: 718, opacity: serial > 0 ? 1 : 0}}>
						<div style={{fontFamily: F.mono, fontSize: 13, letterSpacing: 2, color: C.faint}}>SERIAL NO.</div>
						<div style={{fontFamily: F.mono, fontWeight: 500, fontSize: 19, color: C.gold, marginTop: 6, letterSpacing: 1.2}}>
							{scramble(SERIAL, serial, frame, 'serial')}
						</div>
					</div>
					{/* identity */}
					<div style={{position: 'absolute', left: 44, right: 44, bottom: 22, display: 'flex', justifyContent: 'space-between', fontFamily: F.mono, fontSize: 12, letterSpacing: 1.6, color: 'rgba(79,216,255,0.75)', opacity: identity}}>
						<span>{scramble(DOC_HASH, identity, frame, 'hash')}</span>
						<span style={{color: C.faint}}>ID · SECURE</span>
					</div>
				</>
			) : null}

			{/* scan beam */}
			{scan >= 0 && scan <= 1 ? (
				<div style={{position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 6, pointerEvents: 'none'}}>
					<div
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							top: 0,
							height: scanY,
							backgroundImage: 'radial-gradient(rgba(79,216,255,0.35) 1px, transparent 1.4px)',
							backgroundSize: '14px 14px',
							WebkitMaskImage: 'linear-gradient(0deg, rgba(0,0,0,1) 0px, rgba(0,0,0,0) 160px)',
							maskImage: 'linear-gradient(0deg, rgba(0,0,0,1) 0px, rgba(0,0,0,0) 160px)',
						}}
					/>
					<div style={{position: 'absolute', left: 0, right: 0, top: scanY - 140, height: 140, background: 'linear-gradient(180deg, rgba(79,216,255,0) 0%, rgba(79,216,255,0.16) 100%)'}} />
					<div style={{position: 'absolute', left: -10, right: -10, top: scanY - 1, height: 2, background: '#DFF8FF', boxShadow: `0 0 18px 4px ${C.cyan}, 0 0 60px 10px rgba(79,216,255,0.4)`}} />
				</div>
			) : null}

			{/* holographic sheen */}
			{sheen > -0.5 && sheen < 1.5 ? (
				<div style={{position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 6, pointerEvents: 'none', mixBlendMode: 'screen'}}>
					<div
						style={{
							position: 'absolute',
							top: -200,
							bottom: -200,
							width: 260,
							left: -300 + sheen * (DOC_W + 400),
							transform: 'rotate(18deg)',
							background:
								'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(79,216,255,0.10) 30%, rgba(255,255,255,0.22) 50%, rgba(217,180,106,0.12) 70%, rgba(255,255,255,0) 100%)',
						}}
					/>
				</div>
			) : null}
		</div>
	);
};

const Brackets: React.FC<{p: number}> = ({p}) => {
	if (p <= 0) return null;
	const c = `rgba(79,216,255,${p})`;
	const pad = -8 - (1 - p) * 14;
	const L = 12;
	const common: React.CSSProperties = {position: 'absolute', width: L, height: L, borderColor: c, borderStyle: 'solid', borderWidth: 0};
	return (
		<>
			<div style={{...common, left: pad, top: pad, borderLeftWidth: 1.5, borderTopWidth: 1.5}} />
			<div style={{...common, right: pad, top: pad, borderRightWidth: 1.5, borderTopWidth: 1.5}} />
			<div style={{...common, left: pad, bottom: pad, borderLeftWidth: 1.5, borderBottomWidth: 1.5}} />
			<div style={{...common, right: pad, bottom: pad, borderRightWidth: 1.5, borderBottomWidth: 1.5}} />
			<div style={{position: 'absolute', inset: -8, background: `rgba(79,216,255,${0.05 * p})`}} />
		</>
	);
};

/** Place a document in 3D at screen centre (x,y). */
export const DocPlace: React.FC<{
	x: number;
	y: number;
	scale: number;
	rx?: number;
	ry?: number;
	rz?: number;
	opacity?: number;
	blur?: number;
	children: React.ReactNode;
}> = ({x, y, scale, rx = 0, ry = 0, rz = 0, opacity = 1, blur = 0, children}) => (
	<div
		style={{
			position: 'absolute',
			left: x - DOC_W / 2,
			top: y - DOC_H / 2,
			width: DOC_W,
			height: DOC_H,
			opacity,
			transform: `perspective(1800px) scale(${scale}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
			transformStyle: 'preserve-3d',
			filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
		}}
	>
		{children}
	</div>
);
