# Digital Certificate of Origin Attestation — 25s Motion Film

1920×1080 · 30 fps · 750 frames · Remotion + React · 100% programmatic graphics

---

## 0. Creative concept — "One continuous journey"

The film is not a series of slides. It is **one uninterrupted camera move** that follows a
single document on its journey across a global trade network. The world (globe, particles,
grid, light) is persistent across all scenes; scenes are "stations" the camera travels past.
Every transition is motivated by motion that already exists in the previous shot (a document
flies → the camera follows it; a data packet arcs → the globe rotates to receive it).

Tone: sovereign, calm, precise. Think central-bank keynote / government technology
unveil — not an app walkthrough. No UI chrome, no cursors, no buttons, no screen recordings.

---

## 1. Scene-by-scene storyboard

| # | Time | Frames | Beat |
|---|------|--------|------|
| 1 | 0.0–3.0s | 0–90 | World & title |
| 2 | 3.0–6.0s | 90–180 | Submission |
| 3 | 6.0–9.0s | 180–270 | Verification |
| 4 | 9.0–12.0s | 270–360 | Fees & settlement |
| 5 | 12.0–16.0s | 360–480 | Commercial Attaché & signature |
| 6 | 16.0–20.0s | 480–600 | Final attested certificate |
| 7 | 20.0–25.0s | 600–750 | TAMKEEN resolve |

### Scene 1 — World & title (0–3s)
- **0–12f**: Pure black. A few particles drift in depth; faint cyan horizon glow breathes in.
- **6–60f**: A dot-matrix Earth (real coastlines, orthographic projection) rises out of
  darkness with a slow push-in and rotation. Graticule hairlines trace across it.
  Trade arcs launch between world ports (Rotterdam, Shanghai, Dubai, Mumbai, Singapore,
  Hamburg, Istanbul, New York, Baghdad…) — each arc draws with a bright head and fading tail;
  light pulses keep running along them.
- **24–60f**: To the right of the globe, a Certificate of Origin materialises: first a
  hairline wireframe draws its perimeter (stroke-dash), then a frosted glass body fills in,
  then its content lines type on row by row. It floats with a subtle 3D tilt.
- **30–75f**: Title, left-aligned in the lower third, word-by-word mask reveal:
  overline `INTERNATIONAL TRADE · DIGITAL SOVEREIGN SERVICES` (cyan, mono, tracked),
  headline "Digital Certificate of Origin" / "Attestation" (second line in gold).
- **75–95f (transition)**: Title lifts and blurs out; the globe recedes and dims into the
  background; the document glides left toward the Trader (continuity into Scene 2).

### Scene 2 — Submission (3–6s)
- Left station: **Trader** — a precise geometric emblem (hexagonal frame, abstract figure
  built from circle + arc, rotating tick-ring). Label `EXPORTER`.
- Right station: **Attestation Platform** — a stacked "portal" of concentric elliptical
  rings (isometric depth), with a vertical light column. Label `ATTESTATION PLATFORM`.
- A dotted conduit draws between the two stations.
- **~100f & ~112f**: Two document cards peel off the trader — *Certificate of Origin* and
  *Commercial Invoice* — and fly along an arced Bézier path with directional motion blur
  and a light trail. Each card has a thin progress rail underneath (`UPLOADING 0→100%`).
- On arrival each card is absorbed into the portal: ring pulse shockwave, ring speed-up,
  a `RECEIVED` tick appears on a small ledger next to the platform.
- **165–190f (transition)**: Camera pushes *into* the portal (scale-up + radial blur feel);
  the two documents are reborn large in the centre — Scene 3.

### Scene 3 — Verification (6–9s)
- The two documents stand side by side in 3D perspective (slight inward rotateY).
- A cyan scan plane sweeps top→bottom across both; behind the beam a fine dot-grid glows
  and fades; field boxes lock on (corner brackets snap in) as the beam passes them.
- Right side: a validation stack of four checks, each resolving from a spinning arc to a
  tick: `Origin criteria`, `HS classification`, `Exporter registry`, `Invoice consistency`.
- **~245f**: The documents merge together; a large gold-rimmed seal ring draws and a check
  strokes in. Word "Verified" resolves with tracking settling from wide to tight.

### Scene 4 — Fees & settlement (9–12s)
- Centre: a **secure core** — three counter-rotating segmented rings (encryption), a
  hexagonal lock with a shackle.
- Two value packets (cyan for *Digital Service Fee*, gold for *Sovereign Fee*) stream into
  the core from the left along curved paths.
- The core crunches the data (ring segments tick, an encrypted hash string scrambles and
  resolves), the shackle closes, a light burst.
- Right side: two confirmation rows animate in — label, status `CONFIRMED`, check draws —
  plus a mono transaction reference that decrypts character by character.

### Scene 5 — Commercial Attaché & digital signature (12–16s)
- The camera pulls back: the globe returns in the lower half as a vast horizon.
- A glowing transaction packet travels along a long great-circle arc toward the mission
  node, leaving a comet trail.
