import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, useCurrentFrame} from 'remotion';
import './fonts';
import {kf, ramp} from '../theme';
import {Finish} from '../components/Background';
import {Backdrop} from './env';
import {DOOH_FONT_FACES} from './fonts';
import {T, TSAFE} from './theme';
import {Hero} from './scenes/Hero';
import {S4Network, S7Advantage} from './scenes/Network';
import {S5Brand} from './scenes/S5Brand';
import {S6Montage} from './scenes/S6Montage';
import {S8Recall} from './scenes/S8Recall';

/**
 * TAMKEEN outdoor-screens commercial — 1080×1920 portrait LED master (STORYBOARD-TAMKEEN-DOOH.md).
 * `guides` draws the critical text zone for review stills only.
 */
export const FilmDOOH: React.FC<{guides?: boolean}> = ({guides = false}) => {
	const frame = useCurrentFrame();
	const [handle] = useState(() => delayRender('dooh-fonts'));
	useEffect(() => {
		Promise.all(DOOH_FONT_FACES.map(([f, t]) => document.fonts.load(f, t)))
			.then(() => document.fonts.ready)
			.then(() => continueRender(handle))
			.catch(() => continueRender(handle));
	}, [handle]);

	const fadeOut = ramp(frame, 742, 749, 0, 1, (t) => t * t);
	const energy = kf(frame, [[0, 0.3], [240, 1], [600, 2], [640, 0.6], [750, 0.6]]);
	// the backdrop only comes up once the first screen exists (scene 1 opens in pure black)
	const bd = ramp(frame, 20, 60);

	return (
		<AbsoluteFill style={{background: T.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{opacity: bd}}>
				<Backdrop frame={frame} energy={energy} />
			</AbsoluteFill>
			<Hero frame={frame} />
			<S4Network frame={frame} />
			<S5Brand frame={frame} />
			<S6Montage frame={frame} />
			<S7Advantage frame={frame} />
			<S8Recall frame={frame} />
			<Finish frame={frame} vertical />
			<AbsoluteFill style={{background: '#000', opacity: fadeOut}} />
			{guides ? (
				<div style={{position: 'absolute', left: TSAFE.left, top: TSAFE.top, width: TSAFE.right - TSAFE.left, height: TSAFE.bottom - TSAFE.top, outline: '2px dashed rgba(255,60,60,0.8)'}} />
			) : null}
		</AbsoluteFill>
	);
};
