import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { Product } from '../models/Product';

const PRODUCTS_PATH = path.join(__dirname, '../data/products.json');

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {

  let products: Product[] = JSON.parse(
    await fs.readFile(PRODUCTS_PATH, 'utf-8')
  );

  const { search, category, available, sort } = req.query;

  if (search) {
    const term = (search as string).toLowerCase();

    products = products.filter(
      p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }

  if (category) {
    products = products.filter(
      p => p.category === category
    );
  }

  if (available === 'true') {
    products = products.filter(
      p => p.available
    );
  }

  if (sort === 'price_asc') {
    products.sort((a, b) => a.price - b.price);
  }

  if (sort === 'price_desc') {
    products.sort((a, b) => b.price - a.price);
  }

  res.json(products);
};