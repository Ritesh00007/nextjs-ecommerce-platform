import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();
router.use(authenticate, requireAdmin);

router.get('/stats', async (_req, res) => {
  const [users, products, orders, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: 'CANCELLED' } } }),
  ]);
  res.json({ users, products, orders, revenue: revenue._sum.total || 0 });
});

router.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true }, orderBy: { createdAt: 'desc' } });
  res.json(users);
});

router.put('/users/:id/role', async (req, res) => {
  const { role } = req.body;
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { role }, select: { id: true, name: true, email: true, role: true } });
  res.json(user);
});

router.delete('/users/:id', async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ message: 'User deleted' });
});

export default router;
