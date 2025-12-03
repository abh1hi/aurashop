<template>
  <div class="quick-view-overlay" :class="{ active: visible }" @click.self="closeQuickView">
    <div class="quick-view-modal" v-if="product">
      <!-- Close Button -->
      <button class="close-btn" @click="closeQuickView">
        <span class="material-icons-round">close</span>
      </button>

      <!-- Image Section (Left) -->
      <div class="modal-image-wrapper">
        <img :src="product.image" :alt="product.name" class="modal-image" />
        <span v-if="product.discountPercentage" class="discount-badge">-{{ product.discountPercentage }}%</span>
      </div>

      <!-- Right Column -->
      <div class="modal-right-column">
        <!-- Scrollable Content -->
        <div class="modal-content">
            <!-- Header -->
            <div class="product-header">
                <div class="seller-info">
                    <img src="https://ui-avatars.com/api/?name=Aura+Shop&background=random" class="seller-avatar" />
                    <span>{{ product.brand || 'Aura Shop' }}</span>
                </div>
                <h3 class="product-title">{{ product.name }}</h3>
                <div class="rating-badge">
                    <span class="material-icons-round star-icon">star</span>
                    <span>{{ product.rating || '4.5' }}</span>
                    <span style="color: var(--text-tertiary); font-weight: normal; margin-left: 4px;">({{ product.reviewCount || 120 }} reviews)</span>
                </div>
            </div>

            <!-- Options -->
            <div class="options-section">
                <div v-if="product.sizes" class="option-group-wrapper">
                    <div class="option-group-title">Select Size</div>
                    <div class="option-group">
                        <button 
                            v-for="size in product.sizes" 
                            :key="size" 
                            class="size-btn"
                            :class="{ active: selectedSize === size }"
                            @click="selectedSize = size"
                        >
                            {{ size }}
                        </button>
                    </div>
                </div>

                <div v-if="product.colors" class="option-group-wrapper">
                    <div class="option-group-title">Select Color</div>
                    <div class="option-group">
                        <button 
                            v-for="color in product.colors" 
                            :key="color" 
                            class="color-btn"
                            :class="{ active: selectedColor === color }"
                            :style="{ backgroundColor: color }"
                            @click="selectedColor = color"
                        ></button>
                    </div>
                </div>
            </div>

            <!-- Shipping Info -->
            <div class="shipping-info">
                <span class="material-icons-round">local_shipping</span>
                <span>Free Express Delivery by Tomorrow</span>
            </div>
            
            <!-- Description (Mock) -->
             <p style="font-size: 14px; line-height: 1.6; color: var(--text-secondary);">
                Elevate your style with this premium {{ product.name }}. Crafted from high-quality materials for lasting comfort and durability. Perfect for any occasion.
            </p>

            <!-- More Details Button -->
            <button class="more-details-btn" @click="handleMoreDetails">
                <span>View Full Details</span>
                <span class="material-icons-round" style="font-size: 16px;">arrow_forward</span>
            </button>
        </div>

        <!-- Footer (Fixed at bottom of right col) -->
        <div class="modal-footer">
            <div class="price-wrapper">
                <span class="price-label">Total Price</span>
                <span class="price">${{ product.price }}</span>
            </div>
            <div class="action-buttons">
                <button class="cart-btn-round">
                    <span class="material-icons-round">shopping_cart</span>
                </button>
                <button class="buy-now-btn">Buy Now</button>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuickView } from '../composables/useQuickView';

const { visible, product, closeQuickView } = useQuickView();
const router = useRouter();
const selectedSize = ref(null);
const selectedColor = ref(null);

watch(product, (newProduct) => {
    if (newProduct) {
        selectedSize.value = newProduct.sizes ? newProduct.sizes[0] : null;
        selectedColor.value = newProduct.colors ? newProduct.colors[0] : null;
    }
});

const handleMoreDetails = () => {
    if (product.value) {
        closeQuickView();
        router.push(`/product/${product.value.id}`);
    }
};
</script>

<style scoped>
@import './QuickViewModal.css';

.more-details-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: var(--brand-primary);
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    padding: 0;
    margin-top: var(--spacing-sm);
    transition: gap 0.2s;
}

.more-details-btn:hover {
    gap: 12px;
}
</style>
