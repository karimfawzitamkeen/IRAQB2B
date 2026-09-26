# Digital Certificate of Origin Attestation — 25s Vertical Motion Film

**Format: 1080 × 1920 px · PORTRAIT 9:16 · 30 fps · 750 frames (25.0 s)**
Remotion + React · 100% programmatic graphics · designed natively for mobile / social feeds
(Reels, TikTok, Shorts, Stories, LinkedIn mobile). It is not a crop or rescale of a 16:9 layout.

---

## 0. Creative concept — "One continuous journey, told vertically"

The film is **one uninterrupted camera move** that follows a single Certificate of Origin across a
global trade network. The world (globe, particles, light) persists across every scene. Scenes
are "stations" the camera passes. Every transition is motivated by motion already on screen.

In portrait the journey runs **on the vertical axis**:
- Uploads **rise**: the exporter sits at the bottom and the platform at the top.
- The camera **cranes and tilts** (up/down) instead of panning left/right.
- The globe works as a **dome at the top** or a **planet horizon at the bottom**, never a small
  sphere floating beside other content.
- Reading order is always **top → middle → bottom**: context, then hero, then supporting information.

Tone: sovereign, calm, precise. A central-bank or government-technology unveil, not an app
walkthrough. No UI chrome, cursors, buttons or screen recordings.

**The Certificate of Origin is the hero.** It is on screen, or being transformed, in 6 of 7
scenes. In every scene where it appears it is the largest object in the frame.

---

## 1. Canvas, safe areas and layout grid (1080 × 1920)

```
 y=0    ┌──────────────────────────┐
        │   platform UI overlay     │  0–250   : no text, no key detail (status bar, app header)
 y=250  ├──────────────────────────┤
        │  TOP BAND                 │  250–440 : chapter marker / callouts / statements
 y=440  ├──────────────────────────┤
        │                           │
        │  HERO ZONE                │  440–1300: the certificate / globe / core
        │  (optical centre ≈ 880)   │
        │                           │
 y=1300 ├──────────────────────────┤
        │  LOWER BAND               │  1300–1500: statements, confirmations, callouts
 y=1500 ├──────────────────────────┤
        │   caption / CTA overlay   │  1500–1920: atmosphere only, no text or key detail
 y=1920 └──────────────────────────┘
   x:  90 ────────────────── 990   (text safe; 90 px side margins)
       key text stays left of x≈930 where a right-hand action rail may sit
```

- **Text-safe area:** x 90–990, y 250–1500. Right-aligned text ends at x ≤ 930.
- **Key-detail area** (hero objects may extend here): x 60–1020, y 220–1560.
- **Full bleed** (background, globe, particles, light) uses the whole 1080 × 1920.
- **Horizontal centre line x = 540** is the main axis. Most compositions are centred and symmetric.

---

## 2. Scene-by-scene storyboard

| # | Time | Frames | Beat | Vertical composition |
|---|------|--------|------|----------------------|
| 1 | 0.0–3.0 s | 0–90 | World & title | globe dome top · document mid · title low |
| 2 | 3.0–6.0 s | 90–180 | Submission | platform top · flight mid · exporter bottom |
| 3 | 6.0–9.0 s | 180–270 | Verification | two documents mid · checklist low |
| 4 | 9.0–12.0 s | 270–360 | Fees & settlement | fee sources top · secure core mid · confirmations low |
| 5 | 12.0–16.0 s | 360–480 | Commercial Attaché & signature | mission top · arc from planet horizon · signed document |
| 6 | 16.0–20.0 s | 480–600 | Final attested certificate | hero document centre · callouts top & bottom bands |
| 7 | 20.0–25.0 s | 600–750 | TAMKEEN resolve | centred brand lock-up |

Scenes overlap by about 10–20 frames at each handoff (see §3).

### Scene 1 — World & title (0–90f)
- **0–12f**: Black. Depth particles drift slowly upward. A faint cyan glow breathes in at the
  top of the frame.
- **6–60f**: A dot-matrix Earth (real coastlines, orthographic) rises out of darkness as a
  large **dome in the upper half**: centre ≈ (540, 640), radius ≈ 460. It fills the width and its
  atmosphere bleeds past both edges. Slow push-in and rotation. Graticule hairlines.
  Trade arcs launch between world ports, each drawn with a bright head and fading tail, and
  light pulses keep running along them.
- **22–64f**: The **Certificate of Origin** materialises in front of the globe's lower half,
  centred at x 540, y ≈ 880, about 440 px wide. First a hairline wireframe draws its
  perimeter, then a frosted glass body fills in, then its content rows reveal one by one. It floats
  with a slight 3D tilt (rotateX 8°, rotateY −10°) and a gentle vertical bob.
