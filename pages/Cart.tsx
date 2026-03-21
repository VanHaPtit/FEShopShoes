
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import { formatCurrency } from '../utils/format';
// import { TrashIcon } from '../components/SimpleIcons';
// import { CreditCard, Truck, Wallet, X, ChevronRight, CheckCircle2 } from 'lucide-react';
// // Import axiosClient đã cấu hình interceptor của bạn
// import axiosClient from '../api/axiosClient';

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
//       description: 'Thẻ tín dụng quốc tế (USD)',
//       icon: <Wallet className="w-6 h-6" />,
//     },
//   ];

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative bg-white w-full max-w-md border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
//         <div className="flex items-center justify-between border-b-2 border-black p-5">
//           <div>
//             <h2 className="text-xl font-black italic uppercase tracking-tighter">CHỌN THANH TOÁN</h2>
//             <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-0.5">
//               Tổng cộng: <span className="text-black font-black">{formatCurrency(finalAmount)}</span>
//             </p>
//           </div>
//           <button onClick={onClose} className="p-1.5 hover:bg-gray-100 transition-colors">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="p-5 space-y-3">
//           {paymentOptions.map((option) => (
//             <button
//               key={option.id}
//               onClick={() => setSelected(option.id)}
//               className={`w-full flex items-center gap-4 p-4 border-2 transition-all text-left relative
//                 ${selected === option.id ? 'border-[#5ecad1] bg-[#5ecad1] text-white' : 'border-gray-200 hover:border-[#5ecad1] hover:bg-[#5ecad1]/5'}`}
//             >
//               <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center border
//                 ${selected === option.id ? 'border-white/30 bg-white/20' : 'border-gray-200 bg-gray-50'}`}>
//                 {option.icon}
//               </div>
//               <div className="flex-grow min-w-0">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <span className="font-bold uppercase text-sm">{option.label}</span>
//                   {option.badge && (
//                     <span className={`text-[9px] font-black px-1.5 py-0.5 ${selected === option.id ? 'bg-white text-[#5ecad1]' : 'bg-black text-white'}`}>
//                       {option.badge}
//                     </span>
//                   )}
//                 </div>
//                 <p className={`text-xs mt-0.5 ${selected === option.id ? 'text-white/80' : 'text-gray-500'}`}>{option.description}</p>
//               </div>
//               {selected === option.id && <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />}
//             </button>
//           ))}
//         </div>

//         <div className="p-5 border-t-2 border-black space-y-3">
//           <button
//             onClick={() => selected && onConfirm(selected)}
//             disabled={!selected || isLoading}
//             className="w-full bg-black text-white py-4 font-bold uppercase text-sm tracking-widest hover:bg-gray-900 flex items-center justify-center gap-3 disabled:bg-gray-200"
//           >
//             {isLoading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" /> : "XÁC NHẬN THANH TOÁN"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── Main Cart Component ───────────────────────────────────────────────────────

// const Cart: React.FC = () => {
//   const navigate = useNavigate();
//   const {
//     cart,
//     removeFromCart,
//     updateQuantity,
//     totalAmount,
//     shippingFee,
//     finalAmount,
//     isLoading: cartLoading,
//     clearCart
//   } = useCart();

//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Helper để chuẩn bị dữ liệu gửi lên Backend (khớp với Entity Order trong Spring)
//   const prepareOrderData = (paymentMethod: PaymentMethod) => {
//     return {
//       totalPrice: finalAmount,
//       status: "PENDING",
//       paymentMethod: paymentMethod,
//       // Lưu ý: BE cần list OrderItems, hãy ánh xạ từ cart
//       orderItems: cart.map(item => ({
//         variant: { id: item.variant.id },
//         quantity: item.quantity,
//         price: item.variant.price
//       }))
//     };
//   };

//   const handleConfirmPayment = async (method: PaymentMethod) => {
//     setIsProcessing(true);
//     const orderData = prepareOrderData(method);

