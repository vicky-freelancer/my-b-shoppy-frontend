import { StoreConfig, ProductCategory, ProductItem } from './types';

/**
 * ============================================================================
 * 🏪 my B shoppy - STORE CONFIGURATION & PRODUCT DATABASE
 * ============================================================================
 * Luxury e-commerce catalog featuring real Supabase synchronization,
 * 9 curated categories, materials/stone filtering, and Cash on Delivery order flow.
 * ============================================================================
 */

export const INITIAL_PRODUCTS: ProductItem[] = [
  // 1. The Solstice Ring (Screenshot Hero)
  {
    id: "solstice-ring",
    name: "The Solstice Ring",
    subtitle: "Emerald-cut solitaire diamond set in 18K solid yellow gold band",
    price: 4200,
    originalPrice: 4800,
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    category: "Artificial Jewels",
    categoryId: "artificial-jewels",
    badge: "EXCLUSIVE",
    rating: 5.0,
    reviewsCount: 12,
    material: "18K Gold",
    stone: "Diamond",
    variants: ["Size 6", "Size 7", "Size 8", "Custom Fit"],
    description: "An extraordinary heirloom emerald-cut radiant center stone framed in a heavy-gauge 18K yellow gold prong basket. Timeless luxury engineered for modern everyday distinction.",
    inStock: true
  },
  // 2. Midnight Tear Necklace (Screenshot Hero)
  {
    id: "midnight-tear-necklace",
    name: "Midnight Tear Necklace",
    subtitle: "Deep sapphire teardrop pendant on micro-faceted platinum chain",
    price: 8500,
    originalPrice: 9200,
    imageUrl: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80",
    category: "Artificial Jewels",
    categoryId: "artificial-jewels",
    badge: "NEW",
    rating: 4.9,
    reviewsCount: 18,
    material: "Platinum",
    stone: "Sapphire",
    variants: ["16-inch Choker", "18-inch Classic", "20-inch Opera"],
    description: "Capturing the serene mystery of midnight skies, this pear-cut sapphire is accented with a pavé halo and suspended from a hand-polished chain.",
    inStock: true
  },
  // 3. Aura Gold Cuff (Screenshot Hero)
  {
    id: "aura-gold-cuff",
    name: "Aura Gold Cuff",
    subtitle: "Artisan hammered texture with reflective high-shine inner curve",
    price: 12000,
    originalPrice: 13500,
    imageUrl: "https://images.unsplash.com/photo-1611591475155-42e4fdb8885c?auto=format&fit=crop&w=800&q=80",
    category: "Artificial Jewels",
    categoryId: "artificial-jewels",
    badge: "NEW",
    rating: 5.0,
    reviewsCount: 10,
    material: "18K Gold",
    stone: "Cubic Zirconia",
    variants: ["Small (5.5\")", "Medium (6.5\")", "Large (7.5\")"],
    description: "Meticulously hand-forged and hammered to catch ambient lighting from every angle. Flexible open cuff architecture contours effortlessly to the wrist.",
    inStock: true
  },
  // 4. Starlight Drops (Screenshot Hero)
  {
    id: "starlight-drops",
    name: "Starlight Drops",
    subtitle: "Cascading chandelier earrings with multi-cut lab diamonds",
    price: 22400,
    originalPrice: 24000,
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    category: "Artificial Jewels",
    categoryId: "artificial-jewels",
    rating: 4.9,
    reviewsCount: 25,
    material: "Platinum",
    stone: "Diamond",
    variants: ["Platinum Finish", "18K Yellow Gold Backing", "Rose Gold Backing"],
    description: "Architectural drop earrings featuring round brilliant, marquise, and pear cut diamonds that flow like celestial light waterfalls.",
    inStock: true
  },
  // 5. Obsidian Chronograph (Screenshot Hero)
  {
    id: "obsidian-chronograph",
    name: "Obsidian Chronograph",
    subtitle: "Skeleton automatic movement in matte forged titanium casing",
    price: 35000,
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    category: "Mens Collection",
    categoryId: "mens-collection",
    rating: 5.0,
    reviewsCount: 8,
    material: "Stainless Steel",
    variants: ["Matte Black Ceramic Strap", "Vulcanized Rubber Strap", "Titanium Mesh"],
    description: "Ultra-precise 28,800 vph skeletonized movement protected by anti-reflective sapphire crystal glass and 100m water resistance.",
    inStock: true
  },
  // 6. Crimson Thread Bracelet (Screenshot Hero)
  {
    id: "crimson-thread-bracelet",
    name: "Crimson Thread Bracelet",
    subtitle: "Dainty rose gold ball chain with faceted ruby bead stations",
    price: 3800,
    originalPrice: 4200,
    imageUrl: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
    category: "Artificial Jewels",
    categoryId: "artificial-jewels",
    rating: 4.8,
    reviewsCount: 14,
    material: "Rose Gold",
    stone: "Ruby",
    variants: ["Adjustable 6-8 inch", "Fixed 7 inch clasp"],
    description: "A talisman of passion and strength. Delicate rose gold links intertwined with vivid pigeon-blood ruby beads.",
    inStock: true
  },
  // 7. Pearl Bloom Hair Claw (Screenshot Hero)
  {
    id: "pearl-bloom-hair-claw",
    name: "Pearl Bloom Hair Claw",
    subtitle: "Carved mother-of-pearl blossom on 18K gold-tone grip",
    price: 650,
    originalPrice: 850,
    imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80",
    category: "Hair Accessories",
    categoryId: "hair-accessories",
    rating: 5.0,
    reviewsCount: 37,
    material: "18K Gold",
    stone: "Pearl",
    variants: ["Opal White Pearl", "Golden Champagne", "Smoky Charcoal"],
    description: "Designed for all hair volumes. Features dual tension spring technology that holds locks securely without tugging or scalp fatigue.",
    inStock: true
  },
  // 8. Silk Luxe Scrunchie (Screenshot Hero)
  {
    id: "silk-luxe-scrunchie",
    name: "Silk Luxe Scrunchie",
    subtitle: "100% 22-Momme Mulberry Silk in obsidian midnight tone",
    price: 250,
    originalPrice: 320,
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    category: "Scrunchies",
    categoryId: "scrunchies",
    rating: 4.9,
    reviewsCount: 29,
    material: "Silk / Satin",
    variants: ["Obsidian Noir", "Champagne Gold", "Pearl Blush", "Emerald Forest"],
    description: "Zero-frizz, zero hair-crease hair elastic that preserves hair moisture while keeping updos structured and effortless.",
    inStock: true
  },
  // 9. Velvet Pearl Bow (Screenshot Hero)
  {
    id: "velvet-pearl-bow",
    name: "Velvet Pearl Bow",
    subtitle: "Heavyweight French velvet bow studded with micro faux pearls",
    price: 450,
    originalPrice: 580,
    imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
    category: "Bows",
    categoryId: "bows",
    rating: 4.8,
    reviewsCount: 21,
    material: "Silk / Satin",
    stone: "Pearl",
    variants: ["Midnight Black", "Burgundy Wine", "Ivory Cream"],
    description: "The quintessential coquette statement. Hand-assembled French plush velvet tails embellished with secure miniature pearls.",
    inStock: true
  },
  // 10. Golden Bow Mobile Charm (Screenshot Hero)
  {
    id: "golden-bow-mobile-charm",
    name: "Golden Bow Mobile Charm",
    subtitle: "Cast brass ribbon bow with baroque freshwater drop pearl",
    price: 350,
    originalPrice: 450,
    imageUrl: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80",
    category: "Mobile Charms",
    categoryId: "mobile-charms",
    rating: 4.9,
    reviewsCount: 33,
    material: "18K Gold",
    stone: "Pearl",
    variants: ["Golden Bow + Pearl", "Silver Bow + Pearl", "Rose Gold Bow + Pearl"],
    description: "Reinforced 50lb tensile wrist loop. Elevates your phone case into a fine jewelry accessory.",
    inStock: true
  },
  // 11. Royal Loop Key Chain (Screenshot Hero)
  {
    id: "royal-loop-key-chain",
    name: "Royal Loop Key Chain",
    subtitle: "Woven genuine leather braided loop with gold clover charm",
    price: 400,
    originalPrice: 520,
    imageUrl: "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=800&q=80",
    category: "Key Chains",
    categoryId: "key-chains",
    rating: 4.8,
    reviewsCount: 16,
    material: "Leather",
    variants: ["Jet Black Leather", "Cognac Tan Leather", "Oxblood Red"],
    description: "Heavy-duty screw-lock shackle and braided leather cord built to endure daily pocket travel in style.",
    inStock: true
  },
  // 12. Classic Quilted Bag (Screenshot Hero)
  {
    id: "classic-quilted-bag",
    name: "Classic Quilted Bag",
    subtitle: "Diamond quilted vegan calfskin with 18K gold turnlock",
    price: 2850,
    originalPrice: 3400,
    imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    category: "Hand Bags",
    categoryId: "hand-bags",
    badge: "BESTSELLER",
    rating: 5.0,
    reviewsCount: 19,
    material: "Leather",
    variants: ["Noir Black", "Crème Ivory", "Emerald Green", "Camel Tan"],
    description: "Iconic structured silhouette with woven chain strap that transitions seamlessly from shoulder drape to crossbody.",
    inStock: true
  },
  // 13. Emerald Solitaire Studs
  {
    id: "emerald-solitaire-studs",
    name: "Royal Emerald Cut Studs",
    subtitle: "Deep Colombian green hydrothermal emeralds with halo pave",
    price: 2600,
    originalPrice: 3100,
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    category: "Artificial Jewels",
    categoryId: "artificial-jewels",
    rating: 4.9,
    reviewsCount: 15,
    material: "18K Gold",
    stone: "Emerald",
    variants: ["Yellow Gold Prong", "White Gold Prong"],
    description: "Vibrant and intense green hue with precision facet cutting that radiates elegance.",
    inStock: true
  },
  // 14. Wax Seal Botanical Kit
  {
    id: "wax-seal-botanical-kit",
    name: "Vintage Wax Seal Gift Set",
    subtitle: "Solid carved brass stamp with melting spoon & scented wax pearls",
    price: 320,
    originalPrice: 420,
    imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80",
    category: "Stationery & Gift Items",
    categoryId: "stationery-gift-items",
    badge: "GIFT SET",
    rating: 5.0,
    reviewsCount: 42,
    material: "Stainless Steel",
    variants: ["Tree of Life", "Floral Monogram", "Celestial Sun"],
    description: "Craft personalized letters, journal entries, and gift wrapping with ancient wax sealing rituals.",
    inStock: true
  },
  // 15. Mens Titanium Signet Ring
  {
    id: "mens-titanium-signet",
    name: "Aegis Black Onyx Signet Ring",
    subtitle: "Surgical grade 316L stainless steel with inlaid natural black onyx",
    price: 850,
    originalPrice: 1100,
    imageUrl: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80",
    category: "Mens Collection",
    categoryId: "mens-collection",
    rating: 4.9,
    reviewsCount: 23,
    material: "Stainless Steel",
    variants: ["Size 9", "Size 10", "Size 11", "Size 12"],
    description: "Brushed finish comfort-fit ring resistant to scratches, sweat, and tarnishing.",
    inStock: true
  }
];

