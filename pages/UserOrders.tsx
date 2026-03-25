import React, { useEffect, useState } from "react";
import { orderApi } from "../api/orderApi";
import { Package, ChevronRight, Clock } from "lucide-react";

// Định nghĩa các Tab trạng thái (Phải khớp với String/Enum ở Backend)
const tabs = [
  { label: "Tất cả", value: "ALL" },
  { label: "Chờ xác nhận", value: "PENDING" },
  { label: "Đã thanh toán", value: "PAID" },
  { label: "Đang giao", value: "SHIPPED" },
  { label: "Đã nhận hàng", value: "DELIVERED" },
  { label: "Đã hủy", value: "CANCELLED" },
];

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [loading, setLoading] = useState(true);

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

  // Logic lọc đơn hàng
  const filteredOrders = activeTab === "ALL" 
    ? orders 
    : orders.filter((o: any) => o.status === activeTab);

  if (loading) return <div className="text-center py-20 text-xl">Đang tải đơn hàng...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="flex items-center gap-3 mb-8">
        <Package className="text-orange-600" size={32} />
        <h1 className="text-2xl font-bold text-gray-800">Đơn hàng của tôi</h1>
      </div>

      {/* Thanh Tabs điều hướng */}
      <div className="flex border-b bg-white sticky top-0 z-10 overflow-x-auto shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.value
                ? "border-b-2 border-orange-500 text-orange-600 bg-orange-50/50"
                : "text-gray-500 hover:text-orange-400 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      <div className="mt-6 space-y-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* Header của Đơn hàng */}
              <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-b">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>{order.orderDate}</span>
                </div>
                <div className="text-orange-600 font-bold text-sm bg-orange-100 px-3 py-1 rounded-full">
                  {order.status}
                </div>
              </div>

              {/* Danh sách sản phẩm trong đơn */}
              <div className="p-6 divide-y">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <img src={item.image} alt={item.productName} className="w-20 h-20 object-cover rounded-lg border" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 line-clamp-1">{item.productName}</h3>
                      <p className="text-sm text-gray-500 mt-1">Phân loại: {item.color}, Size {item.size}</p>
                      <p className="text-sm font-medium mt-1 text-gray-700">x{item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">{item.priceAtPurchase.toLocaleString()}đ</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer: Tổng tiền & Nút hành động */}
              <div className="p-6 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 border-t">
                <p className="text-gray-600 text-sm">Mã đơn hàng: <span className="font-mono font-medium">{order.orderNumber}</span></p>
                <div className="flex items-center gap-4">
                   <div className="text-right">
                      <span className="text-sm text-gray-500 mr-2">Thành tiền:</span>
                      <span className="text-xl font-bold text-orange-600">{order.totalPrice.toLocaleString()}đ</span>
                   </div>
                   <button className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-1">
                      Chi tiết <ChevronRight size={16} />
                   </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white py-20 text-center rounded-xl border-2 border-dashed border-gray-200">
            <Package className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500">Bạn chưa có đơn hàng nào ở trạng thái này.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;