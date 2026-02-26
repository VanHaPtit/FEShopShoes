
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { CartItem, Product, ProductVariant } from '../types';
// import { generateId } from '../utils/format';

// interface CartContextType {
//   cart: CartItem[];
//   addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
//   removeFromCart: (itemId: string) => void;
//   updateQuantity: (itemId: string, quantity: number) => void;
//   clearCart: () => void;
//   totalAmount: number;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [cart, setCart] = useState<CartItem[]>(() => {
//     const saved = localStorage.getItem('adidas_cart');
//     return saved ? JSON.parse(saved) : [];
//   });

//   useEffect(() => {
//     localStorage.setItem('adidas_cart', JSON.stringify(cart));
//   }, [cart]);

//   const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
//     setCart(prev => {
//       const existing = prev.find(item => item.product.id === product.id && item.variant.id === variant.id);
//       if (existing) {
//         return prev.map(item => 
//           item.id === existing.id 
//             ? { ...item, quantity: item.quantity + quantity } 
//             : item
//         );
//       }
//       return [...prev, { id: generateId(), product, variant, quantity }];
//     });
//   };

//   const removeFromCart = (itemId: string) => {
//     setCart(prev => prev.filter(item => item.id !== itemId));
//   };

//   const updateQuantity = (itemId: string, quantity: number) => {
//     if (quantity < 1) return;
//     setCart(prev => prev.map(item => 
//       item.id === itemId ? { ...item, quantity } : item
//     ));
//   };

//   const clearCart = () => setCart([]);

//   const totalAmount = cart.reduce((acc, item) => acc + (item.variant.price || item.product.salePrice || item.product.basePrice) * item.quantity, 0);

//   return (
//     <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) throw new Error("useCart must be used within a CartProvider");
//   return context;
// };




// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { CartItem, Product, ProductVariant } from '../types';
// import { generateId } from '../utils/format';
// import axiosClient from '../api/axiosClient';

// interface CartContextType {
//   cart: CartItem[];
//   addToCart: (product: Product, variant: ProductVariant, quantity?: number) => Promise<void>;
//   removeFromCart: (itemId: any) => Promise<void>;
//   updateQuantity: (itemId: any, quantity: number) => Promise<void>;
//   clearCart: () => void;
//   totalAmount: number;
//   fetchUserCart: () => Promise<void>;
//   isLoading: boolean;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [user, setUser] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   // 1. Hàm lấy giỏ hàng từ Database
//   const fetchUserCartFromDB = useCallback(async (userId: number) => {
//     if (!userId) return;
//     setIsLoading(true);
//     try {
//       const res = await axiosClient.get(`/carts/user/${userId}`);
//       // Backend của bạn trả về object Cart, ta lấy mảng items bên trong
//       const items = res.data.items || res.data.cartItems || [];
//       setCart(items);
//     } catch (err: any) {
//       console.error("Lỗi fetch giỏ hàng:", err);
//       // Lỗi 401 đã được axiosClient xử lý (xóa user), nên ở đây ta chỉ cần reset cart
//       if (err.response?.status === 401) setCart([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // 2. Kiểm tra trạng thái đăng nhập khi khởi tạo trang web
//   useEffect(() => {
//     const checkAuth = () => {
//       const savedUser = localStorage.getItem('user');
//       if (savedUser) {
//         const parsedUser = JSON.parse(savedUser);
//         setUser(parsedUser);
//         fetchUserCartFromDB(parsedUser.id);
//       } else {
//         const savedCart = localStorage.getItem('adidas_cart');
//         if (savedCart) setCart(JSON.parse(savedCart));
//       }
//     };
//     checkAuth();
//   }, [fetchUserCartFromDB]);

//   // 3. Thêm sản phẩm vào giỏ hàng
//   const addToCart = async (product: Product, variant: ProductVariant, quantity: number = 1) => {
//     if (user) {
//       // ĐÃ ĐĂNG NHẬP: Gửi lên Server
//       try {
//         const payload = {
//           variant: { id: variant.id }, // Để Backend dùng findById
//           quantity: quantity,
//           price: variant.price || product.salePrice || product.basePrice
//         };
//         await axiosClient.post('/cart-items', payload);
//         await fetchUserCartFromDB(user.id); // Tải lại để đảm bảo dữ liệu khớp DB
//       } catch (err: any) {
//         alert("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
//       }
//     } else {
//       // KHÁCH: Lưu LocalStorage
//       const existing = cart.find(item => item.variant?.id === variant.id);
//       let newCart;
//       if (existing) {
//         newCart = cart.map(item =>
//           item.variant.id === variant.id ? { ...item, quantity: item.quantity + quantity } : item
//         );
//       } else {
//         newCart = [...cart, {
//           id: generateId(),
//           product,
//           variant,
//           quantity,
//           price: variant.price || product.salePrice || product.basePrice
//         }];
//       }
//       setCart(newCart);
//       localStorage.setItem('adidas_cart', JSON.stringify(newCart));
//     }
//   };

//   // 4. Cập nhật số lượng
//   const updateQuantity = async (itemId: any, quantity: number) => {
//     if (quantity < 1) return;
//     if (user) {
//       try {
//         await axiosClient.put(`/cart-items/${itemId}`, { quantity });
//         await fetchUserCartFromDB(user.id);
//       } catch (err) {
//         console.error("Lỗi update số lượng server");
//       }
//     } else {
//       const newCart = cart.map(item => item.id === itemId ? { ...item, quantity } : item);
//       setCart(newCart);
//       localStorage.setItem('adidas_cart', JSON.stringify(newCart));
//     }
//   };

