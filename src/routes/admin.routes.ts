
import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  login,
  updateProduct,
} from '../controllers/admin.controllers';
import { authenticateToken } from '../middlewares/app.middlewares';

const router = Router();

router.post('/login', login);

router.post(
    '/create',
    authenticateToken,
    createProduct
);
router.put('/:id', authenticateToken, updateProduct); //update product
router.delete('/:id', authenticateToken, deleteProduct);


export default router;
