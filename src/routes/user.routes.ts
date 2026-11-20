
import { Router } from 'express';
import { getProducts } from '../controllers/app.controllers';

const router = Router();

router.get('/products', getProducts);

export default router;