- **Mission representation**: an architectural line drawing — pediment, six columns,
  stepped plinth — drawn with strokes, lit by a soft gold rim. Label
  `IRAQI COMMERCIAL ATTACHÉ` / `DIPLOMATIC MISSION`.
- The certificate slides in; a handwritten-style signature path draws itself with a
  cyan light head, then a circular seal stamps (scale overshoot + ring shockwave) with
  text on a circular path.
- Text: "Digitally Attested" (gold rule underneath).

### Scene 6 — Final attested certificate (16–20s)
- Hero shot: the finished certificate, large, with a slow camera orbit (rotateY -16° → 6°)
  and a holographic sheen sweeping across its surface.
- Four callouts with leader lines drawing from the document to labels:
  1. **QR verification** — QR code assembling module by module.
  2. **Unique serial number** — `IQ-COO-2026-0847-3921` decoding character by character.
  3. **Digital validation** — `VALIDATED · SHA-256` status badge with pulse.
  4. **Secure document identity** — hash fingerprint & micro-guilloche security pattern.

### Scene 7 — TAMKEEN resolve (20–25s)
- **600–640f**: The certificate dissolves into its constituent light points which swirl and
  collapse to the centre; the network lines contract into a single horizontal gold hairline.
- **630–690f**: "TAMKEEN" resolves — letters rise from a mask with blur-to-sharp and
  tracking tightening; hairline extends either side.
- **660–700f**: Subtitle "Entrepreneurship, Technology Localization & Software".
- **690–720f**: Final line "Powering Digital Trade Transformation" (cyan-to-white).
- **720–750f**: Hold. Particles keep drifting; a very slow push-in; fade to black on the last
  frames.

---

## 2. Animation language & transition logic

**Easing vocabulary** (never linear for UI-like objects):
- `expoOut` — arrivals, reveals (fast start, long elegant settle).
- `expoInOut` — camera moves and document travel.
- `spring(damping 200)` — critically damped; used for objects that "land".
- Linear only for continuous systems (rotation, scan beams, particle drift, data pulses).

**Rules**
1. *Nothing is ever fully still.* Every hold has secondary motion: drift, parallax,
   breathing glow, rotating rings, pulses on arcs.
2. *Motivated transitions.* Each scene hands its energy to the next (fly-to, push-in,
   pull-back, dissolve-to-points). No hard cuts, no generic cross-dissolves on their own.
3. *Layered depth.* Three parallax planes: far (stars/globe), mid (stations, documents),
   near (foreground particles, out of focus and blurred). The camera moves them at different
   rates.
4. *Draw-on before fill.* Objects first appear as hairline wireframes, then gain body.
   This is the visual signature of the film — "precision construction".
5. *Motion blur.* Fast-moving objects get velocity-proportional directional blur (SVG
   `feGaussianBlur` on the axis of travel) plus a light trail.
6. *Staggers.* Text and lists stagger at 3–5 frames; never everything at once.
7. *Confirmation grammar.* Every confirmed state = spinning arc → full circle → check stroke
   → soft glow pulse. Used consistently for verification, payments and signature.

**Transitions (overlaps ~15 frames)**
- 1→2: title lifts out, globe recedes to background, document glides to trader.
- 2→3: push into the platform portal (zoom + blur), documents re-emerge large.
- 3→4: verified seal collapses into the secure core (scale-down match cut on circle shape).
- 4→5: burst of the lock releases the packet which becomes the comet on the globe arc.
- 5→6: camera pushes into the signed document, which becomes the hero document.
- 6→7: document disintegrates into particles which converge into the logotype hairline.

---

## 3. Typography & visual hierarchy

| Role | Face | Size / weight | Treatment |
|------|------|---------------|-----------|
| Hero headline | Inter | 88px / 300 + 600 | tracking -1.5px, white |
| Scene statement ("Verified", "Digitally Attested") | Inter | 72px / 300 | tracking settles 40→2px |
| Wordmark "TAMKEEN" | Inter | 150px / 600 | tracking 60→28px |
| Elegant serif accents (document titles) | Cormorant Garamond | 30–44px / 600 | on documents only, gives "official paper" feel |
| Labels / overlines | JetBrains Mono | 15–18px / 500 | uppercase, tracking 4–6px, cyan or 55% white |
| Data (serials, hashes) | JetBrains Mono | 16–24px / 500 | decode/scramble animation |

Hierarchy: one headline per scene max; labels are always small, mono and tracked so they read
as instrumentation, never as UI.

**Palette**
- Background: `#02040A` (black) → `#061226` (deep navy) radial.
- Primary text: `#F4F7FB`.
- Cyan accent: `#4FD8FF` (data, scanning, digital).
- Gold accent: `#D9B46A` (sovereignty, seals, attestation, final brand).
- Hairlines: white at 10–25% opacity.

Cyan = *machine / process*. Gold = *authority / sovereign*. The film shifts from cyan-heavy
(Scenes 2–4) toward gold (Scenes 5–7) as the document gains official status.
