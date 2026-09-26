import React from 'react';
import {AbsoluteFill} from 'remotion';
import {backOut, expoIn, expoInOut, expoOut, lerp, ramp} from '../../theme';
import {SIGNATURE_D} from '../../components/Document';
import {S, SCX, SF} from '../theme';
import {LowerLine, TopTitle, glass} from '../ui';

/** Scene 4 — Contract generation → legal translation (255–345f). Structure preserved row for row. */
const SECTIONS = [
	{ar: 'الأطراف', en: 'Parties', num: '١'},
	{ar: 'موضوع العقد', en: 'Subject', num: '٢'},
	{ar: 'الالتزامات', en: 'Obligations', num: '٣'},
	{ar: 'المدة والشروط', en: 'Term & Conditions', num: '٤'},
	{ar: 'التوقيع', en: 'Signatures', num: '٥'},
];
export const CONTRACT = {x: SCX, y: 880, h: 680};

export const S4Contract: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 254 || f > 354) return null;
	const opn = ramp(f, 256, 274, 0, 1, expoOut);
	const split = ramp(f, 298, 318, 0, 1, expoInOut);
	const collapse = ramp(f, 336, 350, 0, 1, expoIn);
	const w = lerp(640, 800, split);
	const h = lerp(60, CONTRACT.h, opn) * lerp(1, 0.02, collapse);
	const top = CONTRACT.y - h / 2;
	const sig = ramp(f, 286, 302, 0, 1, (t) => t);
	const tick = ramp(f, 298, 308, 0, 1, backOut);
	const rowY = (i: number) => 128 + i * 106;

	return (
		<AbsoluteFill>
			<TopTitle text="توليد العقود" frame={f} start={258} end={306} />
			<TopTitle text="الترجمة القانونية" frame={f} start={306} end={348} />

			<div style={{position: 'absolute', left: SCX - w / 2, top, width: w, height: h, ...glass(1, S.goldHair), borderRadius: 18, overflow: 'hidden', opacity: 1 - ramp(f, 346, 352)}}>
				{/* content stays centred while the page unfolds / collapses around it */}
				<div style={{position: 'absolute', left: 0, right: 0, top: (h - CONTRACT.h) / 2, height: CONTRACT.h}}>
					{/* header */}
					<div dir="rtl" style={{position: 'absolute', right: 40, left: 40, top: 30, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', opacity: ramp(f, 256, 268)}}>
						<div style={{fontFamily: SF.law, fontWeight: 700, fontSize: 42, color: S.goldLight}}>عقد</div>
						<div style={{fontFamily: SF.en, fontWeight: 500, fontSize: 26, letterSpacing: 4, color: S.gold, opacity: split}}>CONTRACT</div>
					</div>
					<div style={{position: 'absolute', left: 40, right: 40, top: 96, height: 2, background: `linear-gradient(270deg, ${S.gold}, rgba(201,164,92,0.1))`, transform: `scaleX(${ramp(f, 262, 280)})`, transformOrigin: 'right'}} />
					{/* centre divider for the bilingual layout */}
					<div style={{position: 'absolute', left: w / 2 - 1, top: 120, bottom: 30, width: 1.5, background: S.goldHair, transform: `scaleY(${split})`, transformOrigin: 'top'}} />

					{SECTIONS.map((s, i) => {
						const a = ramp(f, 257 + i * 4, 273 + i * 4, 0, 1, expoOut);
						const en = ramp(f, 310 + i * 4, 324 + i * 4, 0, 1, expoOut);
						const y = rowY(i);
						const arW = lerp(w - 80, w / 2 - 60, split);
						return (
							<React.Fragment key={i}>
								{/* Arabic row (RTL, right column) */}
								<div dir="rtl" style={{position: 'absolute', right: 40, top: y, width: arW, opacity: a, transform: `translateY(${(1 - a) * 36}px)`}}>
									<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
										<div style={{width: 44, height: 44, borderRadius: 22, border: `1.5px solid ${S.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SF.ar, fontSize: 26, color: S.goldLight, flexShrink: 0}}>{s.num}</div>
										<div style={{fontFamily: SF.ar, fontWeight: 500, fontSize: 38, color: S.white, whiteSpace: 'nowrap'}}>{s.ar}</div>
									</div>
									{i < 4 ? (
										<div style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10, marginRight: 60}}>
											<div style={{height: 7, borderRadius: 7, background: 'rgba(244,242,236,0.24)', width: `${(0.9 - (i % 2) * 0.15) * 100}%`}} />
											<div style={{height: 7, borderRadius: 7, background: 'rgba(244,242,236,0.16)', width: `${(0.62 + (i % 3) * 0.1) * 100}%`}} />
										</div>
									) : (
										<svg width={260} height={60} viewBox="0 0 260 82" style={{marginTop: 4, marginRight: 60, overflow: 'visible'}}>
											<path d={SIGNATURE_D} fill="none" stroke={S.white} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - sig} />
										</svg>
									)}
								</div>
								{/* English row (LTR, left column) — same structure, same row */}
								{en > 0 ? (
									<div dir="ltr" style={{position: 'absolute', left: 40, top: y, width: w / 2 - 70, opacity: en, transform: `translateX(${(1 - en) * -24}px)`}}>
										<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
											<div style={{width: 44, height: 44, borderRadius: 22, border: `1.5px solid ${S.emerald}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SF.en, fontSize: 22, color: S.emerald, flexShrink: 0}}>{i + 1}</div>
											<div style={{fontFamily: SF.en, fontWeight: 500, fontSize: 32, color: S.white, whiteSpace: 'nowrap'}}>{s.en}</div>
										</div>
										<div style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10, marginLeft: 58}}>
											<div style={{height: 7, borderRadius: 7, background: 'rgba(18,179,122,0.35)', width: `${(0.9 - (i % 2) * 0.15) * 100 * en}%`}} />
											{i < 4 ? <div style={{height: 7, borderRadius: 7, background: 'rgba(18,179,122,0.22)', width: `${(0.62 + (i % 3) * 0.1) * 100 * en}%`}} /> : null}
										</div>
									</div>
								) : null}
								{/* row connector across the divider */}
								{en > 0 ? <div style={{position: 'absolute', left: w / 2 - 22, top: y + 18, width: 44, height: 8, opacity: en}}>
									<div style={{position: 'absolute', left: 0, right: 0, top: 3.5, height: 1.5, background: S.gold}} />
									<div style={{position: 'absolute', left: 18, top: -1, width: 8, height: 8, background: S.gold, transform: 'rotate(45deg)'}} />
								</div> : null}
							</React.Fragment>
						);
					})}
					{/* ready tick after signature */}
					{tick > 0 ? (
						<svg width={64} height={64} viewBox="0 0 40 40" style={{position: 'absolute', left: lerp(80, w / 2 - 110, split), top: rowY(4) - 6, opacity: Math.min(1, tick) * (1 - split), transform: `scale(${tick})`}}>
							<circle cx={20} cy={20} r={17} fill="rgba(18,179,122,0.12)" stroke={S.emerald} strokeWidth={1.8} />
							<path d="M12.5 20.5 L17.8 25.8 L28 15" fill="none" stroke={S.emerald} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					) : null}
				</div>
			</div>
			{/* collapse to a bright line (→ question card) */}
			{collapse > 0.5 ? <div style={{position: 'absolute', left: SCX - w / 2, width: w, top: CONTRACT.y - 1.5, height: 3, background: `linear-gradient(90deg, rgba(18,179,122,0), ${S.emerald} 30%, #fff 50%, ${S.emerald} 70%, rgba(18,179,122,0))`, boxShadow: `0 0 20px ${S.emerald}`, opacity: 1 - ramp(f, 348, 354)}} /> : null}

			<LowerLine parts={['دقة قانونية', 'صياغة مهنية']} frame={f} start={312} end={346} size={42} />
		</AbsoluteFill>
	);
};
