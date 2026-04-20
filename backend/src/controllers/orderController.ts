import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createOrder = async (req: AuthRequest, res: Response) => {
  const { items, shippingAddress, paymentIntentId } = req.body;
  const userId = req.user!.id;
  let total = 0;
  const orderItems = [];
  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) throw new AppError(`Product ${item.productId} not found`, 404);
    if (product.stock < item.quantity) throw new AppError(`Insufficient stock for ${product.name}`, 400);
    total += product.price * item.quantity;
    orderItems.push({ productId: item.productId, quantity: item.quantity, price: product.price });
    await prisma.product.update({ where: { id: item.productId }, data: { stock: product.stock - item.quantity } });
  }
  const order = await prisma.order.create({
    data: { userId, total, shippingAddress, paymentIntentId, status: 'CONFIRMED', items: { create: orderItems } },
    include: { items: { include: { product: true } } },
  });
  res.status(201).json(order);
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const isAdmin = req.user!.role === 'ADMIN';
  const orders = await prisma.order.findMany({
    where: isAdmin ? {} : { userId },
    include: { items: { include: { product: true } }, user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
};

export const getOrder = async (req: AuthRequest, res: Response) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: { include: { product: true } }, user: { select: { id: true, name: true, email: true } } },
  });
  if (!order) throw new AppError('Order not found', 404);
  if (req.user!.role !== 'ADMIN' && order.userId !== req.user!.id) throw new AppError('Forbidden', 403);
  res.json(order);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  const order = await prisma.order.update({ where: { id: req.params.id }, data: { status } });
  res.json(order);
};
