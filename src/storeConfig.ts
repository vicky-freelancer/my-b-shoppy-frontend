import { StoreConfig, ProductCategory, ProductItem } from './types';

/**
 * ============================================================================
 * 🏪 MY B SHOPPY — STORE CONFIGURATION & PRODUCT CATALOGUE
 * ============================================================================
 * Premium Indian fashion accessories brand.
 * Tagline: STYLE • ACCESSORIES • YOU
 *
 * All product imagery lives under /public/images/products/ and
 * uses a consistent warm champagne / gold studio art direction.
 * ============================================================================
 */

export const INITIAL_PRODUCTS: ProductItem[] = [
  // ---------- HAIR ACCESSORIES ----------
  {
    id: 'gold-hair-clip',
    name: 'Classic Gold Clip',
    subtitle: 'Warm golden claw clip for every day',
    price: 100,
    imageUrl: '/images/products/clip-gold.svg',
    category: 'Hair Accessories',
    categoryId: 'hair-accessories',
    badge: 'BESTSELLER',
    rating: 4.9,
    reviewsCount: 24,
    material: 'Metal',
    variants: ['Champagne Gold', 'Rose Gold'],
    description:
      'A timeless golden claw clip that holds every hair type with a gentle, secure grip. Lightweight, comfortable and finished to last.',
    inStock: true,
  },
  {
    id: 'blush-butterfly-clip',
    name: 'Blush Pearl Clip',
    subtitle: 'Blush butterfly clip with pearl accents',
    price: 120,
    imageUrl: '/images/products/blush-clip.svg',
    category: 'Hair Accessories',
    categoryId: 'hair-accessories',
    badge: 'NEW',
    rating: 4.8,
    reviewsCount: 12,
    material: 'Resin',
    variants: ['Blush Pink', 'Champagne'],
    description:
      'Delicate blush-toned clip crowned with soft pearl detailing. An everyday feminine accent that dresses up ponytails and half-up styles.',
    inStock: true,
  },
  {
    id: 'pearl-headband',
    name: 'Pearl Headband',
    subtitle: 'Champagne headband dotted with pearls',
    price: 150,
    imageUrl: '/images/products/pearl-headband.svg',
    category: 'Hair Accessories',
    categoryId: 'hair-accessories',
    rating: 4.9,
    reviewsCount: 18,
    material: 'Resin',
    variants: ['Champagne Pearl', 'Ivory Pearl'],
    description:
      'Comfortable-to-wear pearl headband that instantly lifts casual outfits into editorial territory.',
    inStock: true,
  },
  {
    id: 'floral-hairpin',
    name: 'Floral Hair Pin',
    subtitle: 'Gold hairpin blossoming with blush flowers',
    price: 110,
    imageUrl: '/images/products/floral-hairpin.svg',
    category: 'Hair Accessories',
    categoryId: 'hair-accessories',
    badge: 'NEW',
    rating: 4.7,
    reviewsCount: 9,
    material: 'Metal',
    variants: ['Blush Bloom', 'Cream Bloom'],
    description:
      'A dainty gold hairpin finished with soft floral petals — right at home in romantic updos and everyday waves.',
    inStock: true,
  },
  {
    id: 'tortoise-headband',
    name: 'Tortoise Headband',
    subtitle: 'Warm tortoiseshell headband',
    price: 130,
    imageUrl: '/images/products/tortoise-headband.svg',
    category: 'Hair Accessories',
    categoryId: 'hair-accessories',
    rating: 4.8,
    reviewsCount: 14,
    material: 'Resin',
    variants: ['Tortoise', 'Honey'],
    description:
      'A polished tortoiseshell headband with vintage character — the accessory that makes everything look intentional.',
    inStock: true,
  },

  // ---------- SCRUNCHIES ----------
  {
    id: 'silk-luxe-scrunchie',
    name: 'Silk Luxe Scrunchie',
    subtitle: 'Ivory silk scrunchie in soft champagne tones',
    price: 90,
    imageUrl: '/images/products/silk-scrunchie.svg',
    category: 'Scrunchies',
    categoryId: 'scrunchies',
    badge: 'BESTSELLER',
    rating: 4.9,
    reviewsCount: 31,
    material: 'Silk / Satin',
    variants: ['Ivory', 'Champagne', 'Dusty Rose'],
    description:
      'Zero-frizz, zero-crease scrunchie that keeps hair soft while looking gloriously plush. The scrunchie that doubles as wrist candy.',
    inStock: true,
  },
  {
    id: 'rust-scrunchie',
    name: 'Rust Velvet Scrunchie',
    subtitle: 'Rich rust velvet scrunchie',
    price: 85,
    imageUrl: '/images/products/scrunchie-rust.svg',
    category: 'Scrunchies',
    categoryId: 'scrunchies',
    rating: 4.8,
    reviewsCount: 16,
    material: 'Velvet',
    variants: ['Rust', 'Burgundy', 'Terracotta'],
    description:
      'Sumptuous velvet scrunchie in a saturated warm rust — a moody little accent that finishes any bun or braid.',
    inStock: true,
  },

  // ---------- BOWS ----------
  {
    id: 'satin-bow',
    name: 'Golden Satin Bow',
    subtitle: 'Shimmering gold satin ribbon bow',
    price: 120,
    imageUrl: '/images/products/satin-bow.svg',
    category: 'Bows',
    categoryId: 'bows',
    badge: 'NEW',
    rating: 4.9,
    reviewsCount: 20,
    material: 'Satin',
    variants: ['Champagne Gold', 'Ivory', 'Blush'],
    description:
      'A lustrous satin bow with a golden sheen. Pin it in your hair, tie it on a handle, or save it for the perfect gift.',
    inStock: true,
  },
  {
    id: 'velvet-pearl-bow',
    name: 'Velvet Pearl Bow',
    subtitle: 'Burgundy velvet bow with pearl studs',
    price: 140,
    imageUrl: '/images/products/velvet-bow.svg',
    category: 'Bows',
    categoryId: 'bows',
    rating: 4.8,
    reviewsCount: 22,
    material: 'Velvet',
    variants: ['Burgundy', 'Midnight', 'Cream'],
    description:
      'Weighty French velvet bow trimmed with micro pearls — the coquette statement piece for every occasion.',
    inStock: true,
  },

  // ---------- HANDBAGS ----------
  {
    id: 'lite-blue-handbag',
    name: 'Lite Blue Handbag',
    subtitle: 'Soft blue minimal handbag with gold chain',
    price: 99,
    imageUrl: '/images/products/lite-blue-bag.svg',
    category: 'Handbags',
    categoryId: 'handbags',
    badge: 'NEW',
    rating: 4.7,
    reviewsCount: 11,
    material: 'Vegan Leather',
    variants: ['Lite Blue', 'Cream', 'Blush'],
    description:
      'A dreamy light-blue handbag with a slim gold chain. Structured, roomy and endlessly easy to style.',
    inStock: true,
  },
  {
    id: 'black-quilted-bag',
    name: 'Black Quilted Bag',
    subtitle: 'Quilted black bag with gold turnlock',
    price: 99,
    imageUrl: '/images/products/black-bag.svg',
    category: 'Handbags',
    categoryId: 'handbags',
    rating: 4.8,
    reviewsCount: 19,
    material: 'Vegan Leather',
    variants: ['Noir Black', 'Ivory'],
    description:
      'The classic quilted silhouette in noir, finished with a golden turnlock. An instant-elevation essential for every wardrobe.',
    inStock: true,
  },
  {
    id: 'gold-bag',
    name: 'Champagne Gold Bag',
    subtitle: 'Gilded clutch with pearl clasp',
    price: 459,
    imageUrl: '/images/products/gold-bag.svg',
    category: 'Handbags',
    categoryId: 'handbags',
    badge: 'EXCLUSIVE',
    rating: 5.0,
    reviewsCount: 14,
    material: 'Vegan Leather',
    variants: ['Champagne Gold', 'Rose Gold'],
    description:
      'A luminous champagne-gold clutch finished with a soft pearl clasp. Made for evenings that deserve a little glow.',
    inStock: true,
  },

  // ---------- EARRINGS ----------
  {
    id: 'gold-drop-earrings',
    name: 'Golden Drop Earrings',
    subtitle: 'Gold drops for everyday shine',
    price: 180,
    imageUrl: '/images/products/gold-earrings.svg',
    category: 'Earrings',
    categoryId: 'earrings',
    rating: 4.9,
    reviewsCount: 17,
    material: 'Gold Plated',
    variants: ['Champagne Gold', 'Rose Gold'],
    description:
      'Sculpted gold drop earrings that swing prettily and pair with everything from kurtas to cocktail dresses.',
    inStock: true,
  },
  {
    id: 'pearl-drop-earrings',
    name: 'Pearl Drop Earrings',
    subtitle: 'Pearl drops with slim gold hoops',
    price: 160,
    imageUrl: '/images/products/pearl-earrings.svg',
    category: 'Earrings',
    categoryId: 'earrings',
    badge: 'NEW',
    rating: 4.8,
    reviewsCount: 13,
    material: 'Gold Plated',
    variants: ['Ivory Pearl', 'Champagne Pearl'],
    description:
      'A slim gold hoop meeting a luminous pearl — the quiet-luxury earring your jewellery box has been waiting for.',
    inStock: true,
  },

  // ---------- NECKLACES ----------
  {
    id: 'gold-pendant-necklace',
    name: 'Radiant Pendant Necklace',
    subtitle: 'Golden pendant on a delicate chain',
    price: 220,
    imageUrl: '/images/products/gold-necklace.svg',
    category: 'Necklaces',
    categoryId: 'necklaces',
    rating: 4.9,
    reviewsCount: 21,
    material: 'Gold Plated',
    variants: ['18-inch', '20-inch'],
    description:
      'A radiant gold pendant suspended on a fine chain — soft, warm and made to be layered or worn alone.',
    inStock: true,
  },

  // ---------- BRACELETS ----------
  {
    id: 'gold-bangle-set',
    name: 'Golden Bangle Set',
    subtitle: 'Stack of polished gold bangles',
    price: 200,
    imageUrl: '/images/products/gold-bracelet.svg',
    category: 'Bracelets',
    categoryId: 'bracelets',
    rating: 4.8,
    reviewsCount: 15,
    material: 'Gold Plated',
    variants: ['Set of 3', 'Set of 5'],
    description:
      'A stacked trio of polished gold bangles that catch the light with the slightest movement.',
    inStock: true,
  },

  // ---------- RINGS ----------
  {
    id: 'gold-signature-ring',
    name: 'Signature Gold Ring',
    subtitle: 'Classic gold ring with a raised setting',
    price: 250,
    imageUrl: '/images/products/gold-ring.svg',
    category: 'Rings',
    categoryId: 'rings',
    badge: 'EXCLUSIVE',
    rating: 5.0,
    reviewsCount: 26,
    material: 'Gold Plated',
    variants: ['Size 6', 'Size 7', 'Size 8'],
    description:
      'A signature gold ring with a sculpted raised setting — simple enough for daily wear, striking enough to be noticed.',
    inStock: true,
  },
];

