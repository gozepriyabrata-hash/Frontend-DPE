import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Activity, TrendingDown, TrendingUp, Server, Zap, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../services/api';

// ── Platform colors ────────────────────────────────────────────────────────────
const PLATFORM_COLORS = {
  Amazon: '#FFD000',
  Flipkart: '#00F0FF',
  Temu: '#FF0073',
};

// ── Custom chart tooltip ───────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border-4 border-neo-black p-4 shadow-[6px_6px_0px_#121212]">
      <p className="font-display font-black uppercase text-sm text-neo-black mb-3 pb-2 border-b-2 border-neo-black">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="font-neo font-bold flex items-center justify-between gap-4 mb-1">
          <span className="flex items-center gap-2" style={{ color: entry.color || entry.fill }}>
            <span className="w-3 h-3 border-2 border-neo-black" style={{ background: entry.color || entry.fill }} />
            {entry.name.toUpperCase()}
          </span>
          <span className="font-display font-black text-sm text-neo-black">
            ₹{entry.value?.toLocaleString('en-IN')}
          </span>
        </p>
      ))}
    </div>
  );
};

// ── KPI Card ───────────────────────────────────────────────────────────────────
const KpiCard = ({ icon: Icon, label, value, unit, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: 'spring', delay }}
    className="bg-white border-4 border-neo-black shadow-brutal p-6 flex flex-col items-center text-center group"
  >
    <div className="w-16 h-16 border-4 border-neo-black shadow-[4px_4px_0px_#121212] flex items-center justify-center mb-4 group-hover:-rotate-12 transition-transform"
      style={{ background: color }}>
      <Icon className="w-8 h-8 text-neo-black" strokeWidth={2.5} />
    </div>
    <p className="font-neo font-bold text-xs uppercase tracking-widest bg-neo-black text-white px-2 py-0.5 mb-3">{label}</p>
    <p className="font-display font-black text-4xl sm:text-5xl text-neo-black">
      {unit}{value !== null && value !== undefined ? value.toLocaleString('en-IN') : <span className="opacity-30">ERR</span>}
    </p>
  </motion.div>
);

