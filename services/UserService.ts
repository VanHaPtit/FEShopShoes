import axiosClient from '../api/axiosClient';

export const UserService = {
    getProfile: (id: number) => axiosClient.get(`/users/${id}`), // Gọi tới getUserById trong BE
    updateProfile: (id: number, data: any) => axiosClient.put(`/users/${id}`, data), // Gọi tới updateUser
};