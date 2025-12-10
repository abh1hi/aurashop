<template>
  <div :class="containerClasses">
    <button 
      v-for="option in options" 
      :key="option.value"
      class="segment-btn"
      :class="{ active: modelValue === option.value }"
      @click="selectOption(option.value)"
    >
      <span v-if="option.icon" class="material-icons-round" style="font-size: 18px;">{{ option.icon }}</span>
      {{ option.label }}
    </button>
  </div>
</template>

<script setup>
import { liquidSegmentedControlProps, useLiquidSegmentedControl } from './LiquidSegmentedControl';

const props = defineProps(liquidSegmentedControlProps);
const emit = defineEmits(['update:modelValue']);
const { containerClasses, selectOption } = useLiquidSegmentedControl(props, emit);
</script>

<style scoped>
@import './LiquidSegmentedControl.css';
</style>
