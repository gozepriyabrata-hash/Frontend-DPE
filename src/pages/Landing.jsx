import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, TrendingDown, BarChart3, Hexagon } from 'lucide-react';

// ─── Animated number counter ─────────────────────────────────────────────────
const Counter = ({ end, suffix = '', duration = 2000 }) => {
  const ref = useRef(null);
  const [value, setValue] = React.useState(0);
  const [started, setStarted] = React.useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, end);
      setValue(Math.floor(start));
      if (start >= end) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>;
};

// ─── Stat card ───────────────────────────────────────────────────────────────
const StatCard = ({ value, suffix, label, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white border-4 border-neo-black shadow-brutal p-8 text-center"
  >
    <p className={`text-5xl md:text-6xl font-display font-black mb-2 tracking-tighter`} style={{ color }}>
      <Counter end={value} suffix={suffix} />
    </p>
    <p className="font-neo text-sm font-bold uppercase tracking-[0.1em]">{label}</p>
  </motion.div>
);

// ─── Feature card ────────────────────────────────────────────────────────────
const FeatureCard = ({ icon: Icon, title, desc, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="bg-white border-4 border-neo-black shadow-brutal p-8 flex flex-col group hover:-translate-y-2 hover:-translate-x-2 hover:shadow-brutal-xl transition-all duration-300"
  >
    <div
      className="w-16 h-16 border-4 border-neo-black shadow-brutal-sm flex items-center justify-center mb-6 group-hover:-rotate-6 transition-transform"
      style={{ background: color }}
    >
      <Icon className="w-8 h-8 text-neo-black" strokeWidth={2.5} />
    </div>
    <h3 className="font-display font-black text-2xl mb-3 text-neo-black uppercase leading-tight">{title}</h3>
    <p className="font-neo text-sm font-semibold">{desc}</p>
  </motion.div>
);

// ─── Main Landing Page ────────────────────────────────────────────────────────
const Landing = () => {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);

  return (
    <div className="relative overflow-x-hidden bg-neo-bg">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-10 pb-20 border-b-4 border-neo-black overflow-hidden">
        
        {/* Background shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-neo-pink border-4 border-neo-black shadow-brutal rounded-full animate-wiggle hidden lg:block" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-neo-cyan border-4 border-neo-black shadow-brutal flex items-center justify-center animate-[wiggle_4s_ease-in-out_infinite] hidden lg:flex">
          <Hexagon className="w-20 h-20 text-neo-black" strokeWidth={1} />
        </div>
        <div className="absolute top-40 right-32 w-20 h-20 bg-neo-yellow border-4 border-neo-black shadow-brutal rotate-12 hidden lg:block" />

        <motion.div style={{ y: heroY }} className="relative z-10 text-center max-w-4xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, type: 'spring', bounce: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-neo-green border-3 border-neo-black px-4 py-2 font-display font-black uppercase text-sm shadow-brutal-sm mb-10 -rotate-2">
              <Zap className="w-4 h-4 fill-neo-black" />
              Dynamic Engine v2.0
            </div>

            <h1 className="text-6xl sm:text-8xl md:text-[110px] font-display font-black tracking-tighter leading-[0.85] mb-8 uppercase text-neo-black">
              NEVER <br />
              <span className="text-white bg-neo-black leading-snug px-4">OVERPAY.</span>
            </h1>

            <p className="font-neo text-lg md:text-xl font-bold max-w-2xl mx-auto leading-relaxed mb-12">
              PRISM scans <span className="bg-neo-yellow px-1">Amazon</span>, <span className="bg-neo-cyan px-1">Flipkart</span> & <span className="bg-neo-pink text-white px-1">Temu</span> in real-time, aggressively slicing prices so you always secure the absolute bottom dollar.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/shop" className="btn-neo-cyan text-lg w-full sm:w-auto h-16 px-10">
                START SHOPPING <ArrowRight className="w-5 h-5 ml-2" strokeWidth={3} />
              </Link>
              <Link to="/analytics" className="btn-neo bg-white text-lg w-full sm:w-auto h-16 px-10">
                <BarChart3 className="w-5 h-5 mr-2" strokeWidth={3} /> MARKET DATA
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Marquee Separator ────────────────────────────────── */}
      <div className="bg-neo-yellow border-b-4 border-neo-black py-4 overflow-hidden relative">
        <div className="marquee-container animate-marquee-fast whitespace-nowrap text-3xl font-display font-black uppercase tracking-tight flex gap-8">
          <span>ALGORITHMIC TACTICS</span><span>•</span>
          <span>MARKET DISRUPTION</span><span>•</span>
          <span>COMPETITOR CRUSHING PRICING</span><span>•</span>
          <span>ALGORITHMIC TACTICS</span><span>•</span>
          <span>MARKET DISRUPTION</span><span>•</span>
          <span>COMPETITOR CRUSHING PRICING</span>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-b-4 border-neo-black bg-[radial-gradient(#121212_1px,transparent_1px)]" style={{ backgroundSize: '40px 40px' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard value={180} suffix="+" label="Items Tracked" color="#B5179E" />
          <StatCard value={3} suffix="" label="Platforms" color="#00F0FF" />
          <StatCard value={99} suffix="%" label="Accuracy Rate" color="#00E676" />
          <StatCard value={12} suffix="K+" label="Daily Scrapes" color="#FF5E00" />
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section className="py-32 px-6 border-b-4 border-neo-black bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase mb-6">
              The <span className="bg-neo-black text-white px-4">Signals.</span>
            </h2>
            <p className="font-neo text-xl font-bold max-w-2xl mx-auto">
              Our brutalist engine calculates value using a relentless 5-factor composite algorithm.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard icon={TrendingDown} title="Cutthroat Benchmarks" color="#00F0FF" delay={0}
              desc="We constantly ping Amazon & Temu. If they drop, we drop below them. If we're already the lowest, we anchor our position."
            />
            <FeatureCard icon={Zap} title="Demand Velocity" color="#FFD000" delay={0.1}
              desc="We track pageviews and real-time carts. High demand triggers aggressive inventory protection pricing."
            />
            <FeatureCard icon={Shield} title="Brand Trust Index" color="#FF0073" delay={0.2}
              desc="Scraping global review sentiment. The higher the market trust, the higher the baseline value threshold."
            />
          </div>

          {/* Formula Visual */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-neo-black border-4 border-neo-black shadow-[12px_12px_0px_0px_#FFD000] p-8 md:p-12 text-center"
          >
            <p className="font-neo text-neo-yellow font-bold text-sm uppercase tracking-widest mb-6 border-b-2 border-neo-yellow inline-block pb-1">Core Formula</p>
            <div className="font-display font-black text-2xl md:text-3xl text-white flex flex-wrap items-center justify-center gap-3">
              <span className="bg-neo-green text-neo-black px-3 py-1 -rotate-2">NEW PRICE</span>
              <span>=</span>
              <span>BASE</span>
              <span className="text-neo-pink">×</span>
              <span>DEMAND</span>
              <span className="text-neo-cyan">×</span>
              <span>STOCK</span>
              <span className="text-neo-yellow">×</span>
              <span>COMPETITION</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-32 px-6 border-b-4 border-neo-black bg-neo-pink overflow-hidden">
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <div className="inline-block bg-neo-yellow border-4 border-neo-black p-6 mb-10 shadow-brutal rotate-3">
            <h2 className="text-5xl md:text-8xl font-display font-black tracking-tighter uppercase text-neo-black leading-[0.9]">
              STOP PAYING RETAIL.
            </h2>
          </div>
          <p className="font-neo text-xl font-bold mb-12 text-white">
            Join the revolution. Algorithmic commerce is here.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/signup" className="btn-neo-yellow text-xl h-16 px-12 rotate-[-2deg]">
              CREATE ACCOUNT <ArrowRight className="w-6 h-6 ml-2" strokeWidth={3} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="py-12 px-6 bg-neo-bg">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-neo-black bg-white p-6 shadow-brutal-sm">
          <div className="flex items-center">
            <img src="/logo.png?v=2" alt="PRISM Logo" className="h-16 w-auto object-contain mix-blend-multiply" />
          </div>
          <p className="font-neo font-bold text-sm text-neo-black">© 2026 BRUTALIST COMMERCE. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6 font-display font-black uppercase">
            <Link to="/analytics" className="hover:underline decoration-4 decoration-neo-pink">Data</Link>
            <Link to="/shop" className="hover:underline decoration-4 decoration-neo-cyan">Shop</Link>
            <Link to="/login" className="hover:underline decoration-4 decoration-neo-yellow">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
