

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductService } from '../services/ProductService';
import { Product, ProductVariant } from '../types';
import { formatCurrency } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Breadcrumb from '../components/Breadcrumb';
import LoadingSpinner from '../components/LoadingSpinner';
import { HeartIcon } from '../components/SimpleIcons';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // State quản lý biến thể được chọn dựa trên sự kết hợp Size và Color
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [p, v] = await Promise.all([
          ProductService.getById(parseInt(id)),
          ProductService.getVariants(parseInt(id))
        ]);

        setProduct(p);
        setVariants(v);

        // Khởi tạo giá trị mặc định từ biến thể đầu tiên
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

  // Logic cập nhật selectedVariant khi người dùng thay đổi Size hoặc Color
  useEffect(() => {
    if (selectedSize && selectedColor) {
      const match = variants.find(v => v.size === selectedSize && v.color === selectedColor);
      if (match) {
        setSelectedVariant(match);
      } else {
        // Nếu sự kết hợp hiện tại không có, tìm biến thể đầu tiên của Size đó
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
    addToCart(product, selectedVariant);
    showToast(`Đã thêm ${product.name} (Size: ${selectedVariant.size}) vào giỏ hàng`, "success");
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!product) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-bold uppercase mb-4 italic tracking-tighter">Sản phẩm không tồn tại</h2>
      <Link to="/shop" className="bg-black text-white px-8 py-3 font-bold uppercase text-xs tracking-widest">Quay lại cửa hàng</Link>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-10">
      <Breadcrumb items={[
        { label: product.category?.name || 'Shop', path: '/shop' },
        { label: product.name }
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT: Image Gallery */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-[#f5f5f5] aspect-square overflow-hidden w-full relative">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`flex-shrink-0 w-20 h-20 sm:w-24 bg-gray-100 border-2 transition-all 
                  ${activeImage === img ? 'border-black opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Product Info Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 italic">
                {product.gender} • {product.category?.name || 'Originals'}
              </p>
              <button className="hover:opacity-60 transition-opacity">
                <HeartIcon className="w-6 h-6" />
              </button>
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-[0.9]">{product.name}</h1>

            <div className="flex flex-col space-y-1">
              {/* Ưu tiên hiển thị giá theo biến thể nếu BE có set price riêng cho size/color */}
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-red-600">
                  {formatCurrency(selectedVariant?.price || product.salePrice || product.basePrice)}
                </span>
                {(product.salePrice && product.salePrice < product.basePrice) && (
                  <span className="text-gray-400 line-through text-lg">
                    {formatCurrency(product.basePrice)}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Thuế bao gồm trong giá niêm yết
              </p>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Size Selector (Integer từ Backend) */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xs uppercase tracking-widest">Chọn Kích Cỡ (VN)</h3>

            </div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from(new Set(variants.map(v => v.size))).sort((a, b) => a - b).map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border-2 py-3 text-xs font-bold transition-all
                    ${selectedSize === size ? 'bg-black text-white border-black' : 'border-gray-100 hover:border-black'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-4">Màu sắc hiện có</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(variants.map(v => v.color))).map(color => {
                const isAvailableForSize = variants.some(v => v.color === color && v.size === selectedSize);
                return (
                  <button
                    key={color}
                    disabled={!isAvailableForSize}
                    onClick={() => setSelectedColor(color)}
                    className={`border-2 px-4 py-2 text-[11px] font-bold uppercase transition-all
                      ${selectedColor === color ? 'bg-black text-white border-black' : 'border-gray-100 hover:border-black'}
                      ${!isAvailableForSize ? 'opacity-20 cursor-not-allowed border-dashed' : ''}`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 space-y-4">
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
              className={`w-full py-5 font-bold uppercase text-sm tracking-widest transition-all flex items-center justify-center group
                ${(!selectedVariant || selectedVariant.stock === 0)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-black text-white hover:opacity-80'}`}
            >
              {selectedVariant && selectedVariant.stock > 0 ? 'THÊM VÀO GIỎ HÀNG' : 'HẾT HÀNG'}
              {selectedVariant && selectedVariant.stock > 0 && <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>}
            </button>
            <p className="text-[11px] text-gray-500 font-medium italic text-center">
              Giao hàng nhanh từ 2-4 ngày làm việc
            </p>
          </div>

          {/* Product Specifications (Dựa trên field mới của Entity Product) */}
          <div className="pt-10 border-t border-gray-100 space-y-6">
            <div className="space-y-4">
              <h4 className="font-bold uppercase text-sm italic tracking-tighter">Thông số chi tiết</h4>
              <div className="grid grid-cols-2 gap-y-3 text-[11px] font-bold uppercase tracking-widest text-gray-600">
                <span>Giới tính:</span> <span className="text-black">{product.gender}</span>
                <span>Chất liệu:</span> <span className="text-black">{product.material}</span>
                <span>Đế giày:</span> <span className="text-black">{product.soleType}</span>
                <span>Xuất xứ:</span> <span className="text-black">{product.origin}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold uppercase text-sm italic tracking-tighter">Mô tả</h4>
              <p className="text-[13px] leading-relaxed text-gray-600 italic">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;