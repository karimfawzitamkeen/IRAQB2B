import React from 'react';
import {Composition} from 'remotion';
import {Film} from './Film';
import {Film9x16} from './portrait/Film9x16';
import {PH, PW} from './portrait/layout';
import {DURATION, FPS, HEIGHT, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => (
	<>
		{/* Portrait social master — 1080×1920, 9:16 */}
		<Composition id="CertificateOfOrigin9x16" component={Film9x16} durationInFrames={DURATION} fps={FPS} width={PW} height={PH} />
		{/* Original landscape version — 1920×1080, 16:9 */}
		<Composition id="CertificateOfOrigin" component={Film} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
	</>
);
