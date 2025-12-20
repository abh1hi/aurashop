<style scoped>
.bottom-nav-container {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: auto;
  min-width: 320px;
  max-width: 90vw;
  padding: 0 12px;
}

.bottom-nav-dock {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border: 1px solid var(--glass-border);
  padding: 8px;
  border-radius: var(--radius-full);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  transition: all 0.4s var(--ease-out);
}

.bottom-nav-dock:hover {
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.18);
  border-color: color-mix(in srgb, var(--brand-primary) 20%, var(--glass-border));
}

.nav-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 10px 16px;
  border-radius: var(--radius-full);
  transition: all 0.3s var(--ease-out);
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.nav-icon {
  font-size: 22px;
  transition: transform 0.3s var(--ease-elastic);
}

.nav-label {
  font-size: var(--text-xs);
  font-weight: 700;
  max-width: 0;
  opacity: 0;
  transition: all 0.3s var(--ease-out);
  white-space: nowrap;
}

.nav-item:hover {
  background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
  color: var(--brand-primary);
}

.nav-item.active {
  background: var(--brand-primary);
  color: white;
  box-shadow: 0 8px 16px rgba(0, 113, 227, 0.25);
}

.nav-item.active .nav-label {
  max-width: 100px;
  opacity: 1;
}

.nav-item.active .nav-icon {
  transform: scale(1.1);
}

/* Mobile Adjustments */
@media (max-width: 640px) {
  .bottom-nav-container {
    bottom: 16px;
    width: 100%;
    padding: 0 16px;
  }
  
  .bottom-nav-dock {
    justify-content: space-around;
    padding: 6px;
  }
  
  .nav-item {
    padding: 10px;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 60px;
  }
  
  .nav-label {
    max-width: none;
    opacity: 1;
    font-size: 8px;
  }
  
  .nav-item.active .nav-label {
    opacity: 1;
  }

  .nav-item.active {
     background: transparent;
     color: var(--brand-primary);
     box-shadow: none;
  }

  .nav-item.active::after {
    content: '';
    position: absolute;
    bottom: 4px;
    width: 4px;
    height: 4px;
    background: var(--brand-primary);
    border-radius: 50%;
  }
}
</style>

<script setup>
import { computed } from 'vue';
import { useAuth } from '../composables/useAuth';

const { user } = useAuth();

const navItems = computed(() => [
  { name: 'Home', icon: 'home', path: '/' },
  { name: 'Explore', icon: 'explore', path: '/map' },
  { name: 'Wishlist', icon: 'favorite_border', path: '/wishlist' },
  { name: 'Bag', icon: 'shopping_bag', path: '/cart' },
  { name: 'Me', icon: 'person_outline', path: user.value ? '/profile' : '/login' },
]);
</script>

<template>
  <div class="bottom-nav-container">
    <nav class="bottom-nav-dock">
      <router-link 
        v-for="item in navItems" 
        :key="item.name" 
        :to="item.path"
        class="nav-item"
        active-class="active"
      >
        <span class="material-icons-round nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.name }}</span>
      </router-link>
    </nav>
  </div>
</template>
