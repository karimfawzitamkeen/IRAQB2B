"""Original score for «من رحلة طويلة إلى خدمة رقمية» (CooStory16x9, 118 s @ 30 fps).

Synthesised from scratch (no samples, no third-party music), with the same instruments as the
ceremony film: string-like pads, sub bass, plucked pulse, bells, impacts and risers. It is written
to sit under a voice-over: the old world is a sparse D minor with clock ticks, the digital world
turns to D major with a light pulse. Accents land on the film's events (stations, the missing
document, the rewind, the gates, the seal, the launch slate).
Output: public/coo-story/score.wav (48 kHz stereo).
"""
import numpy as np, wave, os

SR = 48000
FPS = 30
DUR = 3540 / FPS
N = int(DUR * SR)
rng = np.random.default_rng(7)
L = np.zeros(N); R = np.zeros(N)          # dry
RL = np.zeros(N); RR = np.zeros(N)        # reverb send

def s(fr): return int(fr / FPS * SR)
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
NOTE = {'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'Ab': 8, 'A': 9, 'Bb': 10, 'B': 11}
def m(name, octv): return 12 * (octv + 1) + NOTE[name]

def add(sig, at, pan=0.0, gain=1.0, send=0.35):
    i0 = max(0, at); i1 = min(N, at + len(sig))
    if i1 <= i0: return
    x = sig[i0 - at:i1 - at] * gain
    gl = np.sqrt(0.5 * (1 - pan)); gr = np.sqrt(0.5 * (1 + pan))
    L[i0:i1] += x * gl; R[i0:i1] += x * gr
    RL[i0:i1] += x * gl * send; RR[i0:i1] += x * gr * send

def env(n, a, r, sustain=1.0):
    e = np.full(n, sustain)
    na = min(n, int(a * SR)); nr = min(n, int(r * SR))
    if na: e[:na] = np.linspace(0, sustain, na) ** 1.5
    if nr: e[-nr:] *= np.linspace(1, 0, nr) ** 1.5
    return e

def lowpass(x, k):
    # cheap smoothing (moving average, applied twice)
    if k <= 1: return x
    c = np.ones(k) / k
    return np.convolve(np.convolve(x, c, 'same'), c, 'same')

# ---------------------------------------------------------------- pads
def pad(notes, f0, f1, gain=0.08, bright=6, pan_spread=0.5):
    a = s(f0); n = s(f1) - a + int(1.6 * SR)
    t = np.arange(n) / SR
    e = env(n, 1.4, 1.8)
    for k, mm in enumerate(notes):
        f = hz(mm)
        sig = np.zeros(n)
        for det in (-0.07, 0.0, 0.06):
            ff = f * 2 ** (det / 12)
            ph = rng.uniform(0, 2 * np.pi)
            for h in range(1, bright + 1):
                sig += np.sin(2 * np.pi * ff * h * t + ph * h) / h ** 1.6
        vib = 1 + 0.08 * np.sin(2 * np.pi * (0.13 + 0.03 * k) * t)
        pan = pan_spread * (k / max(1, len(notes) - 1) * 2 - 1)
        add(sig * e * vib / 3, a, pan, gain, 0.6)

def bass(note, f0, f1, gain=0.18):
    a = s(f0); n = s(f1) - a + int(1.0 * SR)
    t = np.arange(n) / SR
    f = hz(note)
    sig = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)
    add(sig * env(n, 0.8, 1.2), a, 0, gain, 0.1)

# ---------------------------------------------------------------- one-shots
def pluck(note, at, gain=0.09, pan=0.0, dec=0.45):
    n = int(1.4 * SR); t = np.arange(n) / SR; f = hz(note)
    sig = sum(np.sin(2 * np.pi * f * h * t) * np.exp(-t * (1 / dec) * (1 + 0.6 * h)) / h for h in range(1, 7))
    sig *= np.minimum(1, t * 400)
    add(sig, at, pan, gain, 0.45)

def bell(note, at, gain=0.12, pan=0.0):
    n = int(4.0 * SR); t = np.arange(n) / SR; f = hz(note)
    parts = [(1, 1.0, 2.6), (2.0, 0.5, 1.8), (3.01, 0.28, 1.2), (4.2, 0.18, 0.8), (5.43, 0.12, 0.5)]
    sig = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / d) for r, a, d in parts)
    sig *= np.minimum(1, t * 800)
    add(sig, at, pan, gain, 0.7)

def boom(at, gain=0.5, low=36):
    n = int(2.6 * SR); t = np.arange(n) / SR
    f = low + 55 * np.exp(-t * 7)
    ph = 2 * np.pi * np.cumsum(f) / SR
    sig = np.sin(ph) * np.exp(-t * 1.6)
    click = lowpass(rng.standard_normal(n), 30) * np.exp(-t * 28) * 3
    add(sig + click, at, 0, gain, 0.25)

