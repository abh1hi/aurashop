<template>
  <div class="stepper" :class="{ 'stepper-vertical': vertical }">
    <div 
      v-for="(step, index) in steps" 
      :key="index" 
      class="step" 
      :class="{ 
        'active': index === modelValue, 
        'completed': index < modelValue 
      }"
      @click="canClickStep(index) && $emit('update:modelValue', index)"
    >
      <div class="step-circle">
        <span v-if="index < modelValue" class="material-icons-round">check</span>
        <span v-else>{{ index + 1 }}</span>
      </div>
      
      <div v-if="vertical" class="step-content">
        <div class="step-label">{{ step.label }}</div>
        <p v-if="step.description" class="text-sm text-secondary mt-xs">{{ step.description }}</p>
      </div>
      <div v-else class="step-label">{{ step.label }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  steps: {
    type: Array,
    required: true,
    // Expected format: [{ label: 'Step 1', description: 'Optional' }, ...]
  },
  vertical: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const canClickStep = (index) => {
  if (!props.clickable) return false;
  // Can always go back, can only go forward if previous step is completed (conceptually)
  // For simplicity, if clickable is true, allow all. Or restrict to visited steps.
  return true; 
};
</script>

<style scoped src="./LiquidStepper.css"></style>
