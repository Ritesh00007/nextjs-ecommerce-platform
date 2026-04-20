'use client';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '', country: 'US' });
  const [payment, setPayment] = useState({ cardNumber: '', expiry: '', cvv: '', name: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/login'); return; }
    setLoading(true);
    try {
      const piRes = await api.post('/payment/create-intent', { amount: total() });
      const orderData = {
        items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
        shippingAddress: address,
        paymentIntentId: piRes.data.id,
      };
      const orderRes = await api.post('/orders', orderData);
      clearCart();
      toast.success('Order placed successfully!');
      router.push(`/orders/${orderRes.data.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <div className="space-y-4">
              {['street', 'city', 'state', 'zip', 'country'].map(field => (
                <div key={field}>
                  <label className="label capitalize">{field}</label>
                  <input className="input" required value={(address as any)[field]}
                    onChange={e => setAddress(a => ({ ...a, [field]: e.target.value }))} />
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Payment Details</h2>
            <div className="space-y-4">
              <div><label className="label">Cardholder Name</label><input className="input" required value={payment.name} onChange={e => setPayment(p => ({ ...p, name: e.target.value }))} /></div>
              <div><label className="label">Card Number</label><input className="input" required maxLength={19} placeholder="4242 4242 4242 4242" value={payment.cardNumber} onChange={e => setPayment(p => ({ ...p