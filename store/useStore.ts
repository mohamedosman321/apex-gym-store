import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface StoreState {
  // Auth
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null, cart: [] }),

      cart: [],
      addToCart: (item) => {
        const cart = get().cart;
        const idx = cart.findIndex(
          (c) => c.productId === item.productId && c.size === item.size
        );
        if (idx >= 0) {
          const updated = [...cart];
          updated[idx].quantity += item.quantity;
          set({ cart: updated });
        } else {
          set({ cart: [...cart, item] });
        }
      },
      removeFromCart: (productId, size) =>
        set({ cart: get().cart.filter((c) => !(c.productId === productId && c.size === size)) }),
      updateQuantity: (productId, size, qty) => {
        if (qty <= 0) {
          get().removeFromCart(productId, size);
          return;
        }
        set({
          cart: get().cart.map((c) =>
            c.productId === productId && c.size === size ? { ...c, quantity: qty } : c
          ),
        });
      },
      clearCart: () => set({ cart: [] }),
      cartTotal: () => get().cart.reduce((s, c) => s + c.price * c.quantity, 0),
      cartCount: () => get().cart.reduce((s, c) => s + c.quantity, 0),
    }),
    { name: "gymstore" }
  )
);
