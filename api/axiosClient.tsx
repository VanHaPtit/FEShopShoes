// import axios from 'axios';

// const axiosClient = axios.create({
//     baseURL: 'http://localhost:8080/api',
//     withCredentials: true,
// });

// axiosClient.interceptors.request.use((config) => {
//     const userData = localStorage.getItem('user');
//     if (userData) {
//         try {
//             const { token } = JSON.parse(userData);
//             if (token) {
//                 // Đảm bảo khớp với logic parseJwt trong AuthTokenFilter.java
//                 config.headers.Authorization = `Bearer ${token}`;
//             }
//         } catch (error) {
//             console.error("Lỗi parse thông tin user từ LocalStorage", error);
//         }
//     }
//     return config;
// });

// export default axiosClient;



import axios from 'axios';

const axiosClient = axios.create({
    // window.location.hostname sẽ lấy "localhost" hoặc "192.168.0.121" 
    // tùy theo việc bạn đang truy cập web bằng địa chỉ nào.
    baseURL: `http://${window.location.hostname}:8080/api`,
    withCredentials: true,
});

// INTERCEPTOR CHO REQUEST: Tự động thêm Token
axiosClient.interceptors.request.use((config) => {
    const userData = localStorage.getItem('user');
    if (userData) {
        try {
            const parsedUser = JSON.parse(userData);
            // KIỂM TRA KỸ: Backend của bạn trả về 'token' hay 'accessToken'?
            const token = parsedUser.token || parsedUser.accessToken;

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Lỗi parse thông tin user", error);
        }
    }
    return config;
}, (error) => Promise.reject(error));

// INTERCEPTOR CHO RESPONSE: Xử lý lỗi 401 tập trung
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Phiên đăng nhập hết hạn!");
            localStorage.removeItem('user');
            // Tùy chọn: window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
