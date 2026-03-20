
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import { formatCurrency } from '../utils/format';
// import { TrashIcon } from '../components/SimpleIcons';
// import { CreditCard, Truck, Wallet } from 'lucide-react';


// const Cart: React.FC = () => {
//   // Lấy toàn bộ dữ liệu đã tính toán sẵn từ Context
//   const { 
//     cart, 
//     removeFromCart, 
//     updateQuantity, 
//     totalAmount, 
//     shippingFee, 
//     finalAmount, 
//     checkoutWithVNPay, 
//     isLoading 
//   } = useCart();

//   if (isLoading && cart.length === 0) {
//     return (
//       <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-20 text-center">
//         <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black mb-4"></div>
//         <p className="font-bold italic uppercase tracking-widest text-gray-400">Đang tải giỏ hàng...</p>
//       </div>
//     );
//   }

//   if (cart.length === 0) {
//     return (
//       <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-20 text-center space-y-6">
//         <h1 className="text-5xl font-black italic uppercase tracking-tighter">GIỎ HÀNG TRỐNG</h1>
//         <p className="text-gray-500 font-medium max-w-md mx-auto italic">
//           Hiện tại bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá những BST mới nhất của chúng tôi.
//         </p>
//         <div className="pt-6">
//           <Link to="/shop" className="bg-black text-white px-10 py-4 font-bold uppercase text-sm tracking-widest hover:opacity-80">
//             MUA SẮM NGAY
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-10">
//       <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-10">GIỎ HÀNG CỦA BẠN</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
//         {/* Danh sách sản phẩm */}
//         <div className="lg:col-span-8 space-y-6">
//           {cart.map((item) => (
//             <div key={item.id} className="flex flex-col sm:flex-row border-b border-gray-100 pb-6">
//               <div className="w-full sm:w-40 aspect-square bg-gray-100 flex-shrink-0">
//                 <img
//                   src={item.variant?.product?.images?.[0] || 'https://placehold.co/400x400?text=No+Image'}
//                   alt={item.variant?.product?.name || 'Product'}
//                   className="w-full h-full object-cover"
//                 />
//               </div>

//               <div className="flex-grow sm:ml-6 mt-4 sm:mt-0 flex flex-col justify-between">
//                 <div className="flex justify-between items-start">
//                   <div className="space-y-1">
//                     <h3 className="font-bold uppercase text-lg italic">
//                       {item.variant?.product?.name || 'Sản phẩm không xác định'}
//                     </h3>

//                     <p className="text-[12px] font-bold uppercase text-gray-500">
//                       Màu: {item.variant?.color || 'N/A'} | Size: {item.variant?.size || 'N/A'}
//                     </p>

//                     <div className="flex items-center space-x-4 mt-4">
//                       <div className="flex items-center border border-black h-10">
//                         <button
//                           onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                           className="px-3 hover:bg-gray-100 transition-colors"
//                           disabled={item.quantity <= 1 || isLoading}
//                         >
//                           -
//                         </button>
//                         <span className="w-10 text-center font-bold text-xs">{item.quantity}</span>
//                         <button
//                           onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                           className="px-3 hover:bg-gray-100 transition-colors"
//                           disabled={isLoading}
//                         >
//                           +
//                         </button>
//                       </div>

//                       <button
//                         onClick={() => removeFromCart(item.id)}
//                         disabled={isLoading}
//                         className="text-gray-400 hover:text-red-600 transition-colors"
//                         title="Xóa khỏi giỏ hàng"
//                       >
//                         <TrashIcon className="w-5 h-5" />
//                       </button>
//                     </div>
//                   </div>

//                   <div className="text-right">
//                     <p className="font-bold text-lg">
//                       {formatCurrency((item.variant?.price || item.price || 0) * item.quantity)}
//                     </p>
//                     <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">
//                       {formatCurrency(item.variant?.price || item.price || 0)} / sản phẩm
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Tóm tắt đơn hàng */}
//         <div className="lg:col-span-4 space-y-6">
//           <div className="border-2 border-black p-6 space-y-6 sticky top-24">
//             <h2 className="text-xl font-black italic uppercase tracking-tighter">TÓM TẮT ĐƠN HÀNG</h2>

