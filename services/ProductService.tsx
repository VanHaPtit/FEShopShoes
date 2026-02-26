import axiosClient from '../api/axiosClient';
import { Product, ProductVariant } from '../types';

export const ProductService = {
  // Gọi GET /api/product (ProductController)
  getAll: async () => {
    const response = await axiosClient.get<Product[]>('/product');
    return response.data;
  },

  // Gọi GET /api/product/{id} (ProductController)
  getById: async (id: number) => {
    const response = await axiosClient.get<Product>(`/product/${id}`);
    return response.data;
  },



  getByCategory: async (categoryName: string) => {
    // Kết quả: /api/product?category=shoes
    const response = await axiosClient.get<Product[]>(`/product?category=${categoryName}`);
    return response.data;
  },


  getFlashSales: async () => {
    const response = await axiosClient.get<Product[]>('/product/sales');
    return response.data;
  },



  search: async (keyWord: string) => {
    const response = await axiosClient.get<Product[]>(`/product/search?keyWord=${keyWord}`);
    return response.data;
  },

  // Gọi GET /api/variant/product/{productId} (ProductVariantController)
  getVariants: async (productId: number) => {
    const response = await axiosClient.get<ProductVariant[]>(`/variant/product/${productId}`);
    return response.data;
  }
};

export default ProductService;
