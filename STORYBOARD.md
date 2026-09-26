# Digital Certificate of Origin Attestation — 30s Vertical Motion Film (Display Screen)

**Format: 1080 × 1920 px · PORTRAIT 9:16 · 30 fps · 900 frames (30.0 s)**
Remotion + React · 100% programmatic graphics · designed natively for a **portrait display screen**
(digital signage / exhibition screen), with all text **readable from 4 m**. It is not a crop or
rescale of the 16:9 version.

> Revision: the film was first built as a 25 s social master. For the display screen, all type
> was enlarged for 4 m viewing, the safe area was widened (no social-app overlays on a screen), and
> the TAMKEEN ending was extended to **10 s** with the contact line **"Contact us : 07803158768"**.
> Scenes 1–7 keep their approved timings.

> Earlier deliverables are kept unchanged: `out/certificate-of-origin.mp4` (16:9) and
> `out/certificate-of-origin-9x16.mp4` (25 s social version).

---

## 0. Creative concept — "One continuous journey, told vertically"

The film is **one uninterrupted camera move** following a single Certificate of Origin through
the approved attestation workflow. The world (globe, particles, light) persists across every
scene. Scenes are "stations" the camera passes. Every transition is motivated by motion already
on screen.

In portrait the journey runs **on the vertical axis**:
- Submissions and payments **rise** from the Trader at the bottom toward the institutions above.
- Instructions and confirmations **descend** from authority back to the Trader.
- The camera **cranes and tilts** instead of panning.
- The globe works as a **dome at the top** or a **planet horizon at the bottom**.
- Reading order is always **top → middle → bottom**: context, then hero, then supporting information.

Tone: sovereign, calm, precise. A government-technology unveil, not an app walkthrough. No UI
chrome, cursors, buttons or screen recordings.

**The Certificate of Origin is the hero.** It is present in 7 of 8 scenes (in the fee scene it
waits dimmed in the background), and wherever it appears it is the largest object in the frame.

**Honesty rule.** The film shows *people and offices reviewing and confirming*: the Verifier, the
Commercial Attaché and the Accountant. It never implies automated regulatory or customs checks
that the platform does not perform.

---

## 1. Approved operational workflow

```
Trader Submission (+ digital service fee)
  → Verifier Review
  → Commercial Attaché Review          (eligibility only — no signature yet)
  → Sovereign Fee: instruction → Trader payment → receipt submitted → Accountant confirmation
  → Digital Attestation by the Commercial Attaché   (signature + seal + issuance)
  → Final Attested Certificate
  → TAMKEEN + Contact us : 07803158768
```

Rules the film must respect:
- The **digital service fee** appears only at the submission stage.
- The **Commercial Attaché review** happens **before** the sovereign fee. It ends in
  "Eligible for attestation" / "Requirements satisfied". There is **no signature and no seal** at
  this stage.
- The **sovereign fee** is paid only after a successful Attaché review. It is confirmed by the
  **Accountant**.
- The **signature, the official seal and issuance** appear only after the Accountant has confirmed
  payment.

---

## 2. Canvas, safe areas and viewing distance (1080 × 1920)

**Viewing basis.** Portrait display of about 55" (≈ 1.21 m tall → ≈ 0.63 mm per canvas pixel),
read from **4 m**. Comfortable reading at 4 m needs a cap height of about 18–20 mm, so:
- **Essential text ≥ 36 px** (labels, statuses); body lines 44–50 px; statements 118–132 px.
- One idea per line, short wording; nothing essential is carried only by small on-document text.

```
 y=0    ┌────────────────────────────────┐
        │  margin (atmosphere only)       │  0–140
 y=140  ├────────────────────────────────┤
        │  TOP BAND  chapter / callouts   │  140–340
        │                                 │
        │  HERO ZONE                      │  340–1300 : certificate / globe / stations / core
        │                                 │
        │  LOWER BAND statements / rails  │  1300–1780
 y=1780 ├────────────────────────────────┤
        │  margin (atmosphere only)       │  1780–1920
 y=1920 └────────────────────────────────┘
 x:  0 ─ 80 ══════════ TEXT & KEY INFO ══════════ 1000 ─ 1080
```

- **Critical zone: x 80–1000, y 140–1780** (a display screen has no app overlays; the 80 px side
  and 140 px top/bottom margins protect against bezels and overscan).
