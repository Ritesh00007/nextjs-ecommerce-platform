import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();
router.use(authenticate);

router.get('/', async (req: any, res) => {
  let cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
  if (!cart) cart = await prisma.cart.create({ data: { userId: req.user.id, items: [] } });
  res.json(cart);
});

router.put('/', async (req: any, res) => {
  const { items } = req.body;
  const cart = await prisma.cart.upsert({
    where: { userId: req.user.id },
    update: { items },
    create: { userId: req.user.id, items },
  });
  res.json(cart);
});

router.delete('/', async (req: any, res) => {
  await prisma.cart.upsert({ where: { userId: req.user.id }, update: { items: [] }, create: { userId: req.user.id, items: [] } });
  res.json({ message: 'Cart cleared' });
});

export default router;
