import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Dùng hook của bạn
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute: React.FC = () => {
    const { user, isLoading } = useAuth(); // 2. Lấy thông tin từ Context

    // 3. Đợi cho đến khi Context load xong dữ liệu từ localStorage
    if (isLoading) {
        return <LoadingSpinner fullScreen />; 
    }

    // 4. Nếu chưa đăng nhập, đá về trang signin
    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    // 5. Kiểm tra quyền Admin (Sửa lại logic mảng chuỗi)
    const isAdmin = user.roles?.includes('ROLE_ADMIN');

    if (!isAdmin) {
        alert("Bạn không có quyền truy cập khu vực này!");
        return <Navigate to="/" replace />;
    }

    // 6. Nếu là Admin, cho phép vào trang AdminDashboard (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;