import axiosClient from '../api/axiosClient';

export const CartApiService = {
    // Lấy giỏ hàng của user từ DB
    getByUserId: (userId: number) => axiosClient.get(`/carts/user/${userId}`),

    // Thêm item mới vào DB
    addItem: (cartItem: any) => axiosClient.post('/cart-items', cartItem),

    // Cập nhật số lượng trong DB
    updateItem: (itemId: number, details: any) => axiosClient.put(`/cart-items/${itemId}`, details),

    // Xóa item khỏi DB
    removeItem: (itemId: number) => axiosClient.delete(`/cart-items/${itemId}`)
};