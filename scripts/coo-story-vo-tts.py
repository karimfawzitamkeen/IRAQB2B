"""Synthesised guide voice-over for the story film (CooStory16x9), for timing review.

The narration is the script's hand-diacritised text (LINES in scripts/coo-story-vo.py).
The automatic diacritiser is switched off. Each line is fitted to its window in the picture,
using the cue timings in src/coo-story/theme.ts (VO). Words before a pause are read in pausal
form, with a sukun on the last letter.

It works with any Piper-format Arabic voice (.onnx + .onnx.json). Check the voice's licence before
any public use: the open Arabic voices seen so far are non-commercial (CC BY-NC-SA) or carry no stated
licence, so the ceremony track should be a human narrator or a commercially licensed TTS.
Run (needs piper-tts and numpy):
  python3 scripts/coo-story-vo-tts.py path/to/voice.onnx
Output: public/coo-story/vo.wav (48 kHz stereo, 118 s, starting at 0:00).
"""
import os, re, sys, wave
import numpy as np
from piper import PiperVoice, SynthesisConfig

FPS = 30
DUR_FRAMES = 3540
SR = 48000

sys.path.insert(0, os.path.dirname(__file__))
LINES = __import__('coo-story-vo').LINES

HARAKAT = 'ًٌٍَُِْ'  # tanween, short vowels, sukun (shadda kept)


def pausal(text):
    """Waqf: the last word before a pause ends in sukun; final tanween fath + alif reads as a long a."""
    def fix(m):
        w = m.group(1)
        if w.rstrip(HARAKAT + 'ّ').endswith(('ا', 'ى')):  # ends in a long vowel: drop the tanween only
            return w.rstrip(HARAKAT).replace('ً', '') + m.group(2)
        w = w.rstrip(HARAKAT)
        if w[-1] == 'ّ':
            return w + m.group(2)
        return w + 'ْ' + m.group(2)
    return re.sub(r'(\S+?)([،.…]+|\.\.\.)', fix, text)


def cues():
    src = open(os.path.join(os.path.dirname(__file__), '..', 'src', 'coo-story', 'theme.ts'), encoding='utf-8').read()
    return [(int(a), int(b)) for a, b, _ in re.findall(r"\{a: (\d+), b: (\d+), text: '([^']*)'\}", src)]


def synth(voice, text, length_scale):
    cfg = SynthesisConfig(length_scale=length_scale, noise_scale=0.55, noise_w_scale=0.7)
    parts = [np.frombuffer(c.audio_int16_bytes, dtype=np.int16).astype(np.float64) / 32768 for c in voice.synthesize(text, syn_config=cfg)]
    gap = np.zeros(int(voice.config.sample_rate * 0.18))
    out = []
    for i, p in enumerate(parts):
        out += [p] + ([gap] if i < len(parts) - 1 else [])
    y = np.concatenate(out)
    # trim silence at both ends
    nz = np.where(np.abs(y) > 0.01)[0]
    return y[max(0, nz[0] - 200): nz[-1] + 800] if len(nz) else y


def resample(y, sr_in, sr_out):
    n = int(len(y) * sr_out / sr_in)
    return np.interp(np.linspace(0, len(y) - 1, n), np.arange(len(y)), y)


def main():
    voice = PiperVoice.load(sys.argv[1])
    voice.use_tashkeel = False
    sr = voice.config.sample_rate
    windows = cues()
    assert len(windows) == len(LINES), (len(windows), len(LINES))
    track = np.zeros(int(DUR_FRAMES / FPS * SR))
    for i, ((a, b), line) in enumerate(zip(windows, LINES)):
        text = pausal(line)
        room = (b - a) / FPS
        ls = 1.06  # a measured, ceremonial pace
        y = synth(voice, text, ls)
        if len(y) / sr > room:  # speed up only as much as the window needs
            ls = max(0.78, ls * room / (len(y) / sr) * 0.98)
            y = synth(voice, text, ls)
        y = resample(y, sr, SR)
        y *= 0.5 / (np.sqrt(np.mean(y ** 2)) + 1e-9) * 0.25  # even loudness per line
        at = int(a / FPS * SR)
        end = min(len(track), at + len(y))
        track[at:end] += y[:end - at]
        print(f'{i + 1:2d}  {a / FPS:6.2f}s  {len(y) / SR:5.2f}s of {room:5.2f}s  speed {1 / ls:.2f}x')
    # normalise to -3 dBFS
    peak = np.max(np.abs(track))
    track *= 10 ** (-3 / 20) / peak
    st = (np.clip(np.stack([track, track], axis=1), -1, 1) * 32767).astype('<i2')
    out = os.path.join(os.path.dirname(__file__), '..', 'public', 'coo-story', 'vo.wav')
    with wave.open(out, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())
    print('wrote', out)


if __name__ == '__main__':
    main()
