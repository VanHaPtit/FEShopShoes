import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../api/orderApi";
import { Package, ChevronRight, Clock, Star, ShoppingBag, Search } from "lucide-react";

// Định nghĩa label và màu sắc cho từng trạng thái
const tabs = [
  { label: "Tất cả", value: "ALL" },
  { label: "Chờ xác nhận", value: "PENDING" },
  { label: "Đã thanh toán", value: "PAID" },
  { label: "Đang giao", value: "SHIPPED" },
  { label: "Đã nhận hàng", value: "DELIVERED" },
  { label: "Đã hủy", value: "CANCELLED" },
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case "PENDING": return "bg-amber-100 text-amber-600 border-amber-200";
    case "PAID": return "bg-blue-100 text-blue-600 border-blue-200";
    case "SHIPPED": return "bg-indigo-100 text-indigo-600 border-indigo-200";
    case "DELIVERED": return "bg-emerald-100 text-emerald-600 border-emerald-200";
    case "CANCELLED": return "bg-red-100 text-red-600 border-red-200";
    default: return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

const getStatusLabel = (status: string) => {
  const tab = tabs.find(t => t.value === status);
  return tab ? tab.label : status;
};

const UserOrders: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await orderApi.getMyOrders();
      setOrders(res.data);
    } catch (err) {
      console.error("Không thể lấy lịch sử đơn hàng", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = activeTab === "ALL"
    ? orders
    : orders.filter((o: any) => o.status === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="text-gray-500 font-medium">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-2xl">
            <Package className="text-orange-600" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Đơn hàng của tôi</h1>
            <p className="text-sm text-gray-500">Quản lý và theo dõi hành trình đơn hàng</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/shop')}
          className="hidden sm:flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          Tiếp tục mua sắm <ChevronRight size={16} />
        </button>
      </div>

      {/* Thanh Tabs điều hướng */}
      <div className="flex border-b bg-white sticky top-0 z-10 overflow-x-auto shadow-sm rounded-t-2xl scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex-1 py-4 px-6 text-sm font-bold transition-all whitespace-nowrap relative ${activeTab === tab.value ? "text-orange-600" : "text-gray-400 hover:text-gray-600"
              }`}
          >
            {tab.label}
            {activeTab === tab.value && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-full mx-4"></div>
            )}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      <div className="mt-6 space-y-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">

              {/* Header của Đơn hàng */}
              <div className="bg-gray-50/50 px-6 py-4 flex justify-between items-center border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Clock size={16} />
                    <span>{order.orderDate}</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    #{order.orderNumber}
                  </p>
                </div>
                <div className={`text-[11px] uppercase tracking-wider font-black px-3 py-1 rounded-full border ${getStatusStyles(order.status)}`}>
                  {getStatusLabel(order.status)}
                </div>
              </div>

              {/* Danh sách sản phẩm trong đơn */}
              <div className="p-6 divide-y divide-gray-50">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-6 py-4 first:pt-0 last:pb-0 group">
                    <div className="relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-24 h-24 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{item.productName}</h3>
                        <p className="text-sm text-gray-400 mt-1 font-medium">
                          Phân loại: <span className="text-gray-600">{item.color}</span>, Size <span className="text-gray-600">{item.size}</span>
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-bold text-gray-500">x{item.quantity}</p>
                        <p className="font-black text-gray-900">{item.priceAtPurchase.toLocaleString()}đ</p>
                      </div>
                    </div>

                    {/* NÚT ĐÁNH GIÁ: Chỉ hiện khi trạng thái là DELIVERED
                    {order.status === "DELIVERED" && (
                      <div className="flex items-center ml-4">
                        <button
                          onClick={() => navigate(`/reviews/create/${item.productId}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-orange-500 text-orange-600 text-xs font-black rounded-xl hover:bg-orange-500 hover:text-white transition-all active:scale-95 shadow-sm shadow-orange-100"
                        >
                          <Star size={14} fill="currentColor" />
                          ĐÁNH GIÁ
                        </button>
                      </div>
                    )} */}
                  </div>
                ))}
              </div>

              {/* Footer: Tổng tiền & Nút hành động */}
              <div className="p-6 bg-gray-50/30 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-gray-600 text-sm font-medium">Giao hàng bởi GHN Express</p>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block">Tổng thanh toán</span>
                    <span className="text-2xl font-black text-orange-600">{order.totalPrice.toLocaleString()}đ</span>
                  </div>
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg shadow-gray-200 active:scale-95"
                  >
                    Chi tiết <ChevronRight size={16} />
                  </button>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="bg-white py-24 text-center rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
              <Search className="text-gray-200" size={48} />
            </div>
            <p className="text-gray-400 font-bold text-lg">Bạn chưa có đơn hàng nào</p>
            <p className="text-gray-300 text-sm mt-1">Hãy khám phá thêm các sản phẩm mới của shop nhé!</p>
            <button
              onClick={() => navigate('/shop')}
              className="mt-6 px-8 py-3 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
            >
              Mua sắm ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;