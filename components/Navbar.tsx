
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AdidasLogo, SearchIcon, UserIcon, HeartIcon, CartIcon, MenuIcon, CloseIcon } from './SimpleIcons';
// import { useCart } from '../context/CartContext';
// import { AuthService } from '../services/AuthService';

// const Navbar: React.FC = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [user, setUser] = useState<any>(null);
//   const { cart } = useCart();
//   const navigate = useNavigate();

//   const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

//   // 1. Kiểm tra trạng thái đăng nhập khi component mount
//   useEffect(() => {
//     const savedUser = localStorage.getItem('user');
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//   }, []);

//   // 2. Xử lý Đăng xuất với hộp thoại xác nhận
//   const handleLogout = async () => {
//     // Hiển thị hộp thoại xác nhận của trình duyệt
//     const isConfirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");

//     if (isConfirmed) {
//       try {
//         await AuthService.logout();
//         localStorage.removeItem('user');
//         setUser(null);
//         setIsMobileMenuOpen(false); // Đóng menu mobile nếu đang mở

//         alert("Bạn đã đăng xuất thành công!");
//         navigate('/');
//       } catch (err) {
//         console.error("Lỗi đăng xuất:", err);
//         alert("Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại.");
//       }
//     }
//   };

//   // 3. Xử lý Tìm kiếm
//   const handleSearch = (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     if (searchTerm.trim()) {
//       navigate(`/shop?q=${encodeURIComponent(searchTerm.trim())}`);
//       setSearchTerm('');
//       setIsMobileMenuOpen(false);
//     }
//   };

//   return (
//     <header className="w-full sticky top-0 z-50 bg-white">
//       {/* Top Banner */}
//       <div className="bg-black text-white text-[10px] sm:text-[11px] font-bold h-8 flex items-center justify-center uppercase tracking-widest px-4 text-center">
//         Trả hàng dễ dàng và miễn phí | Giao hàng nhanh toàn quốc
//       </div>

//       <nav className="border-b border-gray-100">
//         {/* Utility Nav (Desktop) */}
//         <div className="hidden lg:flex max-w-[1400px] mx-auto px-10 justify-end items-center space-x-6 h-8 text-[11px] text-gray-600 font-medium">
//           <Link to="/orders" className="hover:underline">Đơn hàng</Link>

//           {user ? (
//             <>
//               <span className="font-bold text-black italic">XIN CHÀO, {user.email.toUpperCase()}</span>
//               <button
//                 onClick={handleLogout}
//                 className="hover:underline text-red-600 font-bold"
//               >
//                 Đăng xuất
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/register" className="hover:underline">Đăng ký</Link>
//               <Link to="/login" className="hover:underline">Đăng nhập</Link>
//             </>
//           )}

//           <div className="flex items-center space-x-1 cursor-pointer">
//             <img src="https://flagcdn.com/w20/vn.png" alt="VN" className="w-4 h-3 object-cover" />
//             <span className="uppercase">VN</span>
//           </div>
//         </div>

//         {/* Main Brand Nav */}
//         <div className="max-w-[1400px] mx-auto px-4 lg:px-10 flex items-center justify-between h-14 md:h-20">
//           {/* Mobile Menu Toggle */}
//           <button className="lg:hidden p-2" onClick={() => setIsMobileMenuOpen(true)}>
//             <MenuIcon />
//           </button>

//           {/* Logo */}
//           <Link to="/" className="flex-shrink-0">
//             <AdidasLogo className="w-12 h-8 md:w-16 md:h-12 text-black" />
//           </Link>

//           {/* Desktop Menu Links */}
//           <div className="hidden lg:flex items-center space-x-8 font-bold uppercase text-[14px] tracking-widest h-full">
//             <Link to="/shop" className="hover:border-b-4 border-black h-full flex items-center px-1">Giày</Link>
//             <Link to="/shop?category=men" className="hover:border-b-4 border-black h-full flex items-center px-1">Nam</Link>
//             <Link to="/shop?category=women" className="hover:border-b-4 border-black h-full flex items-center px-1">Nữ</Link>
//             <Link to="/shop?category=sale" className="text-red-600 hover:border-b-4 border-black h-full flex items-center px-1">Giảm Giá</Link>
//           </div>

