<template>
  <section class="section-container price-drop-section">
    <div class="section-header">
      <h2 class="section-title">Recently Dropped Prices</h2>
      <LiquidButton text="View All" type="ghost" size="sm" icon="arrow_forward" />
    </div>
    <div class="product-scroll">
      <ProductCard 
        v-for="product in products" 
        :key="product.id" 
        :product="product" 
        class="min-w-card"
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
    id: 201,
    name: 'Summer Dress',
    brand: 'Zara',
    price: 35.99,
    originalPrice: 59.99,
    discountPercentage: 40,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    reviewCount: 45,
    colors: ['#FF69B4', '#FFFFFF'],
    sizes: ['XS', 'S', 'M']
  },
  {
    id: 202,
    name: 'Running Shoes',
    brand: 'Nike',
    price: 89.99,
    originalPrice: 129.99,
    discountPercentage: 30,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 210,
    colors: ['#FF4500', '#000000', '#FFFFFF'],
    sizes: ['8', '9', '10', '11']
  },
  {
    id: 203,
    name: 'Smart Watch',
    brand: 'Tech',
    price: 199.99,
    originalPrice: 249.99,
    discountPercentage: 20,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewCount: 89,
    colors: ['#000000', '#C0C0C0']
  },
  {
    id: 204,
    name: 'Denim Jacket',
    brand: 'Levis',
    price: 65.00,
    originalPrice: 95.00,
    discountPercentage: 32,
    image: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    reviewCount: 120,
    colors: ['#1E90FF'],
    sizes: ['M', 'L', 'XL']
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

.product-scroll {
  display: flex;
  gap: var(--spacing-lg);
  overflow-x: auto;
  padding-bottom: var(--spacing-md);
  padding-left: 4px;
  scrollbar-width: none;
}

.product-scroll::-webkit-scrollbar {
  display: none;
}

.min-w-card {
    min-width: 240px;
}
</style>
