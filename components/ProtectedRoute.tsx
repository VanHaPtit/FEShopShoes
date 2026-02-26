import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { User } from '../types'; // Sử dụng interface đã cập nhật

const ProtectedRoute: React.FC = () => {
    // Đảm bảo sử dụng key 'user' viết thường đồng bộ với Login
    const userData = localStorage.getItem('user');

    if (!userData) return <Navigate to="/login" replace />;

    try {
        const user: User = JSON.parse(userData);

        // Kiểm tra quyền Admin trong mảng roles
        const hasAdminRole = user.roles?.some(
            (r) => r.id === 2 || r.name === 'ROLE_ADMIN'
        );

        if (!hasAdminRole) {
            alert("Bạn không có quyền truy cập khu vực này!");
            return <Navigate to="/" replace />;
        }

        return <Outlet />;
    } catch {
        localStorage.removeItem('user');
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;