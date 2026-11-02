import { useQuery } from '@tanstack/react-query';
import { getProductByIdOrSlug, getRelatedProducts, getProductImage, productReadPolicy, productImagePolicy } from '../lib/productQueries';
import { ProductImage } from '../components/ProductImage';
import React, { useCallback, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  Star,
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { GoldBand } from '../components/GoldBand';
import { GoldFrame } from '../components/GoldFrame';
import { STORE_CONFIG } from '../storeConfig';
import { useStore } from '../context/StoreContext';
import { useSeo } from '../lib/seo';

const formatPrice = (price: number) => price.toLocaleString('en-IN');

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const navigateToProduct = useCallback((product: { id: string }) => navigate(`/product/${product.id}`), [navigate]);
  const { subcategories, wishlistIds, toggleWishlist, addToCart, openDirectCheckout } = useStore();

  const detail = useQuery({ ...productReadPolicy, queryKey: ['products', 'detail', id],
    queryFn: ({ signal }) => getProductByIdOrSlug(id!, signal), enabled: !!id });
  const product = detail.data;
  const productImage = useQuery({ ...productImagePolicy, queryKey: ['products', 'image', product?.imageProductId],
    queryFn: ({ signal }) => getProductImage(product!.imageProductId!, signal), enabled: !!product?.imageProductId });
  const related = useQuery({ ...productReadPolicy, queryKey: ['products', 'related', product?.id, product?.categoryId],
    queryFn: ({ signal }) => getRelatedProducts(product!, signal), enabled: !!product });

  const productSubcategory = useMemo(() => {
    if (!product) return undefined;
    const name = product.subcategory?.trim().toLowerCase();
    return (
      subcategories.find((subcategory) => subcategory.id === product.subcategoryId) ||
      subcategories.find(
        (subcategory) =>
          subcategory.categoryId === product.categoryId &&
          !!name &&
          (subcategory.name.trim().toLowerCase() === name ||
            subcategory.slug.trim().toLowerCase() === name)
      )
    );
  }, [product, subcategories]);

  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useSeo({
    title: product ? product.name : 'Product',
    description: product?.subtitle || product?.description,
    path: `/product/${id || ''}`,
    image: product?.imageUrl || productImage.data,
  });

  const relatedProducts = related.data || [];

  const activeVariant = selectedVariant || product?.variants[0] || 'Standard';

  if (detail.isPending) return <div className="py-20 text-center text-[#6B5945]" role="status">Loading product...</div>;
  if (detail.error) return <div className="py-20 text-center text-[#6B5945]" role="alert">Product could not be loaded. <button onClick={() => detail.refetch()}>Try again</button></div>;
  if (!product) {
    return (
      <div className="products-page max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-24 text-center space-y-5">
        <PackageCheck className="w-12 h-12 text-[#B8860B]/50 mx-auto" />
        <h1 className="font-display text-3xl font-medium text-[#241A12]">Product Not Found</h1>
        <p className="text-sm text-[#6B5945] max-w-md mx-auto">
          This piece may have sold out or been moved to another collection.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#111111] hover:bg-[#241A12] text-[#F4D99B] font-semibold text-[12px] uppercase tracking-[0.22em] transition-all hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlistIds.includes(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="products-page">
      {/* Breadcrumb strip */}
      <div className="border-b border-[#D8A83E]/30 bg-[#FAF1DD]">
        <nav className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 min-h-12 py-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-[#6B5945]">
          <Link to="/" className="hover:text-[#B8860B] transition whitespace-nowrap">Home</Link>
          <span className="text-[#B8860B]/60">/</span>
          <Link to="/categories" className="hover:text-[#B8860B] transition whitespace-nowrap">Categories</Link>
          <span className="text-[#B8860B]/60">/</span>
          <Link
            to={`/categories/${product.categoryId}`}
            className="hover:text-[#B8860B] transition whitespace-nowrap"
          >
            {product.category}
          </Link>
          {productSubcategory && (
            <>
              <span className="text-[#B8860B]/60">/</span>
              <Link
                to={`/categories/${product.categoryId}/${productSubcategory.slug}`}
                className="hover:text-[#B8860B] transition whitespace-nowrap"
              >
                {productSubcategory.name}
              </Link>
            </>
          )}
          <span className="text-[#B8860B]/60">/</span>
          <span className="text-[#B8860B] font-bold break-words">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Left: Image */}
          <div className="space-y-4">
            <div
              key={product.id}
              className="product-image-zoom relative rounded-[28px] overflow-hidden border border-[#D8A83E]/40 bg-[#F8ECD0]"
              onPointerMove={(event) => {
                if (event.pointerType === 'touch') return;
                const bounds = event.currentTarget.getBoundingClientRect();
                const x = Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100));
                const y = Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100));
                event.currentTarget.style.setProperty('--zoom-x', `${x}%`);
                event.currentTarget.style.setProperty('--zoom-y', `${y}%`);
              }}
              onPointerLeave={(event) => {
                event.currentTarget.style.removeProperty('--zoom-x');
                event.currentTarget.style.removeProperty('--zoom-y');
              }}
            >
              <ProductImage
                product={selectedImage && product.imageUrls?.includes(selectedImage) ? {...product,imageUrl:selectedImage} : product} priority
                alt={product.name}
                className="w-full aspect-square object-contain object-center"
              />
              {product.inStock === false ? (
                <span className="absolute top-4 left-4 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-rose-950/85 text-rose-200 border border-rose-400/50 backdrop-blur-sm">
                  Sold Out
                </span>
              ) : (
                product.badge && (
                  <span className="absolute top-4 left-4 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#241A12]/85 text-[#E8C875] border border-[#E8C875]/60 backdrop-blur-sm">
                    {product.badge}
                  </span>
                )
              )}
              {discountPercent > 0 && (
                <span className="absolute top-4 right-4 text-xs font-extrabold px-2.5 py-1 rounded-full bg-rose-600/90 text-white shadow-lg">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {(product.imageUrls?.length || 0) > 1 && <div className="flex gap-2 overflow-x-auto" aria-label="Product images">{product.imageUrls!.map((url,index)=><button type="button" key={url} onClick={()=>setSelectedImage(url)} aria-label={`View image ${index+1}`} aria-pressed={(selectedImage || product.imageUrls![0])===url} className="shrink-0 rounded-lg border border-[#D8A83E] overflow-hidden"><img src={url} alt="" className="w-16 h-16 object-cover" loading="lazy" /></button>)}</div>}
            {/* Assurance row removed */}
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Link
                to={`/categories/${product.categoryId}`}
                className="inline-block text-[11px] font-bold uppercase tracking-[0.24em] text-[#B8860B] hover:text-[#8A6A15] transition-colors"
              >
                {product.category}
              </Link>

              <h1 className="font-display font-medium text-[#241A12] leading-tight" style={{ fontSize: 'clamp(34px, 4.4vw, 52px)' }}>
                {product.name}
              </h1>

              {product.subtitle && (
                <p className="text-sm text-[#6B5945] leading-relaxed">{product.subtitle}</p>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.rating)
                          ? 'fill-[#D8A83E] text-[#D8A83E]'
                          : 'text-[#E8C875]/40'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#6B5945]">
                  <span className="text-[#241A12] font-bold">{product.rating.toFixed(1)}</span> ·{' '}
                  {product.reviewsCount} reviews
                </span>
              </div>
            </div>

            {/* Price block */}
            <div className="space-y-4">
              <div className="flex items-baseline gap-3 pb-6 border-b border-[#D8A83E]/30">
                <span className="font-display font-bold text-[#241A12] font-mono" style={{ fontSize: 'clamp(30px, 3.4vw, 40px)' }}>
                  ₹{formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-[#6B5945]/70 line-through font-mono">
                      ₹{formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wide">
                      Save ₹{formatPrice(product.originalPrice - product.price)}
                    </span>
                  </>
                )}
              </div>
              {product.description && (
                <p className="text-sm sm:text-[15px] text-[#3d2f1a]/90 leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-[11px] font-black uppercase tracking-[0.24em] text-[#B8860B]">
                  Select Variant
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((variant) => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                        activeVariant === variant
                          ? 'border-[#B8860B] text-[#B8860B] bg-[#D8A83E]/10 shadow-[0_0_8px_rgba(184,134,11,0.25)]'
                          : 'border-[#6B5945]/35 text-[#6B5945] hover:border-[#B8860B] hover:text-[#241A12]'
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Actions */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-[11px] font-black uppercase tracking-[0.24em] text-[#B8860B]">
                  Quantity
                </span>
                <div className="flex items-center bg-[#FFFDF6] border border-[#6B5945]/30 rounded-full overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="p-2.5 text-[#6B5945] hover:text-[#B8860B] hover:bg-[#FAF1DD] transition cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold font-mono text-[#241A12] select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    aria-label="Increase quantity"
                    className="p-2.5 text-[#6B5945] hover:text-[#B8860B] hover:bg-[#FAF1DD] transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`ml-auto flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                    isWishlisted
                      ? 'border-rose-500 text-rose-500 bg-rose-500/10'
                      : 'border-[#6B5945]/35 text-[#6B5945] hover:text-[#B8860B] hover:border-[#B8860B]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                  <span className="hidden sm:inline">
                    {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                  </span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={() => addToCart(product, activeVariant, quantity)}
                  disabled={product.inStock === false}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#111111] hover:bg-[#241A12] text-[#F4D99B] font-semibold text-[12px] sm:text-[13px] uppercase tracking-[0.22em] shadow-[0_18px_36px_-14px_rgba(17,17,17,0.5)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-[#111111] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {product.inStock === false ? 'Sold Out' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => openDirectCheckout(product, activeVariant, quantity)}
                  disabled={product.inStock === false}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border-2 border-[#B8860B] hover:bg-[#B8860B] text-[#B8860B] hover:text-white font-semibold text-[12px] sm:text-[13px] uppercase tracking-[0.22em] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#B8860B] cursor-pointer"
                >
                  <Banknote className="w-4 h-4" />
                  {product.inStock === false ? 'Sold Out' : 'Order Now'}
                </button>
              </div>

              {product.inStock === false && (
                <p className="flex items-center gap-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-full px-3 py-2 w-fit">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  This piece is currently out of stock. Please check back later.
                </p>
              )}
            </div>

            {/* Meta details */}
            <div className="pt-6 border-t border-[#D8A83E]/30 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
              {[
                ['Material', product.material],
                ['Stone / Accent', product.stone],
                ['Category', product.category],
                ['Availability', product.inStock === false ? 'Sold Out' : 'In Stock'],
              ]
                .filter(([, value]) => !!value)
                .map(([label, value]) => (
                  <div key={label as string} className="flex items-center gap-2">
                    <span className="text-[#6B5945]/80 uppercase tracking-wider font-bold text-[10px]">
                      {label}:
                    </span>
                    <span className="text-[#241A12] font-semibold">{value}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Description panel removed as requested */}

        {/* Related products — warm champagne section alternating with the cream detail above */}
        {relatedProducts.length > 0 && (
          <section className="relative bg-gold-soft border-y border-[#D8A83E]/30 overflow-hidden mt-16">
            <div className="absolute -top-24 right-1/4 w-96 h-96 bg-white/50 rounded-full blur-[110px] pointer-events-none"></div>
            <div className="absolute -bottom-32 left-1/5 w-80 h-80 bg-[#E8C875]/40 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative py-14 space-y-7">
              <div className="flex items-end justify-between gap-4 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
                <h2 className="font-display font-medium text-[#241A12]" style={{ fontSize: 'clamp(28px, 3.6vw, 42px)' }}>
                  You May Also <em className="not-italic text-gold-gradient">Love</em>
                </h2>
                <Link
                  to={`/categories/${product.categoryId}?view=products`}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#B8860B] hover:text-[#8A6A15] transition-colors"
                >
                  More From {product.category}
                </Link>
              </div>

              <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
                <GoldFrame className="max-w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                    {relatedProducts.map((rel) => (
                      <ProductCard
                        key={rel.id}
                        product={rel}
                        currencySymbol={STORE_CONFIG.currencySymbol}
                        isWishlisted={wishlistIds.includes(rel.id)}
                        onToggleWishlist={toggleWishlist}
                        onAddToCart={addToCart}
                        onQuickView={navigateToProduct}
                      />
                    ))}
                  </div>
                </GoldFrame>
              </div>
            </div>
          </section>
        )}

        {/* Back link */}
        <div className="mt-14 pb-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#6B5945] hover:text-[#B8860B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Products
          </Link>
        </div>
      </div>

      {/* Closing band — alternates with the cream product detail above */}
      <GoldBand
        eyebrow="Convenient Checkout"
        title="Complete Your Look Today"
        text="Pair it with matching pieces from the collection — gift-wrapped, wear-tested and delivered to your door."
        primaryCta={{ label: 'Back to Shop', path: '/shop' }}
        secondaryCta={{ label: 'Need Help?', path: '/contact' }}
      />
    </div>
  );
};