// ── Main MarketAnalytics ───────────────────────────────────────────────────────
const MarketAnalytics = () => {
  const [selectedTitle, setSelectedTitle] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data: analytics, isLoading, isError } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => productService.getAnalytics().then(res => res.data),
  });

  React.useEffect(() => {
    if (analytics?.length > 0 && !selectedTitle) {
      setSelectedTitle(analytics[0].title);
    }
  }, [analytics, selectedTitle]);

  const activeTitle = selectedTitle || (analytics?.[0]?.title ?? '');

  const selectedItem = useMemo(() =>
    analytics?.find(i => i.title === activeTitle), [analytics, activeTitle]);

  const chartData = useMemo(() => {
    if (!selectedItem) return [];
    return [
      { platform: 'Amazon', Price: selectedItem.AmazonBase || 0 },
      { platform: 'Flipkart', Price: selectedItem.FlipkartBase || 0 },
      { platform: 'Temu', Price: selectedItem.TemuBase || 0 },
    ].filter(d => d.Price > 0);
  }, [selectedItem]);

  const stats = useMemo(() => {
    if (!chartData.length) return null;
    const sorted = [...chartData].sort((a, b) => a.Price - b.Price);
    return {
      lowest: sorted[0],
      highest: sorted[sorted.length - 1],
      spread: sorted[sorted.length - 1].Price - sorted[0].Price,
    };
  }, [chartData]);

  // ── Loading ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-10">
        <div className="h-16 bg-neo-gray border-4 border-neo-black animate-pulse w-80 shadow-[4px_4px_0px_#121212]" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-neo-gray border-4 border-neo-black animate-pulse shadow-brutal" />)}
        </div>
        <div className="h-[500px] bg-neo-gray border-4 border-neo-black animate-pulse shadow-brutal-lg" />
      </div>
    );
  }

  if (isError || !analytics) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-neo-bg">
        <div className="bg-neo-pink border-4 border-neo-black p-8 shadow-brutal rotate-3 text-center">
          <p className="font-display font-black text-4xl text-white uppercase line-through decoration-neo-black decoration-4">DATA OFFLINE</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neo-bg pb-24 border-t-4 border-neo-black">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">

        {/* ── Header ─────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 border-b-6 border-neo-black border-dashed pb-8 border-dashed">
          <div className="inline-flex items-center gap-2 bg-neo-pink text-white border-2 border-neo-black px-3 py-1 font-display font-black text-xs uppercase shadow-[2px_2px_0px_#121212] mb-4">
            <Activity className="w-4 h-4" strokeWidth={3} /> DATA PIPELINE
          </div>
          <h1 className="font-display font-black text-5xl md:text-8xl tracking-tighter uppercase text-neo-black leading-[0.85] mb-4">
            MARKET<br />
            <span className="bg-neo-cyan px-2 inline-block -rotate-1 mt-2">TRACKER</span>
          </h1>
          <p className="font-neo font-bold bg-white border-2 border-neo-black px-4 py-2 inline-block shadow-[4px_4px_0px_#121212]">
            RAW PRICING SCRAPED FROM MAJOR PLATFORMS.
          </p>
        </motion.div>

        {/* ── KPI Cards ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <KpiCard icon={Server} label="ACTIVE SCRAPES" value={analytics.length} unit="" color="#B5179E" delay={0} />
          <KpiCard icon={TrendingDown} label="MARKET FLOOR" value={stats?.lowest?.Price} unit="₹" color="#00E676" delay={0.1} />
          <KpiCard icon={TrendingUp} label="MARKET CEILING" value={stats?.highest?.Price} unit="₹" color="#FF0073" delay={0.2} />
        </div>

        {/* ── Product Selector ────────────────────────────── */}
        <div className="bg-neo-yellow border-4 border-neo-black shadow-brutal p-6 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-neo font-bold text-xs uppercase bg-white border-2 border-neo-black px-2 inline-block mb-3 shadow-[2px_2px_0px_#121212]">ACTIVE DATAPOINT</p>
            <h2 className="font-display font-black text-2xl md:text-3xl leading-tight">{activeTitle || 'AWAITING ITEM SELECTION'}</h2>
          </div>

          <div className="relative w-full md:w-[450px]">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 border-3 border-neo-black bg-white font-display font-black tracking-widest text-sm uppercase shadow-[4px_4px_0px_#121212] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_#121212] transition-all"
            >
              <span className="truncate">{activeTitle}</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} strokeWidth={3} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-2 w-full z-40 bg-white border-4 border-neo-black shadow-brutal max-h-80 overflow-y-auto p-2"
                  >
                    {analytics.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setSelectedTitle(item.title); setDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-3 font-display font-bold uppercase text-xs mb-1 border-2 transition-colors truncate ${
                          activeTitle === item.title ? 'bg-neo-cyan border-neo-black shadow-[2px_2px_0px_#121212]' : 'bg-transparent border-transparent hover:border-neo-black'
                        }`}
                      >
                        {item.title}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Chart ──────────────────────────────────────── */}
        <motion.div
          key={activeTitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-4 border-neo-black shadow-brutal-lg p-6 md:p-10"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-6">
            <div>
              <p className="font-neo font-bold text-xs bg-neo-black text-white px-2 py-0.5 inline-block uppercase tracking-widest mb-3">PRICE DIFFERENTIAL METRICS</p>
              <h2 className="font-display font-black text-3xl uppercase leading-tight max-w-2xl">{activeTitle}</h2>
            </div>
            
            <div className="flex border-2 border-neo-black bg-neo-bg p-2 shrink-0">
              {Object.entries(PLATFORM_COLORS).map(([name, color]) => (
                <div key={name} className="flex items-center gap-2 px-3 border-r-2 border-neo-black last:border-r-0">
                  <span className="w-3 h-3 border-2 border-neo-black" style={{ background: color }} />
                  <span className="font-display font-black text-[10px] uppercase">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {chartData.length > 0 ? (
            <div className="h-[400px] w-full border-4 border-neo-black p-4 bg-neo-bg shadow-[8px_8px_0px_rgba(0,230,118,0.3)]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }} barSize={80}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#121212" strokeOpacity={0.2} vertical={false} />
                  <XAxis
                    dataKey="platform"
                    stroke="#121212"
                    tick={{ fill: '#121212', fontFamily: '"Syne", sans-serif', fontSize: 16, fontWeight: 900 }}
                    tickLine={false}
                    axisLine={{ strokeWidth: 3 }}
                  />
                  <YAxis
                    stroke="#121212"
                    tick={{ fill: '#121212', fontFamily: '"Space Mono", monospace', fontSize: 12, fontWeight: 700 }}
                    tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}K`}
                    tickLine={false}
                    axisLine={{ strokeWidth: 3 }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(18,18,18,0.05)' }} />
                  <Bar dataKey="Price" radius={[0, 0, 0, 0]} activeBar={{ stroke: '#121212', strokeWidth: 4 }}>
                    {chartData.map((entry) => (
                      <Cell key={entry.platform} fill={PLATFORM_COLORS[entry.platform] || '#121212'} stroke="#121212" strokeWidth={4} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center border-4 border-neo-black bg-neo-gray border-dashed">
              <span className="font-display font-black text-2xl uppercase opacity-50">NO TELEMETRY AVAILABLE</span>
            </div>
          )}

          {/* Stats row below chart */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-10 border-t-4 border-neo-black">
              <div className="bg-neo-green border-4 border-neo-black p-4 shadow-[4px_4px_0px_#121212] -rotate-1">
                <p className="font-neo text-[10px] font-bold uppercase bg-white px-1 border-2 border-neo-black inline-block mb-3 shadow-[2px_2px_0px_#121212]">BOTTOM METRIC</p>
                <p className="font-display font-black text-4xl">₹{stats.lowest.Price.toLocaleString('en-IN')}</p>
                <p className="font-display font-black text-sm uppercase mt-1 bg-neo-black text-white px-2 py-0.5 inline-block">{stats.lowest.platform}</p>
              </div>
              <div className="bg-neo-pink border-4 border-neo-black p-4 shadow-[4px_4px_0px_#121212] rotate-1">
                <p className="font-neo text-[10px] font-bold uppercase bg-white px-1 border-2 border-neo-black inline-block mb-3 shadow-[2px_2px_0px_#121212] text-neo-black">PEAK EXTORTION</p>
                <p className="font-display font-black text-4xl text-white">₹{stats.highest.Price.toLocaleString('en-IN')}</p>
                <p className="font-display font-black text-sm uppercase mt-1 bg-white text-neo-black px-2 py-0.5 inline-block">{stats.highest.platform}</p>
              </div>
              <div className="bg-white border-4 border-neo-black p-4 shadow-[4px_4px_0px_#FFD000]">
                <p className="font-neo text-[10px] font-bold uppercase bg-neo-yellow px-1 border-2 border-neo-black inline-block mb-3">OPPORTUNITY SPREAD</p>
                <p className="font-display font-black text-4xl">₹{stats.spread.toLocaleString('en-IN')}</p>
                <p className="font-neo font-bold text-xs uppercase mt-2">DPE ALGORITHM TARGET</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* ── DPE note ──────────────────────────────────── */}
        <div className="mt-10 bg-neo-black p-6 flex flex-col md:flex-row items-center gap-6 shadow-[8px_8px_0px_#FF0073]">
          <div className="w-16 h-16 bg-neo-pink border-4 border-neo-black flex items-center justify-center shrink-0">
            <Zap className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
          <p className="font-neo font-bold text-white text-sm leading-relaxed max-w-3xl">
            THESE ARE <span className="bg-neo-cyan text-neo-black px-1">RAW BASELINE METRICS</span>. THE DYNAMIC ENGINE HAS <span className="underline decoration-neo-green decoration-4">NOT</span> YET APPLIED DEMAND, INVENTORY, TRUST, OR COMPETITION VECTORS TO THESE FIGURES. DEPLOY THE ENGINE IN THE SHOP SECTION TO COMPUTE FINAL SECURE PRICING.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalytics;
