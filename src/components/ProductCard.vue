<template>
  <LiquidCard class="product-card" hoverable>
    <div class="card-image-wrapper">
      <img :src="product.image" :alt="product.name" />
      <div v-if="product.discount" class="discount-badge">{{ product.discount }}</div>
      <button class="wishlist-btn" @click.stop="handleToggleWishlist">
        <span class="material-icons-round">{{ isWishlisted ? 'favorite' : 'favorite_border' }}</span>
      </button>
    </div>
    <div class="card-content">
      <h4 class="product-name">{{ product.name }}</h4>
      <div class="card-footer">
        <span class="product-price">{{ product.price }}</span>
        <LiquidButton icon="add" size="sm" type="primary" class="add-btn-override" @click.stop="handleAddToCart" />
      </div>
    </div>
  </LiquidCard>
</template>

<script setup>
import { computed } from 'vue';
import LiquidCard from './liquid-ui-kit/LiquidCard/LiquidCard.vue';
import LiquidButton from './liquid-ui-kit/LiquidButton/LiquidButton.vue';
import { useCart } from '../composables/useCart';
import { useWishlist } from '../composables/useWishlist';
import { useToast } from './liquid-ui-kit/LiquidToast/LiquidToast.js';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const { addToCart } = useCart();
const { toggleWishlist, isInWishlist } = useWishlist();
const { showToast } = useToast();

const isWishlisted = computed(() => isInWishlist(props.product.id));

const handleAddToCart = async () => {
    await addToCart(props.product);
    showToast('Added to bag', 'success');
};

const handleToggleWishlist = async () => {
    await toggleWishlist(props.product);
    if (isWishlisted.value) {
        showToast('Added to wishlist', 'success');
    } else {
        showToast('Removed from wishlist', 'info');
    }
};
</script>

<style scoped>
@import './ProductCard.css';
</style>

