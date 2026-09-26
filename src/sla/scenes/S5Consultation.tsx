import React from 'react';
import {AbsoluteFill} from 'remotion';
import {expoIn, expoInOut, expoOut, lerp, ramp} from '../../theme';
import {S, SCX, SF} from '../theme';
import {ArLabel, ArWords, Bars, LowerLine, TopTitle, glass} from '../ui';

/** Scene 5 — Legal consultation (345–435f). Organised assistance — no outcome promises. */
const CORE = {x: SCX, y: 880};
const CHIPS = [
	{t: 'نص قانوني', x: 300, y: 720, from: [-200, 520], gold: false},
	{t: 'بند العقد', x: 780, y: 720, from: [1280, 520], gold: false},
	{t: 'سابقة قضائية', x: 300, y: 1040, from: [-200, 1240], gold: false},
	{t: 'مؤشر مخاطر', x: 780, y: 1040, from: [1280, 1240], gold: true},
];
const SECTIONS = ['الأساس القانوني', 'التحليل', 'التوصية'];
export const RESPONSE = {x: SCX, y: 985, w: 720, h: 470};

export const S5Consultation: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 344 || f > 446) return null;
	const rise = ramp(f, 344, 358, 0, 1, expoOut);
	const drop = ramp(f, 366, 384, 0, 1, expoIn);
	const coreIn = ramp(f, 352, 374, 0, 1, expoOut);
	const hit = ramp(f, 382, 400, 0, 1, (t) => t);
	const resolve = ramp(f, 396, 414, 0, 1, expoInOut);
	const card = ramp(f, 400, 418, 0, 1, expoOut);
	const exit = ramp(f, 428, 444, 0, 1, expoIn);

	// question card: from S4's bright line up to the top of the hero, then down into the core
	const qy = lerp(lerp(880, 540, rise), CORE.y, drop);
	const qs = lerp(1, 0.18, drop);
	const qh = lerp(4, 124, rise);
	const cy = lerp(CORE.y, 600, resolve);
	const cs = lerp(1, 0.55, resolve);
	const energy = hit > 0 && hit < 1 ? 1 - hit : 0;

	return (
		<AbsoluteFill>
			<TopTitle text="استشارة قانونية" frame={f} start={346} end={434} />

			{/* analytical core */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: coreIn * (1 - exit)}}>
				<defs>
					<radialGradient id="s5core">
						<stop offset="0%" stopColor={S.emerald} stopOpacity={0.3 + energy * 0.4} />
						<stop offset="100%" stopColor={S.emerald} stopOpacity={0} />
					</radialGradient>
				</defs>
				<g transform={`translate(${CORE.x} ${cy}) scale(${cs * (0.8 + 0.2 * coreIn)})`}>
					<circle r={230} fill="url(#s5core)" />
					<circle r={170} fill="none" stroke={S.gold} strokeOpacity={0.5} strokeDasharray="2 8" transform={`rotate(${f * 0.4})`} />
					<circle r={122} fill="none" stroke={S.emerald} strokeOpacity={0.75} strokeWidth={2} strokeDasharray="60 18" transform={`rotate(${-f * (0.8 + energy * 4)})`} />
					<circle r={78} fill="rgba(10,15,22,0.8)" stroke={S.goldLight} strokeOpacity={0.6} strokeWidth={1.5} />
					<g fill="none" stroke={S.emerald} strokeWidth={1.8} transform={`rotate(${f * 0.6})`}>
						<rect x={-26} y={-26} width={52} height={52} />
						<rect x={-26} y={-26} width={52} height={52} transform="rotate(45)" />
					</g>
					<circle r={9} fill="#fff" style={{filter: `drop-shadow(0 0 12px ${S.emerald})`}} />
					{energy > 0 ? <circle r={90 + hit * 200} fill="none" stroke={S.emerald} strokeOpacity={energy * 0.8} strokeWidth={2} /> : null}
				</g>
				{/* reasoning pathways: chip → core */}
				{CHIPS.map((c, i) => {
					const d = ramp(f, 380 + i * 4, 394 + i * 4, 0, 1, expoOut) * (1 - resolve);
					if (d <= 0) return null;
					const mx = (c.x + CORE.x) / 2 + (c.x < CORE.x ? -40 : 40);
					const my = (c.y + CORE.y) / 2;
					const path = `M ${c.x} ${c.y} Q ${mx} ${my} ${CORE.x} ${CORE.y}`;
					const t = ((f - 380 - i * 4) % 24) / 24;
					const px = (1 - t) * (1 - t) * c.x + 2 * (1 - t) * t * mx + t * t * CORE.x;
					const py = (1 - t) * (1 - t) * c.y + 2 * (1 - t) * t * my + t * t * CORE.y;
					return (
						<g key={i} opacity={d}>
							<path d={path} fill="none" stroke={c.gold ? S.gold : S.emerald} strokeWidth={1.6} strokeOpacity={0.8} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - d} />
							<circle cx={px} cy={py} r={4} fill="#fff" style={{filter: `drop-shadow(0 0 8px ${S.emerald})`}} />
						</g>
					);
				})}
			</svg>

			{/* reference chips orbit in */}
			{CHIPS.map((c, i) => {
				const a = ramp(f, 370 + i * 5, 388 + i * 5, 0, 1, expoOut);
				const o = a * (1 - ramp(f, 396, 408));
				if (o <= 0) return null;
				const x = lerp(c.from[0], c.x, a);
				const y = lerp(c.from[1], c.y, a);
				return (
					<div key={i} style={{position: 'absolute', left: x - 115, top: y - 34, width: 230, height: 68, ...glass(1, c.gold ? S.gold : S.goldHair), borderRadius: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: o}}>
						<ArLabel size={30} color={c.gold ? S.goldLight : S.white} weight={500}>
							{c.t}
						</ArLabel>
					</div>
				);
			})}

			{/* question card */}
			{drop < 1 && f >= 346 ? (
				<div style={{position: 'absolute', left: SCX - 390, width: 780, top: qy - qh / 2, height: qh, transform: `scale(${qs})`, ...glass(1.2, S.emerald), borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', opacity: 1 - ramp(drop, 0.7, 1), boxShadow: `0 0 40px rgba(18,179,122,0.25)`}}>
					<ArWords text="هل يحق لي فسخ العقد؟" frame={f} start={349} stagger={3} dur={16} style={{fontSize: 48, fontWeight: 500, color: S.white}} />
				</div>
			) : null}

			{/* structured response */}
			{card > 0 ? (
				<div
					dir="rtl"
					style={{
						position: 'absolute',
						left: RESPONSE.x - RESPONSE.w / 2,
						top: RESPONSE.y - RESPONSE.h / 2,
						width: RESPONSE.w,
						height: RESPONSE.h,
						...glass(1.2, S.goldHair),
						padding: '36px 44px',
						boxSizing: 'border-box',
						opacity: card,
						transformOrigin: `50% 0%`,
						transform: `translateY(${lerp((1 - card) * 60, 0, card) + exit * 40}px) scale(${lerp(1, 0.62, exit)})`,
					}}
				>
					{SECTIONS.map((t, i) => {
						const a = ramp(f, 404 + i * 6, 418 + i * 6, 0, 1, expoOut);
						return (
							<div key={i} style={{marginBottom: 26, opacity: a, transform: `translateY(${(1 - a) * 16}px)`}}>
								<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
									<div style={{width: 10, height: 10, borderRadius: 5, background: i === 2 ? S.emerald : S.gold}} />
									<div style={{fontFamily: SF.ar, fontWeight: 600, fontSize: 36, color: S.goldLight}}>{t}</div>
								</div>
								<div style={{marginTop: 12, paddingRight: 24}}>
									<Bars widths={i === 2 ? [0.84] : [0.95, 0.7]} p={ramp(a, 0.3, 1)} color="rgba(244,242,236,0.3)" h={8} gap={12} />
								</div>
							</div>
						);
					})}
				</div>
			) : null}

			<LowerLine parts={['ذكية', 'مهنية', 'واضحة']} frame={f} start={410} end={434} size={44} />
		</AbsoluteFill>
	);
};
