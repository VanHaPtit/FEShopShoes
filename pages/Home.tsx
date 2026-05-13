import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import ProductService from '../services/ProductService';
import { Product } from '../types';

import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data: Product[] = await ProductService.getAll();
        setProducts(
          data.filter(product => product.active).slice(0, 8)
        );
      } catch (error) {
        console.error('Lỗi khi tải trang chủ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* HERO */}
      <section className="relative h-[80vh] w-full overflow-hidden bg-[#f0f2f5]">
        <img
          src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Hero Banner"
          className="absolute right-0 top-0 w-full md:w-2/3 h-full object-cover object-center md:object-right mix-blend-multiply opacity-95"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f0f2f5] via-[#f0f2f5]/90 to-transparent flex items-center">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-10 w-full">
            <div className="max-w-xl space-y-4">
              <div className="inline-block bg-[#c8102e] text-white px-3 py-1 text-xs font-bold tracking-widest uppercase">
                SẢN PHẨM MỚI
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-[#1a1a1a]">
                CHINH PHỤC <br />
                <span className="text-[#c8102e]">MỌI GIỚI HẠN</span>
              </h1>
              <p className="text-gray-600 text-base md:text-lg max-w-md pt-2 leading-relaxed font-medium">
                Trải nghiệm sự kết hợp hoàn hảo giữa công nghệ đệm khí tiên tiến và phong cách đường phố đương đại.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link
                  to="/shop"
                  className="bg-[#c8102e] text-white px-8 py-3 font-bold uppercase text-sm hover:bg-red-800 transition-all text-center"
                >
                  MUA NGAY
                </Link>
                <Link
                  to="/shop"
                  className="bg-white border-2 border-black text-black px-8 py-3 font-bold uppercase text-sm hover:bg-black hover:text-white transition-all text-center"
                >
                  KHÁM PHÁ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-10">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8">
          DANH MỤC PHỔ BIẾN
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'CHẠY BỘ', img: 'https://picsum.photos/seed/run/800/800' },
            { title: 'BÓNG ĐÁ', img: 'https://picsum.photos/seed/foot/800/800' },
            { title: 'ORIGINALS', img: 'https://picsum.photos/seed/org/800/800' },
          ].map((cat, index) => (
            <div
              key={index}
              className="relative aspect-[3/4] group overflow-hidden cursor-pointer"
            >
              <img
                src={cat.img}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter border-b-4 border-white inline-block">
                  {cat.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-10">
        <div className="flex items-end justify-between mb-8 border-b-2 border-gray-100 pb-4">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">
            HÀNG MỚI VỀ
          </h2>
          <Link
            to="/shop"
            className="text-sm font-bold uppercase tracking-widest hover:underline"
          >
            Xem tất cả
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* BRAND MESSAGE */}
      <section className="bg-black text-white py-20">
        <div className="max-w-[800px] mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
            YOU GOT THIS
          </h2>
          <p className="text-xl font-medium leading-relaxed opacity-80 italic">
            Khi bạn bỏ qua mọi sự xao nhãng và áp lực, chỉ còn lại bạn và cuộc chơi.
            Hãy tận hưởng từng khoảnh khắc và chinh phục mục tiêu của mình.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-[#ede734] text-black px-12 py-4 font-bold uppercase text-sm tracking-widest hover:opacity-80 transition-all"
          >
            KHÁM PHÁ NGAY
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
