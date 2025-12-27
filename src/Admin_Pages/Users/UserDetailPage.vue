<template>
  <AdminLayout>
    <div class="user-detail-page">
      <!-- Header -->
      <header class="page-header">
        <div class="header-left">
           <md-icon-button @click="$router.back()">
             <md-icon>arrow_back</md-icon>
           </md-icon-button>
           <div class="header-text">
             <h1 class="headline-large">User Details</h1>
             <p class="body-large subtext" v-if="user">{{ user.displayName || user.email }}</p>
           </div>
        </div>
        <div class="header-actions">
           <md-filled-button v-if="user" @click="handleBanToggle">
             <md-icon slot="icon">{{ user.isBanned ? 'lock_open' : 'block' }}</md-icon>
             {{ user.isBanned ? 'Restore Access' : 'Suspend User' }}
           </md-filled-button>
        </div>
      </header>

      <div v-if="loading" class="loading-state">
         <md-circular-progress indeterminate></md-circular-progress>
      </div>

      <div v-else-if="user" class="content-grid">
        
        <!-- Left Column: Profile Card -->
        <div class="profile-column">
           <div class="m3-card profile-card">
              <div class="avatar-large">
                 {{ getInitials(user.displayName || user.email) }}
              </div>
              <h2 class="title-large">{{ user.displayName || 'No Name' }}</h2>
              <p class="body-medium email">{{ user.email }}</p>
              
              <div class="divider"></div>

              <div class="info-row">
                 <span class="label">User ID</span>
                 <span class="value code">{{ user.id }}</span>
              </div>
              <div class="info-row">
                 <span class="label">Phone</span>
                 <span class="value">{{ user.phoneNumber || '-' }}</span>
              </div>
              <div class="info-row">
                 <span class="label">Joined</span>
                 <span class="value">{{ formatDate(user.createdAt) }}</span>
              </div>

              <div class="divider"></div>

              <h3 class="title-medium">Roles</h3>
              <div class="roles-wrap">
                 <span v-for="role in (user.roles || ['customer'])" :key="role" :class="['role-badge', role]">
                    {{ formatRole(role) }}
                 </span>
              </div>
           </div>

           <!-- Addresses -->
           <div class="m3-card address-card">
              <h3 class="title-medium card-header">Saved Addresses</h3>
              <div v-if="user.addresses && user.addresses.length > 0" class="address-list">
                 <div v-for="addr in user.addresses" :key="addr.id" class="address-item">
                    <md-icon>place</md-icon>
                    <div class="address-text">
                       <div class="addr-label">{{ addr.label }}</div>
                       <div class="addr-lines">
                          {{ addr.addressLine }}, {{ addr.city }}, {{ addr.pincode }}
                       </div>
                    </div>
                 </div>
              </div>
              <p v-else class="empty-text">No saved addresses.</p>
           </div>
        </div>

        <!-- Right Column: Tabs (Commerce & Activity) -->
        <div class="details-column">
           <div class="m3-tab-container">
              <div class="tabs-header">
                 <div 
                   class="tab" 
                   :class="{ active: activeTab === 'commerce' }"
                   @click="activeTab = 'commerce'"
                 >
                   Commerce
                 </div>
                 <div 
                   class="tab" 
                   :class="{ active: activeTab === 'activity' }"
                   @click="activeTab = 'activity'"
                 >
                   Activity
                 </div>
                 <div 
                    class="tab" 
                    :class="{ active: activeTab === 'raw' }"
                    @click="activeTab = 'raw'"
                 >
                    Raw Data
                 </div>
              </div>

              <div class="tab-content m3-card">
                 <!-- Commerce Tab -->
                 <div v-if="activeTab === 'commerce'" class="tab-pane">
                    <section class="section">
                       <h3 class="title-medium">Active Cart ({{ user.cart?.length || 0 }})</h3>
                       <div v-if="user.cart?.length" class="data-table">
                          <div class="table-header">
                             <span>Product ID</span>
                             <span>Quantity</span>
                             <span>Added</span>
                          </div>
                          <div v-for="item in user.cart" :key="item.id" class="table-row">
                             <span class="code">{{ item.productId }}</span>
                             <span>{{ item.quantity }}</span>
                             <span>{{ formatDate(item.addedAt) }}</span>
                          </div>
                       </div>
                       <p v-else class="empty-text">Cart is empty.</p>
                    </section>

                    <div class="divider"></div>

                    <section class="section">
                       <h3 class="title-medium">Wishlist ({{ user.wishlist?.length || 0 }})</h3>
                       <div v-if="user.wishlist?.length" class="wrap-list">
                          <span v-for="item in user.wishlist" :key="item.id" class="chip">
                             {{ item.productId }}
                          </span>
                       </div>
                       <p v-else class="empty-text">Wishlist is empty.</p>
                    </section>
                 </div>

                 <!-- Activity Tab -->
                 <div v-if="activeTab === 'activity'" class="tab-pane">
                    <h3 class="title-medium">Tracking Sessions</h3>
                    <p class="body-small subtext">Active browser sessions and cookies.</p>
                    
                    <div v-if="user.trackingSessions?.length" class="data-table">
                       <div class="table-header">
                          <span>Session ID</span>
                          <span>Device/UA</span>
                          <span>Last Active</span>
                       </div>
                       <div v-for="session in user.trackingSessions" :key="session.id" class="table-row">
                          <span class="code compact">{{ session.id.substring(0,8) }}...</span>
                          <span class="truncate" :title="session.userAgent">{{ session.userAgent || 'Unknown' }}</span>
                          <span>{{ formatDate(session.lastActive) }}</span>
                       </div>
                    </div>
                    <p v-else class="empty-text">No active tracking sessions found.</p>
                 </div>

                 <!-- Raw Data Tab -->
                 <div v-if="activeTab === 'raw'" class="tab-pane">
                    <pre class="json-dump">{{ JSON.stringify(user, null, 2) }}</pre>
                 </div>
              </div>
           </div>
        </div>

      </div>
      
      <div v-else class="error-state">
         <md-icon>error</md-icon>
         <p>User not found.</p>
         <p v-if="error" class="error-detail">Error: {{ error }}</p>
         <p class="debug-info">User ID: {{ $route.params.id }}</p>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AdminLayout from '../components/AdminLayout.vue';
