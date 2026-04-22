import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, ShoppingCart, ArrowLeft, Plus, Minus, Check,
  ChevronRight, TrendingUp, TrendingDown, Package, Zap, Award, Shield
} from 'lucide-react';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

// ─── Star Rating ─────────────────────────────────────────────────────────────
const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-neo-black text-neo-black' : 'fill-transparent text-neo-black stroke-2'}`} />
    ))}
  </div>
);

// ─── Platform comparison table ────────────────────────────────────────────────
const PlatformRow = ({ name, price, isOurs, isCheapest }) => {
  const styles = {
    Amazon: { bg: '#FFD000', text: '#121212' },
    Flipkart: { bg: '#00F0FF', text: '#121212' },
    Temu: { bg: '#FF0073', text: '#FFFDF0' },
    PRISM: { bg: '#00E676', text: '#121212' },
  };
  const s = styles[name] || styles.PRISM;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center justify-between px-5 py-4 border-3 border-neo-black mb-3 ${isCheapest ? 'shadow-[4px_4px_0px_#00E676] bg-white' : 'bg-neo-bg shadow-[2px_2px_0px_#121212]'}`}
    >
      <div className="flex items-center gap-3">
        <span className="font-display font-bold uppercase tracking-widest px-2 py-1 border-2 border-neo-black text-[10px]" style={{ background: s.bg, color: s.text }}>{name}</span>
        {isCheapest && (
          <span className="font-display font-black text-xs uppercase text-neo-green">LOWEST IN MARKET</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {price ? (
          <span className="font-display font-black text-2xl tracking-tighter">
            ₹{price.toLocaleString('en-IN')}
          </span>
        ) : (
          <span className="font-neo text-sm font-bold opacity-50">N/A</span>
        )}
      </div>
    </motion.div>
  );
};

// ─── Algorithm Factor Pill ─────────────────────────────────────────────────────
const FactorPill = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-2 px-3 py-2 border-3 border-neo-black shadow-[2px_2px_0px_#121212] bg-white">
    <Icon className="w-4 h-4 text-neo-black" />
    <span className="font-neo text-xs font-bold uppercase">{label}</span>
    <span className="font-display font-black text-sm px-1" style={{ background: color }}>{value}×</span>
  </div>
);

// ─── Related Products ──────────────────────────────────────────────────────────
const RelatedProducts = ({ category, currentId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['related', category],
    queryFn: () => productService.getProductsByCategory(category, { limit: 8 }).then(r => r.data),
  });
  if (isLoading) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
  const products = data?.products?.filter(p => String(p.id) !== String(currentId)).slice(0, 4);
  if (!products?.length) return null;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
};

// ─── Main ProductDetail ────────────────────────────────────────────────────────
const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id).then(r => r.data),
  });

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  // ── Loading ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-1/2 aspect-square border-4 border-neo-black bg-neo-gray animate-pulse" />
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="h-4 bg-neo-black border-2 border-neo-black animate-pulse w-32" />
            <div className="h-16 bg-neo-black border-4 border-neo-black animate-pulse w-full" />
            <div className="h-6 bg-neo-pink border-2 border-neo-black animate-pulse w-1/2" />
            <div className="h-32 bg-neo-gray border-4 border-neo-black animate-pulse w-full mt-10" />
            <div className="h-16 bg-neo-cyan border-4 border-neo-black animate-pulse w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-6 border-4 border-neo-black mx-4 my-10 bg-neo-pink">
        <div className="w-20 h-20 bg-neo-yellow border-4 border-neo-black shadow-brutal flex items-center justify-center">
          <Package className="w-10 h-10 text-neo-black" />
        </div>
        <p className="font-display font-black text-3xl uppercase line-through decoration-neo-black decoration-4">404 NOT FOUND</p>
        <Link to="/shop" className="btn-neo-cyan px-8 py-3">BACK TO SHOP</Link>
      </div>
    );
  }

  const {
    title, description, category, images, rating, stock,
    basePrice, dynamicPrice, demandFactor, stockFactor, trustFactor,
    competitionFactor, discountPercent, maxQuantity, stockStatus, platform,
    competitorPrice,
  } = product;

  const saved = basePrice - dynamicPrice;

  // Build comparison table — the current product's platform is ours
  // Build comparison table — use actual variants passed from backend
  const comparisonData = product.variants ? product.variants.map(v => ({
    name: v.platform,
    price: v.platform === platform ? dynamicPrice : v.price,
    isOurs: v.platform === platform
  })) : [];
  const cheapestAmt = Math.min(...comparisonData.filter(c => c.price).map(c => c.price));

  return (
    <div className="bg-neo-bg min-h-screen border-t-4 border-neo-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 md:px-8 py-10 bg-white border-x-4 border-neo-black min-h-[90vh]"
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest mb-10 border-b-4 border-neo-black pb-4">
          <Link to="/shop" className="hover:bg-neo-black hover:text-white px-2 py-1 border-2 border-transparent transition-colors">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/shop?category=${category}`} className="hover:bg-neo-yellow px-2 py-1 border-2 border-transparent transition-colors">
            {category.replace(/-/g, ' ')}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="truncate max-w-[200px] border-b-2 border-neo-pink">{title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* ── Left: Images ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="w-full lg:w-[48%] space-y-6"
          >
            {/* Main image */}
            <div className="aspect-square border-4 border-neo-black bg-white shadow-brutal p-8 overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', bounce: 0.4 }}
                  src={images?.[activeImage] || images?.[0]}
                  alt={title}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </AnimatePresence>
            </div>

            {/* Thumbnails */}
            {images?.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className="w-24 h-24 shrink-0 transition-all border-3 border-neo-black bg-white p-2"
                    style={{
                      boxShadow: activeImage === i ? '4px 4px 0px 0px rgba(255,0,115,1)' : '2px 2px 0px 0px rgba(18,18,18,1)',
                      borderColor: activeImage === i ? '#FF0073' : '#121212'
                    }}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Right: Info ───────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', damping: 20, delay: 0.1 }}
            className="w-full lg:w-[52%] flex flex-col"
          >
            {/* Category & status */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="font-display font-black text-sm uppercase px-3 py-1 bg-neo-yellow border-2 border-neo-black shadow-brutal-sm">
                {category.replace(/-/g, ' ')}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 font-display font-black text-sm uppercase border-2 border-neo-black shadow-brutal-sm ${
                stockStatus === 'critical_stock' ? 'bg-red-500 text-white' :
                stockStatus === 'low_stock' ? 'bg-neo-orange text-neo-black' :
                'bg-neo-green text-neo-black'
              }`}>
                <Package className="w-4 h-4" />
                {stockStatus.replace('_', ' ')}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display font-black text-4xl md:text-5xl tracking-tighter leading-[0.95] mb-6 uppercase">
              {title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-8 border-y-3 border-neo-black py-4">
              <StarRating rating={rating} />
              <span className="font-display font-black text-lg bg-neo-pink text-white px-2 py-0.5">{rating}</span>
              <span className="font-neo font-bold text-sm bg-neo-black text-white px-2 py-1">{stock} UNITS LEFT</span>
            </div>

            {/* Description */}
            <p className="font-neo font-bold text-sm leading-relaxed mb-10 border-l-4 border-neo-cyan pl-4 bg-neo-bg p-4 shadow-[4px_4px_0px_0px_#121212]">
              {description}
            </p>

            {/* ── Pricing block ─── */}
            <div className="mb-10 bg-neo-yellow border-4 border-neo-black p-6 shadow-brutal-lg">
              <p className="font-neo font-bold text-xs uppercase mb-2 bg-white inline-block px-2 border-2 border-neo-black border-dashed">ALGORITHMIC RATE</p>
              <div className="flex items-end gap-6 mb-6">
                <span className="font-display font-black text-6xl tracking-tighter leading-none">
                  ₹{dynamicPrice.toLocaleString('en-IN')}
                </span>
                {basePrice !== dynamicPrice && (
                  <div className="flex flex-col items-start gap-1 pb-1">
                    <span className="font-display font-bold text-xl line-through decoration-neo-pink decoration-4 px-1">
                      ₹{basePrice.toLocaleString('en-IN')}
                    </span>
                    <span className="bg-neo-pink text-white font-display font-black px-2 py-0.5 border-2 border-neo-black">
                      -{discountPercent}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Algorithm factors */}
              <div className="flex flex-wrap gap-3">
                <FactorPill icon={TrendingUp} label="DEMAND" value={demandFactor} color="#FF5E00" />
                <FactorPill icon={Package} label="INVENTORY" value={stockFactor} color="#00F0FF" />
                {trustFactor && <FactorPill icon={Shield} label="TRUST" value={trustFactor} color="#FF0073" />}
                {competitionFactor && <FactorPill icon={Award} label="MARKET" value={competitionFactor} color="#00E676" />}
              </div>
            </div>

            {/* ── Platform Comparison ─── */}
            <div className="mb-10">
              <p className="font-display font-black text-xl uppercase mb-4 bg-neo-black text-white inline-block px-4 py-1 skew-x-[-10deg]">
                <span className="skew-x-[10deg] block">THE BATTLEGROUND</span>
              </p>
              <div className="flex flex-col">
                {comparisonData.map(c => (
                  <PlatformRow key={c.name} {...c} isCheapest={c.price === cheapestAmt && c.price !== null} />
                ))}
              </div>
            </div>

            {/* ── Quantity + Add to Cart ─── */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto border-4 border-neo-black p-4 bg-neo-bg">
              {/* Qty selector */}
              <div className="flex items-center bg-white border-3 border-neo-black">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-5 py-4 border-r-3 border-neo-black hover:bg-neo-black hover:text-white transition-colors"
                >
                  <Minus className="w-6 h-6" strokeWidth={3} />
                </button>
                <span className="w-16 text-center font-display font-black text-2xl">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(maxQuantity || 10, quantity + 1))}
                  disabled={quantity >= (maxQuantity || 10)}
                  className="px-5 py-4 border-l-3 border-neo-black hover:bg-neo-black hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-neo-black"
                >
                  <Plus className="w-6 h-6" strokeWidth={3} />
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-3 font-display font-black text-xl uppercase border-3 border-neo-black shadow-brutal transition-all active:translate-y-1 active:translate-x-1 active:shadow-brutal-sm ${
                  added ? 'bg-neo-green text-neo-black' : 'bg-neo-cyan text-neo-black'
                }`}
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span key="added" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                      <Check className="w-6 h-6" strokeWidth={3} /> ADDED
                    </motion.span>
                  ) : (
                    <motion.span key="add" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                      <ShoppingCart className="w-6 h-6" strokeWidth={3} /> ACQUIRE NOW
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </motion.div>
        </div>

        {/* ── Related Products ───────────────────────────────── */}
        <section className="mt-24 border-t-6 border-neo-black pt-16 border-dashed">
          <div className="flex items-center gap-3 mb-10">
            <h2 className="font-display font-black text-4xl uppercase tracking-tighter bg-neo-pink text-white px-4 py-2 rotate-[-1deg]">
              SIMILAR ASSETS
            </h2>
          </div>
          <RelatedProducts category={category} currentId={id} />
        </section>
      </motion.div>
    </div>
  );
};

export default ProductDetail;
