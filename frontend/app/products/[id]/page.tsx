'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import ReviewSection from '@/components/ReviewSection';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore(s => s.addItem);
  const { user } = useAuthStore();

  useEffect(() => {
    api.get(`/products/${id}`).then(r => setProduct(r.data));
  }, [id]);

  if (!product) return <div className="max-w-7xl mx-auto px-4 py-16 text-center">Loading...</div>;

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.images[0] || '', quantity: qty, stock: product.stock });
    toast.success('Added to cart!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="relative h-96 rounded-xl overflow-hidden mb-4 bg-gray-100">
            {product.images[selectedImage] ? (
              <Image src={product.images[selectedImage]} alt={product.name} fill className="object-cover" unoptimized />
            ) : <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>}
          </div>
          <div className="flex gap-2">
            {product.images.map((img: string, i: number) => (
              <button key={i} onClick={() => setSelectedImage(i)} className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${i === selectedImage ? 'border-primary' : 'border-gray-200'}`}>
                <Image src={img} alt="" fill className="object-cover" unoptimized />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm text-primary font-medium mb-2">{product.category?.name}</p>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-400">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
            <span className="text-gray-500">({product.reviewCount} reviews)</span>
          </div>
          <p className="text-4xl font-bold text-primary mb-6">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <p className="text-sm mb-4">{product.stock > 0 ? <span className="text-green-600 font-medium">{product.stock} in stock</span> : <span className="text-red-600">Out of stock</span>}</p>
          <div className="flex items-center gap-4 mb-6">
            <label className="font-medium">Qty:</label>
            <div className="flex items-center border rounded-lg">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-100">-</button>
              <span className="px-4 py-2">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3 py-2 hover:bg-gray-100">+</button>
            </div>
          </div>
          <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-primary w-full py-3 text-lg disabled:opacity-50">Add to Cart</button>
        </div>
      </div>
      <ReviewSection productId={product.id} reviews={product.reviews || []} user={user} onReviewAdded={() => api.get(`/products/${id}`).then(r => setProduct(r.data))} />
    </div>
  );
}