- Centred blocks sit on x 540 and stay ≤ 920 px wide.
- **Full bleed** (background, globe, particles, light) uses the whole 1080 × 1920.

---

## 3. Scene structure & exact timings

| # | Scene | Time | Frames | Dur. | Globe state |
|---|-------|------|--------|------|-------------|
| 1 | World & title | 0.0–3.0 s | 0–90 | 3.0 s | dome, top |
| 2 | Trader submission + digital service fee | 3.0–6.0 s | 90–180 | 3.0 s | dim dome |
| 3 | Verifier review | 6.0–8.5 s | 180–255 | 2.5 s | dim dome |
| 4 | Commercial Attaché review | 8.5–11.0 s | 255–330 | 2.5 s | planet horizon, bottom |
| 5 | Sovereign fee & Accountant confirmation | 11.0–14.0 s | 330–420 | 3.0 s | dim horizon |
| 6 | Digital attestation (signature & seal) | 14.0–16.5 s | 420–495 | 2.5 s | faint horizon |
| 7 | Final attested certificate | 16.5–20.0 s | 495–600 | 3.5 s | faint horizon |
| 8 | TAMKEEN + contact | 20.0–30.0 s | 600–900 | **10.0 s** | faint glow |

Frame ranges are the scene's "ownership" window. Visual handoffs overlap by 10–20 frames (§5).

Chapter markers (top band, 38 px mono title + one 46 px line):
**01 Submission** "Documents submitted digitally." · **02 Verifier Review** "The verifier reviews the
documents." · **03 Attaché Review** "Reviewed by the Commercial Attaché." · **04 Sovereign Fee**
"Trader pays · Accountant confirms." · **05 Digital Attestation** "Signed and sealed by the Attaché."
Scenes 1, 7 and 8 have no chapter marker.

---

## 4. Scene-by-scene storyboard

### Scene 1 — World & title (0–90f · 3.0 s)
- **0–12f**: Black. Depth particles drift slowly upward and a faint cyan glow breathes in at the top.
- **6–60f**: A dot-matrix Earth (real coastlines) rises as a large **dome in the upper half**:
  centre ≈ (540, 640), R ≈ 460, with the atmosphere bleeding past both edges. Slow push-in and
  rotation, graticule hairlines. Trade arcs draw between world ports with pulses running along them.
- **22–64f**: The **Certificate of Origin** materialises in front of the globe's lower half,
  centred at (540, 880), about 440 px wide. A wireframe perimeter draws first, then the glass
  body fills in, then its rows reveal. Slight 3D tilt and a gentle vertical bob.
- **28–75f**: Title, left-aligned at x 100, in the lower band (y ≈ 1200–1480):
  - overline `INTERNATIONAL TRADE · DIGITAL SERVICES` (cyan mono, 22 px)
  - "Digital Certificate" / "of Origin" (Inter Light 80 px, white)
  - "Attestation" (Inter SemiBold 80 px, gold, slow sheen)

  A soft dark scrim sits behind the title.
- **74–104f (→ 2)**: The title lifts and blurs out. The globe cranes up into a dim dome. The
  certificate drops down to the Trader.

### Scene 2 — Trader submission + digital service fee (90–180f · 3.0 s)
- **Top band**: `01 — SUBMISSION` / "The trader submits the documents digitally."
- **Upper hero**: the **Attestation Platform**, a stacked portal of elliptical rings with a light
  column, centred at (540, 700). Label `ATTESTATION PLATFORM` beneath it.
- **Bottom**: the **Trader**, a geometric emblem (hexagon, abstract figure, tick-ring) at
  (540, 1290). Label `TRADER`.
- **92–120f**: A vertical conduit draws from Trader to Platform, with motes flowing upward.
- **100–134f**: The *Certificate of Origin* card (left lane) **rises** along the conduit with vertical
  motion blur, a light trail and an `UPLOADING` rail, then is absorbed with a ring shockwave.
- **112–146f**: The *Commercial Invoice* card (right lane) follows the same way.
- **146–170f — digital service fee (brief)**: A small **cyan fee packet** rises from the Trader
  along the same conduit into the portal.
- **Ledger above the portal (y ≈ 420–540, x 100–900)**. The rows appear in sequence, each with a
  check:
  - `Certificate of Origin — RECEIVED`
  - `Commercial Invoice — RECEIVED`
  - `Digital service fee — PAID` (cyan)
