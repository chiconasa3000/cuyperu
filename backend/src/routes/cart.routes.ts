import { Router } from 'express';
import { cartIdentity } from '../middleware/cartIdentity';
import * as cartController from '../controllers/cart.controller';

const router = Router();

router.use(cartIdentity);
router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.put('/items/:productId', cartController.updateItem);
router.delete('/items/:productId', cartController.removeItem);
router.post('/merge', cartController.mergeSessionCart);

export default router;