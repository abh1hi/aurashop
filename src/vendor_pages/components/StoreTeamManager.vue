<template>
  <div class="team-manager">
    <div class="header-actions mb-md">
      <LiquidButton 
        v-if="activeTab === 'recruitment'"
        text="Generate Invite" 
        icon="add_link" 
        type="primary" 
        size="sm"
        @click="handleGenerateLink"
      />
    </div>

    <LiquidTabs 
      :tabs="tabs" 
      v-model="activeTab" 
      class="mb-lg"
    />

    <!-- Active Staff Tab -->
    <section v-if="activeTab === 'staff'">
      <div v-if="loading" class="loading-state">
        <LiquidSpinner />
      </div>
      <div v-else-if="staff.length === 0" class="empty-state">
        <span class="material-icons-round">group</span>
        <h3>Solo Operation</h3>
        <p>You haven't added any team members yet.</p>
      </div>
      <div v-else class="staff-grid">
        <div v-for="member in staff" :key="member.id" class="staff-card">
          <div class="member-info">
            <div class="avatar">
              {{ member.name?.[0].toUpperCase() || member.email[0].toUpperCase() }}
            </div>
            <div class="details">
              <h3 class="name">{{ member.name || 'Unknown' }}</h3>
              <p class="role-badge">{{ member.role }}</p>
              <p class="email">{{ member.email }}</p>
            </div>
          </div>
          <div class="actions">
            <button class="icon-btn danger" @click="handleRemove(member.uid)" title="Remove Access">
              <span class="material-icons-round">person_remove</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Recruitment Tab -->
    <section v-if="activeTab === 'recruitment'">
      <div class="section-header mb-md">
          <h3 class="section-subtitle">Pending Applications</h3>
          <p class="text-secondary text-sm">Review incoming requests to join your team.</p>
      </div>

      <div v-if="loading" class="loading-state">
          <LiquidSpinner />
      </div>
      
      <div v-else-if="applications.length === 0" class="empty-state">
          <span class="material-icons-round">inbox</span>
          <h3>No Applications</h3>
          <p>Generate an invite link to start recruiting.</p>
      </div>

      <div v-else class="application-list">
          <div v-for="app in applications" :key="app.id" class="app-card">
            <div class="app-header">
              <div class="applicant-info">
                <h4>{{ app.applicantData.name }}</h4>
                <p>{{ app.applicantData.email }}</p>
                <span class="role-requested">Requested Role: {{ app.role }}</span>
              </div>
              <div class="app-date">
                {{ new Date(app.applicantData.appliedAt).toLocaleDateString() }}
              </div>
            </div>
            
            <div class="app-body">
              <div class="reason-box">
                <span class="label">Motivation:</span>
                <p>"{{ app.applicantData.bio }}"</p>
              </div>
              <div class="contact-box">
                <span class="material-icons-round">phone</span> {{ app.applicantData.phone }}
              </div>
            </div>

            <div class="app-actions">
              <LiquidButton 
                text="Reject" 
                type="ghost" 
                size="sm" 
                @click="handleReject(app.id)"
              />
              <LiquidButton 
                text="Approve" 
                type="success" 
                size="sm" 
                icon="check"
                @click="handleApprove(app.id)"
              />
            </div>
          </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import LiquidButton from '../../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidTabs from '../../components/liquid-ui-kit/LiquidTabs/LiquidTabs.vue';
import LiquidSpinner from '../../components/liquid-ui-kit/LiquidSpinner/LiquidSpinner.vue';
import { useVendor } from '../../composables/useVendor';
import { useToast } from '../../components/liquid-ui-kit/LiquidToast/LiquidToast';

const props = defineProps<{
  storeId: string;
}>();

const { 
  fetchStoreStaff, 
  removeStaff, 
  createInviteLink, 
  fetchPendingApplications, 
  approveApplication, 
  rejectApplication 
} = useVendor();
const { showToast } = useToast();

const staff = ref<any[]>([]);
const applications = ref<any[]>([]);
const loading = ref(true);
const activeTab = ref('staff');

const tabs = [
  { label: 'Active Staff', value: 'staff' },
  { label: 'Recruitment', value: 'recruitment' }
];

