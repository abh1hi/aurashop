<template>
  <section class="section-container trending-accessories-section">
    <div class="section-header">
      <h2 class="section-title">Trending Accessories</h2>
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
    id: 401,
    name: 'Gold Necklace',
    brand: 'Luxe',
    price: 150.00,
    image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviews: 80
  },
  {
    id: 402,
    name: 'Aviator Sunglasses',
    brand: 'Ray-Ban',
    price: 160.00,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviews: 210
  },
  {
    id: 403,
    name: 'Leather Belt',
    brand: 'Gucci',
    price: 350.00,
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviews: 120
  },
  {
    id: 404,
    name: 'Silk Scarf',
    brand: 'Hermes',
    price: 420.00,
    image: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviews: 45
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
