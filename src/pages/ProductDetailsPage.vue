<template>
  <div class="product-details-container">
    <AppHeader />
    
    <main class="product-main-grid" v-if="product">
      <!-- Gallery Section -->
      <section class="product-gallery">
        <div class="main-image-wrapper">
          <img :src="activeImage" :alt="product.name" class="main-image" />
        </div>
        <div class="gallery-thumbs" v-if="product.images && product.images.length > 1">
          <button 
            v-for="(img, index) in product.images" 
            :key="index"
            class="thumb-btn"
            :class="{ active: activeImage === img }"
            @click="activeImage = img"
          >
            <img :src="img" class="thumb-img" />
          </button>
        </div>
      </section>

      <!-- Info Section -->
      <section class="product-info-col">
        <div class="product-header">
          <span class="brand-label">{{ product.brand }}</span>
          <h1 class="product-title">{{ product.name }}</h1>
          
          <div class="rating-row">
            <div class="stars">
              <span v-for="n in 5" :key="n" class="material-icons-round">
                {{ getStarIcon(n, product.rating) }}
              </span>
            </div>
            <span class="review-count">({{ product.reviewCount }} Reviews)</span>
          </div>

          <div class="price-section">
            <span class="current-price">${{ product.price }}</span>
            <span v-if="product.originalPrice" class="original-price">${{ product.originalPrice }}</span>
            <span v-if="product.discountPercentage" class="discount-badge">-{{ product.discountPercentage }}%</span>
          </div>
        </div>

        <!-- Options -->
        <div class="options-section">
          <!-- Colors -->
          <div v-if="product.colors" class="option-group">
            <label class="option-group-label">Color: {{ selectedColor }}</label>
            <div class="color-options">
              <button 
                v-for="color in product.colors" 
                :key="color"
                class="color-option"
                :class="{ active: selectedColor === color }"
                :style="{ backgroundColor: color }"
                @click="selectedColor = color"
              ></button>
            </div>
          </div>

          <!-- Sizes -->
          <div v-if="product.sizes" class="option-group">
            <label class="option-group-label">
              Size: {{ selectedSize }}
              <span class="size-guide-link">Size Guide</span>
            </label>
            <div class="size-options">
              <button 
                v-for="size in product.sizes" 
                :key="size"
                class="size-option"
                :class="{ active: selectedSize === size }"
                @click="selectedSize = size"
              >
                {{ size }}
              </button>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="actions-section">
          <div class="qty-selector">
            <button class="qty-btn" @click="quantity > 1 && quantity--">
              <span class="material-icons-round">remove</span>
            </button>
            <input type="text" v-model="quantity" readonly class="qty-input" />
            <button class="qty-btn" @click="quantity++">
              <span class="material-icons-round">add</span>
            </button>
          </div>

          <button class="add-to-cart-btn" @click="handleAddToCart">
            <span class="material-icons-round">shopping_bag</span>
            Add to Cart - ${{ (product.price * quantity).toFixed(2) }}
          </button>

          <button 
            class="wishlist-action-btn" 
            :class="{ active: isWishlisted }"
            @click="handleToggleWishlist"
          >
            <span class="material-icons-round">{{ isWishlisted ? 'favorite' : 'favorite_border' }}</span>
          </button>
        </div>

        <!-- Details Tabs -->
        <div class="details-section">
          <div class="details-tabs">
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'description' }"
              @click="activeTab = 'description'"
            >
              Description
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'specs' }"
              @click="activeTab = 'specs'"
            >
              Specifications
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'delivery' }"
              @click="activeTab = 'delivery'"
            >
              Delivery
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'reviews' }"
              @click="activeTab = 'reviews'"
            >
              Reviews
            </button>
          </div>

          <!-- Description Tab -->
          <div class="details-content" v-if="activeTab === 'description'">
            <div class="editors-note">
                <h4>Why We Love It</h4>
                <p>{{ product.editorsNote || product.description }}</p>
            </div>
            <ul class="features-list">
              <li v-for="(feature, index) in product.features" :key="index">
                {{ feature }}
              </li>
            </ul>
          </div>

          <!-- Specs Tab -->
          <div class="details-content" v-if="activeTab === 'specs'">
            <table class="specs-table">
                <tbody>
                    <tr v-for="(value, key) in product.specs" :key="key">
                        <td class="spec-key">{{ key }}</td>
                        <td class="spec-value">{{ value }}</td>
                    </tr>
                </tbody>
            </table>
          </div>

          <!-- Delivery Tab -->
          <div class="details-content" v-if="activeTab === 'delivery'">
            <div class="delivery-info">
                <div class="delivery-item">
                    <span class="material-icons-round">local_shipping</span>
                    <div>
                        <strong>Free Standard Shipping</strong>
                        <p>Delivery in 3-5 business days.</p>
                    </div>
                </div>
                <div class="delivery-item">
                    <span class="material-icons-round">replay</span>
                    <div>
                        <strong>Free Returns</strong>
                        <p>Within 30 days of purchase.</p>
                    </div>
                </div>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div class="details-content" v-if="activeTab === 'reviews'">
            <div class="reviews-summary">
                <div class="rating-big">
                    <span class="rating-number">{{ product.rating }}</span>
                    <div class="stars">
                        <span v-for="n in 5" :key="n" class="material-icons-round">
                            {{ getStarIcon(n, product.rating) }}
                        </span>
                    </div>
                    <span class="review-count-text">Based on {{ product.reviewCount }} reviews</span>
                </div>
                <!-- Progress Bars (Mock) -->
                <div class="rating-bars">
                    <div class="bar-row" v-for="i in 5" :key="i">
                        <span>{{ 6-i }} Star</span>
                        <div class="progress-bg"><div class="progress-fill" :style="{ width: (Math.random() * 100) + '%' }"></div></div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Complete The Look Carousel -->
    <section class="carousel-section" v-if="similarProducts.length">
        <h2 class="section-title">Complete The Look</h2>
        <div class="product-carousel">
            <ProductCard 
                v-for="prod in similarProducts" 
                :key="prod.id" 
                :product="prod" 
                class="carousel-card"
            />
        </div>
    </section>

    <!-- You Might Also Like Carousel -->
    <section class="carousel-section" v-if="recommendedProducts.length">
        <h2 class="section-title">You Might Also Like</h2>
        <div class="product-carousel">
            <ProductCard 
                v-for="prod in recommendedProducts" 
                :key="prod.id" 
                :product="prod" 
                class="carousel-card"
            />
        </div>
    </section>
    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import ProductCard from '../components/ProductCard.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import { useCart } from '../composables/useCart';
