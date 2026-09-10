import { Router } from 'express';
import { cartIdentity } from '../middleware/cartIdentity';
import { authMiddleware } from '../middleware/auth';
import * as wishlistController from '../controllers/wishlist.controller';
import * as priceAlertController from '../controllers/priceAlert.controller';

const router = Router();

router.get('/wishlist', cartIdentity, wishlistController.getWishlist);
router.post('/wishlist/:productId', cartIdentity, wishlistController.addItem);
router.delete('/wishlist/:productId', cartIdentity, wishlistController.removeItem);

router.get('/price-alerts', authMiddleware, priceAlertController.getAlerts);
router.post('/price-alerts', authMiddleware, priceAlertController.createAlert);
router.delete('/price-alerts/:id', authMiddleware, priceAlertController.deleteAlert);

export default router;