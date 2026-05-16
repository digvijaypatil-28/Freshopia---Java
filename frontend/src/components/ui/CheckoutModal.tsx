import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, CreditCard, Wallet, Truck, ChevronRight, ShieldCheck, Info } from 'lucide-react';
import type { CartItem, Product, BillingBreakdown } from '../../types';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: (CartItem & { product: Product })[];
  onSuccess: (orderId: string) => void;
}

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cart, onSuccess }) => {
  const { token } = useAuth();
  const [address, setAddress] = useState('Flat 402, Sunshine Apartments, Worli, Mumbai - 400018');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [billing, setBilling] = useState<BillingBreakdown | null>(null);

  useEffect(() => {
    if (isOpen && cart.length > 0) {
      axios.post(`${API_BASE}/billing`, cart.map(item => ({ product_id: item.product_id, quantity: item.quantity })))
        .then(res => setBilling(res.data));
    }
  }, [isOpen, cart]);

  const handlePlaceOrder = async () => {
    if (!token) return;
    setIsProcessing(true);
    try {
      const orderData = {
        items: cart.map(item => ({ product_id: item.product_id, quantity: item.quantity })),
        address,
        payment_method: paymentMethod,
        total: billing?.grand_total || 0
      };
      const res = await axios.post(`${API_BASE}/orders?token=${token}`, orderData);
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess(res.data.id);
      }, 1500); // Simulate processing delay
    } catch (err) {
      console.error("Order failed", err);
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100"
          >
            {/* Left Side: Forms */}
            <div className="flex-grow p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Checkout</h2>
                <button onClick={onClose} className="md:hidden text-slate-400"><X /></button>
              </div>

              <div className="space-y-8">
                {/* Delivery Address */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-fresh-mint/10 text-fresh-mint flex items-center justify-center">
                      <MapPin size={18} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Delivery Address</h3>
                  </div>
                  <div className="p-4 rounded-2xl border-2 border-slate-50 bg-slate-50/50 group focus-within:border-fresh-mint/20 transition-all">
                    <textarea 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 resize-none h-20 outline-none"
                    />
                  </div>
                </section>

                {/* Payment Method */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-fresh-mint/10 text-fresh-mint flex items-center justify-center">
                      <CreditCard size={18} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Payment Method</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'UPI', label: 'UPI', icon: Wallet },
                      { id: 'Card', label: 'Card', icon: CreditCard },
                      { id: 'COD', label: 'Cash', icon: Truck },
                    ].map((method) => {
                      const Icon = method.icon;
                      const isActive = paymentMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id as any)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                            isActive 
                              ? 'border-fresh-mint bg-fresh-mint/5 text-fresh-mint shadow-lg shadow-fresh-mint/5' 
                              : 'border-slate-50 hover:border-slate-200 text-slate-400'
                          }`}
                        >
                          <Icon size={20} />
                          <span className="text-xs font-black uppercase tracking-wider">{method.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <button 
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                  className="w-full bg-slate-900 h-16 rounded-2xl text-white font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 shadow-xl shadow-slate-900/20"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <>Place Order <ChevronRight size={20} /></>
                  )}
                </button>
                
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  <ShieldCheck size={14} className="text-fresh-mint" /> 100% Secure Payments
                </div>
              </div>
            </div>

            {/* Right Side: Order Summary */}
            <div className="w-full md:w-72 bg-slate-50 p-8 border-l border-slate-100 flex flex-col">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Order Summary</h3>
              
              <div className="flex-grow space-y-4 overflow-y-auto max-h-48 md:max-h-none mb-6 no-scrollbar">
                {cart.map(item => (
                  <div key={item.product_id} className="flex justify-between items-center text-sm">
                    <div className="flex-grow">
                      <p className="font-bold text-slate-800 line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-black text-slate-900">₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-slate-200 space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{billing?.item_total || 0}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1">GST <Info size={10} /></span>
                  <span>₹{billing?.gst.toFixed(1) || 0}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Delivery</span>
                  <span className="text-fresh-mint font-black">{billing?.delivery_fee === 0 ? 'FREE' : `₹${billing?.delivery_fee}`}</span>
                </div>
                <div className="pt-4 flex justify-between items-center">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Total</span>
                  <span className="text-2xl font-black text-slate-900">₹{billing?.grand_total.toFixed(0) || 0}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
