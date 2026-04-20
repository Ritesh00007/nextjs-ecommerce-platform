import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

router.get('/product/:productId', async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { productId: req.params.productId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(reviews);
});

router.post('/', authenticate, async (req: any, res) => {
  const { productId, rating, comment } = req.body;
  const review = await prisma.review.create({ data: { userId: req.user.id, productId, rating, comment }, include: { user: { select: { id: true, name: true } } } });
  const agg = await prisma.review.aggregate({ where: { productId }, _avg: { rating: true }, _count: true });
  await prisma.product.update({ where: { id: productId }, data: { rating: agg._avg.rating || 0, reviewCount: agg._count } });
  res.status(201).json(review);
});

router.delete('/:id', authenticate, async (req: any, res) => {
  const review = await prisma.review.findUnique({ where: { id: req.params.id } });
  if (!review) return res.status(404).json({ error: 'Review not found' });
  if (review.userId !== req.user.id && req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  await prisma.review.delete({ where: { id: req.params.id } });
  res.json({ message: 'Review deleted' });
});

export default router;