//     try {
//       switch (method) {
//         // ── 1. THANH TOÁN COD ────────────────────────────────────────────────
//         case 'COD': {
//           // Gọi API tạo đơn hàng thông thường
//           const response = await axiosClient.post('/orders', orderData);
//           const orderNumber = response.data.orderNumber;
//           clearCart(); // Xóa giỏ hàng local
//           navigate(`/order-success?orderNumber=${orderNumber}`);
//           break;
//         }

//         // ── 2. THANH TOÁN VNPAY ──────────────────────────────────────────────
//         case 'VNPAY': {
//           // Bước 1: Tạo đơn hàng để lấy orderNumber
//           const orderRes = await axiosClient.post('/orders', orderData);
//           const orderNumber = orderRes.data.orderNumber;

//           // Bước 2: Gọi PaymentController của bạn (GET /api/v1/payment/vn-pay)
//           const vnPayRes = await axiosClient.get(`/payment/vn-pay`, {
//             params: { orderNumber }
//           });

//           // VNPayResponse nằm trong field 'data' của ResponseObject
//           const paymentUrl = vnPayRes.data.data?.paymentUrl;
//           if (paymentUrl) {
//             window.location.href = paymentUrl;
//           } else {
//             throw new Error("Không nhận được link thanh toán VNPay");
//           }
//           break;
//         }

//         // ── 3. THANH TOÁN PAYPAL ─────────────────────────────────────────────
//         case 'PAYPAL': {
//           // Theo Controller của bạn: POST /api/v1/paypal nhận thẳng @RequestBody Order
//           // Và trả về ResponseEntity<String> là Approval URL
//           const response = await axiosClient.post('/paypal', orderData);

//           const approvalUrl = response.data; // Vì trả về String trực tiếp
//           if (approvalUrl && typeof approvalUrl === 'string') {
//             window.location.href = approvalUrl;
//           } else {
//             throw new Error("Không nhận được link thanh toán PayPal");
//           }
//           break;
//         }
//       }
//     } catch (error: any) {
//       console.error('[Payment Error]', error);
//       const msg = error.response?.data?.message || error.message || "Lỗi xử lý đơn hàng";
//       alert(msg);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // ── Render ──────────────────────────────────────────────────────────────────

//   const totalLoading = cartLoading || isProcessing;

//   if (cartLoading && cart.length === 0) {
//     return (
//       <div className="max-w-[1400px] mx-auto px-4 py-20 text-center">
//         <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-black mb-4" />
//         <p className="font-bold uppercase tracking-widest text-gray-400">Đang tải giỏ hàng...</p>
//       </div>
//     );
//   }

//   if (cart.length === 0) {
//     return (
//       <div className="max-w-[1400px] mx-auto px-4 py-20 text-center space-y-6">
//         <h1 className="text-5xl font-black italic uppercase tracking-tighter">GIỎ HÀNG TRỐNG</h1>
//         <Link to="/shop" className="inline-block bg-black text-white px-10 py-4 font-bold uppercase text-sm hover:opacity-80">
//           MUA SẮM NGAY
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <>
//       {showPaymentModal && (
//         <PaymentModal
//           onClose={() => setShowPaymentModal(false)}
//           onConfirm={handleConfirmPayment}
//           isLoading={totalLoading}
//           finalAmount={finalAmount}
//         />
//       )}