export const CATEGORIES_CATALOG: ProductCategory[] = [
  {
    id: "hair-accessories",
    name: "Hair Accessories",
    count: 120,
    tagline: "Clips, luxury claw clips, headbands & barrettes",
    description: "Handcrafted hair clips, pearled barrettes, and durable non-slip claws.",
    startingPrice: 250,
    imageUrl: "/Hair%20Accessories.jpeg",
    items: INITIAL_PRODUCTS.filter(p => p.categoryId === 'hair-accessories')
  },
  {
    id: "artificial-jewels",
    name: "Artificial Jewels",
    count: 248,
    tagline: "18K gold-plated & gemstone statement pieces",
    description: "Anti-tarnish, water-resistant everyday necklaces, dainty bracelets, and rings.",
    startingPrice: 2600,
    badge: "Popular",
    imageUrl: "/Artificial%20Jewels.jpg",
    items: INITIAL_PRODUCTS.filter(p => p.categoryId === 'artificial-jewels')
  },
  {
    id: "bows",
    name: "Bows",
    count: 86,
    tagline: "Satin ribbons, French oversized clip bows & coquette",
    description: "French satin and organza statement bows with sturdy alligator clips.",
    startingPrice: 450,
    imageUrl: "/Bows.jpg",
    items: INITIAL_PRODUCTS.filter(p => p.categoryId === 'bows')
  },
  {
    id: "scrunchies",
    name: "Scrunchies",
    count: 72,
    tagline: "100% Pure Mulberry silk & organza cloud scrunchies",
    description: "Damage-prevention hair ties engineered with gentle inner elastic.",
    startingPrice: 250,
    imageUrl: "/Scrunchies.jpg",
    items: INITIAL_PRODUCTS.filter(p => p.categoryId === 'scrunchies')
  },
  {
    id: "mobile-charms",
    name: "Mobile Charms",
    count: 64,
    tagline: "Aesthetic beaded phone straps, wristlet chains & charms",
    description: "Heavy-duty nylon core straps with Y2K beads, freshwater pearls, and cute charms.",
    startingPrice: 350,
    imageUrl: "/Mobile%20Charms.jpg",
    items: INITIAL_PRODUCTS.filter(p => p.categoryId === 'mobile-charms')
  },
  {
    id: "key-chains",
    name: "Key Chains",
    count: 58,
    tagline: "Custom initial tags, cute bag charms & leather braids",
    description: "Sturdy alloy key rings paired with custom artisan charms and vegan leather straps.",
    startingPrice: 400,
    imageUrl: "/Key%20Chains.jpg",
    items: INITIAL_PRODUCTS.filter(p => p.categoryId === 'key-chains')
  },
  {
    id: "stationery-gift-items",
    name: "Stationery & Gift Items",
    count: 96,
    tagline: "Vintage wax seal kits, journaling essentials & gift sets",
    description: "Artisan bullet journals, brass bookmarks, wax stamp kits, and luxury gifts.",
    startingPrice: 320,
    imageUrl: "/Stationery%20%26%20Gift%20Items.jpg",
    items: INITIAL_PRODUCTS.filter(p => p.categoryId === 'stationery-gift-items')
  },
  {
    id: "mens-collection",
    name: "Mens Collection",
    count: 68,
    tagline: "Cuban links, signet rings, timepieces & bead bracelets",
    description: "Masculine essentials engineered from corrosion-free titanium and stainless steel.",
    startingPrice: 850,
    imageUrl: "/Mens%20Collection.jpg",
    items: INITIAL_PRODUCTS.filter(p => p.categoryId === 'mens-collection')
  },
  {
    id: "hand-bags",
    name: "Hand Bags",
    count: 42,
    tagline: "Structured crossbody bags, quilted shoulder totes & clutches",
    description: "Premium vegan leather handbags with gold hardware and roomy interiors.",
    startingPrice: 2850,
    badge: "Must Have",
    imageUrl: "/Handbags.jpg",
    items: INITIAL_PRODUCTS.filter(p => p.categoryId === 'hand-bags')
  }
];

export const STORE_CONFIG: StoreConfig = {
  storeName: "my B shoppy",
  storeTagline: "Trendy. Affordable. Yours.",
  logoText: "my B shoppy",
  currency: "INR",
  currencySymbol: "₹",
  defaultCountry: "India",
  availableCountries: [
    "India",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "United Arab Emirates",
    "Saudi Arabia",
    "Germany",
    "France",
    "Singapore"
  ],
  categories: CATEGORIES_CATALOG,
  supabase: {
    url: "https://sdgpuyzwygyaxbmxikrp.supabase.co",
    publishableKey: "sb_publishable_KzzkyPT3-dX7a74Fl-iwfg_miajjdsS",
    tableName: "orders",
    productsTableName: "products"
  },
  contact: {
    email: "contact@mybshoppy.com",
    phone: "+1 (800) 888-2746",
    supportHours: "Mon - Sat: 9:00 AM - 8:00 PM EST",
    address: "First floor, Basuvaraj building, 8th cross, Thillai nagar main road, Trichy - 620018"
  }
};
