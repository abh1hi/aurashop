<template>
  <AdminLayout>
    <div class="vendor-page">
      <!-- Header -->
      <header class="page-header">
        <div class="header-text">
          <h1 class="headline-large">Vendor Registry</h1>
          <p class="body-large subtext">Manage commercial entities and verification.</p>
        </div>
      </header>

      <!-- Search -->
      <div class="filter-bar">
         <md-outlined-text-field 
            label="Search stores..." 
            class="search-field"
            :value="searchQuery"
            @input="searchQuery = $event.target.value"
         >
           <md-icon slot="leading-icon">search</md-icon>
         </md-outlined-text-field>
      </div>

      <!-- Main List -->
      <div class="m3-card list-card">
         <div v-if="loading" class="loading-state">
           <md-circular-progress indeterminate></md-circular-progress>
         </div>

         <div v-else-if="filteredVendors.length > 0" class="list-container">
             <!-- Desktop List Headers -->
             <div class="list-header desktop-only">
               <span class="col-main">Store</span>
               <span class="col-owner">Owner</span>
               <span class="col-date">Registered</span>
               <span class="col-status">KYC Status</span>
               <span class="col-actions"></span>
             </div>

             <!-- List Items -->
             <div 
               v-for="vendor in filteredVendors" 
               :key="vendor.id" 
               class="list-item"
               @click="openReviewModal(vendor)"
             >
                <!-- Store Info -->
                <div class="col-main store-info">
                   <div class="avatar-sq">
                      {{ getInitials(vendor.name) }}
                   </div>
                   <div class="text-content">
                      <span class="title-medium">{{ vendor.name || 'Unnamed Store' }}</span>
                      <span class="body-medium mono">{{ vendor.id?.substring(0, 8) }}...</span>
                   </div>
                </div>

                <!-- Owner -->
                <div class="col-owner desktop-only">
                    <span class="body-medium">UID: {{ vendor.ownerId?.substring(0, 8) }}</span>
                </div>

                <!-- Date -->
                <div class="col-date desktop-only body-medium">
                   {{ formatDate(vendor.createdAt) }}
                </div>

                <!-- KYC Status -->
                 <div class="col-status desktop-only">
                    <div class="status-chip" :class="getKYCStatusClass(vendor.kycStatus)">
                        {{ vendor.kycStatus || 'Pending' }}
                    </div>
                 </div>

                 <!-- Actions -->
                 <div class="col-actions desktop-only">
                    <md-icon-button title="Review" @click.stop="openReviewModal(vendor)">
                       <md-icon>analytics</md-icon>
                    </md-icon-button>
                 </div>

                 <!-- Mobile Chevron -->
                 <md-icon class="mobile-only chevron">chevron_right</md-icon>
             </div>
         </div>
         
         <div v-else class="empty-state">
             <md-icon class="empty-icon">storefront_off</md-icon>
             <p class="body-large">No stores found.</p>
         </div>
      </div>

      <!-- Full Screen / Modal Review Interface -->
      <Transition name="fade">
        <div v-if="showModal && selectedVendor" class="review-modal-overlay">
           <div class="review-modal m3-surface">
              <!-- Modal Header -->
              <header class="review-header">
                 <div class="header-left">
                    <md-icon-button @click="closeModal">
                       <md-icon>close</md-icon>
                    </md-icon-button>
                    <div>
                        <h2 class="title-large">Verification Application</h2>
                        <span class="body-small">{{ selectedVendor.name }}</span>
                    </div>
                 </div>
                 <div class="header-right">
                     <md-filled-tonal-button @click="promptReject" style="--md-sys-color-primary: var(--md-sys-color-error);">Reject</md-filled-tonal-button>
                     <md-filled-button 
                         @click="handleApprove(selectedVendor)"
                         :disabled="!isAllVerified"
                     >Approve</md-filled-button>
                 </div>
              </header>

              <!-- Modal Body -->
              <div class="review-body">
                 <!-- Tabs -->
                 <div class="m3-tabs">
                    <button class="tab-btn" :class="{ active: activeTab === 'profile' }" @click="activeTab = 'profile'">Profile</button>
                    <button class="tab-btn" :class="{ active: activeTab === 'verification' }" @click="activeTab = 'verification'">Documents</button>
                 </div>

                 <!-- Profile Content -->
                 <div v-if="activeTab === 'profile'" class="tab-content profile-content">
                    <section class="section">
                       <h3 class="title-medium section-title">Business Details</h3>
                       <div class="detail-row" :class="{ verified: verifiedFields['name'] }">
                          <span class="label">Store Name</span>
                          <span class="value">{{ selectedVendor.name }}</span>
                          <md-checkbox :checked="verifiedFields['name']" @change="toggleVerification('name')"></md-checkbox>
                       </div>
                       <div class="detail-row" :class="{ verified: verifiedFields['category'] }">
                          <span class="label">Category</span>
                          <span class="value">{{ getCategoryName(selectedVendor.category) }}</span>
                          <md-checkbox :checked="verifiedFields['category']" @change="toggleVerification('category')"></md-checkbox>
                       </div>
                    </section>
                    
                    <section class="section">
                         <h3 class="title-medium section-title">Contact & Financial</h3>
                         <div class="detail-row" :class="{ verified: verifiedFields['email'] }">
                             <span class="label">Email</span>
                             <span class="value">{{ selectedVendor.email }}</span>
                             <md-checkbox :checked="verifiedFields['email']" @change="toggleVerification('email')"></md-checkbox>
                         </div>
                         <div class="detail-row" :class="{ verified: verifiedFields['account'] }">
                             <span class="label">Bank Account</span>
                             <span class="value">{{ selectedVendor.bankDetails?.account || 'N/A' }}</span>
                             <md-checkbox :checked="verifiedFields['account']" @change="toggleVerification('account')"></md-checkbox>
                         </div>
                    </section>
                 </div>

                 <!-- Artifacts Content -->
                 <div v-else class="tab-content artifacts-content">
                    <!-- Government ID -->
                    <div class="artifact-card" :class="{ verified: verifiedFields['doc'] }">
                       <div class="art-icon"><md-icon>badge</md-icon></div>
                       <div class="art-details">
                          <span class="title-medium">Government ID</span>
                          <span class="body-small" v-if="!selectedVendor.kycDocUrl">Not uploaded</span>
                          <md-text-button v-else @click="loadPreview(selectedVendor.kycDocUrl, 'pdf')">View Document</md-text-button>
                       </div>
                       <md-checkbox :checked="verifiedFields['doc']" @change="toggleVerification('doc')"></md-checkbox>
                    </div>

                    <!-- Video Probe -->
                    <div class="artifact-card" :class="{ verified: verifiedFields['video'] }">
                       <div class="art-icon"><md-icon>videocam</md-icon></div>
                       <div class="art-details">
                          <span class="title-medium">Liveness Video</span>
                          <span class="body-small" v-if="!selectedVendor.kycVideoUrl">Not uploaded</span>
                          <md-text-button v-else @click="loadPreview(selectedVendor.kycVideoUrl, 'video')">Play Video</md-text-button>
                       </div>
                        <md-checkbox :checked="verifiedFields['video']" @change="toggleVerification('video')"></md-checkbox>
                    </div>

                    <!-- Preview Area -->
                    <div v-if="previewUrl" class="preview-area">
                        <div class="preview-toolbar">
                            <span>Previewing Artifact</span>
                            <md-icon-button @click="clearPreview"><md-icon>close</md-icon></md-icon-button>
                        </div>
                        <LiquidVideoPlayer v-if="previewType === 'video'" :src="previewUrl" />
                        <LiquidPdfViewer v-if="previewType === 'pdf'" :src="previewUrl" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </Transition>
      
        <!-- Rejection Dialog (Standard M3 Dialog style overlay) -->
        <div v-if="showRejectionDialog" class="dialog-overlay">
            <div class="m3-dialog">
                <md-icon class="dialog-icon">gpp_maybe</md-icon>
                <h3 class="headline-small">Reject Application?</h3>
                <p class="body-medium">Please provide a reason. This will be sent to the vendor.</p>
                <md-outlined-text-field
                    type="textarea"
                    label="Reason for rejection"
                    :value="rejectionNote"
                    @input="rejectionNote = $event.target.value"
                    rows="3"
                    style="width: 100%; margin: 16px 0;"
                ></md-outlined-text-field>
                <div class="dialog-actions">
                    <md-text-button @click="showRejectionDialog = false">Cancel</md-text-button>
                    <md-filled-button @click="confirmReject" style="--md-sys-color-primary: var(--md-sys-color-error);">Reject</md-filled-button>
                </div>
            </div>
        </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
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
    handleReject,
    promptReject,
    confirmReject
} = useVendorManagementLogic();
</script>

