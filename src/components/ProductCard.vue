<template>
  <div class="product-card">
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
        <LiquidButton icon="add" type="primary" size="sm" />
      </div>
    </div>
  </div>
</template>

<script setup>
import LiquidButton from './LiquidButton.vue';

defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.product-card {
  background-color: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 125%; /* Aspect ratio for image */
}

.card-image-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.discount-badge {
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
  background-color: var(--primary-text);
  color: white;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: var(--font-weight-bold);
}

.wishlist-btn {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  background: var(--glass-bg);
  border: none;
  border-radius: var(--radius-full);
  padding: var(--spacing-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);
}

.wishlist-btn .material-icons-round {
  font-size: 18px;
  color: var(--text-color);
}

.card-content {
  padding: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-name {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  flex-grow: 1;
  margin-bottom: var(--spacing-sm);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: var(--text-base);
  font-weight: var(--font-weight-bold);
}
</style>
