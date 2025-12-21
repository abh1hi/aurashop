<template>
  <Teleport to="body">
    <div class="sheet-overlay" :class="{ active: modelValue }" @click.self="close">
      <div class="action-sheet">
        <div class="sheet-handle"></div>
        
        <div class="sheet-header" v-if="title || subtitle">
          <div class="sheet-title" v-if="title">{{ title }}</div>
          <div class="sheet-subtitle" v-if="subtitle">{{ subtitle }}</div>
        </div>

        <div class="sheet-promo" v-if="$slots.promo">
          <slot name="promo"></slot>
        </div>
        
        <div class="sheet-content" :class="{ 'grid-layout': grid }">
          <slot></slot>
        </div>

        <div class="sheet-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>

        <button v-if="showCancel && !grid" class="sheet-cancel" @click="close">Cancel</button>
      </div>
    </div>
  </Teleport>
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
  },
  grid: {
    type: Boolean,
    default: false
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
</style>