import { useAdmin } from '../../composables/useAdmin';
import { useToast } from '../../components/liquid-ui-kit/LiquidToast/LiquidToast';

const route = useRoute();
const { fetchUserDetails, toggleUserBan, loading, error } = useAdmin();
const { showToast } = useToast();

const user = ref<any>(null);
const activeTab = ref('commerce');

onMounted(async () => {
    const uid = route.params.id as string;
    console.log('UserDetailPage mounted. ID:', uid);
    if (uid) {
        try {
            user.value = await fetchUserDetails(uid);
            console.log('User Details Fetched:', user.value);
        } catch (e: any) {
            console.error('Fetch failed', e);
        }
    }
});

const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
};

const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        if (isNaN(date.getTime())) return '-';
        return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
    } catch { return '-'; }
};

const formatRole = (role: string) => role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const handleBanToggle = async () => {
  if (!user.value) return;
  const action = user.value.isBanned ? 'unban' : 'ban';
  if (!confirm(`Are you sure you want to ${action} this user?`)) return;

  try {
    await toggleUserBan(user.value.id, !user.value.isBanned);
    user.value.isBanned = !user.value.isBanned;
    showToast(`User ${action}ned successfully`, 'success');
  } catch (e: any) {
    showToast(`Failed to ${action}: ${e.message}`, 'error');
  }
};
</script>

<style scoped>
.user-detail-page {
    max-width: 1200px;
    margin: 0 auto;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.headline-large {
    font-family: var(--md-sys-typescale-headline-large-font);
    font-size: 32px;
    margin: 0;
    line-height: 1.2;
}

.subtext {
    color: var(--md-sys-color-on-surface-variant);
    margin: 0;
}

.content-grid {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 24px;
    align-items: start;
}

@media (max-width: 900px) {
    .content-grid { grid-template-columns: 1fr; }
}

/* Cards */
.m3-card {
    background: var(--md-sys-color-surface);
    border-radius: 16px;
    border: 1px solid var(--md-sys-color-outline-variant);
    padding: 24px;
    overflow: hidden;
}

/* Profile Card */
.profile-card {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.avatar-large {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 500;
    margin-bottom: 16px;
}

.email {
    color: var(--md-sys-color-on-surface-variant);
    margin-top: 4px;
}

.divider {
    width: 100%;
    height: 1px;
    background: var(--md-sys-color-outline-variant);
    margin: 16px 0;
}

.info-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 0.9rem;
}

.label { color: var(--md-sys-color-on-surface-variant); }
.value { font-weight: 500; }
.value.code { font-family: monospace; font-size: 0.8rem; background: var(--md-sys-color-surface-container); padding: 2px 4px; border-radius: 4px; }

.roles-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-top: 8px;
}

/* Address Card */
.address-card { margin-top: 24px; }
.card-header { margin-top: 0; margin-bottom: 16px; }

.address-item {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
}
.address-item:last-child { border-bottom: none; }
.addr-label { font-weight: 500; }
.addr-lines { font-size: 0.9rem; color: var(--md-sys-color-on-surface-variant); }

/* Tabs */
.m3-tab-container {
    display: flex;
    flex-direction: column;
}

.tabs-header {
    display: flex;
    gap: 4px;
    margin-bottom: 0; /* Tabs sit on card */
}

.tab {
    padding: 12px 24px;
    border-radius: 12px 12px 0 0;
    background: var(--md-sys-color-surface-container-low);
    color: var(--md-sys-color-on-surface-variant);
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s;
}

.tab.active {
    background: var(--md-sys-color-surface);
    border: 1px solid var(--md-sys-color-outline-variant);
    border-bottom: 1px solid var(--md-sys-color-surface); /* Merge */
    color: var(--md-sys-color-primary);
    position: relative;
    top: 1px;
    z-index: 2;
}

.tab-content.m3-card {
    border-top-left-radius: 0; 
    /* If first tab is active, we might want to un-round. 
       For simplicity, standard card is fine. 
    */
    min-height: 400px;
}

/* Data Tables inside Tabs */
.data-table {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 16px;
}

.table-header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    font-weight: 500;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--md-sys-color-outline-variant);
    color: var(--md-sys-color-on-surface-variant);
}

.table-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 12px 0;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    font-size: 0.9rem;
}

.truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 90%;
}

.wrap-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.chip {
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.85rem;
}

/* Role Badges (reused) */
.role-badge { padding: 4px 8px; border-radius: 8px; font-size: 0.75rem; background: var(--md-sys-color-surface-container-high); }
.role-badge.admin { background: var(--md-sys-color-tertiary-container); color: var(--md-sys-color-on-tertiary-container); }
.role-badge.vendor { background: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container); }
.role-badge.customer { background: var(--md-sys-color-surface-variant); color: var(--md-sys-color-on-surface-variant); }

.json-dump {
    background: #1a1a1a;
    color: #0f0;
    padding: 16px;
    border-radius: 8px;
    overflow: auto;
    font-size: 0.8rem;
    max-height: 500px;
}
</style>
