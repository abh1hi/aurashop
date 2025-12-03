<template>
  <section class="section-container followed-brands-section">
    <div class="section-header">
      <h2 class="section-title">Brands You Follow</h2>
      <LiquidButton text="Manage" type="ghost" size="sm" />
    </div>
    
    <div class="brands-scroll">
      <div v-for="brand in brands" :key="brand.id" class="brand-card">
        <div class="brand-logo-wrapper">
            <span class="material-icons-round brand-icon">{{ brand.icon }}</span>
        </div>
        <span class="brand-name">{{ brand.name }}</span>
        <span class="new-items-badge" v-if="brand.newItems > 0">{{ brand.newItems }} New</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import LiquidButton from '../liquid-ui-kit/LiquidButton/LiquidButton.vue';

const brands = ref([
  { id: 1, name: 'Luxe', icon: 'diamond', newItems: 5 },
  { id: 2, name: 'Urban', icon: 'apartment', newItems: 0 },
  { id: 3, name: 'Eco', icon: 'eco', newItems: 12 },
  { id: 4, name: 'Sport', icon: 'fitness_center', newItems: 3 },
  { id: 5, name: 'Tech', icon: 'devices', newItems: 0 },
]);
</script>

<style scoped>
.section-container {
  padding: var(--spacing-xl) var(--spacing-lg);
  max-width: 1280px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.section-title {
  font-size: var(--text-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-color);
}

.brands-scroll {
  display: flex;
  gap: var(--spacing-lg);
  overflow-x: auto;
  padding-bottom: var(--spacing-md);
  padding-left: 4px;
  scrollbar-width: none;
}

.brands-scroll::-webkit-scrollbar {
  display: none;
}

.brand-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(var(--glass-blur));
  min-width: 120px;
  position: relative;
}

.brand-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--glass-shadow);
  border-color: var(--brand-primary);
}

.brand-logo-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(139, 69, 19, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-icon {
  font-size: 24px;
  color: var(--brand-primary);
}

.brand-name {
  font-weight: var(--font-weight-bold);
  color: var(--text-color);
  font-size: var(--text-sm);
}

.new-items-badge {
    font-size: 10px;
    background: var(--brand-primary);
    color: white;
    padding: 2px 6px;
    border-radius: var(--radius-full);
    position: absolute;
    top: 8px;
    right: 8px;
}
</style>
