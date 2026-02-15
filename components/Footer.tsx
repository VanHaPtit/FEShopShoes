
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const sections = [
    {
      title: "Sản phẩm",
      links: ["Giày", "Quần áo", "Phụ kiện", "Hàng mới về", "Release Dates"]
    },
    {
      title: "Thể thao",
      links: ["Chạy bộ", "Bóng đá", "Tập luyện", "Bóng rổ", "Ngoài trời"]
    },
    {
      title: "Thông tin công ty",
      links: ["Giới thiệu về chúng tôi", "Cơ hội nghề nghiệp", "Tin tức", "Bền vững"]
    },
    {
      title: "Hỗ trợ",
      links: ["Trợ giúp", "Vận chuyển", "Trả hàng & Hoàn tiền", "Khuyến mãi"]
    }
  ];

  return (
    <footer className="bg-black text-white mt-auto">
      {/* Top Banner Subscription */}
      <div className="bg-[#ede734] py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <h2 className="text-2xl md:text-3xl font-black italic uppercase text-black tracking-tighter">
            TRỞ THÀNH HỘI VIÊN & NHẬN ƯU ĐÃI 15%
          </h2>
          <Link 
            to="/register" 
            className="bg-black text-white px-8 py-4 font-bold uppercase text-sm hover:opacity-80 transition-all flex items-center"
          >
            Đăng ký miễn phí <span className="ml-2 text-xl">→</span>
          </Link>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-10 py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h4 className="font-bold text-sm uppercase italic tracking-tighter">{section.title}</h4>
            <ul className="space-y-2">
              {section.links.map((link, lIdx) => (
                <li key={lIdx}>
                  <Link to="#" className="text-[13px] text-gray-400 hover:text-white hover:underline transition-all">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        
        <div className="col-span-2 space-y-6">
          <h4 className="font-bold text-sm uppercase italic tracking-tighter">Theo dõi chúng tôi</h4>
          <div className="flex space-x-4">
            {['facebook', 'instagram', 'twitter', 'youtube'].map(social => (
              <a key={social} href="#" className="w-10 h-10 border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <span className="sr-only">{social}</span>
                <i className={`fab fa-${social}`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-6 text-center text-[11px] text-gray-500 uppercase font-bold tracking-widest px-4">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-8">
          <Link to="/privacy" className="hover:underline">Chính sách Bảo mật</Link>
          <Link to="/terms" className="hover:underline">Điều khoản và Điều kiện</Link>
          <Link to="/legal" className="hover:underline">Thông tin pháp lý</Link>
          <span>© 2024 adidas Vietnam Company Limited</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
