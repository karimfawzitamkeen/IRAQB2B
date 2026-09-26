import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, useCurrentFrame} from 'remotion';
import './fonts';
import {kf, ramp} from '../theme';
import {Finish} from '../components/Background';
import {Backdrop} from './env';
import {TP_FONT_FACES} from './fonts';
import {P, PSAFE} from './theme';
import {S1Brand} from './scenes/S1Brand';
import {S2Home} from './scenes/S2Home';
import {S3Members} from './scenes/S3Members';
import {S4Market} from './scenes/S4Market';
import {S5Opps} from './scenes/S5Opps';
import {S6Services} from './scenes/S6Services';
import {S7Hub} from './scenes/S7Hub';
import {S8Close} from './scenes/S8Close';
import {S9Tamkeen} from './scenes/S9Tamkeen';

/**
 * TRADPOINT · Iraq Trade Ecosystem — 30 s 1080×1920 portrait commercial (STORYBOARD-TRADPOINT.md).
 * `guides` draws the critical text zone for review stills only.
 */
export const FilmTP: React.FC<{guides?: boolean}> = ({guides = false}) => {
	const frame = useCurrentFrame();
	const [handle] = useState(() => delayRender('tp-fonts'));
	useEffect(() => {
		Promise.all(TP_FONT_FACES.map(([f, t]) => document.fonts.load(f, t)))
			.then(() => document.fonts.ready)
			.then(() => continueRender(handle))
			.catch(() => continueRender(handle));
	}, [handle]);

	const fadeOut = ramp(frame, 892, 899, 0, 1, (t) => t * t);
	const energy = kf(frame, [[0, 0.4], [90, 1], [500, 2], [615, 0.6], [900, 0.4]]);
	const bd = ramp(frame, 0, 30, 0.35, 1);

	return (
		<AbsoluteFill style={{background: P.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{opacity: bd}}>
				<Backdrop frame={frame} energy={energy} />
			</AbsoluteFill>
			<S1Brand frame={frame} />
			<S2Home frame={frame} />
			<S3Members frame={frame} />
			<S4Market frame={frame} />
			<S5Opps frame={frame} />
			<S6Services frame={frame} />
			<S7Hub frame={frame} />
			<S8Close frame={frame} />
			<S9Tamkeen frame={frame} />
			<Finish frame={frame} vertical />
			<AbsoluteFill style={{background: '#000', opacity: fadeOut}} />
			{guides ? (
				<div style={{position: 'absolute', left: PSAFE.left, top: PSAFE.top, width: PSAFE.right - PSAFE.left, height: PSAFE.bottom - PSAFE.top, outline: '2px dashed rgba(255,60,60,0.8)'}} />
			) : null}
		</AbsoluteFill>
	);
};
