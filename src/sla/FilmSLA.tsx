import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, useCurrentFrame} from 'remotion';
import '../fonts';
import './fonts';
import {FONT_FACES} from '../fonts';
import {ramp} from '../theme';
import {Finish} from '../components/Background';
import {Atmosphere} from './Atmosphere';
import {SLA_FONT_FACES} from './fonts';
import {S, SSAFE} from './theme';
import {S1Complexity} from './scenes/S1Complexity';
import {S2Portal} from './scenes/S2Portal';
import {S3Library} from './scenes/S3Library';
import {S4Contract} from './scenes/S4Contract';
import {S5Consultation} from './scenes/S5Consultation';
import {S6Cases} from './scenes/S6Cases';
import {S7Trust} from './scenes/S7Trust';
import {S8Brand} from './scenes/S8Brand';

/**
 * Smart Legal Advisor — 1080×1920 portrait brand film (STORYBOARD-SMART-LEGAL-ADVISOR.md).
 * `guides` draws the critical text zone for review stills only.
 */
export const FilmSLA: React.FC<{guides?: boolean}> = ({guides = false}) => {
	const frame = useCurrentFrame();
	const [handle] = useState(() => delayRender('sla-fonts'));
	useEffect(() => {
		Promise.all([...FONT_FACES.map((f) => document.fonts.load(f)), ...SLA_FONT_FACES.map(([f, t]) => document.fonts.load(f, t))])
			.then(() => document.fonts.ready)
			.then(() => continueRender(handle))
			.catch(() => continueRender(handle));
	}, [handle]);

	const fadeIn = ramp(frame, 0, 10);
	const fadeOut = ramp(frame, 742, 749, 0, 1, (t) => t * t);

	return (
		<AbsoluteFill style={{background: S.night, overflow: 'hidden'}}>
			<Atmosphere frame={frame} />
			<S1Complexity frame={frame} />
			<S2Portal frame={frame} />
			<S3Library frame={frame} />
			<S4Contract frame={frame} />
			<S5Consultation frame={frame} />
			<S6Cases frame={frame} />
			<S7Trust frame={frame} />
			<S8Brand frame={frame} />
			<Finish frame={frame} vertical />
			<AbsoluteFill style={{background: '#000', opacity: Math.max(1 - fadeIn, fadeOut)}} />
			{guides ? (
				<div style={{position: 'absolute', left: SSAFE.left, top: SSAFE.top, width: SSAFE.right - SSAFE.left, height: SSAFE.bottom - SSAFE.top, outline: '2px dashed rgba(255,60,60,0.8)'}} />
			) : null}
		</AbsoluteFill>
	);
};
