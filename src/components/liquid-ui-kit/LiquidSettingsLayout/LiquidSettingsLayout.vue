<template>
  <div class="settings-container">
    <div class="settings-sidebar">
      <div 
        v-for="(item, index) in menuItems" 
        :key="index"
        class="settings-nav-item"
        :class="{ 'active': modelValue === item.value }"
        @click="$emit('update:modelValue', item.value)"
      >
        <span class="material-icons-round">{{ item.icon }}</span>
        {{ item.label }}
      </div>
    </div>

    <div class="settings-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  modelValue: {
    type: String,
    required: true
  },
  menuItems: {
    type: Array,
    required: true,
    // [{ label: 'Account', value: 'account', icon: 'person' }, ...]
  }
});

defineEmits(['update:modelValue']);
</script>

<style scoped src="./LiquidSettingsLayout.css"></style>
