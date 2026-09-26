import React from 'react';
import {AbsoluteFill} from 'remotion';
import {backOut, expoIn, expoInOut, expoOut, lerp, ramp} from '../../theme';
import {S, SCX, SF} from '../theme';
import {ArLabel, ArWords, Arch, Icon, IconName} from '../ui';

/** Scene 2 — One digital legal portal (90–180f). */
export const ARCH = {x: SCX, y: 650, w: 300, legs: 200};

export const SERVICES: {name: string; icon: IconName}[] = [
	{name: 'المكتبة القانونية', icon: 'library'},
	{name: 'توليد العقود', icon: 'contract'},
	{name: 'الترجمة القانونية', icon: 'translation'},
	{name: 'الاستشارات القانونية', icon: 'consultation'},
	{name: 'إدارة القضايا', icon: 'cases'},
	{name: 'المحامي الذكي', icon: 'smart'},
];

const nodeAppear = (i: number) => 118 + i * 7;
const ORBIT = {rx: 318, ry: 108, cy: 640};

const nodePos = (i: number, f: number) => {
	const a = ((f - 90) * 0.45 + i * 60 + 90) * (Math.PI / 180);
	const depth = Math.sin(a);
	return {x: SCX + ORBIT.rx * Math.cos(a), y: ORBIT.cy + ORBIT.ry * depth, depth};
};

