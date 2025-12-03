<template>
  <section class="section-container back-in-stock-section">
    <div class="section-header">
      <h2 class="section-title">Back in Stock</h2>
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
    id: 301,
    name: 'Classic Trench',
    brand: 'Burberry',
    price: 890.00,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 320,
    colors: ['#F5F5DC', '#000000'],
    sizes: ['S', 'M', 'L', 'XL'],
    isBestSeller: true
  },
  {
    id: 302,
    name: 'Leather Boots',
    brand: 'Dr. Martens',
    price: 150.00,
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 150,
    colors: ['#000000', '#8B0000'],
    sizes: ['7', '8', '9', '10']
  },
  {
    id: 303,
    name: 'Wool Scarf',
    brand: 'Acne',
    price: 120.00,
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 90,
    colors: ['#808080', '#D3D3D3']
  },
  {
    id: 304,
    name: 'Canvas Tote',
    brand: 'Baggu',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewCount: 200,
    colors: ['#F0E68C', '#000000'],
    isNew: true
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
