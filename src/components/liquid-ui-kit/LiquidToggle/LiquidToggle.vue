<template>
  <label :class="toggleClasses">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="handleChange"
    />
    <div class="switch-track">
      <div class="switch-thumb">
        <span v-if="icon" class="material-icons-round icon">{{ icon }}</span>
      </div>
    </div>
    <span v-if="label" class="label-text">{{ label }}</span>
  </label>
</template>

<script setup>
import { liquidToggleProps, useLiquidToggle } from './LiquidToggle';

const props = defineProps(liquidToggleProps);
const emit = defineEmits(['update:modelValue']);
const { toggleClasses, handleChange } = useLiquidToggle(props, emit);
</script>

<style scoped>
@import './LiquidToggle.css';
</style>
