<template>
  <div class="page-container glass-bg-bleed">
    <AppHeader />
    
    <main class="main-content container">
      <div class="wishlist-wrapper fade-in">
        <header class="page-header-row">
          <div class="title-stack">
            <h1 class="page-title">
              <span class="material-icons-round accent-icon">favorite</span>
              Curated Favorites
            </h1>
            <p class="page-subtitle">Your personal collection of premium finds.</p>
          </div>
          <div class="header-actions">
            <span class="count-pill">{{ wishlistItems.length }} Items</span>
          </div>
        </header>
        
        <div v-if="wishlistItems.length > 0" class="wishlist-masonry">
          <TransitionGroup name="grid-fade">
            <div v-for="item in wishlistItems" :key="item.id" class="grid-item">
              <ProductCard :product="item" />
            </div>
          </TransitionGroup>
        </div>

        <div v-else class="empty-state-card">
          <div class="empty-visual">
            <div class="pulse-heart">
              <span class="material-icons-round">favorite_border</span>
            </div>
          </div>
          <h2 class="empty-title">Your Wishlist is Empty</h2>
          <p class="empty-desc">Create your own collection of luxury and style. Start by exploring our latest arrivals.</p>
          <LiquidButton 
            text="Explore Collections" 
            type="primary" 
            size="lg"
            icon="explore"
            @click="$router.push('/')"
            class="mt-xl"
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
  min-height: 100vh;
  background: var(--bg-color);
  position: relative;
}

.glass-bg-bleed::before {
  content: '';
  position: fixed;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--brand-secondary) 5%, transparent) 0%, transparent 70%);
  z-index: 0;
  pointer-events: none;
}

.main-content {
  position: relative;
  z-index: 1;
  padding-top: calc(var(--header-height) + var(--spacing-xl));
  padding-bottom: 120px;
}

.page-header-row {
  margin-bottom: var(--spacing-2xl);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
}

.page-title {
  font-size: var(--text-3xl);
  font-weight: 900;
  letter-spacing: -0.04em;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--primary-text);
  margin: 0;
}

.accent-icon {
  color: var(--error-color);
  font-size: 32px;
}

.page-subtitle {
  color: var(--secondary-text);
  font-size: var(--text-base);
  margin-top: 6px;
  font-weight: 500;
}

.count-pill {
  background: var(--liquid-glass-base);
  border: 1px solid var(--glass-border);
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: var(--text-sm);
  color: var(--brand-primary);
  backdrop-filter: blur(10px);
}

.wishlist-masonry {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

@media (min-width: 768px) {
  .wishlist-masonry {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1200px) {
  .wishlist-masonry {
    grid-template-columns: repeat(4, 1fr);
  }
}

.grid-item {
  transition: transform 0.3s var(--ease-out);
}

.grid-item:hover {
  transform: translateY(-4px);
}

/* Empty State */
.empty-state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 24px;
  text-align: center;
  background: var(--liquid-glass-base);
  border-radius: var(--radius-3xl);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(20px);
  margin-top: var(--spacing-xl);
}

.empty-visual {
  width: 140px;
  height: 140px;
  background: color-mix(in srgb, var(--error-color) 5%, transparent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
}

.pulse-heart {
  animation: heart-beat 2s ease-in-out infinite;
  color: var(--error-color);
}

.pulse-heart .material-icons-round {
  font-size: 64px;
}

@keyframes heart-beat {
  0% { transform: scale(1); }
  15% { transform: scale(1.15); }
  30% { transform: scale(1); }
  45% { transform: scale(1.15); }
  60% { transform: scale(1); }
}

.empty-title {
  font-size: var(--text-2xl);
  font-weight: 900;
  margin-bottom: 16px;
}

.empty-desc {
  max-width: 360px;
  color: var(--secondary-text);
  line-height: 1.6;
  font-size: var(--text-base);
}

/* Transitions */
.grid-fade-enter-active {
  transition: all 0.5s ease;
}
.grid-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.mt-xl {
  margin-top: 32px;
}

@media (max-width: 640px) {
  .page-header-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .wishlist-masonry {
    gap: var(--spacing-md);
  }
}
</style>
