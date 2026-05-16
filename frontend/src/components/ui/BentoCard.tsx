import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Star } from 'lucide-react';
import type { Product } from '../../types';
import FreshnessBadge from './FreshnessBadge';

interface BentoCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const BentoCard: React.FC<BentoCardProps> = ({ product, onAddToCart }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-[2rem] p-4 shadow-premium hover:shadow-hover transition-all duration-500 overflow-hidden border border-slate-50"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-slate-50 mb-4 group-hover:shadow-lg transition-shadow duration-500">
        <motion.img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {product.freshness_metadata && (
          <div className="absolute top-3 left-3 z-10">
            <FreshnessBadge text={product.freshness_metadata} />
          </div>
        )}
        
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-black text-slate-800">
            <Star size={10} className="fill-saffron-warm text-saffron-warm" />
            4.8
          </div>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="space-y-1 px-2">
        <p className="text-[10px] font-black text-fresh-mint uppercase tracking-[0.15em] mb-1 opacity-80">
          {product.category.split(' & ')[0]}
        </p>
        <h3 className="text-base font-extrabold text-slate-800 leading-tight group-hover:text-fresh-mint transition-colors">
          {product.name}
        </h3>
        <p className="text-[11px] text-slate-400 font-medium line-clamp-1">
          {product.description}
        </p>
      </div>
      
      {/* Footer Info */}
      <div className="mt-4 flex items-end justify-between px-2 pb-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{product.unit}</span>
          <div className="flex items-baseline gap-0.5">
            <span className="text-sm font-black text-slate-900">₹</span>
            <span className="text-xl font-black text-slate-900">{product.price}</span>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="relative z-10 w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/10 transition-colors group-hover:bg-fresh-mint group-hover:shadow-fresh-mint/20"
        >
          <Plus size={24} />
        </motion.button>
      </div>
      
      {/* Subtle Background Pattern */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-fresh-mint/5 rounded-full blur-3xl group-hover:bg-fresh-mint/10 transition-all duration-500" />
    </motion.div>
  );
};

export default BentoCard;
