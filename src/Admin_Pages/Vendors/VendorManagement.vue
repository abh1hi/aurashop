<template>
  <AdminLayout>
    <div class="page-header">
      <h1>Vendor Management</h1>
      <div class="search-bar">
        <LiquidInput 
          v-model="searchQuery" 
          placeholder="Search vendors..." 
          icon="search" 
        />
      </div>
    </div>

    <div class="vendor-table-container">
      <div v-if="loading" class="loading-state">
         <div class="spinner"></div>
      </div>
      
      <table v-else-if="filteredVendors.length > 0" class="users-table">
        <thead>
          <tr>
            <th>Owner ID</th>
            <th>Store Name</th>
            <th>Joined</th>
            <th>KYC Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vendor in filteredVendors" :key="vendor.id">
            <td>
              <div class="user-info">
                <div class="user-avatar">
                  {{ getInitials(vendor.name) }}
                </div>
                <div class="user-details">
                  <span class="user-name">{{ vendor.ownerId }}</span>
                  <span class="user-email">Owner ID</span>
                </div>
              </div>
            </td>
            <td>{{ vendor.name || '-' }}</td>
            <td>{{ formatDate(vendor.createdAt) }}</td>
            <td>
              <span class="kyc-status" :class="getKYCStatusClass(vendor.kycStatus)">
                {{ vendor.kycStatus || 'Pending' }}
              </span>
            </td>
            <td>
              <div class="kyc-actions">
                <button class="icon-btn" title="View Details" @click="openReviewModal(vendor)">
                  <span class="material-icons-round">visibility</span>
                </button>
                <button class="icon-btn approve" title="Approve" @click="handleApprove(vendor)">
                  <span class="material-icons-round">check</span>
                </button>
                <button class="icon-btn reject" title="Reject" @click="handleReject(vendor)">
                  <span class="material-icons-round">close</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-state">
        <p>No vendors found.</p>
      </div>
    </div>

    <!-- KYC Review Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Review Vendor Application</h2>
          <button class="close-btn" @click="closeModal">
            <span class="material-icons-round">close</span>
          </button>
        </div>
        
        <div class="kyc-details" v-if="selectedVendor">
          <div class="detail-group">
            <label>Vendor Name</label>
            <p>{{ selectedVendor.displayName }}</p>
          </div>
          
          <div class="detail-group">
            <label>Government ID</label>
            <div class="document-preview">
              <span class="material-icons-round">description</span>
              <a href="#" target="_blank">View Document (Mock)</a>
            </div>
          </div>

          <div class="detail-group">
            <label>Verification Video</label>
            <div class="document-preview">
              <span class="material-icons-round">videocam</span>
              <a href="#" target="_blank">View Video (Mock)</a>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <LiquidButton text="Reject" type="danger" @click="handleReject(selectedVendor)" />
          <LiquidButton text="Approve" type="primary" @click="handleApprove(selectedVendor)" />
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAdmin } from '../../composables/useAdmin';
import LiquidInput from '../../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import LiquidButton from '../../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import { useToast } from '../../components/liquid-ui-kit/LiquidToast/LiquidToast.js';
import AdminLayout from '../components/AdminLayout.vue';

const { subscribeToStores, loading } = useAdmin();
const { showToast } = useToast();

const vendors = ref<any[]>([]);
const searchQuery = ref('');
const showModal = ref(false);
const selectedVendor = ref<any>(null);
let unsubscribe: any = null;

onMounted(() => {
  loading.value = true;
  unsubscribe = subscribeToStores((stores) => {
    vendors.value = stores;
    loading.value = false;
  });
});

import { onUnmounted } from 'vue';
onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

const filteredVendors = computed(() => {
  if (!searchQuery.value) return vendors.value;
  const query = searchQuery.value.toLowerCase();
  return vendors.value.filter(v => 
    (v.email && v.email.toLowerCase().includes(query)) ||
    (v.displayName && v.displayName.toLowerCase().includes(query))
  );
});

const getInitials = (name: string) => {
  if (!name) return 'V';
  return name.charAt(0).toUpperCase();
};

const formatDate = (timestamp: any) => {
  if (!timestamp) return '-';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);
};

const getKYCStatusClass = (status: string) => {
    if (!status) return 'pending';
    return status.toLowerCase();
};

const openReviewModal = (vendor: any) => {
    selectedVendor.value = vendor;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedVendor.value = null;
};

const handleApprove = (vendor: any) => {
    showToast(`Vendor ${vendor.displayName} approved!`, 'success');
    closeModal();
    // In real app: call updateDoc to set kycStatus: 'verified'
};

const handleReject = (vendor: any) => {
    showToast(`Vendor ${vendor.displayName} rejected.`, 'info');
    closeModal();
    // In real app: call updateDoc to set kycStatus: 'rejected'
};
</script>

<style scoped src="./VendorManagement.css"></style>
<style scoped src="../Users/UserManagement.css"></style>
