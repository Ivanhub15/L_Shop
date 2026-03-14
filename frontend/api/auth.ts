import { apiCall } from './client';
import { User } from '../types/types';

export const auth = {
  register: (data: {
    name: string;
    email: string;
    login: string;
    phone: string;
    password: string;
  }): Promise<User> => apiCall('/users/register', 'POST', data),

  login: (data: { login: string; password: string }): Promise<User> =>
    apiCall('/users/login', 'POST', data),

  logout: (): Promise<{ message: string }> =>
    apiCall('/users/logout', 'POST'),

  getCurrentUser: (): Promise<User> => apiCall('/users/me', 'GET'),
};
