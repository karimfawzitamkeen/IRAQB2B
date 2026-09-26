# TRADEPOINT · Iraq Trade Ecosystem — 25s vertical commercial + TAMKEEN contact end card (30 s total)
Decision record (autonomous production, no approval gate). Composition `TradePoint9x16` ·
`src/tradepoint/` · output `out/tradepoint-9x16.mp4` · 1080×1920 · 30 fps · 900 frames (30 s) · H.264 yuv420p.

**Client addition:** at the client's request, the TAMKEEN contact end card was added at the end. It's the same card as the TAMKEEN outdoor film: logo, TAMKEEN, إعلانك في قلب الحدث, Contact us : 07803158768 and www.tamkeen-tech.com. The 25 s film runs unchanged; the TAMKEEN credit then resolves into the card at 744–790f, which holds until the fade at 892–900f.

## Inputs & autonomous decisions
- **Screenshots:** the TradePoint screenshots were **not present** in the environment. Only earlier
  TAMKEEN photos were available. The platform isn't publicly indexed either. The UI is therefore
  **recreated as live motion-design UI** from the brief's description and identity palette:
  homepage hero, member cards (verified / diamond), marketplace listings and RFQs, opportunities, and
  services. The UI is built in code, not as pixels, so every card can fly, flip, stack and assemble.
  All company names are generic category names (e.g. "مصنع أغذية"). There are no invented brands and
  no invented prices.
- **Wordmark spelling:** the brief uses both "TRADPOINT" and "TradePoint"/"TRADEPOINT". The film uses
  **TRADEPOINT**, which matches "نقطة تجارة", the composition ID and the concept line. It's a single
  constant (`BRAND` in `src/tradepoint/theme.ts`) if the exact spelling differs.
- **Stats labels:** the brief gives 2,500+ · 180+ · 45+ without labels. The film labels them
  أعضاء · شركات دولية · قطاعات. These are editable constants (`STATS`) and should be confirmed.
- **TradePoint mark:** no logo was supplied, so it gets a geometric gold "point + routes" mark. The
  **TAMKEEN logo** is the vector rebuild of the supplied logo (reversed for dark screens).

## Structure
| # | Frames | Beat | Key text |
|---|---|---|---|
| 1 | 0–90 | Brand impact: gold point → line structure → wordmark | TRADEPOINT · IRAQ TRADE ECOSYSTEM · نقطة تجارة · بوابة التاجر نحو العالم |
| 2 | 90–165 | Homepage hero as a 3D device panel, ecosystem, counters | Iraq's Digital Trade Ecosystem · تواصل · اكتشف · نمِّ أعمالك · 2,500+ · 180+ · 45+ |
| 3 | 165–240 | Panel explodes into a depth stream of member cards | دليل الأعضاء → شركاء موثوقون |
| 4 | 240–330 | Marketplace cards swipe, flip, stack | السوق الرقمي → منتجات → طلبات → فرص بيع |
| 5 | 330–405 | Refined opportunity cards, routes to the world | فرص استثمار → شراكات استراتيجية → نحو أسواق أوسع |
| 6 | 405–510 | Service cards lock in one by one | خدمات ودعم → مستندات التصدير → شهادة المنشأ → استشارات قانونية وتجارية → استشارات نمو الأعمال |
| 7 | 510–615 | Everything converges into a hub network | منصة واحدة → للتاجر العراقي نحو العالم |
| 8 | 615–675 | Cards collapse into the brand zone | TRADEPOINT · IRAQ TRADE ECOSYSTEM · بوابة التاجر نحو العالم |
| 9 | 675–750 | TAMKEEN ending | تطوير وتشغيل · TAMKEEN logo · حلول رقمية للتجارة والأعمال |
| 10 | 750–900 | TAMKEEN contact end card (held) | TAMKEEN · إعلانك في قلب الحدث · Contact us : 07803158768 · www.tamkeen-tech.com |

## Rules
- Critical text zone x 100–980, y 180–1580. Arabic statements are 96–150 px (IBM Plex Sans Arabic Bold).
- Arabic animates by word only: RTL, no letter-spacing.
- One message at a time. Every message holds at least 0.6 s, and key messages about 1 s.
- Flash-safe: no large full-frame luminance jumps (public screen).
- Palette: navy #0C1E3C · deep blue #102A52 · gold #D4A629 · white #F5F5F2 · UI gray #EAECEF · teal #1FA59A.
