<template>
  <AdminLayout>
    <div class="kyc-page">
      <!-- M3 Standard Header -->
      <header class="page-header">
        <div class="header-text">
          <h1 class="headline-large">Compliance Review</h1>
          <p class="body-large subtext">Verify identity and business documentation.</p>
        </div>
      </header>
      
      <!-- Stats / Overview -->
      <div class="stats-row">
          <div class="m3-card stat-card">
              <span class="label-medium">Pending Review</span>
              <span class="display-small">{{ requests.length }}</span>
          </div>
           <div class="m3-card stat-card">
              <span class="label-medium">Avg Wait Time</span>
              <span class="display-small">2.4h</span>
          </div>
      </div>

      <!-- Requests List -->
      <div class="m3-card list-card">
        <div v-if="loading" class="loading-state">
           <md-circular-progress indeterminate></md-circular-progress>
        </div>
        
        <div v-else-if="requests.length > 0" class="list-container">
           <!-- Headers -->
           <div class="list-header desktop-only">
              <span class="col-main">Applicant</span>
              <span class="col-uid">Identity ID</span>
              <span class="col-date">Submitted</span>
              <span class="col-status">Risk</span>
              <span class="col-actions"></span>
           </div>

           <!-- Rows -->
           <div v-for="req in requests" :key="req.id" class="list-item" @click="openReviewModal(req)">
              <div class="col-main user-info">
                 <div class="avatar-sq">
                    {{ req.name?.charAt(0).toUpperCase() }}
                 </div>
                 <div class="text-content">
                    <span class="title-medium">{{ req.name }}</span>
                    <span class="body-medium">Vendor Applicant</span>
                 </div>
              </div>

              <div class="col-uid desktop-only body-medium mono">
                 {{ req.ownerId?.substring(0, 12) }}...
              </div>

              <div class="col-date desktop-only body-medium">
                 {{ formatDate(req.createdAt) }}
              </div>

              <div class="col-status desktop-only">
                 <span class="status-chip pending">Needs Review</span>
              </div>

              <div class="col-actions desktop-only">
                 <md-filled-tonal-button @click.stop="openReviewModal(req)">Review</md-filled-tonal-button>
              </div>
              
              <!-- Mobile Chevron -->
              <md-icon class="mobile-only chevron">chevron_right</md-icon>
           </div>
        </div>

        <div v-else class="empty-state">
           <md-icon class="empty-icon">verified_user</md-icon>
           <p class="body-large">No pending verifications.</p>
        </div>
      </div>

      <!-- Review Dialog/Modal -->
      <Transition name="fade">
        <div v-if="showModal && selectedRequest" class="review-modal-overlay">
           <div class="review-modal m3-surface">
              <header class="review-header">
                 <div class="header-left">
                    <md-icon-button @click="closeModal"><md-icon>close</md-icon></md-icon-button>
                    <div>
                        <h2 class="title-large">Compliance Audit</h2>
                        <span class="body-small">Cycle ID: {{ selectedRequest.id?.substring(0, 8) }}</span>
                    </div>
                 </div>
                 <div class="header-right">
                     <md-filled-tonal-button @click="handleReject" style="--md-sys-color-primary: var(--md-sys-color-error);">Reject</md-filled-tonal-button>
                     <md-filled-button @click="handleApprove" :disabled="processing"> Approve & Verify</md-filled-button>
                 </div>
              </header>

              <div class="review-body">
                 <div class="split-view">
                    <!-- Left: Metadata & Checklist -->
                    <div class="review-sidebar">
                        <section class="section">
                            <h3 class="title-medium">Applicant Data</h3>
                            <div class="detail-row">
                                <span class="label">Name</span>
                                <span class="value">{{ selectedRequest.name }}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Phone</span>
                                <span class="value">{{ selectedRequest.phone || 'N/A' }}</span>
                            </div>
                        </section>

                        <section class="section rejection-panel">
                            <h3 class="title-medium error-text">Defect Analysis</h3>
                            <p class="body-small">Select reasons for rejection if applicable:</p>
                            <div class="checklist">
                                <label v-for="reason in rejectionReasonsOptions" :key="reason.id" class="checklist-item">
                                    <md-checkbox 
                                        :checked="selectedRejectionReasons.includes(reason.label)"
                                        @change="toggleRejectionReason(reason.label)"
                                    ></md-checkbox>
                                    <span>{{ reason.label }}</span>
                                </label>
                            </div>
                             <md-outlined-text-field 
                                type="textarea" 
                                label="Additional Notes" 
                                :value="customRejectionNote"
                                @input="customRejectionNote = $event.target.value"
                                rows="2"
                                style="width: 100%; margin-top: 8px;"
                            ></md-outlined-text-field>
                        </section>
                    </div>

                    <!-- Right: Artifacts -->
                    <div class="review-content">
                        <h3 class="title-medium section-title">Identity Artifacts</h3>
                        
                        <div class="artifacts-grid">
                            <!-- ID Card -->
                            <div class="artifact-card">
                                <md-icon class="art-icon">badge</md-icon>
                                <div class="art-info">
                                    <span class="title-small">Gov ID</span>
                                    <div v-if="selectedRequest.kycDocUrl">
                                        <md-text-button @click="window.open(selectedRequest.kycDocUrl)">Inspect Document</md-text-button>
                                    </div>
                                    <span v-else class="error-text">Missing</span>
                                </div>
                            </div>

                             <!-- Video -->
                            <div class="artifact-card">
                                <md-icon class="art-icon">videocam</md-icon>
                                <div class="art-info">
                                    <span class="title-small">Liveness Video</span>
                                    <div v-if="selectedRequest.kycVideoUrl">
                                        <md-text-button @click="window.open(selectedRequest.kycVideoUrl)">Review Stream</md-text-button>
                                    </div>
                                    <span v-else class="error-text">Missing</span>
                                </div>
                            </div>
                        </div>

                        <!-- Preview Frame (Placeholder for direct embedding if needed, currently using links for safety/simplicity) -->
                        <div class="preview-placeholder">
                            <md-icon>visibility</md-icon>
                            <p>Select an artifact to preview (Opens in new tab)</p>
                        </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </Transition>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdmin } from '../../composables/useAdmin';