//           {/* Icons & Search */}
//           <div className="flex items-center space-x-2 md:space-x-4">
//             {/* Search Bar Desktop */}
//             <form onSubmit={handleSearch} className="relative group hidden md:block">
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Tìm kiếm"
//                 className="bg-[#eceff1] px-3 py-2 text-sm focus:outline-none w-40 lg:w-48 pr-10 border-b-2 border-transparent focus:border-black transition-all"
//               />
//               <button type="submit" className="absolute right-2 top-2 hover:scale-110 transition-transform">
//                 <SearchIcon />
//               </button>
//             </form>

//             <Link to={user ? "/profile" : "/login"} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//               <UserIcon />
//             </Link>

//             <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-full transition-colors">
//               <HeartIcon />
//             </button>

//             <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//               <CartIcon count={cartCount} />
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu Overlay */}
//       {isMobileMenuOpen && (
//         <div className="fixed inset-0 bg-white z-[100] p-6 lg:hidden overflow-y-auto flex flex-col">
//           <div className="flex justify-between items-center mb-10">
//             <AdidasLogo className="w-12 h-8" />
//             <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
//               <CloseIcon className="w-8 h-8" />
//             </button>
//           </div>

//           {/* Mobile Search */}
//           <form onSubmit={handleSearch} className="mb-8 relative">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="TÌM KIẾM"
//               className="w-full bg-gray-100 px-4 py-3 text-sm font-bold focus:outline-none border-b-2 border-black"
//             />
//             <button type="submit" className="absolute right-3 top-3">
//               <SearchIcon />
//             </button>
//           </form>

//           {/* Mobile Main Links */}
//           <div className="flex flex-col space-y-6 text-2xl font-black italic uppercase tracking-tighter">
//             <Link onClick={() => setIsMobileMenuOpen(false)} to="/shop">Giày</Link>
//             <Link onClick={() => setIsMobileMenuOpen(false)} to="/shop?category=men">Nam</Link>
//             <Link onClick={() => setIsMobileMenuOpen(false)} to="/shop?category=women">Nữ</Link>
//             <Link onClick={() => setIsMobileMenuOpen(false)} to="/shop?category=sale" className="text-red-600">Giảm Giá</Link>
//           </div>

//           <hr className="my-8 border-gray-200" />

//           {/* Mobile Utility Links */}
//           <div className="flex flex-col space-y-4 font-bold text-sm uppercase">
//             {user ? (
//               <>
//                 <div className="py-2">
//                   <span className="text-gray-400 block text-[10px]">Đang đăng nhập với</span>
//                   <span className="text-black italic">{user.email}</span>
//                 </div>
//                 <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Hồ sơ của tôi</Link>
//                 <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}>Đơn hàng</Link>
//                 <button
//                   onClick={handleLogout}
//                   className="text-left text-red-600 mt-4 pt-4 border-t border-gray-100"
//                 >
//                   Đăng xuất
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Đăng nhập</Link>
//                 <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Đăng ký</Link>
//                 <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}>Đơn hàng</Link>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Navbar;




