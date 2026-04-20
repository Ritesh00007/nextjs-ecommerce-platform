import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import CategoryGrid from '@/components/CategoryGrid';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
    </div>
  );
}
