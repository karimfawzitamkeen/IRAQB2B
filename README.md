# Digital Certificate of Origin Attestation — Motion Film

A 25-second motion-graphics film built entirely with code in
[Remotion](https://www.remotion.dev/) + React. There is no stock footage and there are
no image assets: the globe (real coastlines from `world-atlas`), the documents, the seals,
the QR code and the particles are all generated programmatically.

- **Portrait display-screen master (9:16, 1080×1920, 30 fps, 30 s, text sized for 4 m):** [`out/certificate-of-origin-9x16-screen.mp4`](out/certificate-of-origin-9x16-screen.mp4)
- **Portrait social version (9:16, 25 s):** [`out/certificate-of-origin-9x16.mp4`](out/certificate-of-origin-9x16.mp4), the earlier small-type version
- **Smart Legal Advisor brand film (9:16, 1080×1920, 30 fps, 25 s):** [`out/smart-legal-advisor-9x16.mp4`](out/smart-legal-advisor-9x16.mp4), a separate composition `SmartLegalAdvisor9x16` in `src/sla/`, storyboard in [`STORYBOARD-SMART-LEGAL-ADVISOR.md`](STORYBOARD-SMART-LEGAL-ADVISOR.md)
- **TAMKEEN outdoor-screens commercial (9:16, 1080×1920, 30 fps, 25 s):** [`out/tamkeen-dooh-9x16.mp4`](out/tamkeen-dooh-9x16.mp4), composition `TamkeenDOOH9x16` in `src/dooh/`, real screen photos in `public/dooh/`, decision record in [`STORYBOARD-TAMKEEN-DOOH.md`](STORYBOARD-TAMKEEN-DOOH.md)
- **TRADEPOINT · Iraq Trade Ecosystem commercial (9:16, 1080×1920, 30 fps, 30 s including the TAMKEEN contact end card):** [`out/tradepoint-9x16.mp4`](out/tradepoint-9x16.mp4), composition `TradePoint9x16` in `src/tradepoint/`, decision record in [`STORYBOARD-TRADEPOINT.md`](STORYBOARD-TRADEPOINT.md)
- **Original landscape version (16:9, 1920×1080):** [`out/certificate-of-origin.mp4`](out/certificate-of-origin.mp4), which predates the approved workflow order
- **Storyboard, workflow, safe areas, animation language and typography:** [`STORYBOARD.md`](STORYBOARD.md)

## Run

```bash
npm install
npm run studio          # interactive preview (both compositions)
npm run render          # 9:16 display → out/certificate-of-origin-9x16-screen.mp4
npm run render:16x9     # 16:9 → out/certificate-of-origin.mp4
npm run render:sla      # Smart Legal Advisor → out/smart-legal-advisor-9x16.mp4
npm run render:dooh     # TAMKEEN outdoor screens → out/tamkeen-dooh-9x16.mp4
npm run render:tp       # TRADEPOINT commercial → out/tradepoint-9x16.mp4
npm run typecheck
```

If Remotion can't download its own headless Chrome (offline/CI), point it at an existing one:

```bash
REMOTION_CHROME=/path/to/headless_shell npm run render
```

## Structure

| Path | Role |
|------|------|
| `src/portrait/Film9x16.tsx` | **9:16 master timeline**: background, globe, the certificate's continuous journey, eight scenes, lens finish |
| `src/portrait/layout.ts` | Portrait canvas, display-screen critical zone (x 80–1000, y 140–1780), 900-frame duration, scene windows, portrait globe camera path |
| `src/portrait/DocJourney.tsx` | The single hero certificate from Attaché review through final reveal (pose, status chips, seal shockwave) |
| `src/portrait/scenes/P1–P8*.tsx` | One file per portrait storyboard scene |
| `src/portrait/ui.tsx` | Portrait chapter marker, status chips, Trader / Platform / secure core / Accountant emblems, receipt, packets |
| `src/Film.tsx` | 16:9 master timeline (original landscape version) |
| `src/theme.ts` | Palette, fonts, easing vocabulary, ramp/keyframe helpers |
| `src/components/Globe.tsx` | Dot-matrix Earth, great-circle trade arcs, the globe's camera path across the film |
| `src/components/Document.tsx` | The certificate: draw-on build, scan beam, signature, seal, QR, serial, sheen |
| `src/components/Background.tsx` | Depth particles, bokeh, volumetric light, vignette and film grain |
| `src/components/Primitives.tsx` | Directional motion blur, confirmation checks, word reveals, chapter markers |
| `src/scenes/Scene1–7.tsx` | 16:9 scenes (original landscape version) |
