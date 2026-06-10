import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
  isBlocked: boolean;
  loyaltyPoints: number;
  token: string;
}

export interface CartItem {
  _id: string;
  book: {
    _id: string;
    titleAr: string;
    slug: string;
    price: number;
    image: string;
    stock: number;
  };
  quantity: number;
}

interface AppState {
  user: User | null;
  isDarkMode: boolean;
  cart: CartItem[];
  setUser: (user: User | null) => void;
  toggleDarkMode: () => void;
  logout: () => void;
  updatePoints: (points: number) => void;
  addToCart: (item: CartItem) => void;
  updateCartQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isDarkMode: true,
      cart: [],
      setUser: (user) => set({ user }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      logout: () => {
        localStorage.removeItem('user');
        set({ user: null, cart: [] });
      },
      updatePoints: (points) =>
        set((state) => ({
          user: state.user ? { ...state.user, loyaltyPoints: points } : null,
        })),
      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find((i) => i._id === item._id);
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i._id === item._id
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.book.stock) }
                  : i
              ),
            };
          }
          return { cart: [...state.cart, item] };
        }),
      updateCartQty: (id, qty) =>
        set((state) => ({
          cart: state.cart.map((i) => (i._id === id ? { ...i, quantity: Math.max(1, Math.min(qty, i.book.stock)) } : i)),
        })),
      removeFromCart: (id) =>
        set((state) => ({ cart: state.cart.filter((i) => i._id !== id) })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'bookbeacon-storage',
      partialize: (state) => ({
        user: state.user,
        isDarkMode: state.isDarkMode,
        cart: state.cart,
      }),
    }
  )
);