import { useToast } from '../../components/liquid-ui-kit/LiquidToast/LiquidToast';
import AdminLayout from '../components/AdminLayout.vue';
// M3 Imports

const { fetchPendingKYCRequests, approveKYC, rejectKYC, loading } = useAdmin();
const { showToast } = useToast();

const requests = ref<any[]>([]);
const showModal = ref(false);
const selectedRequest = ref<any>(null);
const processing = ref(false);

const rejectionReasonsOptions = [
    { id: 'id_blur', label: 'ID Unreadable' },
    { id: 'id_mismatch', label: 'Name Mismatch' },
    { id: 'video_issue', label: 'Video Error' },
    { id: 'video_content', label: 'Face Not Visible' },
];
const selectedRejectionReasons = ref<string[]>([]);
const customRejectionNote = ref('');

const loadRequests = async () => {
  requests.value = await fetchPendingKYCRequests();
};

onMounted(() => {
  loadRequests();
});

const formatDate = (timestamp: any) => {
  if (!timestamp) return '-';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

const openReviewModal = (req: any) => {
  selectedRequest.value = req;
  selectedRejectionReasons.value = [];
  customRejectionNote.value = '';
  showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedRequest.value = null;
};

const toggleRejectionReason = (label: string) => {
    if (selectedRejectionReasons.value.includes(label)) {
        selectedRejectionReasons.value = selectedRejectionReasons.value.filter(r => r !== label);
    } else {
        selectedRejectionReasons.value.push(label);
    }
};

const handleApprove = async () => {
    if (!selectedRequest.value) return;
    if(!confirm('Confirm compliance and verify vendor?')) return;
    processing.value = true;
    try {
        await approveKYC(selectedRequest.value.id);
        showToast('Vendor Verified', 'success');
        closeModal();
        await loadRequests();
    } catch (e: any) {
        showToast(e.message, 'error');
    } finally {
        processing.value = false;
    }
};

const handleReject = async () => {
  if (!selectedRequest.value) return;
  
  if (selectedRejectionReasons.value.length === 0 && !customRejectionNote.value) {
      showToast('Please select a reason for rejection', 'warning');
      return;
  }

  if(!confirm('Reject application and notify vendor?')) return;

  processing.value = true;
  try {
    const finalReasons = [...selectedRejectionReasons.value];
    if (customRejectionNote.value) finalReasons.push(customRejectionNote.value);

    await rejectKYC(selectedRequest.value.id, finalReasons);
    showToast('Application Rejected', 'info');
    closeModal();
    await loadRequests();
  } catch (e: any) {
    showToast(e.message, 'error');
  } finally {
    processing.value = false;
  }
};
</script>

<style scoped>
/* Typography */
.headline-large { font-family: var(--md-sys-typescale-headline-large-font); font-size: var(--md-sys-typescale-headline-large-size); font-weight: 400; color: var(--md-sys-color-on-background); margin: 0; }
.body-large { font-size: 1rem; color: var(--md-sys-color-on-surface-variant); }
.title-large { font-size: 1.375rem; font-weight: 400; margin: 0; }
.title-medium { font-size: 1rem; font-weight: 500; }
.body-small { font-size: 0.75rem; color: var(--md-sys-color-on-surface-variant); }
.mongo { font-family: monospace; }
.error-text { color: var(--md-sys-color-error); }

/* Page Layout */
.kyc-page { /* Padding handled */ max-width: 1200px; margin: 0 auto; }
.page-header { margin-bottom: 24px; }

/* Stats Row */
.stats-row { display: flex; gap: 16px; margin-bottom: 24px; }
.stat-card { flex: 1; padding: 16px; background: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container); border-radius: 12px; display: flex; flex-direction: column; }
.display-small { font-size: 2rem; font-weight: 400; }

