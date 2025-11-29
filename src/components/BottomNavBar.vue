<template>
  <nav class="bottom-nav">
    <button v-for="item in navItems" :key="item.name" :class="['nav-item', { active: item.name === 'Home' }]">
      <span class="material-icons-round">{{ item.icon }}</span>
      <span>{{ item.name }}</span>
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
  { name: 'Me', icon: 'person' },
]);
</script>

<style scoped>
.bottom-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: white;
  border-top: 1px solid var(--secondary-pastel);
  padding: var(--spacing-sm) 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.nav-item.active {
  color: var(--primary-text);
  font-weight: var(--font-weight-bold);
}
</style>
