<template>
  <AdminLayout>
    <div class="vendor-management-header">
      <div class="header-content">
        <h1 class="page-title">Vendor<span>Management</span></h1>
        <p class="page-subtitle">Oversee marketplace stores, verification applications, and commercial status.</p>
      </div>
      <div class="search-wrap">
        <LiquidInput 
          v-model="searchQuery" 
          placeholder="Filter by store or owner..." 
          icon="search" 
        />
      </div>
    </div>

    <div class="vendors-viewport">
      <div v-if="loading" class="loading-state">
         <div class="skeleton-loader"></div>
      </div>
      
      <div v-else-if="filteredVendors.length > 0" class="table-container">
        <!-- Desktop Header -->
        <div class="grid-header">
          <div class="col-store">Store Entity</div>
          <div class="col-owner">Ownership</div>
          <div class="col-joined">Provisioned</div>
          <div class="col-kyc">Verification Status</div>
          <div class="col-actions">Actions</div>
        </div>

        <div class="grid-rows">
          <div v-for="vendor in filteredVendors" :key="vendor.id" class="data-row">
            <div class="col-store">
              <div class="store-card">
                <div class="store-orb">
                  {{ getInitials(vendor.name) }}
                </div>
                <div class="store-details">
                  <span class="store-name">{{ vendor.name || 'Unnamed Store' }}</span>
                  <span class="store-id">{{ vendor.id?.substring(0, 8) }}...</span>
                </div>
              </div>
            </div>

            <div class="col-owner">
              <div class="owner-info">
                <span class="owner-label">UID:</span>
                <span class="owner-val">{{ vendor.ownerId?.substring(0, 12) }}...</span>
              </div>
            </div>

            <div class="col-joined">
              <span class="timestamp">{{ formatDate(vendor.createdAt) }}</span>
            </div>

            <div class="col-kyc">
              <div class="status-chip" :class="getKYCStatusClass(vendor.kycStatus)">
                <span class="dot"></span>
                {{ vendor.kycStatus || 'In Queue' }}
              </div>
            </div>

            <div class="col-actions">
              <div class="action-cluster">
                <button class="icon-btn-glass review" title="Review Application" @click="openReviewModal(vendor)">
                  <span class="material-icons-round">analytics</span>
                </button>
                <button class="icon-btn-glass approve" title="Approve Application" @click="handleApprove(vendor)">
                  <span class="material-icons-round">verified</span>
                </button>
                <button class="icon-btn-glass reject" title="Reject Application" @click="handleReject(vendor)">
                  <span class="material-icons-round">gpp_maybe</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <span class="material-icons-round">storefront_off</span>
        <h3>No marketplace stores registered</h3>
        <p>Awaiting vendor applications.</p>
      </div>
    </div>

    <!-- Liquid Glass Modal -->
    <Transition name="modal">
      <div v-if="showModal" class="glass-modal-overlay" @click.self="closeModal">
        <div class="glass-modal-container">
          <div class="modal-glow"></div>
          <div class="modal-content">
            <header class="modal-header">
              <div class="header-info">
                <h2>Verification Application</h2>
                <p>Analyzing vendor credentials and proofs.</p>
              </div>
              <button class="modal-close" @click="closeModal">
                <span class="material-icons-round">close</span>
              </button>
            </header>
            
            <div class="modal-body" v-if="selectedVendor">
              <!-- Tabs -->
              <div class="modal-tabs">
                <button 
                    class="tab-btn" 
                    :class="{ active: activeTab === 'profile' }"
                    @click="activeTab = 'profile'"
                >
                    Business Profile
                </button>
                <button 
                    class="tab-btn" 
                    :class="{ active: activeTab === 'verification' }"
                    @click="activeTab = 'verification'"
                >
                    Identity & Verification
                </button>
              </div>

              <!-- Profile Tab -->
              <div v-if="activeTab === 'profile'" class="tab-content profile-grid">
                <!-- Branding Section -->
                <div class="review-section full-width">
                    <div class="section-header">
                        <label>Store Branding</label>
                        <div class="check-wrap">
                            <input type="checkbox" :checked="verifiedFields['branding']" @change="toggleVerification('branding')" id="chk-branding" />
                            <label for="chk-branding">Verify Branding</label>
                        </div>
                    </div>
                    <div class="branding-preview" :class="{ 'verified': verifiedFields['branding'] }">
                        <div class="banner-preview" :style="{ backgroundImage: `url(${selectedVendor.bannerUrl})` }">
                            <div class="logo-preview">
                                <img :src="selectedVendor.logoUrl || '/placeholder-logo.png'" alt="Logo" />
                            </div>
                        </div>
                        <p v-if="!selectedVendor.bannerUrl && !selectedVendor.logoUrl" class="no-branding">No branding assets uploaded</p>
                    </div>
                </div>

                <!-- Business Details -->
                <div class="review-section">
                    <label>Business Details</label>
                    <div class="info-list">
                        <div class="info-item" :class="{ 'verified': verifiedFields['name'] }">
                            <span class="label">Store Name</span>
                            <div class="val-group">
                                <span class="value">{{ selectedVendor.name }}</span>
                                <input type="checkbox" :checked="verifiedFields['name']" @change="toggleVerification('name')" />
                            </div>
                        </div>
                        <div class="info-item" :class="{ 'verified': verifiedFields['category'] }">
                            <span class="label">Category</span>
                            <div class="val-group">
                                <span class="value">{{ getCategoryName(selectedVendor.category) }}</span>
                                <input type="checkbox" :checked="verifiedFields['category']" @change="toggleVerification('category')" />
                            </div>
                        </div>
                         <div class="info-item" :class="{ 'verified': verifiedFields['description'] }">
                            <span class="label">Description</span>
                             <div class="val-group">
                                <span class="value desc">{{ selectedVendor.description || 'No description provided' }}</span>
                                <input type="checkbox" :checked="verifiedFields['description']" @change="toggleVerification('description')" />
                            </div>
                        </div>
                         <div class="info-item" :class="{ 'verified': verifiedFields['address'] }">
                            <span class="label">Location</span>
                            <div class="val-group">
                                <span class="value">{{ selectedVendor.address || 'N/A' }}, {{ selectedVendor.city || 'N/A' }}</span>
                                <input type="checkbox" :checked="verifiedFields['address']" @change="toggleVerification('address')" />
                            </div>
                        </div>
                         <div class="info-item" :class="{ 'verified': verifiedFields['hours'] }">
                            <span class="label">Operating Hours</span>
                             <div class="val-group">
                                <span class="value">{{ selectedVendor.hours || 'Not specified' }}</span>
                                <input type="checkbox" :checked="verifiedFields['hours']" @change="toggleVerification('hours')" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Contact & Financials -->
                <div class="review-section">
                    <label>Contact & Financials</label>
                    <div class="info-list">
                        <div class="info-item" :class="{ 'verified': verifiedFields['phone'] }">
                            <span class="label">Phone</span>
                             <div class="val-group">
                                <span class="value mono">{{ selectedVendor.phone }}</span>
                                <input type="checkbox" :checked="verifiedFields['phone']" @change="toggleVerification('phone')" />
                            </div>
                        </div>
                        <div class="info-item" :class="{ 'verified': verifiedFields['email'] }">
                            <span class="label">Email</span>
                             <div class="val-group">
                                <span class="value mono">{{ selectedVendor.email }}</span>
                                <input type="checkbox" :checked="verifiedFields['email']" @change="toggleVerification('email')" />
                            </div>
                        </div>
                        <div class="divider"></div>
                        <div class="info-item" :class="{ 'verified': verifiedFields['bankName'] }">
                            <span class="label">Bank Name</span>
                             <div class="val-group">
                                <span class="value">{{ selectedVendor.bankDetails?.name || 'N/A' }}</span>
                                <input type="checkbox" :checked="verifiedFields['bankName']" @change="toggleVerification('bankName')" />
                            </div>
                        </div>
                        <div class="info-item" :class="{ 'verified': verifiedFields['account'] }">
                            <span class="label">Account Number</span>
                             <div class="val-group">
                                <span class="value mono">{{ selectedVendor.bankDetails?.account || 'N/A' }}</span>
                                <input type="checkbox" :checked="verifiedFields['account']" @change="toggleVerification('account')" />
                            </div>
                        </div>
                        <div class="info-item" :class="{ 'verified': verifiedFields['ifsc'] }">
                            <span class="label">IFSC Code</span>
                             <div class="val-group">
                                <span class="value mono">{{ selectedVendor.bankDetails?.ifsc || 'N/A' }}</span>
                                <input type="checkbox" :checked="verifiedFields['ifsc']" @change="toggleVerification('ifsc')" />
                            </div>
                        </div>
                    </div>
                </div>
              </div>

              <!-- Verification Tab -->
              <div v-else class="tab-content verification-grid">
                 <!-- Media Preview Section -->
                <div v-if="previewUrl" class="preview-container">
                    <div class="preview-header">
                        <h3>{{ previewType === 'video' ? 'Video Verification' : 'Document Preview' }}</h3>
                        <button class="close-preview" @click="clearPreview">
                            <span class="material-icons-round">close</span>
                            Close Preview
                        </button>
                    </div>
                    <LiquidVideoPlayer v-if="previewType === 'video'" :src="previewUrl" />
                    <LiquidPdfViewer v-if="previewType === 'pdf'" :src="previewUrl" />
                </div>

                <div v-else class="artifacts-container">
                    <div class="review-section">
                        <label>Identity Proofs</label>
                        <div class="artifact-dock">
                        <!-- Document Card -->
                        <div class="artifact-card" :class="{ 'disabled': !selectedVendor.kycDocUrl, 'verified': verifiedFields['doc'] }">
                            <span class="material-icons-round icon-lg">description</span>
                            <div class="art-info">
                                <span class="art-title">Government ID</span>
                                <button 
                                    v-if="selectedVendor.kycDocUrl"
                                    class="art-action" 
                                    @click="loadPreview(selectedVendor.kycDocUrl, 'pdf')"
                                >
                                    View Document
                                </button>
                                <span v-else class="art-missing">Not uploaded</span>
                            </div>
                            <div class="art-check">
                                <input type="checkbox" :checked="verifiedFields['doc']" @change="toggleVerification('doc')" />
                            </div>
                        </div>

                        <!-- Video Card -->
                        <div class="artifact-card" :class="{ 'disabled': !selectedVendor.kycVideoUrl, 'verified': verifiedFields['video'] }">
                            <span class="material-icons-round icon-lg">videocam</span>
                            <div class="art-info">
                                <span class="art-title">Verification Video</span>
                                <button 
                                    v-if="selectedVendor.kycVideoUrl"
                                    class="art-action" 
                                    @click="loadPreview(selectedVendor.kycVideoUrl, 'video')"
                                >
                                    Play Video
                                </button>
                                <span v-else class="art-missing">Not uploaded</span>
                            </div>
                             <div class="art-check">
                                <input type="checkbox" :checked="verifiedFields['video']" @change="toggleVerification('video')" />
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>

            <footer class="modal-footer">
              <LiquidButton text="Reject Application" type="danger" variant="ghost" @click="promptReject" />
              <LiquidButton 
                text="Approve Application" 
                type="primary" 
                @click="handleApprove(selectedVendor)" 
                :disabled="!isAllVerified"
                :title="!isAllVerified ? 'Verify all details first' : 'Authorize Vendor'"
              />
            </footer>

            <!-- Rejection Modal -->
            <div v-if="showRejectionDialog" class="rejection-overlay">
                <div class="rejection-box">
                    <h3>Reject Application</h3>
                    <p>Please provide a reason for the rejection. This note will be sent to the vendor.</p>
                    <textarea 
                        v-model="rejectionNote" 
                        placeholder="e.g., ID document is blurry, Bank details do not match..."
                        rows="4"
                    ></textarea>
                    <div class="rejection-actions">
                        <button class="btn-cancel" @click="showRejectionDialog = false">Cancel</button>
                        <button class="btn-confirm-reject" @click="confirmReject">Confirm Rejection</button>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </div>
    </Transition>
  </AdminLayout>
</template>

<script setup lang="ts">
import LiquidInput from '../../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import LiquidButton from '../../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidVideoPlayer from '../../components/liquid-ui-kit/LiquidVideoPlayer/LiquidVideoPlayer.vue';
import LiquidPdfViewer from '../../components/liquid-ui-kit/LiquidPdfViewer/LiquidPdfViewer.vue';
import AdminLayout from '../components/AdminLayout.vue';
import { useVendorManagementLogic } from './VendorManagement';

const {
    loading,
    searchQuery,
    showModal,
    selectedVendor,
    previewUrl,
    previewType,
    activeTab,
    filteredVendors,
    verifiedFields,
    isAllVerified,
    showRejectionDialog,
    rejectionNote,
    getInitials,
    formatDate,
    getKYCStatusClass,
    openReviewModal,
    closeModal,
    loadPreview,
    clearPreview,
    getCategoryName,
    toggleVerification,
    handleApprove,
    promptReject,
    confirmReject
} = useVendorManagementLogic();
</script>

<style scoped src="./VendorManagement.css"></style>
<style scoped src="../Users/UserManagement.css"></style>
