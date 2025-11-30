<template>
  <div class="sheet-overlay" :class="{ active: modelValue }" @click.self="close">
    <div class="action-sheet">
      <div class="sheet-header" v-if="title || subtitle">
        <div class="sheet-title" v-if="title">{{ title }}</div>
        <div class="sheet-subtitle" v-if="subtitle">{{ subtitle }}</div>
      </div>
      
      <div class="sheet-content">
        <slot></slot>
      </div>

      <button v-if="showCancel" class="sheet-cancel" @click="close">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  showCancel: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'close']);

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};
</script>

<style scoped>
@import './LiquidActionSheet.css';

.sheet-content {
    padding: var(--spacing-md) 0;
}
</style>
