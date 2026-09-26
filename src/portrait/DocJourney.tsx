import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, expoInOut, expoOut, kf, ramp, smooth} from '../theme';
import {CertificateDoc, DOC_H, DOC_W, DocPlace} from '../components/Document';
import {DirBlur} from '../components/Primitives';
import {CX} from './layout';
import {Chip} from './ui';

/**
 * The hero certificate from the Attaché review (S4) to the final reveal (S7) is ONE object:
 * review → on hold behind the fee core → signed & sealed → hero reveal.
 */
export const JOURNEY_START = 278;
export const JOURNEY_END = 612;

export const docPose = (f: number) => ({
	x: CX,
	y: kf(f, [[278, 1560], [304, 1030], [322, 1030], [346, 880], [414, 880], [444, 920], [500, 920], [530, 880], [600, 876]], expoInOut) + Math.sin(f / 24) * 4,
	s: kf(f, [[278, 0.62], [322, 0.62], [346, 0.66], [414, 0.66], [444, 0.8], [500, 0.8], [530, 1.0], [600, 1.025]], expoInOut),
	o: kf(f, [[278, 0], [300, 1], [322, 1], [346, 0.16], [414, 0.16], [440, 1], [598, 1], [612, 0]], smooth),
	blur: kf(f, [[278, 10], [300, 0], [322, 0], [346, 5], [414, 5], [440, 0]], smooth),
	ry: kf(f, [[278, -8], [304, 0], [414, 0], [444, -8], [500, -4], [530, -6], [600, 4]], smooth),
	rx: kf(f, [[278, 10], [304, 4], [486, 4], [600, 2]], smooth),
});

/** Screen position of a document-local point (approximate projection; rotations stay small). */
export const docToScreen = (f: number, u: number, v: number) => {
	const p = docPose(f);
	const cosY = Math.cos((p.ry * Math.PI) / 180);
	const cosX = Math.cos((p.rx * Math.PI) / 180);
	return {x: p.x + (u - DOC_W / 2) * p.s * cosY, y: p.y + (v - DOC_H / 2) * p.s * cosX};
};

export const DocJourney: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < JOURNEY_START || f > JOURNEY_END) return null;
	const p = docPose(f);
	const q = docPose(f - 1);
	const top = p.y - (DOC_H / 2) * p.s;

	const underReview = ramp(f, 290, 300) * (1 - ramp(f, 306, 312));
	const eligible = ramp(f, 310, 320) * (1 - ramp(f, 326, 338));
	const issued = ramp(f, 474, 486) * (1 - ramp(f, 508, 518));

	const seal = ramp(f, 464, 478, 0, 1, expoOut);
	const sealPt = docToScreen(f, 378, 664);
	const shock = ramp(f, 470, 494, 0, 1, (t) => t);
	const lens = ramp(f, 290, 312, 0, 1, smooth);

	return (
		<AbsoluteFill>
			<DirBlur id="journey" vx={0} vy={p.y - q.y} k={0.14}>
				<DocPlace x={p.x} y={p.y} scale={p.s} ry={p.ry} rx={p.rx} opacity={p.o} blur={p.blur}>
					<CertificateDoc
						frame={f}
						id="journey"
						build={1}
						glow={0.45}
						gold={kf(f, [[300, 0], [322, 0.35], [420, 0.35], [446, 1]])}
						review={ramp(f, 312, 326, 0, 1, (t) => t)}
						signature={ramp(f, 440, 468, 0, 1, smooth)}
						seal={seal}
						qr={ramp(f, 512, 544, 0, 1, (t) => t)}
						serial={ramp(f, 518, 550, 0, 1, (t) => t)}
						validated={ramp(f, 520, 534, 0, 1, expoOut)}
						identity={ramp(f, 524, 556, 0, 1, (t) => t)}
						sheen={kf(f, [[540, -0.5], [580, 1.5]], smooth)}
					/>
					{/* Attaché review lens: a thin gold frame gliding down the page (no pen, no seal) */}
					{lens > 0 && lens < 1 ? (
						<div
							style={{
								position: 'absolute',
								left: 26,
								right: 26,
								top: 140 + lens * 540,
								height: 96,
								borderRadius: 10,
								border: `2px solid ${C.gold}`,
								background: 'rgba(217,180,106,0.07)',
								boxShadow: '0 0 30px rgba(217,180,106,0.35)',
								opacity: Math.sin(lens * Math.PI) * 1.4,
							}}
						/>
					) : null}
				</DocPlace>
			</DirBlur>

			{/* seal shockwave (screen space) */}
			{shock > 0 && shock < 1 ? (
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
					<circle cx={sealPt.x} cy={sealPt.y} r={50 + shock * 220} fill="none" stroke={C.gold} strokeOpacity={(1 - shock) * 0.9} strokeWidth={2.5 * (1 - shock) + 0.5} />
				</svg>
			) : null}

			{/* status chips centred on the document's top edge */}
			<div style={{position: 'absolute', left: 0, right: 0, top: top - 26, display: 'flex', justifyContent: 'center'}}>
				<div style={{position: 'relative', height: 52}}>
					{underReview > 0 ? <Chip text="UNDER REVIEW" color={C.white} p={underReview} frame={f} style={{position: 'absolute', left: '50%', transform: `translateX(-50%) scale(${0.85 + 0.15 * underReview})`}} /> : null}
					{eligible > 0 ? <Chip text="ELIGIBLE FOR ATTESTATION" color={C.gold} p={eligible} frame={f} style={{position: 'absolute', left: '50%', transform: `translateX(-50%) scale(${0.85 + 0.15 * eligible})`}} /> : null}
					{issued > 0 ? <Chip text="CERTIFICATE ISSUED" color={C.gold} p={issued} frame={f} style={{position: 'absolute', left: '50%', transform: `translateX(-50%) scale(${0.85 + 0.15 * issued})`}} /> : null}
				</div>
			</div>
		</AbsoluteFill>
	);
};
