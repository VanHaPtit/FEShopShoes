// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthService } from '../services/AuthService';
// import { SignupData, LoginData } from '../types';

// const Login: React.FC = () => {
//   // --- 1. States & Hooks ---
//   const [isLogin, setIsLogin] = useState(true);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [fullName, setFullName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const navigate = useNavigate();

//   // --- 2. Xử lý logic Submit ---
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       if (!isLogin) {
//         // LUỒNG ĐĂNG KÝ: Khớp với SignupRequest.java
//         const signupData: SignupData = {
//           email,
//           password,
//           fullName,
//           phone,
//           role: ["user"] // Mặc định gán role user
//         };
//         await AuthService.register(signupData);
//         alert("Đăng ký tài khoản thành công! Bây giờ bạn có thể đăng nhập.");
//         setIsLogin(true); // Chuyển sang form đăng nhập
//       } else {
//         // LUỒNG ĐĂNG NHẬP: Khớp với LoginRequest.java
//         const loginData: LoginData = {
//           username: email, // BE dùng username làm định danh (email)
//           password
//         };
//         const response = await AuthService.login(loginData);

//         // BƯỚC QUAN TRỌNG: Lưu thông tin vào LocalStorage trước khi chuyển trang
//         localStorage.setItem('user', JSON.stringify(response.data));

//         alert("Đăng nhập thành công!");

//         // Điều hướng về trang shop
//         navigate('/shop');

//         // Tải lại trang để các component như Navbar nhận trạng thái đăng nhập mới
//         window.location.reload();
//       }
//     } catch (err: any) {
//       // Xử lý lỗi từ Backend (401, 400, 500)
//       const errorMsg = err.response?.data?.message || err.response?.data || "Có lỗi xảy ra, vui lòng thử lại";
//       alert(errorMsg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
//       <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
//         <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 border border-white/20">

//           {/* Header Section */}
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
//               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
//                 <path d="m9 12 2 2 4-4" />
//               </svg>
//             </div>
//             <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
//               {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
//             </h2>
//             <p className="text-gray-500 mt-2 text-sm">
//               {isLogin ? 'Đăng nhập để tiếp tục trải nghiệm tuyệt vời' : 'Bắt đầu hành trình của bạn ngay hôm nay'}
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Email Input */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">Email</label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
//                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
//                 </span>
//                 <input
//                   type="email"
//                   placeholder="email@example.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-800"
//                 />
//               </div>
//             </div>

//             {/* Password Input */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">Mật khẩu</label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
//                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
//                 </span>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-800"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   {showPassword ? (
//                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
//                   ) : (
//                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Additional Fields for Register */}
//             {!isLogin && (
//               <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-top-2 duration-300">
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">Họ và tên</label>
//                   <div className="relative">
//                     <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
//                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
//                     </span>
//                     <input
//                       type="text"
//                       placeholder="Nguyễn Văn A"
//                       value={fullName}
//                       onChange={(e) => setFullName(e.target.value)}
//                       className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-800"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">Số điện thoại</label>
//                   <div className="relative">
//                     <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
//                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
//                     </span>
//                     <input
//                       type="text"
//                       placeholder="09xx xxx xxx"
//                       value={phone}
//                       onChange={(e) => setPhone(e.target.value)}
//                       className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-800"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-4"
//             >
//               {isLoading && (
//                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//               )}
//               <span>{isLogin ? 'Đăng Nhập' : 'Đăng Ký Tài Khoản'}</span>
//             </button>
//           </form>

//           {/* Footer Section */}
//           <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center space-y-4">
//             <p className="text-gray-500 text-sm">
//               {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản rồi?'}
//               <button
//                 onClick={() => setIsLogin(!isLogin)}
//                 className="ml-2 text-indigo-600 font-semibold hover:text-indigo-700 focus:outline-none"
//               >
//                 {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
//               </button>
//             </p>

//             {isLogin && (
//               <a href="#" className="text-xs text-gray-400 hover:text-indigo-500 transition-colors">
//                 Quên mật khẩu?
//               </a>
//             )}
//           </div>
//         </div>

//         <div className="mt-8 text-center text-gray-600 text-xs uppercase tracking-widest font-medium">
//           &copy; 2026 Modern Auth System | Designed for Adidas Shop
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;





// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthService } from '../services/AuthService';
// import { SignupData, LoginData } from '../types';

// const Login: React.FC = () => {
//   // --- 1. States & Hooks ---
//   const [isLogin, setIsLogin] = useState(true);
//   const [username, setUsername] = useState(''); // THÊM MỚI: State cho username
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [fullName, setFullName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const navigate = useNavigate();

//   // --- 2. Xử lý logic Submit ---
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       if (!isLogin) {
//         // LUỒNG ĐĂNG KÝ: Khớp hoàn toàn với SignupRequest.java mới của bạn
//         const signupData: SignupData = {
//           username, // Gửi username lên Backend
//           email,
//           password,
//           fullName,
//           phone,
//           role: ["user"]
//         };
//         await AuthService.register(signupData);
//         alert("Đăng ký tài khoản thành công! Bây giờ bạn có thể đăng nhập.");
//         setIsLogin(true);
//       } else {
//         // LUỒNG ĐĂNG NHẬP: Gửi 'email' vào trường 'username' của LoginRequest
//         // (Hoặc bạn có thể dùng state 'username' nếu muốn tách biệt)
//         const loginData: LoginData = {
//           username: email, // Backend hiện tại tìm kiếm dựa trên trường này
//           password
//         };
//         const response = await AuthService.login(loginData);

//         // Lưu thông tin vào LocalStorage
//         localStorage.setItem('user', JSON.stringify(response.data));

//         alert("Đăng nhập thành công!");
//         navigate('/shop');
//         window.location.reload();
//       }
//     } catch (err: any) {
//       // Hiển thị lỗi chi tiết từ Backend trả về
//       const errorMsg = err.response?.data?.message || err.response?.data || "Có lỗi xảy ra, vui lòng thử lại";
//       alert(errorMsg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
//       <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
//         <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 border border-white/20">

//           {/* Header Section */}
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
//               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
//                 <path d="m9 12 2 2 4-4" />
//               </svg>
//             </div>
//             <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
//               {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
//             </h2>
//             <p className="text-gray-500 mt-2 text-sm">
//               {isLogin ? 'Đăng nhập để tiếp tục trải nghiệm tuyệt vời' : 'Bắt đầu hành trình của bạn ngay hôm nay'}
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">

//             {/* Username Input - CHỈ HIỂN THỊ KHI ĐĂNG KÝ */}
//             {!isLogin && (
//               <div className="animate-in slide-in-from-top-2 duration-300">
//                 <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">Tên đăng nhập</label>
//                 <div className="relative">
//                   <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 1 0-16 0" /></svg>
//                   </span>
//                   <input
//                     type="text"
//                     placeholder="username123"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required={!isLogin}
//                     className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-800"
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Email Input */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">
//                 {isLogin ? 'Tên đăng nhập / Email' : 'Email'}
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
//                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
//                 </span>
//                 <input
//                   type={isLogin ? "text" : "email"} // Đăng nhập có thể dùng username nên để type text
//                   placeholder={isLogin ? "Username hoặc Email" : "email@example.com"}
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-800"
//                 />
//               </div>
//             </div>

//             {/* Password Input */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">Mật khẩu</label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
//                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
//                 </span>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-800"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   {showPassword ? (
//                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
//                   ) : (
//                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Additional Fields for Register */}
//             {!isLogin && (
//               <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-top-2 duration-300">
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">Họ và tên</label>
//                   <div className="relative">
//                     <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
//                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
//                     </span>
//                     <input
//                       type="text"
//                       placeholder="Nguyễn Văn A"
//                       value={fullName}
//                       onChange={(e) => setFullName(e.target.value)}
//                       className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-800"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">Số điện thoại</label>
//                   <div className="relative">
//                     <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
//                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
//                     </span>
//                     <input
//                       type="text"
//                       placeholder="09xx xxx xxx"
//                       value={phone}
//                       onChange={(e) => setPhone(e.target.value)}
//                       className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-800"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-4"
//             >
//               {isLoading && (
//                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//               )}
//               <span>{isLogin ? 'Đăng Nhập' : 'Đăng Ký Tài Khoản'}</span>
//             </button>
//           </form>

//           {/* Footer Section */}
//           <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center space-y-4">
//             <p className="text-gray-500 text-sm">
//               {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản rồi?'}
//               <button
//                 onClick={() => setIsLogin(!isLogin)}
//                 className="ml-2 text-indigo-600 font-semibold hover:text-indigo-700 focus:outline-none"
//               >
//                 {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
//               </button>
//             </p>

//             {isLogin && (
//               <a href="#" className="text-xs text-gray-400 hover:text-indigo-500 transition-colors">
//                 Quên mật khẩu?
//               </a>
//             )}
//           </div>
//         </div>

//         <div className="mt-8 text-center text-gray-600 text-xs uppercase tracking-widest font-medium">
//           &copy; 2026 Modern Auth System | Designed for Adidas Shop
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;





import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import { SignupData, LoginData } from '../types';

const Login: React.FC = () => {
  // --- 1. States & Hooks ---
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState(''); // Email sẽ đóng vai trò là Username
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // --- 2. Xử lý logic Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isLogin) {
        // LUỒNG ĐĂNG KÝ: Gán username = email
        const signupData: SignupData = {
          username: email, // <--- Tự động lấy email làm username
          email,
          password,
          fullName,
          phone,
          role: ["user"]
        };
        await AuthService.register(signupData);
        alert("Đăng ký tài khoản thành công! Bây giờ bạn có thể đăng nhập.");
        setIsLogin(true);
      } else {
        // LUỒNG ĐĂNG NHẬP
        const loginData: LoginData = {
          username: email,
          password
        };
        const response = await AuthService.login(loginData);

        // Lưu thông tin vào LocalStorage
        localStorage.setItem('user', JSON.stringify(response.data));

        alert("Đăng nhập thành công!");
        navigate('/shop');
        window.location.reload();
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data || "Có lỗi xảy ra, vui lòng thử lại";
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 border border-white/20">

          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              {isLogin ? 'Đăng nhập để mua sắm ngay' : 'Sử dụng Email của bạn để đăng ký'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email Input - Bây giờ là trường duy nhất dùng để định danh */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">
                Email / Tài khoản
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                </span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-800"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">Mật khẩu</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Additional Fields for Register */}
            {!isLogin && (
              <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">Họ và tên</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">Số điện thoại</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    </span>
                    <input
                      type="text"
                      placeholder="09xx xxx xxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-800"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-4"
            >
              {isLoading && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>{isLogin ? 'Đăng Nhập' : 'Đăng Ký Tài Khoản'}</span>
            </button>
          </form>

          {/* Footer Section */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center space-y-4">
            <p className="text-gray-500 text-sm">
              {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản rồi?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-indigo-600 font-semibold hover:text-indigo-700 focus:outline-none"
              >
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;