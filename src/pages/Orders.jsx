import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { orderService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, History, ChevronRight, ShoppingBag,
  Calendar, AlertCircle, Zap, ArrowRight
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const map = {
    pending: { color: '#121212', bg: '#FFD000', label: 'PENDING' },
    processing: { color: '#121212', bg: '#00F0FF', label: 'PROCESSING' },
    shipped: { color: '#FFFDF0', bg: '#FF0073', label: 'SHIPPED' },
    delivered: { color: '#121212', bg: '#00E676', label: 'DELIVERED' },
    cancelled: { color: '#FFFDF0', bg: '#FF5E00', label: 'CANCELLED' },
  };
  const s = map[status?.toLowerCase()] || map.pending;
  return (
    <span className="font-display font-black text-[10px] uppercase tracking-widest px-2 py-0.5 border-2 border-neo-black shadow-[2px_2px_0px_#121212]"
      style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
};

const Orders = () => {
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderService.getMyOrders().then(res => res.data),
  });

  // ── Loading ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <div className="h-16 bg-neo-gray border-4 border-neo-black animate-pulse w-64 mb-10 shadow-brutal" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border-4 border-neo-black bg-white shadow-brutal overflow-hidden">
            <div className="h-20 bg-neo-gray border-b-4 border-neo-black animate-pulse" />
            <div className="p-6 space-y-4">
              <div className="h-4 bg-neo-black animate-pulse w-3/4" />
              <div className="h-4 bg-neo-black animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4 gap-6 bg-neo-bg">
        <div className="w-20 h-20 bg-neo-pink border-4 border-neo-black shadow-brutal flex items-center justify-center -rotate-6">
          <AlertCircle className="w-10 h-10 text-white" strokeWidth={3} />
        </div>
        <div>
          <h2 className="font-display font-black text-3xl uppercase">Data Retrieval Failed</h2>
          <p className="font-neo font-bold mt-2">Could not fetch order history.</p>
        </div>
        <Link to="/shop" className="btn-neo-cyan px-10 py-4 text-sm mt-4">BACK TO SHOP</Link>
      </div>
    );
  }

  // ── Empty ─────────────────────────────────────────────────
  if (!orders || orders.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center px-4 gap-6 bg-neo-bg">
        <div className="w-24 h-24 bg-neo-yellow border-4 border-neo-black shadow-brutal flex items-center justify-center rotate-3">
          <ShoppingBag className="w-12 h-12 text-neo-black" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="font-display font-black text-4xl uppercase tracking-tighter mb-2">EMPTY DOSSIER</h2>
          <p className="font-neo font-bold max-w-md mx-auto">
            You haven't initiated any procurements yet. Engage the marketplace to secure assets.
          </p>
        </div>
        <Link to="/shop" className="btn-neo-cyan px-10 py-4 mt-6 flex items-center gap-2">
          BROWSE CATALOG <ArrowRight className="w-5 h-5" strokeWidth={3} />
        </Link>
      </div>
    );
  }

  // ── Orders list ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neo-bg pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 border-b-6 border-neo-black pb-8 border-dashed"
        >
          <div className="inline-flex items-center gap-2 bg-neo-yellow border-2 border-neo-black px-3 py-1 font-display font-black text-xs uppercase shadow-brutal-sm mb-4">
            <History className="w-4 h-4" /> USER LOG
          </div>
          <h1 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tighter text-neo-black leading-[0.85]">
            PROCUREMENT <br />
            <span className="bg-neo-black text-white px-2 leading-tight">HISTORY</span>
          </h1>
          <p className="font-neo font-bold mt-4 bg-white border-2 border-neo-black inline-block px-3 py-1 shadow-[2px_2px_0px_#121212]">
            {orders.length} EXECUTED CONTRACT{orders.length !== 1 ? 'S' : ''}
          </p>
        </motion.div>

        {/* List */}
        <div className="space-y-8">
          <AnimatePresence>
            {orders.map((order, idx) => {
              const saved = order.items.reduce(
                (acc, item) => acc + (item.basePrice - item.priceAtPurchase) * item.quantity, 0
              );
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 20, delay: idx * 0.1 }}
                  className="bg-white border-4 border-neo-black shadow-brutal-lg group hover:-translate-y-2 hover:-translate-x-2 hover:shadow-brutal-xl transition-all duration-300"
                >
                  {/* Top bar */}
                  <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b-4 border-neo-black bg-neo-pink">
                    <div className="flex items-center gap-6 flex-wrap">
                      {/* Order ID */}
                      <div className="bg-white border-2 border-neo-black p-2 shadow-[2px_2px_0px_#121212]">
                        <p className="font-neo text-[10px] font-bold text-neo-black uppercase">CONTRACT ID</p>
                        <p className="font-display font-black tracking-widest uppercase">#{order._id.slice(-8)}</p>
                      </div>
                      
                      {/* Date */}
                      <div className="bg-white border-2 border-neo-black p-2 shadow-[2px_2px_0px_#121212]">
                        <p className="font-neo text-[10px] font-bold text-neo-black uppercase">EXECUTED ON</p>
                        <div className="flex items-center gap-1 font-display font-black uppercase text-sm">
                          <Calendar className="w-4 h-4" strokeWidth={2.5} />
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </div>
                      </div>

                      {/* Status */}
                      <StatusBadge status={order.status} />
                    </div>

                    {/* Total */}
                    <div className="bg-neo-black text-white p-3 border-2 border-white shadow-[4px_4px_0px_#FFD000] rotate-2 sm:mt-0 mt-4">
                      <p className="font-neo text-[10px] font-bold uppercase tracking-widest text-[#FFD000]">FINAL COST</p>
                      <p className="font-display font-black text-3xl leading-none">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    {/* Item thumbnails */}
                    <div className="flex flex-wrap gap-2">
                      {order.items.slice(0, 5).map((item, i) => (
                        <Link
                          key={i}
                          to={`/product/${item.productId}`}
                          title={item.title}
                          className="w-16 h-16 bg-white border-3 border-neo-black shadow-[2px_2px_0px_#121212] flex items-center justify-center overflow-hidden hover:scale-110 hover:-rotate-3 transition-transform"
                        >
                          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" loading="lazy" />
                        </Link>
                      ))}
                      {order.items.length > 5 && (
                        <div className="w-16 h-16 bg-neo-yellow border-3 border-neo-black shadow-[2px_2px_0px_#121212] flex items-center justify-center font-display font-black text-xl">
                          +{order.items.length - 5}
                        </div>
                      )}
                    </div>

                    {/* Right: savings + CTA */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                      {saved > 0 && (
                        <div className="flex items-center gap-3 px-4 py-2 border-3 border-neo-black bg-neo-green shadow-[2px_2px_0px_#121212]">
                          <Zap className="w-5 h-5 text-neo-black shrink-0" strokeWidth={2.5} />
                          <div>
                            <p className="font-neo text-[10px] uppercase font-bold text-neo-black">SYSTEM SAVINGS</p>
                            <p className="font-display font-black text-lg leading-none text-neo-black">₹{saved.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      )}

                      <Link
                        to={`/order/${order._id}`}
                        className="flex items-center justify-center gap-2 px-6 py-3 font-display font-black uppercase text-sm border-3 border-neo-black bg-neo-cyan shadow-[4px_4px_0px_#121212] hover:shadow-[2px_2px_0px_#121212] hover:translate-y-0.5 hover:translate-x-0.5 transition-all"
                      >
                        VIEW CONTRACT
                        <ChevronRight className="w-4 h-4" strokeWidth={3} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Orders;