import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AdidasLogo, SearchIcon, UserIcon, HeartIcon, CartIcon, MenuIcon, CloseIcon } from './SimpleIcons';
import { useCart } from '../context/CartContext';
import { AuthService } from '../services/AuthService';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<any>(null);
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Cập nhật trạng thái user mỗi khi chuyển trang hoặc component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, [location]);

  const handleLogout = async () => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
    if (isConfirmed) {
      try {
        await AuthService.logout();
        localStorage.removeItem('user');
        setUser(null);
        setIsMobileMenuOpen(false);
        alert("Bạn đã đăng xuất thành công!");
        navigate('/');
      } catch (err) {
        console.error("Lỗi đăng xuất:", err);
      }
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-sm">
      <div className="bg-black text-white text-[10px] sm:text-[11px] font-bold h-8 flex items-center justify-center uppercase tracking-widest px-4 text-center">
        Trả hàng dễ dàng và miễn phí | Giao hàng nhanh toàn quốc
      </div>

      <nav className="border-b border-gray-100">
        <div className="hidden lg:flex max-w-[1400px] mx-auto px-10 justify-end items-center space-x-6 h-8 text-[11px] text-gray-600 font-medium">
          <Link to="/orders" className="hover:underline">Đơn hàng</Link>

          {user ? (
            <>
              {/* Hiển thị Full Name thay vì Email */}
              <span className="font-bold text-black italic">
                XIN CHÀO, {user.fullName ? user.fullName.toUpperCase() : 'KHÁCH'}
              </span>
              <button onClick={handleLogout} className="hover:underline text-red-600 font-bold">Đăng xuất</button>
            </>
          ) : (
            <>
              {/* Chuyển hướng đến trang login (tab đăng ký/đăng nhập xử lý tại Login.tsx) */}
              <Link to="/login" className="hover:underline">Đăng ký</Link>
              <Link to="/login" className="hover:underline">Đăng nhập</Link>
            </>
          )}
          <div className="flex items-center space-x-1 font-bold text-black">VN</div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 lg:px-10 flex items-center justify-between h-14 md:h-20">
          <button className="lg:hidden p-2" onClick={() => setIsMobileMenuOpen(true)}>
            <MenuIcon />
          </button>

          <Link to="/" className="flex-shrink-0">
            <AdidasLogo className="w-12 h-8 md:w-16 md:h-12 text-black" />
          </Link>

          <div className="hidden lg:flex items-center space-x-8 font-bold uppercase text-[14px] tracking-widest h-full">
            <Link to="/shop" className="hover:border-b-4 border-black h-full flex items-center px-1">Giày</Link>
            <Link to="/shop?category=men" className="hover:border-b-4 border-black h-full flex items-center px-1">Nam</Link>
            <Link to="/shop?category=women" className="hover:border-b-4 border-black h-full flex items-center px-1">Nữ</Link>
            <Link to="/shop?category=sale" className="text-red-600 hover:border-b-4 border-black h-full flex items-center px-1">Giảm Giá</Link>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <form onSubmit={handleSearch} className="relative group hidden md:block">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm"
                className="bg-[#eceff1] px-3 py-2 text-sm focus:outline-none w-40 lg:w-48 pr-10 border-b-2 border-transparent focus:border-black transition-all"
              />
              <button type="submit" className="absolute right-2 top-2"><SearchIcon /></button>
            </form>
            <Link to={user ? "/profile" : "/login"} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><UserIcon /></Link>
            <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors"><CartIcon count={cartCount} /></Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-[100] p-6 lg:hidden overflow-y-auto flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <AdidasLogo className="w-12 h-8" />
            <button onClick={() => setIsMobileMenuOpen(false)}><CloseIcon className="w-8 h-8" /></button>
          </div>
          <div className="flex flex-col space-y-6 text-2xl font-black italic uppercase">
            {user && <div className="text-sm not-italic text-gray-500">Chào, {user.fullName}</div>}
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/shop">Giày</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/shop?category=men">Nam</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/shop?category=women">Nữ</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/shop?category=sale" className="text-red-600">Giảm Giá</Link>
          </div>
          <hr className="my-8 border-gray-100" />
          <div className="flex flex-col space-y-4 font-bold text-sm uppercase">
            {user ? (
              <button onClick={handleLogout} className="text-left text-red-600">Đăng xuất</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Đăng nhập</Link>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Đăng ký</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;