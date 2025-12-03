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

              <div class="form-group" v-if="formData.category">
                <label class="form-label">Sub-Category</label>
                <LiquidInput v-model="formData.subCategory" placeholder="e.g. Jackets, T-Shirts" />
              </div>

              <div class="form-group">
                <label class="form-label">Brand</label>
                <LiquidInput v-model="formData.brand" placeholder="e.g. Nike, Adidas" />
              </div>

              <div class="form-group">
                <label class="form-label">Tags</label>
                <LiquidInput v-model="formData.tags" placeholder="Enter tags separated by commas" />
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
                <div class="form-group">
                  <label class="form-label">Cost Price ($)</label>
                  <LiquidInput v-model="formData.costPrice" type="number" placeholder="0.00" hint="For margin calculation" />
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

              <h3 class="section-subtitle mt-md">Additional Info</h3>
              <div class="form-group">
                <label class="form-label">Material</label>
                <LiquidInput v-model="formData.material" placeholder="e.g. 100% Cotton" />
              </div>
              <div class="form-group">
                <label class="form-label">Care Instructions</label>
                <textarea v-model="formData.careInstructions" class="form-textarea" placeholder="e.g. Machine wash cold"></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Warranty</label>
                  <LiquidInput v-model="formData.warranty" placeholder="e.g. 1 Year" />
                </div>
                <div class="form-group">
                  <label class="form-label">Return Policy</label>
                  <LiquidInput v-model="formData.returnPolicy" placeholder="e.g. 30 Days" />
                </div>
              </div>

              <h3 class="section-subtitle mt-md">Shipping</h3>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Weight (kg)</label>
                  <LiquidInput v-model="formData.weight" type="number" placeholder="0.0" />
                </div>
                <div class="form-group">
                   <label class="form-label">Dimensions (L x W x H cm)</label>
                   <div class="flex gap-sm">
                     <LiquidInput v-model="formData.dimensions.length" type="number" placeholder="L" />
                     <LiquidInput v-model="formData.dimensions.width" type="number" placeholder="W" />
                     <LiquidInput v-model="formData.dimensions.height" type="number" placeholder="H" />
                   </div>
                </div>
              </div>
            </div>

            <!-- Step 4: Variants -->
            <div v-if="currentStep === 3" class="step-content">
              <h2 class="step-title">Variants</h2>
              <p class="step-desc">Add options like size or color to create variants.</p>

              <!-- Add Option Section -->
              <div class="add-option-card">
                <h3 class="section-subtitle">Add Option</h3>
                <div class="form-row">
                  <div class="form-group" style="flex: 1;">
                    <label class="form-label">Option Name</label>
                    <LiquidInput v-model="newOptionName" placeholder="e.g. Size, Color" />
                  </div>
                  <div class="form-group" style="flex: 2;">
                    <label class="form-label">Option Values</label>
                    <LiquidInput v-model="newOptionValues" placeholder="e.g. S, M, L (comma separated)" />
                  </div>
                  <div class="form-group" style="flex: 0; align-self: flex-end;">
                     <LiquidButton text="Add" type="secondary" @click="addOption" />
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
                <h3 class="section-subtitle">Preview Variants</h3>
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

            <!-- Step 5: Advanced -->
            <div v-if="currentStep === 4" class="step-content">
              <h2 class="step-title">Advanced Settings</h2>
              <p class="step-desc">Optimize for search engines and manage visibility.</p>

              <h3 class="section-subtitle">SEO (Search Engine Optimization)</h3>
              <div class="form-group">
                <label class="form-label">Meta Title</label>
                <LiquidInput v-model="formData.seo.title" placeholder="e.g. Neon Cyber Jacket - Best Techwear" hint="Leave blank to use product name" />
              </div>
              <div class="form-group">
                <label class="form-label">Meta Description</label>
                <textarea v-model="formData.seo.description" class="form-textarea" placeholder="Brief summary for search results..." style="min-height: 100px;"></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Keywords</label>
                <LiquidInput v-model="formData.seo.keywords" placeholder="e.g. techwear, cyberpunk, jacket" />
              </div>
              <div class="form-group">
                <label class="form-label">Canonical URL</label>
                <LiquidInput v-model="formData.seo.canonicalUrl" placeholder="https://..." />
              </div>

              <h3 class="section-subtitle mt-lg">Visibility</h3>
              <div class="form-group">
                <label class="form-label">Product Status</label>
                <LiquidDropdown 
                  v-model="formData.status" 
                  :options="[
                    { label: 'Active', value: 'active' },
                    { label: 'Draft', value: 'draft' },
                    { label: 'Archived', value: 'archived' }
                  ]" 
                />
              </div>
            </div>

            <!-- Step 6: Review -->
            <div v-if="currentStep === 5" class="step-content">
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