export const CATEGORIES_CATALOG: ProductCategory[] = [
  {
    id: 'hair-accessories',
    name: 'Hair Accessories',
    count: 86,
    tagline: 'Clips, headbands, pearl barrettes & pins',
    description: 'Handcrafted hair clips, pearl barrettes and non-slip claws made for every style and every mood.',
    startingPrice: 100,
    badge: 'Popular',
    imageUrl: '/images/categories/Hair Accessories.jpg',
    items: INITIAL_PRODUCTS.filter((p) => p.categoryId === 'hair-accessories'),
  },
  {
    id: 'artificial-jewels',
    name: 'Artificial Jewels',
    count: 120,
    tagline: 'Anti-tarnish gold-plated everyday luxury',
    description: 'Statement pieces with a warm golden glow — designed to stay beautiful through everyday life.',
    startingPrice: 160,
    badge: 'Popular',
    imageUrl: '/images/categories/Artificial Jewels.jpg',
    items: INITIAL_PRODUCTS.filter((p) => p.categoryId === 'artificial-jewels'),
  },
  {
    id: 'bows',
    name: 'Bows',
    count: 54,
    tagline: 'Satin ribbons, velvet bows & coquette clips',
    description: 'French satin and velvet statement bows with sturdy alligator clips.',
    startingPrice: 120,
    imageUrl: '/images/categories/Bows.jpg',
    items: INITIAL_PRODUCTS.filter((p) => p.categoryId === 'bows'),
  },
  {
    id: 'scrunchies',
    name: 'Scrunchies',
    count: 62,
    tagline: 'Silk, satin & velvet cloud scrunchies',
    description: 'Damage-free hair ties with a plush, premium finish.',
    startingPrice: 85,
    imageUrl: '/images/categories/Scrunchies.jpg',
    items: INITIAL_PRODUCTS.filter((p) => p.categoryId === 'scrunchies'),
  },
  {
    id: 'handbags',
    name: 'Handbags',
    count: 38,
    tagline: 'Quilted totes, clutches & mini bags',
    description: 'Structured vegan-leather bags with gold hardware and roomy interiors.',
    startingPrice: 99,
    imageUrl: '/images/categories/Hand Bags.jpg',
    items: INITIAL_PRODUCTS.filter((p) => p.categoryId === 'handbags'),
  },
  {
    id: 'earrings',
    name: 'Earrings',
    count: 74,
    tagline: 'Drops, hoops, studs & pearls',
    description: 'From dainty pearls to sculpted gold drops — earrings for every outfit.',
    startingPrice: 160,
    imageUrl: '/images/categories/Artificial Jewels.jpg',
    items: INITIAL_PRODUCTS.filter((p) => p.categoryId === 'earrings'),
  },
  {
    id: 'necklaces',
    name: 'Necklaces',
    count: 46,
    tagline: 'Chains, pendants & layered pieces',
    description: 'Delicate chains and radiant pendants with a warm golden finish.',
    startingPrice: 220,
    imageUrl: '/images/categories/Artificial Jewels.jpg',
    items: INITIAL_PRODUCTS.filter((p) => p.categoryId === 'necklaces'),
  },
  {
    id: 'bracelets',
    name: 'Bracelets',
    count: 40,
    tagline: 'Bangles, charm bracelets & cuffs',
    description: 'Polished bangles and delicate charms stacked for everyday shine.',
    startingPrice: 200,
    imageUrl: '/images/categories/Artificial Jewels.jpg',
    items: INITIAL_PRODUCTS.filter((p) => p.categoryId === 'bracelets'),
  },
  {
    id: 'rings',
    name: 'Rings',
    count: 32,
    tagline: 'Bands, solitaires & stacking rings',
    description: 'Signature gold rings crafted for effortless daily elegance.',
    startingPrice: 250,
    imageUrl: '/images/categories/Artificial Jewels.jpg',
    items: INITIAL_PRODUCTS.filter((p) => p.categoryId === 'rings'),
  },
];

