<template>
  <AdminLayout>
    <div class="kyc-management-header">
      <div class="header-content">
        <h1 class="page-title">KYC<span>Verification</span></h1>
        <p class="page-subtitle">Tiered review pipeline for vendor identity and compliance artifacts.</p>
      </div>
    </div>

    <div class="kyc-viewport">
      <div v-if="loading" class="loading-state">
         <div class="skeleton-loader"></div>
      </div>
      
      <div v-else-if="requests.length > 0" class="table-container">
        <!-- Desktop Header -->
        <div class="grid-header">
          <div class="col-entity">Commercial Entity</div>
          <div class="col-uid">Identity UID</div>
          <div class="col-timestamp">Submission Cycle</div>
          <div class="col-status">Risk State</div>
          <div class="col-actions">Protocol</div>
        </div>

        <div class="grid-rows">
          <div v-for="req in requests" :key="req.id" class="data-row">
            <div class="col-entity">
              <div class="entity-card">
                <div class="entity-orb">
                  {{ req.name?.charAt(0).toUpperCase() }}
                </div>
                <div class="entity-details">
                  <span class="entity-name">{{ req.name }}</span>
                  <span class="entity-sub">Vendor Applicant</span>
                </div>
              </div>
            </div>

            <div class="col-uid">
              <span class="mono-id">{{ req.ownerId?.substring(0, 12) }}...</span>
            </div>

            <div class="col-timestamp">
              <span class="timestamp-val">{{ formatDate(req.createdAt) }}</span>
            </div>

            <div class="col-status">
              <div class="status-chip pending">
                <span class="pulse-dot"></span>
                Awaiting Review
              </div>
            </div>

            <div class="col-actions">
              <button class="action-btn-glass review" @click="openReviewModal(req)">
                <span class="material-icons-round">rule</span>
                <span class="btn-text">Review Pipeline</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <span class="material-icons-round">verified</span>
        <h3>KYC Pipeline Clear</h3>
        <p>No high-risk entities awaiting verification at this time.</p>
      </div>
    </div>

    <!-- Tiered Review Modal -->
    <Transition name="modal">
      <div v-if="showModal" class="glass-modal-overlay" @click.self="closeModal">
        <div class="glass-modal-container tall">
          <div class="modal-glow"></div>
          <div class="modal-content">
            <header class="modal-header">
              <div class="header-info">
                <h2>Compliance Assessment</h2>
                <p>Cycle ID: {{ selectedRequest?.id?.substring(0, 8) }}</p>
              </div>
              <button class="modal-close" @click="closeModal">
                <span class="material-icons-round">close</span>
              </button>
            </header>
            
            <div class="modal-body" v-if="selectedRequest">
              <div class="tiered-layout">
                <div class="review-sidebar">
                  <div class="identity-section">
                    <span class="section-label">Source Identity</span>
                    <div class="id-info">
                      <h3>{{ selectedRequest.name }}</h3>
                      <p>{{ selectedRequest.phone || 'No direct comms' }}</p>
                    </div>
                  </div>
                </div>

                <div class="artifact-viewport">
                  <span class="section-label">Identity Artifacts</span>
                  <div class="artifact-grid">
                    <div class="artifact-card" :class="{ 'missing': !selectedRequest.kycDocUrl }">
                      <div class="card-top">
                        <span class="material-icons-round">badge</span>
                        <span class="art-type">Government ID</span>
                      </div>
                      <div class="card-preview">
                        <template v-if="selectedRequest.kycDocUrl">
                          <img :src="selectedRequest.kycDocUrl" alt="ID Preview" class="preview-img" />
                          <div class="preview-overlay">
                            <a :href="selectedRequest.kycDocUrl" target="_blank" class="liquid-btn-sm">Inspect Hash</a>
                          </div>
                        </template>
                        <div v-else class="empty-artifact">
                          <span class="material-icons-round">error</span>
                          <p>Artifact Absent</p>
                        </div>
                      </div>
                    </div>

                    <div class="artifact-card" :class="{ 'missing': !selectedRequest.kycVideoUrl }">
                      <div class="card-top">
                        <span class="material-icons-round">videocam</span>
                        <span class="art-type">Liveness Probe</span>
                      </div>
                      <div class="card-preview">
                        <template v-if="selectedRequest.kycVideoUrl">
                          <div class="video-placeholder">
                             <span class="material-icons-round">play_circle</span>
                             <p>Stream Ready</p>
                          </div>
                          <div class="preview-overlay">
                            <a :href="selectedRequest.kycVideoUrl" target="_blank" class="liquid-btn-sm">Review Stream</a>
                          </div>
                        </template>
                        <div v-else class="empty-artifact">
                          <span class="material-icons-round">error</span>
                          <p>Artifact Absent</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer class="modal-footer">
              <LiquidButton text="Revoke Signal" type="danger" variant="ghost" @click="handleReject" :loading="processing" />
              <LiquidButton text="Confirm Compliance" type="primary" @click="handleApprove" :loading="processing" />
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdmin } from '../../composables/useAdmin';
import { useToast } from '../../components/liquid-ui-kit/LiquidToast/LiquidToast';
import AdminLayout from '../components/AdminLayout.vue';
import LiquidButton from '../../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';

const { fetchPendingKYCRequests, approveKYC, rejectKYC, loading } = useAdmin();
const { showToast } = useToast();

const requests = ref<any[]>([]);
const showModal = ref(false);
const selectedRequest = ref<any>(null);
const processing = ref(false);

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
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedRequest.value = null;
};

const handleApprove = async () => {
  if (!selectedRequest.value) return;
  processing.value = true;
  try {
    await approveKYC(selectedRequest.value.id);
    showToast('Store approved successfully!', 'success');
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
  processing.value = true;
  try {
    await rejectKYC(selectedRequest.value.id, 'Documents unclear'); // Hardcoded reason for now
    showToast('Store rejected.', 'info');
    closeModal();
    await loadRequests();
  } catch (e: any) {
    showToast(e.message, 'error');
  } finally {
    processing.value = false;
  }
};
</script>

<style scoped src="./KYCRequests.css"></style>
