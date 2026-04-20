import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', async (_req, res) => {
  const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } } });
  res.json(categories);
});

router.post('/', authenticate, requireAdmin, async (req, res) => {
  const { name, slug } = req.body;
  const category = await prisma.category.create({ data: { name, slug } });
  res.status(201).json(category);
});

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const category = await prisma.category.update({ where: { id: req.params.id }, data: req.body });
  res.json(category);
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  await prisma.category.delete({ where: { id: req.params.id } });
  res.json({ message: 'Category deleted' });
});

export default router;
