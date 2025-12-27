<template>
  <AdminLayout>
    <div class="notification-history-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Notification History & Drafts</h1>
          <p class="page-subtitle">View past notifications or manage your saved drafts.</p>
        </div>
        <div class="header-actions">
           <md-outlined-button @click="router.back()">
             <md-icon slot="icon">arrow_back</md-icon>
             Back to Compose
           </md-outlined-button>
        </div>
      </div>

      <div class="content-card m3-card">
          <!-- Search & Filters -->
          <div class="filters-bar">
              <div class="search-input-group">
                  <md-icon class="search-icon">search</md-icon>
                  <input 
                    type="text" 
                    v-model="searchEmail" 
                    placeholder="Search by sender email..." 
                    @keyup.enter="applyFilters"
                  />
              </div>
              <div class="date-input-group">
                  <input 
                    type="date" 
                    v-model="searchDate" 
                    @change="applyFilters"
                  />
              </div>
              <md-text-button @click="applyFilters" :disabled="loading">
                  Filter
              </md-text-button>
              <md-text-button @click="clearFilters" v-if="searchEmail || searchDate" class="clear-btn">
                  Clear
              </md-text-button>
          </div>

          <div class="tabs">
              <div 
                class="tab" 
                :class="{ active: activeTab === 'drafts' }"
                @click="activeTab = 'drafts'"
              >
                Saved Drafts
              </div>
              <div 
                class="tab" 
                :class="{ active: activeTab === 'history' }"
                @click="activeTab = 'history'"
              >
                Sent History
              </div>
          </div>

          <div class="list-container">
              <div v-if="loading" class="loading-state">
                  <md-circular-progress indeterminate></md-circular-progress>
              </div>

              <!-- Drafts List -->
              <div v-else-if="activeTab === 'drafts'">
                  <div v-if="savedDrafts.length === 0" class="empty-state">No drafts found.</div>
                  <div v-for="draft in savedDrafts" :key="draft.id" class="list-item">
                      <div class="item-content">
                          <span class="item-title">{{ draft.title || '(No Title)' }}</span>
                          <span class="item-meta">Saved: {{ formatDate(draft.updatedAt) }}</span>
                          <span class="item-preview">{{ draft.message?.substring(0, 80) }}...</span>
                      </div>
                      <div class="item-actions">
                          <md-filled-tonal-button @click="useTemplate(draft)">
                              <md-icon slot="icon">edit</md-icon>
                              Edit/Send
                          </md-filled-tonal-button>
                          <md-icon-button @click.stop="handleDeleteDraft(draft.id)" class="delete-btn">
                              <md-icon>delete</md-icon>
                          </md-icon-button>
                      </div>
                  </div>
              </div>

              <!-- History List -->
              <div v-else-if="activeTab === 'history'">
                   <div v-if="historyLogs.length === 0" class="empty-state">No history found.</div>
                   <div v-for="log in historyLogs" :key="log.id" class="list-item">
                      <div class="item-content">
                          <div class="title-row">
                              <span class="item-title">{{ log.title }}</span>
                              <div class="badges">
                                  <span class="badge" :class="log.type">{{ log.type }}</span>
                                  <span class="badge target">{{ log.targetGroup }}</span>
                              </div>
                          </div>
                          <span class="item-meta">Sent: {{ formatDate(log.sentAt) }} • By: {{ log.sentBy }}</span>
                          <span class="item-preview">{{ log.message?.substring(0, 80) }}...</span>
                      </div>
                      <div class="item-actions">
                          <md-outlined-button @click="useTemplate(log)">
                              <md-icon slot="icon">content_copy</md-icon>
                              Reuse
                          </md-outlined-button>
                      </div>
                   </div>
              </div>
          </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '../components/AdminLayout.vue';
import { useAdmin } from '../../composables/useAdmin';
import { useToast } from '../../components/liquid-ui-kit/LiquidToast/LiquidToast';

const router = useRouter();
const { fetchDrafts, fetchNotificationLogs, deleteDraft } = useAdmin();
const { showToast } = useToast();

const activeTab = ref<'drafts' | 'history'>('drafts');
const savedDrafts = ref<any[]>([]);
const historyLogs = ref<any[]>([]);
const loading = ref(true);

// Filters
const searchEmail = ref('');
const searchDate = ref('');

onMounted(async () => {
    await refreshLists();
});

