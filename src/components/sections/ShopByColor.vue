<template>
  <section class="section-container shop-by-color-section">
    <div class="section-header">
      <h2 class="section-title">Shop by Color</h2>
    </div>
    
    <div class="color-grid">
      <div v-for="color in colors" :key="color.name" class="color-item">
        <div class="color-swatch" :style="{ backgroundColor: color.hex }"></div>
        <span class="color-name">{{ color.name }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const colors = ref([
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#F44336' },
  { name: 'Blue', hex: '#2196F3' },
  { name: 'Green', hex: '#4CAF50' },
  { name: 'Yellow', hex: '#FFEB3B' },
  { name: 'Pink', hex: '#E91E63' },
  { name: 'Purple', hex: '#9C27B0' },
  { name: 'Orange', hex: '#FF9800' },
  { name: 'Brown', hex: '#795548' },
]);
</script>

<style scoped>
.section-container {
  padding: var(--spacing-xl) var(--spacing-lg);
  max-width: 1280px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.section-title {
  font-size: var(--text-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-color);
}

.color-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
}

.color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  transition: transform 0.2s;
}

.color-item:hover {
  transform: scale(1.1);
}

.color-swatch {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border: 2px solid var(--glass-border);
}

.color-name {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: 500;
}
</style>