/* List */
.m3-card.list-card { background: var(--md-sys-color-surface); border-radius: 16px; border: 1px solid var(--md-sys-color-outline-variant); overflow: hidden; }
.list-header { display: flex; padding: 16px; background: var(--md-sys-color-surface-container); font-weight: 500; color: var(--md-sys-color-on-surface-variant); }
.list-item { display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--md-sys-color-outline-variant); cursor: pointer; transition: background 0.2s; }
.list-item:hover { background: var(--md-sys-color-surface-container-low); }

/* Columns */
.col-main { flex: 2; display: flex; align-items: center; gap: 16px; }
.col-uid { flex: 1.5; color: var(--md-sys-color-on-surface-variant); }
.col-date { flex: 1; }
.col-status { flex: 1; }
.col-actions { flex: 0.8; display: flex; justify-content: flex-end; }

.avatar-sq { width: 40px; height: 40px; background: var(--md-sys-color-tertiary-container); color: var(--md-sys-color-on-tertiary-container); display: flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: 600; }
.status-chip { background: var(--md-sys-color-error-container); color: var(--md-sys-color-on-error-container); padding: 4px 8px; border-radius: 8px; font-size: 0.75rem; font-weight: 600; }

/* Modal */
.review-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 2000; display: flex; align-items: center; justify-content: center; }
.review-modal { width: 90%; max-width: 900px; height: 85vh; background: var(--md-sys-color-surface); border-radius: 28px; display: flex; flex-direction: column; overflow: hidden; }
.review-header { padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--md-sys-color-outline-variant); }
.header-left { display: flex; align-items: center; gap: 16px; }
.header-right { display: flex; gap: 8px; }

.review-body { flex: 1; overflow: hidden; }
.split-view { display: flex; height: 100%; }

.review-sidebar { width: 300px; background: var(--md-sys-color-surface-container-low); padding: 24px; border-right: 1px solid var(--md-sys-color-outline-variant); overflow-y: auto; }
.review-content { flex: 1; padding: 24px; overflow-y: auto; background: var(--md-sys-color-surface); }

.section { margin-bottom: 24px; }
.detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--md-sys-color-outline-variant); }
.checklist { display: flex; flex-direction: column; gap: 8px; margin: 12px 0; }
.checklist-item { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; cursor: pointer; }

/* Artifacts */
.artifacts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
.artifact-card { padding: 16px; border: 1px solid var(--md-sys-color-outline-variant); border-radius: 12px; display: flex; align-items: center; gap: 12px; }
.art-icon { font-size: 32px; color: var(--md-sys-color-primary); }
.art-info { display: flex; flex-direction: column; }

.preview-placeholder { height: 200px; background: var(--md-sys-color-surface-container-high); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--md-sys-color-on-surface-variant); }
.preview-placeholder md-icon { font-size: 48px; opacity: 0.5; margin-bottom: 8px; }

/* Responsive */
.mobile-only { display: none; }
@media(max-width: 768px) {
    .desktop-only { display: none; }
    .mobile-only { display: block; }
    .list-header { display: none; }
    .split-view { flex-direction: column; }
    .review-sidebar { width: 100%; height: auto; border-right: none; border-bottom: 1px solid var(--md-sys-color-outline-variant); }
    .display-small { font-size: 1.5rem; }
}
</style>
