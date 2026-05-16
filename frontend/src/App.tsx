import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, ChevronDown } from 'lucide-react';
import type { Product, CartItem, Category } from './types';
import BentoCard from './components/ui/BentoCard';
import CartDrawer from './components/Cart/CartDrawer';
import Layout from './components/ui/Layout';
import LoginModal from './components/ui/LoginModal';
import CheckoutModal from './components/ui/CheckoutModal';
import OrderSuccessModal from './components/ui/OrderSuccessModal';
import OrderHistoryModal from './components/ui/OrderHistoryModal';
import { useAuth } from './context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

const App: React.FC = () => {
  const { login, logout, token, user } = useAuth();
  const isAuthenticated = !!token;
  const [loginOpen, setLoginOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string>("");

  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);

  const handleOrderHistoryOpen = () => {
    if (!isAuthenticated) {
      setLoginOpen(true);
    } else {
      setOrderHistoryOpen(true);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<(CartItem & { product: Product })[]>(() => {
    const saved = localStorage.getItem('freshopia_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isBackendOffline, setIsBackendOffline] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckoutRequest = () => {
    if (!isAuthenticated) {
      setLoginOpen(true);
      setIsCartOpen(false);
    } else {
      setCheckoutOpen(true);
      setIsCartOpen(false);
    }
  };

  const handleOrderSuccess = (orderId: string) => {
    setLastOrderId(orderId);
    setCart([]);
    setCheckoutOpen(false);
    setSuccessOpen(true);
  };


  useEffect(() => {
    localStorage.setItem('freshopia_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = selectedCategory === "All" 
          ? `${API_BASE}/products` 
          : `${API_BASE}/products?category=${encodeURIComponent(selectedCategory)}`;
        const res = await axios.get(url);
        setProducts(res.data);
        setIsBackendOffline(false);
      } catch (err: any) {
        console.error("Failed to fetch products", err);
        if (!err.response) {
          setIsBackendOffline(true);
        }
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product_id: product.id, quantity: 1, product }];
    });
    // Optional: Open cart drawer automatically
    // setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product_id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product_id !== id));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Layout 
      selectedCategory={selectedCategory} 
      onSelectCategory={setSelectedCategory}
      cartCount={cartCount}
      onOpenCart={() => setIsCartOpen(true)}
      onOpenOrders={handleOrderHistoryOpen}
      onLoginOpen={handleLoginOpen}
      onLogout={handleLogout}
      isAuthenticated={isAuthenticated}
      user={user || undefined}
    >
      {/* Banner */}
      <section className="mb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-800 p-12 overflow-hidden shadow-2xl"
        >
          <div className="relative z-10 max-w-lg">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fresh-mint/10 border border-fresh-mint/20 text-fresh-mint text-xs font-black uppercase tracking-widest mb-6">
              <Sparkles size={14} /> New Season Arrivals
            </div>
            <h2 className="text-5xl font-black text-white mb-6 leading-tight">
              Premium <span className="text-fresh-mint">Alphonso</span> Mangoes are here.
            </h2>
            <p className="text-slate-400 text-lg font-medium mb-8">
              Sourced directly from Ratnagiri farms. 100% Organic & Chemical-free.
            </p>
            <button className="bg-fresh-mint text-white px-8 py-4 rounded-[1.5rem] font-black text-lg flex items-center gap-3 hover:scale-105 transition-transform shadow-xl shadow-fresh-mint/20">
              Shop Now <ArrowRight size={20} />
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/2 right-12 -translate-y-1/2 w-80 h-80 bg-fresh-mint/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-10 right-0 opacity-10">
            <Zap size={300} className="text-fresh-mint" />
          </div>
        </motion.div>
      </section>

      {/* Offline Warning */}
      {isBackendOffline && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 p-6 bg-red-50 border-2 border-red-100 rounded-[2rem] flex items-center gap-4 text-red-600 shadow-xl shadow-red-500/5"
        >
          <div className="w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
            <Zap size={24} />
          </div>
          <div>
            <h4 className="font-black text-lg">Backend Connection Failed</h4>
            <p className="text-sm font-bold opacity-80">The Java server is currently offline. Please run <code className="bg-red-100 px-2 py-0.5 rounded text-red-700">mvn spring-boot:run</code> in the backend directory to enable products and authentication.</p>
          </div>
        </motion.div>
      )}

      {/* Product Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h3 className="text-3xl font-black text-slate-900">{selectedCategory === 'All' ? 'Our Catalog' : selectedCategory}</h3>
          <p className="text-slate-400 font-bold text-sm mt-1">{filteredProducts.length} Items found for you</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-100 rounded-2xl px-6 py-3 pl-12 text-sm font-bold w-64 focus:w-80 transition-all outline-none focus:border-fresh-mint/20 focus:shadow-lg focus:shadow-fresh-mint/5"
            />
            <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-fresh-mint transition-colors" size={18} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:block">Sort By:</span>
            <button className="flex items-center gap-2 text-sm font-black bg-white px-4 py-2 rounded-xl border border-slate-100">
              Popularity <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        <motion.div 
          layout
          className="bento-grid"
        >
          {filteredProducts.map(product => (
            <BentoCard 
              key={product.id} 
              product={product} 
              onAddToCart={addToCart} 
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckoutRequest}
      />

      <LoginModal 
        isOpen={loginOpen} 
        onClose={handleLoginClose} 
      />

      <CheckoutModal 
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        onSuccess={handleOrderSuccess}
      />

      <OrderSuccessModal 
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        orderId={lastOrderId}
      />

      <OrderHistoryModal 
        isOpen={orderHistoryOpen}
        onClose={() => setOrderHistoryOpen(false)}
      />
    </Layout>
  );
};

export default App;