def shimmer(at, gain=0.05, length=2.2):
    n = int(length * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n)
    hp = x - lowpass(x, 6)
    add(hp * np.exp(-t * 2.2) * np.minimum(1, t * 200), at, 0, gain, 0.8)

def riser(end, length=1.6, gain=0.06):
    n = int(length * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n)
    y = x - lowpass(x, 3)
    e = (t / length) ** 2.2
    add(y * e, end - n, 0, gain, 0.6)

def tick(at, gain=0.05, pan=0.0):
    n = int(0.06 * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n)
    add((x - lowpass(x, 4)) * np.exp(-t * 90), at, pan, gain, 0.2)

# ---------------------------------------------------------------- the cue sheet (frames)
D1, D2, A1, Bb1, G1, F2, C2, E2 = m('D', 1), m('D', 2), m('A', 1), m('Bb', 1), m('G', 1), m('F', 2), m('C', 2), m('E', 2)
Dm  = [m('D', 3), m('A', 3), m('F', 4), m('D', 5)]
Dmj = [m('D', 3), m('A', 3), m('F#', 4), m('D', 5)]
Bb  = [m('Bb', 2), m('F', 3), m('D', 4), m('Bb', 4)]
F   = [m('F', 3), m('C', 4), m('A', 4), m('F', 5)]
Gm  = [m('G', 2), m('D', 3), m('Bb', 3), m('G', 4)]
G   = [m('G', 2), m('D', 3), m('B', 3), m('G', 4)]
A   = [m('A', 2), m('E', 3), m('C#', 4), m('A', 4)]
Asus= [m('A', 2), m('E', 3), m('D', 4), m('A', 4)]
Bm  = [m('B', 2), m('F#', 3), m('D', 4), m('B', 4)]
Em  = [m('E', 3), m('B', 3), m('G', 4), m('E', 5)]
Cdim= [m('C', 3), m('Eb', 3), m('F#', 4), m('C', 5)]

SECTIONS = [  # (from, to, chord, bass, pad gain)
    (0, 210, Dm, D2, 0.06),
    (210, 380, Dm, D2, 0.055), (380, 540, Bb, Bb1, 0.055),
    (540, 640, Cdim, C2, 0.05), (640, 810, Gm, G1, 0.05),
    (810, 950, Asus, A1, 0.06), (950, 1050, Dmj, D2, 0.08),
    (1050, 1200, Dmj, D2, 0.065), (1200, 1350, G, G1, 0.065),
    (1350, 1456, Bm, m('B', 1), 0.065), (1456, 1584, G, G1, 0.065), (1584, 1706, A, A1, 0.07), (1706, 1770, Dmj, D2, 0.08),
    (1770, 1890, Em, E2, 0.06), (1890, 2010, A, A1, 0.065),
    (2010, 2132, Gm, G1, 0.055), (2132, 2220, Dmj, D2, 0.075),
    (2220, 2330, Bm, m('B', 1), 0.065), (2330, 2490, Dmj, D2, 0.08),
    (2490, 2730, G, G1, 0.07),
    (2730, 2790, Dmj, D2, 0.075), (2790, 2850, A, A1, 0.075), (2850, 2910, Bm, m('B', 1), 0.075), (2910, 2970, G, G1, 0.075), (2970, 3030, A, A1, 0.075),
    (3030, 3140, G, G1, 0.08), (3140, 3240, Dmj, D2, 0.09),
    (3240, 3372, Bm, m('B', 1), 0.075), (3372, 3540, Dmj, D2, 0.1),
]
for f0, f1, ch, bn, g in SECTIONS:
    pad(ch, f0, f1, g * 1.15, bright=4 if f0 < 810 else 6)
    bass(bn, f0, f1, 0.06)

cur = lambda fr: next(c for a, b, c, _, _ in SECTIONS if a <= fr < b)
# old world: a slow, heavy pluck every 18 frames (clock-like), only under the journey
for k, fr in enumerate(range(222, 540, 18)):
    pluck(cur(fr)[1] - 12, s(fr), 0.05, pan=0.3 if k % 2 else -0.3, dec=0.6)
# the clock: ticks that speed up while the days go by
fr = 640.0; k = 0
while fr < 790:
    tick(s(int(fr)), 0.07, -0.3 if k % 2 else 0.3)
    fr += max(3.0, 15 - (fr - 640) / 12); k += 1
for fr in range(240, 540, 15):
    tick(s(fr), 0.035, 0.2)

