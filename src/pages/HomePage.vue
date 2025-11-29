<template>
  <div class="home-page-container">
    <AppHeader />
    <main class="app-content">
      <div class="search-bar">
        <LiquidInput
          placeholder="ruched top"
          icon="search"
          icon-position="left"
          search
        />
        <LiquidButton icon="tune" type="primary" />
      </div>

      <section class="hero-section">
        <div class="hero-content">
          <LiquidButton text="New Collection" type="primary" size="sm" />
          <h1 class="hero-title">Enjoy 30% Discount</h1>
          <LiquidButton text="Shop Now" type="glass" icon="arrow_forward" icon-position="right" />
          <div class="flash-sale">
            <span>Flash sale ends</span>
            <div class="countdown">
              <span class="time-box">03</span>:<span class="time-box">15</span>:<span class="time-box">20</span>
            </div>
          </div>
        </div>
        <img src="https://i.imgur.com/3g202p9.png" alt="Fashion model" class="hero-image" />
      </section>

      <div class="slider-dots">
          <span class="dot active"></span>
          <span class="dot"></span>
          <span class="dot"></span>
      </div>

      <section class="categories-section">
        <div class="section-header">
          <h3 class="section-title">Shop by Categories</h3>
          <a href="#" class="see-all-link">See All</a>
        </div>
        <div class="category-grid">
          <div v-for="category in categories" :key="category.name" class="category-item">
            <div class="category-icon">
              <img :src="category.icon" :alt="category.name">
            </div>
            <span>{{ category.name }}</span>
          </div>
        </div>
      </section>

      <section class="on-sale-section">
        <div class="section-header">
          <h3 class="section-title">On Sale</h3>
          <a href="#" class="see-all-link">See All</a>
        </div>
        <div class="product-grid">
          <ProductCard v-for="product in onSaleProducts" :key="product.id" :product="product" />
        </div>
      </section>
    </main>
    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import LiquidInput from '../components/LiquidInput.vue';
import LiquidButton from '../components/LiquidButton.vue';
import ProductCard from '../components/ProductCard.vue';
import BottomNavBar from '../components/BottomNavBar.vue';

const categories = ref([
  { name: 'Tank Top', icon: 'https://i.imgur.com/KvE63rR.png' },
  { name: 'Shirt', icon: 'https://i.imgur.com/sTjaOUC.png' },
  { name: 'Shoes', icon: 'https://i.imgur.com/f2S1d85.png' },
  { name: 'Dresses', icon: 'https://i.imgur.com/ZJjs3gS.png' },
  { name: 'Home', icon: 'https://i.imgur.com/54z4Ipc.png' },
  { name: 'Bag', icon: 'https://i.imgur.com/Jv3aQ0S.png' },
]);

const onSaleProducts = ref([
  {
    id: 1,
    name: 'Draped Satin Set',
    price: '$99',
    image: 'https://i.imgur.com/o9M4Y3f.png',
    discount: '20%',
  },
  {
    id: 2,
    name: 'Satin Dress Sleeveless',
    price: '$129',
    image: 'https://i.imgur.com/SjA1T2H.png',
    discount: '20%',
  },
]);
</script>

<style scoped>
.home-page-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f8f8f8;
}

.app-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
}

.search-bar {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.hero-section {
  position: relative;
  background-color: var(--primary-pastel);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-sm);
  overflow: hidden;
}

.hero-content {
  z-index: 1;
}

.hero-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-text);
  margin: var(--spacing-md) 0;
  max-width: 180px;
}

.hero-image {
  position: absolute;
  right: -20px;
  bottom: -20px;
  width: 200px;
  height: auto;
}

.flash-sale {
    margin-top: var(--spacing-lg);
    font-size: var(--text-sm);
    color: var(--text-secondary)
}

.countdown {
    display: inline-flex;
    gap: var(--spacing-xs);
    margin-left: var(--spacing-sm);
}

.time-box {
    background: var(--primary-text);
    color: white;
    font-weight: var(--font-weight-bold);
    padding: 2px 6px;
    border-radius: var(--radius-sm);
}

.slider-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: var(--spacing-lg);
}

.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--secondary-pastel);
}

.dot.active {
    background: var(--primary-text);
    width: 16px;
    border-radius: var(--radius-full);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-weight-bold);
}

.see-all-link {
  font-size: var(--text-sm);
  color: var(--primary-text);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: var(--text-xs);
}

.category-icon {
  width: 60px;
  height: 60px;
  background-color: var(--secondary-pastel);
  border-radius: var(--radius-full);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.category-icon img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .hero-title {
    font-size: var(--text-xl);
  }
  .hero-image {
    width: 160px;
  }
}
</style>
