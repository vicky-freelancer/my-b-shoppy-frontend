/**
 * One-off generator: creates premium champagne/gold product illustrations
 * for the MY B SHOPPY storefront. Every image shares the same warm,
 * editorial, golden studio atmosphere so the catalogue feels cohesive.
 *
 * Run:  node scripts/generate-images.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'images', 'products');

mkdirSync(OUT, { recursive: true });

/* ------------------------------------------------------------------ */
/*  Shared geometry: golden studio background + soft podium shadow     */
/* ------------------------------------------------------------------ */

const GOLD = {
  a: '#E9C97C',
  b: '#D8A83E',
  c: '#B8860B',
  d: '#8A6A15',
};

const bg = (variant = 0) => {
  const glows = [
    `<radialGradient id="g1" cx="50%" cy="42%" r="62%">
       <stop offset="0%" stop-color="#FFFDF6" stop-opacity="0.95"/>
       <stop offset="55%" stop-color="#FFF6DE" stop-opacity="0.9"/>
       <stop offset="100%" stop-color="#F4D99B" stop-opacity="0.55"/>
     </radialGradient>`,
    `<radialGradient id="g1" cx="46%" cy="46%" r="70%">
       <stop offset="0%" stop-color="#FFFCF2" stop-opacity="1"/>
       <stop offset="60%" stop-color="#F8E8C2" stop-opacity="0.92"/>
       <stop offset="100%" stop-color="#EECB82" stop-opacity="0.5"/>
     </radialGradient>`,
    `<radialGradient id="g1" cx="55%" cy="40%" r="64%">
       <stop offset="0%" stop-color="#FFFEF9" stop-opacity="1"/>
       <stop offset="50%" stop-color="#FAEBD0" stop-opacity="0.9"/>
       <stop offset="100%" stop-color="#F0D38F" stop-opacity="0.6"/>
     </radialGradient>`,
  ];
  const sheen = `<rect width="600" height="600" fill="#FAF1DD" opacity="0.55"/>`;
  return `<defs>${glows[variant % glows.length]}
    <radialGradient id="halo" cx="50%" cy="48%" r="48%">
      <stop offset="0%" stop-color="#F7E3AC" stop-opacity="0.5"/>
      <stop offset="70%" stop-color="#F4D99B" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#F4D99B" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${GOLD.a}"/>
      <stop offset="48%" stop-color="${GOLD.b}"/>
      <stop offset="100%" stop-color="${GOLD.c}"/>
    </linearGradient>
    <linearGradient id="goldDiag" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${GOLD.b}"/>
      <stop offset="100%" stop-color="${GOLD.c}"/>
    </linearGradient>
    <filter id="shadow" x="-40%" y="-40%" width="180%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="14"/>
      <feOffset dy="10"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.22"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="soft"><feGaussianBlur stdDeviation="6"/></filter>
  </defs>
  ${sheen}
  <rect width="600" height="600" fill="url(#g1)"/>
  <circle cx="300" cy="285" r="240" fill="url(#halo)"/>
  <circle cx="300" cy="282" r="150" fill="none" stroke="#D8A83E" stroke-opacity="0.14" stroke-width="1.2" stroke-dasharray="1 9" stroke-linecap="round"/>`;
};

const sparkles = `<g fill="${GOLD.a}" opacity="0.85">
  <path d="M140 130l5 12 12 5-12 5-5 12-5-12-12-5 12-5z"/>
  <path d="M475 170l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" opacity="0.7"/>
  <path d="M452 452l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" opacity="0.8"/>
  <path d="M128 448l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" opacity="0.55"/>
</g>`;

const podium = (cy = 452, rx = 108, ry = 22) =>
  `<ellipse cx="300" cy="${cy}" rx="${rx}" ry="${ry}" fill="#6B5945" opacity="0.16" filter="url(#soft)"/>`;

