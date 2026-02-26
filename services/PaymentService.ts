import axiosClient from "../api/axiosClient";

const PaymentService = {
  // Gửi số tiền và nhận link thanh toán từ Backend
  createPaymentUrl: async (amount: number) => {
    const response = await axiosClient.get(`/vnpay/create-payment`, {
      params: { amount }
    });
    return response.data; // Giả định backend trả về { url: "https://sandbox..." }
  },

  // (Tùy chọn) Gửi thông tin để Backend kiểm tra lại sau khi thanh toán xong
  verifyPayment: async (params: string) => {
    const response = await axiosClient.get(`/vnpay/payment-info${params}`);
    return response.data;
  }
};

export default PaymentService;