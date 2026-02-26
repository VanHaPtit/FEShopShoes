
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';
import { CartItem, Product, ProductVariant } from '../types';
import { generateId } from '../utils/format';
import axiosClient from '../api/axiosClient';

/* ================= TYPES ================= */

interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  token: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    variant: ProductVariant,
    quantity?: number
  ) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  totalAmount: number;
  fetchUserCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /* ===== 1. FETCH CART FROM DB ===== */
  const fetchUserCartFromDB = useCallback(async (userId?: string) => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const res = await axiosClient.get(`/carts/user/${userId}`);

      // Backend trả Cart object → lấy items bên trong
      const items =
        res.data?.items ||
        res.data?.cartItems ||
        [];

      setCart(items);
    } catch (err: any) {
      console.error('Lỗi fetch giỏ hàng:', err);
      if (err.response?.status === 401) {
        setCart([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ===== 2. CHECK AUTH ON LOAD ===== */
  useEffect(() => {
    const savedUser = localStorage.getItem('user');

    if (savedUser) {
      try {
        const parsed: AuthUser = JSON.parse(savedUser);
        setUser(parsed);
        fetchUserCartFromDB(parsed.id); // ✅ FIX Ở ĐÂY
      } catch {
        localStorage.removeItem('user');
      }
    } else {
      // Guest cart
      const savedCart = localStorage.getItem('adidas_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, [fetchUserCartFromDB]);

  /* ===== 3. ADD TO CART ===== */
  const addToCart = async (
    product: Product,
    variant: ProductVariant,
    quantity: number = 1
  ) => {
    if (user) {
      try {
        const payload = {
          variant: { id: variant.id },
          quantity,
          price: variant.price || product.salePrice || product.basePrice
        };

        await axiosClient.post('/cart-items', payload);
        await fetchUserCartFromDB(user.id); // ✅ FIX
      } catch {
        alert('Không thể thêm vào giỏ hàng');
      }
    } else {
      // Guest
      const existing = cart.find(i => i.variant?.id === variant.id);
      let newCart: CartItem[];

      if (existing) {
        newCart = cart.map(i =>
          i.variant?.id === variant.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        newCart = [
          ...cart,
          {
            id: generateId(),
            product,
            variant,
            quantity,
            price: variant.price || product.salePrice || product.basePrice
          }
        ];
      }

      setCart(newCart);
      localStorage.setItem('adidas_cart', JSON.stringify(newCart));
    }
  };

  /* ===== 4. UPDATE QUANTITY ===== */
  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity < 1) return;

    if (user) {
      await axiosClient.put(`/cart-items/${itemId}`, { quantity });
      await fetchUserCartFromDB(user.id); // ✅ FIX
    } else {
      const newCart = cart.map(i =>
        i.id === itemId ? { ...i, quantity } : i
      );
      setCart(newCart);
      localStorage.setItem('adidas_cart', JSON.stringify(newCart));
    }
  };

  /* ===== 5. REMOVE ITEM ===== */
  const removeFromCart = async (itemId: number) => {
    if (user) {
      await axiosClient.delete(`/cart-items/${itemId}`);
      await fetchUserCartFromDB(user.id); // ✅ FIX
    } else {
      const newCart = cart.filter(i => i.id !== itemId);
      setCart(newCart);
      localStorage.setItem('adidas_cart', JSON.stringify(newCart));
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('adidas_cart');
  };

  /* ===== 6. TOTAL ===== */
  const totalAmount = cart.reduce((sum, item) => {
    const price = item.price || item.variant?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        fetchUserCart: () => fetchUserCartFromDB(user?.id),
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return ctx;
};
