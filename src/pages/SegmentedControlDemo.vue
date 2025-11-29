<template>
  <div class="demo-page">
    <div class="demo-section">
      <div class="demo-title">Basic Usage</div>
      <SegmentedControl :options="basicOptions" v-model="selectedBasic" />
    </div>

    <div class="demo-section">
      <div class="demo-title">With Icons</div>
      <SegmentedControl :options="iconOptions" v-model="selectedIcon" />
    </div>

    <div class="demo-section">
      <div class="demo-title">Sizes</div>
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start;">
        <SegmentedControl :options="sizeOptions" v-model="selectedSize" size="sm" />
        <SegmentedControl :options="sizeOptions" v-model="selectedSize" size="lg" />
      </div>
    </div>

    <div class="demo-section">
      <div class="demo-title">Full Width</div>
      <SegmentedControl :options="fullWidthOptions" v-model="selectedFullWidth" full-width />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SegmentedControl from '../components/SegmentedControl.vue';

const basicOptions = ref([
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
]);
const selectedBasic = ref('daily');

const iconOptions = ref([
  { label: 'List', value: 'list', icon: 'list' },
  { label: 'Grid', value: 'grid', icon: 'grid_view' },
  { label: 'Map', value: 'map', icon: 'map' },
]);
const selectedIcon = ref('list');

const sizeOptions = ref([
    { label: 'Small', value: 'small' },
    { label: 'Size', value: 'size' },
]);
const selectedSize = ref('small');

const fullWidthOptions = ref([
  { label: 'All', value: 'all' },
  { label: 'Missed', value: 'missed' },
  { label: 'Archived', value: 'archived' },
]);
const selectedFullWidth = ref('all');
</script>

<style scoped>
.demo-page {
  padding: var(--spacing-xl);
}
.demo-section {
    margin-bottom: var(--spacing-xl);
}

.demo-title {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    margin-bottom: var(--spacing-md);
}
</style>
