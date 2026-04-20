'use client';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const handleCheckout = () => {
    if (!user) { router.push('/login?redirect=/checkout'); return; }
    router.push('/checkout');
  };

  if (items.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
      <Link href="/products" className="btn-primary">Shop Now</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="card flex gap-4">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {item.image ? <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized /> : null}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                <div className="flex items-center border rounded">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 hover:bg-gray-100">-</button>
                  <span className="px-3 py-1">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 hover:bg-gray-100">+</button>
                </div>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="card h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {items.map(i => <div key={i.id} className="flex justify-between text-sm"><span>{i.name} x{i.quantity}</span><span>${(i.price * i.quantity).toFixed(2)}</span></div>)}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${total().toFixed(2)}</span></div>
          </div>
          <button onClick={handleCheckout} className="btn-primary w-full mt-4 py-3">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
}
