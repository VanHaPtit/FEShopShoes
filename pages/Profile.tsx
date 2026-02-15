import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

interface UserProfile {
    id: number;
    email: string;
    fullName: string;
    phone: string;
    imageAvt: string | null;
    enabled: boolean;
    createdAt: string;
}

const Profile: React.FC = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // 1. Lấy thông tin cơ bản từ LocalStorage để lấy ID
                const savedUser = localStorage.getItem('user');
                if (!savedUser) {
                    navigate('/login');
                    return;
                }

                const { id } = JSON.parse(savedUser);

                // 2. Gọi API lấy chi tiết người dùng từ Backend
                // Lưu ý: Request này cần Token (đã được axiosClient tự động đính kèm hoặc dùng Cookie)
                const response = await axiosClient.get(`/users/${id}`);
                setUser(response.data);
            } catch (err: any) {
                setError(err.response?.data || "Không thể tải thông tin người dùng");
                // Nếu lỗi 401 (Hết hạn token), cho người dùng đăng nhập lại
                if (err.response?.status === 401) {
                    localStorage.removeItem('user');
                    navigate('/login');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Profile Card */}
                <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">

                    {/* Cover Header */}
                    <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

                    <div className="relative px-8 pb-8">
                        {/* Avatar Section */}
                        <div className="relative -top-12 flex items-end space-x-6">
                            <div className="w-32 h-32 rounded-3xl border-4 border-white overflow-hidden bg-gray-200 shadow-lg">
                                <img
                                    src={user?.imageAvt || "https://ui-avatars.com/api/?name=" + user?.fullName + "&background=random"}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="pb-4">
                                <h1 className="text-3xl font-bold text-gray-900">{user?.fullName || "Chưa cập nhật tên"}</h1>
                                <p className="text-purple-600 font-medium">{user?.email}</p>
                            </div>
                        </div>

                        {/* Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Số điện thoại</p>
                                <p className="text-gray-800 font-semibold">{user?.phone || "Chưa cập nhật"}</p>
                            </div>

                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Trạng thái tài khoản</p>
                                <div className="flex items-center space-x-2">
                                    <span className={`w-3 h-3 rounded-full ${user?.enabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    <p className="text-gray-800 font-semibold">{user?.enabled ? 'Đang hoạt động' : 'Đã bị khóa'}</p>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Ngày tham gia</p>
                                <p className="text-gray-800 font-semibold">
                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : "Không rõ"}
                                </p>
                            </div>

                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">ID Thành viên</p>
                                <p className="text-gray-800 font-semibold">#{user?.id}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-10 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => alert("Tính năng cập nhật đang được phát triển!")}
                                className="flex-1 py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all active:scale-[0.98]"
                            >
                                Chỉnh sửa hồ sơ
                            </button>
                            <button
                                onClick={() => navigate('/shop')}
                                className="flex-1 py-4 bg-gray-100 text-gray-900 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98]"
                            >
                                Tiếp tục mua sắm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;