const loadData = async () => {
  loading.value = true;
  if (props.storeId) {
    const [staffData, appsData] = await Promise.all([
      fetchStoreStaff(props.storeId),
      fetchPendingApplications(props.storeId)
    ]);
    staff.value = staffData;
    applications.value = appsData;
  }
  loading.value = false;
};

const handleGenerateLink = async () => {
  const role = prompt("Enter role for this invite (manager/support):", "manager");
  if (!role || !['manager', 'support'].includes(role.toLowerCase())) {
     if(role) showToast('Invalid role. Use manager or support.', 'error');
     return;
  }
  
  try {
     const url = await createInviteLink(props.storeId, role.toLowerCase());
     await navigator.clipboard.writeText(url);
     showToast('Invite Link Copied to Clipboard!', 'success');
  } catch (e) {
     showToast('Failed to generate link', 'error');
  }
};

const handleRemove = async (uid: string) => {
  if(confirm("Revoke access for this user?")) {
     try {
       await removeStaff(props.storeId, uid);
       staff.value = staff.value.filter(m => m.uid !== uid);
       showToast('User removed', 'success');
     } catch(e) {
       showToast('Removal failed', 'error');
     }
  }
};

const handleApprove = async (inviteId: string) => {
   try {
     await approveApplication(inviteId);
     showToast('Staff Member Added!', 'success');
     loadData(); // Reload to update both lists
   } catch (e) {
     showToast('Approval failed', 'error');
   }
};

const handleReject = async (inviteId: string) => {
   const reason = prompt("Reason for rejection (optional):");
   try {
     await rejectApplication(inviteId, reason || 'No reason provided');
     showToast('Application Rejected', 'info');
     applications.value = applications.value.filter(a => a.id !== inviteId);
   } catch (e) {
     showToast('Rejection failed', 'error');
   }
};

onMounted(loadData);
</script>

<style scoped>
/* Copied styles from StoreTeamPage, adjusted for component context */
.header-actions {
  display: flex;
  justify-content: flex-end;
}

/* Staff Grid */
.staff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.staff-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
}

.member-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.25rem;
}

.name { font-weight: 600; margin-bottom: 2px; }
.role-badge { 
  display: inline-block;
  font-size: 0.75rem; 
  padding: 2px 8px; 
  background: rgba(var(--primary-rgb), 0.1); 
  color: var(--primary-color); 
  border-radius: 12px;
  border: 1px solid rgba(var(--primary-rgb), 0.2);
  margin-bottom: 2px;
  text-transform: capitalize;
}
.email { font-size: 0.875rem; color: var(--text-secondary); }

.icon-btn.danger {
  color: var(--error-color);
  background: rgba(var(--error-rgb), 0.1);
  border: none;
  width: 36px; height: 36px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.icon-btn.danger:hover {
  background: rgba(var(--error-rgb), 0.2);
  transform: scale(1.05);
}

/* Applications */
.loading-state, .empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
}
.empty-state .material-icons-round { font-size: 48px; opacity: 0.5; margin-bottom: var(--spacing-md); }

.application-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.app-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
}

.app-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.applicant-info h4 { font-size: 1.1rem; margin-bottom: 4px; }
.applicant-info p { color: var(--text-secondary); margin-bottom: 4px; }
.role-requested { 
  font-size: 0.8rem; font-weight: 600; color: var(--primary-color); 
  background: rgba(var(--primary-rgb), 0.1); padding: 2px 6px; border-radius: 4px;
}
.app-date { font-size: 0.8rem; color: var(--text-tertiary); }

.app-body { margin-bottom: var(--spacing-md); }
.reason-box { background: rgba(0,0,0,0.2); padding: var(--spacing-sm); border-radius: var(--radius-sm); margin-bottom: var(--spacing-sm); font-style: italic; color: var(--text-secondary); }
.label { font-size: 0.75rem; font-weight: 600; display: block; margin-bottom: 4px; color: var(--text-tertiary); normal-style: normal; }
.contact-box { display: flex; align-items: center; gap: 8px; color: var(--text-secondary); font-size: 0.9rem; }

.app-actions { display: flex; justify-content: flex-end; gap: var(--spacing-sm); }
</style>
