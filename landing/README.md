# ShopMaster landing page

Frontend-only landing page for ShopMaster (Access Bank hackathon). It explains the problem, the goal, how the product works and our approach. It is not the pitch deck.

## Run it on your computer

You need Node.js 20 or newer.

```bash
cd landing
npm install
npm run dev
```

Then open http://localhost:5173

Production build and preview (what the judges would see):

```bash
npm run build
npm run preview   # http://localhost:4173
```

## Tests

```bash
npx playwright install chromium   # first time only
npx playwright test               # 6 checks x desktop and mobile
```

## Deploy

It's a static site. Import the repo on Vercel or Netlify with:
- Root directory: `landing`
- Build command: `npm run build`
- Output directory: `dist`

## Notes

- Built with Vite, GSAP (ScrollTrigger, SplitText) and Lenis. Fonts are self-hosted in `public/fonts`.
- The join form is a demo: nothing is sent anywhere.
- Design decisions are in `DESIGN.md`.
