import React from 'react';
import { Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

interface FreshnessBadgeProps {
  text: string;
}

const FreshnessBadge: React.FC<FreshnessBadgeProps> = ({ text }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-fresh-mint/10 text-fresh-mint text-[10px] font-bold tracking-wider uppercase"
    >
      <Leaf size={12} className="fill-current" />
      {text}
    </motion.div>
  );
};

export default FreshnessBadge;
