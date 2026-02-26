import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
    
    if (vnp_ResponseCode === '00') {
      // Thanh toán thành công
      // Bạn có thể gọi thêm một API tới Backend để xác nhận đơn hàng lần cuối
      alert("Thanh toán thành công!");
      navigate('/profile'); // Chuyển về trang cá nhân hoặc lịch sử đơn hàng
    } else {
      // Lỗi (Khách hàng hủy hoặc lỗi thẻ...)
      alert("Thanh toán thất bại hoặc đã bị hủy.");
      navigate('/cart');
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Đang kiểm tra kết quả giao dịch...</h2>
      {/* Bạn có thể dùng LoadingSpinner.tsx của bạn ở đây */}
    </div>
  );
};

export default PaymentCallback;