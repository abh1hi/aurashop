<template>
  <AdminLayout>
    <div class="page-header">
      <h1>KYC Requests</h1>
    </div>

    <div class="kyc-table-container">
      <div v-if="loading" class="loading-state">
         <div class="spinner"></div>
      </div>
      
      <table v-else-if="requests.length > 0" class="kyc-table">
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Owner ID</th>
            <th>Submitted At</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="req in requests" :key="req.id">
            <td>{{ req.name }}</td>
            <td>{{ req.ownerId }}</td>
            <td>{{ formatDate(req.createdAt) }}</td>
            <td>
              <span class="status-badge pending">Pending Review</span>
            </td>
            <td>
              <button class="action-btn" @click="openReviewModal(req)">Review</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-state">
        <p>No pending KYC requests.</p>
      </div>
    </div>

    <!-- Review Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Review Application</h2>
          <button class="close-btn" @click="closeModal">
            <span class="material-icons-round">close</span>
          </button>
        </div>
        
        <div class="kyc-details" v-if="selectedRequest">
          <div class="detail-group">
            <label>Store Name</label>
            <p>{{ selectedRequest.name }}</p>
          </div>
          
          <div class="detail-group">
            <label>Phone</label>
            <p>{{ selectedRequest.phone }}</p>
          </div>

          <div class="detail-group">
            <label>Documents</label>
            <div class="document-preview" v-if="selectedRequest.kycDocUrl">
              <span class="material-icons-round">description</span>
              <a :href="selectedRequest.kycDocUrl" target="_blank">View ID Document</a>
            </div>
            <div class="document-preview" v-else>
               <span class="material-icons-round" style="color: #ef4444;">error</span>
               <span>No ID Document Uploaded</span>
            </div>

            <div class="document-preview" style="margin-top: 8px;" v-if="selectedRequest.kycVideoUrl">
              <span class="material-icons-round">videocam</span>
              <a :href="selectedRequest.kycVideoUrl" target="_blank">View Verification Video</a>
            </div>
            <div class="document-preview" style="margin-top: 8px;" v-else>
               <span class="material-icons-round" style="color: #ef4444;">error</span>
               <span>No Verification Video Uploaded</span>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <LiquidButton text="Reject" type="danger" @click="handleReject" :loading="processing" />
          <LiquidButton text="Approve" type="primary" @click="handleApprove" :loading="processing" />
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdmin } from '../../composables/useAdmin';
import { useToast } from '../../components/liquid-ui-kit/LiquidToast/LiquidToast.js';
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
