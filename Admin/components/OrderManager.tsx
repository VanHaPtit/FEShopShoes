
import React, { useState } from 'react';
import { ShoppingBag, Eye, CheckCircle, Truck, Package, XCircle, ChevronDown } from 'lucide-react';
import { Order, OrderStatus } from '../typesAdmin';

interface OrderManagerProps {
    orders: Order[];
    onStatusChange: (id: number, status: OrderStatus) => void;
}

const OrderManager: React.FC<OrderManagerProps> = ({ orders, onStatusChange }) => {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING: return 'bg-amber-100 text-amber-700';
            case OrderStatus.CONFIRMED: return 'bg-blue-100 text-blue-700';
            case OrderStatus.SHIPPING: return 'bg-purple-100 text-purple-700';
            case OrderStatus.COMPLETED: return 'bg-emerald-100 text-emerald-700';
            case OrderStatus.CANCELLED: return 'bg-rose-100 text-rose-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Order Management</h2>
                    <p className="text-slate-500">Track and manage customer purchases</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/80 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-5 font-mono text-sm text-slate-600">#{order.orderNumber}</td>
                                <td className="px-6 py-5">
                                    <p className="font-semibold text-slate-900">{order.receiverName}</p>
                                    <p className="text-xs text-slate-500">{order.receiverPhone}</p>
                                </td>
                                <td className="px-6 py-5 font-bold text-slate-900">${order.totalPrice.toFixed(2)}</td>
                                <td className="px-6 py-5">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="relative group">
                                            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg flex items-center gap-1 text-sm font-medium">
                                                Change Status <ChevronDown className="w-4 h-4" />
                                            </button>
                                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-10 hidden group-hover:block p-2">
                                                {Object.values(OrderStatus).map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={() => order.id && onStatusChange(order.id, status)}
                                                        className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                                                    >
                                                        <div className={`w-2 h-2 rounded-full ${getStatusColor(status).replace('text-', 'bg-').split(' ')[1]}`} />
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedOrder(order)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold">Order Details #{selectedOrder.orderNumber}</h3>
                            <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-slate-100 rounded-full">
                                <XCircle className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Customer Information</h4>
                                <p className="font-bold text-lg">{selectedOrder.receiverName}</p>
                                <p className="text-slate-600">{selectedOrder.receiverPhone}</p>
                                <p className="text-slate-600 mt-2 italic">{selectedOrder.shippingAddress}</p>
                            </div>
                            <div className="text-right">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Summary</h4>
                                <p className="text-slate-600">Status: <span className={`font-bold ${getStatusColor(selectedOrder.status)} px-2 py-0.5 rounded`}>{selectedOrder.status}</span></p>
                                <p className="text-2xl font-black text-slate-900 mt-2">Total: ${selectedOrder.totalPrice.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Order Items</h4>
                            {selectedOrder.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden">
                                        <img src={item.variant.product?.images?.[0]} className="object-cover w-full h-full" alt="" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold">{item.variant.product?.name}</p>
                                        <p className="text-xs text-slate-500">Size: {item.variant.size} • Color: {item.variant.color}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">${item.priceAtPurchase.toFixed(2)}</p>
                                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManager;
