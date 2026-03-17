import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product, ProductVariant } from '../types';
import { generateId } from '../utils/format';
import axiosClient from '../api/axiosClient';
import PaymentService from '../services/PaymentService';
import { useToast } from './ToastContext';

/* ================= TYPES ================= */

interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  token: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  totalAmount: number;
  shippingFee: number;
  finalAmount: number;
  checkoutWithVNPay: () => Promise<void>;
  fetchUserCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  /* ===== 1. FETCH CART FROM DB ===== */
  const fetchUserCartFromDB = useCallback(async (userId?: number) => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await axiosClient.get(`/carts/user/${userId}`);
      setCart(res.data?.items || res.data?.cartItems || []);
    } catch (err) {
      console.error('Lỗi fetch giỏ hàng:', err);
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
        fetchUserCartFromDB(parsed.id);
      } catch {
        localStorage.removeItem('user');
      }
    } else {
      const savedCart = localStorage.getItem('adidas_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, [fetchUserCartFromDB]);

  /* ===== 3. ADD TO CART ===== */
  const addToCart = async (product: Product, variant: ProductVariant, quantity: number = 1) => {
    if (user) {
      try {
        const payload = {
          variant: { id: variant.id },
          quantity,
          price: variant.price || product.salePrice || product.basePrice
        };
        await axiosClient.post('/cart-items', payload);
        await fetchUserCartFromDB(user.id);
        showToast("Đã thêm sản phẩm vào giỏ hàng", "success");
      } catch {
        showToast("Không thể thêm vào giỏ hàng", "error");
      }
    } else {
      const existing = cart.find(i => i.variant?.id === variant.id);
      let newCart: CartItem[];
      if (existing) {
        newCart = cart.map(i => i.variant?.id === variant.id ? { ...i, quantity: i.quantity + quantity } : i);
      } else {
        newCart = [...cart, { id: Number(generateId()), product, variant, quantity, price: variant.price || product.salePrice || product.basePrice }];
      }
      setCart(newCart);
      localStorage.setItem('adidas_cart', JSON.stringify(newCart));
      showToast("Đã thêm vào giỏ hàng (Khách)", "info");
    }
  };

  /* ===== 4. UPDATE QUANTITY ===== */
  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    if (user) {
      try {
        await axiosClient.put(`/cart-items/${itemId}`, { quantity });
        await fetchUserCartFromDB(user.id);
      } catch {
        showToast("Lỗi cập nhật số lượng", "error");
      }
    } else {
      const newCart = cart.map(i => i.id === itemId ? { ...i, quantity } : i);
      setCart(newCart);
      localStorage.setItem('adidas_cart', JSON.stringify(newCart));
    }
  };

  /* ===== 5. REMOVE ITEM ===== */
  const removeFromCart = async (itemId: number) => {
    if (user) {
      try {
        await axiosClient.delete(`/cart-items/${itemId}`);
        await fetchUserCartFromDB(user.id);
        showToast("Đã xóa sản phẩm", "info");
      } catch {
        showToast("Lỗi xóa sản phẩm", "error");
      }
    } else {
      const newCart = cart.filter(i => i.id !== itemId);
      setCart(newCart);
      localStorage.setItem('adidas_cart', JSON.stringify(newCart));
      showToast("Đã xóa sản phẩm", "info");
    }
  };

  /* ===== 6. PAYMENT LOGIC ===== */
  const totalAmount = cart.reduce((sum, item) => sum + (item.price || item.variant?.price || 0) * item.quantity, 0);
  const shippingFee = totalAmount > 1500000 || totalAmount === 0 ? 0 : 50000;
  const finalAmount = totalAmount + shippingFee;

  const checkoutWithVNPay = async () => {
    if (!user) {
      showToast("Vui lòng đăng nhập để thanh toán", "error");
      return;
    }
    setIsLoading(true);
    try {
      // Gọi service tạo URL thanh toán với tổng tiền cuối cùng
      const response = await PaymentService.createPaymentUrl(finalAmount);
      if (response && response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      showToast("Lỗi khởi tạo thanh toán VNPay", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('adidas_cart');
  };

  return (
    <CartContext.Provider value={{
      cart, 
      addToCart,    
      removeFromCart,  
      updateQuantity,  
      clearCart, 
      totalAmount, 
      shippingFee, 
      finalAmount, 
      checkoutWithVNPay,
      fetchUserCart: () => fetchUserCartFromDB(user?.id), 
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};