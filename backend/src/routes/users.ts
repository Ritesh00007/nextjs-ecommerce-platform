import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

const router = Router();

router.use(authenticate);

router.get('/me', async (req: any, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, name: true, email: true, role: true, createdAt: true } });
  res.json(user);
});

router.put('/me', async (req: any, res) => {
  const { name, email, password } = req.body;
  const data: Record<string, unknown> = {};
  if (name) data.name = name;
  if (email) data.email = email;
  if (password) data.passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.update({ where: { id: req.user.id }, data, select: { id: true, name: true, email: true, role: true } });
  res.json(user);
});

export default router;
