<template>
  <section class="section-container shop-by-size-section">
    <div class="section-header">
      <h2 class="section-title">Shop by Size</h2>
    </div>
    
    <div class="size-grid">
      <div v-for="size in sizes" :key="size" class="size-chip glass-panel">
        {{ size }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const sizes = ref(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
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

.size-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.size-chip {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  font-weight: bold;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
}

.size-chip:hover {
  background: var(--primary-pastel);
  color: var(--primary-text);
  transform: translateY(-2px);
  box-shadow: var(--glass-shadow);
}
</style>
