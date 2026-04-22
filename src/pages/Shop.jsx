import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, ChevronDown, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(category);

  useEffect(() => { setActiveCategory(category); }, [category]);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories().then(res => res.data),
    staleTime: 1000 * 60 * 60,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['products', activeCategory, query],
    queryFn: () => {
      if (activeCategory) return productService.getProductsByCategory(activeCategory, { limit: 100 }).then(res => res.data);
      return productService.getProducts({ q: query, limit: 100 }).then(res => res.data);
    },
    keepPreviousData: true,
  });

  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];
    if (!activeCategory || !query) return data.products;
    
    const searchTerm = query.toLowerCase();
    const categorySearch = searchTerm === 'phone' ? 'smartphone' : searchTerm;

    return data.products.filter(p =>
      String(p.title || '').toLowerCase().includes(searchTerm) ||
      String(p.description || '').toLowerCase().includes(searchTerm) ||
      String(p.category || '').toLowerCase().includes(categorySearch)
    );
  }, [data?.products, activeCategory, query]);

  const handleCategoryChange = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) newParams.set('category', slug); else newParams.delete('category');
    setSearchParams(newParams);
    setIsFilterOpen(false);
  };

  const clearSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('q');
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-neo-bg px-4 md:px-8">
      <div className="max-w-7xl mx-auto pb-24 border-x-4 border-neo-black bg-white min-h-screen">

        {/* ── Page Header ─────────────────────────────────────── */}
        <div className="pt-12 pb-12 px-6 border-b-4 border-neo-black bg-neo-cyan">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-white border-2 border-neo-black px-3 py-1 font-display font-black text-[10px] uppercase shadow-[2px_2px_0px_#121212] mb-4">
                <LayoutGrid className="w-3 h-3" /> MARKETPLACE
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase text-neo-black leading-[0.8]">
                {activeCategory ? activeCategory.replace(/-/g, ' ') : 'ALL GEAR'}
              </h1>
              <p className="font-neo text-sm font-bold mt-4 bg-white border-2 border-neo-black inline-block px-3 py-1 shadow-[2px_2px_0px_#121212]">
                {isLoading ? 'Fetching Data...' : `${filteredProducts.length} Items Found`}
                {query && <span className="text-neo-pink"> · Search: "{query}"</span>}
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-3 px-6 py-3 border-3 border-neo-black font-display font-black uppercase tracking-widest text-sm transition-all shadow-brutal active:shadow-brutal-sm active:translate-y-1 active:translate-x-1 ${
                    isFilterOpen || activeCategory ? 'bg-neo-yellow' : 'bg-white'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>{activeCategory ? activeCategory.replace(/-/g, ' ') : 'FILTER'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isFilterOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setIsFilterOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 right-0 w-64 bg-white border-4 border-neo-black shadow-brutal z-40 p-2"
                      >
                        <p className="font-neo text-[10px] font-bold text-neo-black uppercase px-2 pb-2 mb-2 border-b-2 border-neo-black">CATEGORIES</p>
                        <div className="max-h-[300px] overflow-y-auto">
                          <button
                            onClick={() => handleCategoryChange('')}
                            className={`w-full text-left px-4 py-2 font-display font-bold text-sm uppercase transition-all mb-1 border-2 ${
                              !activeCategory ? 'bg-neo-yellow border-neo-black' : 'bg-transparent border-transparent hover:border-neo-black'
                            }`}
                          >
                            ALL PRODUCTS
                          </button>
                          {categories?.map((cat) => {
                            const slug = typeof cat === 'object' ? cat.slug : cat;
                            const name = typeof cat === 'object' ? cat.name : cat;
                            return (
                              <button
                                key={slug}
                                onClick={() => handleCategoryChange(slug)}
                                className={`w-full text-left px-4 py-2 font-display font-bold text-sm uppercase transition-all mb-1 border-2 ${
                                  activeCategory === slug ? 'bg-neo-yellow border-neo-black' : 'bg-transparent border-transparent hover:border-neo-black'
                                }`}
                              >
                                {name.replace(/-/g, ' ')}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {activeCategory && (
                <button
                  onClick={() => handleCategoryChange('')}
                  className="w-12 h-12 bg-neo-pink border-3 border-neo-black text-white flex items-center justify-center shadow-brutal active:shadow-brutal-sm active:translate-y-1 active:translate-x-1"
                  title="Clear filter"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Search chip */}
          <AnimatePresence>
            {query && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 inline-flex items-center gap-3 px-4 py-2 bg-neo-yellow border-3 border-neo-black font-neo font-bold text-sm shadow-[2px_2px_0px_#121212]"
              >
                <SearchIcon className="w-4 h-4" />
                RESULTS FOR: "{query}"
                <button onClick={clearSearch} className="ml-2 hover:bg-neo-black hover:text-white p-1 rounded-sm border-2 border-transparent transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Product Grid ────────────────────────────────────── */}
        <div className="p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : isError ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-[50vh] flex flex-col items-center justify-center gap-6 text-center border-4 border-neo-black bg-neo-gray m-6 p-10"
            >
              <div className="w-20 h-20 bg-neo-pink border-4 border-neo-black shadow-brutal rotate-12 flex items-center justify-center">
                <X className="w-10 h-10 text-white" strokeWidth={3} />
              </div>
              <div>
                <p className="font-display font-black text-3xl uppercase">Data Error!</p>
                <p className="font-neo font-bold text-sm mt-2">Cannot reach the pricing engine.</p>
              </div>
              <button onClick={() => refetch()} className="btn-neo-yellow">RETRY CONNECTION</button>
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-[50vh] flex flex-col items-center justify-center gap-6 text-center border-4 border-neo-black bg-white m-6 p-10 shadow-brutal"
            >
              <div className="w-20 h-20 bg-neo-yellow border-4 border-neo-black shadow-brutal -rotate-6 flex items-center justify-center">
                <SearchIcon className="w-10 h-10 text-neo-black" strokeWidth={3} />
              </div>
              <div>
                <p className="font-display font-black text-3xl uppercase">Void Found</p>
                <p className="font-neo font-bold text-sm mt-2">Check your keywords or category.</p>
              </div>
              <button onClick={() => { handleCategoryChange(''); clearSearch(); }} className="btn-neo-cyan px-8 py-3">
                RESET FILTERS
              </button>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, i) => (
                  <motion.div key={product.id} layout initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 20, delay: Math.min(i * 0.05, 0.5) }}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Shop;
