<template>
  <div class="page-container">
    <!-- Background Blobs -->
    <div class="background-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

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
              <span class="material-icons-round">west</span>
              Cancel
            </div>
            <h1 class="page-title">Edit Product</h1>
          </div>

          <div class="form-content">
            <h2 class="step-title">Product Information</h2>
            <p class="step-desc">Update the core details and attributes of your product.</p>
            
            <div class="form-group">
              <label class="form-label">Product Name</label>
              <LiquidInput v-model="formData.name" placeholder="e.g. Premium Cotton T-Shirt" />
            </div>

            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea 
                v-model="formData.description" 
                class="form-textarea" 
                placeholder="Update your product's key features and benefits..."
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
                <label class="form-label">Selling Price ($)</label>
                <LiquidInput v-model="formData.price" type="number" placeholder="0.00" />
              </div>
              <div class="form-group">
                <label class="form-label">Compare Price ($)</label>
                <LiquidInput v-model="formData.comparePrice" type="number" placeholder="0.00" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Stock Units</label>
                <LiquidInput v-model="formData.stock" type="number" placeholder="0" />
              </div>
              <div class="form-group">
                <label class="form-label">SKU</label>
                <LiquidInput v-model="formData.sku" placeholder="Unique identifier" />
              </div>
            </div>

            <!-- Image Management -->
            <div class="form-group">
              <label class="form-label">Product Images</label>
              <div class="current-images" v-if="existingImages.length">
                <div v-for="(img, index) in existingImages" :key="index" class="image-preview-item">
                  <img :src="img" />
                  <button class="remove-btn" @click="removeExistingImage(index)" title="Remove Image">
                    <span class="material-icons-round">close</span>
                  </button>
                </div>
              </div>
              
              <LiquidFileUpload 
                v-model="newImages" 
                multiple 
                accept="image/*" 
                label="Add More Images"
                hint="New images will be added to your current gallery"
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
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast';

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
    if (typeof newImages.value[0] === 'string') return newImages.value[0];
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
    try {
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
    } catch (e) {
      showToast('Failed to load product', 'error');
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
      images: existingImages.value 
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
  if (confirm('Delete this product? This action is irreversible.')) {
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
  background: var(--liquid-glass-base);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(var(--liquid-blur));
}

.current-images {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.image-preview-item {
  width: 90px;
  height: 90px;
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--liquid-glass-border);
  background: var(--liquid-glass-shine-1);
}

.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s var(--ease-out);
}

.image-preview-item:hover img {
    transform: scale(1.1);
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.2s;
  z-index: 2;
}

.remove-btn:hover {
    background: var(--error-color);
    transform: scale(1.1);
}

.remove-btn .material-icons-round {
  font-size: 16px;
}

.mt-md { margin-top: 16px; }
.mr-auto { margin-right: auto; }
</style>
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
