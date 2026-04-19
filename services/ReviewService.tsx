import axios from 'axios'; // hoặc custom axios instance của bạn
import { Review } from '../types';
import axiosClient from '../api/axiosClient';

export const ReviewService = {
    getByProductId: async (productId: number): Promise<Review[]> => {
        const response = await axiosClient.get(`/reviews/product/${productId}`);
        return response.data;
    }
};