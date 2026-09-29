"""Original score for the Arabic ceremony film (CertificateOfOriginAR, 112 s @ 30 fps).

Synthesised from scratch (no samples, no third-party music): string-like pads, sub bass,
plucked pulse, bells, impacts and risers. Every accent is placed on the film's cut frames,
so the music follows the rhythm of the scene changes.  Output: public/coo-ar/score.wav (48 kHz stereo).
"""
import numpy as np, wave, os

SR = 48000
FPS = 30
DUR = 3360 / FPS
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
D2, A1, Bb1, G1, F2, C2, E2 = m('D', 2), m('A', 1), m('Bb', 1), m('G', 1), m('F', 2), m('C', 2), m('E', 2)
Dm  = [m('D', 3), m('A', 3), m('F', 4), m('D', 5)]
Dmj = [m('D', 3), m('A', 3), m('F#', 4), m('D', 5)]
Bb  = [m('Bb', 2), m('F', 3), m('D', 4), m('Bb', 4)]
F   = [m('F', 3), m('C', 4), m('A', 4), m('F', 5)]
Gm  = [m('G', 2), m('D', 3), m('Bb', 3), m('G', 4)]
G   = [m('G', 2), m('D', 3), m('B', 3), m('G', 4)]
C   = [m('C', 3), m('G', 3), m('E', 4), m('C', 5)]
A   = [m('A', 2), m('E', 3), m('C#', 4), m('A', 4)]
Bm  = [m('B', 2), m('F#', 3), m('D', 4), m('B', 4)]

SECTIONS = [  # (from, to, chord, bass, pad gain)
    (0, 250, Dm, D2, 0.06), (250, 370, Bb, Bb1, 0.075), (370, 490, F, F2, 0.075),
    (490, 610, Gm, G1, 0.07), (610, 700, Bb, Bb1, 0.075), (700, 780, C, C2, 0.08),
    (780, 904, Dm, D2, 0.06), (904, 1020, F, F2, 0.08),
    (1020, 1200, Dm, D2, 0.07), (1200, 1400, Dm, D2, 0.07), (1400, 1580, Bb, Bb1, 0.07),
    (1580, 1760, Gm, G1, 0.07), (1760, 1990, A, A1, 0.075), (1990, 2180, Dmj, D2, 0.085),
    (2180, 2400, G, G1, 0.08), (2400, 2474, A, A1, 0.08),
]
BEN = [Dmj, A, Bm, G, Dmj, A]
BEN_B = [D2, A1, m('B', 1), G1, D2, A1]
for i in range(6):
    SECTIONS.append((2474 + i * 84, 2474 + (i + 1) * 84, BEN[i], BEN_B[i], 0.085))
SECTIONS += [(2978, 3060, G, G1, 0.085), (3060, 3360, Dmj, D2, 0.1)]

for f0, f1, ch, bn, g in SECTIONS:
    pad(ch, f0, f1, g * 1.25, bright=5 if f0 < 1020 else 7)
    bass(bn, f0, f1, 0.06 if f0 < 1020 else 0.075)

# pulse: eighth notes at 100 BPM (= every 9 frames) through the workflow and benefits
cur = lambda fr: next(c for a, b, c, _, _ in SECTIONS if a <= fr < b)
k = 0
for fr in range(1020, 3060, 9):
    ch = cur(fr)
    arp = [ch[1], ch[2], ch[3], ch[2]]
    note = arp[k % 4] + (12 if fr >= 2474 and k % 8 == 3 else 0)
    ramp_in = min(1.0, (fr - 1020) / 120)
    pluck(note, s(fr), 0.085 * ramp_in * (1.15 if fr >= 2474 else 1.0), pan=0.35 if k % 2 else -0.35)
    k += 1

# clock ticks under "paper" (780–900)
for i, fr in enumerate(range(786, 900, 15)):
    tick(s(fr), 0.06, -0.3 if i % 2 else 0.3)

# accents on the cuts
for fr, big in [(262, True), (494, False), (614, False), (660, True), (904, True), (1020, True),
                (1200, False), (1400, False), (1580, False), (1760, False), (1990, False), (2180, False),
                (2408, True), (3060, True)]:
    if big: riser(s(fr), 1.4, 0.05)
    boom(s(fr), 0.3 if big else 0.17, 38 if big else 46)
    shimmer(s(fr), 0.045 if big else 0.03)
for i in range(6):
    fr = 2474 + i * 84
    bell(BEN[i][3] + 12, s(fr), 0.07, pan=-0.2 if i % 2 else 0.2)
    boom(s(fr), 0.11, 50)
bell(m('D', 5), s(96), 0.1)            # the minister's name
bell(m('A', 5), s(290), 0.06)          # platform title
bell(m('F', 5), s(1300), 0.06)         # documents received
bell(m('E', 5), s(1504), 0.06)         # documents complete
bell(m('D', 5), s(1694), 0.07)         # eligible for attestation
bell(m('C#', 6), s(1934), 0.08)        # payment confirmed
boom(s(2080), 0.38, 36); shimmer(s(2080), 0.06, 3.0); bell(m('D', 5), s(2080), 0.1)  # the seal
bell(m('A', 5), s(2300), 0.08)         # verified
bell(m('D', 6), s(3070), 0.08); bell(m('F#', 5), s(3082), 0.06); bell(m('A', 5), s(3094), 0.06)

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
fo = s(3360) - s(3290); fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
outL *= fade; outR *= fade
peak = max(np.max(np.abs(outL)), np.max(np.abs(outR)))
g = 10 ** (-1.0 / 20) / peak
st = np.stack([outL * g, outR * g], axis=1)
pcm = (np.clip(st, -1, 1) * 32767).astype('<i2')
out = os.path.join(os.path.dirname(__file__), '..', 'public', 'coo-ar', 'score.wav')
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('wrote', out, f'{DUR:.1f}s', 'rms', float(np.sqrt(np.mean(st ** 2))))
