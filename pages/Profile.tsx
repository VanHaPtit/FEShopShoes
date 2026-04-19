import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import {
    ShoppingBag, User, Package, Edit2, Save, X,
    Camera, Loader2, Phone, Mail, Calendar, CheckCircle
} from 'lucide-react';

const Profile: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
    }, [navigate]);

    const fetchUserProfile = async () => {
        try {
            const savedUser = localStorage.getItem('user');
            if (!savedUser) { navigate('/signin'); return; }
            const { id } = JSON.parse(savedUser);
            const response = await axiosClient.get(`/users/${id}`);

            setUser(response.data);
            setFullName(response.data.fullName || '');
            setPhone(response.data.phone || '');
        } catch (err) {
            console.error("Lỗi tải thông tin");
        } finally { setIsLoading(false); }
    };

    // Xử lý chọn file (Giống ProductForm)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Xem trước ảnh
        }
    };

    // Xử lý Lưu (Gửi lên Backend của bạn)
    const handleUpdate = async () => {
        if (!user) return;
        setIsSaving(true);

        try {
            // Dùng FormData để gửi kèm cả File (giống ProductForm)
            const formData = new FormData();
            formData.append('fullName', fullName);
            formData.append('phone', phone);

            if (selectedFile) {
                formData.append('file', selectedFile); // 'file' phải khớp với @RequestParam ở BE
            }

            // Gửi PUT request lên Backend của bạn
            const response = await axiosClient.put(`/users/${user.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Cập nhật thành công
            const updatedUser = response.data;
            setUser(updatedUser);
            setIsEditing(false);
            setSelectedFile(null);
            setPreviewUrl(null);

            // Cập nhật lại localStorage để đồng bộ tên/ảnh trên Navbar
            const local = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({
                ...local,
                fullName: updatedUser.fullName,
                imageAvt: updatedUser.imageAvt
            }));

            alert("Cập nhật thông tin thành công!");
        } catch (err: any) {
            alert("Lỗi: " + (err.response?.data || err.message));
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">

                {/* Header Gradient */}
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
                    <button
                        onClick={() => { setIsEditing(!isEditing); setPreviewUrl(null); }}
                        className="absolute top-4 right-4 p-2 bg-white/20 text-white rounded-xl hover:bg-white/30"
                    >
                        {isEditing ? <X size={20} /> : <Edit2 size={20} />}
                    </button>
                </div>

                <div className="px-8 pb-10">
                    {/* Avatar Section */}
                    <div className="relative -top-12 flex flex-col md:flex-row items-end gap-4">
                        <div className="relative group w-32 h-32">
                            <div className="w-full h-full rounded-3xl border-4 border-white overflow-hidden bg-gray-100 shadow-md">
                                <img
                                    src={previewUrl || user?.imageAvt || `https://ui-avatars.com/api/?name=${user?.fullName}`}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {isEditing && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"
                                >
                                    <Camera size={24} />
                                </button>
                            )}
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                        </div>
                        <div className="pb-2">
                            <h1 className="text-2xl font-bold text-gray-900">{user?.fullName}</h1>
                            <p className="text-gray-500">{user?.email}</p>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase">Họ và tên</label>
                            {isEditing ? (
                                <input
                                    className="w-full p-3 border rounded-xl focus:ring-2 ring-purple-500 outline-none"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                />
                            ) : (
                                <p className="text-lg font-semibold text-gray-800">{user?.fullName}</p>

                            )}
                        </div>


                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase">Số điện thoại</label>
                            {isEditing ? (
                                <input
                                    className="w-full p-3 border rounded-xl focus:ring-2 ring-purple-500 outline-none"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                />
                            ) : (
                                <p className="text-lg font-semibold text-gray-800">{user?.phone || 'Chưa cập nhật'}</p>
                            )}
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-10">
                        {isEditing ? (
                            <button
                                onClick={handleUpdate}
                                disabled={isSaving}
                                className="w-full flex items-center justify-center gap-2 py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                {isSaving ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
                            </button>
                        ) : (
                            <div className="flex gap-4">
                                <button onClick={() => navigate('/profile/orders')} className="flex-1 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 flex items-center justify-center gap-2">
                                    <Package size={20} /> ĐƠN HÀNG
                                </button>
                                <button onClick={() => navigate('/shop')} className="flex-1 py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 flex items-center justify-center gap-2">
                                    <ShoppingBag size={20} /> MUA SẮM
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;









// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axiosClient from '../api/axiosClient';
// import OrderItemAction from './OrderItemAction'; // Đảm bảo đường dẫn đúng
// import {
//     ShoppingBag, User, Package, Edit2, Save, X,
//     Camera, Loader2, Phone, Mail, CheckCircle, ArrowLeft, Star
// } from 'lucide-react';

// interface UserData {
//     id: number;
//     fullName: string;
//     email: string;
//     phone: string;
//     imageAvt: string;
// }

// const Profile: React.FC = () => {
//     const [user, setUser] = useState<UserData | null>(null);
//     const [recentOrders, setRecentOrders] = useState<any[]>([]); // Lưu đơn hàng để lấy sản phẩm đánh giá
//     const [isLoading, setIsLoading] = useState(true);
//     const [isEditing, setIsEditing] = useState(false);
//     const [isSaving, setIsSaving] = useState(false);

//     const [fullName, setFullName] = useState('');
//     const [phone, setPhone] = useState('');
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [previewUrl, setPreviewUrl] = useState<string | null>(null);

//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const loadData = async () => {
//             const savedUser = localStorage.getItem('user');
//             if (!savedUser) { navigate('/signin'); return; }
//             const { id } = JSON.parse(savedUser);

//             try {
//                 // Gọi song song cả Profile và Đơn hàng
//                 const [userRes, ordersRes] = await Promise.all([
//                     axiosClient.get(`/users/${id}`),
//                     axiosClient.get(`/orders/user/${id}`) // Giả sử bạn có API này
//                 ]);

//                 setUser(userRes.data);
//                 setFullName(userRes.data.fullName || '');
//                 setPhone(userRes.data.phone || '');

//                 // Lấy 3 đơn hàng gần nhất để hiển thị mẫu
//                 setRecentOrders(ordersRes.data.slice(0, 3));
//             } catch (err) {
//                 console.error("Lỗi tải dữ liệu");
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         loadData();
//     }, [navigate]);

//     // ... các hàm handleFileChange, handleCancelEdit, handleUpdate giữ nguyên như cũ ...
//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             setSelectedFile(file);
//             setPreviewUrl(URL.createObjectURL(file));
//         }
//     };

//     const handleCancelEdit = () => {
//         setIsEditing(false);
//         if (user) {
//             setFullName(user.fullName || '');
//             setPhone(user.phone || '');
//         }
//         setPreviewUrl(null);
//         setSelectedFile(null);
//     };

//     const handleUpdate = async () => {
//         if (!user) return;
//         setIsSaving(true);
//         try {
//             const formData = new FormData();
//             formData.append('fullName', fullName);
//             formData.append('phone', phone);
//             if (selectedFile) formData.append('file', selectedFile);
//             const response = await axiosClient.put(`/users/${user.id}`, formData, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//             });
//             setUser(response.data);
//             setIsEditing(false);
//             const local = JSON.parse(localStorage.getItem('user') || '{}');
//             localStorage.setItem('user', JSON.stringify({ ...local, fullName: response.data.fullName, imageAvt: response.data.imageAvt }));
//             alert("🎉 Cập nhật thành công!");
//         } catch (err: any) {
//             alert("Lỗi: " + (err.response?.data || err.message));
//         } finally { setIsSaving(false); }
//     };

//     if (isLoading) return <div className="flex flex-col items-center justify-center min-h-screen"><Loader2 className="animate-spin text-purple-600" size={48} /></div>;

//     return (
//         <div className="min-h-screen bg-gray-50 py-12 px-4">
//             <div className="max-w-3xl mx-auto space-y-8">

//                 {/* --- PHẦN 1: THÔNG TIN CÁ NHÂN --- */}
//                 <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
//                     <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 relative">
//                         <button onClick={() => navigate(-1)} className="absolute top-6 left-6 p-2 bg-white/20 text-white rounded-full hover:bg-white/40"><ArrowLeft size={20} /></button>
//                         {!isEditing && (
//                             <button onClick={() => setIsEditing(true)} className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 font-medium transition-all"><Edit2 size={18} /> Sửa hồ sơ</button>
//                         )}
//                     </div>

//                     <div className="px-8 pb-10">
//                         <div className="relative -top-16 flex flex-col md:flex-row items-end gap-6">
//                             <div className="relative group">
//                                 <div className="w-32 h-32 rounded-3xl border-8 border-white overflow-hidden bg-white shadow-lg">
//                                     <img src={previewUrl || user?.imageAvt || `https://ui-avatars.com/api/?name=${user?.fullName}`} alt="Avatar" className="w-full h-full object-cover" />
//                                 </div>
//                                 {isEditing && (
//                                     <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"><Camera size={24} /></button>
//                                 )}
//                                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
//                             </div>
//                             <div className="pb-4">
//                                 <h1 className="text-2xl font-black text-gray-900 tracking-tight">{user?.fullName}</h1>
//                                 <p className="text-gray-500 flex items-center gap-2"><Mail size={14} /> {user?.email}</p>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                             <div className="space-y-2">
//                                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Họ và tên</label>
//                                 {isEditing ? (
//                                     <input className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 ring-purple-500 outline-none" value={fullName} onChange={e => setFullName(e.target.value)} />
//                                 ) : (
//                                     <div className="flex items-center gap-2 text-gray-800 font-bold"><User size={18} className="text-purple-500" /> {user?.fullName}</div>
//                                 )}
//                             </div>
//                             <div className="space-y-2">
//                                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Số điện thoại</label>
//                                 {isEditing ? (
//                                     <input className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 ring-purple-500 outline-none" value={phone} onChange={e => setPhone(e.target.value)} />
//                                 ) : (
//                                     <div className="flex items-center gap-2 text-gray-800 font-bold"><Phone size={18} className="text-purple-500" /> {user?.phone || 'Chưa cập nhật'}</div>
//                                 )}
//                             </div>
//                         </div>

//                         {isEditing && (
//                             <div className="flex gap-4 mt-8">
//                                 <button onClick={handleCancelEdit} className="flex-1 py-3 border-2 border-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition-all">HỦY</button>
//                                 <button onClick={handleUpdate} disabled={isSaving} className="flex-[2] py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-100 flex items-center justify-center gap-2">
//                                     {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} LƯU THÔNG TIN
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* --- PHẦN 2: SẢN PHẨM CHỜ ĐÁNH GIÁ (GỌI OrderItemAction Ở ĐÂY) --- */}
//                 {!isEditing && (
//                     <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-gray-100">
//                         <div className="flex items-center justify-between mb-6">
//                             <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
//                                 <Star className="text-yellow-500 fill-yellow-500" size={24} />
//                                 ĐÁNH GIÁ SẢN PHẨM
//                             </h2>
//                             <button onClick={() => navigate('/profile/orders')} className="text-sm font-bold text-purple-600 hover:underline">Xem tất cả đơn hàng</button>
//                         </div>

//                         <div className="space-y-4">
//                             {recentOrders.length > 0 ? (
//                                 recentOrders.map((order) => (
//                                     <div key={order.id} className="space-y-3">
//                                         {order.items.map((item: any) => (
//                                             <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-hover hover:bg-gray-100/50">
//                                                 <div className="flex items-center gap-4">
//                                                     <div className="w-16 h-16 rounded-xl bg-white border overflow-hidden">
//                                                         <img
//                                                             src={item.variant?.product?.images?.[0] || 'https://via.placeholder.com/150'}
//                                                             alt="product"
//                                                             className="w-full h-full object-cover"
//                                                         />
//                                                     </div>
//                                                     <div>
//                                                         <p className="font-bold text-gray-800 line-clamp-1">{item.variant?.product?.name}</p>
//                                                         <p className="text-xs text-gray-500">Đã mua ngày: {new Date(order.orderDate).toLocaleDateString('vi-VN')}</p>
//                                                     </div>
//                                                 </div>

//                                                 {/* GỌI COMPONENT ACTION Ở ĐÂY */}
//                                                 <OrderItemAction item={item} orderDate={order.orderDate} />
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="text-center py-10">
//                                     <Package className="mx-auto text-gray-200 mb-2" size={48} />
//                                     <p className="text-gray-400">Bạn chưa có sản phẩm nào cần đánh giá.</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {/* --- PHẦN 3: ĐIỀU HƯỚNG NHANH --- */}
//                 {!isEditing && (
//                     <div className="flex gap-4">
//                         <button onClick={() => navigate('/shop')} className="flex-1 py-5 bg-gray-900 text-white font-black rounded-[2rem] hover:bg-black transition-all shadow-lg flex items-center justify-center gap-3">
//                             <ShoppingBag size={24} /> TIẾP TỤC MUA SẮM
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Profile;