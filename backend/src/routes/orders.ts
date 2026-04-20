import { Router } from 'express';
import { createOrder, getOrders, getOrder, updateOrderStatus } from '../controllers/orderController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id/status', requireAdmin, updateOrderStatus);

export default router;
