export const CATEGORIES = [
  "Fruits & Vegetables",
  "Drinks & Cold Brews",
  "Fruits & Nuts",
  "Spices & Masalas",
  "Regional Classics",
  "Pooja Essentials"
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  unit: string;
  image: string;
  freshness_metadata?: string;
  description: string;
}

export interface CartItem {
  product_id: string;
  quantity: number;
}

export interface BillingBreakdown {
  item_total: number;
  gst: number;
  delivery_fee: number;
  handling_fee: number;
  grand_total: number;
}
export interface Order {
  id: string;
  username: string;
  items: CartItem[];
  address: string;
  payment_method: string;
  total: number;
  status: string;
  created_at: string;
}
export interface AuthUser {
  username: string;
  token: string;
}
