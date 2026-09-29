import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, expoOut, ramp} from '../../theme';
import {ArText, GoldRule, Ornament} from '../kit';
import {AF, AT, TXT} from '../theme';

/** Closing slate (3060–3360f): platform title, message, patronage and credits — held to the fade. */
export const A5Close: React.FC<{frame: number}> = ({frame: f}) => {
	const [a] = AT.close;
	if (f < a) return null;
	const o = ramp(f, a, a + 12);
	return (
		<AbsoluteFill style={{opacity: o}}>
			<div style={{position: 'absolute', left: 540 - 120, top: 190}}>
				<Ornament size={240} draw={ramp(f, a, a + 46)} frame={f} glow={0.8} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 470}}>
				<ArText lines={TXT.launch2} frame={f} start={a + 8} size={112} weight={900} />
				<ArText lines={TXT.launch3} frame={f} start={a + 14} size={96} weight={900} color="#F0D48E" glow="gold" />
				<ArText lines="خطوة نحو تجارة عراقية رقمية" frame={f} start={a + 26} size={58} font={AF.body} weight={600} color={C.cyan} glow="cyan" stagger={2} style={{marginTop: 16}} />
			</div>
			<GoldRule p={ramp(f, a + 34, a + 54, 0, 1, expoOut)} w={700} top={960} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 990}}>
				<ArText lines={`${TXT.patron1} ${TXT.patron2}`} frame={f} start={a + 40} size={62} font={AF.naskh} weight={700} color="rgba(244,247,251,0.9)" glow="none" lineHeight={1.5} stagger={2} />
				<ArText lines={TXT.patron3} frame={f} start={a + 46} size={78} font={AF.naskh} weight={700} color="#F0D48E" glow="gold" lineHeight={1.5} stagger={3} />
				<div style={{height: 26}} />
				<ArText lines={TXT.beneficiaryLabel} frame={f} start={a + 54} size={40} font={AF.body} weight={600} color={C.gold} glow="none" lineHeight={1.4} />
				<ArText lines={TXT.beneficiary.join(' ')} frame={f} start={a + 56} size={48} font={AF.body} weight={600} color="rgba(244,247,251,0.9)" glow="none" stagger={1} lineHeight={1.4} />
				<ArText lines={TXT.executorLabel} frame={f} start={a + 62} size={40} font={AF.body} weight={600} color={C.gold} glow="none" lineHeight={1.4} style={{marginTop: 14}} />
				<ArText lines={TXT.executor} frame={f} start={a + 64} size={48} font={AF.body} weight={600} color="rgba(244,247,251,0.9)" glow="none" stagger={1} lineHeight={1.4} />
				<ArText lines={`${TXT.partnerLabel} ${TXT.partner}`} frame={f} start={a + 76} size={62} weight={900} color="#F0D48E" glow="gold" stagger={2} style={{marginTop: 22}} />
			</div>
		</AbsoluteFill>
	);
};
