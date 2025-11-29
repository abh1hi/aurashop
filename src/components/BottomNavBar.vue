<template>
  <nav class="bottom-nav">
    <button v-for="item in navItems" :key="item.name" :class="['nav-item', { active: item.name === 'Home' }]">
      <span class="material-icons-round nav-icon">{{ item.icon }}</span>
      <span class="nav-label">{{ item.name }}</span>
    </button>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

const navItems = ref([
  { name: 'Home', icon: 'home' },
  { name: 'Explore', icon: 'explore' },
  { name: 'Wishlist', icon: 'favorite_border' },
  { name: 'Bag', icon: 'shopping_bag' },
  { name: 'Me', icon: 'person_outline' },
]);
</script>

<style scoped>
.bottom-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border-top: 1px solid var(--glass-border);
  padding: 12px 0;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  box-shadow: var(--glass-shadow);
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0 12px;
  transition: all 0.3s var(--ease-out);
}

.nav-icon {
  font-size: 24px;
  transition: transform 0.3s var(--ease-elastic);
}

.nav-label {
  font-size: 10px;
  font-weight: var(--font-weight-medium);
}

.nav-item.active {
  color: var(--brand-primary);
}

.nav-item.active .nav-icon {
  transform: translateY(-2px);
  color: var(--brand-primary);
}

.nav-item.active .nav-label {
  font-weight: var(--font-weight-bold);
}

@media (min-width: 768px) {
  .bottom-nav {
    display: none;
  }
}
</style>
