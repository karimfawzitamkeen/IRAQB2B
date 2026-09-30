import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, expoInOut, expoOut, kf, lerp, ramp, smooth} from '../../theme';
import {DocPlace} from '../../components/Document';
import {ArDoc, ArIcon, ArText, GoldRule, MinistryLogo, Win, useLand} from '../kit';
import {AF, TXT} from '../theme';

/** Opening (0–780f): patronage → launch title → beneficiary → executing entity & partnership. */
/** Layout per format: portrait 1080×1920 / landscape 1920×1080. */
const LP = {cx: 540, lineW: 1040, lineY: 540, orn: {y: 530, size: 360}, patronTop: 800, ruleTop: 1100, nameTop: 1120, launch: {top: 210, left: undefined as number | undefined, width: undefined as number | undefined}, doc: {x: 540, y: 1150, s: 0.8}, benTop: 440, exeTop: 300, rings: {y: 1330, r: 150, spread: [260, 95]}};
const LL = {cx: 960, lineW: 1600, lineY: 540, orn: {y: 240, size: 290}, patronTop: 420, ruleTop: 715, nameTop: 730, launch: {top: 250, left: 960, width: 880}, doc: {x: 520, y: 540, s: 0.94}, benTop: 150, exeTop: 110, rings: {y: 900, r: 105, spread: [200, 66]}};

