<template>
  <section class="section-container brands-section">
    <div class="section-header">
      <h2 class="section-title">Shop by Brand</h2>
    </div>
    
    <div class="brands-grid">
      <div v-for="brand in brands" :key="brand.id" class="brand-card">
        <div class="brand-logo-wrapper">
            <span class="material-icons-round brand-icon">{{ brand.icon }}</span>
        </div>
        <span class="brand-name">{{ brand.name }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const brands = ref([
  { id: 1, name: 'Luxe', icon: 'diamond' },
  { id: 2, name: 'Urban', icon: 'apartment' },
  { id: 3, name: 'Eco', icon: 'eco' },
  { id: 4, name: 'Sport', icon: 'fitness_center' },
  { id: 5, name: 'Tech', icon: 'devices' },
  { id: 6, name: 'Home', icon: 'chair' }
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
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-color);
}

.brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--spacing-lg);
}

.brand-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(var(--glass-blur));
}

.brand-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--glass-shadow);
  border-color: var(--brand-primary);
}

.brand-logo-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(139, 69, 19, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-icon {
  font-size: 32px;
  color: var(--brand-primary);
}

.brand-name {
  font-weight: var(--font-weight-bold);
  color: var(--text-color);
}
</style>
