
<template>
  <div class="home-page-container">
   <AppHeader />
    <main class="app-content container">
      <!-- Mobile Search (Hide on Desktop) -->
      <div class="search-bar mobile-only">
        <LiquidInput 
            placeholder="ruched top" 
            icon="search" 
            icon-position="left" 
            search 
            class="flex-1"
        />
        <LiquidButton icon="tune" type="primary" class="filter-btn-override" />
      </div>

      <section class="hero-section">
        <div class="hero-content">
          <LiquidButton text="New Collection" type="primary" size="sm" class="mb-sm" />
          <h1 class="hero-title">Enjoy 30% Discount</h1>
          <LiquidButton text="Shop Now" icon="north_east" icon-position="right" type="glass" size="md" />
          <div class="flash-sale">
            <span class="flash-text">Flash sale ends</span>
            <div class="countdown">
              <span class="time-box">03</span><span class="time-sep">:</span>
              <span class="time-box">15</span><span class="time-sep">:</span>
              <span class="time-box">20</span>
            </div>
          </div>
        </div>
        <img src="https://i.imgur.com/3g202p9.png" alt="Fashion model" class="hero-image" />
      </section>

      <div class="slider-dots mobile-only">
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
            <span class="category-name">{{ category.name }}</span>
          </div>
        </div>
      </section>

    <!-- On Sale Section -->
    <section class="on-sale-section">
      <div class="section-header">
        <h2 class="section-title">On Sale</h2>
        <LiquidButton text="View All" type="ghost" size="sm" icon="arrow_forward" />
      </div>
      <div class="product-grid">
        <ProductCard 
          v-for="product in onSaleProducts" 
          :key="product.id" 
          :product="product" 
        />
      </div>
    </section>

    <!-- New Sections -->
    <FlashSaleSection />
    <TrendingSection />
    <CampaignBanner />
    <LifestyleCollections />
    <BrandsSection />
    <FooterSection />

    <!-- Bottom Navigation (Mobile) -->
    </main>
    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import LiquidInput from '../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import ProductCard from '../components/ProductCard.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import TrendingSection from '../components/sections/TrendingSection.vue';
import FlashSaleSection from '../components/sections/FlashSaleSection.vue';
import BrandsSection from '../components/sections/BrandsSection.vue';
import FooterSection from '../components/sections/FooterSection.vue';
import CampaignBanner from '../components/sections/CampaignBanner.vue';
import LifestyleCollections from '../components/sections/LifestyleCollections.vue';

const categories = ref([
  { id: 1, name: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80' },
  { id: 2, name: 'Tops', image: 'https://images.unsplash.com/photo-1551163943-3f6a29e39426?auto=format&fit=crop&w=300&q=80' },
  { id: 3, name: 'Pants', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=300&q=80' },
  { id: 4, name: 'Jackets', image: 'https://images.unsplash.com/photo-1551488852-0801751acbe3?auto=format&fit=crop&w=300&q=80' },
  { id: 5, name: 'Shoes', image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=300&q=80' },
  { id: 6, name: 'Bags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80' }
]);

const onSaleProducts = ref([
  {
    id: 1,
    name: 'Ruched Top',
    brand: 'Zara',
    price: 25.99,
    originalPrice: 45.99,
    image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    reviews: 120,
    isOnSale: true
  },
  {
    id: 2,
    name: 'Loose Knit Sweater',
    brand: 'H&M',
    price: 39.99,
    originalPrice: 59.99,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    rating: 4.2,
    reviews: 85,
    isOnSale: true
  },
  {
    id: 3,
    name: 'Cargo Pants',
    brand: 'Pull&Bear',
    price: 49.99,
    originalPrice: 69.99,
    image: 'https://images.unsplash.com/photo-1551852335-8069436d262e?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviews: 200,
    isOnSale: true
  },
  {
    id: 4,
    name: 'Denim Jacket',
    brand: 'Levi\'s',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviews: 310,
    isOnSale: true
  }
]);
</script>

<style scoped>
@import './HomePage.css';
</style>