- **166–194f (→ 3)**: The camera pushes into the portal (zoom + blur).

### Scene 3 — Verifier review (180–255f · 2.5 s)
- **Top band**: `02 — VERIFIER REVIEW` / "A verifier reviews the submitted documents."
- **Hero (y ≈ 520–1060)**: the two documents side by side, each about 360 px wide, angled
  slightly inward. They emerge from the push-in blurred and settle sharp.
- **194–228f**: A cyan **review sweep** passes top → bottom across both. It reads as a reviewer's
  attention passing over the page, with corner brackets settling on each section; it is not a
  data-extraction scan.
- **Lower band (y ≈ 1120–1460)**: four review rows. Each has a small icon and one short neutral
  label, and resolves from a spinning arc to a check (staggered 7f, 204–236f):
  - `Certificate reviewed`
  - `Invoice attached`
  - `Required information checked`
  - `Documents complete`
- **232–254f**: The rows fade. The documents merge at the centre. A cyan ring draws at (540, 820)
  and a check strokes in. **"Verified"** (Inter Light 92 px, centred) appears with
  `VERIFIER REVIEW COMPLETE` in mono below it.
- **(→ 4)**: The check mark contracts into a single bright point: the transaction packet.

### Scene 4 — Commercial Attaché review (255–330f · 2.5 s)
- **Top band**: `03 — ATTACHÉ REVIEW` / "The Iraqi Commercial Attaché reviews the transaction."
- **255–285f**: The camera cranes down. The globe appears as a **planet horizon in the lower
  half**. The transaction packet leaves the platform node (Baghdad) on a tall great-circle arc
  to the mission node, then a gold beam rises vertically to the mission.
- **Mission (upper hero, centre ≈ 540, 560)**: an architectural line drawing (pediment, six columns,
  stepped plinth) drawn stroke by stroke with a soft gold rim. Label `IRAQI COMMERCIAL ATTACHÉ`.
- **278–310f**: The **certificate** rises in beneath the mission (centre ≈ 540, 980, about 400 px
  wide) with a status chip `UNDER REVIEW` (white). A gold **review lens**, a thin rounded
  rectangle, glides down the document. There is **no pen, no signature and no seal**.
- **306–328f**: The chip changes to `ELIGIBLE FOR ATTESTATION` (gold) and a small gold review
  check appears on the document margin. This mark is deliberately different from the official seal.
- **Lower band**: **"Reviewed"** (Inter Light 84 px, centred) with `REQUIREMENTS SATISFIED` in mono.
- **(→ 5)**: A gold **instruction packet** drops from the mission down toward the Trader
  (fee due).

### Scene 5 — Sovereign fee & Accountant confirmation (330–420f · 3.0 s)
- **Top band**: `04 — SOVEREIGN FEE` / "Paid by the trader, confirmed by the accountant."
- Layout: **Top** is the instruction / confirmation card (authority), the **middle** is the secure
  core, and the **bottom** is the Trader. The certificate waits dimmed behind the core (on hold).
- **330–350f — Instruction.** The gold packet lands as a card in the upper hero (y ≈ 470–600,
  x 100–900): `SOVEREIGN ATTESTATION FEE` / status `DUE` (gold).
- **348–372f — Trader payment.** A gold value packet **rises** from the Trader emblem (bottom,
  y ≈ 1280) into the **secure core** (centre ≈ 540, 860: counter-rotating segmented rings around a
  hexagonal lock). The shackle snaps shut (backOut) with a light burst.
- **370–392f — Receipt submitted.** A small **receipt document** slides out of the core and
  travels up into the top card. The card reads `PAYMENT RECEIPT · PROOF SUBMITTED`.
- **390–414f — Accountant confirmation.** The top card flips (3D rotateX) to its confirmed side:
  an Accountant emblem (a geometric ledger mark), `CONFIRMED BY ACCOUNTANT` and a gold check.
- **Lower band — status rail (y ≈ 1380–1460)**: four nodes on a hairline that light up in sequence
  as each beat completes: `DUE → PAID → RECEIPT → CONFIRMED`.
- **(→ 6)**: The confirmation check shoots **upward** as a gold streak and the camera cranes up
  with it, back to the mission.

