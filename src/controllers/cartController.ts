import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { User } from '../models/User';
import { CartItem } from '../models/CartItem';

const USERS_PATH = path.join(__dirname, '../data/users.json');

const readUsers = async (): Promise<User[]> => {
  const data = await fs.readFile(USERS_PATH, 'utf-8');
  return JSON.parse(data);
};

const writeUsers = async (users: User[]): Promise<void> => {
  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
};

export const getCart = async (req: Request, res: Response) => {

  const userId = Number(req.cookies.sessionId);

  const users = await readUsers();
  const user = users.find(u => u.id === userId);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.json(user.cart);
};

export const addToCart = async (req: Request, res: Response) => {

  const userId = Number(req.cookies.sessionId);
  const { productId, quantity } = req.body as CartItem;

  const users = await readUsers();
  const user = users.find(u => u.id === userId);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const existingItem = user.cart.find(
    item => item.productId === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    user.cart.push({ productId, quantity });
  }

  await writeUsers(users);

  res.json({ message: 'Item added to cart' });
};

export const updateCartItem = async (req: Request, res: Response) => {

  const userId = Number(req.cookies.sessionId);
  const { productId, quantity } = req.body as CartItem;

  const users = await readUsers();
  const user = users.find(u => u.id === userId);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const item = user.cart.find(
    i => i.productId === productId
  );

  if (!item) {
    res.status(404).json({ message: 'Item not found in cart' });
    return;
  }

  item.quantity = quantity;

  await writeUsers(users);

  res.json({ message: 'Cart updated' });
};

export const removeCartItem = async (req: Request, res: Response) => {

  const userId = Number(req.cookies.sessionId);
  const { productId } = req.body as { productId: number };

  const users = await readUsers();
  const user = users.find(u => u.id === userId);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  user.cart = user.cart.filter(
    item => item.productId !== productId
  );

  await writeUsers(users);

  res.json({ message: 'Item removed from cart' });
};