- **28–75f**: Title block in the **lower band**, left-aligned at x 90, y ≈ 1200–1500. Words
  rise out of a mask one at a time:
  - overline `INTERNATIONAL TRADE · DIGITAL SERVICES` (cyan, mono, 22 px)
  - "Digital Certificate" / "of Origin" (white, Inter Light, 84 px, 2 lines)
  - "Attestation" (gold, Inter SemiBold, 84 px, with a slow gold sheen)

  A soft dark scrim sits behind the title so it stays legible over the globe.
- **74–104f (transition)**: The title lifts and blurs out. The globe **cranes up** and dims into
  a background dome. The document **drops down** toward the Exporter station (continuity).

### Scene 2 — Submission (84–196f)
- **Top band**: chapter marker `01 — SUBMISSION` / "The exporter files the trade documents digitally."
- **Upper hero (y ≈ 560–850)**: the **Attestation Platform**, a stacked portal of five
  concentric elliptical rings with a vertical light column and a glowing core, centred at
  (540, 700). Label `ATTESTATION PLATFORM` below it.
- **Bottom (y ≈ 1180–1490)**: the **Exporter**, a geometric emblem (hexagon frame, abstract
  figure, rotating tick-ring) centred at (540, 1300). Label `EXPORTER · REGISTERED TRADER`.
- A dotted **vertical conduit** (gentle S-curve) draws from the Exporter up to the Platform, with
  data motes flowing upward.
- **~100f & ~116f**: two document cards peel off the Exporter: *Certificate of Origin* (left
  lane) and *Commercial Invoice* (right lane). Each is about 250 px wide and they **fly upward**
  along the conduit with vertical motion blur and a light trail. A thin progress rail beside each
  card reads `UPLOADING 0→100%`.
- On arrival each card is absorbed into the portal with a ring shockwave and a ring speed-up.
  A `RECEIVED ✓` row appears in a small ledger just above the portal (y ≈ 430–510).
- **164–192f (transition)**: The camera pushes *into* the portal (zoom + blur). The documents
  are reborn large at the centre (Scene 3).

### Scene 3 — Verification (176–290f)
- **Top band**: `02 — VERIFICATION` / "Validated against trade rules and registries."
- **Hero (y ≈ 520–1080)**: the two documents **side by side**, each about 380 px wide with a
  36 px gap, angled slightly inward in 3D. They arrive from the push-in large and blurred, then
  settle sharp.
- A cyan **scan plane** sweeps top → bottom across both (194–238f). Behind the beam a fine
  dot-grid glows and fades, and corner brackets lock onto each field as the beam passes it.
- **Lower band (y ≈ 1130–1480)**: a validation stack of four rows, each resolving from a spinning
  arc to a tick (staggered 8f):
  `Origin criteria`, `HS classification`, `Exporter registry`, `Invoice consistency`.
  Each row has a 34 px title and a 20 px mono status line.
- **238–266f**: The checklist fades. The documents merge at the centre and dim. A large gold seal
  ring (R ≈ 150) draws at (540, 820) and a check strokes in, with a gold ray burst.
  **"Verified"** (96 px, Inter Light, tracking settling wide → tight) sits at y ≈ 1080, with
  `4 / 4 CHECKS PASSED` in mono below it.

### Scene 4 — Fees & settlement (266–374f)
- **Top band**: `03 — SETTLEMENT` / "Service and sovereign fees, paid and confirmed."
- **Upper hero (y ≈ 450–540)**: two fee sources side by side, each with a gold or cyan
  accent bar and no boxed border:
  - left: *Digital Service Fee* (cyan) · `PLATFORM PROCESSING`
  - right: *Sovereign Fee* (gold) · `STATE ATTESTATION FEE`
- **Hero (centre ≈ 540, 820)**: the **secure core**, three counter-rotating segmented rings
  (outer R ≈ 240) around a hexagonal lock with a shackle.
- **288–322f**: Value packets (cyan and gold diamonds with light trails) **fall** from the fee
  sources into the core along curved paths. Each arrival sends a ring shockwave. Ring segments
  light up in sequence, the shackle snaps shut (backOut easing) and a light burst follows.
- **Lower band (y ≈ 1120–1460)**: two confirmation rows, each going Processing… → check →
  `CONFIRMED`, plus a mono transaction reference `TX 7F3A 91C2 E04B 5D18 · SECURED` that
  decrypts one character at a time.
- **350–370f (transition)**: The core collapses to a bright point and the camera cranes down.

