<template>
  <LiquidCard class="product-card" hoverable>
    <div class="card-image-wrapper">
      <img :src="product.image" :alt="product.name" />
      <div v-if="product.discount" class="discount-badge">{{ product.discount }}</div>
      <button class="wishlist-btn">
        <span class="material-icons-round">favorite_border</span>
      </button>
    </div>
    <div class="card-content">
      <h4 class="product-name">{{ product.name }}</h4>
      <div class="card-footer">
        <span class="product-price">{{ product.price }}</span>
        <LiquidButton icon="add" size="sm" type="primary" class="add-btn-override" />
      </div>
    </div>
  </LiquidCard>
</template>

<script setup>
import LiquidCard from './liquid-ui-kit/LiquidCard/LiquidCard.vue';
import LiquidButton from './liquid-ui-kit/LiquidButton/LiquidButton.vue';

defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
@import './ProductCard.css';
</style>

