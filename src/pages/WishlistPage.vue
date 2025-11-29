<template>
  <div class="page-container">
    <AppHeader />
    
    <main class="main-content">
      <div class="wishlist-container">
        <h1 class="page-title">My Wishlist</h1>
        
        <div v-if="wishlistItems.length > 0" class="wishlist-grid">
          <ProductCard 
            v-for="item in wishlistItems" 
            :key="item.id" 
            :product="item" 
          />
        </div>

        <div v-else class="empty-state">
          <span class="material-icons-round empty-icon">favorite_border</span>
          <h3>Your wishlist is empty</h3>
          <p>Save items you love to buy later.</p>
          <LiquidButton 
            text="Explore Products" 
            type="primary" 
            @click="$router.push('/')"
            class="mt-md"
          />
        </div>
      </div>
    </main>

    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import ProductCard from '../components/ProductCard.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import { useWishlist } from '../composables/useWishlist';

const { wishlistItems, loading } = useWishlist();
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: var(--bg-color);
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding-top: var(--spacing-lg);
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
  -webkit-overflow-scrolling: touch;
  display: flex;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
}

.wishlist-container {
  width: 100%;
  max-width: 1200px;
}

.page-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-color);
  margin-bottom: 24px;
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (min-width: 768px) {
  .wishlist-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}

@media (min-width: 1024px) {
  .wishlist-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  color: var(--text-tertiary);
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.mt-md {
  margin-top: 16px;
}
</style>
