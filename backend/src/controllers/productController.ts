import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export const getProducts = async (req: Request, res: Response) => {
  const { search, categoryId, minPrice, maxPrice, minRating, sortBy, order, page = '1', limit = '12' } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const where: Record<string, unknown> = {};
  if (search) where.name = { contains: search as string, mode: 'insensitive' };
  if (categoryId) where.categoryId = categoryId as string;
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) (where.price as Record<string, unknown>).gte = parseFloat(minPrice as string);
    if (maxPrice) (where.price as Record<string, unknown>).lte = parseFloat(maxPrice as string);
  }
  if (minRating) where.rating = { gte: parseFloat(minRating as string) };
  const orderBy: Record<string, string> = {};
  if (sortBy) orderBy[sortBy as string] = (order as string) || 'asc';
  else orderBy.createdAt = 'desc';
  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, include: { category: true }, skip, take: parseInt(limit as string), orderBy }),
    prisma.product.count({ where }),
  ]);
  res.json({ products, total, page: parseInt(page as string), pages: Math.ceil(total / parseInt(limit as string)) });
};

export const getProduct = async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: { category: true, reviews: { include: { user: { select: { id: true, name: true } } } } } });
  if (!product) throw new AppError('Product not found', 404);
  res.json(product);
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, stock, categoryId, images } = req.body;
  const product = await prisma.product.create({ data: { name, description, price: parseFloat(price), stock: parseInt(stock), categoryId, images: images || [] } });
  res.status(201).json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { name, description, price, stock, categoryId, images } = req.body;
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: { name, description, ...(price && { price: parseFloat(price) }), ...(stock !== undefined && { stock: parseInt(stock) }), categoryId, ...(images && { images }) },
  });
  res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ message: 'Product deleted' });
};
