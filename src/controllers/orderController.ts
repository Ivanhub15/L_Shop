import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { User } from '../models/User';

const USERS_PATH = path.join(__dirname, '../data/users.json');

const readUsers = async (): Promise<User[]> => {
  const data = await fs.readFile(USERS_PATH, 'utf-8');
  return JSON.parse(data);
};

const writeUsers = async (users: User[]): Promise<void> => {
  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
};

interface CreateOrderRequest {
  address: string;
  phone: string;
  email: string;
}

export const createOrder = async (req: Request<{}, {}, CreateOrderRequest>, res: Response): Promise<void> => {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  const { address, phone, email } = req.body;

  if (!address || !phone || !email) {
    res.status(400).json({
      message: 'All delivery fields required'
    });
    return;
  }

  const users = await readUsers();
  const user = users.find(u => u.id === Number(sessionId));

  if (!user) {
    res.status(404).json({
      message: 'User not found'
    });
    return;
  }

  if (user.cart.length === 0) {
    res.status(400).json({
      message: 'Cart is empty'
    });
    return;
  }

  const order = {
    orderId: Date.now(),
    address,
    phone,
    email,
    items: user.cart,
    createdAt: new Date().toISOString()
  };

  // Clear cart
  user.cart = [];

  await writeUsers(users);

  res.json({
    message: 'Order created successfully',
    order
  });
};