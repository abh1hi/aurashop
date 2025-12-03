<template>
  <section class="section-container trending-section">
    <div class="section-header">
      <h2 class="section-title">Trending Now</h2>
      <LiquidButton text="View All" type="ghost" size="sm" icon="arrow_forward" />
    </div>
    <div class="product-grid">
      <ProductCard 
        v-for="product in products" 
        :key="product.id" 
        :product="product" 
      />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import LiquidButton from '../liquid-ui-kit/LiquidButton/LiquidButton.vue';
import ProductCard from '../ProductCard.vue';

const products = ref([
  {
    id: 101,
    name: 'Velvet Blazer',
    brand: 'Luxe',
    price: 129.99,
    originalPrice: 159.99,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 124,
    isNew: true,
    colors: ['#800020', '#000000'],
    sizes: ['S', 'M', 'L']
  },
  {
    id: 102,
    name: 'Silk Scarf',
    brand: 'Aura',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 89,
    colors: ['#FFD700', '#C0C0C0']
  },
  {
    id: 103,
    name: 'Leather Tote',
    brand: 'Urban',
    price: 199.50,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 210,
    colors: ['#8B4513', '#000000'],
    isBestSeller: true
  },
  {
    id: 104,
    name: 'Gold Hoops',
    brand: 'Shine',
    price: 89.00,
    image: 'https://images.unsplash.com/photo-1635767798638-3e2523422c69?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewCount: 56
  }
]);
</script>

<style scoped>
.section-container {
  padding: var(--spacing-xl) var(--spacing-lg);
  max-width: 1280px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.section-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-color);
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 40px;
  height: 3px;
  background: var(--brand-primary);
  border-radius: 2px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
}

@media (max-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }
  
  .section-container {
    padding: var(--spacing-lg) var(--spacing-md);
  }
}
</style>
