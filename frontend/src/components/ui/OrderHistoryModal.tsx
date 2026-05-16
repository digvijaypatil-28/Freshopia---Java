import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Box, Calendar, CreditCard, ChevronRight, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import type { Order } from '../../types';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ isOpen, onClose }) => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && token) {
      setIsLoading(true);
      axios.get(`${API_BASE}/orders?token=${token}`)
        .then(res => {
          setOrders(res.data.reverse()); // Newest first
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch orders", err);
          setIsLoading(false);
        });
    }
  }, [isOpen, token]);

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
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-slate-100 max-h-[85vh]"
          >
            <div className="p-8 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-3xl font-black text-slate-900">Order History</h2>
                <p className="text-slate-400 text-sm font-bold mt-1">Review your past fresh deliveries</p>
              </div>
              <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-6 no-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-10 h-10 border-4 border-fresh-mint/30 border-t-fresh-mint rounded-full animate-spin" />
                  <p className="text-slate-400 font-bold">Fetching your history...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6">
                    <ShoppingBag size={40} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">No orders yet</h3>
                  <p className="text-slate-400 font-medium max-w-xs mt-2">Start your first fresh journey and it will appear here!</p>
                </div>
              ) : (
                orders.map((order) => (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-6 rounded-[2rem] border-2 border-slate-50 hover:border-fresh-mint/10 hover:bg-fresh-mint/5 transition-all group"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                          <ShoppingBag size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 flex items-center gap-2">
                            Order #{order.id}
                            <span className="text-[10px] bg-fresh-mint/10 text-fresh-mint px-2 py-0.5 rounded-full uppercase tracking-widest">{order.status}</span>
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-slate-400 font-bold mt-1">
                            <span className="flex items-center gap-1"><Calendar size={12} /> {order.created_at}</span>
                            <span className="flex items-center gap-1"><CreditCard size={12} /> {order.payment_method}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Paid</p>
                        <p className="text-2xl font-black text-slate-900">₹{order.total.toFixed(0)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-slate-100/50">
                      <p className="text-sm font-bold text-slate-600 line-clamp-1 flex-grow">
                        Delivered to: {order.address}
                      </p>
                      <button className="flex items-center gap-1 text-xs font-black text-fresh-mint uppercase tracking-widest ml-4">
                        Details <ChevronRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OrderHistoryModal;
