import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import '../fonts';
import '../coo-ar/fonts';
import {FONT_FACES} from '../fonts';
import {C, ramp} from '../theme';
import {Background, Finish} from '../components/Background';
import {Globe} from '../components/Globe';
import {AR_FONT_FACES} from '../coo-ar/fonts';
import {LandCtx} from '../coo-ar/kit';
import {Captions, storyCam} from './parts';
import {SDUR, SH, SSAFE, SW} from './theme';
import {SWorld, SMeaning} from './scenes/SWorld';
import {SOld} from './scenes/SOld';
import {SPlatform} from './scenes/SPlatform';
import {STravel} from './scenes/STravel';
import {SCert} from './scenes/SCert';
import {SClose} from './scenes/SClose';

/**
 * «من رحلة طويلة إلى خدمة رقمية» (STORYBOARD-COO-STORY.md), 1920×1080, 118 s.
 * `captions` burns the voice-over in for review; `vo` mixes public/coo-story/vo.wav once recorded;
 * `guides` draws the safe area.
 */
export const FilmStory: React.FC<{captions?: boolean; vo?: boolean; guides?: boolean}> = ({captions = false, vo = false, guides = false}) => {
	const frame = useCurrentFrame();
	const [handle] = useState(() => delayRender('story-fonts'));
	useEffect(() => {
		Promise.all([...FONT_FACES.map((f) => document.fonts.load(f)), ...AR_FONT_FACES.map(([f, t]) => document.fonts.load(f, t))])
			.then(() => document.fonts.ready)
			.then(() => continueRender(handle))
			.catch(() => continueRender(handle));
	}, [handle]);
	const fadeIn = ramp(frame, 0, 12);
	const fadeOut = ramp(frame, SDUR - 10, SDUR - 1, 0, 1, (t) => t * t);
	// the launch slate sits on near-black
	const dark = ramp(frame, 3230, 3262) ;
	return (
		<LandCtx.Provider value>
			<AbsoluteFill style={{background: C.black, overflow: 'hidden'}}>
				<Audio src={staticFile('coo-story/score.wav')} />
				{vo ? <Audio src={staticFile('coo-story/vo.wav')} /> : null}
				<Background frame={frame} w={SW} h={SH} />
				<AbsoluteFill style={{background: '#000', opacity: dark * 0.55}} />
				<Globe frame={frame} cam={storyCam} w={SW} h={SH} />
				<SWorld frame={frame} />
				<SOld frame={frame} />
				<SPlatform frame={frame} />
				<STravel frame={frame} />
				<SCert frame={frame} />
				<SClose frame={frame} />
				<SMeaning frame={frame} />
				<Finish frame={frame} />
				{captions ? <Captions frame={frame} /> : null}
				<AbsoluteFill style={{background: '#000', opacity: Math.max(1 - fadeIn, fadeOut)}} />
				{guides ? <div style={{position: 'absolute', left: SSAFE.left, top: SSAFE.top, width: SSAFE.right - SSAFE.left, height: SSAFE.bottom - SSAFE.top, outline: '2px dashed rgba(255,60,60,0.8)'}} /> : null}
			</AbsoluteFill>
		</LandCtx.Provider>
	);
};