### Scene 5 — Commercial Attaché & digital signature (356–500f)
- **Top band**: `04 — ATTESTATION` / "Routed to the Iraqi Commercial Attaché for digital signature."
- **Phase A (360–428f)**: The globe returns as a vast **planet horizon in the lower half**
  (centre far below the frame, visible cap from y ≈ 900 down). A gold transaction packet leaves
  the platform node (Baghdad), travels a tall great-circle arc to the mission node with a comet
  trail, and then a gold beam rises **vertically** from that node to the mission above.
- **Mission representation (upper hero, centre ≈ 540, 600)**: an architectural line drawing with
  a pediment, six columns and a stepped plinth. It is drawn stroke by stroke and lit by a soft gold
  rim. Label `IRAQI COMMERCIAL ATTACHÉ` / `DIPLOMATIC MISSION · TRADE ATTESTATION` beneath it.
- **Phase B (426–488f)**: The mission cranes up and shrinks into the top band (scale ≈ 0.55,
  y ≈ 360), taking over from the chapter marker. The planet sinks and dims. The **certificate rises
  from the bottom** into the hero zone (centre ≈ 540, 900, about 480 px wide). The attaché's
  signature draws itself (446–472f), then the circular seal stamps in (468–480f) with
  overshoot, shockwave and a gold frame glow.
- **Lower band**: **"Digitally Attested"** (84 px, Inter Light, one line, centred, y ≈ 1330), a gold
  rule and `SIGNED · SEALED · TIME-STAMPED` in mono.

### Scene 6 — Final attested certificate (488–616f)
- **488–520f**: The signed certificate pushes to hero size. It is centred at (540, 880) and about
  620 px wide (y ≈ 455–1300), the largest it appears in the film.
- Slow camera orbit (rotateY −10° → +6°, slight rotateX) and push-in (≈ +4%). A holographic
  sheen sweeps across the surface at 530–574f.
- Features come alive on the document: the QR code assembles module by module, the serial decodes,
  the `VALIDATED` badge pulses and the hash fingerprint resolves.
- **Callouts use the top and bottom bands, not the sides** (there is no room at the sides in 9:16).
  Each callout is a 2-column label with a leader line that drops or rises into the document:
  - **Top band, left**: `SECURE DOCUMENT IDENTITY` / "SHA-256 fingerprint", line down to the emblem.
  - **Top band, right**: `DIGITAL VALIDATION` / "Cryptographically signed", line down to the badge.
  - **Bottom band, left**: `UNIQUE SERIAL NUMBER` / `IQ-COO-2026-0847-3921` (mono, decoding),
    line up to the serial.
  - **Bottom band, right**: `QR VERIFICATION` / "Scan to verify authenticity", line up to the QR.
  - Staggered at 508 / 516 / 524 / 532f.
- There is no chapter marker in this scene, because the callouts occupy the top band.

### Scene 7 — TAMKEEN resolve (596–750f)
- **598–665f**: The certificate dissolves into ~700 points of light. They form a **coherent
  spiral** (all turning the same way) around the frame's optical centre and collapse onto a
  single horizontal gold hairline. Short, length-clamped velocity streaks give the motion blur.
- **642–690f**: The gold **hairline** (≈ 720 px, fading ends, small gold diamond at the centre)
  extends from the centre at y ≈ 900.
- **652–700f**: **"TAMKEEN"**, centred at y ≈ 800. Letters rise from a mask with blur-to-sharp,
  staggered by 3f, while the tracking tightens. A soft light gleam passes across the wordmark at 694–736f.
- **672–700f**: Subtitle centred beneath the hairline (y ≈ 950–1040), in two lines:
  "Entrepreneurship, Technology" / "Localization & Software".
- **688–715f**: Final line centred (y ≈ 1140–1260), in two lines:
  "Powering **Digital Trade**" / "Transformation" ("Digital Trade" in cyan, the rest in white).
- **715–741f**: Full hold (≈ 0.9 s of everything readable, plus the time the lines take to land).
  Very slow push-in, drifting particles and a faint planet horizon glow at the bottom.
- **741–750f**: Fade to black.
- The lock-up block spans y ≈ 720–1260, centred on x 540. It is symmetric, uncluttered, and
  has no extra taglines, badges or logos.

---

## 3. Animation language & transition logic

**Easing vocabulary** (never linear for objects that arrive or settle):
- `expoOut`: arrivals and reveals (fast start, long elegant settle).
- `expoInOut`: camera moves and document travel.
- `backOut`: small mechanical "snaps" (lock shackle, seal stamp).
- Linear only for continuous systems (rotation, scan beams, particle drift, data pulses).

**Rules**
1. *Vertical storytelling.* Primary motion runs on the Y axis: uploads rise, payments fall into
   the core, the camera cranes, and the mission beam rises. Lateral motion is limited to parallax
   and small tilts.
