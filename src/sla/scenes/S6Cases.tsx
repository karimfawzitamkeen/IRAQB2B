import React from 'react';
import {AbsoluteFill} from 'remotion';
import {expoIn, expoOut, lerp, ramp} from '../../theme';
import {S, SCX, SF} from '../theme';
import {ArLabel, Bars, Icon, IconName, TopTitle, glass} from '../ui';

/** Scene 6 — Case management → Smart lawyer (435–540f). AI assists and organises legal work. */
export const FOLDER = {x: SCX, y: 870, w: 720, h: 560};
const TIMELINE = [
	{t: 'مهمة', d: 'مراجعة المستندات', at: 456},
	{t: 'الموعد النهائي', d: '١٢ تشرين الثاني', at: 464},
	{t: 'جلسة', d: '٢٠ تشرين الثاني', at: 472},
];
const OUTPUTS: {t: string; icon: IconName; at: number}[] = [
	{t: 'تحليل المخاطر', icon: 'gauge', at: 496},
	{t: 'مذكرة قانونية', icon: 'document', at: 506},
	{t: 'متابعة الملف', icon: 'timeline', at: 516},
];

export const S6Cases: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 432 || f > 542) return null;
	const draw = ramp(f, 436, 454, 0, 1, expoOut);
	const fill = ramp(f, 446, 462);
	const scan = ramp(f, 486, 516, 0, 1, (t) => t);
	const exit = ramp(f, 526, 540, 0, 1, expoIn);
	const top = FOLDER.y - FOLDER.h / 2;
	const left = FOLDER.x - FOLDER.w / 2;
	const scanY = lerp(top + 20, top + FOLDER.h - 20, scan);
	const perim = 2 * (FOLDER.w + FOLDER.h);

	return (
		<AbsoluteFill style={{transformOrigin: '540px 700px', transform: `scale(${1 - exit * 0.85})`, opacity: 1 - ramp(exit, 0.4, 1), filter: exit > 0 ? `blur(${exit * 6}px)` : undefined}}>
			<TopTitle text="إدارة القضايا" frame={f} start={440} end={488} />
			<TopTitle text="المحامي الذكي" frame={f} start={488} end={546} />
			{f >= 490 ? (
				<div style={{position: 'absolute', left: 838, top: 296, opacity: ramp(f, 490, 502) * (1 - ramp(f, 534, 546)), transform: `rotate(${f * 0.8}deg)`}}>
					<Icon name="smart" size={56} color={S.emerald} stroke={2} />
				</div>
			) : null}

			{/* folder: tab + body, drawn on then filled */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<path
					d={`M ${left + FOLDER.w} ${top + 40} V ${top + FOLDER.h} H ${left} V ${top + 40} H ${left + FOLDER.w - 250} L ${left + FOLDER.w - 220} ${top} H ${left + FOLDER.w - 20} L ${left + FOLDER.w} ${top + 20} Z`}
					fill={`rgba(244,242,236,${0.045 * fill})`}
					stroke={S.gold}
					strokeWidth={1.8}
					strokeDasharray={`${perim} ${perim}`}
					strokeDashoffset={perim * (1 - draw)}
					style={{filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5))'}}
				/>
			</svg>
			<div dir="rtl" style={{position: 'absolute', right: 1080 - (left + FOLDER.w - 36), top: top + 2, opacity: fill}}>
				<ArLabel size={30} color={S.goldLight} weight={600}>
					ملف القضية
				</ArLabel>
			</div>

			{/* documents (left column) — the consultation response sits on top */}
			{[2, 1, 0].map((k) => {
				const a = ramp(f, 448 + (2 - k) * 4, 462 + (2 - k) * 4, 0, 1, expoOut);
				return (
					<div key={k} style={{position: 'absolute', left: left + 50 + k * 16, top: top + 90 + k * 18, width: 300, height: 380, ...glass(1, k === 0 ? S.goldHair : S.hair), borderRadius: 12, opacity: a * (k === 0 ? 1 : 0.6), transform: `translateY(${(1 - a) * 30}px)`, padding: 26, boxSizing: 'border-box'}}>
						{k === 0 ? (
							<>
								<div style={{height: 9, width: '55%', marginLeft: 'auto', borderRadius: 9, background: S.gold, opacity: 0.8}} />
								<div style={{marginTop: 18}}>
									<Bars widths={[1, 0.8, 0.9, 0.6]} p={a} color="rgba(244,242,236,0.28)" h={7} gap={13} />
								</div>
								<div style={{height: 9, width: '40%', marginLeft: 'auto', marginTop: 26, borderRadius: 9, background: S.gold, opacity: 0.6}} />
								<div style={{marginTop: 18}}>
									<Bars widths={[0.95, 0.7, 0.85]} p={a} color="rgba(244,242,236,0.22)" h={7} gap={13} />
								</div>
							</>
						) : null}
					</div>
				);
			})}

			{/* timeline (right column, RTL) */}
			<div style={{position: 'absolute', left: left + FOLDER.w - 36 - 4, top: top + 120, width: 2, height: 250, background: S.hair, transform: `scaleY(${fill})`, transformOrigin: 'top'}} />
			{TIMELINE.map((it, i) => {
				const a = ramp(f, it.at - 6, it.at + 8, 0, 1, expoOut);
				const lit = ramp(f, it.at, it.at + 6);
				const y = top + 110 + i * 118;
				return (
					<React.Fragment key={i}>
						<div style={{position: 'absolute', left: left + FOLDER.w - 36 - 13, top: y + 12, width: 24, height: 24, borderRadius: 12, border: `2px solid ${S.emerald}`, background: lit > 0.5 ? S.emerald : 'rgba(10,15,22,0.9)', boxShadow: lit > 0.5 ? `0 0 14px ${S.emerald}` : undefined, opacity: a}} />
						<div dir="rtl" style={{position: 'absolute', right: 1080 - (left + FOLDER.w - 70), top: y, opacity: a, transform: `translateX(${(1 - a) * 20}px)`, textAlign: 'right'}}>
							<div style={{fontFamily: SF.ar, fontWeight: 600, fontSize: 36, color: S.white, lineHeight: 1.2}}>{it.t}</div>
							<div style={{fontFamily: SF.ar, fontSize: 28, color: S.dim, marginTop: 4}}>{it.d}</div>
						</div>
					</React.Fragment>
				);
			})}
			{/* status */}
			<div dir="rtl" style={{position: 'absolute', right: 1080 - (left + FOLDER.w - 40), top: top + FOLDER.h - 86, display: 'flex', alignItems: 'center', gap: 12, padding: '8px 20px', borderRadius: 30, border: `1.5px solid ${S.emerald}`, opacity: ramp(f, 474, 486)}}>
				<div style={{width: 10, height: 10, borderRadius: 5, background: S.emerald, boxShadow: `0 0 10px ${S.emerald}`, opacity: 0.6 + 0.4 * Math.sin(f / 4)}} />
				<ArLabel size={28} color={S.emerald} weight={500}>
					قيد المتابعة
				</ArLabel>
			</div>

			{/* smart lawyer: emerald analytical scan */}
			{scan > 0 && scan < 1 ? (
				<div style={{position: 'absolute', left: left + 10, width: FOLDER.w - 20, top: scanY - 120, height: 122, pointerEvents: 'none'}}>
					<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(18,179,122,0) 0%, rgba(18,179,122,0.16) 100%)'}} />
					<div style={{position: 'absolute', left: -14, right: -14, bottom: 0, height: 3, background: '#DFFFF1', boxShadow: `0 0 18px 4px ${S.emerald}`}} />
				</div>
			) : null}

			{/* outputs */}
			{OUTPUTS.map((o, i) => {
				const a = ramp(f, o.at, o.at + 14, 0, 1, expoOut);
				if (a <= 0) return null;
				const y = 1192 + i * 94;
				return (
					<div key={i} dir="rtl" style={{position: 'absolute', left: SCX - 280, width: 560, top: lerp(top + FOLDER.h - 100, y, a), height: 70, ...glass(1.1, i === 0 ? S.gold : S.goldHair), borderRadius: 35, display: 'flex', alignItems: 'center', gap: 18, padding: '0 28px', boxSizing: 'border-box', opacity: a}}>
						<Icon name={o.icon} size={40} color={i === 0 ? S.goldLight : S.emerald} stroke={2} />
						<ArLabel size={36} color={S.white} weight={500}>
							{o.t}
						</ArLabel>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
