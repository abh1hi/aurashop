<template>
  <section class="section-container shop-by-rating-section">
    <div class="section-header">
      <h2 class="section-title">Top Rated (4+ Stars)</h2>
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
    id: 501,
    name: 'Premium Headphones',
    brand: 'Sony',
    price: 299.00,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviews: 500
  },
  {
    id: 502,
    name: 'Mechanical Keyboard',
    brand: 'Keychron',
    price: 120.00,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b91add1?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviews: 320
  },
  {
    id: 503,
    name: 'Gaming Mouse',
    brand: 'Logitech',
    price: 80.00,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviews: 450
  },
  {
    id: 504,
    name: '4K Monitor',
    brand: 'Dell',
    price: 450.00,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviews: 120
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
  font-size: var(--text-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-color);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--spacing-lg);
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }
}
</style>
