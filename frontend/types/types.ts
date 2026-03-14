export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  login: string;
  phone: string;
  cart: CartItem[];
}

export interface Order {
  orderId: number;
  address: string;
  phone: string;
  email: string;
  items: CartItem[];
  createdAt: string;
}
