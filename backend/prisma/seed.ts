import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'electronics' }, update: {}, create: { name: 'Electronics', slug: 'electronics' } }),
    prisma.category.upsert({ where: { slug: 'clothing' }, update: {}, create: { name: 'Clothing', slug: 'clothing' } }),
    prisma.category.upsert({ where: { slug: 'books' }, update: {}, create: { name: 'Books', slug: 'books' } }),
    prisma.category.upsert({ where: { slug: 'home-garden' }, update: {}, create: { name: 'Home & Garden', slug: 'home-garden' } }),
    prisma.category.upsert({ where: { slug: 'sports' }, update: {}, create: { name: 'Sports', slug: 'sports' } }),
  ]);

  const adminPass = await bcrypt.hash('admin123', 12);
  const userPass = await bcrypt.hash('user123', 12);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { name: 'Admin User', email: 'admin@example.com', passwordHash: adminPass, role: Role.ADMIN },
  });

  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: { name: 'John Doe', email: 'user@example.com', passwordHash: userPass, role: Role.CUSTOMER },
  });

  const products = [
    { name: 'Wireless Headphones', description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and exceptional sound quality.', price: 199.99, stock: 50, categoryId: categories[0].id, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'], rating: 4.5, reviewCount: 128 },
    { name: 'Smartphone Pro Max', description: 'Latest flagship smartphone with advanced camera system, 5G connectivity and all-day battery.', price: 999.99, stock: 30, categoryId: categories[0].id, images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'], rating: 4.7, reviewCount: 256 },
    { name: 'Laptop Ultra Slim', description: 'Ultra-thin and powerful laptop with 16GB RAM, 512GB SSD and stunning 4K display.', price: 1299.99, stock: 20, categoryId: categories[0].id, images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'], rating: 4.6, reviewCount: 89 },
    { name: 'Classic Cotton T-Shirt', description: 'Comfortable 100% organic cotton t-shirt available in multiple colors. Perfect for everyday wear.', price: 29.99, stock: 200, categoryId: categories[1].id, images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'], rating: 4.2, reviewCount: 340 },
    { name: 'Slim Fit Jeans', description: 'Modern slim fit jeans made from premium denim with stretch for maximum comfort.', price: 79.99, stock: 150, categoryId: categories[1].id, images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'], rating: 4.3, reviewCount: 215 },
    { name: 'The Great Gatsby', description: 'F. Scott Fitzgerald classic novel. A timeless story of wealth, love, and the American Dream.', price: 12.99, stock: 100, categoryId: categories[2].id, images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'], rating: 4.8, reviewCount: 502 },
    { name: 'JavaScript: The Good Parts', description: 'Essential guide to the best features of JavaScript by Douglas Crockford.', price: 24.99, stock: 75, categoryId: categories[2].id, images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500'], rating: 4.6, reviewCount: 189 },
    { name: 'Ceramic Plant Pot Set', description: 'Set of 3 handcrafted ceramic plant pots in varying sizes. Perfect for indoor plants.', price: 45.99, stock: 80, categoryId: categories[3].id, images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500'], rating: 4.4, reviewCount: 67 },
    { name: 'Yoga Mat Premium', description: 'Non-slip premium yoga mat with alignment lines. Extra thick for joint support.', price: 59.99, stock: 120, categoryId: categories[4].id, images: ['https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500'], rating: 4.5, reviewCount: 143 },
    { name: 'Running Shoes Pro', description: 'Lightweight and responsive running shoes with advanced cushioning technology.', price: 129.99, stock: 60, categoryId: categories[4].id, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'], rating: 4.7, reviewCount: 298 },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log('Seeding complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