### Scene 6 — Digital attestation (420–495f · 2.5 s)
- **Top band**: `05 — DIGITAL ATTESTATION` / "Signed and sealed by the Commercial Attaché."
- **420–440f**: The mission re-enters at the top (compact, centre ≈ 540, 440). The certificate
  rises into the hero zone (centre ≈ 540, 920, about 480 px wide) with its gold frame warming.
- **440–468f — Digital signature.** The Attaché's signature draws itself on the attestation line
  with a cyan light head.
- **464–478f — Official seal.** A circular seal stamps in (overshoot, shockwave, gold glow), with
  text running around the ring.
- **476–494f — Issuance.** A status chip `CERTIFICATE ISSUED` appears. In the lower band,
  **"Digitally Attested"** (Inter Light 80 px, centred) with a gold rule and
  `SIGNED · SEALED · ISSUED` in mono.
- **(→ 7)**: The mission and statement clear, and the certificate pushes up to hero size.

### Scene 7 — Final attested certificate (495–600f · 3.5 s)
- **495–525f**: The certificate settles at hero size: centred at (540, 880), about 600 px wide
  (y ≈ 470–1290). Slow orbit (rotateY −10° → +6°) and push-in (≈ +4%). A holographic sheen passes
  at 535–575f.
- Features come alive on the document: the QR assembles module by module, the serial decodes, the
  `VALIDATED` badge pulses and the identity fingerprint resolves.
- **Callouts in the top and bottom bands**, in two columns (x 100–480 | x 520–900), each with a
  leader line into the document. Staggered 510 / 518 / 526 / 534f:
  - **Top left**: `SECURE DIGITAL IDENTITY` / "Unique document fingerprint"
  - **Top right**: `VALIDATION STATUS` / "Valid · Attested"
  - **Bottom left**: `UNIQUE SERIAL NUMBER` / `IQ-COO-2026-0847-3921` (mono, decoding)
  - **Bottom right**: `QR VERIFICATION` / "Scan to verify authenticity"
- **(→ 8)**: The certificate disintegrates into points of light.

### Scene 8 — TAMKEEN + contact (600–900f · 10.0 s)
- **598–665f**: About 770 points form a **coherent spiral** and collapse onto a single horizontal
  gold hairline (y ≈ 640). Length-clamped streaks give the motion blur.
- **642–690f**: The **gold hairline** (≈ 840 px, fading ends, gold diamond at the centre) extends.
- **652–700f**: **"TAMKEEN"** (Inter SemiBold 150 px, centred, top ≈ 460). Letters rise from a mask
  with blur-to-sharp, staggered 3f, while the tracking tightens.
- **672–700f**: Subtitle, 50 px, two lines: "Entrepreneurship, Technology" / "Localization & Software".
- **690–716f**: Final line, 76 px, two lines: "Powering **Digital Trade**" / "Transformation".
- **722–760f**: **Contact panel** (880 px wide, gold hairline border, soft glass fill) rises in:
  "**Contact us :**" (58 px, gold) above the number **07803158768** (104 px SemiBold, white). The
  digits rise into place one after another (2f stagger).
- **760–890f**: Full hold, about 4.5 s with everything readable, and never static: very slow push-in,
  a light gleam crosses the wordmark again at 810–856f, the contact panel's glow breathes, and
  particles keep rising.
- **891–900f**: Fade to black.
- Lock-up spans y ≈ 460–1480, centred on x 540, ≤ 920 px wide.

---

## 5. Animation language & transition logic

**Easing vocabulary**
- `expoOut`: arrivals and reveals.
- `expoInOut`: camera moves and document or packet travel.
- `backOut`: small mechanical snaps (lock shackle, seal stamp, card flip settle).
- Linear only for continuous systems (rotation, sweeps, particle drift, pulses).

**Rules**
1. *Vertical storytelling.* Submissions and payments rise, instructions descend and the camera
   cranes. Lateral motion is limited to parallax and small tilts.
2. *Workflow fidelity.* Each stage shows the responsible party (Trader, Verifier, Commercial
   Attaché, Accountant) and only the actions that party actually performs at that stage.
3. *Two distinct marks.* A **review check** (Verifier, Attaché review, Accountant) is always a
   simple ring + tick. The **official seal** appears only once, at digital attestation.
4. *Nothing is ever fully still.* Holds keep secondary motion: drift, breathing glow, rotating
   rings and pulses.
