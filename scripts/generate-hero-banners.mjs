/**
 * One-off generator: large full-bleed hero banners (1920x1080) for the
 * MY B SHOPPY home hero slider. Renders crisp, on-brand editorial
 * compositions using the same product illustration language as the
 * catalogue, on a rich champagne-gold studio background.
 *
 * Run:  node scripts/generate-hero-banners.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'images', 'hero');
const W = 1920;
const H = 1080;

mkdirSync(OUT, { recursive: true });

const defs = `
  <radialGradient id="gb" cx="50%" cy="40%" r="75%">
    <stop offset="0%" stop-color="#FFFDF6" stop-opacity="1"/>
    <stop offset="45%" stop-color="#FAE9C6" stop-opacity="1"/>
    <stop offset="78%" stop-color="#F0CE85" stop-opacity="1"/>
    <stop offset="100%" stop-color="#D8A83E" stop-opacity="1"/>
  </radialGradient>
  <radialGradient id="halo" cx="50%" cy="45%" r="50%">
    <stop offset="0%" stop-color="#FFF6DE" stop-opacity="0.55"/>
    <stop offset="70%" stop-color="#F4D99B" stop-opacity="0.18"/>
    <stop offset="100%" stop-color="#F4D99B" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#E9C97C"/>
    <stop offset="48%" stop-color="#D8A83E"/>
    <stop offset="100%" stop-color="#B8860B"/>
  </linearGradient>
  <linearGradient id="goldDiag" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#D8A83E"/>
    <stop offset="100%" stop-color="#B8860B"/>
  </linearGradient>
  <filter id="shadow" x="-40%" y="-40%" width="180%" height="220%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="16"/>
    <feOffset dy="12"/>
    <feComponentTransfer><feFuncA type="linear" slope="0.22"/></feComponentTransfer>
    <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="soft"><feGaussianBlur stdDeviation="7"/></filter>
`;

const background = `
  <rect width="${W}" height="${H}" fill="url(#gb)"/>
  <circle cx="${W / 2}" cy="520" r="640" fill="url(#halo)"/>
  <circle cx="${W / 2}" cy="535" r="430" fill="none" stroke="#B8860B" stroke-opacity="0.14" stroke-width="2.5" stroke-dasharray="2 22" stroke-linecap="round"/>
  <circle cx="${W / 2}" cy="520" r="620" fill="none" stroke="#B8860B" stroke-opacity="0.1" stroke-width="2" stroke-dasharray="2 18" stroke-linecap="round"/>
  <rect width="${W}" height="${H}" fill="#FAF1DD" opacity="0.5"/>
`;

const sparkles = `
  <g fill="#E9C97C">
    <path d="M180 220l7 18 18 7-18 7-7 18-7-18-18-7 18-7z"/>
    <path d="M1690 130l5 13 13 5-13 5-5 13-5-13-13-5 13-5z" opacity="0.8"/>
    <path d="M1560 860l5 12 12 5-12 5-5 12-5-12-12-5 12-5z" opacity="0.7"/>
    <path d="M330 820l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" opacity="0.6"/>
    <path d="M540 150l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" opacity="0.75"/>
    <path d="M1760 260l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" opacity="0.6"/>
  </g>
`;

const panel = `
  <g>
    <path d="M1040 960 L1040 330 Q1040 200 1170 200 L1350 200 L1350 170 Q1350 140 1380 120 L1440 78 Q1470 58 1490 58 L1510 58 Q1533 58 1555 78 L1578 120 Q1596 140 1596 170 L1596 200 H1750 Q1880 200 1880 330 L1880 960 Z"
          fill="#FFFDF6" stroke="#D8A83E" stroke-width="6"/>
    <path d="M1040 960 L1040 330 Q1040 200 1170 200 L1350 200 L1350 170 Q1350 140 1380 120 L1440 78 Q1470 58 1490 58 L1510 58 Q1533 58 1555 78 L1578 120 Q1596 140 1596 170 L1596 200 H1750 Q1880 200 1880 330 L1880 960 Z"
          fill="none" stroke="#B8860B" stroke-opacity="0.35" stroke-width="2.5" stroke-dasharray="1 16" stroke-linecap="round"
          transform="translate(12 14)"/>
    <ellipse cx="1460" cy="970" rx="430" ry="34" fill="#6B5945" opacity="0.14" filter="url(#soft)"/>
    <rect x="1092" y="252" width="736" height="2" fill="#D8A83E" opacity="0.5"/>
  </g>
`;

const item = (px, py, s, inner) =>
  `<g transform="translate(${(px - 300 * s).toFixed(1)} ${(py - 330 * s).toFixed(1)}) scale(${s})">${inner}</g>`;

/* ---------------- Product art (verbatim from generate-images.mjs) ---------------- */