2. *Nothing is ever fully still.* Every hold has secondary motion: drift, parallax, breathing glow,
   rotating rings, pulses on arcs.
3. *Motivated transitions.* Each scene hands its energy to the next. No hard cuts and no standalone
   generic cross-dissolves.
4. *Layered depth.* Three parallax planes: far (stars/globe), mid (stations, documents) and near
   (out-of-focus bokeh). The camera moves them at different rates, drifting vertically.
5. *Draw-on before fill.* Objects first appear as hairline wireframes, then gain body. This is the
   film's visual signature ("precision construction").
6. *Motion blur.* Fast-moving objects get velocity-proportional directional blur on their axis of
   travel, plus a light trail.
7. *Staggers.* Text and lists stagger by 3–5 frames. Nothing appears all at once.
8. *Confirmation grammar.* Every confirmed state goes spinning arc → full circle → check stroke →
   soft glow. The same sequence is used for verification, receipt, payments and validation.
9. *One focal point per moment.* In a narrow frame only one element animates prominently at a
   time. Supporting elements settle before the next one starts.

**Transitions**
| Handoff | Frames | Move |
|---------|--------|------|
| 1 → 2 | 74–104 | Title lifts out, globe cranes up to become a dim dome, document drops toward the Exporter |
| 2 → 3 | 164–192 | Push into the platform portal (zoom + blur), documents re-emerge large |
| 3 → 4 | 262–290 | Verified seal shrinks into the secure core (circle-to-circle match cut) |
| 4 → 5 | 350–372 | Core collapses to a point, camera cranes down to the planet horizon, packet leaves the surface |
| 5 → 6 | 476–520 | Mission and statement clear, the signed document pushes up to hero size |
| 6 → 7 | 596–650 | Document disintegrates into a spiral of points that collapses into the brand hairline |

---

## 4. Typography & visual hierarchy (sized for a phone screen)

Sizes are in canvas pixels at 1080 × 1920. On a typical phone, 1 canvas px ≈ 0.36 pt, so the
minimum 20 px label displays at about 7 pt, which is the smallest that stays legible in a feed.

| Role | Face | Size / weight | Treatment |
|------|------|---------------|-----------|
| Hero headline (Scene 1) | Inter | 84 px / 300 + 600 | 3 lines max, tracking −1.5 px, left-aligned, "Attestation" in gold |
| Scene statement ("Verified", "Digitally Attested") | Inter | 84–96 px / 300 | centred, tracking settles wide → tight |
| Wordmark "TAMKEEN" | Inter | 144 px / 600 | centred, tracking 30 → 16 px (fits within 900 px) |
| Brand subtitle | Inter | 36 px / 400 | centred, 2 lines, 78% white |
| Brand final line | Inter | 52 px / 300 | centred, 2 lines, "Digital Trade" in cyan |
| Chapter marker | JetBrains Mono + Inter | 22 px mono index/title · 32 px Inter Light description | top band, left-aligned, 2 lines max |
| Body labels (checklist, confirmations) | Inter | 32–34 px / 400 | with 20 px mono status underneath |
| Instrument labels / overlines | JetBrains Mono | 20–24 px / 500 | uppercase, tracking 4–6 px, cyan, gold or 55% white |
| Data (serials, hashes) | JetBrains Mono | 26–30 px / 500 | decode/scramble animation |
| Document serif (on the certificate) | Cormorant Garamond | scales with the document (≈ 40 px at hero size) | "official paper" feel, on documents only |
| On-document micro-labels | JetBrains Mono | ≥ 13 px at 1:1 document scale | texture only; any essential information is repeated in a callout |

**Hierarchy**
- One headline or statement per moment. Labels are always small, mono and tracked so they read
  as instrumentation, never as app UI.
- Order of attention in every scene: **hero object → statement → labels → background**.
- No line of text wider than 900 px. Headlines break into short lines rather than shrinking.

**Palette**
- Background: `#02040A` (black) → `#061226` (deep navy), with a vertical radial falloff.
- Primary text: `#F4F7FB`.
- Cyan accent: `#4FD8FF` (data, scanning, digital process).
- Gold accent: `#D9B46A` (sovereignty, seals, attestation, final brand).
- Hairlines: white at 10–25% opacity.

Cyan = *machine / process*. Gold = *authority / sovereign*. The film shifts from cyan-heavy
(Scenes 2–4) toward gold (Scenes 5–7) as the document gains official status.

---

## 5. Deliverable

- `out/certificate-of-origin-9x16.mp4`: H.264, 1080 × 1920, 30 fps, 750 frames, yuv420p.
- Every frame is checked against the safe areas in §1 before the final render.