const refreshLists = async () => {
    loading.value = true;
    try {
        // Prepare filters
        const filters: any = {};
        if (searchEmail.value) filters.email = searchEmail.value;
        if (searchDate.value) filters.date = searchDate.value;

        // Fetch concurrently only if tabs require it, or just fetch both? 
        // Fetching both is fine for now, or optimize to fetch only active tab data.
        // Let's stick to existing pattern but pass filters only to logs.
        
        const [drafts, logs] = await Promise.all([
            fetchDrafts(filters), 
            fetchNotificationLogs(filters)
        ]);
        savedDrafts.value = drafts;
        historyLogs.value = logs;
    } catch (e) {
        console.error('Failed to load lists', e);
        showToast('Failed to load data', 'error');
    } finally {
        loading.value = false;
    }
};

const applyFilters = () => {
    refreshLists();
};

const clearFilters = () => {
    searchEmail.value = '';
    searchDate.value = '';
    refreshLists();
};

const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    // Firestore Timestamp check
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const handleDeleteDraft = async (id: string) => {
    if (!confirm('Permanently delete this draft?')) return;
    try {
        await deleteDraft(id);
        await refreshLists();
        showToast('Draft deleted', 'success');
    } catch (e) {
        showToast('Failed to delete draft', 'error');
    }
};

const useTemplate = (item: any) => {
    // Navigate back to NotificationCenter with data in state
    router.push({
        name: 'NotificationCenter',
        state: { templateData: JSON.parse(JSON.stringify(item)) } // Deep copy to avoid reference issues
    });
};
</script>

<style scoped>
.notification-history-page {
    margin: 0 auto;
    width: 100%;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.page-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--md-sys-color-on-background);
}

.page-subtitle {
    color: var(--md-sys-color-on-surface-variant);
}

.m3-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    padding: 0; /* Flush for tabs */
    overflow: hidden;
    backdrop-filter: blur(20px);
    min-height: 500px;
    display: flex;
    flex-direction: column;
}

.tabs {
    display: flex;
    background: rgba(0,0,0,0.2);
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
}

.filters-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    background: rgba(255, 255, 255, 0.02);
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
}

.search-input-group, .date-input-group {
    display: flex;
    align-items: center;
    background: var(--md-sys-color-surface-container-high);
    border-radius: 8px;
    padding: 0 12px;
    height: 40px;
    border: 1px solid transparent;
    transition: border-color 0.2s;
}

.search-input-group:focus-within, .date-input-group:focus-within {
    border-color: var(--md-sys-color-primary);
}

.search-icon {
    font-size: 20px;
    color: var(--md-sys-color-on-surface-variant);
    margin-right: 8px;
}

.search-input-group input, .date-input-group input {
    background: transparent;
    border: none;
    color: var(--md-sys-color-on-surface);
    font-size: 0.9rem;
    outline: none;
    width: 200px;
}
.date-input-group input {
    color: var(--md-sys-color-on-surface); /* Ensure date text is visible */
    font-family: inherit;
}

.clear-btn {
    --md-text-button-label-text-color: var(--md-sys-color-error);
}

.tab {
    flex: 1;
    text-align: center;
    padding: 20px;
    cursor: pointer;
    font-weight: 500;
    color: var(--md-sys-color-on-surface-variant);
    transition: all 0.2s;
    border-bottom: 3px solid transparent;
}

.tab:hover {
    background: rgba(255,255,255,0.05);
}

.tab.active {
    color: var(--md-sys-color-primary);
    border-bottom-color: var(--md-sys-color-primary);
    background: rgba(var(--md-sys-color-primary-rgb), 0.05);
}

.list-container {
    padding: 24px;
    flex: 1;
    overflow-y: auto;
}

.loading-state, .empty-state {
    text-align: center;
    padding: 48px;
    color: var(--md-sys-color-outline);
}

.list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    transition: background 0.2s;
    border-radius: 12px;
    margin-bottom: 8px;
    background: rgba(255, 255, 255, 0.02);
}

.list-item:hover {
    background: var(--md-sys-color-surface-variant);
    border-color: transparent;
}

.item-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-right: 24px;
}

.title-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.item-title {
    font-weight: 600;
    font-size: 1.1rem;
    color: var(--md-sys-color-on-surface);
}

.item-meta {
    font-size: 0.8rem;
    color: var(--md-sys-color-on-surface-variant);
}

.item-preview {
    font-size: 0.9rem;
    color: var(--md-sys-color-outline);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.item-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.badges {
    display: flex;
    gap: 8px;
}

.badge {
    font-size: 0.7rem;
    padding: 2px 8px;
    border-radius: 4px;
    background: var(--md-sys-color-surface-container-high);
    text-transform: uppercase;
    font-weight: 600;
}
.badge.target { background: #333; color: #fff; }
.badge.info { color: var(--md-sys-color-secondary); }
.badge.success { color: #10b981; }
.badge.warning { color: orange; }
.badge.error { color: var(--md-sys-color-error); }

.delete-btn {
    --md-icon-button-icon-color: var(--md-sys-color-error);
}
</style>