# digital world: light eighth-note pulse (every 9 frames = 100 BPM), lower under dense narration
k = 0
for fr in range(1050, 3030, 9):
    if 2010 <= fr < 2132: continue
    ch = cur(fr)
    arp = [ch[1], ch[2], ch[3], ch[2]]
    note = arp[k % 4] + (12 if 2730 <= fr and k % 8 == 3 else 0)
    level = 0.055 if 1350 <= fr < 1770 or 2730 <= fr else 0.042
    pluck(note, s(fr), level * min(1.0, (fr - 1050) / 90), pan=0.35 if k % 2 else -0.35)
    k += 1

# accents
for fr in [304, 352, 398, 474, 518]:            # stations of the old journey
    pluck(m('D', 4), s(fr), 0.07, dec=0.9)
boom(s(572), 0.25, 44); bell(m('Eb', 5), s(572), 0.06); bell(m('A', 4), s(574), 0.05)   # missing document
riser(s(672), 2.0, 0.07)                        # the rewind
boom(s(672), 0.2, 40)
riser(s(950), 3.0, 0.06); boom(s(950), 0.32, 36); shimmer(s(950), 0.06, 3.0)            # the service appears
bell(m('A', 5), s(960), 0.08); bell(m('D', 6), s(972), 0.06)
for fr in [1124, 1158, 1192]:                   # uploads
    bell(m('F#', 5), s(fr), 0.05)
bell(m('A', 5), s(1290), 0.07)                  # one electronic file
riser(s(1350), 1.2, 0.05)
for i, fr in enumerate([1392, 1456, 1520, 1584, 1648]):   # the gates
    boom(s(fr), 0.12, 50); bell([m('B', 5), m('D', 6), m('E', 6), m('F#', 6), m('G', 6)][i], s(fr), 0.05, pan=-0.2 if i % 2 else 0.2)
boom(s(1706), 0.3, 38); shimmer(s(1706), 0.06, 3.0); bell(m('A', 6), s(1706), 0.07)  # attestation
bell(m('G', 5), s(1800), 0.05); bell(m('E', 6), s(1890), 0.07)        # needs completion → received
bell(m('A', 5), s(1940), 0.05)
shimmer(s(2096), 0.04, 1.6)                      # the weeks fall
riser(s(2132), 1.4, 0.06); boom(s(2132), 0.28, 38); bell(m('D', 6), s(2134), 0.07)
riser(s(2236), 1.0, 0.04)
boom(s(2330), 0.34, 36); shimmer(s(2330), 0.06, 3.0); bell(m('D', 5), s(2330), 0.09)  # the seal
bell(m('A', 5), s(2432), 0.08)                  # verified
for i in range(3):
    bell([m('D', 6), m('F#', 6), m('A', 6)][i], s(2606 + i * 12), 0.05)
for i in range(5):
    fr = 2730 + i * 60
    boom(s(fr), 0.1, 50); bell([m('D', 6), m('E', 6), m('F#', 6), m('D', 6), m('A', 6)][i], s(fr + 4), 0.05, pan=-0.2 if i % 2 else 0.2)
riser(s(3030), 1.4, 0.05); boom(s(3030), 0.2, 40)
bell(m('D', 6), s(3170), 0.07); bell(m('A', 5), s(3182), 0.05)  # «أينما كان»
boom(s(3264), 0.3, 36); shimmer(s(3264), 0.05, 3.0)               # logo
bell(m('D', 5), s(3316), 0.1)                                   # the minister's name
riser(s(3372), 1.4, 0.05); boom(s(3372), 0.3, 38); shimmer(s(3372), 0.05, 3.0)
bell(m('D', 6), s(3382), 0.08); bell(m('F#', 5), s(3394), 0.06); bell(m('A', 5), s(3406), 0.06)

# ---------------------------------------------------------------- reverb + master
def reverb(x, secs=2.8, seed=1):
    n = int(secs * SR); t = np.arange(n) / SR
    ir = np.random.default_rng(seed).standard_normal(n) * np.exp(-t * 3.2 / secs * 2.3)
    ir = lowpass(ir, 3); ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    y = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[:len(x)]
    return y

outL = L + reverb(RL, seed=1) * 0.9
outR = R + reverb(RR, seed=2) * 0.9
# fade in / out with the picture
fade = np.ones(N)
fi = int(0.4 * SR); fade[:fi] = np.linspace(0, 1, fi)
fo = s(3540) - s(3470); fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
outL *= fade; outR *= fade
peak = max(np.max(np.abs(outL)), np.max(np.abs(outR)))
g = 10 ** (-1.0 / 20) / peak
st = np.stack([outL * g, outR * g], axis=1)
pcm = (np.clip(st, -1, 1) * 32767).astype('<i2')
out = os.path.join(os.path.dirname(__file__), '..', 'public', 'coo-story', 'score.wav')
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('wrote', out, f'{DUR:.1f}s', 'rms', float(np.sqrt(np.mean(st ** 2))))
