import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Home, Sparkles } from 'lucide-react';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ isOpen, onClose, orderId }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[110] p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: -2 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative w-full max-w-lg bg-white rounded-[3rem] p-12 text-center shadow-3xl overflow-hidden"
          >
            {/* Animated Background Elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-fresh-mint/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-fresh-mint/10 rounded-full blur-3xl animate-pulse delay-700" />

            <div className="relative z-10 flex flex-col items-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                className="w-24 h-24 bg-fresh-mint rounded-3xl flex items-center justify-center text-white mb-8 shadow-2xl shadow-fresh-mint/30 rotate-6"
              >
                <CheckCircle size={48} />
              </motion.div>

              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Order Placed!</h2>
              <p className="text-slate-500 font-medium text-lg mb-8 leading-relaxed">
                Your order <span className="text-slate-900 font-black">#{orderId}</span> has been confirmed. 
                Our rider will be at your doorstep in <span className="text-fresh-mint font-black">12 mins</span>.
              </p>

              <div className="w-full grid grid-cols-1 gap-4 mb-10">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4 text-left">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                    <p className="text-sm font-black text-slate-800">Packed & Ready</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4 text-left">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rewards</p>
                    <p className="text-sm font-black text-slate-800">+50 FreshPoints earned</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button 
                  onClick={onClose}
                  className="flex-grow bg-fresh-mint h-16 rounded-2xl text-white font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.03] active:scale-[0.97] transition-all shadow-xl shadow-fresh-mint/20"
                >
                  Continue Shopping <ArrowRight size={20} />
                </button>
                <button className="h-16 px-8 rounded-2xl border-2 border-slate-100 text-slate-500 font-black text-lg flex items-center justify-center hover:bg-slate-50 transition-all">
                  <Home size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OrderSuccessModal;
