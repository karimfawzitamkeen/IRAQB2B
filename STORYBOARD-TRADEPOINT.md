# TRADPOINT · Iraq Trade Ecosystem — 25s vertical commercial + TAMKEEN contact end card (30 s total)
Decision record (autonomous production, no approval gate). Composition `TradePoint9x16` ·
`src/tradepoint/` · output `out/tradepoint-9x16.mp4` · 1080×1920 · 30 fps · 900 frames (30 s) · H.264 yuv420p.

**Client addition:** at the client's request, the TAMKEEN contact end card was added at the end. It's the same card as the TAMKEEN outdoor film: logo, TAMKEEN, إعلانك في قلب الحدث, Contact us : 07803158768 and www.tamkeen-tech.com. The 25 s film runs unchanged; the TAMKEEN credit then resolves into the card at 744–790f, which holds until the fade at 892–900f.

## Inputs & decisions
- **Real platform screenshots (tradpoint.click)** were supplied by the client. They are cropped with the phone status bar and browser bar removed, and stored in `public/tradepoint/`. They are integrated as moving 3D panels, not as a slideshow:
  - `home.jpg`: the homepage hero is the device panel in Scene 2.
  - `members.jpg`, `members-banner.jpg`, `member-diamond.jpg`: in Scene 3 the Members Directory page swings in and its featured banner lifts off the page. Then the real Verified + Diamond member card comes forward, with its badges highlighted and read out in Arabic.
  - `invest-hero.jpg`: in Scene 5 the Investment & Partnership Opportunities page swings in. The camera then pushes onto "Verified investment projects" and "Strategic partnerships".
- **No screenshots were supplied** for the Marketplace or the Services pages. Those scenes stay as kinetic category/service tiles (product categories, service names and icons only). They have no invented companies, cities, prices or UI buttons, and are not presented as platform pages.
- **Brand:** the wordmark is **TRADPOINT** (TRAD white + POINT gold), the official name on the platform. It is set by `BRAND` in `src/tradepoint/theme.ts`. The tagline IRAQ TRADE ECOSYSTEM is unchanged.
- **Stats** are taken from the homepage: 2,500+ عضو مسجل (Registered Members) · 180+ قطاعاً (Industry Sectors) · 45+ دولة (Countries).
- **TradePoint mark:** a geometric gold "point + routes" motion mark. The platform's emblem is only available at favicon size. The **TAMKEEN logo** is the vector rebuild of the supplied logo, reversed for dark screens.

## Structure
| # | Frames | Beat | Key text |
|---|---|---|---|
| 1 | 0–90 | Brand impact: gold point → line structure → wordmark | TRADPOINT · IRAQ TRADE ECOSYSTEM · نقطة تجارة · بوابة التاجر نحو العالم |
| 2 | 90–165 | Homepage hero as a 3D device panel, ecosystem, counters | Iraq's Digital Trade Ecosystem · تواصل · اكتشف · نمِّ أعمالك · 2,500+ · 180+ · 45+ |
| 3 | 165–240 | Panel explodes into a depth stream of member cards | دليل الأعضاء → شركاء موثوقون |
| 4 | 240–330 | Marketplace cards swipe, flip, stack | السوق الرقمي → منتجات → طلبات → فرص بيع |
| 5 | 330–405 | Refined opportunity cards, routes to the world | فرص استثمار → شراكات استراتيجية → نحو أسواق أوسع |
| 6 | 405–510 | Service cards lock in one by one | خدمات ودعم → مستندات التصدير → شهادة المنشأ → استشارات قانونية وتجارية → استشارات نمو الأعمال |
| 7 | 510–615 | Everything converges into a hub network | منصة واحدة → للتاجر العراقي نحو العالم |
| 8 | 615–675 | Cards collapse into the brand zone | TRADPOINT · IRAQ TRADE ECOSYSTEM · بوابة التاجر نحو العالم |
| 9 | 675–750 | TAMKEEN ending | تطوير وتشغيل · TAMKEEN logo · حلول رقمية للتجارة والأعمال |
| 10 | 750–900 | TAMKEEN contact end card (held) | TAMKEEN · إعلانك في قلب الحدث · Contact us : 07803158768 · www.tamkeen-tech.com |

## Rules
- Critical text zone x 100–980, y 180–1580. Arabic statements are 96–150 px (IBM Plex Sans Arabic Bold).
- Arabic animates by word only: RTL, no letter-spacing.
- One message at a time. Every message holds at least 0.6 s, and key messages about 1 s.
- Flash-safe: no large full-frame luminance jumps (public screen).
- Palette: navy #0C1E3C · deep blue #102A52 · gold #D4A629 · white #F5F5F2 · UI gray #EAECEF · teal #1FA59A.