/**
 * Hero slider slides for the homepage.
 * Each slide pairs a studio photograph with editorial copy.
 */
export interface HeroSlide {
  id: string;
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  subheading: string;
  image: string;
  tagline: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hair-accessories',
    eyebrow: 'Trendy · Cute · Everyday',
    headlineLine1: 'Hair',
    headlineLine2: 'Accessories',
    subheading: 'FOR EVERY STYLE, EVERY MOOD',
    image: '/images/hero/slider/Hair Accessories.png',
    tagline: 'Clips, headbands & pearl details',
  },
  {
    id: 'artificial-jewels',
    eyebrow: 'Elegant · Lustrous · Golden',
    headlineLine1: 'Artificial',
    headlineLine2: 'Jewellery',
    subheading: 'DESIGNED TO SHINE EVERY DAY',
    image: '/images/hero/slider/Artificial Jewels.png',
    tagline: 'Anti-tarnish everyday luxury',
  },
  {
    id: 'bows',
    eyebrow: 'Cute · Coquette · Charming',
    headlineLine1: 'Bows',
    headlineLine2: '& Ribbons',
    subheading: 'A LITTLE RIBBON, A LOT OF CHARM',
    image: '/images/hero/slider/Bows.png',
    tagline: 'Satin, velvet & pearl bows',
  },
  {
    id: 'scrunchies',
    eyebrow: 'Soft · Plush · Gentle',
    headlineLine1: 'Scrunchies',
    headlineLine2: 'that care',
    subheading: 'SILK-SOFT, TANGLE-FREE HOLD',
    image: '/images/hero/slider/Scrunchies.png',
    tagline: 'Silk, satin & velvet scrunchies',
  },
  {
    id: 'handbags',
    eyebrow: 'Chic · Structured · Everyday',
    headlineLine1: 'Hand',
    headlineLine2: 'Bags',
    subheading: 'QUILTED TOTES, CLUTCHES & MINI BAGS',
    image: '/images/hero/slider/Hand Bags.png',
    tagline: 'Totes, clutches & mini bags',
  },
  {
    id: 'key-chains',
    eyebrow: 'Playful · Cute · Unique',
    headlineLine1: 'Key',
    headlineLine2: 'Chains',
    subheading: 'LITTLE CHARMS FOR EVERYDAY CARRY',
    image: '/images/hero/slider/Key Chains.png',
    tagline: 'Charms that follow you everywhere',
  },
  {
    id: 'mobile-charms',
    eyebrow: 'Trendy · Quirky · Now',
    headlineLine1: 'Mobile',
    headlineLine2: 'Charms',
    subheading: 'CHARM YOUR PHONE YOUR WAY',
    image: '/images/hero/slider/Mobile Charms.png',
    tagline: 'Cute additions for your phone',
  },
  {
    id: 'mens-collection',
    eyebrow: 'Sharp · Classic · Essential',
    headlineLine1: 'Mens',
    headlineLine2: 'Collection',
    subheading: 'GROOMING & EVERYDAY ESSENTIALS',
    image: '/images/hero/slider/Mens Collection.png',
    tagline: 'Stylish essentials for him',
  },
  {
    id: 'stationery-gift-items',
    eyebrow: 'Gift · Joy · Treasure',
    headlineLine1: 'Stationery',
    headlineLine2: '& Gifts',
    subheading: 'THOUGHTFUL GIFTS, BEAUTIFULLY MADE',
    image: '/images/hero/slider/Stationery-Gift-Items.png',
    tagline: 'Little gifts that spark joy',
  },
];

export const STORE_CONFIG: StoreConfig = {
  storeName: 'MY B SHOPPY',
  storeTagline: 'STYLE • ACCESSORIES • YOU',
  logoText: 'MY B SHOPPY',
  currency: 'INR',
  currencySymbol: '₹',
  defaultCountry: 'India',
  availableCountries: ['India'],
  categories: CATEGORIES_CATALOG,
  supabase: {
    url: 'https://sdgpuyzwygyaxbmxikrp.supabase.co',
    publishableKey: 'sb_publishable_KzzkyPT3-dX7a74Fl-iwfg_miajjdsS',
    tableName: 'orders',
    productsTableName: 'products',
  },
  contact: {
    email: 'contact@mybshoppy.com',
    phone: '96002 05955',
    supportHours: 'Mon - Sat: 9:00 AM - 8:00 PM IST',
    address: 'Trichy, Tamil Nadu, India',
  },
};