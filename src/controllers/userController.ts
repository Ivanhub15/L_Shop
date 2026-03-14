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

interface RegisterRequest {
  name: string;
  email: string;
  login: string;
  phone: string;
  password: string;
}

interface LoginRequest {
  login: string;
  password: string;
}

export const register = async (req: Request<{}, {}, RegisterRequest>, res: Response): Promise<void> => {
  const { name, email, login, phone, password } = req.body;

  const users = await readUsers();

  const newUser: User = {
    id: Date.now(),
    name,
    email,
    login,
    phone,
    password,
    cart: []
  };

  users.push(newUser);
  await writeUsers(users);

  // Set httpOnly cookie with 10 minute expiry
  res.cookie('sessionId', newUser.id, {
    httpOnly: true,
    maxAge: 10 * 60 * 1000, // 10 minutes
    sameSite: 'lax'
  });

  res.json(newUser);
};

export const login = async (req: Request<{}, {}, LoginRequest>, res: Response): Promise<void> => {
  const { login, password } = req.body;

  const users = await readUsers();

  const user = users.find(u => u.login === login && u.password === password);

  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  // Set httpOnly cookie with 10 minute expiry
  res.cookie('sessionId', user.id, {
    httpOnly: true,
    maxAge: 10 * 60 * 1000, // 10 minutes
    sameSite: 'lax'
  });

  res.json(user);
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('sessionId');
  res.json({ message: 'Logged out successfully' });
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
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

  res.json(user);
};