

import React, { useState } from 'react';
import { Eye, Search, XCircle, Check, Pencil, X, Plus, Trash2, PackageX, ShoppingBag } from 'lucide-react';
import { Order, OrderStatus } from '../typesAdmin';
import axios from 'axios';

interface OrderItem {
    productId?: number;
    productName: string;
    size: string;
    color: string;
    quantity: number;
    priceAtPurchase: number;
    image: string;
}

interface OrderManagerProps {
    orders: Order[];
    onRefresh: () => void;
}

// Danh sách trạng thái KHÔNG cho phép sửa items
const LOCKED_STATUSES: OrderStatus[] = [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED];

const isItemsLocked = (status: OrderStatus) => LOCKED_STATUSES.includes(status);

const OrderManager: React.FC<OrderManagerProps> = ({ orders, onRefresh }) => {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<Order>>({});

    // --- STATE CHO MODAL SỬA ITEM ---
    const [editItemsOrder, setEditItemsOrder] = useState<Order | null>(null);
    const [draftItems, setDraftItems] = useState<OrderItem[]>([]);
    const [savingItems, setSavingItems] = useState(false);

    // Tính tổng tiền từ danh sách items tạm
    const calcTotal = (items: OrderItem[]) =>
        items.reduce((sum, item) => sum + item.priceAtPurchase * item.quantity, 0);

    // Mở modal sửa items
    const openEditItems = (order: Order) => {
        setEditItemsOrder(order);
        setDraftItems(order.items.map(i => ({ ...i })));
    };

    // Cập nhật số lượng
    const updateQty = (idx: number, qty: number) => {
        if (qty < 1) return;
        setDraftItems(prev => prev.map((item, i) => i === idx ? { ...item, quantity: qty } : item));
    };

    // Xoá sản phẩm
    const removeItem = (idx: number) => {
        setDraftItems(prev => prev.filter((_, i) => i !== idx));
    };

    // Thêm dòng sản phẩm trống (admin tự điền)
    const addBlankItem = () => {
        setDraftItems(prev => [...prev, {
            productName: '',
            size: '',
            color: '',
            quantity: 1,
            priceAtPurchase: 0,
            image: 'https://placehold.co/48x48?text=?'
        }]);
    };

    // Cập nhật field của item
    const updateItemField = (idx: number, field: keyof OrderItem, value: string | number) => {
        setDraftItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
    };

    // Lưu items
    const handleSaveItems = async () => {
        if (!editItemsOrder?.id) return;
        setSavingItems(true);
        try {
            const newTotal = calcTotal(draftItems);
            const response = await axios.put(
                `http://localhost:8080/api/v1/orders/${editItemsOrder.id}/items`,
                { items: draftItems, totalPrice: newTotal },
                { withCredentials: true }
            );
            if (response.status === 200) {
                setEditItemsOrder(null);
                onRefresh();
                alert('Đã cập nhật danh sách sản phẩm!');
            }
        } catch {
            alert('Lỗi khi cập nhật sản phẩm!');
        } finally {
            setSavingItems(false);
        }
    };

    // --- INLINE EDIT (tên, phone, address, status) ---
    const startEdit = (order: Order) => {
        setEditingId(order.id || null);
        setEditForm({ ...order });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleSave = async (id: number) => {
        try {
            const response = await axios.put(
                `http://localhost:8080/api/v1/orders/${id}`,
                {
                    receiverName: editForm.receiverName,
                    receiverPhone: editForm.receiverPhone,
                    shippingAddress: editForm.shippingAddress,
                    status: editForm.status
                },
                { withCredentials: true }
            );
            if (response.status === 200) {
                setEditingId(null);
                onRefresh();
                alert('Đã lưu thay đổi!');
            }
        } catch {
            alert('Lỗi khi cập nhật dữ liệu!');
        }
    };

    const filteredOrders = orders.filter((order) =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusStyle = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING: return 'bg-amber-100 text-amber-700 border-amber-200';
            case OrderStatus.PAID: return 'bg-blue-100 text-blue-700 border-blue-200';
            case OrderStatus.SHIPPED: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case OrderStatus.DELIVERED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case OrderStatus.CANCELLED: return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">OrderManager</h2>
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm mã đơn hàng..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Mã đơn</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Khách hàng</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Địa chỉ nhận</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tổng tiền</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Trạng thái</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredOrders.map((order) => {
                            const isEditing = editingId === order.id;
                            const locked = isItemsLocked(order.status);

                            return (
                                <tr key={order.id} className={`${isEditing ? 'bg-blue-50/30' : 'hover:bg-slate-50/50'} transition-colors`}>
                                    <td className="px-6 py-4 font-mono text-sm font-semibold text-blue-600">#{order.orderNumber}</td>

                                    {/* Khách hàng - Editable */}
                                    <td className="px-6 py-4">
                                        {isEditing ? (
                                            <div className="space-y-1">
                                                <input
                                                    className="w-full px-2 py-1 text-sm border rounded"
                                                    value={editForm.receiverName}
                                                    onChange={e => setEditForm({ ...editForm, receiverName: e.target.value })}
                                                />
                                                <input
                                                    className="w-full px-2 py-1 text-xs border rounded text-slate-500"
                                                    value={editForm.receiverPhone}
                                                    onChange={e => setEditForm({ ...editForm, receiverPhone: e.target.value })}
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <p className="font-semibold text-slate-900 text-sm">{order.receiverName}</p>
                                                <p className="text-xs text-slate-500">{order.receiverPhone}</p>
                                            </>
                                        )}
                                    </td>

                                    {/* Địa chỉ - Editable */}
                                    <td className="px-6 py-4">
                                        {isEditing ? (
                                            <textarea
                                                className="w-full px-2 py-1 text-xs border rounded"
                                                rows={2}
                                                value={editForm.shippingAddress}
                                                onChange={e => setEditForm({ ...editForm, shippingAddress: e.target.value })}
                                            />
                                        ) : (
                                            <p className="text-xs text-slate-600 line-clamp-2 italic">{order.shippingAddress}</p>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                                        {order.totalPrice.toLocaleString('vi-VN')}đ
                                    </td>

                                    {/* Trạng thái - Editable */}
                                    <td className="px-6 py-4">
                                        {isEditing ? (
                                            <select
                                                className="text-xs border rounded px-1 py-1 focus:ring-1 focus:ring-blue-500 outline-none"
                                                value={editForm.status}
                                                onChange={e => setEditForm({ ...editForm, status: e.target.value as OrderStatus })}
                                            >
                                                {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        ) : (
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(order.status)}`}>
                                                {order.status}
                                            </span>
                                        )}
                                    </td>

                                    {/* Thao tác */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {isEditing ? (
                                                <>
                                                    <button onClick={() => order.id && handleSave(order.id)} className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 shadow-sm shadow-emerald-100">
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={cancelEdit} className="p-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEdit(order)}
                                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="Sửa thông tin người nhận / trạng thái"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>

                                                    {/* Nút sửa items – chỉ hiện khi chưa bị khoá */}
                                                    {locked ? (
                                                        <span
                                                            className="p-1.5 text-slate-200 cursor-not-allowed rounded-lg"
                                                            title={`Không thể sửa sản phẩm sau khi đơn ở trạng thái ${order.status}`}
                                                        >
                                                            <PackageX className="w-4 h-4" />
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => openEditItems(order)}
                                                            className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all"
                                                            title="Sửa sản phẩm trong đơn"
                                                        >
                                                            <ShoppingBag className="w-4 h-4" />
                                                        </button>
                                                    )}

                                                    <button onClick={() => setSelectedOrder(order)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Chi tiết đơn hàng">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ======================================================= */}
            {/* MODAL SỬA DANH SÁCH SẢN PHẨM                            */}
            {/* ======================================================= */}
            {editItemsOrder && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Sửa sản phẩm – Đơn #{editItemsOrder.orderNumber}</h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Chỉ áp dụng với đơn ở trạng thái <span className="font-semibold text-amber-600">PENDING</span>
                                </p>
                            </div>
                            <button onClick={() => setEditItemsOrder(null)} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-rose-500 transition-colors">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Body – scrollable */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-3">
                            {/* Header row */}
                            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                <span>Sản phẩm</span>
                                <span>Size / Màu</span>
                                <span className="text-center">Số lượng</span>
                                <span className="text-right">Đơn giá</span>
                                <span />
                            </div>

                            {draftItems.length === 0 && (
                                <div className="text-center py-12 text-slate-300 text-sm">
                                    Chưa có sản phẩm nào. Nhấn "+ Thêm" để bắt đầu.
                                </div>
                            )}

                            {draftItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3"
                                >
                                    {/* Tên sản phẩm */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <img
                                            src={item.image}
                                            alt=""
                                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                                        />
                                        <input
                                            className="flex-1 px-2 py-1 text-xs font-semibold border border-slate-200 rounded-lg focus:ring-1 focus:ring-violet-400 outline-none bg-white min-w-0"
                                            value={item.productName}
                                            placeholder="Tên sản phẩm"
                                            onChange={e => updateItemField(idx, 'productName', e.target.value)}
                                        />
                                    </div>

                                    {/* Size / Màu */}
                                    <div className="space-y-1">
                                        <input
                                            className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-violet-400 outline-none bg-white"
                                            value={item.size}
                                            placeholder="Size"
                                            onChange={e => updateItemField(idx, 'size', e.target.value)}
                                        />
                                        <input
                                            className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-violet-400 outline-none bg-white"
                                            value={item.color}
                                            placeholder="Màu"
                                            onChange={e => updateItemField(idx, 'color', e.target.value)}
                                        />
                                    </div>

                                    {/* Số lượng */}
                                    <div className="flex items-center justify-center gap-1">
                                        <button
                                            onClick={() => updateQty(idx, item.quantity - 1)}
                                            className="w-6 h-6 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold text-sm flex items-center justify-center transition-colors"
                                        >−</button>
                                        <span className="w-8 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQty(idx, item.quantity + 1)}
                                            className="w-6 h-6 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold text-sm flex items-center justify-center transition-colors"
                                        >+</button>
                                    </div>

                                    {/* Đơn giá */}
                                    <div className="text-right">
                                        <input
                                            type="number"
                                            className="w-full px-2 py-1 text-xs text-right border border-slate-200 rounded-lg focus:ring-1 focus:ring-violet-400 outline-none bg-white font-semibold"
                                            value={item.priceAtPurchase}
                                            min={0}
                                            onChange={e => updateItemField(idx, 'priceAtPurchase', Number(e.target.value))}
                                        />
                                        <p className="text-[10px] text-slate-400 mt-0.5 pr-1">
                                            = {(item.priceAtPurchase * item.quantity).toLocaleString('vi-VN')}đ
                                        </p>
                                    </div>

                                    {/* Xoá */}
                                    <button
                                        onClick={() => removeItem(idx)}
                                        className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                        title="Xoá sản phẩm này"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            {/* Nút thêm sản phẩm */}
                            <button
                                onClick={addBlankItem}
                                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-2xl text-sm text-slate-400 hover:border-violet-300 hover:text-violet-500 hover:bg-violet-50/30 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Thêm sản phẩm
                            </button>
                        </div>

                        {/* Footer – tổng tiền + nút lưu */}
                        <div className="bg-slate-50 border-t border-slate-100 px-8 py-5 flex items-center justify-between flex-shrink-0">
                            {/* Tổng tiền tự động */}
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tổng tiền (tự tính)</p>
                                <p className="text-2xl font-black text-slate-900">
                                    {calcTotal(draftItems).toLocaleString('vi-VN')}
                                    <span className="text-sm font-normal text-slate-500 ml-1">đ</span>
                                </p>
                                {calcTotal(draftItems) !== editItemsOrder.totalPrice && (
                                    <p className="text-[10px] text-amber-500 font-semibold mt-0.5">
                                        ↑ Thay đổi so với ban đầu: {editItemsOrder.totalPrice.toLocaleString('vi-VN')}đ
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setEditItemsOrder(null)}
                                    className="px-5 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all"
                                >
                                    Huỷ
                                </button>
                                <button
                                    onClick={handleSaveItems}
                                    disabled={savingItems || draftItems.length === 0}
                                    className="px-6 py-2 text-sm font-bold text-white bg-violet-600 rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                >
                                    {savingItems ? (
                                        <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Check className="w-4 h-4" />
                                    )}
                                    Lưu & Cập nhật
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================= */}
            {/* MODAL CHI TIẾT ĐƠN HÀNG (view only)                     */}
            {/* ======================================================= */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold">Chi tiết đơn #{selectedOrder.orderNumber}</h3>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-rose-500">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Người nhận</p>
                                    <p className="font-bold text-slate-900">{selectedOrder.receiverName}</p>
                                    <p className="text-xs text-slate-500">{selectedOrder.receiverPhone}</p>
                                    <p className="text-xs text-slate-500 italic mt-1">{selectedOrder.shippingAddress}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Thanh toán</p>
                                    <p className="text-xl font-black text-blue-600">{selectedOrder.totalPrice.toLocaleString('vi-VN')}đ</p>
                                    <p className="text-[10px] text-slate-400">Trạng thái: {selectedOrder.status}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sản phẩm đã mua</p>
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-xl">
                                        <img src={item.image} className="w-12 h-12 object-cover rounded-lg border shadow-sm" alt="" />
                                        <div className="flex-1">
                                            <p className="text-xs font-bold">{item.productName}</p>
                                            <p className="text-[10px] text-slate-500">Size: {item.size} | Màu: {item.color} | SL: {item.quantity}</p>
                                        </div>
                                        <p className="text-xs font-bold">{item.priceAtPurchase.toLocaleString('vi-VN')}đ</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 border-t flex justify-center">
                            <button onClick={() => setSelectedOrder(null)} className="px-8 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-sm">Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManager;