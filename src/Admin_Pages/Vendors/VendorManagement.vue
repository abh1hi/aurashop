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

      <!-- Search & Tools -->
      <div class="filter-bar">
         <md-outlined-text-field 
            label="Search stores..." 
            class="search-field"
            :value="searchQuery"
            @input="searchQuery = $event.target.value"
         >
           <md-icon slot="leading-icon">search</md-icon>
         </md-outlined-text-field>
         
         <div style="flex-grow: 1;"></div>
         
         <md-outlined-button @click="showTemplateModal = true">
            <md-icon slot="icon">edit_note</md-icon>
            Templates
         </md-outlined-button>
      </div>

      <!-- Filters & Sorting -->
      <div class="filter-row" style="display: flex; gap: 12px; margin-bottom: 16px; align-items: center; flex-wrap: wrap;">
          <!-- Status Chips -->
          <div class="chip-group">
              <md-filter-chip label="All" :selected="filterStatus === 'all'" @click="filterStatus = 'all'"></md-filter-chip>
              <md-filter-chip label="Pending" :selected="filterStatus === 'pending'" @click="filterStatus = 'pending'"></md-filter-chip>
              <md-filter-chip label="Approved" :selected="filterStatus === 'approved'" @click="filterStatus = 'approved'"></md-filter-chip>
              <md-filter-chip label="Rejected" :selected="filterStatus === 'rejected'" @click="filterStatus = 'rejected'"></md-filter-chip>
          </div>

          <div style="flex-grow: 1;"></div>

          <!-- Sort Select -->
           <div class="sort-control">
               <span class="body-small" style="margin-right: 8px;">Sort by:</span>
               <select class="native-select" :value="sortOrder" @change="sortOrder = ($event.target as HTMLSelectElement).value">
                   <option value="newest">Newest</option>
                   <option value="oldest">Oldest</option>
                   <option value="name">Name</option>
               </select>
           </div>
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
                <div 
                    class="col-owner desktop-only owner-cell" 
                    @click.stop="handleOwnerHover(vendor.ownerId)"
                >
                    <span class="body-medium">UID: {{ vendor.ownerId }}</span>
                    <md-icon class="info-icon">info</md-icon>

                    <!-- Owner Details Popover -->
                    <Transition name="fade">
                        <div v-if="hoveredOwner && hoveredOwner.uid === vendor.ownerId" class="owner-popover m3-surface" @click.stop>
                            <!-- Click stop propagation inside popover to prevent toggling it off when interacting with content -->
                             <div class="popover-close-btn" @click.stop="hoveredOwner = null">
                                <md-icon style="font-size: 18px;">close</md-icon>
                             </div>
                            
                            <div v-if="hoveredOwner.loading" class="popover-loading">
                                <md-circular-progress indeterminate style="--md-circular-progress-size: 24px;"></md-circular-progress>
                            </div>
                            <div v-else class="popover-content">
                                <div class="popover-header">
                                    <div class="popover-avatar">
                                        <img v-if="hoveredOwner.avatarUrl" :src="hoveredOwner.avatarUrl" />
                                        <span v-else>{{ getInitials(hoveredOwner.name) }}</span>
                                    </div>
                                    <div class="popover-titles">
                                        <span class="title-small">{{ hoveredOwner.name }}</span>
                                        <span class="body-xs secondary-text">{{ hoveredOwner.role }}</span>
                                    </div>
                                </div>
                                <div class="popover-stats">
                                    <div class="stat-item">
                                        <md-icon>store</md-icon>
                                        <span>{{ hoveredOwner.storeCount }} Stores</span>
                                    </div>
                                    <div class="stat-item">
                                        <md-icon>mail</md-icon>
                                        <span class="email-text" :title="hoveredOwner.email">{{ hoveredOwner.email }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
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
                    <md-filled-tonal-button @click.stop="openReviewModal(vendor)" style="height: 32px; font-size: 0.8rem;">
                       Review
                       <md-icon slot="icon">analytics</md-icon>
                    </md-filled-tonal-button>
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
                    
                    <!-- Business Details -->
                    <section class="section">
                       <h3 class="title-medium section-title">Business Details</h3>
                       
                       <div class="detail-row" :class="{ verified: verifiedFields['branding'] }">
                          <span class="label">Store Logo/Branding</span>
                          <span class="value" v-if="selectedVendor.logoUrl">Uploaded</span>
                          <span class="value missing" v-else>Not submitted</span>
                          <md-checkbox :checked="verifiedFields['branding']" @change="toggleVerification('branding')"></md-checkbox>
                       </div>

                       <div class="detail-row" :class="{ verified: verifiedFields['name'] }">
                          <span class="label">Store Name</span>
                          <span class="value">{{ selectedVendor.name || 'Not submitted' }}</span>
                          <md-checkbox :checked="verifiedFields['name']" @change="toggleVerification('name')"></md-checkbox>
                       </div>

                       <div class="detail-row" :class="{ verified: verifiedFields['category'] }">
                          <span class="label">Category</span>
                          <span class="value">{{ selectedVendor.category ? getCategoryName(selectedVendor.category) : 'Not submitted' }}</span>
                          <md-checkbox :checked="verifiedFields['category']" @change="toggleVerification('category')"></md-checkbox>
                       </div>

                       <div class="detail-row" :class="{ verified: verifiedFields['description'] }">
                          <span class="label">Description</span>
                          <span class="value">{{ selectedVendor.description || 'Not submitted' }}</span>
                          <md-checkbox :checked="verifiedFields['description']" @change="toggleVerification('description')"></md-checkbox>
                       </div>

                       <div class="detail-row" :class="{ verified: verifiedFields['hours'] }">
                          <span class="label">Operating Hours</span>
                          <span class="value">{{ selectedVendor.operatingHours || 'Not submitted' }}</span>
                          <md-checkbox :checked="verifiedFields['hours']" @change="toggleVerification('hours')"></md-checkbox>
                       </div>
                    </section>
                    
                    <!-- Contact Details -->
                    <section class="section">
                         <h3 class="title-medium section-title">Contact Information</h3>
                         
                         <div class="detail-row" :class="{ verified: verifiedFields['address'] }">
                             <span class="label">Business Address</span>
                             <span class="value">{{ selectedVendor.address || 'Not submitted' }}</span>
                             <md-checkbox :checked="verifiedFields['address']" @change="toggleVerification('address')"></md-checkbox>
                         </div>

                         <div class="detail-row" :class="{ verified: verifiedFields['email'] }">
                             <span class="label">Email</span>
                             <span class="value">{{ selectedVendor.email || 'Not submitted' }}</span>
                             <md-checkbox :checked="verifiedFields['email']" @change="toggleVerification('email')"></md-checkbox>
                         </div>

                         <div class="detail-row" :class="{ verified: verifiedFields['phone'] }">
                             <span class="label">Phone Number</span>
                             <span class="value">{{ selectedVendor.phone || 'Not submitted' }}</span>
                             <md-checkbox :checked="verifiedFields['phone']" @change="toggleVerification('phone')"></md-checkbox>
                         </div>
                    </section>
                    
                    <!-- Financial Details -->
                    <section class="section">
                         <h3 class="title-medium section-title">Financial Information</h3>
                         
                         <div class="detail-row" :class="{ verified: verifiedFields['bankName'] }">
                             <span class="label">Bank Name</span>
                             <span class="value">{{ selectedVendor.bankDetails?.bankName || 'Not submitted' }}</span>
                             <md-checkbox :checked="verifiedFields['bankName']" @change="toggleVerification('bankName')"></md-checkbox>
                         </div>

                         <div class="detail-row" :class="{ verified: verifiedFields['account'] }">
                             <span class="label">Account Number</span>
                             <span class="value">{{ selectedVendor.bankDetails?.account || 'Not submitted' }}</span>
                             <md-checkbox :checked="verifiedFields['account']" @change="toggleVerification('account')"></md-checkbox>
                         </div>

                         <div class="detail-row" :class="{ verified: verifiedFields['ifsc'] }">
                             <span class="label">IFSC / Routing</span>
                             <span class="value">{{ selectedVendor.bankDetails?.ifsc || 'Not submitted' }}</span>
                             <md-checkbox :checked="verifiedFields['ifsc']" @change="toggleVerification('ifsc')"></md-checkbox>
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

        <!-- Template Management Dialog -->
         <Transition name="fade">
            <div v-if="showTemplateModal" class="review-modal-overlay">
                <div class="review-modal m3-surface" style="width: 600px; height: auto; max-height: 90vh;">
                     <header class="review-header">
                        <div class="header-left">
                            <h2 class="title-large">Manage Templates</h2>
                        </div>
                        <md-icon-button @click="showTemplateModal = false"><md-icon>close</md-icon></md-icon-button>
                    </header>
                    <div class="review-body" style="padding: 0; display: flex; flex-direction: column; overflow: hidden;">
                        
                        <!-- Template Tabs -->
                        <div class="m3-tabs">
                           <button class="tab-btn" :class="{ active: activeTemplateTab === 'approval' }" @click="activeTemplateTab = 'approval'">Approval</button>
                           <button class="tab-btn" :class="{ active: activeTemplateTab === 'rejection' }" @click="activeTemplateTab = 'rejection'">Rejection</button>
                        </div>

                        <div class="tab-content" style="flex: 1; overflow-y: auto;">
                            <!-- Approval UI -->
                            <div v-if="activeTemplateTab === 'approval'">
                                <h3 class="title-medium" style="margin-bottom: 8px;">Approval Notification</h3>
                                <p class="body-small" style="margin-bottom: 16px; color: var(--md-sys-color-on-surface-variant);">
                                    This message is sent to the vendor immediately after you click "Approve". 
                                </p>
                                <md-outlined-text-field
                                    type="textarea"
                                    label="Message Body"
                                    :value="successTemplate"
                                    @input="successTemplate = $event.target.value"
                                    rows="4"
                                    style="width: 100%;"
                                ></md-outlined-text-field>
                            </div>

                            <!-- Rejection UI -->
                            <div v-else>
                                <h3 class="title-medium" style="margin-bottom: 8px;">Rejection Notification</h3>
                                <p class="body-small" style="margin-bottom: 16px; color: var(--md-sys-color-on-surface-variant);">
                                    Customize the rejection email. Use placeholders to insert dynamic details.
                                </p>

                                <div class="placeholder-chips" style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
                                    <md-assist-chip label="{{admin_note}}" @click="rejectTemplate += '{{admin_note}}'">
                                        <md-icon slot="icon">note_add</md-icon>
                                    </md-assist-chip>
                                    <md-assist-chip label="{{missing_fields}}" @click="rejectTemplate += '{{missing_fields}}'">
                                        <md-icon slot="icon">playlist_add</md-icon>
                                    </md-assist-chip>
                                </div>
                                
                                <md-outlined-text-field
                                    type="textarea"
                                    label="Message Body"
                                    :value="rejectTemplate"
                                    @input="rejectTemplate = $event.target.value"
                                    rows="10"
                                    style="width: 100%;"
                                ></md-outlined-text-field>
                            </div>
                        </div>

                    </div>
                    <div style="padding: 16px; display: flex; justify-content: flex-end; border-top: 1px solid var(--md-sys-color-outline-variant); background: var(--md-sys-color-surface);">
                         <md-text-button @click="showTemplateModal = false" style="margin-right: 8px;">Cancel</md-text-button>
                         <md-filled-button @click="saveTemplates">Save Changes</md-filled-button>
                    </div>
                </div>
            </div>
        </Transition>

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
    confirmReject,
    showTemplateModal,
    successTemplate,
    rejectTemplate,
    saveTemplates,
    activeTemplateTab,
    filterStatus,
    sortOrder,
    hoveredOwner,
    handleOwnerHover
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
    overflow: visible;
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
    cursor: default; /* Changed from pointer */
    transition: background 0.2s;
}

.list-item:hover { background: var(--md-sys-color-surface-container-low); }

/* Columns */
.col-main { flex: 2; display: flex; align-items: center; gap: 16px; }
.col-owner { flex: 1.5; position: relative; } /* Added relative positioning */
.owner-cell { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.info-icon { font-size: 18px; color: var(--md-sys-color-outline); opacity: 0.5; }
.owner-cell:hover .info-icon { opacity: 1; }

.owner-popover {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 100;
    width: 260px;
    background: var(--md-sys-color-surface-container);
    border-radius: 12px;
    border: 1px solid var(--md-sys-color-outline-variant);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    padding: 12px;
    margin-top: 8px;
    cursor: auto;
}

.popover-close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    cursor: pointer;
    color: var(--md-sys-color-on-surface-variant);
    opacity: 0.6;
}
.popover-close-btn:hover { opacity: 1; }

.popover-loading { display: flex; justify-content: center; padding: 12px; }

.popover-header { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; }
.popover-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem;
    font-weight: 500;
    overflow: hidden;
}
.popover-avatar img { width: 100%; height: 100%; object-fit: cover; }

.popover-titles { display: flex; flex-direction: column; }
.title-small { font-size: 0.875rem; font-weight: 500; color: var(--md-sys-color-on-surface); }
.body-xs { font-size: 0.75rem; }

.popover-stats { display: flex; flex-direction: column; gap: 8px; }
.stat-item { display: flex; align-items: center; gap: 8px; color: var(--md-sys-color-on-surface-variant); font-size: 0.8rem; }
.stat-item md-icon { font-size: 16px; }
.email-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }

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
.value.missing { color: var(--md-sys-color-error); font-style: italic; }

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

/* Mobile Action Bar */
.mobile-action-bar {
    padding: 16px;
    background: var(--md-sys-color-surface);
    border-top: 1px solid var(--md-sys-color-outline-variant);
    display: flex;
    gap: 12px;
    z-index: 10;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
}

/* Responsive */
.mobile-only { display: none; }
@media (max-width: 768px) {
    .desktop-only { display: none; }
    .mobile-only { display: flex; } /* Flex for action bar */
    
    .list-header { display: none; }
    .list-item { padding: 16px; }
    .col-main { flex: 1; }
    
    /* Full Screen Modal on Mobile */
    .review-modal { 
        width: 100%; 
        height: 100%; 
        max-width: 100%; 
        max-height: 100%; 
        border-radius: 0; 
    }
    
    .review-header {
        padding: 12px 16px;
    }
    
    .header-right { display: none; } /* Hide desktop actions */
    
    .review-body {
        padding-bottom: 0; /* Space handled by sticky bar */
    }
    
    .tab-content {
        padding: 16px;
        padding-bottom: 80px; /* Space for action bar context */
    }
    
    .artifact-card {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .art-icon {
        width: 100%;
        height: 120px; /* Larger preview area hint */
        margin-bottom: 12px;
    }
    
    .art-details { width: 100%; margin-bottom: 12px; }
    
    /* Make checkboxes larger/easier to hit */
    md-checkbox {
        transform: scale(1.2);
        margin-left: auto;
    }
}
/* Filters */
.chip-group {
    display: flex;
    gap: 8px;
}

.native-select {
    padding: 8px;
    border-radius: 8px;
    border: 1px solid var(--md-sys-color-outline);
    background: transparent;
    color: var(--md-sys-color-on-surface);
    font-family: inherit;
    cursor: pointer;
}

.secondary-text {
    color: var(--md-sys-color-secondary);
}
</style>