//       <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-10">
//         <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-10">GIỎ HÀNG CỦA BẠN</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
//           {/* Cart Items */}
//           <div className="lg:col-span-8 space-y-6">
//             {cart.map((item) => (
//               <div key={item.id} className="flex flex-col sm:flex-row border-b border-gray-100 pb-6">
//                 <div className="w-full sm:w-40 aspect-square bg-gray-100 flex-shrink-0">
//                   <img
//                     src={item.variant?.product?.images?.[0] || 'https://placehold.co/400x400?text=No+Image'}
//                     alt={item.variant?.product?.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="flex-grow sm:ml-6 mt-4 sm:mt-0 flex flex-col justify-between">
//                   <div className="flex justify-between items-start">
//                     <div className="space-y-1">
//                       <h3 className="font-bold uppercase text-lg italic">{item.variant?.product?.name}</h3>
//                       <p className="text-[12px] font-bold uppercase text-gray-500">
//                         Màu: {item.variant?.color} | Size: {item.variant?.size}
//                       </p>
//                       <div className="flex items-center space-x-4 mt-4">
//                         <div className="flex items-center border border-black h-10">
//                           <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1 || totalLoading} className="px-3">-</button>
//                           <span className="w-10 text-center font-bold text-xs">{item.quantity}</span>
//                           <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={totalLoading} className="px-3">+</button>
//                         </div>
//                         <button onClick={() => removeFromCart(item.id)} disabled={totalLoading} className="text-gray-400 hover:text-red-600">
//                           <TrashIcon className="w-5 h-5" />
//                         </button>
//                       </div>
//                     </div>
//                     <div className="text-right font-bold text-lg">
//                       {formatCurrency((item.variant?.price || 0) * item.quantity)}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-4">
//             <div className="border-2 border-black p-6 space-y-6 sticky top-24">
//               <h2 className="text-xl font-black italic uppercase tracking-tighter">TÓM TẮT ĐƠN HÀNG</h2>
//               <div className="space-y-4 text-[13px] font-medium uppercase">
//                 <div className="flex justify-between">
//                   <span>Tạm tính</span>
//                   <span className="font-bold">{formatCurrency(totalAmount)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Vận chuyển</span>
//                   <span className="font-bold">{shippingFee === 0 ? 'MIỄN PHÍ' : formatCurrency(shippingFee)}</span>
//                 </div>
//                 <hr className="border-gray-100" />
//                 <div className="flex justify-between text-lg font-black italic">
//                   <span>TỔNG CỘNG</span>
//                   <span>{formatCurrency(finalAmount)}</span>
//                 </div>
//               </div>

//               <button
//                 onClick={() => setShowPaymentModal(true)}
//                 disabled={totalLoading}
//                 className="w-full bg-black text-white py-4 font-bold uppercase text-sm hover:bg-gray-900 transition-all flex items-center justify-center group"
//               >
//                 {totalLoading ? "ĐANG XỬ LÝ..." : "THANH TOÁN"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Cart;



