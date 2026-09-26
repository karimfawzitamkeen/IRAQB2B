import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, useCurrentFrame} from 'remotion';
import '../fonts';
import {FONT_FACES} from '../fonts';
import {C, ramp} from '../theme';
import {Background, Finish} from '../components/Background';
import {Globe} from '../components/Globe';
import {DocJourney} from './DocJourney';
import {PH, PW, SAFE, portraitGlobe} from './layout';
import {P1World} from './scenes/P1World';
import {P2Submission} from './scenes/P2Submission';
import {P3Verifier} from './scenes/P3Verifier';
import {P4AttacheReview} from './scenes/P4AttacheReview';
import {P5SovereignFee} from './scenes/P5SovereignFee';
import {P6Attestation} from './scenes/P6Attestation';
import {P7Final} from './scenes/P7Final';
import {P8Brand} from './scenes/P8Brand';

/**
 * Portrait master (1080×1920, 9:16) — STORYBOARD.md.
 * Persistent layers: background → globe → the certificate's continuous journey → scene layers → lens finish.
 */
/** `guides` draws the critical-zone overlay for review stills only; never on in the delivered render. */
export const Film9x16: React.FC<{guides?: boolean}> = ({guides = false}) => {
	const frame = useCurrentFrame();
	const [handle] = useState(() => delayRender('fonts'));
	useEffect(() => {
		Promise.all(FONT_FACES.map((f) => document.fonts.load(f)))
			.then(() => document.fonts.ready)
			.then(() => continueRender(handle))
			.catch(() => continueRender(handle));
	}, [handle]);

	const fadeIn = ramp(frame, 0, 10);
	const fadeOut = ramp(frame, 741, 749, 0, 1, (t) => t * t);

	return (
		<AbsoluteFill style={{background: C.black, overflow: 'hidden'}}>
			<Background frame={frame} w={PW} h={PH} vertical />
			<Globe frame={frame} cam={portraitGlobe} w={PW} h={PH} />
			<DocJourney frame={frame} />
			<P1World frame={frame} />
			<P2Submission frame={frame} />
			<P3Verifier frame={frame} />
			<P4AttacheReview frame={frame} />
			<P5SovereignFee frame={frame} />
			<P6Attestation frame={frame} />
			<P7Final frame={frame} />
			<P8Brand frame={frame} />
			<Finish frame={frame} vertical />
			<AbsoluteFill style={{background: '#000', opacity: Math.max(1 - fadeIn, fadeOut)}} />
			{guides ? (
				<div style={{position: 'absolute', left: SAFE.left, top: SAFE.top, width: SAFE.right - SAFE.left, height: SAFE.bottom - SAFE.top, outline: '2px dashed rgba(255,60,60,0.8)'}} />
			) : null}
		</AbsoluteFill>
	);
};
