import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Package, 
  ChevronLeft, 
  TrendingDown,
  Clock,
  Hash,
  ShoppingBag,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { orderService } from '../services/api';

const OrderDetail = () => {
  const { id } = useParams();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id).then(res => res.data),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="h-12 bg-white border-4 border-neo-black shadow-brutal animate-pulse w-64 mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-neo-gray border-4 border-neo-black shadow-brutal animate-pulse" />
          <div className="h-96 bg-neo-gray border-4 border-neo-black shadow-brutal animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-neo-bg">
        <div className="w-24 h-24 bg-neo-pink border-4 border-neo-black shadow-brutal flex items-center justify-center -rotate-6 mb-6">
          <Package className="w-12 h-12 text-white" strokeWidth={2.5} />
        </div>
        <h2 className="text-4xl font-display font-black uppercase text-neo-black">CONTRACT VOID</h2>
        <p className="font-neo font-bold uppercase mt-2 bg-white px-2 border-2 border-neo-black">This transaction ID returns null.</p>
        <Link to="/orders" className="btn-neo-cyan px-10 mt-8">RETURN TO ARCHIVES</Link>
      </div>
    );
  }

  const totalSaved = order.items.reduce(
    (acc, item) => acc + (item.basePrice - item.priceAtPurchase) * item.quantity, 
    0
  );

  return (
    <div className="min-h-screen bg-neo-bg pb-24 border-t-4 border-neo-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-16">
        {/* Header */}
        <div className="mb-12 border-b-6 border-neo-black pb-8 border-dashed">
          <Link to="/orders" className="inline-flex items-center gap-2 font-display font-black text-xs uppercase bg-white border-2 border-neo-black px-3 py-1 shadow-brutal-sm hover:-translate-y-1 hover:shadow-brutal transition-all mb-8">
            <ChevronLeft className="w-4 h-4" strokeWidth={3} /> RETURN TO ARCHIVES
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 bg-neo-cyan border-2 border-neo-black px-2 py-1 max-w-min mb-4 shadow-[2px_2px_0px_#121212]">
                <Hash className="w-4 h-4 text-neo-black" strokeWidth={3} />
                <span className="text-[10px] font-display font-black uppercase tracking-widest text-neo-black">DOSSIER</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase leading-[0.85]">
                CONTRACT<br/>
                <span className="bg-neo-black text-white px-2 inline-block rotate-1">DETAILS</span>
              </h1>
            </div>
            
            <div className="bg-neo-yellow border-4 border-neo-black px-4 py-2 text-xl font-display font-black uppercase tracking-widest flex items-center gap-2 shadow-[4px_4px_0px_#121212]">
              <Package className="w-6 h-6 shrink-0 text-neo-black" strokeWidth={3} />
              {order.status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Items */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border-4 border-neo-black p-6 md:p-8 shadow-brutal-lg relative">
              <div className="absolute -top-6 -right-6 bg-neo-pink border-4 border-neo-black w-14 h-14 flex items-center justify-center rotate-6 shadow-[4px_4px_0px_#121212]">
                <ShoppingBag className="w-6 h-6 text-white" strokeWidth={3} />
              </div>
              <h3 className="font-display font-black text-2xl uppercase tracking-tighter mb-8 border-b-4 border-neo-black pb-4">
                ACQUIRED COMPONENT LIST
              </h3>
              
              <div className="space-y-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 bg-neo-gray border-3 border-neo-black group">
                    <div className="w-20 h-20 bg-white border-3 border-neo-black p-2 shrink-0">
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-grow min-w-0 flex flex-col justify-between w-full sm:w-auto h-full">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h4 className="font-display font-black text-lg uppercase truncate leading-tight">
                          {item.title}
                        </h4>
                        <Link to={`/product/${item.productId}`} className="shrink-0 bg-white border-2 border-neo-black p-1 hover:bg-neo-black hover:text-white transition-colors">
                          <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
                        </Link>
                      </div>
                      <div className="flex justify-between items-end border-t-2 border-neo-black border-dashed pt-2">
                        <div className="bg-neo-black text-white px-2 py-0.5 font-neo font-bold text-[10px] uppercase inline-block">
                          QTY: {item.quantity}
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-gray-500 font-bold line-through block">₹{item.basePrice.toLocaleString('en-IN')}</span>
                          <span className="text-xl font-display font-black text-neo-black">₹{item.priceAtPurchase.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Advantage Summary */}
            {totalSaved > 0 && (
              <div className="bg-neo-green border-4 border-neo-black p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-brutal-lg -rotate-1 hover:rotate-0 transition-transform">
                <div className="w-20 h-20 bg-white border-4 border-neo-black flex items-center justify-center text-neo-black shrink-0 shadow-[4px_4px_0px_#121212]">
                  <TrendingDown className="w-10 h-10" strokeWidth={3} />
                </div>
                <div>
                  <h4 className="font-neo font-bold text-xs uppercase tracking-widest bg-neo-black text-white px-2 py-0.5 inline-block mb-3">
                    ALGORITHMIC EFFICIENCY DELTA
                  </h4>
                  <p className="font-neo font-bold text-sm mb-2 max-w-sm">The PRISM engine isolated a lower purchase cost compared to standard market averages at the moment of execution.</p>
                  <div className="text-3xl font-display font-black uppercase text-neo-black">
                    - ₹{Math.round(totalSaved).toLocaleString('en-IN')} SYSTEM SAVINGS
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Info & Shipping */}
          <div className="space-y-8">
            {/* Transaction Metadata */}
            <div className="bg-white border-4 border-neo-black p-6 shadow-brutal-lg">
              <h3 className="font-display font-black text-xl uppercase mb-6 border-b-4 border-neo-black pb-4">META LOG</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-neo-cyan border-2 border-neo-black flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="font-neo font-bold text-[10px] uppercase text-gray-500">INITIATION TIMESTAMP</p>
                    <p className="font-display font-black text-sm">{new Date(order.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }).toUpperCase()}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-neo-yellow border-2 border-neo-black flex items-center justify-center shrink-0">
                    <Hash className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="font-neo font-bold text-[10px] uppercase text-gray-500">LEDGER REF ID</p>
                    <p className="font-neo font-bold text-sm bg-neo-gray px-1 inline-block border-2 border-neo-black mt-1">
                      {order._id.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t-4 border-neo-black border-dashed flex flex-col space-y-4">
                <div className="flex justify-between items-center px-2">
                  <span className="font-neo font-bold text-[10px] uppercase text-gray-500">SUBTOTAL</span>
                  <span className="font-display font-black text-sm">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center px-2">
                  <span className="font-neo font-bold text-[10px] uppercase text-gray-500">FREIGHT SURCHARGE</span>
                  <span className="font-display font-black text-[10px] bg-neo-green px-1 border-2 border-neo-black">COMPLIMENTARY</span>
                </div>
                <div className="flex flex-col pt-6 border-t-2 border-neo-black mt-2 bg-neo-black text-white p-4 items-center text-center shadow-[4px_4px_0px_#FF0073] rotate-1">
                  <span className="font-neo font-bold text-[10px] uppercase tracking-widest text-[#FF0073] mb-1">FINAL DEBIT VALUE</span>
                  <span className="text-4xl font-display font-black text-white">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border-4 border-neo-black p-6 shadow-brutal-lg">
              <h3 className="font-display font-black text-xl uppercase mb-6 flex items-center gap-3 border-b-4 border-neo-black pb-4">
                <MapPin className="w-6 h-6 text-neo-pink" strokeWidth={3} /> TARGET COORDS
              </h3>
              
              {order.shippingAddress ? (
                <div className="space-y-2 bg-neo-gray border-3 border-neo-black p-4">
                  <p className="font-display font-black text-lg uppercase leading-tight">
                    {order.shippingAddress.houseNo}, {order.shippingAddress.street}
                  </p>
                  <p className="font-neo font-bold text-sm uppercase">
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                  {order.shippingAddress.landmark && (
                    <p className="text-[10px] font-bold bg-white border-2 border-neo-black px-2 mt-2 inline-block">
                      VISUAL: {order.shippingAddress.landmark.toUpperCase()}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-red-500 text-white font-neo font-bold border-4 border-neo-black p-4 uppercase text-center shadow-[4px_4px_0px_#121212]">
                  ERR: DELIVERY METADATA NOT FOUND
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
