import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';
import featureRoutes from './feature.routes';

const router = Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/', productRoutes);
router.use('/cart', cartRoutes);
router.use('/', orderRoutes);
router.use('/', featureRoutes);

export default router;