//             <div className="space-y-4 text-[13px] font-medium uppercase tracking-widest">
//               <div className="flex justify-between">
//                 <span>Tạm tính</span>
//                 <span className="font-bold">{formatCurrency(totalAmount)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Vận chuyển</span>
//                 {/* Sử dụng shippingFee từ Context */}
//                 <span className="font-bold">{shippingFee === 0 ? 'MIỄN PHÍ' : formatCurrency(shippingFee)}</span>
//               </div>
//               <hr className="border-gray-100" />
//               <div className="flex justify-between text-lg font-black tracking-tighter italic">
//                 <span>TỔNG CỘNG</span>
//                 {/* Sử dụng finalAmount từ Context */}
//                 <span>{formatCurrency(finalAmount)}</span>
//               </div>
//             </div>

//             <button 
//               onClick={checkoutWithVNPay} 
//               disabled={isLoading} 
//               className="w-full bg-black text-white py-4 font-bold uppercase text-sm tracking-widest hover:bg-gray-900 transition-all flex items-center justify-center group disabled:bg-gray-400"
//             >
//               {isLoading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-3"></div>
//                   ĐANG XỬ LÝ...
//                 </>
//               ) : (
//                 <>
//                   THANH TOÁN VNPAY
//                   <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
//                 </>
//               )}
//             </button>
//           </div>

//           {/* Thông báo miễn phí vận chuyển */}
//           {shippingFee > 0 && (
//             <div className="bg-[#ede734] p-4 text-center">
//               <p className="text-[10px] font-bold uppercase tracking-widest">
//                 Mua thêm {formatCurrency(1500000 - totalAmount)} để được MIỄN PHÍ VẬN CHUYỂN
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;





















import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/format';
import { TrashIcon } from '../components/SimpleIcons';
import { CreditCard, Truck, Wallet, X, ChevronRight, CheckCircle2 } from 'lucide-react';
// Import axiosClient đã cấu hình interceptor của bạn
import axiosClient from '../api/axiosClient';

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentMethod = 'COD' | 'VNPAY' | 'PAYPAL';

interface PaymentOption {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
}

// ─── Payment Method Modal ──────────────────────────────────────────────────────