<style scoped>
/* Typography */
.headline-large {
    font-family: var(--md-sys-typescale-headline-large-font);
    font-size: var(--md-sys-typescale-headline-large-size);
    font-weight: 400;
    color: var(--md-sys-color-on-background);
    margin: 0;
}

.body-large { font-size: 1rem; color: var(--md-sys-color-on-surface-variant); }
.title-large { font-size: 1.375rem; font-weight: 400; }
.title-medium { font-size: 1rem; font-weight: 500; }
.body-medium { font-size: 0.875rem; color: var(--md-sys-color-on-surface-variant); }
.body-small { font-size: 0.75rem; color: var(--md-sys-color-on-surface-variant); }
.mono { font-family: monospace; }

/* Page Layout */
.vendor-page {
    /* Padding handled by AdminLayout */
    max-width: 1200px;
    margin: 0 auto;
}

.page-header { margin-bottom: 24px; }
.filter-bar { margin-bottom: 16px; display: flex; }
.search-field { flex: 1; max-width: 400px; }

/* Main List Card */
.m3-card {
    background: var(--md-sys-color-surface);
    border-radius: 16px;
    border: 1px solid var(--md-sys-color-outline-variant);
    overflow: hidden;
}

.list-header {
    display: flex;
    padding: 16px;
    background: var(--md-sys-color-surface-container);
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    font-weight: 500;
    color: var(--md-sys-color-on-surface-variant);
}

