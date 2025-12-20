<template>
  <div class="page-container">
    <!-- Background Blobs -->
    <div class="background-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <AppHeader />
    
    <main class="main-content">
      <div class="split-layout">
        <!-- Left Panel: Form & Stepper -->
        <div class="form-panel">
          <div class="panel-header">
            <div class="back-link" @click="router.back()">
              <span class="material-icons-round">close</span>
              Cancel
            </div>
            <h1 class="page-title">Add New Product</h1>
          </div>

          <LiquidStepper 
            v-model="currentStep" 
            :steps="steps" 
            class="mb-lg"
          />

          <div class="form-content">
            <!-- Step 1: Essentials -->
            <div v-if="currentStep === 0" class="step-content">
              <h2 class="step-title">Basic Information</h2>
              <p class="step-desc">Enter the primary details for your new product.</p>
              
              <div class="form-group">
                <label class="form-label">Product Name</label>
                <LiquidInput v-model="formData.name" placeholder="e.g. Premium Cotton T-Shirt" />
              </div>

              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea 
                  v-model="formData.description" 
                  class="form-textarea" 
                  placeholder="Describe your product's key features and benefits..."
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
                  <label class="form-label">Sub-Category</label>
                  <LiquidInput v-model="formData.subCategory" placeholder="e.g. Menswear, Summer" />
                </div>
                <div class="form-group">
                  <label class="form-label">Brand</label>
                  <LiquidInput v-model="formData.brand" placeholder="e.g. Aura Wear" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Tags</label>
                <LiquidInput v-model="formData.tags" placeholder="summer, cotton, breathable (comma separated)" />
              </div>
            </div>

            <!-- Step 2: Visuals -->
            <div v-if="currentStep === 1" class="step-content">
              <h2 class="step-title">Product Media</h2>
              <p class="step-desc">Upload high-quality images to showcase your product.</p>
              
              <LiquidFileUpload 
                v-model="formData.images" 
                multiple 
                accept="image/*" 
                label="Upload Product Images"
                hint="We recommend 1:1 square images"
              />
            </div>

            <!-- Step 3: Pricing & Inventory -->
            <div v-if="currentStep === 2" class="step-content">
              <h2 class="step-title">Pricing & Stock</h2>
              <p class="step-desc">Configure your product's valuation and availability.</p>
              
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
                  <label class="form-label">Cost per Item ($)</label>
                  <LiquidInput v-model="formData.costPrice" type="number" placeholder="0.00" />
                </div>
                <div class="form-group">
                  <label class="form-label">Initial Stock</label>
                  <LiquidInput v-model="formData.stock" type="number" placeholder="0" />
                </div>
              </div>

              <h3 class="section-subtitle mt-md">Additional Details</h3>
              <div class="form-group">
                <label class="form-label">Materials</label>
                <LiquidInput v-model="formData.material" placeholder="e.g. 100% Organic Cotton" />
              </div>
              <div class="form-group">
                <label class="form-label">Care Instructions</label>
                <textarea v-model="formData.careInstructions" class="form-textarea" placeholder="e.g. Machine wash cold, tumble dry low"></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Warranty Info</label>
                  <LiquidInput v-model="formData.warranty" placeholder="e.g. 1 Year Limited" />
                </div>
                <div class="form-group">
                  <label class="form-label">Return Policy</label>
                  <LiquidInput v-model="formData.returnPolicy" placeholder="e.g. 30 Days Easy Returns" />
                </div>
              </div>
            </div>

            <!-- Step 4: Variants -->
            <div v-if="currentStep === 3" class="step-content">
              <h2 class="step-title">Product Variants</h2>
              <p class="step-desc">Add options like size or color to create variants.</p>

              <div class="add-option-card">
                <h3 class="section-subtitle">Add Option</h3>
                <div class="form-row">
                  <div class="form-group" style="flex: 1;">
                    <label class="form-label">Option Name</label>
                    <LiquidInput v-model="newOptionName" placeholder="e.g. Size, Color" />
                  </div>
                  <div class="form-group" style="flex: 2;">
                    <label class="form-label">Option Values</label>
                    <LiquidInput v-model="newOptionValues" placeholder="S, M, L (comma separated)" />
                  </div>
                  <div class="form-group" style="flex: 0; align-self: flex-end;">
                     <LiquidButton text="Add Option" type="secondary" @click="addOption" />
                  </div>
                </div>
              </div>

              <!-- Options List -->
              <div v-if="formData.options.length > 0" class="options-list mt-md">
                <div v-for="(option, index) in formData.options" :key="index" class="option-item">
                  <div class="option-info">
                    <strong>{{ option.name }}</strong>
                    <span class="option-values">{{ option.values.join(', ') }}</span>
                  </div>
                  <button class="icon-btn" @click="removeOption(index)">
                    <span class="material-icons-round">delete</span>
                  </button>
                </div>
              </div>

              <!-- Variants Table -->
              <div v-if="formData.variants.length > 0" class="variants-table-container mt-lg">
                <h3 class="section-subtitle">Generated Variants</h3>
                <table class="variants-table">
                  <thead>
                    <tr>
                      <th>Variant</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>SKU</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="variant in formData.variants" :key="variant.id">
                      <td>{{ variant.name }}</td>
                      <td>
                        <input type="number" v-model="variant.price" class="table-input" />
                      </td>
                      <td>
                        <input type="number" v-model="variant.stock" class="table-input" />
                      </td>
                      <td>
                        <input type="text" v-model="variant.sku" class="table-input" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Review -->
            <div v-if="currentStep === 5" class="step-content">
              <h2 class="step-title">Review & Publish</h2>
              <p class="step-desc">Double-check your product details before going live.</p>
              
              <div class="review-card">
                <div class="review-row">
                  <span>Product Name</span>
                  <strong>{{ formData.name || 'Untitled' }}</strong>
                </div>
                <div class="review-row">
                  <span>Selling Price</span>
                  <strong>${{ formData.price || '0.00' }}</strong>
                </div>
                <div class="review-row">
                  <span>Category</span>
                  <strong>{{ getCategoryLabel(formData.category) }}</strong>
                </div>
                <div class="review-row">
                  <span>Stock Units</span>
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
              @click="handleNextStep" 
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
              <p>Pro Tip: Great product photography can increase sales by up to 40%!</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" src="./AddProductPage.ts"></script>
<style scoped src="./AddProductPage.css"></style>
