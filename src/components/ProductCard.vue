<template>
  <div class="product-card" @click="handleCardClick">
    <!-- 1. Product Image -->
    <div class="card-image-wrapper">
      <img :src="product.image" :alt="product.name" loading="lazy" />
      
      <!-- 9. Badges / Trust Tags -->
      <div class="badges-container">
        <span v-if="discountPercentage" class="badge discount">{{ discountPercentage }}% OFF</span>
        <span v-if="product.isNew" class="badge new">New</span>
        <span v-if="product.isBestSeller" class="badge best-seller">Best Seller</span>
        <span v-if="product.stock < 5" class="badge limited">Only {{ product.stock }} Left</span>
      </div>

      <!-- 10. CTA (Wishlist & Quick View) -->
      <div class="card-actions-top">
        <button 
            class="action-btn" 
            :class="{ active: isWishlisted }"
            @click.stop="handleToggleWishlist"
            title="Add to Wishlist"
        >
            <span class="material-icons-round">{{ isWishlisted ? 'favorite' : 'favorite_border' }}</span>
        </button>
        <button class="action-btn" @click.stop="handleQuickView" title="Quick View">
            <span class="material-icons-round">visibility</span>
        </button>
      </div>
    </div>

    <!-- Content Section -->
    <div class="card-content">
      <!-- 3. Brand Name -->
      <div class="brand-row">
        <span class="brand-name">{{ product.brand || 'Aura Shop' }}</span>
        <!-- 16. Seller Name (Optional) -->
        <span v-if="product.seller" class="seller-name">Sold by {{ product.seller }}</span>
      </div>
      
      <!-- 2. Product Title -->
      <h3 class="product-title" :title="product.name">{{ product.name }}</h3>

      <!-- 11. Short Feature Snippet -->
      <p v-if="product.featureSnippet" class="feature-snippet">{{ product.featureSnippet }}</p>

      <!-- 7. Rating -->
      <div class="rating-row">
        <div class="stars">
            <span v-for="n in 5" :key="n" class="material-icons-round">
                {{ getStarIcon(n, product.rating || 0) }}
            </span>
        </div>
        <span class="rating-text">{{ product.rating || 0 }} ({{ product.reviewCount || 0 }})</span>
      </div>

      <!-- 4, 5, 6. Price Section -->
      <div class="price-row">
        <div class="price-main">
            <span class="current-price">${{ product.price }}</span>
            <span v-if="product.originalPrice" class="original-price">${{ product.originalPrice }}</span>
        </div>
        <!-- 13. Price per Unit (Optional) -->
        <span v-if="product.unitPrice" class="unit-price">({{ product.unitPrice }})</span>
      </div>

      <!-- 17. Coupon Tag -->
      <div v-if="product.coupon" class="coupon-tag">
        <span class="material-icons-round">local_offer</span>
        {{ product.coupon }}
      </div>

      <!-- 14. EMI Options -->
      <div v-if="product.emi" class="emi-text">
        EMI from ${{ product.emi }}/mo
      </div>

      <!-- 8. Variations -->
      <div class="options-row">
        <div class="colors" v-if="product.colors">
            <div 
                v-for="color in product.colors.slice(0, 3)" 
                :key="color" 
                class="color-dot" 
                :style="{ backgroundColor: color }"
            ></div>
            <span v-if="product.colors.length > 3" class="more-count">+{{ product.colors.length - 3 }}</span>
        </div>
        <div class="sizes" v-if="product.sizes">
            <span v-for="size in product.sizes.slice(0, 3)" :key="size" class="size-text">{{ size }}</span>
            <span v-if="product.sizes.length > 3" class="more-count">+{{ product.sizes.length - 3 }}</span>
        </div>
      </div>

      <!-- 12. Delivery Info -->
      <div class="delivery-info">
        <span class="material-icons-round">local_shipping</span>
        {{ product.deliveryInfo || 'Delivery by Tomorrow' }}
      </div>

      <!-- 10. CTA (Add to Cart) -->
      <button class="add-to-cart-btn" @click.stop="handleAddToCart">
        <span class="material-icons-round">shopping_bag</span>
        Add to Cart
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCart } from '../composables/useCart';
import { useWishlist } from '../composables/useWishlist';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast';
import { useQuickView } from '../composables/useQuickView';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const { addToCart } = useCart();
const { toggleWishlist, isInWishlist } = useWishlist();
const { showToast } = useToast();
const { openQuickView } = useQuickView();

const isWishlisted = computed(() => isInWishlist(props.product.id));

const discountPercentage = computed(() => {
    if (props.product.discountPercentage) return props.product.discountPercentage;
    if (props.product.originalPrice && props.product.price) {
        const original = parseFloat(props.product.originalPrice);
        const current = parseFloat(props.product.price);
        if (original > current) {
            return Math.round(((original - current) / original) * 100);
        }
    }
    return null;
});

const getStarIcon = (index, rating) => {
    if (rating >= index) return 'star';
    if (rating >= index - 0.5) return 'star_half';
    return 'star_border';
};

const handleCardClick = () => {
  router.push(`/product/${props.product.id}`);
};

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

const handleQuickView = () => {
  openQuickView(props.product);
};
</script>

<style scoped>
@import './ProductCard.css';
</style>
