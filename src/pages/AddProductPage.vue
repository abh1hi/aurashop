<template>
  <div class="page-container">
    <AppHeader />
    
    <main class="main-content">
      <div class="split-layout">
        <!-- Left Panel: Form & Stepper -->
        <div class="form-panel">
          <div class="panel-header">
            <div class="back-link" @click="router.back()">
              <span class="material-icons-round">arrow_back</span>
              Cancel
            </div>
            <h1 class="page-title">Add Product</h1>
          </div>

          <LiquidStepper 
            v-model="currentStep" 
            :steps="steps" 
            class="mb-lg"
          />

          <div class="form-content">
            <!-- Step 1: Essentials -->
            <div v-if="currentStep === 0" class="step-content">
              <h2 class="step-title">The Essentials</h2>
              <p class="step-desc">Let's start with the basics of your product.</p>
              
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
            </div>

            <!-- Step 2: Visuals -->
            <div v-if="currentStep === 1" class="step-content">
              <h2 class="step-title">Visuals</h2>
              <p class="step-desc">Showcase your product with high-quality images.</p>
              
              <LiquidFileUpload 
                v-model="formData.images" 
                multiple 
                accept="image/*" 
                label="Drop your photos here"
                hint="We recommend 1:1 square images"
              />
            </div>

            <!-- Step 3: Details -->
            <div v-if="currentStep === 2" class="step-content">
              <h2 class="step-title">The Details</h2>
              <p class="step-desc">Set your price and inventory.</p>
              
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
            </div>

            <!-- Step 4: Review -->
            <div v-if="currentStep === 3" class="step-content">
              <h2 class="step-title">Ready to Launch?</h2>
              <p class="step-desc">Review your product before publishing.</p>
              
              <div class="review-card">
                <div class="review-row">
                  <span>Name</span>
                  <strong>{{ formData.name || 'Untitled Product' }}</strong>
                </div>
                <div class="review-row">
                  <span>Price</span>
                  <strong>${{ formData.price || '0.00' }}</strong>
                </div>
                <div class="review-row">
                  <span>Category</span>
                  <strong>{{ getCategoryLabel(formData.category) }}</strong>
                </div>
                <div class="review-row">
                  <span>Stock</span>
                  <strong>{{ formData.stock }} units</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <LiquidButton 
              v-if="currentStep > 0"
              text="Back" 
              type="ghost" 
              @click="currentStep--" 
            />
            <div class="spacer"></div>
            <LiquidButton 
              v-if="currentStep < steps.length - 1"
              text="Next Step" 
              type="primary" 
              @click="currentStep++" 
            />
            <LiquidButton 
              v-else
              text="Publish Product" 
              type="primary" 
              :loading="submitting"
              @click="handleSubmit" 
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
            
            <div class="preview-tip">
              <span class="material-icons-round">tips_and_updates</span>
              <p>Tip: Great images increase sales by 40%!</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" src="./AddProductPage.ts"></script>
<style scoped src="./AddProductPage.css"></style>
