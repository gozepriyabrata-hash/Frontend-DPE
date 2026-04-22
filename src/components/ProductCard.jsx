import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, TrendingDown, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const PLATFORM_STYLES = {
  Amazon: { bg: '#FFD000', text: '#121212' },
  Flipkart: { bg: '#00F0FF', text: '#121212' },
  Temu: { bg: '#FF0073', text: '#FFFDF0' },
  PRISM: { bg: '#00E676', text: '#121212' },
};

const StarRating = ({ rating }) => {
  const stars = [];
  const full = Math.floor(rating);
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i < full ? 'fill-neo-black text-neo-black' : 'fill-transparent text-neo-black stroke-2'}`}
      />
    );
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
};

const ProductCard = forwardRef(({ product }, ref) => {
  const { addToCart } = useCart();
  const {
    id,
    title,
    thumbnail,
    rating,
    basePrice,
    dynamicPrice,
    discountPercent,
    stockStatus,
    platform,
    competitionFactor,
  } = product;

  const platformStyle = PLATFORM_STYLES[platform] || PLATFORM_STYLES.PRISM;
  const isBestDeal = competitionFactor === 1.05; // We're the cheapest
  const isPriceDrop = discountPercent > 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card-neo-interactive flex flex-col group relative"
    >
      {/* Image */}
      <Link to={`/product/${id}`} className="relative block border-b-4 border-neo-black aspect-[4/3] bg-neo-gray overflow-hidden">
        <motion.img
          src={thumbnail}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover mix-blend-multiply"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isBestDeal && (
            <div className="bg-neo-yellow border-3 border-neo-black px-2 py-1 flex items-center gap-1 font-display font-black text-[10px] uppercase shadow-brutal-sm">
              <Zap className="w-3 h-3 fill-neo-black" /> Best Deal
            </div>
          )}
          {isPriceDrop && (
            <div className="bg-neo-pink text-white border-3 border-neo-black px-2 py-1 flex items-center gap-1 font-display font-black text-[10px] uppercase shadow-brutal-sm">
              <TrendingDown className="w-3 h-3" /> -{discountPercent}%
            </div>
          )}
        </div>

        {/* Stock */}
        <div className={`absolute bottom-3 right-3 px-2 py-1 border-3 border-neo-black font-display font-black text-[10px] uppercase shadow-brutal-sm ${
          stockStatus === 'critical_stock' ? 'bg-red-500 text-white' :
          stockStatus === 'low_stock' ? 'bg-neo-orange text-neo-black' :
          'bg-neo-green text-neo-black'
        }`}>
          {stockStatus === 'critical_stock' ? 'Critical' : stockStatus === 'low_stock' ? 'Low Stock' : 'In Stock'}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow p-4 bg-neo-bg">
        {/* Platform badge */}
        <div className="mb-2">
          <span
            className="inline-flex px-2 py-0.5 border-2 border-neo-black font-display font-bold text-[10px] uppercase shadow-[2px_2px_0px_#121212]"
            style={{ background: platformStyle.bg, color: platformStyle.text }}
          >
            {platform}
          </span>
        </div>

        <Link to={`/product/${id}`} className="block mb-3">
          <h3 className="font-neo font-bold text-sm leading-snug line-clamp-2 text-neo-black underline decoration-transparent group-hover:decoration-neo-black transition-colors">
            {title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <StarRating rating={rating} />
          <span className="text-[11px] font-bold font-neo border-b-2 border-neo-black">{rating} / 5</span>
        </div>

        {/* Price + Cart */}
        <div className="mt-auto flex items-end justify-between gap-3 border-t-3 border-neo-black pt-4">
          <div>
            {basePrice !== dynamicPrice && (
              <p className="text-[11px] font-bold line-through decoration-neo-pink decoration-2 mb-0.5">₹{basePrice.toLocaleString('en-IN')}</p>
            )}
            <p className="font-display font-black text-2xl tracking-tight">₹{dynamicPrice.toLocaleString('en-IN')}</p>
          </div>

          <button
            onClick={(e) => { e.preventDefault(); addToCart(product); }}
            className="w-12 h-12 bg-neo-cyan border-3 border-neo-black flex items-center justify-center shadow-brutal transition-all active:shadow-brutal-sm active:translate-y-1 active:translate-x-1"
            aria-label={`Add ${title} to cart`}
          >
            <ShoppingCart className="w-5 h-5 text-neo-black" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;
