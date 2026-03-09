import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { User } from '../models/User';

const USERS_PATH = path.join(__dirname, '../data/users.json');

const readUsers = async (): Promise<User[]> => {
  const data = await fs.readFile(USERS_PATH, 'utf-8');
  return JSON.parse(data) as User[];
};

const writeUsers = async (users: User[]): Promise<void> => {
  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
};

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, login, phone, password } = req.body as Omit<
    User,
    'id' | 'cart'
  >;

  if (!name || !email || !login || !phone || !password) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  const users = await readUsers();

  const existingUser = users.find(
    (u) => u.email === email || u.login === login
  );

  if (existingUser) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

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

  // httpOnly cookie на 10 минут
  res.cookie('sessionId', newUser.id, {
    httpOnly: true,
    maxAge: 10 * 60 * 1000
  });

  res.status(201).json({ message: 'Registration successful' });
};
export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { login, password } = req.body as {
    login: string;
    password: string;
  };

  const users = await readUsers();

  const user = users.find(
    (u) => u.login === login && u.password === password
  );

  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  res.cookie('sessionId', user.id, {
    httpOnly: true,
    maxAge: 10 * 60 * 1000
  });

  res.json({ message: 'Login successful' });
};