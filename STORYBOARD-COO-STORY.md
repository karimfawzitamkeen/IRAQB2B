# من رحلة طويلة إلى خدمة رقمية — narrative launch film

The launch film for the electronic Certificate of Origin attestation service, built from the
approved Arabic script (13 scenes plus voice-over).

- **Master:** composition `CooStory16x9`, 1920 × 1080, 30 fps, 3540 frames (118 s), output
  `out/coo-story-16x9.mp4`.
- **Review copy:** composition `CooStory16x9Captions` burns the voice-over in as captions, output
  `out/coo-story-16x9-captions.mp4`.
- **Narrator cue sheet:** `out/coo-story-vo.srt`. Export it with `python3 scripts/coo-story-vo.py`.
- **Source:** `src/coo-story/`. It reuses the ceremony film's kit (`src/coo-ar/kit.tsx`), the
  globe, the certificate and the Ministry logo.

## Central idea
Before the platform, the trader travelled with the transaction. With the platform, the
transaction travels, not the trader.

- **Old world** (warm amber and paper): trader → travel → embassy → waiting → papers → audit.
  A missing document sends the file back to the start.
- **Digital world** (cyan and gold): upload → the transaction travels through the workflow gates
  → review → fees → attaché → attestation → a verified certificate.

## Scenes
| Frames | Time | Scene | Picture |
|---|---|---|---|
| 0–210 | 0–7 s | 1 · عالم التجارة لا يتوقف | Dot globe; paper documents ride routes out of Iraq. The counter climbs to **1,000** · معاملة يومياً · لتجار عراقيين حول العالم. The camera dives into Baghdad. |
| 210–540 | 7–18 s | 2 · كيف كانت الرحلة؟ | The dot becomes a paper folder. It travels a dusty road, read right to left: التاجر ← سفر ← السفارة ← انتظار ← تقديم الأوراق ← تدقيق. The words وقت · جهد · كلفة · تنقل appear. |
| 540–810 | 18–27 s | 3 · خطأ واحد يعيد الرحلة | At the audit the chip shows مستند ناقص, then يتطلب استكمال. The road turns red and the folder rewinds to the start. A clock spins through يوم واحد → 7 أيام → أسبوعان → شهر. |
| 810–1050 | 27–35 s | 4 · لحظة التحول | The paper breaks into particles. They turn cyan and form the platform panel: اليوم... تبدأ رحلة مختلفة, then الخدمة الإلكترونية لتصديق شهادة المنشأ. |
| 1050–1350 | 35–45 s | 5 · من أي مكان | The panel becomes a laptop screen. The Certificate of Origin, the invoice and the supporting documents fly in and merge into one electronic file. Beside it: قدّم معاملتك إلكترونياً · ارفع المستندات · تابع حالتها. |
| 1350–1770 | 45–59 s | 6 · المعاملة تتحرك... وليس التاجر | The file becomes a packet of light. The camera rides behind it, in depth, through six gates: التاجر · التدقيق · المراجعة · الرسوم · الملحق التجاري · التصديق. |
| 1770–2010 | 59–67 s | 7 · إذا كانت هناك نواقص | Inside the same transaction, one document shows مطلوب استكمال. It is uploaded and the status changes to تم الاستلام. The path continues from the same stage: لا تبدأ الرحلة من جديد. |
| 2010–2220 | 67–74 s | 8 · من أسابيع إلى مسار رقمي سريع | أسبوع · أسبوعان · أسابيع fall away. The time bar compresses: إجراءات إلكترونية أسرع. |
| 2220–2490 | 74–83 s | 9 · الشهادة تولد | Data converges into the certificate, which gains its signature, seal, serial number and QR code. The QR is scanned: تم التصديق بنجاح · شهادة إلكترونية قابلة للتحقق. |
| 2490–2730 | 83–91 s | 10 · الوثيقة الموثوقة | Links run from the certificate to الجمارك · الجهات المصرفية · الجهات الحكومية ذات العلاقة, and each one returns a check. The icons are generic: no invented logos. |
| 2730–3030 | 91–101 s | 11 · ماذا قدم المشروع؟ | Five 2-second shots: اختصار الوقت (a winding path straightens) · الشفافية (events light up) · التتبع (a pin moves along the stages) · تقليل الإجراءات الورقية (paper becomes data) · سهولة التحقق (QR → موثّقة). |
| 3030–3240 | 101–108 s | 12 · المعنى الأكبر | Back to the globe, now with digital routes and gold rings for الملحقيات التجارية. On screen: لأن التحول الرقمي لا يعني فقط تحويل الورقة إلى شاشة... then بل أن تنتقل الخدمة إلى المتعامل... أينما كان. |
| 3240–3540 | 108–118 s | 13 · الإطلاق الرسمي | Gold particles gather into the Ministry logo, then the patronage appears. Last, the slate: إطلاق الخدمة الإلكترونية لتصديق شهادة المنشأ, with the entities. It is fully on screen by about 3420 and held for about 4 s. |

## Wording safeguards from the script
- The film makes no "first of its kind" claim.
- It does not claim "in minutes". Scene 8 uses the safe line: تقليل كبير للوقت والجهد، وتسريع
  إنجاز إجراءات التصديق.
- The review step is shown honestly: documents are reviewed, and missing items are requested.
- The film does not name the Central Bank. Scene 10 says الجهات الحكومية والجهات ذات العلاقة.

## Official texts used (exactly as supplied with this script)
- برعاية معالي وزير التجارة الدكتور مصطفى العاني
- إطلاق الخدمة الإلكترونية لتصديق شهادة المنشأ
- الجهة المستفيدة: دائرة العلاقات الاقتصادية الخارجية — وزارة التجارة
- الجهة المنفذة: الشركة العامة للمعارض والخدمات التجارية
- بالشراكة مع: تحالف السهد / التمكين

## Voice-over
The voice-over is the script's text, timed per scene in `VO` (`src/coo-story/theme.ts`) for a
narrator reading at about 2.3–2.5 words a second. In all, 215 words take about 93 s of speech.
`python3 scripts/coo-story-vo.py` writes the narrator pack:
- `out/coo-story-vo.srt`: the timed cues, for recording to picture;
- `out/coo-story-vo-narrator.txt`: every line fully diacritised for formal pronunciation, with
  in and out times and word counts.

After recording:
1. Place the take at `public/coo-story/vo.wav` (48 kHz, starting at 0:00).
2. Render with `--props='{"vo":true}'`. The score then ducks to 45 % under each cue.

`scripts/coo-story-vo-tts.py` can make a synthetic guide track from any Piper-format Arabic voice,
for timing review. The open Arabic voices checked so far are either too slow for these cues or
licensed non-commercial only (CC BY-NC-SA 4.0). The ceremony track should therefore be a human
narrator or a commercially licensed TTS.

## Music
The score is original, synthesised by `scripts/coo-story-score.py` into
`public/coo-story/score.wav`. It uses the same instruments as the ceremony film and no samples.
- **Old world:** sparse D minor with clock ticks. The ticks speed up while the days pass.
- **The turn:** a riser and an impact as the service appears. The harmony moves to D major.
- **Digital world:** a light 100 BPM pulse, kept low under the narration.
- **Accents:**
  - each station and gate;
  - the missing document;
  - the rewind;
  - the seal;
  - verification;
  - each benefit;
  - «أينما كان»;
  - the logo, the Minister's name and the slate.