export const S2Portal: React.FC<{frame: number}> = ({frame: f}) => {
	if (f < 88 || f > 190) return null;
	const draw = ramp(f, 90, 112, 0, 1, expoOut);
	const flash = ramp(f, 104, 112) * (1 - ramp(f, 112, 132));
	const exit = ramp(f, 164, 180, 0, 1, expoIn);
	const brandOut = ramp(f, 162, 176);
	const pick = ramp(f, 166, 188, 0, 1, expoInOut); // library node flies at camera

	const nodes = SERVICES.map((s, i) => {
		const p = nodePos(i, f);
		const a = ramp(f, nodeAppear(i), nodeAppear(i) + 14, 0, 1, backOut);
		return {...s, i, ...p, a};
	});
	const back = nodes.filter((n) => n.depth < 0);
	const front = nodes.filter((n) => n.depth >= 0);

	const Node = ({n}: {n: (typeof nodes)[number]}) => {
		if (n.a <= 0) return null;
		const isPick = n.i === 0;
		const k = isPick ? pick : 0;
		const x = lerp(n.x, SCX, k);
		const y = lerp(n.y, 880, k);
		const sc = (0.82 + 0.22 * (n.depth + 1) / 2) * n.a * (1 + k * 5);
		const o = (0.5 + 0.5 * (n.depth + 1) / 2) * Math.min(1, n.a) * (isPick ? 1 - ramp(f, 180, 190) : 1 - exit);
		const lit = isPick ? ramp(f, 160, 170) : 0;
		const R = 46;
		return (
			<div style={{position: 'absolute', left: x - R, top: y - R, width: R * 2, height: R * 2, transform: `scale(${sc})`, opacity: o}}>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						borderRadius: '50%',
						background: `radial-gradient(circle at 50% 35%, rgba(244,242,236,0.12), rgba(10,15,22,0.85) 70%)`,
						border: `1.5px solid ${n.icon === 'smart' ? S.emerald : S.goldHair}`,
						boxShadow: `0 0 ${18 + lit * 40}px rgba(201,164,92,${0.2 + lit * 0.6})`,
					}}
				/>
				<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Icon name={n.icon} size={50} color={n.icon === 'smart' ? S.emerald : S.goldLight} />
				</div>
			</div>
		);
	};

	// one label at a time, under the orbit
	const labelIdx = nodes.reduce((acc, n) => (f >= nodeAppear(n.i) ? n.i : acc), -1);

	return (
		<AbsoluteFill>
			{/* perspective rings behind the arch */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: draw * (1 - exit)}}>
				{[200, 270, 340, 410].map((rx, i) => (
					<ellipse key={i} cx={SCX} cy={ORBIT.cy} rx={rx * (0.8 + 0.2 * draw)} ry={rx * 0.3} fill="none" stroke={i % 2 ? S.gold : S.emerald} strokeOpacity={0.14 + (i === 2 ? 0.1 : 0)} strokeWidth={1.2} strokeDasharray={i === 2 ? '3 9' : undefined} transform={`rotate(${i === 2 ? f * 0.2 : 0} ${SCX} ${ORBIT.cy})`} />
				))}
			</svg>
			{back.map((n) => (
				<Node key={n.i} n={n} />
			))}
			{/* the portal */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: 1 - exit}}>
				<defs>
					<radialGradient id="s2-inner" cx="50%" cy="60%" r="60%">
						<stop offset="0%" stopColor={S.emerald} stopOpacity={0.16 + flash * 0.4} />
						<stop offset="55%" stopColor={S.emerald} stopOpacity={0.05 + flash * 0.1} />
						<stop offset="100%" stopColor={S.emerald} stopOpacity={0} />
					</radialGradient>
				</defs>
				<g transform={`translate(${ARCH.x} ${ARCH.y})`}>
					<ellipse cx={0} cy={-40} rx={170} ry={230} fill="url(#s2-inner)" opacity={draw} />
					<Arch w={ARCH.w} legs={ARCH.legs} draw={draw} glow={flash} stroke={2.4} />
					<line x1={-ARCH.w / 2 - 30} y1={ARCH.legs} x2={ARCH.w / 2 + 30} y2={ARCH.legs} stroke={S.gold} strokeWidth={1.4} strokeOpacity={0.6 * draw} />
					{flash > 0 ? <circle cx={0} cy={-50} r={40 + flash * 160} fill="none" stroke={S.emerald} strokeOpacity={flash * 0.8} strokeWidth={2} /> : null}
				</g>
			</svg>
			{front.map((n) => (
				<Node key={n.i} n={n} />
			))}

			{/* brand reveal */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 920, opacity: 1 - brandOut, transform: `translateY(${-brandOut * 30}px)`, filter: brandOut > 0 ? `blur(${brandOut * 8}px)` : undefined}}>
				<ArWords text="منصة المستشار" frame={f} start={108} stagger={5} dur={22} style={{fontSize: 88, fontWeight: 600, color: S.white, lineHeight: 1.25}} />
				<ArWords text="القانوني الذكي" frame={f} start={116} stagger={5} dur={22} style={{fontSize: 88, fontWeight: 600, color: S.white, lineHeight: 1.25}} />
				<ArWords text="بوابة رقمية للخدمات القانونية" frame={f} start={128} stagger={3} dur={20} style={{fontSize: 42, fontWeight: 400, color: S.gold, lineHeight: 1.3, marginTop: 8}} />
			</div>

			{/* service name: one at a time */}
			{labelIdx >= 0 && brandOut < 1 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1318, height: 70, opacity: 1 - brandOut}}>
					{nodes.map((n) => {
						const t0 = nodeAppear(n.i);
						const inn = ramp(f, t0, t0 + 6);
						const out = n.i < 5 ? ramp(f, nodeAppear(n.i + 1), nodeAppear(n.i + 1) + 5) : 0;
						const o = inn * (1 - out);
						if (o <= 0) return null;
						return (
							<div key={n.i} style={{position: 'absolute', left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, opacity: o, transform: `translateY(${(1 - inn) * 12 - out * 12}px)`}}>
								<ArLabel size={40} color={n.icon === 'smart' ? S.emerald : S.goldLight} weight={500}>
									{n.name}
								</ArLabel>
							</div>
						);
					})}
				</div>
			) : null}
			{/* counter: how many of the six services are assembled (instrumentation, subtle) */}
			{labelIdx >= 0 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1400, display: 'flex', justifyContent: 'center', gap: 12, opacity: 1 - brandOut}}>
					{nodes.map((n) => (
						<div key={n.i} style={{width: 34, height: 3, borderRadius: 2, background: n.a > 0.5 ? (n.icon === 'smart' ? S.emerald : S.gold) : 'rgba(244,242,236,0.18)'}} />
					))}
				</div>
			) : null}
		</AbsoluteFill>
	);
};
