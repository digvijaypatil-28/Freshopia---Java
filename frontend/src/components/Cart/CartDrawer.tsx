import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, TrendingUp, Info, Trash2, Clock, ShieldCheck } from 'lucide-react';
import type { Product, CartItem, BillingBreakdown } from '../../types';
import axios from 'axios';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: (CartItem & { product: Product })[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
}

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, onRemove, onUpdateQuantity, onCheckout }) => {
  const [billing, setBilling] = useState<BillingBreakdown | null>(null);
  const [upsells, setUpsells] = useState<Product[]>([]);

  useEffect(() => {
    if (cart.length > 0) {
      axios.post(`${API_BASE}/billing`, cart.map(item => ({ product_id: item.product_id, quantity: item.quantity })))
        .then(res => setBilling(res.data));
      
      axios.post(`${API_BASE}/upsell`, cart.map(item => ({ product_id: item.product_id, quantity: item.quantity })))
        .then(res => setUpsells(res.data));
    } else {
      setBilling(null);
      setUpsells([]);
    }
  }, [cart]);

  const freeDeliveryThreshold = 500;
  const itemTotal = billing?.item_total || 0;
  const deliveryProgress = Math.min((itemTotal / freeDeliveryThreshold) * 100, 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-[70] shadow-2xl flex flex-col border-l border-slate-100"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  Your Basket <span className="text-sm font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500">{cart.length}</span>
                </h2>
                <div className="flex items-center gap-2 mt-1 text-xs text-fresh-mint font-bold uppercase tracking-widest">
                  <Clock size={12} /> Delivered in 10-15 mins
                </div>
              </div>
              <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Delivery Progress Bar */}
            <div className="px-8 py-6 bg-fresh-mint/5 border-b border-fresh-mint/10">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-bold text-slate-700">
                  {deliveryProgress === 100 ? "Congrats! Free delivery applied" : (
                    <>Add <span className="text-fresh-mint">₹{freeDeliveryThreshold - itemTotal}</span> for free delivery</>
                  )}
                </p>
                <span className="text-xs font-black text-fresh-mint">{Math.round(deliveryProgress)}%</span>
              </div>
              <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-fresh-mint/10 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${deliveryProgress}%` }}
                  className="h-full bg-gradient-to-r from-fresh-mint to-fresh-dark shadow-lg shadow-fresh-mint/20"
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto p-8 space-y-8 no-scrollbar">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-300">
                  <ShoppingBag size={80} className="mb-6 opacity-10" />
                  <p className="text-lg font-black text-slate-400">Your basket is empty</p>
                  <button onClick={onClose} className="mt-4 text-fresh-mint font-bold hover:underline underline-offset-4 transition-all">Start Shopping</button>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={item.product_id} 
                        className="flex gap-5 items-start group"
                      >
                        <div className="relative">
                          <img src={item.product.image} className="w-24 h-24 rounded-3xl object-cover shadow-premium group-hover:scale-105 transition-transform" />
                          <button 
                            onClick={() => onRemove(item.product_id)}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-white text-red-500 rounded-xl shadow-lg border border-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <div className="flex-grow pt-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-lg font-black text-slate-800 leading-tight">{item.product.name}</h4>
                              <p className="text-xs text-slate-400 font-bold mt-0.5">{item.product.unit}</p>
                            </div>
                            <span className="text-lg font-black text-slate-900">₹{item.product.price * item.quantity}</span>
                          </div>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                              <button 
                                onClick={() => onUpdateQuantity(item.product_id, -1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-slate-500 transition-colors"
                              >-</button>
                              <span className="w-10 text-center text-sm font-black text-slate-800">{item.quantity}</span>
                              <button 
                                onClick={() => onUpdateQuantity(item.product_id, 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-slate-500 transition-colors"
                              >+</button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Frequently Bought Together */}
                  {upsells.length > 0 && (
                    <div className="pt-8 border-t border-slate-50">
                      <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                        <TrendingUp size={16} className="text-saffron-warm" />
                        Frequently Bought Together
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {upsells.map(product => (
                          <div key={product.id} className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-3 group">
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white">
                              <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-slate-800 line-clamp-1">{product.name}</h4>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-sm font-black text-fresh-mint">₹{product.price}</span>
                                <button 
                                  onClick={() => onUpdateQuantity(product.id, 1)}
                                  className="text-[10px] font-black uppercase text-white bg-fresh-mint px-3 py-1.5 rounded-lg shadow-lg shadow-fresh-mint/10 hover:scale-105 transition-all"
                                >Add</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Billing Summary */}
            {billing && (
              <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-bold text-slate-500">
                    <span>Item Total</span>
                    <span>₹{billing.item_total}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-500">
                    <span className="flex items-center gap-1.5 underline decoration-dotted decoration-slate-200">
                      GST (5%) <Info size={14} className="text-slate-300" />
                    </span>
                    <span>₹{billing.gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-500">
                    <span>Delivery Fee</span>
                    <span className={billing.delivery_fee === 0 ? "text-fresh-mint font-black" : ""}>
                      {billing.delivery_fee === 0 ? "FREE" : `₹${billing.delivery_fee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-500">
                    <span>Handling Fee</span>
                    <span>₹{billing.handling_fee}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">To Pay</span>
                    <span className="text-3xl font-black text-slate-900">₹{billing.grand_total.toFixed(0)}</span>
                  </div>
                  <button 
                    onClick={onCheckout}
                    className="bg-fresh-mint h-16 px-10 rounded-[1.5rem] text-white font-black text-lg flex items-center gap-3 shadow-2xl shadow-fresh-mint/30 hover:scale-[1.03] active:scale-[0.97] transition-all"
                  >
                    Proceed <ArrowRight size={22} />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-fresh-mint" /> Secure Checkout & Fast Delivery
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
