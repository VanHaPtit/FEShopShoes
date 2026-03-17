import axiosClient from '../api/axiosClient';

export const AuthService = {
    // Đăng nhập: Backend (Spring Security) thường yêu cầu { username, password }
    // Lưu ý: 'username' ở đây có thể là giá trị email người dùng nhập vào
    login: (credentials: { username: string; password: string }) => {
        return axiosClient.post('/auth/signin', credentials);
    },

    // Đăng ký: Phải gửi đầy đủ các trường khớp với User.java
    register: (userData: any) => {
        const signupPayload = {
            ...userData,
            role: userData.role || ["user"] 
        };
        return axiosClient.post('/auth/signup', signupPayload);
    },

    // Đăng xuất: Gọi API xóa session/cookie ở BE nếu có
    logout: () => {
        return axiosClient.post('/auth/signout');
    }
};

export default AuthService;