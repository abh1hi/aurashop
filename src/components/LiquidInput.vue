<template>
  <div :class="inputWrapperClasses">
    <span v-if="icon && iconPosition === 'left'" class="material-icons-round">{{ icon }}</span>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span v-if="icon && iconPosition === 'right'" class="material-icons-round">{{ icon }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: String,
  placeholder: String,
  icon: String,
  iconPosition: {
    type: String,
    default: 'left',
  },
  type: {
    type: String,
    default: 'text',
  },
  search: Boolean,
});

const inputWrapperClasses = computed(() => [
  'liquid-input-wrapper',
  {
    'liquid-input-wrapper--search': props.search,
  },
]);

</script>

<style scoped>
.liquid-input-wrapper {
  display: flex;
  align-items: center;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-full);
  padding: var(--spacing-sm) var(--spacing-md);
  transition: all var(--duration-normal) var(--ease-out);
  width: 100%;
}

.liquid-input-wrapper:focus-within {
  background: white;
  border-color: var(--primary-text);
}

.liquid-input-wrapper .material-icons-round {
  color: var(--text-tertiary);
  margin: 0 var(--spacing-xs);
}

.liquid-input-wrapper input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-family: var(--font-family);
  color: var(--text-color);
  width: 100%;
}

.liquid-input-wrapper input::placeholder {
  color: var(--text-tertiary);
}

.liquid-input-wrapper--search {
  border-radius: var(--radius-full);
}

</style>
