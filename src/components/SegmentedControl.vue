<template>
  <div :class="controlClasses">
    <button
      v-for="option in options"
      :key="option.value"
      :class="['segment-btn', { active: modelValue === option.value }]"
      @click="selectOption(option.value)"
    >
      <span v-if="option.icon" class="material-icons-round" :style="{ fontSize: '18px' }">{{ option.icon }}</span>
      <span>{{ option.label }}</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    required: true,
  },
  size: String, // 'sm', 'lg'
  fullWidth: Boolean,
  vertical: Boolean,
});

const emit = defineEmits(['update:modelValue']);

const controlClasses = computed(() => [
  'segmented-control',
  {
    'full-width': props.fullWidth,
    'vertical': props.vertical,
    [props.size]: !!props.size,
  },
]);

const selectOption = (value) => {
  emit('update:modelValue', value);
};

</script>

<style scoped>
/* Segmented Control Container */
.segmented-control {
    display: inline-flex;
    background: rgba(0, 0, 0, 0.05);
    padding: 4px;
    border-radius: var(--radius-md);
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0.05);
}

/* Segment Button */
.segment-btn {
    position: relative;
    border: none;
    background: transparent;
    padding: 6px 16px;
    font-size: var(--text-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: var(--radius-sm);
    z-index: 1;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.segment-btn:hover {
    color: var(--text-color);
}

.segment-btn.active {
    background: var(--primary-pastel);
    color: var(--primary-text);
    box-shadow: var(--glass-shadow);
}

.segmented-control.lg .segment-btn {
    padding: 10px 24px;
    font-size: var(--text-base);
}

/* Full Width */
.segmented-control.full-width {
    display: flex;
    width: 100%;
}

.segmented-control.full-width .segment-btn {
    flex: 1;
    justify-content: center;
}

/* Vertical */
.segmented-control.vertical {
    flex-direction: column;
    width: auto;
    display: inline-flex;
}
</style>
