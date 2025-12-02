<template>
  <div class="tabs-container">
    <div class="tabs-header" ref="headerRef">
      <div 
        v-for="(tab, index) in tabs" 
        :key="index"
        class="tab-item"
        :class="{ 'active': modelValue === tab.value }"
        @click="selectTab(tab.value, index)"
        ref="tabRefs"
      >
        {{ tab.label }}
      </div>
      <div class="tab-indicator" :style="indicatorStyle"></div>
    </div>

    <div class="tabs-content">
      <slot :name="modelValue"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, watch, nextTick } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  tabs: {
    type: Array,
    required: true,
    // [{ label: 'Overview', value: 'overview' }, ...]
  }
});

const emit = defineEmits(['update:modelValue']);

const headerRef = ref(null);
const tabRefs = ref([]);
const indicatorStyle = ref({ width: '0px', transform: 'translateX(0px)' });

const updateIndicator = () => {
  if (!tabRefs.value || tabRefs.value.length === 0) return;
  
  const activeIndex = props.tabs.findIndex(t => t.value === props.modelValue);
  if (activeIndex === -1) return;

  const activeTab = tabRefs.value[activeIndex];
  if (activeTab) {
    indicatorStyle.value = {
      width: `${activeTab.offsetWidth}px`,
      transform: `translateX(${activeTab.offsetLeft}px)`
    };
  }
};

const selectTab = (value, index) => {
  emit('update:modelValue', value);
};

watch(() => props.modelValue, () => {
  nextTick(updateIndicator);
});

onMounted(() => {
  nextTick(updateIndicator);
  // Add resize listener if needed
});
</script>

<style scoped src="./LiquidTabs.css"></style>
