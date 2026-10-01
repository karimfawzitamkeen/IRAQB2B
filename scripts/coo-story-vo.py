"""Export the voice-over cues of the story film (src/coo-story/theme.ts, VO) as an SRT for the narrator.
Output: out/coo-story-vo.srt. Run: python3 scripts/coo-story-vo.py
"""
import os, re
root = os.path.join(os.path.dirname(__file__), '..')
src = open(os.path.join(root, 'src', 'coo-story', 'theme.ts'), encoding='utf-8').read()
cues = re.findall(r"\{a: (\d+), b: (\d+), text: '([^']*)'\}", src)
def ts(fr):
    ms = round(int(fr) / 30 * 1000)
    return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}"
out = os.path.join(root, 'out', 'coo-story-vo.srt')
with open(out, 'w', encoding='utf-8') as f:
    for i, (a, b, t) in enumerate(cues, 1):
        f.write(f"{i}\n{ts(a)} --> {ts(b)}\n{t}\n\n")
print('wrote', out, len(cues), 'cues')
