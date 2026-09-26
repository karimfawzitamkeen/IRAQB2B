import React from 'react';
import {AbsoluteFill} from 'remotion';
import {expoIn, expoInOut, expoOut, lerp, ramp, rnd, smooth} from '../../theme';
import {S, SCX, SF} from '../theme';
import {ArLabel, ArWords, Bars, Icon, LowerLine, TopTitle, glass} from '../ui';

/** Scene 3 — Legal library (180–255f). The law text is never altered: highlight behind, explanation beside. */
export const PAGE3 = {x: SCX, y: 930, w: 640, h: 600};

const SPINES = Array.from({length: 26}, (_, i) => ({
	x: 60 + (i % 7) * 160 + rnd(`s3x${i}`) * 40,
	y: 300 + Math.floor(i / 7) * 380 + rnd(`s3y${i}`) * 60,
	d: 0.3 + rnd(`s3d${i}`) * 0.7,
	w: 70 + rnd(`s3w${i}`) * 30,
}));

const RESULTS = ['قانون العمل — أحكام عامة', 'المادة ١ — التعريفات', 'الفصل الثاني — عقد العمل'];

export const S3Library: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 176 || f > 266) return null;
	const enter = ramp(f, 178, 200, 0, 1, expoOut);
	const search = ramp(f, 188, 204, 0, 1, expoOut);
	const open = ramp(f, 210, 232, 0, 1, expoInOut);
	const hl = ramp(f, 222, 236, 0, 1, expoOut);
	const note = ramp(f, 228, 244, 0, 1, expoOut);
	const fold = ramp(f, 246, 262, 0, 1, expoIn);
	const fadeOthers = ramp(f, 244, 256);

	// page grows out of the first result row
	const row0 = {x: SCX, y: 610, w: 740, h: 70};
	const px = lerp(row0.x, PAGE3.x, open);
	const py = lerp(row0.y, lerp(PAGE3.y, 880, fold), open);
	const pw = lerp(row0.w, PAGE3.w, open);
	const ph = lerp(row0.h, PAGE3.h, open) * lerp(1, 0.1, fold);
	const top = py - ph / 2;

	return (
		<AbsoluteFill>
			{/* depth: document spines & pages connected by fine gold citation lines */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: enter * (1 - fadeOthers) * 0.9, transform: `scale(${lerp(1.3, 1, enter)})`, transformOrigin: '540px 880px'}}>
				{SPINES.map((s, i) => {
					const y = s.y - (f - 180) * (0.6 + s.d * 1.2);
					const n = SPINES[(i + 3) % SPINES.length];
					const ny = n.y - (f - 180) * (0.6 + n.d * 1.2);
					return (
						<g key={i} opacity={0.12 + s.d * 0.22}>
							<rect x={s.x} y={y} width={s.w * s.d} height={s.w * 1.35 * s.d} rx={4} fill="rgba(244,242,236,0.03)" stroke={S.white} strokeOpacity={0.5} />
							<line x1={s.x + 10 * s.d} y1={y + 18 * s.d} x2={s.x + (s.w - 12) * s.d} y2={y + 18 * s.d} stroke={S.gold} strokeOpacity={0.8} />
							{i % 3 === 0 ? <line x1={s.x + (s.w * s.d) / 2} y1={y + s.w * 0.7 * s.d} x2={n.x + (n.w * n.d) / 2} y2={ny + n.w * 0.7 * n.d} stroke={S.gold} strokeOpacity={0.5} strokeWidth={1} strokeDasharray="2 6" /> : null}
						</g>
					);
				})}
			</svg>

			<TopTitle text="المكتبة القانونية" frame={f} start={186} end={252} />

			{/* search field */}
			<div style={{position: 'absolute', left: 130, width: 820 - 130 + 50, top: 440, height: 96, opacity: search * (1 - fadeOthers), transform: `translateY(${(1 - search) * 20}px)`, ...glass(1, S.goldHair), borderRadius: 48, display: 'flex', alignItems: 'center', padding: '0 36px', boxSizing: 'border-box'}}>
				<svg width={40} height={40} viewBox="0 0 40 40">
					<circle cx={17} cy={17} r={11} fill="none" stroke={S.gold} strokeWidth={2.4} />
					<line x1={25} y1={25} x2={35} y2={35} stroke={S.gold} strokeWidth={2.4} strokeLinecap="round" />
				</svg>
				<div style={{flex: 1}}>
					<ArWords text="قانون العمل" frame={f} start={194} stagger={5} dur={12} justify="flex-start" style={{fontSize: 40, fontWeight: 500, color: S.white}} />
				</div>
				<div style={{width: 3, height: 44, background: S.gold, opacity: f < 212 && Math.floor(f / 8) % 2 === 0 ? 1 : 0, marginRight: 6}} />
			</div>

			{/* results (rows 2–3 fade as row 1 opens) */}
			{RESULTS.map((r, i) => {
				const a = ramp(f, 200 + i * 4, 214 + i * 4, 0, 1, expoOut);
				if (i === 0 || a <= 0) return null;
				const o = a * (1 - ramp(f, 212, 222));
				return (
					<div key={i} style={{position: 'absolute', left: 170, width: 740, top: 610 + i * 82 - 35, height: 70, opacity: o, transform: `translateY(${(1 - a) * 20}px)`, ...glass(0.8), borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 18, padding: '0 26px', boxSizing: 'border-box'}}>
						<div dir="rtl" style={{fontFamily: SF.law, fontSize: 32, color: S.white}}>{r}</div>
						<Icon name="document" size={36} color={S.gold} />
					</div>
				);
			})}

			{/* the law page, opening out of result 1 */}
			{f >= 200 ? (
				<div style={{position: 'absolute', left: px - pw / 2, top, width: pw, height: ph, ...glass(1, S.goldHair), borderRadius: lerp(14, 16, open), overflow: 'hidden', opacity: ramp(f, 200, 210) * (1 - ramp(f, 256, 262))}}>
					{/* collapsed state = the result row */}
					<div dir="rtl" style={{position: 'absolute', right: 26, top: 12, display: 'flex', alignItems: 'center', gap: 18, opacity: 1 - ramp(open, 0, 0.35)}}>
						<Icon name="document" size={36} color={S.gold} />
						<div style={{fontFamily: SF.law, fontSize: 32, color: S.white}}>{RESULTS[0]}</div>
					</div>
					{/* open state */}
					<div dir="rtl" style={{position: 'absolute', inset: 0, padding: '34px 44px', opacity: ramp(open, 0.45, 1), fontFamily: SF.law, color: S.white}}>
						<div style={{fontSize: 42, fontWeight: 700, color: S.goldLight, lineHeight: 1.3}}>قانون العمل</div>
						<div style={{height: 2, background: `linear-gradient(270deg, ${S.gold}, rgba(201,164,92,0))`, margin: '12px 0 22px'}} />
						<div style={{fontSize: 32, fontWeight: 700, color: S.goldLight}}>المادة ١</div>
						<div style={{fontSize: 29, lineHeight: 1.65, color: 'rgba(244,242,236,0.82)', marginBottom: 18}}>
							يقصد بالمصطلحات الواردة في هذا القانون
							<br />
							المعاني المبينة إزاء كل منها.
						</div>
						<div style={{fontSize: 32, fontWeight: 700, color: S.goldLight}}>المادة ٢</div>
						<div style={{position: 'relative', fontSize: 29, lineHeight: 1.65, color: 'rgba(244,242,236,0.92)'}}>
							{/* emerald highlight sits BEHIND the unchanged text */}
							<div style={{position: 'absolute', right: -14, top: 4, height: 'calc(100% - 4px)', width: `calc(${hl * 100}% + 28px)`, background: 'linear-gradient(270deg, rgba(18,179,122,0.28), rgba(18,179,122,0.12))', borderRight: `4px solid ${S.emerald}`, borderRadius: 8, zIndex: 0}} />
							<span style={{position: 'relative'}}>
								تسري أحكام هذا القانون على جميع
								<br />
								العاملين ما لم يرد نص خاص بخلاف ذلك.
							</span>
						</div>
						<div style={{marginTop: 22}}>
							<Bars widths={[0.92, 0.8, 0.86, 0.5]} p={ramp(open, 0.6, 1)} color="rgba(244,242,236,0.2)" h={7} gap={16} />
						</div>
					</div>
				</div>
			) : null}

			{/* "plain explanation" card — separate from the law text, beside it */}
			{note > 0 ? (
				<>
					<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: note * (1 - fadeOthers)}}>
						<path d={`M ${SCX - 200} 1010 C ${SCX - 250} 1060, 300 1090, 290 ${1120}`} fill="none" stroke={S.emerald} strokeWidth={2} strokeDasharray="4 6" pathLength={1} strokeDashoffset={0} />
						<circle cx={SCX - 200} cy={1010} r={6} fill={S.emerald} />
					</svg>
					<div dir="rtl" style={{position: 'absolute', left: 110, top: 1130, width: 360, padding: '20px 26px 24px', boxSizing: 'border-box', ...glass(1.2, S.gold), borderRadius: 16, opacity: note * (1 - fadeOthers), transform: `translateX(${(1 - note) * -40}px)`}}>
						<ArLabel size={36} color={S.goldLight} weight={600}>
							شرح مبسط
						</ArLabel>
						<div style={{marginTop: 12}}>
							<Bars widths={[1, 0.78]} p={ramp(note, 0.3, 1)} color="rgba(244,242,236,0.4)" h={8} gap={14} />
						</div>
					</div>
				</>
			) : null}

			<LowerLine parts={['بحث', 'قراءة', 'مصادر أصلية', 'شرح مبسط']} frame={f} start={214} end={254} size={40} />
		</AbsoluteFill>
	);
};
