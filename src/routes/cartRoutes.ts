import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
} from '../controllers/cartController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authMiddleware, getCart);
router.post('/add', authMiddleware, addToCart);
router.post('/update', authMiddleware, updateCartItem);
router.post('/remove', authMiddleware, removeCartItem);

export default router;