5. *Motivated transitions.* Each scene hands its energy to the next. No hard cuts and no standalone
   cross-dissolves.
6. *Layered depth.* Far (stars/globe), mid (stations, documents) and near (bokeh) layers drift at
   different vertical rates.
7. *Draw-on before fill.* Objects first appear as hairline wireframes, then gain body.
8. *Motion blur.* Velocity-proportional directional blur on the axis of travel, plus light trails.
9. *Staggers.* 3–7 frames. Nothing appears all at once.
10. *One focal point per moment.* In the narrow frame only one element animates prominently at a
    time. This matters most in Scene 5, where the four fee beats are strictly sequential.

**Transitions**
| Handoff | Frames | Move |
|---------|--------|------|
| 1 → 2 | 74–104 | Title lifts out, globe cranes up to a dim dome, certificate drops to the Trader |
| 2 → 3 | 166–194 | Push into the platform portal, documents re-emerge large |
| 3 → 4 | 246–270 | Verified check contracts to a packet, camera cranes down to the planet horizon, packet arcs to the mission |
| 4 → 5 | 320–342 | Gold instruction packet drops from the mission and lands as the "Fee due" card |
| 5 → 6 | 410–430 | Accountant check streaks upward, camera cranes up to the mission, certificate rises |
| 6 → 7 | 486–512 | Mission and statement clear, certificate pushes to hero size |
| 7 → 8 | 596–650 | Certificate disintegrates into a spiral that collapses into the brand hairline |
| 8 → contact | 722–760 | Contact panel rises beneath the lock-up; digits resolve in sequence |

---

## 6. Typography & visual hierarchy (sized for reading at 4 m)

Sizes are in canvas pixels at 1080 × 1920. **Minimum essential text: 32–36 px.**

| Role | Face | Size / weight | Treatment |
|------|------|---------------|-----------|
| Hero headline (Scene 1) | Inter | 96 px / 300 + 600 | 3 lines, left-aligned x 80, "Attestation" gold |
| Scene statements ("Verified", "Reviewed") | Inter | 128–132 px / 300 | centred, tracking settles wide → tight |
| "Digitally / Attested" | Inter | 118 px / 300 + 600 | centred, 2 lines, "Attested" gold |
| Wordmark "TAMKEEN" | Inter | 150 px / 600 | centred, tracking 28 → 10 px |
| Brand subtitle | Inter | 50 px / 400 | centred, 2 lines |
| Brand final line | Inter | 76 px / 300 | centred, 2 lines, "Digital Trade" cyan |
| Contact | Inter | 58 px / 400 label · 104 px / 600 number | centred in a gold-bordered panel |
| Chapter marker | JetBrains Mono + Inter | 38 px mono index/title · 46 px Inter Light line | top band, x 80, one line |
| Review rows / ledger / fee card | Inter | 44–50 px / 400 | with 28–32 px mono status |
| Status chips, rail labels, station labels | JetBrains Mono | 32–38 px / 500 | uppercase, tracked |
| Callouts (Scene 7) | JetBrains Mono + Inter | 32 px title · 46 px value (serial 42 px mono) | top & bottom bands |
| Document serif | Cormorant Garamond | scales with document | documents only (decorative at 4 m) |

**Hierarchy**: one statement per moment. The order of attention is always **hero object →
statement → status/labels → background**. No text line wider than 920 px.

**Palette**
- Background `#02040A` → `#061226`, vertical radial falloff.
- Text `#F4F7FB`.
- Cyan `#4FD8FF`: process, submission, service fee, verifier review.
- Gold `#D9B46A`: sovereign authority, Attaché, sovereign fee, seal, brand.
- Hairlines: white at 10–25% opacity.

The film moves from cyan (Scenes 2–3) to gold (Scenes 4–8) as the transaction enters the
sovereign part of the workflow.

---

## 7. Deliverables

- **New:** `out/certificate-of-origin-9x16-screen.mp4`, H.264, 1080 × 1920, 30 fps, 900 frames (30 s), yuv420p.
- **Kept unchanged:** `out/certificate-of-origin-9x16.mp4` (25 s social version) and
  `out/certificate-of-origin.mp4` (16:9).
- Every scene is checked against the critical zone (x 80–1000, y 140–1780) on still frames before
  the final render.