const art = {
  clipGold: (px, py, s) => item(px, py, s, `
    <g filter="url(#shadow)">
      <path d="M-20 -96 Q0 -122 26 -102 L46 -88 Q62 -78 60 -62 L54 -38 Q52 -24 42 -20 L20 -12 Q8 -8 6 2 L0 30 Q-2 44 4 56 Q14 72 30 74 Q46 76 52 92 L56 108 Q58 116 50 120 Q34 126 16 120 Q-6 112 -14 94 L-22 66 Q-26 52 -16 44 L4 32 Q14 26 14 14 L12 -6 Q10 -16 -2 -18 L-26 -24 Q-40 -28 -44 -40 L-50 -58 Q-52 -70 -42 -78Z" fill="url(#gold)" filter="url(#shadow)"/>
      <path d="M-20 -96 Q0 -122 26 -102 L46 -88 Q62 -78 60 -62 L54 -38 Q52 -24 42 -20 L20 -12 Q8 -8 6 2 L0 30" fill="none" stroke="#FFF3D6" stroke-width="5" stroke-linecap="round" stroke-opacity="0.55"/>
      <circle cx="-12" cy="-70" r="7" fill="#FFFDF6" opacity="0.85"/>
      <circle cx="24" cy="-60" r="5" fill="#FFFDF6" opacity="0.7"/>
    </g>`),
  blushClip: (px, py, s) => item(px, py, s, `
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
    <circle cx="66" cy="46" r="7" fill="#FFFDF6" opacity="0.7"/>`),
  pearlHeadband: (px, py, s) => item(px, py, s, `
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
    </g>`),
  tortoiseHeadband: (px, py, s) => item(px, py, s, `
    <g filter="url(#shadow)">
      <path d="M182 330 Q212 260 300 260 Q388 260 418 330 L406 342 Q378 278 300 278 Q222 278 194 342Z" fill="#7A4A22"/>
      <path d="M182 330 Q212 260 300 260" fill="none" stroke="#A96A2F" stroke-width="5" stroke-opacity="0.7" stroke-linecap="round"/>
    </g>
    <g fill="#D8963D" opacity="0.5">
      <rect x="216" y="286" width="18" height="10" rx="5" transform="rotate(-16 225 291)"/>
      <rect x="286" y="278" width="18" height="10" rx="5" transform="rotate(-4 295 283)"/>
      <rect x="372" y="306" width="18" height="10" rx="5" transform="rotate(14 381 311)"/>
    </g>`),
  silkScrunchie: (px, py, s) => item(px, py, s, `
    <circle cx="300" cy="318" r="112" fill="#FFF8E8" filter="url(#shadow)"/>
    <g fill="none" stroke="#F0E2C2" stroke-width="26">
      <circle cx="300" cy="318" r="112"/>
      <circle cx="300" cy="318" r="112" stroke-dasharray="60 26" stroke="#EAD9B4" stroke-width="22"/>
    </g>
    <circle cx="300" cy="318" r="52" fill="#FAF1DD"/>
    <circle cx="300" cy="318" r="40" fill="none" stroke="#E3CFA3" stroke-width="8"/>
    <circle cx="300" cy="318" r="26" fill="#F4D99B"/>
    <rect x="296" y="206" width="8" height="44" rx="4" fill="#F4D99B"/>`),
  satinBow: (px, py, s) => item(px, py, s, `
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
    </g>`),
  goldNecklace: (px, py, s) => item(px, py, s, `
    <g fill="none" stroke="url(#gold)" stroke-width="7" stroke-linecap="round">
      <path d="M182 250 Q300 168 418 250"/>
    </g>
    <circle cx="300" cy="286" r="9" fill="none" stroke="url(#gold)" stroke-width="7"/>
    <g filter="url(#shadow)">
      <path d="M300 300 Q260 352 300 414 Q340 352 300 300Z" fill="url(#gold)"/>
    </g>
    <path d="M300 322 Q280 362 300 402" fill="none" stroke="#FFF3D6" stroke-width="4" stroke-opacity="0.6" stroke-linecap="round"/>
    <circle cx="300" cy="352" r="5" fill="#FFFDF6" opacity="0.85"/>`),
  goldEarrings: (px, py, s) => item(px, py, s, `
    <g filter="url(#shadow)">
      <circle cx="235" cy="238" r="12" fill="none" stroke="url(#gold)" stroke-width="9"/>
      <circle cx="365" cy="238" r="12" fill="none" stroke="url(#gold)" stroke-width="9"/>
    </g>
    <path d="M235 246 L235 300 Q235 368 235 398" stroke="url(#gold)" stroke-width="9" stroke-linecap="round"/>
    <path d="M365 246 L365 300 Q365 368 365 398" stroke="url(#gold)" stroke-width="9" stroke-linecap="round"/>
    <ellipse cx="235" cy="424" rx="28" ry="40" fill="url(#gold)" filter="url(#shadow)"/>
    <ellipse cx="365" cy="424" rx="28" ry="40" fill="url(#gold)" filter="url(#shadow)"/>
    <ellipse cx="235" cy="410" rx="12" ry="16" fill="#FFF3D6" opacity="0.5"/>
    <ellipse cx="365" cy="410" rx="12" ry="16" fill="#FFF3D6" opacity="0.5"/>`),
  pearlEarrings: (px, py, s) => item(px, py, s, `
    <g filter="url(#shadow)">
      <circle cx="235" cy="238" r="11" fill="none" stroke="url(#gold)" stroke-width="8"/>
      <circle cx="365" cy="238" r="11" fill="none" stroke="url(#gold)" stroke-width="8"/>
    </g>
    <path d="M235 246 L235 330" stroke="url(#gold)" stroke-width="8" stroke-linecap="round"/>
    <path d="M365 246 L365 330" stroke="url(#gold)" stroke-width="8" stroke-linecap="round"/>
    <circle cx="235" cy="372" r="42" fill="#FFF8E8" stroke="#F4D99B" stroke-width="6"/>
    <circle cx="365" cy="372" r="42" fill="#FFFDF6" stroke="#F4D99B" stroke-width="6"/>
    <circle cx="232" cy="366" r="12" fill="#FFFDF6" opacity="0.9"/>
    <circle cx="362" cy="366" r="12" fill="#FFFDF6" opacity="0.9"/>`),
  goldBangle: (px, py, s) => item(px, py, s, `
    <g filter="url(#shadow)">
      <circle cx="300" cy="330" r="112" fill="none" stroke="url(#gold)" stroke-width="26"/>
      <circle cx="300" cy="330" r="112" fill="none" stroke="#FFF3D6" stroke-width="6" stroke-opacity="0.5"/>
      <circle cx="300" cy="330" r="86" fill="none" stroke="#B8860B" stroke-width="30"/>
      <circle cx="300" cy="330" r="58" fill="none" stroke="url(#gold)" stroke-width="24"/>
    </g>
    <circle cx="300" cy="330" r="38" fill="none" stroke="#FFF3D6" stroke-width="4" stroke-opacity="0.6" stroke-dasharray="2 10" stroke-linecap="round"/>`),
  goldRing: (px, py, s) => item(px, py, s, `
    <g filter="url(#shadow)">
      <circle cx="290" cy="330" r="108" fill="none" stroke="url(#gold)" stroke-width="24"/>
      <path d="M290 222 Q290 178 332 158 Q360 146 366 168 L372 192 Q376 208 356 214 L322 224" fill="url(#gold)"/>
      <path d="M322 224 L344 130 L332 116 L316 206" fill="url(#gold)"/>
    </g>
    <path d="M316 190 L334 120" stroke="#FFF3D6" stroke-width="5" stroke-opacity="0.8"/>
    <circle cx="300" cy="330" r="48" fill="none" stroke="#F4D99B" stroke-width="5" stroke-dasharray="3 12" stroke-linecap="round"/>`),
  goldBag: (px, py, s) => item(px, py, s, `
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
    </g>`),
};

const banners = {
  'banner-hair-accessories.svg': `
    ${panel}
    ${art.pearlHeadband(1460, 345, 0.82)}
    ${art.blushClip(1240, 490, 0.58)}
    ${art.silkScrunchie(1630, 440, 0.6)}
    ${art.clipGold(1160, 620, 0.62)}
    ${art.satinBow(1680, 500, 0.58)}
    ${art.tortoiseHeadband(1690, 700, 0.6)}
  `,
  'banner-artificial-jewels.svg': `
    ${panel}
    ${art.goldNecklace(1460, 380, 0.82)}
    ${art.goldEarrings(1240, 560, 0.62)}
    ${art.pearlEarrings(1660, 560, 0.62)}
    ${art.goldRing(1240, 800, 0.6)}
    ${art.goldBangle(1420, 790, 0.62)}
    ${art.goldBag(1660, 800, 0.6)}
  `,
};

for (const [name, focus] of Object.entries(banners)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>${defs}</defs>
${background}
${sparkles}
${focus}
</svg>`;
  writeFileSync(join(OUT, name), svg);
  console.log('generated', name);
}
console.log('\nDone —', Object.keys(banners).length, 'hero banners written to public/images/hero/');