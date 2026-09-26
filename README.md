# Digital Certificate of Origin Attestation — Motion Film

A 25-second, 1920×1080 @ 30 fps motion-graphics film built entirely with code in
[Remotion](https://www.remotion.dev/) + React. There is no stock footage and there are
no image assets: the globe (real coastlines from `world-atlas`), the documents, the seals,
the QR code and the particles are all generated programmatically.

- **Rendered film:** [`out/certificate-of-origin.mp4`](out/certificate-of-origin.mp4)
- **Storyboard, animation language and typography:** [`STORYBOARD.md`](STORYBOARD.md)

## Run

```bash
npm install
npm run studio          # interactive preview
npm run render          # → out/certificate-of-origin.mp4
```

If Remotion can't download its own headless Chrome (offline/CI), point it at an existing one:

```bash
REMOTION_CHROME=/path/to/headless_shell npm run render
```

## Structure

| Path | Role |
|------|------|
| `src/Film.tsx` | Master timeline: persistent background + globe layers, the seven scenes, lens finish |
| `src/theme.ts` | Palette, fonts, easing vocabulary, ramp/keyframe helpers |
| `src/components/Globe.tsx` | Dot-matrix Earth, great-circle trade arcs, the globe's camera path across the film |
| `src/components/Document.tsx` | The certificate: draw-on build, scan beam, signature, seal, QR, serial, sheen |
| `src/components/Background.tsx` | Depth particles, bokeh, volumetric light, vignette and film grain |
| `src/components/Primitives.tsx` | Directional motion blur, confirmation checks, word reveals, chapter markers |
| `src/scenes/Scene1–7.tsx` | One file per storyboard beat |
