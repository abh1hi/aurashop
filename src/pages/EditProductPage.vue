<template>
  <div class="page-container">
    <AppHeader />
    
    <main class="main-content">
      <div v-if="loading" class="loading-overlay">
        <LiquidSpinner />
      </div>

      <div class="split-layout">
        <!-- Left Panel: Form -->
        <div class="form-panel">
          <div class="panel-header">
            <div class="back-link" @click="router.back()">
              <span class="material-icons-round">arrow_back</span>
              Cancel
            </div>
            <h1 class="page-title">Edit Product</h1>
          </div>

          <div class="form-content">
            <h2 class="step-title">Product Details</h2>
            
            <div class="form-group">
              <label class="form-label">Product Name</label>
              <LiquidInput v-model="formData.name" placeholder="e.g. Neon Cyber Jacket" />
            </div>

            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea 
                v-model="formData.description" 
                class="form-textarea" 
                placeholder="Tell a story about your product..."
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Category</label>
              <LiquidDropdown 
                v-model="formData.category" 
                :options="categories" 
                placeholder="Select Category"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Price ($)</label>
                <LiquidInput v-model="formData.price" type="number" placeholder="0.00" />
              </div>
              <div class="form-group">
                <label class="form-label">Compare at ($)</label>
                <LiquidInput v-model="formData.comparePrice" type="number" placeholder="0.00" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Stock</label>
                <LiquidInput v-model="formData.stock" type="number" placeholder="0" />
              </div>
              <div class="form-group">
                <label class="form-label">SKU</label>
                <LiquidInput v-model="formData.sku" placeholder="Optional" />
              </div>
            </div>

            <!-- Image Management -->
            <div class="form-group">
              <label class="form-label">Images</label>
              <div class="current-images" v-if="existingImages.length">
                <div v-for="(img, index) in existingImages" :key="index" class="image-preview-item">
                  <img :src="img" />
                  <button class="remove-btn" @click="removeExistingImage(index)">
                    <span class="material-icons-round">close</span>
                  </button>
                </div>
              </div>
              
              <LiquidFileUpload 
                v-model="newImages" 
                multiple 
                accept="image/*" 
                label="Add more photos"
                hint="New images will be appended"
                class="mt-md"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <LiquidButton 
              text="Delete Product" 
              type="danger" 
              class="mr-auto"
              @click="handleDelete" 
            />
            <div class="spacer"></div>
            <LiquidButton 
              text="Save Changes" 
              type="primary" 
              :loading="submitting"
              @click="handleUpdate" 
            />
          </div>
        </div>

        <!-- Right Panel: Live Preview -->
        <div class="preview-panel">
          <div class="preview-sticky">
            <h3 class="preview-title">Live Preview</h3>
            <div class="product-card-preview">
              <div class="preview-image">
                <img v-if="previewImage" :src="previewImage" alt="Product Preview" />
                <div v-else class="placeholder-image">
                  <span class="material-icons-round">image</span>
                </div>
                <div v-if="formData.comparePrice && Number(formData.comparePrice) > Number(formData.price)" class="sale-badge">SALE</div>
              </div>
              <div class="preview-details">
                <div class="preview-category">{{ getCategoryLabel(formData.category) || 'Category' }}</div>
                <h3 class="preview-name">{{ formData.name || 'Product Name' }}</h3>
                <div class="preview-price">
                  <span class="current-price">${{ formData.price || '0.00' }}</span>
                  <span v-if="formData.comparePrice" class="original-price">${{ formData.comparePrice }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import LiquidInput from '../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import LiquidDropdown from '../components/liquid-ui-kit/LiquidDropdown/LiquidDropdown.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidFileUpload from '../components/liquid-ui-kit/LiquidFileUpload/LiquidFileUpload.vue';
import LiquidSpinner from '../components/liquid-ui-kit/LiquidSpinner/LiquidSpinner.vue';
import { useVendor } from '../composables/useVendor';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast.js';

const router = useRouter();
const route = useRoute();
const { getProduct, updateProduct, deleteProduct } = useVendor();
const { showToast } = useToast();

const loading = ref(true);
const submitting = ref(false);
const existingImages = ref([]);
const newImages = ref([]);

const categories = [
  { label: 'Clothing', value: 'clothing' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Home & Garden', value: 'home' },
  { label: 'Beauty', value: 'beauty' },
  { label: 'Accessories', value: 'accessories' }
];

const formData = reactive({
  name: '',
  description: '',
  category: '',
  price: '',
  comparePrice: '',
  stock: '',
  sku: ''
});

const getCategoryLabel = (value) => {
  const cat = categories.find(c => c.value === value);
  return cat ? cat.label : value;
};

const previewImage = computed(() => {
  if (newImages.value.length > 0) {
    return URL.createObjectURL(newImages.value[0]);
  }
  if (existingImages.value.length > 0) {
    return existingImages.value[0];
  }
  return null;
});

const removeExistingImage = (index) => {
  existingImages.value.splice(index, 1);
};

onMounted(async () => {
  const productId = route.params.productId;
  if (productId) {
    const product = await getProduct(productId);
    if (product) {
      formData.name = product.name;
      formData.description = product.description;
      formData.category = product.category;
      formData.price = product.price;
      formData.comparePrice = product.comparePrice;
      formData.stock = product.stock;
      formData.sku = product.sku;
      existingImages.value = product.images || [];
    } else {
      showToast('Product not found', 'error');
      router.back();
    }
  }
  loading.value = false;
});

const handleUpdate = async () => {
  submitting.value = true;
  try {
    const productId = route.params.productId;
    
    const updateData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: Number(formData.price),
      comparePrice: formData.comparePrice ? Number(formData.comparePrice) : null,
      stock: Number(formData.stock),
      sku: formData.sku,
      images: existingImages.value // Keep existing images (backend logic might need adjustment to merge)
    };

    await updateProduct(productId, updateData, newImages.value);
    showToast('Product updated successfully', 'success');
    router.back();
  } catch (e) {
    showToast('Failed to update product', 'error');
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async () => {
  if (confirm('Are you sure? This cannot be undone.')) {
    try {
      await deleteProduct(route.params.productId);
      showToast('Product deleted', 'success');
      router.back();
    } catch (e) {
      showToast('Failed to delete product', 'error');
    }
  }
};
</script>

<style scoped src="./AddProductPage.css"></style>
<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(5px);
}

.current-images {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.image-preview-item {
  width: 80px;
  height: 80px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--glass-border);
}

.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.remove-btn .material-icons-round {
  font-size: 14px;
}

.mt-md { margin-top: 16px; }
.mr-auto { margin-right: auto; }
</style>
