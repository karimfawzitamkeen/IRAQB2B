import React from 'react';
import {AbsoluteFill} from 'remotion';
import {backOut, expoIn, expoInOut, expoOut, lerp, ramp, rnd} from '../../theme';
import {S, SCX, SF} from '../theme';
import {ArLabel, Icon, IconName, archPath, glass} from '../ui';

/** Scene 7 — Trust, security & professional output (540–630f). No padlock: shield arch, access gates, verified identity. */
export const CORE7 = {x: SCX, y: 700};
const STREAMS = Array.from({length: 7}, (_, i) => ({
	x: [120, 960, 180, 900, 540, 90, 990][i],
	y: [1200, 1180, 380, 420, 1420, 800, 760][i],
	glyphs: ['7F·A2', 'C9·3E', '0B·D4', 'E1·58', '9A·C7', '3D·F0', 'B6·21'][i],
}));
const PILLARS: {t: string; icon: IconName; at: number}[] = [
	{t: 'حماية البيانات', icon: 'shield', at: 572},
	{t: 'مخرجات قانونية احترافية', icon: 'document', at: 588},
	{t: 'جاهزية الموبايل', icon: 'mobile', at: 604},
];

export const S7Trust: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 532 || f > 636) return null;
	const inn = ramp(f, 536, 562, 0, 1, expoInOut);
	const shield = ramp(f, 548, 576, 0, 1, expoOut);
	const align = ramp(f, 556, 590, 0, 1, expoInOut);
	const close = ramp(f, 588, 600, 0, 1, backOut);
	const verify = ramp(f, 584, 598, 0, 1, backOut);
	const exit = ramp(f, 614, 634, 0, 1, expoIn);
	const R = 250;
	const SEG = 12;

	return (
		<AbsoluteFill style={{transformOrigin: `${CORE7.x}px ${CORE7.y}px`, transform: `scale(${1 - exit * 0.7})`, opacity: 1 - exit}}>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<defs>
					<radialGradient id="s7g">
						<stop offset="0%" stopColor={S.emerald} stopOpacity={0.22} />
						<stop offset="60%" stopColor={S.gold} stopOpacity={0.06} />
						<stop offset="100%" stopColor={S.gold} stopOpacity={0} />
					</radialGradient>
				</defs>
				<circle cx={CORE7.x} cy={CORE7.y} r={340} fill="url(#s7g)" opacity={inn} />
				{/* encrypted data paths: every service stream converges */}
				{STREAMS.map((s, i) => {
					const d = ramp(f, 538 + i * 2, 562 + i * 2, 0, 1, expoOut);
					const mx = (s.x + CORE7.x) / 2 + (rnd(`s7m${i}`) - 0.5) * 160;
					const my = (s.y + CORE7.y) / 2;
					const path = `M ${s.x} ${s.y} Q ${mx} ${my} ${CORE7.x} ${CORE7.y}`;
					return (
						<g key={i} opacity={d * (1 - ramp(f, 600, 616))}>
							<path d={path} fill="none" stroke={i % 2 ? S.emerald : S.gold} strokeOpacity={0.55} strokeWidth={1.4} strokeDasharray="3 9" strokeDashoffset={-f * 2.5} />
							{[0, 0.33, 0.66].map((o, k) => {
								const t = ((f - 540) / 40 + o + i * 0.07) % 1;
								const px = (1 - t) * (1 - t) * s.x + 2 * (1 - t) * t * mx + t * t * CORE7.x;
								const py = (1 - t) * (1 - t) * s.y + 2 * (1 - t) * t * my + t * t * CORE7.y;
								return (
									<text key={k} x={px} y={py} fill={i % 2 ? S.emerald : S.goldLight} fontFamily={SF.mono} fontSize={18} opacity={Math.sin(Math.PI * t) * 0.8} textAnchor="middle">
										{t < 0.5 ? s.glyphs : '••·••'}
									</text>
								);
							})}
						</g>
					);
				})}
				<g transform={`translate(${CORE7.x} ${CORE7.y})`}>
					{/* controlled access: segmented ring whose gates rotate, align and close */}
					<g transform={`rotate(${lerp(40, 0, align) + f * 0.05})`} opacity={inn}>
						{Array.from({length: SEG}, (_, i) => {
							const a0 = (i / SEG) * Math.PI * 2;
							const gap = lerp(0.22, 0.03, close);
							const a1 = a0 + (Math.PI * 2) / SEG - gap;
							return (
								<path
									key={i}
									d={`M ${R * Math.cos(a0)} ${R * Math.sin(a0)} A ${R} ${R} 0 0 1 ${R * Math.cos(a1)} ${R * Math.sin(a1)}`}
									fill="none"
									stroke={close > 0.5 ? S.emerald : S.gold}
									strokeWidth={3}
									strokeLinecap="round"
									opacity={0.8}
								/>
							);
						})}
					</g>
					<circle r={R + 22} fill="none" stroke={S.hair} strokeDasharray="1 8" opacity={inn} />
					{/* shield geometry: the arch again */}
					<g transform="translate(0 70)">
						<path d={archPath(300, 110)} fill="rgba(201,164,92,0.05)" stroke={S.gold} strokeWidth={2} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - shield} style={{filter: `drop-shadow(0 0 10px rgba(201,164,92,0.5))`}} />
					</g>
				</g>
			</svg>

			{/* verified document identity */}
			<div style={{position: 'absolute', left: CORE7.x - 64, top: CORE7.y - 70, width: 128, height: 168, ...glass(1.3, S.goldHair), borderRadius: 10, opacity: ramp(f, 560, 576), padding: 18, boxSizing: 'border-box'}}>
				<svg width={92} height={92} viewBox="0 0 92 92" style={{position: 'absolute', left: 18, top: 44, opacity: 0.55}}>
					{[10, 17, 24, 31, 38].map((r, i) => (
						<path key={i} d={`M ${46 - r} 60 A ${r} ${r} 0 0 1 ${46 + r} 60`} fill="none" stroke={S.goldLight} strokeWidth={1.2} strokeDasharray={i % 2 ? '6 3' : undefined} />
					))}
				</svg>
				<div style={{height: 7, width: '70%', marginLeft: 'auto', borderRadius: 7, background: S.gold}} />
				<div style={{height: 6, width: '90%', marginLeft: 'auto', marginTop: 10, borderRadius: 6, background: 'rgba(244,242,236,0.3)'}} />
				{verify > 0 ? (
					<svg width={56} height={56} viewBox="0 0 40 40" style={{position: 'absolute', right: -24, bottom: -20, transform: `scale(${verify})`, filter: `drop-shadow(0 0 12px ${S.emerald})`}}>
						<circle cx={20} cy={20} r={17} fill="#0A2A1F" stroke={S.emerald} strokeWidth={2} />
						<path d="M12.5 20.5 L17.8 25.8 L28 15" fill="none" stroke="#fff" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				) : null}
			</div>

			{/* three pillars, one at a time */}
			<div style={{position: 'absolute', left: SCX - 330, width: 660, top: 1060}}>
				{PILLARS.map((p, i) => {
					const a = ramp(f, p.at, p.at + 16, 0, 1, expoOut);
					return (
						<div key={i} dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 26, height: 118, opacity: a, transform: `translateY(${(1 - a) * 26}px)`}}>
							<div style={{width: 84, height: 84, borderRadius: 42, border: `1.5px solid ${i === 0 ? S.emerald : S.goldHair}`, background: 'rgba(244,242,236,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 ${20 * a}px rgba(18,179,122,0.2)`}}>
								<Icon name={p.icon} size={48} color={i === 0 ? S.emerald : S.goldLight} stroke={1.8} />
							</div>
							<ArLabel size={46} color={S.white} weight={500}>
								{p.t}
							</ArLabel>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
