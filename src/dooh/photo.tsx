import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

/** Real TAMKEEN screen photographs (supplied by TAMKEEN), with their natural pixel sizes. */
export const PHOTOS = {
	fair: {src: 'dooh/fair-totems-night.jpg', w: 591, h: 1280},
	billboard: {src: 'dooh/billboard-night.jpg', w: 591, h: 1280},
	tower: {src: 'dooh/led-tower.jpg', w: 1200, h: 1600},
	park: {src: 'dooh/totem-park.jpg', w: 1200, h: 1600},
	building: {src: 'dooh/totem-building.jpg', w: 567, h: 1280},
} as const;
export type PhotoKey = keyof typeof PHOTOS;

/** Cover-fit mapping from photo pixels to the 1080×1920 canvas (before any stage transform). */
export const coverMap = (k: PhotoKey) => {
	const p = PHOTOS[k];
	const s = Math.max(1080 / p.w, 1920 / p.h);
	const ox = (1080 - p.w * s) / 2;
	const oy = (1920 - p.h * s) / 2;
	return {s, ox, oy, x: (px: number) => ox + px * s, y: (py: number) => oy + py * s};
};

/**
 * A photograph as a living plate: cover-fit, with a camera transform (scale / pan / rotate) applied to
 * the photo AND its overlays together, so screen replacements stay locked to the real screens.
 */
export const PhotoStage: React.FC<{
	photo: PhotoKey;
	scale?: number;
	x?: number;
	y?: number;
	rotate?: number;
	origin?: string;
	grade?: string;
	children?: React.ReactNode;
	style?: React.CSSProperties;
}> = ({photo, scale = 1, x = 0, y = 0, rotate = 0, origin = '540px 960px', grade = 'saturate(1.12) contrast(1.06)', children, style}) => {
	const m = coverMap(photo);
	const p = PHOTOS[photo];
	return (
		<AbsoluteFill style={{overflow: 'hidden', ...style}}>
			<AbsoluteFill style={{transformOrigin: origin, transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`}}>
				<Img src={staticFile(p.src)} style={{position: 'absolute', left: m.ox, top: m.oy, width: p.w * m.s, height: p.h * m.s, filter: grade}} />
				{children}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
