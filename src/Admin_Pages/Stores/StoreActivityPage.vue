<template>
  <AdminLayout>
    <div class="activity-page">
      <!-- M3 Standard Header -->
      <header class="page-header">
         <div class="header-nav">
            <md-icon-button @click="router.back()">
                <md-icon>arrow_back</md-icon>
            </md-icon-button>
            <div class="header-text">
                <h1 class="headline-large">Store Activity</h1>
                <p class="body-large subtext" v-if="store">Log for {{ store.name }}</p>
            </div>
         </div>
      </header>

      <div v-if="loading && !store" class="loading-state">
         <md-circular-progress indeterminate></md-circular-progress>
      </div>

      <div v-else-if="store" class="content-grid">
         <!-- Main Content -->
         <div class="main-column">
            
            <!-- Pending Approvals -->
            <section class="m3-card section-card">
               <div class="card-header">
                  <div class="title-wrap">
                      <h2 class="title-large">Pending Staff Approvals</h2>
                      <span class="badge-count" v-if="pendingApprovals.length > 0">{{ pendingApprovals.length }}</span>
                  </div>
               </div>

               <div v-if="loadingApprovals" class="loading-state-sm">
                   <md-circular-progress indeterminate size="small"></md-circular-progress>
               </div>

               <div v-else-if="pendingApprovals.length === 0" class="empty-state-sm">
                   <md-icon>check_circle_outline</md-icon>
                   <p class="body-medium">No pending approvals.</p>
               </div>

               <div v-else class="approval-list">
                   <div v-for="invite in pendingApprovals" :key="invite.id" class="approval-item">
                       <div class="user-info">
                           <div class="avatar-circle">
                               {{ invite.applicantData.name[0] }}
                           </div>
                           <div class="text-content">
                               <span class="title-medium">{{ invite.applicantData.name }}</span>
                               <span class="body-small">{{ invite.applicantData.email }}</span>
                               <span class="role-chip">{{ invite.role }}</span>
                           </div>
                       </div>
                       <div class="actions">
                           <md-filled-tonal-button @click="handleFinalize(invite)">
                               <md-icon slot="icon">verified</md-icon>
                               Approve
                           </md-filled-tonal-button>
                       </div>
                   </div>
               </div>
            </section>

            <!-- Activity Stream -->
            <section class="m3-card section-card">
                <div class="card-header">
                    <h2 class="title-large">Recent Events</h2>
                </div>
                <div class="empty-state-sm">
                    <md-icon>history</md-icon>
                    <p class="body-medium">No recent activity recorded.</p>
                </div>
            </section>
         </div>

         <!-- Side Column -->
         <aside class="side-column">
             <div class="m3-card info-card">
                 <h3 class="title-medium card-title">Store Details</h3>
                 
                 <div class="detail-row">
                     <span class="label">Status</span>
                     <span class="status-badge" :class="store.status">{{ store.status }}</span>
                 </div>
                 <div class="detail-row">
                     <span class="label">Owner UID</span>
                     <span class="value mono">{{ store.ownerId?.slice(0, 8) }}...</span>
                 </div>
                 <div class="detail-row">
                     <span class="label">Commission</span>
                     <span class="value">{{ store.commissionRate }}%</span>
                 </div>
             </div>
         </aside>

      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdminLayout from '../components/AdminLayout.vue';
import { useAdmin } from '../../composables/useAdmin';
import { useToast } from '../../components/liquid-ui-kit/LiquidToast/LiquidToast';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const route = useRoute();
const router = useRouter();
const { fetchPendingStaffApprovals, finalizeStaffApproval } = useAdmin();
const { showToast } = useToast();

const store = ref<any>(null);
const pendingApprovals = ref<any[]>([]);
const loading = ref(true);
const loadingApprovals = ref(false);

const loadStore = async () => {
    const storeId = route.params.id as string;
    try {
        const docRef = doc(db, 'stores', storeId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
            store.value = { id: snap.id, ...snap.data() };
        }
    } catch (e) {
        console.error("Error loading store", e);
    }
};

const loadApprovals = async () => {
    loadingApprovals.value = true;
    const storeId = route.params.id as string;
    if (storeId) {
        pendingApprovals.value = await fetchPendingStaffApprovals(storeId);
    }
    loadingApprovals.value = false;
};

const handleFinalize = async (invite: any) => {
    if(!confirm(`Approve ${invite.applicantData.name} as ${invite.role}? This will grant them staff access.`)) return;

    try {
        await finalizeStaffApproval(invite.id);
        showToast('Staff Access Granted', 'success');
        pendingApprovals.value = pendingApprovals.value.filter(i => i.id !== invite.id);
    } catch (e) {
        showToast('Approval Failed', 'error');
    }
};

onMounted(async () => {
    await loadStore();
    await loadApprovals();
    loading.value = false;
});
</script>

<style scoped>
/* Page Layout */
.activity-page { padding: 16px; max-width: 1200px; margin: 0 auto; }

.page-header { margin-bottom: 24px; }
.header-nav { display: flex; align-items: center; gap: 16px; }

.headline-large {
    font-family: var(--md-sys-typescale-headline-large-font);
    font-size: var(--md-sys-typescale-headline-large-size);
    font-weight: 400;
    color: var(--md-sys-color-on-background);
    margin: 0;
}

.body-large { font-size: 1rem; color: var(--md-sys-color-on-surface-variant); }

/* Content Grid */
.content-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
}

@media(min-width: 1024px) {
    .content-grid { grid-template-columns: 1fr 300px; }
}

/* Card Styles */
.m3-card {
    background: var(--md-sys-color-surface);
    border-radius: 16px;
    border: 1px solid var(--md-sys-color-outline-variant);
    overflow: hidden;
    padding: 24px;
    margin-bottom: 24px;
}

.card-header { margin-bottom: 16px; border-bottom: 1px solid var(--md-sys-color-outline-variant); padding-bottom: 16px; }
.title-large { font-size: 1.375rem; font-weight: 400; margin: 0; color: var(--md-sys-color-on-surface); }
.title-wrap { display: flex; align-items: center; gap: 12px; }
.badge-count { background: var(--md-sys-color-error); color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; }

/* Approval List */
.approval-list { display: flex; flex-direction: column; gap: 16px; }
.approval-item {
    display: flex; justify-content: space-between; align-items: center;
    padding: 16px;
    background: var(--md-sys-color-surface-container);
    border-radius: 12px;
}

.user-info { display: flex; align-items: center; gap: 16px; }
.avatar-circle {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);
    display: flex; align-items: center; justify-content: center;
    font-weight: 500;
}

.text-content { display: flex; flex-direction: column; }
.title-medium { font-size: 1rem; font-weight: 500; }
.role-chip { 
    display: inline-block; font-size: 0.75rem; 
    background: var(--md-sys-color-surface-variant); 
    padding: 2px 6px; border-radius: 4px; margin-top: 4px;
    width: fit-content;
}

/* Side Column */
.info-card .card-title { margin-bottom: 16px; color: var(--md-sys-color-primary); }
.detail-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.9rem; }
.detail-row .label { color: var(--md-sys-color-on-surface-variant); }
.mono { font-family: monospace; }
.status-badge { font-weight: 500; text-transform: capitalize; }
.status-badge.active { color: var(--md-sys-color-primary); }

/* Empty States */
.empty-state-sm {
    text-align: center; padding: 32px; color: var(--md-sys-color-on-surface-variant);
    background: var(--md-sys-color-surface-container-low);
    border-radius: 12px;
}
.empty-state-sm md-icon { font-size: 32px; margin-bottom: 8px; opacity: 0.5; }
</style>
