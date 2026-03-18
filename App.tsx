
// import React, { Suspense, lazy } from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import LoadingSpinner from './components/LoadingSpinner';
// import GeminiAssistant from './components/GeminiAssistant';

// // Lazy loading pages for performance
// const Home = lazy(() => import('./pages/Home'));
// const Shop = lazy(() => import('./pages/Shop'));
// const ProductDetail = lazy(() => import('./pages/ProductDetail'));
// const Cart = lazy(() => import('./pages/Cart'));
// const Login = lazy(() => import('./pages/Login'));
// const NotFound = lazy(() => import('./pages/NotFound'));

// const App: React.FC = () => {
//   return (
//     <div className="min-h-screen flex flex-col selection:bg-black selection:text-white">
//       <Navbar />

//       <main className="flex-grow">
//         <Suspense fallback={<LoadingSpinner fullScreen />}>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/shop" element={<Shop />} />
//             <Route path="/product/:id" element={<ProductDetail />} />
//             <Route path="/cart" element={<Cart />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </Suspense>
//       </main>

//       <GeminiAssistant />
//       <Footer />
//     </div>
//   );
// };

// export default App;





import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import GeminiAssistant from './components/GeminiAssistant';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Profile = lazy(() => import('./pages/Profile'));
const PaymentCallback = lazy(() => import('./pages/PaymentCallback'));

// Admin
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const App: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {/* KHU VỰC CHO ADMIN */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>

        {/* KHU VỰC CHO KHÁCH HÀNG */}
        <Route path="/*" element={
          <div className="min-h-screen flex flex-col selection:bg-black selection:text-white">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/signin" element={<Login />} />
                <Route path="/signup" element={<Login />} />
                <Route path="/login" element={<Navigate to="/signin" replace />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/payment-callback" element={<PaymentCallback />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <GeminiAssistant />
            <Footer />
          </div>
        } />
      </Routes>
    </Suspense>
  );
};

export default App;
