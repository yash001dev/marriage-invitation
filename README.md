# Wedding Invitation — Next.js

A Next.js (App Router + TypeScript) clone of https://ribbon-kohl.vercel.app:
opening gate → full-screen intro video → hero video, gold scratch card,
Meet the Couple, flip-over celebration cards with a colour wash, families,
venue, WhatsApp blessings, footer, falling petals and background music.

## Run it

Easiest: double-click **start.command** (needs Node.js 20+ from nodejs.org).
It downloads the media, installs packages and opens http://localhost:3000.

Or in Terminal:

```bash
npm run assets   # downloads the original photos, videos & music into public/assets
npm install
npm run dev      # http://localhost:3000
```

## Make it yours

Everything — names, dates, events, venue, colours, music, media paths — lives in
**`config/wedding.ts`**. Media files live in **`public/assets/`**:

| What | File |
|---|---|
| Background still | `public/assets/images/background.jpg` |
| Couple photos | `public/assets/images/couple/*.jpg` |
| Event cards (page / full-size) | `public/assets/images/events/*.jpg`, `.../originals/*.png` |
| Intro + hero videos | `public/assets/videos/intro.mp4`, `hero-background.mp4` |
| Music | `public/assets/music/background-music.mp3` |

Set your WhatsApp number in `blessings.whatsappNumber` (country code first,
e.g. `919812345678`) — it's a placeholder until you do.

## Project layout

```
app/layout.tsx              fonts, metadata, theme colours from config
app/page.tsx                renders <Invitation />
app/globals.css             all styles (same class names as the original)
components/Invitation.tsx   gate → intro → site flow, music, scroll reveal
components/sections/        Hero, Scratch, Couple, Events, Family, Venue, Blessings, Footer
components/Petals.tsx       falling petals canvas
components/Lightbox.tsx     full-size invitation viewer
config/wedding.ts           ← the only file you need to edit
```

## Deploy

Push to GitHub and import on Vercel (zero config), or run `npm run build`.
