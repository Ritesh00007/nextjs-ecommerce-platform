import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = { title: 'ShopZone - E-Commerce', description: 'Your one-stop shop' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Toaster position="top-right" />
        <footer className="bg-gray-900 text-white py-10 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-2xl font-bold mb-2">ShopZone</p>
            <p className="text-gray-400">© 2024 ShopZone. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
