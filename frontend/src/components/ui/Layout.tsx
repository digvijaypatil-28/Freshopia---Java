import React from 'react';
import { ShoppingBasket, Search, MapPin, ChevronDown, Bell, LayoutGrid, Leaf, Coffee, Nut, Flame, Star, Sparkles, Box } from 'lucide-react';
import type { Category } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  selectedCategory: Category | "All";
  onSelectCategory: (cat: Category | "All") => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onLoginOpen: () => void;
  onLogout: () => void;
  isAuthenticated: boolean;
  user?: { username: string };
}

const NAV_ITEMS = [
  { id: "All", label: "All Items", icon: LayoutGrid },
  { id: "Fruits & Vegetables", label: "Fresh Harvest", icon: Leaf },
  { id: "Drinks & Cold Brews", label: "Cold Brews", icon: Coffee },
  { id: "Fruits & Nuts", label: "Fruits & Nuts", icon: Nut },
  { id: "Spices & Masalas", label: "Spices & Masalas", icon: Flame },
  { id: "Regional Classics", label: "Regional Gems", icon: Star },
  { id: "Pooja Essentials", label: "Spiritual", icon: Sparkles },
];

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  selectedCategory, 
  onSelectCategory, 
  cartCount, 
  onOpenCart, 
  onOpenOrders, 
  onLoginOpen, 
  onLogout, 
  isAuthenticated, 
  user 
}) => {
  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Sidebar */}
      <aside className="w-72 hidden lg:flex flex-col sticky top-0 h-screen p-6 border-r border-slate-100 bg-white z-50">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-fresh-mint rounded-xl flex items-center justify-center shadow-lg shadow-fresh-mint/20 text-white">
            <ShoppingBasket size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Freshopia</h1>
        </div>

        <nav className="flex-grow space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = selectedCategory === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectCategory(item.id as any)}
                className={`nav-item w-full ${isActive ? 'nav-item-active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto p-4 bg-fresh-mint/5 rounded-3xl border border-fresh-mint/10">
          <p className="text-xs font-bold text-fresh-mint uppercase tracking-widest mb-1">Flash Delivery</p>
          <p className="text-sm font-medium text-slate-600 leading-tight">Average delivery time: <span className="text-slate-900 font-bold">12 mins</span></p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between glass-panel">
          <div className="flex items-center gap-8 flex-grow max-w-4xl">
            {/* Location */}
            <div className="hidden sm:flex items-center gap-2 cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-fresh-mint group-hover:bg-fresh-mint/10 transition-colors">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Deliver To</p>
                <div className="flex items-center gap-1 font-bold text-sm">
                  Mumbai, 400001 <ChevronDown size={14} className="text-slate-400" />
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="flex-grow relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-fresh-mint transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search for 'Alphonso Mangoes', 'Maggi'..."
                className="w-full bg-slate-50 border-2 border-transparent focus:border-fresh-mint/10 focus:bg-white rounded-2xl py-3 pl-12 pr-4 transition-all outline-none text-sm font-medium"
              />
            </div>
          </div>

            {/* Cart & Auth */}
            <div className="flex items-center gap-4 ml-6">
              <button 
                onClick={onOpenCart}
                className="relative bg-white border border-slate-100 h-12 w-12 rounded-2xl flex items-center justify-center text-slate-800 hover:bg-slate-50 transition-all group"
              >
                <ShoppingBasket size={22} className="group-hover:text-fresh-mint transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-fresh-mint text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    {cartCount}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={onOpenOrders}
                    className="flex items-center gap-2 text-sm font-black text-slate-600 hover:text-fresh-mint transition-colors px-2"
                  >
                    <ShoppingBasket size={20} />
                    <span className="hidden xl:block">My Orders</span>
                  </button>
                  <div className="h-8 w-[1px] bg-slate-100 mx-1 hidden sm:block" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800">{user?.username || 'User'}</span>
                    <button
                      onClick={onLogout}
                      className="bg-slate-900 text-white h-12 px-4 rounded-2xl flex items-center gap-2 shadow-xl shadow-slate-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onLoginOpen}
                  className="bg-fresh-mint text-white h-12 px-6 rounded-2xl flex items-center gap-3 shadow-xl shadow-fresh-mint/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Login
                </button>
              )}
            </div>
        </header>

        {/* Scrollable Area */}
        <main className="p-8 pb-32">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
