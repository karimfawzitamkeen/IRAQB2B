import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, expoOut, lerp, ramp} from '../../theme';
import {Label, Words} from '../../components/Primitives';
import {Mission} from '../../scenes/Scene5';
import {CX} from '../layout';
import {PChapter} from '../ui';

/**
 * Scene 6 — Digital attestation (420–495f). Only now: signature, official seal, issuance.
 * (Signature, seal and the "Certificate issued" chip live on the DocJourney layer.)
 */
export const P6Attestation: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 412 || f > 522) return null;
	const crane = ramp(f, 418, 446, 0, 1, expoOut);
	const out = ramp(f, 502, 518);
	const m = {x: CX, y: 468, s: 0.55};

	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<PChapter frame={f} start={428} end={506} index="05" title="Digital Attestation" sub="Signed and sealed by the Commercial Attaché." />

			{/* the mission returns at the top (camera cranes up) */}
			<div
				style={{
					position: 'absolute',
					left: m.x - 220,
					top: m.y - 165,
					width: 440,
					height: 330,
					transform: `translateY(${(1 - crane) * -260}px) scale(${m.s})`,
					opacity: crane,
				}}
			>
				<div style={{position: 'absolute', left: -80, right: -80, top: 210, height: 200, background: 'radial-gradient(ellipse 50% 40% at 50% 40%, rgba(217,180,106,0.32) 0%, rgba(217,180,106,0) 70%)'}} />
				<Mission draw={ramp(f, 420, 450, 0, 1, (t) => t)} f={f} />
			</div>

			{/* statement */}
			<div style={{position: 'absolute', top: 1290, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<Words text="Digitally Attested" frame={f} start={468} stagger={5} dur={22} style={{fontFamily: F.sans, fontWeight: 300, fontSize: 80, color: C.white, letterSpacing: -1, textShadow: '0 4px 30px rgba(2,4,10,0.9)'}} />
				<div style={{width: 320 * ramp(f, 474, 494, 0, 1, expoOut), height: 1, marginTop: 8, background: `linear-gradient(90deg, rgba(217,180,106,0), ${C.gold}, rgba(217,180,106,0))`}} />
				<Label size={20} spacing={5} color={C.gold} style={{marginTop: 16, opacity: ramp(f, 478, 490), transform: `translateY(${lerp(8, 0, ramp(f, 478, 490))}px)`}}>
					Signed · Sealed · Issued
				</Label>
			</div>
		</AbsoluteFill>
	);
};
