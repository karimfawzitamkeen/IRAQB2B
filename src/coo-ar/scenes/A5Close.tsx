import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, expoOut, ramp} from '../../theme';
import {ArText, GoldRule, Ornament, useLand} from '../kit';
import {AF, AT, TXT} from '../theme';

/** Closing slate (3060–3360f): platform title, message, patronage and credits — held to the fade. */
export const A5Close: React.FC<{frame: number}> = ({frame: f}) => {
	const [a] = AT.close;
	const land = useLand();
	if (f < a) return null;
	const o = ramp(f, a, a + 12);
	// landscape: title block on the right, credits on the left, a gold divider between them
	const K = land
		? {orn: {left: 1360 - 120, top: 120}, title: {top: 400, left: 960, width: 800}, rule: null as null | number, credits: {top: 150, left: 100, width: 820}, divider: true}
		: {orn: {left: 540 - 120, top: 190}, title: {top: 470, left: undefined as number | undefined, width: undefined as number | undefined}, rule: 960, credits: {top: 990, left: undefined as number | undefined, width: undefined as number | undefined}, divider: false};
	const mw = land ? 780 : 880;
	const col = (c: {top: number; left?: number; width?: number}): React.CSSProperties => ({position: 'absolute', top: c.top, ...(c.left === undefined ? {left: 0, right: 0} : {left: c.left, width: c.width})});
	return (
		<AbsoluteFill style={{opacity: o}}>
			<div style={{position: 'absolute', left: K.orn.left, top: K.orn.top}}>
				<Ornament size={240} draw={ramp(f, a, a + 46)} frame={f} glow={0.8} />
			</div>
			<div style={col(K.title)}>
				<ArText lines={TXT.launch2} frame={f} start={a + 8} size={112} weight={900} maxW={mw} />
				<ArText lines={TXT.launch3} frame={f} start={a + 14} size={96} weight={900} color="#F0D48E" glow="gold" maxW={mw} />
				<ArText lines="خطوة نحو تجارة عراقية رقمية" frame={f} start={a + 26} size={58} font={AF.body} weight={600} color={C.cyan} glow="cyan" stagger={2} style={{marginTop: 16}} maxW={mw} />
			</div>
			{K.rule !== null ? <GoldRule p={ramp(f, a + 34, a + 54, 0, 1, expoOut)} w={700} top={K.rule} /> : null}
			{K.divider ? <div style={{position: 'absolute', left: 958, top: 540 - 380 * ramp(f, a + 34, a + 60, 0, 1, expoOut), width: 3, height: 760 * ramp(f, a + 34, a + 60, 0, 1, expoOut), background: `linear-gradient(180deg, rgba(217,180,106,0), ${C.gold}, rgba(217,180,106,0))`, boxShadow: '0 0 16px rgba(217,180,106,0.5)'}} /> : null}
			<div style={col(K.credits)}>
				<ArText lines={`${TXT.patron1} ${TXT.patron2}`} frame={f} start={a + 40} size={62} font={AF.naskh} weight={700} color="rgba(244,247,251,0.9)" glow="none" lineHeight={1.5} stagger={2} maxW={mw} />
				<ArText lines={TXT.patron3} frame={f} start={a + 46} size={78} font={AF.naskh} weight={700} color="#F0D48E" glow="gold" lineHeight={1.5} stagger={3} maxW={mw} />
				<div style={{height: 26}} />
				<ArText lines={TXT.beneficiaryLabel} frame={f} start={a + 54} size={40} font={AF.body} weight={600} color={C.gold} glow="none" lineHeight={1.4} maxW={mw} />
				<ArText lines={TXT.beneficiary.join(' ')} frame={f} start={a + 56} size={48} font={AF.body} weight={600} color="rgba(244,247,251,0.9)" glow="none" stagger={1} lineHeight={1.4} maxW={mw} />
				<ArText lines={TXT.executorLabel} frame={f} start={a + 62} size={40} font={AF.body} weight={600} color={C.gold} glow="none" lineHeight={1.4} style={{marginTop: 14}} maxW={mw} />
				<ArText lines={TXT.executor} frame={f} start={a + 64} size={48} font={AF.body} weight={600} color="rgba(244,247,251,0.9)" glow="none" stagger={1} lineHeight={1.4} maxW={mw} />
				<ArText lines={`${TXT.partnerLabel} ${TXT.partner}`} frame={f} start={a + 76} size={62} weight={900} color="#F0D48E" glow="gold" stagger={2} style={{marginTop: 22}} maxW={mw} />
			</div>
		</AbsoluteFill>
	);
};