import { useWishlist } from '../composables/useWishlist';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast.js';

const route = useRoute();
const { addToCart } = useCart();
const { toggleWishlist, isInWishlist } = useWishlist();
const { showToast } = useToast();

const product = ref(null);
const similarProducts = ref([]);
const recommendedProducts = ref([]);
const activeImage = ref('');
const selectedColor = ref('');
const selectedSize = ref('');
const quantity = ref(1);
const activeTab = ref('description');

const isWishlisted = computed(() => product.value ? isInWishlist(product.value.id) : false);

const getStarIcon = (index, rating) => {
    if (rating >= index) return 'star';
    if (rating >= index - 0.5) return 'star_half';
    return 'star_border';
};

// Mock Data Fetch
const fetchProduct = async (id) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock Product Data
    product.value = {
        id: parseInt(id),
        name: 'Premium Silk Evening Dress',
        brand: 'Aura Luxe',
        price: 255.00,
        originalPrice: 320.00,
        discountPercentage: 20,
        rating: 4.8,
        reviewCount: 124,
        editorsNote: 'This dress is a masterpiece of modern elegance. The silk fabric feels like a second skin, and the cut is universally flattering. A must-have for your capsule wardrobe.',
        description: 'Experience the epitome of elegance with our Premium Silk Evening Dress. Crafted from 100% organic silk, this dress features a flattering silhouette that drapes beautifully. Perfect for galas, weddings, and sophisticated soirées.',
        features: [
            '100% Organic Mulberry Silk',
            'Breathable and hypoallergenic',
            'Hidden side zipper',
            'Dry clean only'
        ],
        specs: {
            'Material': '100% Mulberry Silk',
            'Lining': '100% Viscose',
            'Care': 'Dry Clean Only',
            'Fit': 'True to Size',
            'Origin': 'Made in Italy'
        },
        images: [
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'
        ],
        colors: ['#D2B48C', '#000000', '#800020'],
        sizes: ['XS', 'S', 'M', 'L', 'XL']
    };

    // Mock Similar/Recommended
    const mockList = [
        { 
            id: 101, 
            name: 'Velvet Clutch', 
            brand: 'Luxe', 
            price: 85, 
            originalPrice: 100,
            discountPercentage: 15,
            image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', 
            rating: 4.5,
            reviewCount: 42,
            featureSnippet: 'Soft velvet finish',
            deliveryInfo: 'Free Delivery',
            stock: 12,
            seller: 'Luxe Accessories',
            colors: ['#800020', '#000000']
        },
        { 
            id: 102, 
            name: 'Gold Statement Earrings', 
            brand: 'Aura', 
            price: 45, 
            image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', 
            rating: 4.9,
            reviewCount: 128,
            featureSnippet: '18k Gold Plated',
            deliveryInfo: 'Delivery by Tomorrow',
            stock: 3,
            seller: 'Aura Jewelry',
            isBestSeller: true
        },
        { 
            id: 103, 
            name: 'Strappy Heels', 
            brand: 'Sole', 
            price: 120, 
            image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80', 
            rating: 4.7,
            reviewCount: 85,
            featureSnippet: 'Genuine Leather',
            deliveryInfo: 'Free Shipping',
            stock: 20,
            seller: 'Sole Shoes',
            sizes: ['36', '37', '38', '39'],
            coupon: 'Extra 10% Off'
        },
        { 
            id: 104, 
            name: 'Silk Scarf', 
            brand: 'Soft', 
            price: 60, 
            image: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=800&q=80', 
            rating: 4.6,
            reviewCount: 30,
            featureSnippet: '100% Silk',
            deliveryInfo: 'Delivery in 2 days',
            stock: 8,
            seller: 'Soft Touch',
            colors: ['#FFC0CB', '#FFFFFF']
        }
    ];
    similarProducts.value = mockList;
    recommendedProducts.value = mockList.reverse();

    activeImage.value = product.value.images[0];
    selectedColor.value = product.value.colors[0];
    selectedSize.value = product.value.sizes[1]; // Default to S or M
};

const handleAddToCart = async () => {
    if (!product.value) return;
    
    await addToCart({
        ...product.value,
        selectedColor: selectedColor.value,
        selectedSize: selectedSize.value,
        quantity: quantity.value
    });
    showToast('Added to bag', 'success');
};

const handleToggleWishlist = async () => {
    if (!product.value) return;
    await toggleWishlist(product.value);
    
    if (isWishlisted.value) {
        showToast('Added to wishlist', 'success');
    } else {
        showToast('Removed from wishlist', 'info');
    }
};

onMounted(() => {
    fetchProduct(route.params.id);
});
</script>

<style scoped>
@import './ProductDetailsPage.css';
</style>
