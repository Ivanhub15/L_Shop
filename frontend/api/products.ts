import { apiCall } from './client';
import { Product } from '../types/types';

export const products = {
  getAll: (params?: {
    search?: string;
    category?: string;
    available?: boolean;
    sort?: 'price_asc' | 'price_desc';
  }): Promise<Product[]> => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.available !== undefined) query.append('available', String(params.available));
    if (params?.sort) query.append('sort', params.sort);

    const endpoint = query.toString() ? `/products?${query.toString()}` : '/products';
    return apiCall(endpoint, 'GET');
  },
};
