import axiosClient from "../api/axiosClient";

const PaymentService = {
  createPaymentUrl: async (amount: number) => {
    // Gọi endpoint Backend đã public qua ngrok
    const response = await axiosClient.get(`/vnpay/create-payment`, {
      params: { amount }
    });
    return response.data; // Mong đợi Backend trả về { url: "https://sandbox.vnpayment.vn/..." }
  }
};

export default PaymentService;