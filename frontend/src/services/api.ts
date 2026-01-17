import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

export const getRooms = async () => {
    const response = await api.get('/rooms');
    return response.data;
};

export const createBooking = async (bookingData: any) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
};

export const getBookings = async () => {
    const response = await api.get('/bookings');
    return response.data;
};

export const deleteBooking = async (id: number) => {
    await api.delete(`/bookings/${id}`);
};

export const updateBooking = async (id: number, data: any) => {
    const response = await api.put(`/bookings/${id}`, data);
    return response.data;
};

export default api;
