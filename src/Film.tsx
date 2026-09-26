import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, useCurrentFrame} from 'remotion';
import './fonts';
import {FONT_FACES} from './fonts';
import {C, ramp} from './theme';
import {Background, Finish} from './components/Background';
import {Globe} from './components/Globe';
import {Scene1} from './scenes/Scene1';
import {Scene2} from './scenes/Scene2';
import {Scene3} from './scenes/Scene3';
import {Scene4} from './scenes/Scene4';
import {Scene5} from './scenes/Scene5';
import {Scene6} from './scenes/Scene6';
import {Scene7} from './scenes/Scene7';

export const Film: React.FC = () => {
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
			<Background frame={frame} />
			<Globe frame={frame} />
			<Scene1 frame={frame} />
			<Scene2 frame={frame} />
			<Scene3 frame={frame} />
			<Scene4 frame={frame} />
			<Scene5 frame={frame} />
			<Scene6 frame={frame} />
			<Scene7 frame={frame} />
			<Finish frame={frame} />
			<AbsoluteFill style={{background: '#000', opacity: Math.max(1 - fadeIn, fadeOut)}} />
		</AbsoluteFill>
	);
};
