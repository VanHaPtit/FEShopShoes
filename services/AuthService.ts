import axiosClient from '../api/axiosClient';

export const AuthService = {
    // Đăng nhập: Gửi username (email) và password
    login: (credentials: any) => {
        return axiosClient.post('/auth/signin', credentials);
    },

    // Đăng ký: Gửi đầy đủ email, password, fullName, phone, role
    register: (userData: any) => {
        return axiosClient.post('/auth/signup', userData);
    },

    // Đăng xuất
    logout: () => {
        return axiosClient.post('/auth/signout');
    }
};