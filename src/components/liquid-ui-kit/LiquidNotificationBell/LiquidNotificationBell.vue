<template>
  <div class="notification-bell-container" ref="bellRef">
    <button 
      class="bell-btn" 
      @click="togglePanel"
      :class="{ 'active': isOpen }"
    >
      <span class="material-icons-round">notifications</span>
      <span v-if="unreadCount > 0" class="badge">
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <Transition name="fade-slide">
      <LiquidNotificationPanel 
        v-if="isOpen" 
        @close="isOpen = false"
        class="panel-position"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useNotifications } from '../../../composables/useNotifications';
import LiquidNotificationPanel from './LiquidNotificationPanel.vue';

const { unreadCount } = useNotifications();
const isOpen = ref(false);
const bellRef = ref<HTMLElement | null>(null);

const togglePanel = () => {
  isOpen.value = !isOpen.value;
};

// Click outside to close
const handleClickOutside = (event: MouseEvent) => {
  if (bellRef.value && !bellRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.notification-bell-container {
  position: relative;
  display: inline-block;
}

.bell-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.2s ease;
  position: relative;
}

.bell-btn:hover, .bell-btn.active {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.material-icons-round {
  font-size: 20px;
}

.badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #ff4757;
  color: white;
  font-size: 10px;
  font-weight: bold;
  height: 16px;
  min-width: 16px;
  padding: 0 4px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.panel-position {
  position: absolute;
  top: 50px;
  right: -10px; /* Slight offset */
  z-index: 1000;
  width: 360px;
  max-width: 90vw;
}

@media (max-width: 480px) {
  .panel-position {
    position: fixed;
    top: 60px;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    width: 95vw;
    max-width: 400px;
  }
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
