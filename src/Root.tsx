import React from 'react';
import {Composition} from 'remotion';
import {Film} from './Film';
import {Film9x16} from './portrait/Film9x16';
import {FilmSLA} from './sla/FilmSLA';
import {FilmDOOH} from './dooh/FilmDOOH';
import {TDUR, TH, TW} from './dooh/theme';
import {SLA_DUR, SLA_H, SLA_W} from './sla/theme';
import {PDUR, PH, PW} from './portrait/layout';
import {DURATION, FPS, HEIGHT, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => (
	<>
		{/* Portrait display-screen master — 1080×1920, 9:16, 30 s */}
		<Composition id="CertificateOfOrigin9x16" component={Film9x16} durationInFrames={PDUR} fps={FPS} width={PW} height={PH} />
		{/* Smart Legal Advisor — separate 1080×1920 brand film for the same portrait display */}
		<Composition id="SmartLegalAdvisor9x16" component={FilmSLA} durationInFrames={SLA_DUR} fps={FPS} width={SLA_W} height={SLA_H} />
		{/* TAMKEEN outdoor-screens commercial — same 1080×1920 LED master */}
		<Composition id="TamkeenDOOH9x16" component={FilmDOOH} durationInFrames={TDUR} fps={FPS} width={TW} height={TH} />
		{/* Original landscape version — 1920×1080, 16:9 */}
		<Composition id="CertificateOfOrigin" component={Film} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
	</>
);
