import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-neo-bg border-4 border-neo-black shadow-brutal-lg overflow-hidden flex flex-col">
      {/* Image skeleton */}
      <div className="aspect-[4/3] bg-neo-gray border-b-4 border-neo-black animate-pulse" />

      {/* Content */}
      <div className="p-4 flex flex-col gap-4">
        {/* Platform badge */}
        <div className="w-16 h-5 bg-neo-gray border-2 border-neo-black shadow-[2px_2px_0px_#121212] animate-pulse" />
        
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-neo-black animate-pulse w-full" />
          <div className="h-4 bg-neo-black animate-pulse w-4/5" />
        </div>
        
        {/* Stars */}
        <div className="flex gap-1 h-3.5 items-center">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3.5 h-3.5 rounded-full bg-neo-gray border-2 border-neo-black animate-pulse" />
          ))}
        </div>
        
        {/* Price row */}
        <div className="flex items-end justify-between mt-2 border-t-3 border-neo-black pt-4">
          <div className="space-y-2">
            <div className="h-3 w-16 bg-neo-gray border-2 border-neo-black animate-pulse" />
            <div className="h-6 w-24 bg-neo-black animate-pulse" />
          </div>
          <div className="w-12 h-12 bg-neo-cyan border-3 border-neo-black shadow-brutal animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