const frame = `${sparkles}`;
const defs = (extra = '') => `${bg(0)}${extra}`;
const build = (inner, extraDefs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
${defs(extraDefs)}
${inner}
${frame}
</svg>`;

/* ------------------------------------------------------------------ */
/*  Product illustrations                                              */
/* ------------------------------------------------------------------ */

const images = {
  /* Gold claw hair clip */
  'clip-gold.svg': build(`
    ${podium(468, 90, 18)}
    <g transform="translate(300 300)">
      <path d="M-20 -96 Q0 -122 26 -102 L46 -88 Q62 -78 60 -62 L54 -38 Q52 -24 42 -20 L20 -12 Q8 -8 6 2 L0 30 Q-2 44 4 56 Q14 72 30 74 Q46 76 52 92 L56 108 Q58 116 50 120 Q34 126 16 120 Q-6 112 -14 94 L-22 66 Q-26 52 -16 44 L4 32 Q14 26 14 14 L12 -6 Q10 -16 -2 -18 L-26 -24 Q-40 -28 -44 -40 L-50 -58 Q-52 -70 -42 -78Z" fill="url(#gold)" filter="url(#shadow)"/>
      <path d="M-20 -96 Q0 -122 26 -102 L46 -88 Q62 -78 60 -62 L54 -38 Q52 -24 42 -20 L20 -12 Q8 -8 6 2 L0 30" fill="none" stroke="#FFF3D6" stroke-width="5" stroke-linecap="round" stroke-opacity="0.55"/>
      <circle cx="-12" cy="-70" r="7" fill="#FFFDF6" opacity="0.85"/>
      <circle cx="24" cy="-60" r="5" fill="#FFFDF6" opacity="0.7"/>
    </g>`),

  /* Blush pearl butterfly clip */
  'blush-clip.svg': build(`
    ${podium(470, 96, 20)}
    <g transform="translate(300 305)">
      <g filter="url(#shadow)">
        <path d="M-8 0 Q-52 -66 -128 -74 Q-96 -22 -58 6 Q-34 22 -8 26Z" fill="#F3C6CA"/>
        <path d="M8 0 Q52 -66 128 -74 Q96 -22 58 6 Q34 22 8 26Z" fill="#EFB8BD"/>
        <path d="M-8 0 Q-52 62 -120 88 Q-94 34 -52 12 Q-32 2 -8 4Z" fill="#F6CBD0"/>
        <path d="M8 0 Q52 62 120 88 Q94 34 52 12 Q32 2 8 4Z" fill="#F0BFC4"/>
        <rect x="-8" y="-4" width="16" height="30" rx="7" fill="#D8A83E"/>
      </g>
      <circle cx="-64" cy="-26" r="9" fill="#FFFDF6" opacity="0.95"/>
      <circle cx="-38" cy="-38" r="7" fill="#FFFDF6" opacity="0.75"/>
      <circle cx="64" cy="-26" r="9" fill="#FFFDF6" opacity="0.95"/>
      <circle cx="38" cy="-38" r="7" fill="#FFFDF6" opacity="0.75"/>
      <circle cx="-66" cy="46" r="7" fill="#FFFDF6" opacity="0.7"/>
      <circle cx="66" cy="46" r="7" fill="#FFFDF6" opacity="0.7"/>
    </g>`, `<radialGradient id="g1" cx="50%" cy="42%" r="62%">
       <stop offset="0%" stop-color="#FFFDF6" stop-opacity="0.95"/>
       <stop offset="55%" stop-color="#FBEBD8" stop-opacity="0.9"/>
       <stop offset="100%" stop-color="#F6D9A8" stop-opacity="0.55"/>
     </radialGradient>`),

  /* Lite blue quilted handbag */
  'lite-blue-bag.svg': build(`
    ${podium(486, 122, 24)}
    <g filter="url(#shadow)">
      <path d="M180 250 L184 236 Q198 200 300 200 Q402 200 416 236 L420 250 L424 420 Q424 448 396 448 L204 448 Q176 448 176 420Z" fill="#BFD7E8"/>
      <path d="M180 250 L184 236 Q198 200 300 200 L300 448 L204 448 Q176 448 176 420Z" fill="#ACCBE0"/>
      <path d="M300 200 Q402 200 416 236 L420 250 L424 420 Q424 448 396 448 L300 448Z" fill="#B8D4E6"/>
    </g>
    <g stroke="#8FB3CC" stroke-width="3" fill="none" opacity="0.8">
      <path d="M205 302 Q250 286 298 302 Q346 318 395 302"/>
      <path d="M205 352 Q250 336 298 352 Q346 368 395 352"/>
      <path d="M205 402 Q250 386 298 402 Q346 418 395 402"/>
    </g>
    <rect x="268" y="240" width="64" height="10" rx="5" fill="url(#gold)"/>
    <g stroke="#D8A83E" stroke-width="7" fill="none" stroke-linecap="round">
      <path d="M252 236 Q252 176 300 176 Q348 176 348 236"/>
    </g>
    <circle cx="300" cy="238" r="9" fill="url(#gold)"/>`,
    `<radialGradient id="g1" cx="50%" cy="42%" r="62%">
       <stop offset="0%" stop-color="#FFFDF6" stop-opacity="0.95"/>
       <stop offset="55%" stop-color="#FBEED6" stop-opacity="0.9"/>
       <stop offset="100%" stop-color="#F2D491" stop-opacity="0.55"/>
     </radialGradient>`),

  /* Black quilted bag with gold turnlock */
  'black-bag.svg': build(`
    ${podium(486, 118, 24)}
    <g filter="url(#shadow)">
      <path d="M182 252 L186 238 Q198 202 300 202 Q402 202 414 238 L418 252 L422 422 Q422 450 394 450 L206 450 Q178 450 178 422Z" fill="#232120"/>
      <path d="M182 252 L186 238 Q198 202 300 202 L300 450 L206 450 Q178 450 178 422Z" fill="#171515"/>
      <path d="M300 202 Q402 202 414 238 L418 252 L422 422 Q422 450 394 450 L300 450Z" fill="#2B2826"/>
    </g>
    <g stroke="#17120E" stroke-width="4" fill="none" opacity="0.7">
      <path d="M206 306 Q250 292 298 306 Q346 320 394 306"/>
      <path d="M206 356 Q250 342 298 356 Q346 370 394 356"/>
      <path d="M206 406 Q250 392 298 406 Q346 420 394 406"/>
    </g>
    <g stroke="#D8A83E" stroke-width="7" fill="none" stroke-linecap="round">
      <path d="M250 238 Q250 178 300 178 Q350 178 350 238"/>
    </g>
    <circle cx="300" cy="240" r="11" fill="url(#gold)"/>
    <rect x="288" y="234" width="24" height="12" rx="3" fill="#B8860B"/>
    <circle cx="294" cy="240" r="2.6" fill="#FFF3D6"/>
    <circle cx="306" cy="240" r="2.6" fill="#FFF3D6"/>`,
    `<radialGradient id="g1" cx="50%" cy="42%" r="62%">
       <stop offset="0%" stop-color="#FFFDF6" stop-opacity="0.95"/>
       <stop offset="55%" stop-color="#FBEED6" stop-opacity="0.9"/>
       <stop offset="100%" stop-color="#EFCE85" stop-opacity="0.5"/>
     </radialGradient>`),

  /* Champagne gold clutch with pearl clasp */
  'gold-bag.svg': build(`
    ${podium(486, 116, 24)}
    <g filter="url(#shadow)">
      <path d="M184 250 L188 238 Q200 204 300 204 Q400 204 412 238 L416 250 L420 420 Q420 448 392 448 L208 448 Q180 448 180 420Z" fill="url(#gold)"/>
      <path d="M184 250 L188 238 Q200 204 300 204 Q400 204 412 238 L416 250 L420 420 Q420 448 392 448 L300 448 L180 420Z" fill="none" stroke="#FFF3D6" stroke-width="3" stroke-opacity="0.5"/>
      <path d="M184 250 L300 448 L180 420 Z" fill="none"/>
      <path d="M184 250 L188 238 Q200 204 300 204 L300 448 Z" fill="#B8860B" opacity="0.25"/>
    </g>
    <g fill="#FFF3D6" opacity="0.35">
      <rect x="206" y="276" width="44" height="22" rx="7" transform="rotate(-6 228 287)"/>
      <rect x="352" y="276" width="44" height="22" rx="7" transform="rotate(6 374 287)"/>
      <rect x="206" y="330" width="44" height="22" rx="7" transform="rotate(-6 228 341)"/>
      <rect x="352" y="330" width="44" height="22" rx="7" transform="rotate(6 374 341)"/>
    </g>
    <circle cx="300" cy="238" r="13" fill="#FAF1DD"/>
    <circle cx="300" cy="238" r="9" fill="#F4D99B"/>
    <circle cx="303" cy="235" r="3" fill="#FFFDF6" opacity="0.9"/>
    <g stroke="#8A6A15" stroke-width="7" fill="none" stroke-linecap="round">
      <path d="M250 236 Q250 176 300 176 Q350 176 350 236"/>
    </g>`,
    `<radialGradient id="g1" cx="50%" cy="42%" r="62%">
       <stop offset="0%" stop-color="#FFFDF6" stop-opacity="0.95"/>
       <stop offset="55%" stop-color="#F5E3B2" stop-opacity="0.9"/>
       <stop offset="100%" stop-color="#EEC87E" stop-opacity="0.55"/>
     </radialGradient>`),

  /* Pearl headband */
  'pearl-headband.svg': build(`
    ${podium(470, 116, 22)}
    <g filter="url(#shadow)">
      <path d="M178 330 Q210 258 300 258 Q390 258 422 330 L410 340 Q384 274 300 274 Q216 274 190 340Z" fill="#D8A83E"/>
      <path d="M178 330 Q210 258 300 258 Q390 258 422 330" fill="none" stroke="#FFF3D6" stroke-width="4" stroke-opacity="0.6" stroke-linecap="round"/>
    </g>
    <g fill="#FFFDF6">
      <circle cx="212" cy="304" r="13"/><circle cx="248" cy="286" r="15"/>
      <circle cx="292" cy="280" r="16"/><circle cx="336" cy="286" r="15"/>
      <circle cx="372" cy="304" r="13"/>
    </g>
    <g fill="#F4D99B">
      <circle cx="212" cy="304" r="13"/><circle cx="248" cy="286" r="15"/>
      <circle cx="292" cy="280" r="16"/><circle cx="336" cy="286" r="15"/>
      <circle cx="372" cy="304" r="13"/>
      <circle cx="188" cy="318" r="11"/><circle cx="396" cy="318" r="11"/>
    </g>
    <g fill="#FFFDF6">
      <circle cx="208" cy="300" r="4"/><circle cx="242" cy="281" r="4.5"/>
      <circle cx="292" cy="274" r="5"/><circle cx="342" cy="281" r="4.5"/>
      <circle cx="376" cy="300" r="4"/>
    </g>`,
    `<radialGradient id="g1" cx="50%" cy="42%" r="62%">
       <stop offset="0%" stop-color="#FFFDF6" stop-opacity="0.95"/>
       <stop offset="55%" stop-color="#F8ECCD" stop-opacity="0.9"/>
       <stop offset="100%" stop-color="#F2D491" stop-opacity="0.55"/>
     </radialGradient>`),

  /* Ivory silk scrunchie */
  'silk-scrunchie.svg': build(`
    ${podium(474, 118, 24)}
    <circle cx="300" cy="318" r="112" fill="#FFF8E8" filter="url(#shadow)"/>
    <g fill="none" stroke="#F0E2C2" stroke-width="26">
      <circle cx="300" cy="318" r="112"/>
      <circle cx="300" cy="318" r="112" stroke-dasharray="60 26" stroke="#EAD9B4" stroke-width="22"/>
    </g>
    <circle cx="300" cy="318" r="52" fill="#FAF1DD"/>
    <circle cx="300" cy="318" r="40" fill="none" stroke="#E3CFA3" stroke-width="8"/>
    <circle cx="300" cy="318" r="26" fill="#F4D99B"/>
    <rect x="296" y="206" width="8" height="44" rx="4" fill="#F4D99B"/>`,
    `<radialGradient id="g1" cx="50%" cy="42%" r="62%">
       <stop offset="0%" stop-color="#FFFDF6" stop-opacity="1"/>
       <stop offset="55%" stop-color="#FDF3DC" stop-opacity="0.92"/>
       <stop offset="100%" stop-color="#F5E0B0" stop-opacity="0.6"/>
     </radialGradient>`),

  /* Terracotta scrunchie */
  'scrunchie-rust.svg': build(`
    ${podium(474, 118, 24)}
    <circle cx="300" cy="318" r="112" fill="#D9865B" filter="url(#shadow)"/>
    <g fill="none" stroke="#E8A87E" stroke-width="26">
      <circle cx="300" cy="318" r="112"/>
      <circle cx="300" cy="318" r="112" stroke-dasharray="58 30" stroke="#CD7A4F" stroke-width="22"/>
    </g>
    <circle cx="300" cy="318" r="52" fill="#E29A6F"/>
    <circle cx="300" cy="318" r="40" fill="none" stroke="#C57A4E" stroke-width="8"/>
    <circle cx="300" cy="318" r="26" fill="#DC8C5E"/>
    <rect x="296" y="206" width="8" height="44" rx="4" fill="#DC8C5E"/>`,
    `<radialGradient id="g1" cx="50%" cy="42%" r="62%">
       <stop offset="0%" stop-color="#FFFDF6" stop-opacity="0.95"/>
       <stop offset="55%" stop-color="#FAE9CE" stop-opacity="0.9"/>
       <stop offset="100%" stop-color="#F0CF8E" stop-opacity="0.55"/>
     </radialGradient>`),

  /* Burgundy velvet pearl bow */
  'velvet-bow.svg': build(`
    ${podium(472, 118, 24)}
    <g filter="url(#shadow)">
      <path d="M300 300 Q220 210 148 252 Q210 296 246 318 Q204 330 172 324 Q176 382 232 392 Q256 344 300 338Z" fill="#5C2430"/>
      <path d="M300 300 Q380 210 452 252 Q390 296 354 318 Q396 330 428 324 Q424 382 368 392 Q344 344 300 338Z" fill="#6E2A38"/>
      <rect x="272" y="258" width="56" height="58" rx="14" fill="#4A1C26"/>
    </g>
    <g fill="#FFFDF6">
      <circle cx="216" cy="292" r="5.5"/><circle cx="236" cy="284" r="5.5"/>
      <circle cx="384" cy="284" r="5.5"/><circle cx="404" cy="292" r="5.5"/>
      <circle cx="206" cy="312" r="4.5"/><circle cx="414" cy="312" r="4.5"/>
      <circle cx="288" cy="292" r="4"/><circle cx="312" cy="292" r="4"/>
    </g>`,
    `<radialGradient id="g1" cx="50%" cy="42%" r="62%">
       <stop offset="0%" stop-color="#FFFDF6" stop-opacity="0.95"/>
       <stop offset="55%" stop-color="#FBEED6" stop-opacity="0.9"/>
       <stop offset="100%" stop-color="#F2D491" stop-opacity="0.5"/>
     </radialGradient>`),

  /* Gold satin ribbon bow */
  'satin-bow.svg': build(`
    ${podium(474, 114, 24)}
    <g filter="url(#shadow)">
      <path d="M300 304 Q214 214 136 258 Q208 300 252 322 Q208 342 168 340 Q172 402 238 408 Q272 352 300 346Z" fill="url(#goldDiag)"/>
      <path d="M300 304 Q386 214 464 258 Q392 300 348 322 Q392 342 432 340 Q428 402 362 408 Q328 352 300 346Z" fill="url(#gold)"/>
      <rect x="268" y="262" width="64" height="60" rx="16" fill="#A87A12"/>
      <circle cx="300" cy="294" r="24" fill="url(#gold)"/>
    </g>
    <path d="M300 304 Q214 214 136 258" fill="none" stroke="#FFF3D6" stroke-width="5" stroke-opacity="0.6" stroke-linecap="round"/>
    <path d="M300 304 Q386 214 464 258" fill="none" stroke="#FFF3D6" stroke-width="5" stroke-opacity="0.45" stroke-linecap="round"/>
    <g fill="#FFF3D6" opacity="0.6">
      <path d="M216 292l5 12 12 5-12 5-5 12-5-12-12-5 12-5z" opacity="0.7"/>
      <path d="M392 292l5 12 12 5-12 5-5 12-5-12-12-5 12-5z" opacity="0.7"/>
    </g>`,
    `<radialGradient id="g1" cx="50%" cy="42%" r="62%">
       <stop offset="0%" stop-color="#FFFDF6" stop-opacity="0.95"/>
       <stop offset="55%" stop-color="#F7E6B6" stop-opacity="0.92"/>
       <stop offset="100%" stop-color="#F0CE85" stop-opacity="0.6"/>
     </radialGradient>`),

  /* Gold drop earrings */
  'gold-earrings.svg': build(`
    ${podium(470, 128, 26)}
    <g filter="url(#shadow)">
      <circle cx="235" cy="238" r="12" fill="none" stroke="url(#gold)" stroke-width="9"/>
      <circle cx="365" cy="238" r="12" fill="none" stroke="url(#gold)" stroke-width="9"/>
    </g>
    <path d="M235 246 L235 300 Q235 368 235 398" stroke="url(#gold)" stroke-width="9" stroke-linecap="round"/>
    <path d="M365 246 L365 300 Q365 368 365 398" stroke="url(#gold)" stroke-width="9" stroke-linecap="round"/>
    <ellipse cx="235" cy="424" rx="28" ry="40" fill="url(#gold)" filter="url(#shadow)"/>
    <ellipse cx="365" cy="424" rx="28" ry="40" fill="url(#gold)" filter="url(#shadow)"/>
    <ellipse cx="235" cy="410" rx="12" ry="16" fill="#FFF3D6" opacity="0.5"/>
    <ellipse cx="365" cy="410" rx="12" ry="16" fill="#FFF3D6" opacity="0.5"/>`,
    `<radialGradient id="g1" cx="50%" cy="42%" r="62%">
       <stop offset="0%" stop-color="#FFFDF6" stop-opacity="0.95"/>
       <stop offset="55%" stop-color="#F8ECCB" stop-opacity="0.9"/>
       <stop offset="100%" stop-color="#F2D491" stop-opacity="0.55"/>
     </radialGradient>`),

  /* Pearl drop earrings */
  'pearl-earrings.svg': build(`
    ${podium(470, 128, 26)}
    <g filter="url(#shadow)">
      <circle cx="235" cy="238" r="11" fill="none" stroke="url(#gold)" stroke-width="8"/>
      <circle cx="365" cy="238" r="11" fill="none" stroke="url(#gold)" stroke-width="8"/>
    </g>
    <path d="M235 246 L235 330" stroke="url(#gold)" stroke-width="8" stroke-linecap="round"/>
    <path d="M365 246 L365 330" stroke="url(#gold)" stroke-width="8" stroke-linecap="round"/>
    <g filter="url(#shadow)">
      <circle cx="235" cy="372" r="42" fill="#FFF8E8" stroke="#F4D99B" stroke-width="6"/>
      <circle cx="365" cy="372" r="42" fill="#FFFDF6" stroke="#F4D99B" stroke-width="6"/>
    </g>
    <circle cx="232" cy="366" r="12" fill="#FFFDF6" opacity="0.9"/>
    <circle cx="362" cy="366" r="12" fill="#FFFDF6" opacity="0.9"/>`,
    `<radialGradient id="g1" cx="50%" cy="42%" r="62%">
       <stop offset="0%" stop-color="#FFFDF6" stop-opacity="0.95"/>
       <stop offset="55%" stop-color="#FBEED6" stop-opacity="0.9"/>
       <stop offset="100%" stop-color="#F5DCA4" stop-opacity="0.55"/>
     </radialGradient>`),

  /* Gold pendant necklace */
  'gold-necklace.svg': build(`
    ${podium(478, 120, 24)}
    <g fill="none" stroke="url(#gold)" stroke-width="7" stroke-linecap="round">
      <path d="M182 250 Q300 168 418 250"/>
    </g>
    <circle cx="300" cy="286" r="9" fill="none" stroke="url(#gold)" stroke-width="7"/>
    <g filter="url(#shadow)">
      <path d="M300 300 Q260 352 300 414 Q340 352 300 300Z" fill="url(#gold)"/>
    </g>
    <path d="M300 322 Q280 362 300 402" fill="none" stroke="#FFF3D6" stroke-width="4" stroke-opacity="0.6" stroke-linecap="round"/>
    <circle cx="300" cy="352" r="5" fill="#FFFDF6" opacity="0.85"/>`,
    `<radialGradient id="g1" cx="50%" cy="42%" r="62%">
       <stop offset="0%" stop-color="#FFFDF6" stop-opacity="0.95"/>
       <stop offset="55%" stop-color="#F8ECCB" stop-opacity="0.9"/>
       <stop offset="100%" stop-color="#F2D491" stop-opacity="0.55"/>
     </radialGradient>`),

  /* Stacked gold bangles */
  'gold-bracelet.svg': build(`
    ${podium(476, 118, 24)}
    <g filter="url(#shadow)">
      <circle cx="300" cy="330" r="112" fill="none" stroke="url(#gold)" stroke-width="26"/>
      <circle cx="300" cy="330" r="112" fill="none" stroke="#FFF3D6" stroke-width="6" stroke-opacity="0.5"/>
      <circle cx="300" cy="330" r="86" fill="none" stroke="#B8860B" stroke-width="30"/>
      <circle cx="300" cy="330" r="58" fill="none" stroke="url(#gold)" stroke-width="24"/>
    </g>
    <circle cx="300" cy="330" r="38" fill="none" stroke="#FFF3D6" stroke-width="4" stroke-opacity="0.6" stroke-dasharray="2 10" stroke-linecap="round"/>`,
    `<radialGradient id="g1" cx="50%" cy="42%" r="62%">
       <stop offset="0%" stop-color="#FFFDF6" stop-opacity="0.95"/>
       <stop offset="55%" stop-color="#F8ECC9" stop-opacity="0.9"/>
       <stop offset="100%" stop-color="#F0CE85" stop-opacity="0.55"/>
     </radialGradient>`),

  /* Gold solitaire ring */
  'gold-ring.svg': build(`
    ${podium(476, 112, 22)}
    <g filter="url(#shadow)">
      <circle cx="290" cy="330" r="108" fill="none" stroke="url(#gold)" stroke-width="24"/>
      <path d="M290 222 Q290 178 332 158 Q360 146 366 168 L372 192 Q376 208 356 214 L322 224" fill="url(#gold)"/>
      <path d="M322 224 L344 130 L332 116 L316 206" fill="url(#gold)"/>
    </g>
    <path d="M316 190 L334 120" stroke="#FFF3D6" stroke-width="5" stroke-opacity="0.8"/>
    <circle cx="300" cy="330" r="48" fill="none" stroke="#F4D99B" stroke-width="5" stroke-dasharray="3 12" stroke-linecap="round"/>`,
    `<radialGradient id="g1" cx="50%" cy="42%" r="62%">
       <stop offset="0%" stop-color="#FFFDF6" stop-opacity="0.95"/>
       <stop offset="55%" stop-color="#F7E6B8" stop-opacity="0.9"/>
       <stop offset="100%" stop-color="#EECB7E" stop-opacity="0.55"/>
     </radialGradient>`),

  /* Floral hairpin */
  'floral-hairpin.svg': build(`
    ${podium(470, 96, 20)}
    <g filter="url(#shadow)">
      <rect x="252" y="256" width="96" height="150" rx="40" fill="url(#gold)"/>
      <path d="M252 300 Q252 256 300 256 Q348 256 348 300 L348 380 Q348 406 300 406 Q252 406 252 380Z" fill="#B8860B" opacity="0.4"/>
    </g>
    <g>
      <circle cx="240" cy="272" r="30" fill="#F3C6CA"/>
      <circle cx="300" cy="248" r="34" fill="#F0B8BD"/>
      <circle cx="360" cy="272" r="30" fill="#F5CDD2"/>
      <circle cx="300" cy="286" r="22" fill="#FBDFB0"/>
    </g>
    <g fill="#FFFDF6" opacity="0.9">
      <circle cx="300" cy="288" r="7"/>
      <circle cx="288" cy="284" r="4.5"/>
      <circle cx="312" cy="284" r="4.5"/>
    </g>
    <path d="M300 248 L300 214" stroke="#B8860B" stroke-width="5" stroke-linecap="round"/>`,
    `<radialGradient id="g1" cx="50%" cy="42%" r="62%">
       <stop offset="0%" stop-color="#FFFDF6" stop-opacity="0.95"/>
       <stop offset="55%" stop-color="#FBEED8" stop-opacity="0.9"/>
       <stop offset="100%" stop-color="#F5DCA4" stop-opacity="0.55"/>
     </radialGradient>`),

  /* Tortoiseshell headband */
  'tortoise-headband.svg': build(`
    ${podium(470, 112, 22)}
    <g filter="url(#shadow)">
      <path d="M182 330 Q212 260 300 260 Q388 260 418 330 L406 342 Q378 278 300 278 Q222 278 194 342Z" fill="#7A4A22"/>
      <path d="M182 330 Q212 260 300 260" fill="none" stroke="#A96A2F" stroke-width="5" stroke-opacity="0.7" stroke-linecap="round"/>
    </g>
    <g fill="#D8963D" opacity="0.5">
      <rect x="216" y="286" width="18" height="10" rx="5" transform="rotate(-16 225 291)"/>
      <rect x="286" y="278" width="18" height="10" rx="5" transform="rotate(-4 295 283)"/>
      <rect x="372" y="306" width="18" height="10" rx="5" transform="rotate(14 381 311)"/>
    </g>
    <ellipse cx="300" cy="330" rx="96" ry="10" fill="#6B5945" opacity="0.1"/>`,
    `<radialGradient id="g1" cx="50%" cy="42%" r="62%">
       <stop offset="0%" stop-color="#FFFDF6" stop-opacity="0.95"/>
       <stop offset="55%" stop-color="#F9EDD2" stop-opacity="0.9"/>
       <stop offset="100%" stop-color="#F2D491" stop-opacity="0.5"/>
     </radialGradient>`),
};

for (const [name, svg] of Object.entries(images)) {
  writeFileSync(join(OUT, name), svg);
  console.log('generated', name);
}
console.log('\nDone —', Object.keys(images).length, 'product images written to public/images/products/');