const PaymentModal: React.FC<{
  onClose: () => void;
  onConfirm: (method: PaymentMethod) => void;
  isLoading: boolean;
  finalAmount: number;
}> = ({ onClose, onConfirm, isLoading, finalAmount }) => {
  const [selected, setSelected] = useState<PaymentMethod | null>(null);

  const paymentOptions: PaymentOption[] = [
    {
      id: 'COD',
      label: 'Thanh toán khi nhận hàng',
      description: 'Trả tiền mặt khi shipper giao hàng tận nơi',
      icon: <Truck className="w-6 h-6" />,
    },
    {
      id: 'VNPAY',
      label: 'Thanh toán VNPay',
      description: 'Thẻ ATM, Internet Banking, QR Code',
      icon: <CreditCard className="w-6 h-6" />,
      badge: 'PHỔ BIẾN',
    },
    {
      id: 'PAYPAL',
      label: 'Thanh toán PayPal',
      description: 'Thẻ tín dụng quốc tế (USD)',
      icon: <Wallet className="w-6 h-6" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between border-b-2 border-black p-5">
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter">CHỌN THANH TOÁN</h2>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-0.5">
              Tổng cộng: <span className="text-black font-black">{formatCurrency(finalAmount)}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {paymentOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={`w-full flex items-center gap-4 p-4 border-2 transition-all text-left relative
                ${selected === option.id ? 'border-[#5ecad1] bg-[#5ecad1] text-white' : 'border-gray-200 hover:border-[#5ecad1] hover:bg-[#5ecad1]/5'}`}
            >
              <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center border
                ${selected === option.id ? 'border-white/30 bg-white/20' : 'border-gray-200 bg-gray-50'}`}>
                {option.icon}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold uppercase text-sm">{option.label}</span>
                  {option.badge && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 ${selected === option.id ? 'bg-white text-[#5ecad1]' : 'bg-black text-white'}`}>
                      {option.badge}
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-0.5 ${selected === option.id ? 'text-white/80' : 'text-gray-500'}`}>{option.description}</p>
              </div>
              {selected === option.id && <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />}
            </button>
          ))}
        </div>

        <div className="p-5 border-t-2 border-black space-y-3">
          <button
            onClick={() => selected && onConfirm(selected)}
            disabled={!selected || isLoading}
            className="w-full bg-black text-white py-4 font-bold uppercase text-sm tracking-widest hover:bg-gray-900 flex items-center justify-center gap-3 disabled:bg-gray-200"
          >
            {isLoading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" /> : "XÁC NHẬN THANH TOÁN"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Cart Component ───────────────────────────────────────────────────────

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalAmount,
    shippingFee,
    finalAmount,
    isLoading: cartLoading,
    clearCart
  } = useCart();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper để chuẩn bị dữ liệu gửi lên Backend (khớp với Entity Order trong Spring)
  const prepareOrderData = (paymentMethod: PaymentMethod) => {
    return {
      totalPrice: finalAmount,
      status: "PENDING",
      paymentMethod: paymentMethod,
      // Lưu ý: BE cần list OrderItems, hãy ánh xạ từ cart
      orderItems: cart.map(item => ({
        variant: { id: item.variant.id },
        quantity: item.quantity,
        price: item.variant.price
      }))
    };
  };

  const handleConfirmPayment = async (method: PaymentMethod) => {
    setIsProcessing(true);
    const orderData = prepareOrderData(method);

    try {
      switch (method) {
        // ── 1. THANH TOÁN COD ────────────────────────────────────────────────
        case 'COD': {
          // Gọi API tạo đơn hàng thông thường
          const response = await axiosClient.post('/orders', orderData);
          const orderNumber = response.data.orderNumber;
          clearCart(); // Xóa giỏ hàng local
          navigate(`/order-success?orderNumber=${orderNumber}`);
          break;
        }

        // ── 2. THANH TOÁN VNPAY ──────────────────────────────────────────────
        case 'VNPAY': {
          // Bước 1: Tạo đơn hàng để lấy orderNumber
          const orderRes = await axiosClient.post('/orders', orderData);
          const orderNumber = orderRes.data.orderNumber;

          // Bước 2: Gọi PaymentController của bạn (GET /api/v1/payment/vn-pay)
          const vnPayRes = await axiosClient.get(`/payment/vn-pay`, {
            params: { orderNumber }
          });

          // VNPayResponse nằm trong field 'data' của ResponseObject
          const paymentUrl = vnPayRes.data.data?.paymentUrl;
          if (paymentUrl) {
            window.location.href = paymentUrl;
          } else {
            throw new Error("Không nhận được link thanh toán VNPay");
          }
          break;
        }

        // ── 3. THANH TOÁN PAYPAL ─────────────────────────────────────────────
        case 'PAYPAL': {
          // Theo Controller của bạn: POST /api/v1/paypal nhận thẳng @RequestBody Order
          // Và trả về ResponseEntity<String> là Approval URL
          const response = await axiosClient.post('/paypal', orderData);

          const approvalUrl = response.data; // Vì trả về String trực tiếp
          if (approvalUrl && typeof approvalUrl === 'string') {
            window.location.href = approvalUrl;
          } else {
            throw new Error("Không nhận được link thanh toán PayPal");
          }
          break;
        }
      }
    } catch (error: any) {
      console.error('[Payment Error]', error);
      const msg = error.response?.data?.message || error.message || "Lỗi xử lý đơn hàng";
      alert(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  const totalLoading = cartLoading || isProcessing;

  if (cartLoading && cart.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-black mb-4" />
        <p className="font-bold uppercase tracking-widest text-gray-400">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter">GIỎ HÀNG TRỐNG</h1>
        <Link to="/shop" className="inline-block bg-black text-white px-10 py-4 font-bold uppercase text-sm hover:opacity-80">
          MUA SẮM NGAY
        </Link>
      </div>
    );
  }

  return (
    <>
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handleConfirmPayment}
          isLoading={totalLoading}
          finalAmount={finalAmount}
        />
      )}

      <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-10">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-10">GIỎ HÀNG CỦA BẠN</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row border-b border-gray-100 pb-6">
                <div className="w-full sm:w-40 aspect-square bg-gray-100 flex-shrink-0">
                  <img
                    src={item.variant?.product?.images?.[0] || 'https://placehold.co/400x400?text=No+Image'}
                    alt={item.variant?.product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow sm:ml-6 mt-4 sm:mt-0 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-bold uppercase text-lg italic">{item.variant?.product?.name}</h3>
                      <p className="text-[12px] font-bold uppercase text-gray-500">
                        Màu: {item.variant?.color} | Size: {item.variant?.size}
                      </p>
                      <div className="flex items-center space-x-4 mt-4">
                        <div className="flex items-center border border-black h-10">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1 || totalLoading} className="px-3">-</button>
                          <span className="w-10 text-center font-bold text-xs">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={totalLoading} className="px-3">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} disabled={totalLoading} className="text-gray-400 hover:text-red-600">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right font-bold text-lg">
                      {formatCurrency((item.variant?.price || 0) * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="border-2 border-black p-6 space-y-6 sticky top-24">
              <h2 className="text-xl font-black italic uppercase tracking-tighter">TÓM TẮT ĐƠN HÀNG</h2>
              <div className="space-y-4 text-[13px] font-medium uppercase">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-bold">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vận chuyển</span>
                  <span className="font-bold">{shippingFee === 0 ? 'MIỄN PHÍ' : formatCurrency(shippingFee)}</span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between text-lg font-black italic">
                  <span>TỔNG CỘNG</span>
                  <span>{formatCurrency(finalAmount)}</span>
                </div>
              </div>

              <button
                onClick={() => setShowPaymentModal(true)}
                disabled={totalLoading}
                className="w-full bg-black text-white py-4 font-bold uppercase text-sm hover:bg-gray-900 transition-all flex items-center justify-center group"
              >
                {totalLoading ? "ĐANG XỬ LÝ..." : "THANH TOÁN"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;














// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import { formatCurrency } from '../utils/format';
// import { TrashIcon } from '../components/SimpleIcons';
// import { CreditCard, Truck, Wallet, X, ChevronRight, CheckCircle2 } from 'lucide-react';

// // ─── Types ────────────────────────────────────────────────────────────────────

// type PaymentMethod = 'COD' | 'VNPAY' | 'PAYPAL';

// interface PaymentOption {
//   id: PaymentMethod;
//   label: string;
//   description: string;
//   icon: React.ReactNode;
//   badge?: string;
// }

// // ─── Payment Method Modal ──────────────────────────────────────────────────────

// const PaymentModal: React.FC<{
//   onClose: () => void;
//   onConfirm: (method: PaymentMethod) => void;
//   isLoading: boolean;
//   finalAmount: number;
// }> = ({ onClose, onConfirm, isLoading, finalAmount }) => {
//   const [selected, setSelected] = useState<PaymentMethod | null>(null);

//   const paymentOptions: PaymentOption[] = [
//     {
//       id: 'COD',
//       label: 'Thanh toán khi nhận hàng',
//       description: 'Trả tiền mặt khi shipper giao hàng tận nơi',
//       icon: <Truck className="w-6 h-6" />,
//     },
//     {
//       id: 'VNPAY',
//       label: 'Thanh toán VNPay',
//       description: 'Thẻ ATM, Internet Banking, QR Code',
//       icon: <CreditCard className="w-6 h-6" />,
//       badge: 'PHỔ BIẾN',
//     },
//     {
//       id: 'PAYPAL',
//       label: 'Thanh toán PayPal',
//       description: 'Thẻ tín dụng quốc tế, tài khoản PayPal',
//       icon: <Wallet className="w-6 h-6" />,
//     },
//   ];

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div className="relative bg-white w-full max-w-md border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in fade-in slide-in-from-bottom-4 duration-200">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b-2 border-black p-5">
//           <div>
//             <h2 className="text-xl font-black italic uppercase tracking-tighter">
//               CHỌN THANH TOÁN
//             </h2>
//             <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-0.5">
//               Tổng cộng: <span className="text-black font-black">{formatCurrency(finalAmount)}</span>
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-1.5 hover:bg-gray-100 transition-colors rounded-sm"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Options */}
//         <div className="p-5 space-y-3">
//           {paymentOptions.map((option) => (
//             <button
//               key={option.id}
//               onClick={() => setSelected(option.id)}
//               className={`w-full flex items-center gap-4 p-4 border-2 transition-all text-left relative
//                 ${selected === option.id
//                   ? 'border-[#5ecad1] bg-[#5ecad1] text-white'
//                   : 'border-gray-200 hover:border-[#5ecad1] hover:bg-[#5ecad1]/5'
//                 }`}
//             >
//               {/* Icon */}
//               <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center border
//                 ${selected === option.id ? 'border-white/30 bg-white/20' : 'border-gray-200 bg-gray-50'}`}>
//                 {option.icon}
//               </div>

//               {/* Text */}
//               <div className="flex-grow min-w-0">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <span className="font-bold uppercase text-sm tracking-wide">{option.label}</span>
//                   {option.badge && (
//                     <span className={`text-[9px] font-black tracking-widest px-1.5 py-0.5
//                       ${selected === option.id ? 'bg-white text-[#5ecad1]' : 'bg-black text-white'}`}>
//                       {option.badge}
//                     </span>
//                   )}
//                 </div>
//                 <p className={`text-xs mt-0.5 ${selected === option.id ? 'text-white/80' : 'text-gray-500'}`}>
//                   {option.description}
//                 </p>
//               </div>

//               {/* Check */}
//               {selected === option.id && (
//                 <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
//               )}
//             </button>
//           ))}
//         </div>

//         {/* Footer */}
//         <div className="p-5 border-t-2 border-black space-y-3">
//           <button
//             onClick={() => selected && onConfirm(selected)}
//             disabled={!selected || isLoading}
//             className="w-full bg-black text-white py-4 font-bold uppercase text-sm tracking-widest
//               hover:bg-gray-900 transition-all flex items-center justify-center gap-3
//               disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
//           >
//             {isLoading ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
//                 ĐANG XỬ LÝ...
//               </>
//             ) : (
//               <>
//                 XÁC NHẬN THANH TOÁN
//                 <ChevronRight className="w-4 h-4" />
//               </>
//             )}
//           </button>
//           <button
//             onClick={onClose}
//             disabled={isLoading}
//             className="w-full py-2 text-xs font-bold uppercase tracking-widest text-gray-400
//               hover:text-black transition-colors disabled:pointer-events-none"
//           >
//             Huỷ
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── Main Cart Component ───────────────────────────────────────────────────────

// const Cart: React.FC = () => {
//   const {
//     cart,
//     removeFromCart,
//     updateQuantity,
//     totalAmount,
//     shippingFee,
//     finalAmount,
//     isLoading,
//   } = useCart();

//   const [showPaymentModal, setShowPaymentModal] = useState(false);

//   // ── Helpers ────────────────────────────────────────────────────────────────

//   /**
//    * Bước 1 (dùng chung): Gọi API tạo đơn hàng, trả về orderNumber.
//    * Truyền paymentMethod để BE biết phương thức (COD / VNPAY / PAYPAL).
//    */
//   const createOrder = async (paymentMethod: PaymentMethod): Promise<string> => {
//     const res = await fetch(`/api/orders`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       // Gửi toàn bộ cart và phương thức thanh toán lên BE
//       body: JSON.stringify({ paymentMethod, items: cart }),
//     });
//     if (!res.ok) {
//       const msg = await res.text();
//       throw new Error(msg || 'Tạo đơn hàng thất bại');
//     }
//     const data = await res.json();
//     // BE trả về object có field orderNumber (e.g. { orderNumber: "ORD-20240101-001", ... })
//     return data.orderNumber as string;
//   };

//   // ── Handlers ──────────────────────────────────────────────────────────────

//   const handleConfirmPayment = async (method: PaymentMethod) => {
//     try {
//       switch (method) {

//         // ── COD ─────────────────────────────────────────────────────────────
//         case 'COD': {
//           // Tạo đơn hàng với phương thức COD, BE tự set status = PENDING
//           const orderNumber = await createOrder('COD');
//           // Redirect tới trang xác nhận đơn hàng
//           window.location.href = `/order-success?orderNumber=${orderNumber}`;
//           break;
//         }

//         // ── VNPAY ───────────────────────────────────────────────────────────
//         case 'VNPAY': {
//           // Bước 1: Tạo đơn hàng → lấy orderNumber
//           const orderNumber = await createOrder('VNPAY');

//           // Bước 2: Gọi GET /api/payment/vn-pay?orderNumber=...
//           // BE sẽ tạo link thanh toán VNPay và trả về paymentUrl
//           const vnpayRes = await fetch(
//             `/api/payment/vn-pay?orderNumber=${encodeURIComponent(orderNumber)}`,
//             { method: 'GET' }
//           );
//           if (!vnpayRes.ok) throw new Error('Không thể tạo link thanh toán VNPay');

//           // BE trả về ResponseObject<VNPayResponse> dạng:
//           // { status: 200, message: "Success", data: { code: "00", message: "...", paymentUrl: "https://..." } }
//           const vnpayData = await vnpayRes.json();
//           const paymentUrl: string = vnpayData?.data?.paymentUrl;

//           if (!paymentUrl) throw new Error('Không nhận được link thanh toán từ VNPay');

//           // Bước 3: Redirect sang cổng thanh toán VNPay
//           window.location.href = paymentUrl;
//           break;
//         }

//         // ── PAYPAL ──────────────────────────────────────────────────────────
//         case 'PAYPAL': {
//           // Gọi POST /api/payment/paypal — BE tự tạo đơn + tạo PayPal payment
//           // và trả về approvalUrl dạng plain text
//           const paypalRes = await fetch(`/api/payment/paypal`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ items: cart }),
//           });
//           if (!paypalRes.ok) throw new Error('Không thể tạo thanh toán PayPal');

//           const approvalUrl: string = await paypalRes.text();
//           if (!approvalUrl) throw new Error('Không nhận được link PayPal');

//           // Redirect sang trang xác nhận của PayPal
//           window.location.href = approvalUrl;
//           break;
//         }
//       }
//     } catch (err: unknown) {
//       console.error('[Payment Error]', err);
//       alert(err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.');
//     }
//   };

//   // ── Render: Loading ────────────────────────────────────────────────────────

//   if (isLoading && cart.length === 0) {
//     return (
//       <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-20 text-center">
//         <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black mb-4" />
//         <p className="font-bold italic uppercase tracking-widest text-gray-400">Đang tải giỏ hàng...</p>
//       </div>
//     );
//   }

//   // ── Render: Empty ──────────────────────────────────────────────────────────

//   if (cart.length === 0) {
//     return (
//       <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-20 text-center space-y-6">
//         <h1 className="text-5xl font-black italic uppercase tracking-tighter">GIỎ HÀNG TRỐNG</h1>
//         <p className="text-gray-500 font-medium max-w-md mx-auto italic">
//           Hiện tại bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá những BST mới nhất của chúng tôi.
//         </p>
//         <div className="pt-6">
//           <Link
//             to="/shop"
//             className="bg-black text-white px-10 py-4 font-bold uppercase text-sm tracking-widest hover:opacity-80"
//           >
//             MUA SẮM NGAY
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   // ── Render: Main ───────────────────────────────────────────────────────────

//   return (
//     <>
//       {/* Payment Modal */}
//       {showPaymentModal && (
//         <PaymentModal
//           onClose={() => setShowPaymentModal(false)}
//           onConfirm={handleConfirmPayment}
//           isLoading={isLoading}
//           finalAmount={finalAmount}
//         />
//       )}

//       <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-10">
//         <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-10">GIỎ HÀNG CỦA BẠN</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
//           {/* ── Cart Items ── */}
//           <div className="lg:col-span-8 space-y-6">
//             {cart.map((item) => (
//               <div key={item.id} className="flex flex-col sm:flex-row border-b border-gray-100 pb-6">
//                 <div className="w-full sm:w-40 aspect-square bg-gray-100 flex-shrink-0">
//                   <img
//                     src={item.variant?.product?.images?.[0] || 'https://placehold.co/400x400?text=No+Image'}
//                     alt={item.variant?.product?.name || 'Product'}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 <div className="flex-grow sm:ml-6 mt-4 sm:mt-0 flex flex-col justify-between">
//                   <div className="flex justify-between items-start">
//                     <div className="space-y-1">
//                       <h3 className="font-bold uppercase text-lg italic">
//                         {item.variant?.product?.name || 'Sản phẩm không xác định'}
//                       </h3>
//                       <p className="text-[12px] font-bold uppercase text-gray-500">
//                         Màu: {item.variant?.color || 'N/A'} | Size: {item.variant?.size || 'N/A'}
//                       </p>

//                       <div className="flex items-center space-x-4 mt-4">
//                         <div className="flex items-center border border-black h-10">
//                           <button
//                             onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                             className="px-3 hover:bg-gray-100 transition-colors"
//                             disabled={item.quantity <= 1 || isLoading}
//                           >
//                             -
//                           </button>
//                           <span className="w-10 text-center font-bold text-xs">{item.quantity}</span>
//                           <button
//                             onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                             className="px-3 hover:bg-gray-100 transition-colors"
//                             disabled={isLoading}
//                           >
//                             +
//                           </button>
//                         </div>

//                         <button
//                           onClick={() => removeFromCart(item.id)}
//                           disabled={isLoading}
//                           className="text-gray-400 hover:text-red-600 transition-colors"
//                           title="Xóa khỏi giỏ hàng"
//                         >
//                           <TrashIcon className="w-5 h-5" />
//                         </button>
//                       </div>
//                     </div>

//                     <div className="text-right">
//                       <p className="font-bold text-lg">
//                         {formatCurrency((item.variant?.price || item.price || 0) * item.quantity)}
//                       </p>
//                       <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">
//                         {formatCurrency(item.variant?.price || item.price || 0)} / sản phẩm
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* ── Order Summary ── */}
//           <div className="lg:col-span-4 space-y-6">
//             <div className="border-2 border-black p-6 space-y-6 sticky top-24">
//               <h2 className="text-xl font-black italic uppercase tracking-tighter">TÓM TẮT ĐƠN HÀNG</h2>

//               <div className="space-y-4 text-[13px] font-medium uppercase tracking-widest">
//                 <div className="flex justify-between">
//                   <span>Tạm tính</span>
//                   <span className="font-bold">{formatCurrency(totalAmount)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Vận chuyển</span>
//                   <span className="font-bold">
//                     {shippingFee === 0 ? 'MIỄN PHÍ' : formatCurrency(shippingFee)}
//                   </span>
//                 </div>
//                 <hr className="border-gray-100" />
//                 <div className="flex justify-between text-lg font-black tracking-tighter italic">
//                   <span>TỔNG CỘNG</span>
//                   <span>{formatCurrency(finalAmount)}</span>
//                 </div>
//               </div>

//               {/* Nút THANH TOÁN mở modal */}
//               <button
//                 onClick={() => setShowPaymentModal(true)}
//                 disabled={isLoading}
//                 className="w-full bg-black text-white py-4 font-bold uppercase text-sm tracking-widest
//                   hover:bg-gray-900 transition-all flex items-center justify-center group
//                   disabled:bg-gray-400"
//               >
//                 {isLoading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-3" />
//                     ĐANG XỬ LÝ...
//                   </>
//                 ) : (
//                   <>
//                     THANH TOÁN
//                     <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
//                   </>
//                 )}
//               </button>

//               {/* Payment method icons preview */}
//               <div className="flex items-center justify-center gap-3 pt-1">
//                 <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
//                   <Truck className="w-3.5 h-3.5" />
//                   <span>COD</span>
//                 </div>
//                 <span className="text-gray-200">|</span>
//                 <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
//                   <CreditCard className="w-3.5 h-3.5" />
//                   <span>VNPay</span>
//                 </div>
//                 <span className="text-gray-200">|</span>
//                 <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
//                   <Wallet className="w-3.5 h-3.5" />
//                   <span>PayPal</span>
//                 </div>
//               </div>
//             </div>

//             {/* Free shipping banner */}
//             {shippingFee > 0 && (
//               <div className="bg-[#ede734] p-4 text-center">
//                 <p className="text-[10px] font-bold uppercase tracking-widest">
//                   Mua thêm {formatCurrency(1500000 - totalAmount)} để được MIỄN PHÍ VẬN CHUYỂN
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Cart;