<template>
  <div class="accordion-item" :class="{ open: isOpen }">
    <button class="accordion-header" @click="toggle">
      <span>{{ title }}</span>
      <span class="material-icons-round accordion-icon">expand_more</span>
    </button>
    <div class="accordion-content" ref="contentRef" :style="{ height: isOpen ? contentHeight + 'px' : '0' }">
      <div class="accordion-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, computed, ref, onMounted, nextTick } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  }
});

const { activeItem, toggleItem } = inject('accordion');
const contentRef = ref(null);
const contentHeight = ref(0);

const isOpen = computed(() => activeItem.value === props.id);

const toggle = async () => {
  // Recalculate height before opening to handle dynamic content
  if (!isOpen.value && contentRef.value) {
      // Temporarily set height to auto to get scrollHeight
      // Actually, scrollHeight is available even if height is 0, but we need to ensure the inner content is rendered
      contentHeight.value = contentRef.value.scrollHeight;
  }
  toggleItem(props.id);
};

// Update height on mount and when content might change
onMounted(() => {
    if (contentRef.value) {
        contentHeight.value = contentRef.value.scrollHeight;
    }
});
</script>

<style scoped>
@import './LiquidAccordion.css';
</style>