export const A1Opening: React.FC<{frame: number}> = ({frame: f}) => {
	const L = useLand() ? LL : LP;
	if (f > 790) return null;
	const ornOut = ramp(f, 232, 256, 0, 1, expoInOut);
	const sweep = ramp(f, 4, 34, 0, 1, expoOut);
	// launch: the certificate materialises under the title
	const docIn = ramp(f, 284, 344, 0, 1, (t) => t);
	const docOut = ramp(f, 472, 492, 0, 1, smooth);
	// partnership rings
	const ringsIn = ramp(f, 668, 700, 0, 1, expoOut);
	return (
		<AbsoluteFill>
			{/* opening light line */}
			{f < 70 ? <div style={{position: 'absolute', left: L.cx - (L.lineW / 2) * sweep, width: L.lineW * sweep, top: L.lineY, height: 2, background: `linear-gradient(90deg, rgba(217,180,106,0), ${C.gold}, rgba(217,180,106,0))`, opacity: 1 - ramp(f, 40, 70), boxShadow: `0 0 20px ${C.gold}`}} /> : null}

			{/* patronage */}
			{f < 260 ? (
				<div style={{position: 'absolute', left: L.cx - L.orn.size / 2, top: L.orn.y - L.orn.size / 2, opacity: 1 - ornOut, transform: `scale(${1 + ornOut * 0.4})`}}>
					<MinistryLogo size={L.orn.size} p={ramp(f, 16, 60, 0, 1, expoOut)} frame={f} sweep={ramp(f, 70, 110, -0.3, 1.3)} />
				</div>
			) : null}
			<Win frame={f} a={50} b={250} top={L.patronTop} outF={16}>
				<ArText lines={TXT.patron1} frame={f} start={58} size={80} font={AF.naskh} weight={700} color="rgba(217,180,106,0.9)" glow="none" lineHeight={1.5} />
				<ArText lines={TXT.patron2} frame={f} start={70} size={108} font={AF.naskh} weight={700} glow="white" lineHeight={1.5} />
			</Win>
			{f >= 50 && f < 250 ? <GoldRule p={ramp(f, 90, 112, 0, 1, expoOut) * (1 - ramp(f, 234, 250))} w={620} top={L.ruleTop} cx={L.cx} /> : null}
			<Win frame={f} a={50} b={250} top={L.nameTop} outF={16}>
				<ArText lines={TXT.patron3} frame={f} start={96} size={132} font={AF.naskh} weight={700} color="#F0D48E" glow="gold" lineHeight={1.5} stagger={5} dur={18} />
			</Win>

			{/* launch */}
			<Win frame={f} a={256} b={490} top={L.launch.top} left={L.launch.left} width={L.launch.width} outF={16}>
				<ArText lines={TXT.launch1} frame={f} start={262} size={88} color={C.cyan} glow="cyan" weight={800} />
				<ArText lines={TXT.launch2} frame={f} start={270} size={132} weight={900} />
				<ArText lines={TXT.launch3} frame={f} start={280} size={112} weight={900} color="#F0D48E" glow="gold" />
			</Win>
			{f >= 280 && f < 494 ? (
				<>
					<div style={{position: 'absolute', left: L.doc.x - 420, top: L.doc.y - 420, width: 840, height: 840, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,216,255,0.16), rgba(79,216,255,0) 62%)', opacity: docIn * (1 - docOut)}} />
					<DocPlace x={L.doc.x} y={lerp(L.doc.y + 30, L.doc.y, docIn)} scale={L.doc.s * (1 - docOut * 0.3)} ry={kf(f, [[284, -22], [360, -6], [490, 6]], smooth)} rx={6} opacity={Math.min(1, docIn * 3) * (1 - docOut)}>
						<ArDoc frame={f} build={docIn} glow={0.6} gold={ramp(f, 340, 380)} sheen={kf(f, [[380, -0.5], [440, 1.5]], smooth)} />
					</DocPlace>
				</>
			) : null}

			{/* beneficiary */}
			<Win frame={f} a={494} b={612} top={L.benTop} outF={14}>
				<div style={{display: 'flex', justifyContent: 'center', opacity: ramp(f, 494, 510), transform: `scale(${0.8 + 0.2 * ramp(f, 494, 514, 0, 1, expoOut)})`}}>
					<div style={{width: 200, height: 200, borderRadius: '50%', border: `2px solid ${C.gold}`, background: 'rgba(217,180,106,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(217,180,106,0.3)'}}>
						<ArIcon name="building" size={120} />
					</div>
				</div>
				<ArText lines={TXT.beneficiaryLabel} frame={f} start={502} size={60} font={AF.body} weight={600} color={C.gold} glow="none" style={{marginTop: 40}} />
				<ArText lines={TXT.beneficiary} frame={f} start={510} size={112} weight={900} lineHeight={1.3} style={{marginTop: 20}} />
			</Win>

			{/* executing entity & partnership */}
			<Win frame={f} a={614} b={790} top={L.exeTop} outF={16}>
				<ArText lines={TXT.executorLabel} frame={f} start={620} size={60} font={AF.body} weight={600} color={C.gold} glow="none" />
				<ArText lines={TXT.executor} frame={f} start={626} size={84} weight={900} lineHeight={1.35} style={{marginTop: 14}} />
				<div style={{height: L === LL ? 34 : 60}} />
				<ArText lines={TXT.partnerLabel} frame={f} start={652} size={60} font={AF.body} weight={600} color={C.gold} glow="none" />
				<ArText lines={TXT.partner} frame={f} start={660} size={112} weight={900} color="#F0D48E" glow="gold" style={{marginTop: 10}} />
			</Win>
			{f >= 660 && f < 790 ? (
				<svg width={L.cx * 2} height={L === LL ? 1080 : 1920} style={{position: 'absolute', inset: 0, opacity: ringsIn * (1 - ramp(f, 774, 790))}}>
					{[-1, 1].map((s, i) => (
						<g key={i} transform={`translate(${L.cx + s * lerp(L.rings.spread[0], L.rings.spread[1], ringsIn)} ${L.rings.y})`}>
							<circle r={L.rings.r} fill="rgba(217,180,106,0.05)" stroke={C.gold} strokeWidth={3} />
							<circle r={L.rings.r * 0.88} fill="none" stroke={i ? C.cyan : C.gold} strokeOpacity={0.6} strokeDasharray="4 10" transform={`rotate(${f * (i ? -0.6 : 0.6)})`} />
						</g>
					))}
					<circle cx={L.cx} cy={L.rings.y} r={14 + 4 * Math.sin(f / 5)} fill="#F3DDA6" opacity={ramp(f, 690, 700)} style={{filter: `drop-shadow(0 0 16px ${C.gold})`}} />
				</svg>
			) : null}
		</AbsoluteFill>
	);
};
