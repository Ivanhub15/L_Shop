import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { User } from '../models/User';
import { Product } from '../models/Product';

const USERS_PATH = path.join(__dirname, '../data/users.json');
const PRODUCTS_PATH = path.join(__dirname, '../data/products.json');

const readUsers = async (): Promise<User[]> => {
  const data = await fs.readFile(USERS_PATH, 'utf-8');
  return JSON.parse(data);
};

const readProducts = async (): Promise<Product[]> => {
  const data = await fs.readFile(PRODUCTS_PATH, 'utf-8');
  return JSON.parse(data);
};

const writeUsers = async (users: User[]): Promise<void> => {
  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
};

interface AddToCartRequest {
  productId: number;
  quantity: number;
}

interface RemoveFromCartRequest {
  productId: number;
}

interface UpdateCartItemRequest {
  productId: number;
  quantity: number;
}

export const getCart = async (req: Request, res: Response): Promise<void> => {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  const users = await readUsers();
  const user = users.find(u => u.id === Number(sessionId));

  if (!user) {
    res.status(401).json({ message: 'User not found' });
    return;
  }

  res.json(user.cart);
};

export const addToCart = async (req: Request<{}, {}, AddToCartRequest>, res: Response): Promise<void> => {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  const { productId, quantity } = req.body;

  if (!quantity || quantity < 1) {
    res.status(400).json({ message: 'Invalid quantity' });
    return;
  }

  const users = await readUsers();
  const products = await readProducts();

  const user = users.find(u => u.id === Number(sessionId));
  const product = products.find(p => p.id === productId);

  if (!user || !product) {
    res.status(400).json({ message: 'Invalid request' });
    return;
  }

  const existingItem = user.cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    user.cart.push({
      ...product,
      quantity
    });
  }

  await writeUsers(users);

  res.json(user.cart);
};

export const removeFromCart = async (req: Request<{}, {}, RemoveFromCartRequest>, res: Response): Promise<void> => {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  const { productId } = req.body;

  const users = await readUsers();
  const user = users.find(u => u.id === Number(sessionId));

  if (!user) {
    res.status(401).json({ message: 'User not found' });
    return;
  }

  user.cart = user.cart.filter(item => item.id !== productId);

  await writeUsers(users);

  res.json(user.cart);
};

export const updateCartItem = async (req: Request<{}, {}, UpdateCartItemRequest>, res: Response): Promise<void> => {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  const { productId, quantity } = req.body;

  if (!quantity || quantity < 1) {
    res.status(400).json({ message: 'Invalid quantity' });
    return;
  }

  const users = await readUsers();
  const user = users.find(u => u.id === Number(sessionId));

  if (!user) {
    res.status(401).json({ message: 'User not found' });
    return;
  }

  const cartItem = user.cart.find(item => item.id === productId);

  if (!cartItem) {
    res.status(404).json({ message: 'Item not in cart' });
    return;
  }

  cartItem.quantity = quantity;

  await writeUsers(users);

  res.json(user.cart);
};