//   // 5. Xóa sản phẩm khỏi giỏ
//   const removeFromCart = async (itemId: any) => {
//     if (user) {
//       try {
//         await axiosClient.delete(`/cart-items/${itemId}`);
//         await fetchUserCartFromDB(user.id);
//       } catch (err) {
//         console.error("Lỗi xóa item server");
//       }
//     } else {
//       const newCart = cart.filter(item => item.id !== itemId);
//       setCart(newCart);
//       localStorage.setItem('adidas_cart', JSON.stringify(newCart));
//     }
//   };

//   const clearCart = () => {
//     setCart([]);
//     localStorage.removeItem('adidas_cart');
//   };

//   // 6. Tính tổng tiền (Dựa trên giá của từng Item)
//   const totalAmount = cart.reduce((acc, item) => {
//     const price = item.price || item.variant?.price || 0;
//     return acc + (price * item.quantity);
//   }, 0);

//   return (
//     <CartContext.Provider value={{
//       cart,
//       addToCart,
//       removeFromCart,
//       updateQuantity,
//       clearCart,
//       totalAmount,
//       fetchUserCart: () => fetchUserCartFromDB(user?.id),
//       isLoading
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) throw new Error("useCart must be used within a CartProvider");
//   return context;
// };










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
import PaymentService from '../services/PaymentService';
import { useToast } from './ToastContext'; // Import useToast

/* ================= TYPES ================= */

interface AuthUser {
  id: string; // Đổi thành string để khớp với logic fetchUserCartFromDB
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
  shippingFee: number;
  finalAmount: number;
  fetchUserCart: () => Promise<void>;
  checkoutWithVNPay: () => Promise<void>; // Thêm hàm checkout
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
  const fetchUserCartFromDB = useCallback(async (userId?: string) => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const res = await axiosClient.get(`/carts/user/${userId}`);
      // Linh hoạt theo cấu trúc trả về của Backend
      const items = res.data?.items || res.data?.cartItems || res.data || [];
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
  const addToCart = async (
    product: Product,
    variant: ProductVariant,
    quantity: number = 1
  ) => {
    if (user) {
      try {
        const payload = {
          variantId: variant.id, // Thường backend nhận variantId thay vì object
          quantity,
          price: variant.price || product.salePrice || product.basePrice
        };

        await axiosClient.post('/cart-items', payload);
        await fetchUserCartFromDB(user.id);
        showToast("Đã thêm vào giỏ hàng", "success");
      } catch (error) {
        showToast("Không thể thêm vào giỏ hàng", "error");
      }
    } else {
      // Logic cho khách (Guest)
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
            id: Date.now(), // Fake ID cho guest
            product,
            variant,
            quantity,
            price: variant.price || product.salePrice || product.basePrice
          }
        ];
      }

      setCart(newCart);
      localStorage.setItem('adidas_cart', JSON.stringify(newCart));
      showToast("Đã thêm vào giỏ hàng (Guest)", "success");
    }
  };

  /* ===== 4. UPDATE QUANTITY ===== */
  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity < 1) return;

    try {
      if (user) {
        await axiosClient.put(`/cart-items/${itemId}`, { quantity });
        await fetchUserCartFromDB(user.id);
      } else {
        const newCart = cart.map(i =>
          i.id === itemId ? { ...i, quantity } : i
        );
        setCart(newCart);
        localStorage.setItem('adidas_cart', JSON.stringify(newCart));
      }
    } catch (error) {
      showToast("Lỗi cập nhật số lượng", "error");
    }
  };

  /* ===== 5. REMOVE ITEM ===== */
  const removeFromCart = async (itemId: number) => {
    try {
      if (user) {
        await axiosClient.delete(`/cart-items/${itemId}`);
        await fetchUserCartFromDB(user.id);
      } else {
        const newCart = cart.filter(i => i.id !== itemId);
        setCart(newCart);
        localStorage.setItem('adidas_cart', JSON.stringify(newCart));
      }
      showToast("Đã xóa sản phẩm", "info");
    } catch (error) {
      showToast("Lỗi xóa sản phẩm", "error");
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('adidas_cart');
  };

  /* ===== 6. CALCULATION ===== */
  const totalAmount = cart.reduce((sum, item) => {
    const price = item.price || item.variant?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const shippingFee = totalAmount > 1500000 || totalAmount === 0 ? 0 : 50000;
  const finalAmount = totalAmount + shippingFee;

  /* ===== 7. VNPAY CHECKOUT ===== */
  const checkoutWithVNPay = async () => {
    if (!user) {
      showToast("Vui lòng đăng nhập để thanh toán", "error");
      return;
    }
    
    if (cart.length === 0) {
      showToast("Giỏ hàng đang trống", "error");
      return;
    }

    setIsLoading(true);
    try {
      // Gọi service tạo URL thanh toán
      // Truyền finalAmount cho backend xử lý
      const data = await PaymentService.createPaymentUrl(finalAmount);
      
      if (data && data.url) {
        window.location.href = data.url; // Chuyển hướng sang VNPay
      } else {
        throw new Error("Không nhận được URL thanh toán");
      }
    } catch (error) {
      console.error("Payment error:", error);
      showToast("Lỗi khởi tạo thanh toán VNPay", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        shippingFee,
        finalAmount,
        fetchUserCart: () => fetchUserCartFromDB(user?.id),
        checkoutWithVNPay,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return ctx;
};
