import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { ArrowLeft, Package, MapPin, Star, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import ReviewModel from './ReviewModel'; // Chúng ta sẽ tạo ở bước 3

const OrderDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // State cho Modal đánh giá
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchOrderDetail();
    }, [id]);

    const fetchOrderDetail = async () => {
        try {
            const res = await orderApi.getOrderDetail(id!);
            // Debug xem dữ liệu item có image và productId không
            console.log("Dữ liệu đơn hàng:", res.data);
            setOrder(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const checkReviewStatus = (orderDate: string, isReviewed: boolean) => {
        const now = new Date();
        const date = new Date(orderDate);
        const diffDays = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);

        const isExpired = diffDays > 20;
        return {
            canReview: order?.status === "DELIVERED" && !isReviewed && !isExpired,
            isExpired,
            isReviewed
        };
    };

    if (loading) return <div className="p-20 text-center">Đang tải...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-black mb-6">
                <ArrowLeft size={20} /> Quay lại
            </button>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                {/* Order Header */}
                <div className="p-8 border-b bg-gray-50/50 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-black">CHI TIẾT ĐƠN HÀNG #{order.orderNumber}</h1>
                        <p className="text-gray-500 text-sm">Ngày đặt: {order.orderDate}</p>
                    </div>
                    <div className="text-right">
                        <span className="px-4 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-black uppercase">
                            {order.status}
                        </span>
                    </div>
                </div>

                {/* Items List */}
                <div className="p-8 space-y-6">
                    <h2 className="font-bold text-gray-400 uppercase text-xs tracking-widest">Sản phẩm trong đơn</h2>
                    {order.items.map((item: any) => {
                        // TRUY XUẤT ĐÚNG ĐƯỜNG DẪN DỮ LIỆU
                        const variant = item.variant;
                        const product = variant?.product;
                        const productImage = (product?.images && product.images.length > 0)
                            ? product.images[0]
                            : "https://placehold.jp/150x150.png";
                        const productName = product?.name || "Sản phẩm không tên";
                        const productId = product?.id;
                        const colorValue = variant?.color || "N/A";
                        const sizeValue = variant?.size || "N/A";

                        const now = new Date();
                        const orderDate = new Date(order.orderDate);
                        const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
                        const isExpired = diffDays > 20;
                        const canReview = order.status === "DELIVERED" && !item.reviewed && !isExpired;

                        return (
                            <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border rounded-[2rem]">
                                <div className="flex gap-4">
                                    <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden border">
                                        <img
                                            src={productImage} // Dùng ảnh đã truy xuất ở trên
                                            alt={productName}
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.currentTarget.src = "https://placehold.jp/150x150.png")}
                                        />
                                    </div>

                                    <div className="flex flex-col justify-center">
                                        <h3 className="font-bold text-gray-800 text-lg">{productName}</h3>
                                        <p className="text-sm text-gray-500">
                                            Phân loại: {colorValue}, Size {sizeValue}
                                        </p>
                                        <p className="font-black text-orange-600 mt-1">{item.priceAtPurchase.toLocaleString()}đ</p>
                                    </div>
                                </div>

                                <button
                                    disabled={!canReview}
                                    onClick={() => {
                                        // CHUẨN BỊ DATA GỬI VÀO MODAL
                                        setSelectedItem({
                                            ...item,
                                            productId: productId, // Truyền ID chuẩn vào đây
                                            productName: productName,
                                            image: productImage,
                                            color: colorValue,
                                            size: sizeValue
                                        });
                                        setShowModal(true);
                                    }}
                                    className={`px-6 py-3 rounded-2xl font-black text-xs transition-all
                    ${canReview ? "bg-orange-500 text-white shadow-lg" : "bg-gray-100 text-gray-400"}`}
                                >
                                    {item.reviewed ? "ĐÃ ĐÁNH GIÁ" : isExpired ? "HẾT HẠN" : "ĐÁNH GIÁ"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal Đánh giá */}
            {showModal && (
                <ReviewModel
                    item={selectedItem}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false);
                        fetchOrderDetail(); // Refresh lại dữ liệu để cập nhật trạng thái isReviewed
                    }}
                />
            )}
        </div>
    );
};

export default OrderDetail;