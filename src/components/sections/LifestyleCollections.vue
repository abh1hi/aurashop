<template>
  <section class="section-container lifestyle-section">
    <div class="section-header">
      <h2 class="section-title">Curated Collections</h2>
      <p class="section-subtitle">Handpicked sets for every mood and occasion.</p>
    </div>
    
    <div class="lifestyle-grid">
      <div v-for="item in collections" :key="item.id" class="lifestyle-card">
        <img :src="item.image" :alt="item.title" class="lifestyle-image" />
        <div class="lifestyle-overlay">
            <div class="lifestyle-content">
                <h3 class="lifestyle-title">{{ item.title }}</h3>
                <span class="lifestyle-count">{{ item.itemCount }} Items</span>
                <LiquidButton text="Explore" type="glass" size="sm" class="mt-sm" />
            </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import LiquidButton from '../liquid-ui-kit/LiquidButton/LiquidButton.vue';

const collections = ref([
  { 
    id: 1, 
    title: 'Work from Home', 
    itemCount: 42, 
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 2, 
    title: 'Party Ready', 
    itemCount: 28, 
    image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 3, 
    title: 'Budget Picks', 
    itemCount: 65, 
    image: 'https://images.unsplash.com/photo-1550614000-4b9519e02a29?auto=format&fit=crop&w=600&q=80' 
  },
  { 
    id: 4, 
    title: 'Weekend Vibes', 
    itemCount: 34, 
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80' 
  }
]);
</script>

<style scoped>
.section-container {
  padding: var(--spacing-xl) var(--spacing-lg);
  max-width: 1280px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.section-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-color);
  margin-bottom: var(--spacing-xs);
}

.section-subtitle {
    color: var(--text-secondary);
    font-size: var(--text-base);
}

.lifestyle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.lifestyle-card {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  height: 350px;
  cursor: pointer;
  transition: transform 0.3s ease;
  box-shadow: var(--liquid-shadow-md);
}

.lifestyle-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--liquid-shadow-lg);
}

.lifestyle-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.lifestyle-card:hover .lifestyle-image {
    transform: scale(1.05);
}

.lifestyle-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--spacing-lg);
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 50%;
}

.lifestyle-content {
    transform: translateY(10px);
    transition: transform 0.3s ease;
}

.lifestyle-card:hover .lifestyle-content {
    transform: translateY(0);
}

.lifestyle-title {
  color: white;
  font-size: var(--text-xl);
  font-weight: bold;
  margin-bottom: 4px;
}

.lifestyle-count {
  color: rgba(255, 255, 255, 0.8);
  font-size: var(--text-sm);
  display: block;
  margin-bottom: var(--spacing-sm);
}

@media (max-width: 768px) {
  .lifestyle-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .lifestyle-card {
      height: 250px;
  }
}
</style>
