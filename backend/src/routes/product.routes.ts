import { Router } from 'express';
import * as productController from '../controllers/product.controller';

const router = Router();

router.get('/categories', productController.getCategories);
router.get('/products', productController.listProducts);
router.get('/products/:slug/related', productController.getRelatedProducts);
router.get('/products/:slug', productController.getProduct);

export default router;