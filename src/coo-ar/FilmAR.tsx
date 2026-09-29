import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, useCurrentFrame} from 'remotion';
import '../fonts';
import './fonts';
import {FONT_FACES} from '../fonts';
import {C, kf, ramp} from '../theme';
import {Background, Finish} from '../components/Background';
import {Globe, type GlobeCam} from '../components/Globe';
import {AR_FONT_FACES} from './fonts';
import {ADUR, AH, ASAFE, AW} from './theme';
import {A1Opening} from './scenes/A1Opening';
import {A2Shift} from './scenes/A2Shift';
import {A3Flow} from './scenes/A3Flow';
import {A4Benefits} from './scenes/A4Benefits';
import {A5Close} from './scenes/A5Close';

/** Globe: faint dome behind the ceremony, near-invisible during the workflow, planet horizon at the close. */
const arCam = (f: number): GlobeCam => ({
	lon0: 20 + f * 0.06,
	lat0: kf(f, [[0, 22], [3000, 22], [3100, -20], [3360, -22]]),
	cx: 540,
	cy: kf(f, [[0, 560], [780, 560], [1020, 900], [3040, 900], [3100, 1900], [3360, 1920]]),
	R: kf(f, [[0, 420], [780, 520], [1020, 700], [3040, 700], [3100, 900], [3360, 930]]),
	opacity: kf(f, [[0, 0], [30, 0], [120, 0.22], [760, 0.22], [800, 0.1], [1020, 0.07], [3040, 0.07], [3110, 0.45], [3360, 0.45]]),
	blur: kf(f, [[0, 1.5], [3040, 1.5], [3100, 0]]),
	arcs: kf(f, [[0, 0.5], [3040, 0.5], [3100, 0.8]]),
});

/**
 * Arabic ceremony film — launch of the Digital Certificate of Origin platform (STORYBOARD-COO-AR.md).
 * `guides` draws the critical zone for review stills only.
 */
export const FilmAR: React.FC<{guides?: boolean}> = ({guides = false}) => {
	const frame = useCurrentFrame();
	const [handle] = useState(() => delayRender('ar-fonts'));
	useEffect(() => {
		Promise.all([...FONT_FACES.map((f) => document.fonts.load(f)), ...AR_FONT_FACES.map(([f, t]) => document.fonts.load(f, t))])
			.then(() => document.fonts.ready)
			.then(() => continueRender(handle))
			.catch(() => continueRender(handle));
	}, [handle]);

	const fadeIn = ramp(frame, 0, 12);
	const fadeOut = ramp(frame, ADUR - 10, ADUR - 1, 0, 1, (t) => t * t);
	return (
		<AbsoluteFill style={{background: C.black, overflow: 'hidden'}}>
			<Background frame={frame} w={AW} h={AH} vertical />
			<Globe frame={frame} cam={arCam} w={AW} h={AH} />
			<A1Opening frame={frame} />
			<A2Shift frame={frame} />
			<A3Flow frame={frame} />
			<A4Benefits frame={frame} />
			<A5Close frame={frame} />
			<Finish frame={frame} vertical />
			<AbsoluteFill style={{background: '#000', opacity: Math.max(1 - fadeIn, fadeOut)}} />
			{guides ? <div style={{position: 'absolute', left: ASAFE.left, top: ASAFE.top, width: ASAFE.right - ASAFE.left, height: ASAFE.bottom - ASAFE.top, outline: '2px dashed rgba(255,60,60,0.8)'}} /> : null}
		</AbsoluteFill>
	);
};