.list-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    cursor: pointer;
    transition: background 0.2s;
}

.list-item:hover { background: var(--md-sys-color-surface-container-low); }

/* Columns */
.col-main { flex: 2; display: flex; align-items: center; gap: 16px; }
.col-owner { flex: 1.5; }
.col-date { flex: 1; }
.col-status { flex: 1; }
.col-actions { flex: 0.5; display: flex; justify-content: flex-end; }

/* Store Info */
.avatar-sq {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: var(--md-sys-color-tertiary-container);
    color: var(--md-sys-color-on-tertiary-container);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
}

.text-content { display: flex; flex-direction: column; }

/* Status Chip */
.status-chip {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 500;
    background: var(--md-sys-color-surface-variant);
    color: var(--md-sys-color-on-surface-variant);
}

.status-chip.approved { background: var(--md-sys-color-primary-container); color: var(--md-sys-color-on-primary-container); }
.status-chip.rejected { background: var(--md-sys-color-error-container); color: var(--md-sys-color-on-error-container); }

/* Modal Overlay */
.review-modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.6);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.review-modal {
    width: 90%;
    max-width: 800px;
    height: 90%;
    max-height: 800px;
    background: var(--md-sys-color-surface);
    border-radius: 28px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.review-header {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
}

.header-left { display: flex; align-items: center; gap: 12px; }
.header-right { display: flex; gap: 8px; }

.review-body { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }

/* Tabs */
.m3-tabs {
    display: flex;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
}

.tab-btn {
    flex: 1;
    padding: 16px;
    background: transparent;
    border: none;
    font-family: var(--md-sys-typescale-title-medium-font);
    font-size: 1rem;
    color: var(--md-sys-color-on-surface-variant);
    cursor: pointer;
    border-bottom: 2px solid transparent;
}

.tab-btn.active {
    color: var(--md-sys-color-primary);
    border-bottom-color: var(--md-sys-color-primary);
}

.tab-content { padding: 24px; }

/* Profile Sections */
.section { margin-bottom: 24px; }
.section-title { margin-bottom: 12px; color: var(--md-sys-color-primary); }

.detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid var(--md-sys-color-surface-variant);
    background: var(--md-sys-color-surface);
    transition: background 0.3s;
}

.detail-row.verified { background: rgba(var(--md-sys-color-primary-rgb), 0.05); }

.label { color: var(--md-sys-color-on-surface-variant); font-weight: 500; }
.value { font-weight: 500; }

/* Artifacts */
.artifact-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 12px;
    margin-bottom: 16px;
}

.art-icon {
    width: 48px; height: 48px;
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.art-details { flex: 1; display: flex; flex-direction: column; }

.preview-area {
    margin-top: 24px;
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 12px;
    overflow: hidden;
}

.preview-toolbar {
    padding: 8px 16px;
    background: var(--md-sys-color-surface-container);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Rejection Dialog */
.dialog-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 3000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.m3-dialog {
    background: var(--md-sys-color-surface-container-high);
    padding: 24px;
    border-radius: 28px;
    width: 90%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.dialog-icon { font-size: 32px; color: var(--md-sys-color-secondary); margin-bottom: 16px; }
.dialog-actions { display: flex; justify-content: flex-end; width: 100%; gap: 8px; margin-top: 16px; }

/* Responsive */
.mobile-only { display: none; }
@media (max-width: 768px) {
    .desktop-only { display: none; }
    .mobile-only { display: block; }
    .list-header { display: none; }
    .list-item { padding: 16px; }
    .col-main { flex: 1; }
    .review-modal { width: 100%; height: 100%; border-radius: 0; }
    .header-right { display: none; } /* Actions moved or stacked? Keep simple for now */
}
</style>
