import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as orderController from '../controllers/order.controller';

const router = Router();

router.post('/checkout', authMiddleware, orderController.checkout);
router.get('/orders', authMiddleware, orderController.getOrders);
router.get('/orders/:id', authMiddleware, orderController.getOrder);

export default router;