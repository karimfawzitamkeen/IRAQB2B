import React from 'react';
import {AbsoluteFill} from 'remotion';
import {backOut, expoIn, expoOut, kf, lerp, ramp} from '../../theme';
import {AD_ORDER, AdContent, LedScreen, Statement, hexPath} from '../kit';
import {T, TCX, TF} from '../theme';

/** Scene 5 — Your brand owns the screen (330–435f). */
const CATS: {w: string; c: string}[] = [
	{w: 'مطاعم', c: '#FF7A45'},
	{w: 'أزياء', c: '#FF5FA2'},
	{w: 'تقنية', c: T.cyan},
	{w: 'خدمات', c: T.emerald},
	{w: 'معارض', c: T.turq},
	{w: 'تجارة', c: '#FFB23F'},
];
const CAT0 = 396;
const CAT_LEN = 5;
const VARIANTS = [
	{x: -330, y: -560},
	{x: 330, y: -560},
	{x: -400, y: 0},
	{x: 400, y: 0},
	{x: -330, y: 560},
	{x: 330, y: 560},
];

/** A generic brand assembling on the billboard (base coords 360×640). */
const BrandBuild: React.FC<{f: number}> = ({f}) => {
	const logo = ramp(f, 350, 360, 0, 1, backOut);
	const head = ramp(f, 356, 366, 0, 1, expoOut);
	const prod = ramp(f, 362, 374, 0, 1, backOut);
	const cta = ramp(f, 368, 378, 0, 1, backOut);
	return (
		<div style={{position: 'absolute', inset: 0}}>
			<AdContent kind="brand" frame={f} />
			<svg width={360} height={640} viewBox="0 0 360 640" style={{position: 'absolute', inset: 0}}>
				<g transform={`translate(180 92) scale(${logo})`} opacity={Math.min(1, logo)}>
					<path d={hexPath(44)} fill="rgba(19,198,179,0.15)" stroke={T.turq} strokeWidth={3} />
					<text y={9} textAnchor="middle" fontFamily={TF.en} fontWeight={800} fontSize={22} fill={T.white} letterSpacing={2}>
						LOGO
					</text>
				</g>
				<g transform={`translate(180 ${lerp(420, 360, prod)}) scale(${prod})`} opacity={Math.min(1, prod)}>
					<ellipse cy={92} rx={96} ry={16} fill={T.turq} opacity={0.3} />
					<rect x={-80} y={-40} width={160} height={124} rx={10} fill="url(#pg)" stroke={T.cyan} strokeWidth={2.5} />
					<rect x={-88} y={-70} width={176} height={36} rx={8} fill={T.teal} stroke={T.cyan} strokeWidth={2.5} />
					<rect x={-12} y={-70} width={24} height={154} fill={T.white} opacity={0.85} />
					<path d="M0 -72 C -30 -110, -64 -96, -40 -76 Z M0 -72 C 30 -110, 64 -96, 40 -76 Z" fill="none" stroke={T.white} strokeWidth={5} strokeLinejoin="round" />
					<defs>
						<linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
							<stop offset="0%" stopColor={T.turq} />
							<stop offset="100%" stopColor={T.teal} />
						</linearGradient>
					</defs>
				</g>
			</svg>
			<div dir="rtl" style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: TF.ar, fontWeight: 900, fontSize: 64, color: T.white, opacity: head, transform: `translateY(${(1 - head) * 30}px)`, textShadow: `0 0 20px ${T.turq}`}}>
				عرض جديد
			</div>
			<div dir="rtl" style={{position: 'absolute', left: 80, right: 80, top: 548, height: 58, borderRadius: 29, background: `linear-gradient(90deg, ${T.cyan}, ${T.turq})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TF.ar, fontWeight: 800, fontSize: 30, color: T.night, transform: `scale(${cta})`, opacity: Math.min(1, cta)}}>
				اطلب الآن
			</div>
		</div>
	);
};

export const S5Brand: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 326 || f > 462) return null;
	const rot = ramp(f, 330, 352, 0, 1, expoOut);
	const burst = ramp(f, 384, 398, 0, 1, expoIn);
	const fly = ramp(f, 386, 426, 0, 1, (t) => t);
	const exit = ramp(f, 446, 456, 0, 1, expoIn);
	const W = 500;
	const H = (W * 16) / 9;
	const catIdx = Math.floor((f - CAT0) / CAT_LEN);
	const place = ramp(f, 424, 434, 0, 1, expoOut);

	return (
		<AbsoluteFill style={{opacity: 1 - exit}}>
			{/* the billboard rotates toward camera, assembles a brand, then bursts */}
			{burst < 1 ? (
				<div style={{position: 'absolute', left: TCX - W / 2, top: 880 - H / 2, transform: `perspective(1600px) rotateY(${(1 - rot) * 75}deg) scale(${lerp(0.9, 1, rot) * (1 - burst * 0.6)})`, opacity: 1 - burst}}>
					<LedScreen w={W} glare={kf(f, [[352, -0.6], [372, 1.6]], (t) => t)}>
						<BrandBuild f={f} />
					</LedScreen>
				</div>
			) : null}
			{/* six creative variations fly out: many businesses can advertise */}
			{f >= 384
				? VARIANTS.map((v, i) => {
						const a = ramp(f, 384 + i, 398 + i, 0, 1, expoOut);
						const d = lerp(0.45, 1, a) + fly * 0.9;
						const o = Math.min(1, a * 2) * (1 - ramp(f, 418, 432)) * 0.85;
						return (
							<div key={i} style={{position: 'absolute', left: TCX + v.x * d - 110, top: 880 + v.y * d - 196, opacity: o, transform: `rotate(${(i % 2 ? 1 : -1) * 6 * fly}deg) scale(${1 + fly * 0.3})`}}>
								<LedScreen w={220} glow={0.7}>
									<AdContent kind={AD_ORDER[i]} frame={f} seed={i + 30} />
								</LedScreen>
							</div>
						);
					})
				: null}
			{/* rhythmic category words (text changes only — no full-screen strobing) */}
			{catIdx >= 0 && catIdx < CATS.length ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 800}}>
					<div style={{position: 'absolute', left: 60, right: 60, top: -70, height: 400, background: 'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(2,7,11,0.9), rgba(2,7,11,0))'}} />
					<Statement key={catIdx} text={CATS[catIdx].w} frame={f} start={CAT0 + catIdx * CAT_LEN} size={230} mode="slam" dur={3} style={{position: 'relative', textShadow: `0 0 50px ${CATS[catIdx].c}`}} color={T.white} />
					<div style={{margin: '0 auto', width: 260, height: 12, borderRadius: 6, background: CATS[catIdx].c, position: 'relative', boxShadow: `0 0 20px ${CATS[catIdx].c}`}} />
				</div>
			) : null}
			{/* مكانك هنا */}
			{f >= 424 ? (
				<>
					<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
						{[0, 6].map((d, k) => {
							const r = ramp(f, 424 + d, 450 + d, 0, 1, expoOut);
							return r > 0 && r < 1 ? <path key={k} d={hexPath(120 + r * 700, TCX, 900)} fill="none" stroke={k ? T.cyan : T.turq} strokeWidth={6 * (1 - r) + 1} strokeOpacity={1 - r} /> : null;
						})}
						<path d={hexPath(560, TCX, 900)} fill="none" stroke={T.turq} strokeOpacity={0.35 * place} strokeWidth={2} />
						{Array.from({length: 24}, (_, i) => {
							const a = (i / 24) * Math.PI * 2 + f * 0.01;
							const r0 = 280 + place * 60;
							const r1 = r0 + 120 + (i % 3) * 90;
							return <line key={i} x1={TCX + Math.cos(a) * r0} y1={900 + Math.sin(a) * r0} x2={TCX + Math.cos(a) * r1} y2={900 + Math.sin(a) * r1} stroke={i % 2 ? T.cyan : T.turq} strokeWidth={4} strokeLinecap="round" opacity={place * (0.35 + 0.25 * Math.sin(f / 4 + i))} />;
						})}
					</svg>
					<div style={{position: 'absolute', left: 0, right: 0, top: 790}}>
						<Statement text="مكانك هنا" frame={f} start={424} size={176} mode="slam" stagger={4} dur={9} />
					</div>
				</>
			) : null}
		</AbsoluteFill>
	);
};
