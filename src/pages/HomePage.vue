
<template>
  <div class="home-page-container">
   <AppHeader />
    <main class="app-content container">
      <!-- Mobile Search (Hide on Desktop) -->
      <div class="search-bar mobile-only">
        <LiquidInput 
            placeholder="Search products..." 
            icon="search" 
            icon-position="left" 
            search 
            class="flex-1"
        />
        <LiquidButton icon="tune" type="primary" class="filter-btn-override" />
      </div>

      <!-- Hero Section (Split Grid on Desktop) -->
      <section class="hero-wrapper">
        <!-- Main Hero Slider -->
        <div class="hero-main">
            <div class="hero-content">
              <LiquidButton text="New Collection" type="primary" size="sm" class="mb-sm" />
              <h1 class="hero-title">iPhone 16 Pro Max</h1>
              <p class="hero-subtitle">Titanium. So strong. So light. So Pro.</p>
              <LiquidButton text="Shop Now" icon="north_east" icon-position="right" type="glass" size="md" />
            </div>
            <img src="https://i.imgur.com/3g202p9.png" alt="Hero Product" class="hero-image" />
        </div>
        
        <!-- Side Banner (Desktop Only) -->
        <div class="hero-side desktop-only">
            <div class="side-banner-content">
                <span class="sale-tag">SALE</span>
                <h3 class="side-title">Up to 50% Off</h3>
                <p class="side-desc">On selected running shoes</p>
                <LiquidButton text="View Offers" type="ghost" size="sm" />
            </div>
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80" alt="Sale" class="side-image" />
        </div>
      </section>

      <!-- Categories (Circular) -->
      <section class="categories-section">
        <div class="section-header">
          <h3 class="section-title">Explore Popular Categories</h3>
          <a href="#" class="see-all-link">View All</a>
        </div>
        <div class="category-scroll">
          <div v-for="category in categories" :key="category.name" class="category-circle-item">
            <div class="category-circle">
              <img :src="category.image" :alt="category.name">
            </div>
            <span class="category-label">{{ category.name }}</span>
          </div>
        </div>
      </section>

      <!-- Micro Sections: Countdown & Coupons -->
      <div class="micro-section-row">
          <SeasonCountdown />
          <CouponCarousel />
      </div>

      <!-- Flash Sale (Today's Best Deals) -->
      <FlashSaleSection />

      <!-- 3-Column Banner Grid -->
      <section class="banner-grid-section">
        <div class="banner-grid">
            <div class="promo-card bg-vegetable">
                <div class="promo-content">
                    <span class="promo-tag">Fresh & Healthy</span>
                    <h3>Vegetables</h3>
                    <span class="promo-discount">30% OFF</span>
                    <LiquidButton text="Shop Now" type="primary" size="sm" />
                </div>
                <img src="https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=300&q=80" class="promo-img" />
            </div>
            <div class="promo-card bg-tech">
                <div class="promo-content">
                    <span class="promo-tag">Samsung</span>
                    <h3>Galaxy S24 FE</h3>
                    <p>Galaxy AI is here</p>
                    <LiquidButton text="Pre-order" type="primary" size="sm" />
                </div>
                <img src="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=300&q=80" class="promo-img" />
            </div>
            <div class="promo-card bg-red">
                <div class="promo-content text-white">
                    <h3>Special Offer</h3>
                    <p>Gift sets for everyone</p>
                    <LiquidButton text="Explore" type="glass" size="sm" />
                </div>
                <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80" class="promo-img" />
            </div>
        </div>
      </section>

      <!-- Trending & Price Drops -->
      <TrendingSection />
      <PriceDropList />

      <!-- Aura AI Section -->
      <section class="ai-section glass-panel">
        <div class="ai-content">
            <div class="ai-badge">
                <span class="material-icons-round">auto_awesome</span>
                Aura AI
            </div>
            <h2>AI-Powered Shopping Experience</h2>
            <div class="ai-search-bar">
                <input type="text" placeholder="Ask Aura: 'Show me outfit ideas for a summer wedding'" />
                <button class="ai-btn"><span class="material-icons-round">send</span></button>
            </div>
            <div class="ai-tags">
                <span>#SummerOutfit</span>
                <span>#TechGifts</span>
                <span>#HomeDecor</span>
            </div>
        </div>
        <div class="ai-visuals mobile-hidden">
            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80" class="ai-img-1" />
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80" class="ai-img-2" />
        </div>
      </section>

      <!-- Rest of Sections -->
      <BackInStockList />
      <CampaignBanner />
      <FollowedBrands />
      <LifestyleCollections />
      <TrendingAccessories />
      <ShopByColor />
      <ShopBySize />
      <ShopByRating />
      <BrandsSection />
      <FooterSection />

    </main>
    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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
import SeasonCountdown from '../components/sections/SeasonCountdown.vue';
import CouponCarousel from '../components/sections/CouponCarousel.vue';
import PriceDropList from '../components/sections/PriceDropList.vue';
import BackInStockList from '../components/sections/BackInStockList.vue';
import FollowedBrands from '../components/sections/FollowedBrands.vue';
import TrendingAccessories from '../components/sections/TrendingAccessories.vue';
import ShopByColor from '../components/sections/ShopByColor.vue';
import ShopBySize from '../components/sections/ShopBySize.vue';
import ShopByRating from '../components/sections/ShopByRating.vue';
import { cacheManager } from '../utils/cacheManager';

const categories = ref([]);
const onSaleProducts = ref([]);

const MOCK_CATEGORIES = [
  { id: 1, name: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80' },
  { id: 2, name: 'Tops', image: 'https://images.unsplash.com/photo-1551163943-3f6a29e39426?auto=format&fit=crop&w=300&q=80' },
  { id: 3, name: 'Pants', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=300&q=80' },
  { id: 4, name: 'Jackets', image: 'https://images.unsplash.com/photo-1551488852-0801751acbe3?auto=format&fit=crop&w=300&q=80' },
  { id: 5, name: 'Shoes', image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=300&q=80' },
  { id: 6, name: 'Bags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80' }
];

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Ruched Top',
    brand: 'Zara',
    price: 25.99,
    originalPrice: 45.99,
    image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    reviewCount: 120,
    isOnSale: true,
    colors: ['#D2B48C', '#000000', '#FFFFFF'],
    sizes: ['S', 'M', 'L'],
    isBestSeller: true
  },
  {
    id: 2,
    name: 'Loose Knit Sweater',
    brand: 'H&M',
    price: 39.99,
    originalPrice: 59.99,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    rating: 4.2,
    reviewCount: 85,
    isOnSale: true,
    colors: ['#F5F5DC', '#808080'],
    sizes: ['M', 'L', 'XL'],
    isNew: true
  },
  {
    id: 3,
    name: 'Cargo Pants',
    brand: 'Pull&Bear',
    price: 49.99,
    originalPrice: 69.99,
    image: 'https://images.unsplash.com/photo-1551852335-8069436d262e?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 200,
    isOnSale: true,
    colors: ['#556B2F', '#000000'],
    sizes: ['30', '32', '34', '36'],
    isBestSeller: true
  },
  {
    id: 4,
    name: 'Denim Jacket',
    brand: 'Levi\'s',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 310,
    isOnSale: true,
    colors: ['#1E90FF', '#000080'],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true
  }
];

const fetchHomeData = async () => {
    // Try Cache First
    const cachedCategories = cacheManager.get('home_categories');
    const cachedProducts = cacheManager.get('home_products');

    if (cachedCategories) {
        categories.value = cachedCategories;
    } else {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        categories.value = MOCK_CATEGORIES;
        cacheManager.set('home_categories', MOCK_CATEGORIES, 600000); // 10 min TTL
    }

    if (cachedProducts) {
        onSaleProducts.value = cachedProducts;
    } else {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        onSaleProducts.value = MOCK_PRODUCTS;
        cacheManager.set('home_products', MOCK_PRODUCTS, 300000); // 5 min TTL
    }
};

onMounted(() => {
    fetchHomeData();
});
</script>

<style scoped>
@import './HomePage.css';
</style>
