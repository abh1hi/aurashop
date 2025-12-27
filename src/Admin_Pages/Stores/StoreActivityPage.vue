<template>
  <AdminLayout>
    <div class="page-header mb-xl">
        <div class="header-left">
            <LiquidButton 
                icon="west" 
                type="ghost" 
                size="sm" 
                @click="router.back()" 
                class="mb-md"
            />
            <h1 class="page-title">Store Activity Log</h1>
            <p class="page-subtitle" v-if="store">Activity stream for {{ store.name }}</p>
        </div>
    </div>

    <div v-if="loading && !store" class="loading-state">
        <LiquidSpinner />
    </div>

    <div v-else-if="store" class="content-grid">
        <!-- Main Column -->
        <div class="main-column">
            
            <!-- Staff Approvals Section -->
            <section class="activity-section mb-xl">
                <div class="section-header">
                    <h2 class="section-title">Pending Staff Approvals</h2>
                    <span class="badge" v-if="pendingApprovals.length > 0">{{ pendingApprovals.length }}</span>
                </div>

                <div v-if="loadingApprovals" class="loading-state-sm">
                    <LiquidSpinner size="sm" />
                </div>
                
                <div v-else-if="pendingApprovals.length === 0" class="empty-state-sm">
                    <span class="material-icons-round">check_circle</span>
                    <p>No pending approvals.</p>
                </div>

                <div v-else class="approval-list">
                    <div v-for="invite in pendingApprovals" :key="invite.id" class="approval-card">
                        <div class="user-info">
                            <div class="avatar-placeholder">
                                {{ invite.applicantData.name[0] }}
                            </div>
                            <div class="details">
                                <h3>{{ invite.applicantData.name }}</h3>
                                <p>{{ invite.applicantData.email }}</p>
                                <span class="role-tag">{{ invite.role }}</span>
                            </div>
                        </div>
                        <div class="actions">
                            <LiquidButton 
                                text="Finalize Approval" 
                                icon="verified" 
                                type="success" 
                                size="sm" 
                                @click="handleFinalize(invite)"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <!-- Future Activity Stream Placeholder -->
            <section class="activity-section">
                <div class="section-header">
                    <h2 class="section-title">Recent Events</h2>
                </div>
                <div class="empty-state-sm">
                    <span class="material-icons-round">history</span>
                    <p>No recent activity recorded.</p>
                </div>
            </section>

        </div>

        <!-- Side Column (Store Info) -->
        <div class="side-column">
            <div class="glass-card store-info-card">
                <div class="card-header">
                    <h3>Store Details</h3>
                </div>
                <div class="info-row">
                    <label>Status</label>
                    <span class="status-badge" :class="store.status">{{ store.status }}</span>
                </div>
                <div class="info-row">
                    <label>Owner ID</label>
                    <span class="text-mono">{{ store.ownerId?.slice(0, 8) }}...</span>
                </div>
                <div class="info-row">
                    <label>Commission</label>
                    <span>{{ store.commissionRate }}%</span>
                </div>
            </div>
        </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdminLayout from '../components/AdminLayout.vue';
import LiquidButton from '../../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidSpinner from '../../components/liquid-ui-kit/LiquidSpinner/LiquidSpinner.vue';
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
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}
.page-subtitle { color: var(--text-secondary); margin-top: 4px; }

.content-grid {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: var(--spacing-xl);
}

.section-header {
    display: flex; align-items: center; gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid rgba(255,255,255,0.05);
}

.section-title { font-size: 1.1rem; font-weight: 600; color: var(--text-primary); }

.badge {
    background: var(--brand-primary); color: white;
    padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold;
}

.approval-list {
    display: flex; flex-direction: column; gap: var(--spacing-md);
}

.approval-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    padding: var(--spacing-md);
    border-radius: var(--radius-lg);
    display: flex; justify-content: space-between; align-items: center;
}

.user-info { display: flex; align-items: center; gap: var(--spacing-md); }

.avatar-placeholder {
    width: 40px; height: 40px; border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex; align-items: center; justify-content: center;
    font-weight: bold; color: white;
}

.details h3 { font-size: 1rem; margin-bottom: 2px; }
.details p { font-size: 0.85rem; color: var(--text-secondary); }
.role-tag { 
    display: inline-block; font-size: 0.75rem; 
    background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; margin-top: 4px;
}

.store-info-card {
    padding: var(--spacing-lg);
}
.card-header { margin-bottom: var(--spacing-md); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: var(--spacing-sm); }
.info-row { display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm); font-size: 0.9rem; }
.info-row label { color: var(--text-secondary); }
.text-mono { font-family: monospace; opacity: 0.8; }

.empty-state-sm {
    text-align: center; padding: var(--spacing-lg); color: var(--text-tertiary);
    border: 1px dashed rgba(255,255,255,0.1); border-radius: var(--radius-lg);
}
.empty-state-sm .material-icons-round { font-size: 2rem; margin-bottom: 8px; opacity: 0.5; }

@media (max-width: 1024px) {
    .content-grid { grid-template-columns: 1fr; }
}
</style>
