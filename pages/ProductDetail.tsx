import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ProductService } from '../services/ProductService';
import { ReviewService } from '../services/ReviewService'; // IMPORT THÊM REVIEW SERVICE
import { Product, ProductVariant, Review } from '../types'; // IMPORT THÊM TYPE REVIEW
import { formatCurrency } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Breadcrumb from '../components/Breadcrumb';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]); // STATE MỚI CHO REVIEWS

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc'>('specs');

  const { addToCart } = useCart();
  const { showToast } = useToast();

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // CẬP NHẬT: Fetch product, variants VÀ reviews cùng lúc
        const [p, v, r] = await Promise.all([
          ProductService.getById(parseInt(id)),
          ProductService.getVariants(parseInt(id)),
          ReviewService.getByProductId(parseInt(id))
        ]);

        setProduct(p);
        setVariants(v);
        setReviews(r); // Lưu reviews vào state

        if (v.length > 0) {
          setSelectedVariant(v[0]);
          setSelectedSize(v[0].size);
          setSelectedColor(v[0].color);
        }

        if (p.images && p.images.length > 0) {
          setActiveImage(p.images[0]);
        }
      } catch (err) {
        showToast("Sản phẩm hiện tại không khả dụng", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant]);

  const handleIncrease = () => {
    if (selectedVariant && quantity < selectedVariant.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  useEffect(() => {
    if (selectedSize && selectedColor) {
      const match = variants.find(v => v.size === selectedSize && v.color === selectedColor);
      if (match) {
        setSelectedVariant(match);
      } else {
        const firstAvailableColor = variants.find(v => v.size === selectedSize);
        if (firstAvailableColor) {
          setSelectedVariant(firstAvailableColor);
          setSelectedColor(firstAvailableColor.color);
        }
      }
    }
  }, [selectedSize, selectedColor, variants]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    if (!user) {
      showToast("Vui lòng đăng nhập để mua sắm", "info");
      navigate('/signin');
      return;
    }

    addToCart(product, selectedVariant, quantity);
    showToast(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`, "success");
  };

  // Render các ngôi sao đánh giá
  const renderStars = (rating: number) => {
    return (
      <div className="flex text-black text-sm">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'opacity-100' : 'opacity-20'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!product) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-bold uppercase mb-4 italic tracking-tighter">Sản phẩm không tồn tại</h2>
      <Link to="/shop" className="bg-black text-white px-8 py-3 font-bold uppercase text-xs tracking-widest">Quay lại cửa hàng</Link>
    </div>
  );

  return (
    <div className="bg-[#fff9f9] min-h-screen pb-20">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-10 pt-6 pb-10">
        <Breadcrumb items={[
          { label: product.category?.name || 'Shop', path: '/shop' },
          { label: product.name }
        ]} />

        {/* TOP SECTION: Hero Images & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 mt-6">
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-white rounded-[2rem] aspect-square overflow-hidden w-full relative flex items-center justify-center p-8 sm:p-16 shadow-sm border border-red-50/50">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-black rounded-2xl overflow-hidden border-[3px] transition-all
                    ${activeImage === img ? 'border-[#5c1c15]' : 'border-transparent opacity-80 hover:opacity-100'}`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
              {/* Optional video placeholder as in image */}
              <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl border-2 border-white flex items-center justify-center cursor-pointer shadow-sm">
                <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 text-xs">▶</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Info Sidebar */}
          <div className="lg:col-span-5 h-fit space-y-6 lg:space-y-8 bg-[#fef8f8] rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-sm border border-red-50/50">
            <div className="space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                {product.gender} • {product.category?.name || 'GIÀY CHẠY BỘ'}
              </p>
              <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-[#5c1c15] leading-[1.1]">{product.name}</h1>

              <div className="flex flex-col space-y-2 pt-2">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-red-600">
                    {formatCurrency(product.salePrice || product.basePrice)}
                  </span>
                  {(product.salePrice && product.salePrice < product.basePrice) && (
                    <>
                      <span className="text-gray-400 line-through text-lg font-medium">
                        {formatCurrency(product.basePrice)}
                      </span>
                      <span className="bg-[#ffe4e4] text-red-600 px-2 py-1 rounded-md text-xs font-bold">
                        -{Math.round((1 - product.salePrice / product.basePrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[10px] italic text-gray-400 uppercase tracking-widest pt-1">
                  THUẾ BAO GỒM TRONG GIÁ NIÊM YẾT
                </p>
              </div>
            </div>

            {/* Size Selector */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm uppercase text-[#5c1c15]">Chọn Kích Cỡ (VN)</h3>
                <a href="#" className="text-xs underline text-[#5c1c15] font-medium hover:text-black"></a>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {Array.from(new Set(variants.map(v => v.size))).sort((a, b) => Number(a) - Number(b)).map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-10 sm:w-14 sm:h-12 rounded-xl text-sm font-bold transition-all flex items-center justify-center border
                      ${selectedSize === size ? 'bg-[#3f120f] text-white border-[#3f120f]' : 'bg-white text-black border-gray-200 hover:border-[#3f120f]'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="pt-2">
              <h3 className="font-bold text-sm uppercase text-[#5c1c15] mb-4">Màu sắc hiện có</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {Array.from(new Set(variants.map(v => v.color))).map(color => {
                  const isAvailableForSize = variants.some(v => v.color === color && v.size === selectedSize);
                  return (
                    <button
                      key={color}
                      disabled={!isAvailableForSize}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-[11px] font-bold uppercase transition-all border
                        ${selectedColor === color ? 'bg-[#3f120f] text-white border-[#3f120f]' : 'bg-white text-black border-gray-200 hover:border-[#3f120f]'}
                        ${!isAvailableForSize ? 'opacity-30 cursor-not-allowed border-dashed' : ''}`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center h-12 w-full sm:w-32 bg-white rounded-full border border-gray-200 px-1 justify-between flex-shrink-0">
                <button onClick={handleDecrease} disabled={quantity <= 1} className="w-10 h-10 flex items-center justify-center text-lg text-gray-500 hover:text-black disabled:opacity-30 transition-colors"> − </button>
                <span className="w-6 text-center font-bold text-sm">{quantity}</span>
                <button onClick={handleIncrease} disabled={!selectedVariant || quantity >= selectedVariant.stock} className="w-10 h-10 flex items-center justify-center text-lg text-gray-500 hover:text-black disabled:opacity-30 transition-colors"> + </button>
              </div>

              {selectedVariant && selectedVariant.stock === 0 && (
                <span className="text-sm font-bold text-red-500 uppercase ml-2 flex-grow">Hết hàng</span>
              )}
              {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
                <span className="text-xs font-bold text-red-500 uppercase flex-grow text-center sm:text-left">Chỉ còn {selectedVariant.stock}</span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
              className={`w-full py-4 mt-2 rounded-full font-bold uppercase text-sm tracking-widest transition-all flex items-center justify-center group
                ${(!selectedVariant || selectedVariant.stock === 0) ? 'bg-[#e5e5e5] text-gray-500 cursor-not-allowed' : 'bg-[#3f120f] text-white hover:bg-black shadow-lg'}`}
            >
              {selectedVariant && selectedVariant.stock > 0 ? 'THÊM VÀO GIỎ HÀNG' : 'HẾT HÀNG'}
            </button>
          </div>
        </div>

        {/* BOTTOM SECTION: Specs & Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12 lg:mt-16">
          {/* LEFT: Specs & Description */}
          <div className="lg:col-span-8">
            <div className="flex space-x-8 lg:space-x-10 border-b border-[#5c1c15]/20 mb-8 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('specs')}
                className={`font-bold uppercase tracking-widest pb-3 whitespace-nowrap transition-colors ${activeTab === 'specs' ? 'text-[#5c1c15] border-b-[3px] border-[#5c1c15]' : 'text-gray-400 hover:text-[#5c1c15]'}`}
              >
                THÔNG SỐ CHI TIẾT
              </button>
              <button
                onClick={() => setActiveTab('desc')}
                className={`font-bold uppercase tracking-widest pb-3 whitespace-nowrap transition-colors ${activeTab === 'desc' ? 'text-[#5c1c15] border-b-[3px] border-[#5c1c15]' : 'text-gray-400 hover:text-[#5c1c15]'}`}
              >
                MÔ TẢ
              </button>
            </div>

            {activeTab === 'specs' && (
              <div className="space-y-2 mb-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 bg-[#fdf4f4] rounded-xl p-4 sm:p-5 text-sm">
                  <div className="font-bold text-[#5c1c15] uppercase tracking-wide mb-1 sm:mb-0">Giới tính</div>
                  <div className="sm:col-span-2 text-gray-700 font-medium">{product.gender}</div>
                </div>
                {product.material && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 bg-white rounded-xl p-4 sm:p-5 text-sm">
                    <div className="font-bold text-[#5c1c15] uppercase tracking-wide mb-1 sm:mb-0">Chất liệu</div>
                    <div className="sm:col-span-2 text-gray-700 font-medium">{product.material}</div>
                  </div>
                )}
                {product.soleType && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 bg-[#fdf4f4] rounded-xl p-4 sm:p-5 text-sm">
                    <div className="font-bold text-[#5c1c15] uppercase tracking-wide mb-1 sm:mb-0">Đế giày</div>
                    <div className="sm:col-span-2 text-gray-700 font-medium">{product.soleType}</div>
                  </div>
                )}
                {product.origin && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 bg-white rounded-xl p-4 sm:p-5 text-sm">
                    <div className="font-bold text-[#5c1c15] uppercase tracking-wide mb-1 sm:mb-0">Xuất xứ</div>
                    <div className="sm:col-span-2 text-gray-700 font-medium">{product.origin}</div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'desc' && (
              <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                <h3 className="font-black text-xl text-[#5c1c15] mb-6">Chi Tiết Sản Phẩm</h3>
                <div className="text-sm text-gray-600 leading-relaxed space-y-4">
                  <p>{product.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Reviews */}
          <div className="lg:col-span-4 space-y-6 pt-4 lg:pt-0">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[#5c1c15] font-black uppercase tracking-widest text-lg">ĐÁNH GIÁ</h3>
              <button className="text-xs font-bold text-gray-500 hover:text-black transition-colors">Xem tất cả ({reviews.length})</button>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] text-center">
                <p className="text-sm text-gray-500 font-medium">Chưa có đánh giá nào.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#3f120f] text-white flex items-center justify-center font-bold text-lg">
                        {review.username.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-[13px] uppercase text-[#5c1c15]">{review.username}</p>
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">Đã mua hàng</p>
                      </div>
                    </div>
                    <div className="mb-4 text-[#3f120f]">{renderStars(review.rating)}</div>
                    <p className="text-[13px] text-gray-600 italic leading-relaxed mb-4">"{review.comment}"</p>
                    <p className="text-[10px] text-gray-400 font-medium">{review.createdAt}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white rounded-[2rem] p-8 text-center border border-gray-100 mt-6 shadow-sm">
              <p className="text-sm text-gray-600 mb-5 font-medium">Bạn đã trải nghiệm sản phẩm này?</p>
              <button className="bg-[#3f120f] text-white rounded-full px-8 py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-black transition-colors shadow-md">
                Viết đánh giá
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;