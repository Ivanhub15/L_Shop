import { CartItem } from './CartItem';

export interface User {
  id: number;
  name: string;
  email: string;
  login: string;
  phone: string;
  password: string;
  cart: CartItem[];
}