import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/format';
import { TrashIcon } from '../components/SimpleIcons';
import { CreditCard, Truck, Wallet, X, CheckCircle2 } from 'lucide-react';
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
                ${selected === option.id
                  ? 'border-[#5ecad1] bg-[#5ecad1] text-white'
                  : 'border-gray-200 hover:border-[#5ecad1] hover:bg-[#5ecad1]/5'}`}
            >
              <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center border
                ${selected === option.id ? 'border-white/30 bg-white/20' : 'border-gray-200 bg-gray-50'}`}>
                {option.icon}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold uppercase text-sm">{option.label}</span>
                  {option.badge && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 ${selected === option.id ? 'bg-white text-[#5ecad1]' : 'bg-black text-white'
                      }`}>
                      {option.badge}
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-0.5 ${selected === option.id ? 'text-white/80' : 'text-gray-500'}`}>
                  {option.description}
                </p>
              </div>
              {selected === option.id && <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />}
            </button>
          ))}
        </div>

        <div className="p-5 border-t-2 border-black">
          <button
            onClick={() => selected && onConfirm(selected)}
            disabled={!selected || isLoading}
            className="w-full bg-black text-white py-4 font-bold uppercase text-sm tracking-widest hover:bg-gray-900 flex items-center justify-center gap-3 disabled:bg-gray-200"
          >
            {isLoading
              ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
              : "XÁC NHẬN THANH TOÁN"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Custom Checkbox ───────────────────────────────────────────────────────────

const Checkbox: React.FC<{
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}> = ({ checked, onChange, disabled }) => (
  <button
    onClick={onChange}
    disabled={disabled}
    className={`flex-shrink-0 w-5 h-5 border-2 transition-all flex items-center justify-center
      ${checked ? 'bg-black border-black' : 'bg-white border-gray-300 hover:border-black'}
      ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    aria-checked={checked}
    role="checkbox"
  >
    {checked && (
      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </button>
);

// ─── Main Cart Component ───────────────────────────────────────────────────────

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    shippingFee: contextShippingFee,
    isLoading: cartLoading,
  } = useCart();

  // ── Selection state — mặc định tích hết ──────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<number | string>>(
    () => new Set(cart.map((i) => i.id))
  );

  const toggleItem = (id: number | string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allChecked = cart.length > 0 && cart.every((i) => selectedIds.has(i.id));
  const someChecked = cart.some((i) => selectedIds.has(i.id));

  const toggleAll = () => {
    setSelectedIds(allChecked ? new Set() : new Set(cart.map((i) => i.id)));
  };

  // ── Chỉ tính tổng từ item được chọn (đơn giá × số lượng) ─────────────────
  const selectedItems = useMemo(
    () => cart.filter((i) => selectedIds.has(i.id)),
    [cart, selectedIds]
  );

  const selectedSubtotal = useMemo(
    () => selectedItems.reduce((sum, i) => sum + (i.variant?.price || 0) * i.quantity, 0),
    [selectedItems]
  );

  const SHIPPING_THRESHOLD = 500000;
  const selectedShippingFee =
    selectedItems.length === 0
      ? 0
      : selectedSubtotal >= SHIPPING_THRESHOLD
        ? 0
        : contextShippingFee;

  const selectedFinalAmount = selectedSubtotal + selectedShippingFee;

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const totalLoading = cartLoading || isProcessing;

  const prepareOrderData = (paymentMethod: PaymentMethod) => ({
    totalPrice: selectedFinalAmount,
    status: 'PENDING',
    paymentMethod,
    orderItems: selectedItems.map((item) => ({
      variant: { id: item.variant.id },
      quantity: item.quantity,
      price: item.variant.price,
    })),
  });

  const handleConfirmPayment = async (method: PaymentMethod) => {
    setIsProcessing(true);
    const orderData = prepareOrderData(method);
    try {
      switch (method) {
        case 'COD': {
          const response = await axiosClient.post('/orders', orderData);
          const orderNumber = response.data.orderNumber;
          selectedItems.forEach((item) => removeFromCart(item.id));
          navigate(`/order-success?orderNumber=${orderNumber}`);
          break;
        }
        case 'VNPAY': {
          const orderRes = await axiosClient.post('/orders', orderData);
          const orderNumber = orderRes.data.orderNumber;
          const vnPayRes = await axiosClient.get('/payment/vn-pay', { params: { orderNumber } });
          const paymentUrl = vnPayRes.data.data?.paymentUrl;
          if (paymentUrl) window.location.href = paymentUrl;
          else throw new Error('Không nhận được link thanh toán VNPay');
          break;
        }
        case 'PAYPAL': {
          const response = await axiosClient.post('/paypal', orderData);
          const approvalUrl = response.data;
          if (approvalUrl && typeof approvalUrl === 'string') window.location.href = approvalUrl;
          else throw new Error('Không nhận được link thanh toán PayPal');
          break;
        }
      }
    } catch (error: any) {
      console.error('[Payment Error]', error);
      alert(error.response?.data?.message || error.message || 'Lỗi xử lý đơn hàng');
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Empty / Loading states ────────────────────────────────────────────────

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

  // ── Main render ───────────────────────────────────────────────────────────

  return (
    <>
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handleConfirmPayment}
          isLoading={totalLoading}
          finalAmount={selectedFinalAmount}
        />
      )}

      <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-10">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-10">GIỎ HÀNG CỦA BẠN</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* ── Cart Items ── */}
          <div className="lg:col-span-8 space-y-0">

            {/* Select All header */}
            <div className="flex items-center gap-3 pb-4 border-b-2 border-black mb-2">
              <button
                onClick={toggleAll}
                disabled={totalLoading}
                className={`flex-shrink-0 w-5 h-5 border-2 transition-all flex items-center justify-center cursor-pointer
                  ${allChecked || someChecked ? 'bg-black border-black' : 'bg-white border-gray-300 hover:border-black'}`}
                aria-label="Chọn tất cả"
              >
                {allChecked ? (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : someChecked ? (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                ) : null}
              </button>
              <span className="font-bold uppercase text-xs tracking-widest text-gray-600">
                Chọn tất cả ({cart.length} sản phẩm)
              </span>
              {someChecked && (
                <span className="ml-auto text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Đã chọn {selectedItems.length}/{cart.length}
                </span>
              )}
            </div>

            {/* Item list */}
            <div className="space-y-6">
              {cart.map((item) => {
                const isSelected = selectedIds.has(item.id);
                // Chỉ hiển thị đơn giá cố định (không nhân số lượng)
                const unitPrice = item.variant?.price || 0;

                return (
                  <div
                    key={item.id}
                    className={`flex flex-col sm:flex-row border-b pb-6 transition-opacity duration-200
                      ${isSelected ? 'opacity-100 border-gray-100' : 'opacity-40 border-gray-100'}`}
                  >
                    {/* Checkbox */}
                    <div className="flex items-start pt-1 pr-4 flex-shrink-0">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleItem(item.id)}
                        disabled={totalLoading}
                      />
                    </div>

                    {/* Image */}
                    <div className="w-full sm:w-40 aspect-square bg-gray-100 flex-shrink-0">
                      <img
                        src={item.variant?.product?.images?.[0] || 'https://placehold.co/400x400?text=No+Image'}
                        alt={item.variant?.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-grow sm:ml-6 mt-4 sm:mt-0 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-bold uppercase text-lg italic">{item.variant?.product?.name}</h3>
                          <p className="text-[12px] font-bold uppercase text-gray-500">
                            Màu: {item.variant?.color} | Size: {item.variant?.size}
                          </p>
                          <div className="flex items-center space-x-4 mt-4">
                            <div className="flex items-center border border-black h-10">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || totalLoading}
                                className="px-3 hover:bg-gray-100 disabled:opacity-30"
                              >
                                -
                              </button>
                              <span className="w-10 text-center font-bold text-xs">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={totalLoading}
                                className="px-3 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              disabled={totalLoading}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Chỉ hiển thị đơn giá — không nhân số lượng */}
                        <div className="text-right">
                          <div className="font-bold text-lg">{formatCurrency(unitPrice)}</div>
                          {item.quantity > 1 && (
                            <div className="text-[11px] text-gray-400 font-medium mt-0.5">
                              đơn giá / sản phẩm
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-4">
            <div className="border-2 border-black p-6 space-y-6 sticky top-24">
              <h2 className="text-xl font-black italic uppercase tracking-tighter">TÓM TẮT ĐƠN HÀNG</h2>

              {/* Danh sách sản phẩm được chọn với tổng từng dòng */}
              {selectedItems.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-[12px]">
                      <span className="text-gray-600 truncate max-w-[60%]">
                        {item.variant?.product?.name}
                        <span className="text-gray-400 ml-1">×{item.quantity}</span>
                      </span>
                      <span className="font-bold flex-shrink-0 ml-2">
                        {formatCurrency((item.variant?.price || 0) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-gray-400 italic">Chưa có sản phẩm nào được chọn</p>
              )}

              <div className="space-y-4 text-[13px] font-medium uppercase border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-bold">{formatCurrency(selectedSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vận chuyển</span>
                  <span className="font-bold">
                    {selectedItems.length === 0
                      ? '—'
                      : selectedShippingFee === 0
                        ? 'MIỄN PHÍ'
                        : formatCurrency(selectedShippingFee)}
                  </span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between text-lg font-black italic">
                  <span>TỔNG CỘNG</span>
                  <span>{formatCurrency(selectedFinalAmount)}</span>
                </div>
              </div>

              <button
                onClick={() => setShowPaymentModal(true)}
                disabled={totalLoading || selectedItems.length === 0}
                className="w-full bg-black text-white py-4 font-bold uppercase text-sm hover:bg-gray-900 transition-all flex items-center justify-center disabled:bg-gray-200 disabled:cursor-not-allowed"
              >
                {totalLoading
                  ? 'ĐANG XỬ LÝ...'
                  : selectedItems.length === 0
                    ? 'CHƯA CHỌN SẢN PHẨM'
                    : `THANH TOÁN (${selectedItems.length})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;