# إطلاق المنصة الرقمية لتصديق شهادة المنشأ — فيلم الافتتاح (عربي)

Two masters of the same film, both 30 fps, 3360 frames (112 s), H.264 yuv420p with AAC audio:
- **16:9 ceremony screen, 1920 × 1080:** composition `CertificateOfOriginAR16x9`, output
  `out/certificate-of-origin-ar-16x9.mp4`. Each scene is re-laid out for landscape: text column on
  the right (the Arabic reading side), visuals on the left, a horizontal workflow chart, and a
  two-column closing slate. It is not a crop of the portrait film.
- **9:16 portrait display, 1080 × 1920:** composition `CertificateOfOriginAR9x16`, output
  `out/certificate-of-origin-ar-9x16.mp4`.

Source: `src/coo-ar/` (`LandCtx` switches the layout). The earlier
`out/certificate-of-origin-9x16-screen.mp4` is left unchanged.

## Purpose
Opening film for the platform-launch ceremony, attended by the Minister and the public:
1. official patronage and credits;
2. the platform's workflow chart;
3. the platform's benefits.

## Official texts (exactly as supplied)
- برعاية معالي وزير التجارة الدكتور مصطفى العاني
- إطلاق المنصة الرقمية لتصديق شهادة المنشأ
- الجهة المستفيدة: دائرة العلاقات الخارجية التجارية
- الجهة المنفذة: الشركة العامة للمعارض والخدمات التجارية العراقية
- بالشراكة مع: تحالف السهد – التمكين

## Structure
| Frames | Time | Section | On screen |
|---|---|---|---|
| 0–250 | 0–8.3 s | Patronage | Gold ornament · برعاية · معالي وزير التجارة · الدكتور مصطفى العاني |
| 250–490 | 8.3–16.3 s | Launch | إطلاق · المنصة الرقمية · لتصديق شهادة المنشأ, with the Arabic certificate building in |
| 490–610 | 16.3–20.3 s | Beneficiary | الجهة المستفيدة · دائرة العلاقات الخارجية التجارية |
| 610–780 | 20.3–26 s | Executing entity | الجهة المنفذة · الشركة العامة للمعارض والخدمات التجارية العراقية · بالشراكة مع تحالف السهد – التمكين |
| 780–1020 | 26–34 s | Paper to digital | من المعاملة الورقية ← إلى منصة رقمية موحدة |
| 1020–1200 | 34–40 s | Workflow chart | مخطط عمل المنصة: the six stages |
| 1200–1400 | 40–46.7 s | Step 1 | تقديم الطلب إلكترونياً: certificate + invoice, and the digital service fee |
| 1400–1580 | 46.7–52.7 s | Step 2 | تدقيق المستندات: the Verifier checks the documents are complete |
| 1580–1760 | 52.7–58.7 s | Step 3 | مراجعة الملحق التجاري: eligible for attestation, no signature or seal yet |
| 1760–1990 | 58.7–66.3 s | Step 4 | استيفاء الرسم السيادي: fee notice ← trader payment ← receipt upload ← Accountant confirmation |
| 1990–2180 | 66.3–72.7 s | Step 5 | التصديق الرقمي: the Attaché's signature and official seal, after the fee is confirmed |
| 2180–2400 | 72.7–80 s | Step 6 | إصدار الشهادة والتحقق: serial number + QR, verifiable at any time |
| 2400–3060 | 80–102 s | Benefits | فوائد المنصة: six benefits one at a time, then a summary grid |
| 3060–3360 | 102–112 s | Closing | Platform title · خطوة نحو تجارة عراقية رقمية · patronage and credits, held until the fade |

The workflow follows the approved order of the original film. The digital service fee is paid at
submission. The Attaché review comes before the sovereign fee. The signature and seal come only
after the Accountant confirms payment.

## Rules
- All Arabic is right-to-left and animates by whole word, never letter by letter.
- No letter-spacing on Arabic text, and no parentheses in Arabic lines.
- Lines auto-fit inside the critical zone (x 80–1000, y 140–1780). Essential text is at least
  about 40 px, and statements are 100–150 px, for reading at about 4 m.
- Type: Amiri (formal naskh) for the patronage and names, Cairo for headings, IBM Plex Sans
  Arabic for body lines. Step numbers use Arabic-Indic digits.
- The ornament is a neutral medallion: rings, fine ticks and a globe with meridians. It deliberately avoids star and overlapping-square motifs, and imitates no official state emblem or logo.
## Music
The score is original, synthesised by `scripts/coo-ar-score.py` into `public/coo-ar/score.wav`
(48 kHz stereo). It uses no samples or third-party music, so there are no licensing issues.
Regenerate it with `python3 scripts/coo-ar-score.py` (needs numpy).
- **Instruments:** string-like pads, soft sub bass, a plucked pulse, bells, impacts and risers.
- **Harmony:** D minor. It moves to D major at the digital attestation (the seal) and for the
  benefits and the closing.
- **Timed to the picture:**
  - Impacts land exactly on every scene cut: launch, credits, paper to digital, the chart, and
    each of the six steps.
  - A bell sounds under the Minister's name.
  - Chimes mark the key events: documents received, documents complete, eligible, payment
    confirmed, verified.
  - A deep impact marks the seal.
  - Each benefit card gets its own accent.
  - Clock ticks sit under the paper scene.
  - From the workflow chart onwards, a 100 BPM pulse (one eighth note every 9 frames) drives the
    scenes.
- **Levels:** peak −1 dBFS. The mix was balanced by spectrum analysis, since it could not be
  auditioned in the build environment. It fades in and out with the picture.
