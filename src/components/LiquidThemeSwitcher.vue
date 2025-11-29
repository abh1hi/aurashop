<template>
  <div class="theme-switcher" ref="switcherRef">
    <LiquidButton
      :text="currentThemeName"
      icon="palette"
      icon-position="left"
      type="glass"
      size="sm"
      @click="toggleDropdown"
      class="switcher-trigger"
    />
    
    <transition name="fade">
      <div v-if="isOpen" class="theme-dropdown">
        <div class="dropdown-header">Select Theme</div>
        <div class="theme-list">
          <button
            v-for="theme in themes"
            :key="theme.value"
            class="theme-option"
            :class="{ active: currentTheme === theme.value }"
            @click="setTheme(theme.value)"
          >
            <span class="material-icons-round theme-icon" v-if="currentTheme === theme.value">check</span>
            <span class="theme-name">{{ theme.name }}</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import LiquidButton from './liquid-ui-kit/LiquidButton/LiquidButton.vue';

const themes = [
  { name: 'Default', value: 'light' },
  { name: 'Dark', value: 'dark' },
  { name: 'Oceanic', value: 'oceanic' },
  { name: 'Sunset', value: 'sunset' },
  { name: 'Forest', value: 'forest' },
  { name: 'Crystal', value: 'crystal' },
  { name: 'Frost', value: 'frost' },
  { name: 'Aurora', value: 'aurora' },
  { name: 'Obsidian', value: 'obsidian' },
  { name: 'Prism', value: 'prism' },
];

const currentTheme = ref('light');
const isOpen = ref(false);
const switcherRef = ref(null);

const currentThemeName = computed(() => {
  const theme = themes.find(t => t.value === currentTheme.value);
  return theme ? theme.name : 'Theme';
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const setTheme = (theme) => {
  currentTheme.value = theme;
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('user-theme', theme);
  isOpen.value = false;
};

const handleClickOutside = (event) => {
  if (switcherRef.value && !switcherRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem('user-theme') || 'light';
  setTheme(savedTheme);
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.theme-switcher {
  position: relative;
  display: inline-block;
}

.theme-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--spacing-sm);
  width: 200px;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--glass-shadow);
  z-index: var(--z-dropdown);
  overflow: hidden;
  padding: var(--spacing-xs);
  display: flex;
  flex-direction: column;
}

.dropdown-header {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--text-xs);
  font-weight: var(--font-weight-bold);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  margin-bottom: var(--spacing-xs);
}

.theme-list {
  display: flex;
  flex-direction: column;
  max-height: 300px;
  overflow-y: auto;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 10px var(--spacing-md);
  border: none;
  background: transparent;
  color: var(--text-color);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  text-align: left;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}

.theme-option:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--brand-primary);
}

.theme-option.active {
  background: var(--primary-pastel);
  color: var(--primary-text);
}

.theme-icon {
  font-size: 16px;
  margin-left: auto;
}

.theme-name {
  flex-grow: 1;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
