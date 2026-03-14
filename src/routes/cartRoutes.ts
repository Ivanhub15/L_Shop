import { Router } from 'express';
import { getCart, addToCart, removeFromCart, updateCartItem } from '../controllers/cartController';

const router = Router();

router.get('/', getCart);
router.post('/add', addToCart);
router.post('/remove', removeFromCart);
router.post('/update', updateCartItem);

export default router;