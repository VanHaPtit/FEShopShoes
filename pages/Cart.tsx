// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import { formatCurrency } from '../utils/format';
// import { TrashIcon } from '../components/SimpleIcons';

// const Cart: React.FC = () => {
//   const { cart, removeFromCart, updateQuantity, totalAmount } = useCart();
//   const shipping = totalAmount > 1500000 ? 0 : 50000;

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
//         {/* Cart Items */}
//         <div className="lg:col-span-8 space-y-6">
//           {cart.map((item) => (
//             <div key={item.id} className="flex flex-col sm:flex-row border-b border-gray-100 pb-6">
//               <div className="w-full sm:w-40 aspect-square bg-gray-100 flex-shrink-0">
//                 <img
//                   src={item.product.images?.[0] || 'https://via.placeholder.com/150'}
//                   alt={item.product.name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>

//               <div className="flex-grow sm:ml-6 mt-4 sm:mt-0 flex flex-col justify-between">
//                 <div className="flex justify-between items-start">
//                   <div className="space-y-1">
//                     <h3 className="font-bold uppercase text-lg italic">{item.product.name}</h3>
//                     <p className="text-[12px] font-bold uppercase text-gray-500">
//                       Màu: {item.variant.color} | Size: {item.variant.size}
//                     </p>
//                     {/* Chức năng thay đổi số lượng */}
//                     <div className="flex items-center space-x-4 mt-4">
//                       <div className="flex items-center border border-black h-10">
//                         <button
//                           onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                           className="px-3 hover:bg-black hover:text-white transition-colors"
//                         >
//                           -
//                         </button>
//                         <span className="w-10 text-center font-bold text-xs">{item.quantity}</span>
//                         <button
//                           onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                           className="px-3 hover:bg-black hover:text-white transition-colors"
//                         >
//                           +
//                         </button>
//                       </div>

//                       {/* NÚT XÓA SẢN PHẨM */}
//                       <button
//                         onClick={() => removeFromCart(item.id)}
//                         className="text-gray-400 hover:text-black transition-colors"
//                         title="Xóa khỏi giỏ hàng"
//                       >
//                         <TrashIcon className="w-5 h-5" />
//                       </button>
//                     </div>
//                   </div>

//                   <div className="text-right">
//                     <p className="font-bold text-lg">{formatCurrency(item.variant.price * item.quantity)}</p>
//                     <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">
//                       {formatCurrency(item.variant.price)} / sản phẩm
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Summary Sidebar */}
//         <div className="lg:col-span-4 space-y-6">
//           <div className="border-2 border-black p-6 space-y-6">
//             <h2 className="text-xl font-black italic uppercase tracking-tighter">TÓM TẮT ĐƠN HÀNG</h2>

//             <div className="space-y-4 text-[13px] font-medium uppercase tracking-widest">
//               <div className="flex justify-between">
//                 <span>Tạm tính</span>
//                 <span className="font-bold">{formatCurrency(totalAmount)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Vận chuyển</span>
//                 <span className="font-bold">{shipping === 0 ? 'MIỄN PHÍ' : formatCurrency(shipping)}</span>
//               </div>
//               <hr className="border-gray-100" />
//               <div className="flex justify-between text-lg font-black tracking-tighter italic">
//                 <span>TỔNG CỘNG</span>
//                 <span>{formatCurrency(totalAmount + shipping)}</span>
//               </div>
//             </div>

//             <button className="w-full bg-black text-white py-4 font-bold uppercase text-sm tracking-widest hover:opacity-80 transition-all flex items-center justify-center group">
//               THANH TOÁN
//               <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
//             </button>
//           </div>

//           {/* Badge thông báo miễn phí vận chuyển */}
//           {shipping > 0 && (
//             <div className="bg-[#ede734] p-4 text-center">
//               <p className="text-[10px] font-bold uppercase tracking-widest">
//                 Mua thêm {formatCurrency(1500000 - totalAmount)} để được MIỄN PHÍ VẬN CHUYỂN
//               </p>
//             </div>
//           )}

//           <div className="space-y-4">
//             <h4 className="font-bold uppercase text-xs tracking-widest">Cần hỗ trợ?</h4>
//             <div className="text-[12px] font-medium space-y-1">
//               <p className="hover:underline cursor-pointer">Vận chuyển</p>
//               <p className="hover:underline cursor-pointer">Chính sách trả hàng</p>
//               <p className="hover:underline cursor-pointer">Liên hệ chúng tôi</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;









import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/format';
import { TrashIcon } from '../components/SimpleIcons';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalAmount, isLoading } = useCart();
  const shipping = totalAmount > 1500000 ? 0 : 50000;

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black mb-4"></div>
        <p className="font-bold italic uppercase tracking-widest text-gray-400">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-20 text-center space-y-6">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter">GIỎ HÀNG TRỐNG</h1>
        <p className="text-gray-500 font-medium max-w-md mx-auto italic">
          Hiện tại bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá những BST mới nhất của chúng tôi.
        </p>
        <div className="pt-6">
          <Link to="/shop" className="bg-black text-white px-10 py-4 font-bold uppercase text-sm tracking-widest hover:opacity-80">
            MUA SẮM NGAY
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-10">
      <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-10">GIỎ HÀNG CỦA BẠN</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row border-b border-gray-100 pb-6">
              {/* Ảnh sản phẩm - Lấy từ item.variant.product.images */}
              <div className="w-full sm:w-40 aspect-square bg-gray-100 flex-shrink-0">
                <img
                  src={item.variant?.product?.images?.[0] || 'https://placehold.co/400x400?text=No+Image'}
                  alt={item.variant?.product?.name || 'Product'}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Chi tiết sản phẩm */}
              <div className="flex-grow sm:ml-6 mt-4 sm:mt-0 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    {/* Tên sản phẩm - Lấy từ item.variant.product.name */}
                    <h3 className="font-bold uppercase text-lg italic">
                      {item.variant?.product?.name || 'Sản phẩm không xác định'}
                    </h3>

                    <p className="text-[12px] font-bold uppercase text-gray-500">
                      Màu: {item.variant?.color || 'N/A'} | Size: {item.variant?.size || 'N/A'}
                    </p>

                    <div className="flex items-center space-x-4 mt-4">
                      <div className="flex items-center border border-black h-10">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-bold text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Xóa khỏi giỏ hàng"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    {/* Thành tiền của item */}
                    <p className="font-bold text-lg">
                      {formatCurrency((item.variant?.price || item.price || 0) * item.quantity)}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">
                      {formatCurrency(item.variant?.price || item.price || 0)} / sản phẩm
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border-2 border-black p-6 space-y-6 sticky top-24">
            <h2 className="text-xl font-black italic uppercase tracking-tighter">TÓM TẮT ĐƠN HÀNG</h2>

            <div className="space-y-4 text-[13px] font-medium uppercase tracking-widest">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span className="font-bold">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Vận chuyển</span>
                <span className="font-bold">{shipping === 0 ? 'MIỄN PHÍ' : formatCurrency(shipping)}</span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between text-lg font-black tracking-tighter italic">
                <span>TỔNG CỘNG</span>
                <span>{formatCurrency(totalAmount + shipping)}</span>
              </div>
            </div>

            <button className="w-full bg-black text-white py-4 font-bold uppercase text-sm tracking-widest hover:bg-gray-900 transition-all flex items-center justify-center group">
              THANH TOÁN
              <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          {shipping > 0 && (
            <div className="bg-[#ede734] p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest">
                Mua thêm {formatCurrency(1500000 - totalAmount)} để được MIỄN PHÍ VẬN CHUYỂN
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;