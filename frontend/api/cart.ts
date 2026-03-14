import { apiCall } from './client';
import { CartItem } from '../types/types';

export const cart = {
  getCart: (): Promise<CartItem[]> => apiCall('/cart', 'GET'),

  addToCart: (productId: number, quantity: number): Promise<CartItem[]> =>
    apiCall('/cart/add', 'POST', { productId, quantity }),

  removeFromCart: (productId: number): Promise<CartItem[]> =>
    apiCall('/cart/remove', 'POST', { productId }),

  updateCartItem: (productId: number, quantity: number): Promise<CartItem[]> =>
    apiCall('/cart/update', 'POST', { productId, quantity }),
};
