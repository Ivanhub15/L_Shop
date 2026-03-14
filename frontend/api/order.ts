import { apiCall } from './client';
import { Order } from '../types/types';

export const order = {
  createOrder: (data: {
    address: string;
    phone: string;
    email: string;
  }): Promise<{ message: string; order: Order }> =>
    apiCall('/order', 'POST', data),
};
