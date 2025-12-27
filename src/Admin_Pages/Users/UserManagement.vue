<template>
  <AdminLayout>
    <div class="user-page">
      <!-- M3 Standard Header -->
      <header class="page-header">
        <div class="header-text">
          <h1 class="headline-large">User Directory</h1>
          <p class="body-large subtext">Manage system access and user roles.</p>
        </div>
      </header>

      <!-- Search & Filters -->
      <div class="filter-bar">
         <md-outlined-text-field 
            label="Search users..." 
            class="search-field"
            :value="searchQuery"
            @input="searchQuery = $event.target.value"
         >
           <md-icon slot="leading-icon">search</md-icon>
         </md-outlined-text-field>

         <div class="filter-actions">
           <!-- Placeholder for future filters -->
<!--           <md-filter-chip label="Admin"></md-filter-chip>-->
<!--           <md-filter-chip label="Vendor"></md-filter-chip>-->
         </div>
      </div>

      <!-- User List (M3 List Pattern) -->
      <div class="user-list-card m3-card">
        <div v-if="loading" class="loading-state">
           <md-circular-progress indeterminate></md-circular-progress>
        </div>
        
        <div v-else-if="filteredUsers.length > 0" class="list-container">
           <!-- Header Row (Desktop) -->
           <div class="list-header desktop-only">
              <span class="col-main">User</span>
              <span class="col-role">Roles</span>
              <span class="col-date">Joined</span>
              <span class="col-status">Status</span>
              <span class="col-actions"></span>
           </div>

           <!-- List Items -->
           <div 
             v-for="user in filteredUsers" 
             :key="user.id" 
             class="list-item"
             @click="openMobileActionSheet(user)"
           >
              <!-- User Info -->
              <div class="col-main user-info">
                 <div class="avatar">
                    {{ getInitials(user.displayName || user.email) }}
                 </div>
                 <div class="text-content">
                    <span class="title-medium">{{ user.displayName || 'Anonymous' }}</span>
                    <span class="body-medium">{{ user.email }}</span>
                 </div>
              </div>

              <!-- Roles (Desktop) -->
              <div class="col-role desktop-only">
                 <div v-if="user.isAdmin" class="role-badge admin">Admin</div>
                 <div v-if="user.isVendor" class="role-badge vendor">Vendor</div>
                 <div v-if="!user.isAdmin && !user.isVendor" class="role-badge customer">Customer</div>
              </div>

              <!-- Date (Desktop) -->
              <div class="col-date desktop-only body-medium">
                 {{ formatDate(user.createdAt) }}
              </div>

               <!-- Status (Desktop) -->
              <div class="col-status desktop-only">
                 <span v-if="user.isBanned" class="status-indicator banned">Suspended</span>
                 <span v-else class="status-indicator active">Active</span>
              </div>

              <!-- Actions (Desktop) -->
              <div class="col-actions desktop-only">
                  <md-icon-button @click.stop="handleBanToggle(user)">
                      <md-icon>{{ user.isBanned ? 'lock_open' : 'block' }}</md-icon>
                  </md-icon-button>
              </div>
              
              <!-- Mobile Chevron -->
              <md-icon class="mobile-only chevron">chevron_right</md-icon>
           </div>
        </div>

        <div v-else class="empty-state">
           <md-icon class="empty-icon">person_off</md-icon>
           <p class="body-large">No users found.</p>
        </div>
      </div>
      
      <!-- Mobile Action Sheet Overlay -->
      <Transition name="slide-up">
        <div v-if="showActionSheet && selectedUser" class="mobile-action-sheet-overlay" @click="closeActionSheet">
           <div class="action-sheet" @click.stop>
               <div class="sheet-handle"></div>
               <div class="sheet-header">
                  <h3 class="title-large">{{ selectedUser.displayName || 'User Actions' }}</h3>
                  <p class="body-medium">{{ selectedUser.email }}</p>
               </div>
               <div class="sheet-actions">
                  <md-list-item type="button" @click="handleBanToggle(selectedUser)">
                     <md-icon slot="start">{{ selectedUser.isBanned ? 'lock_open' : 'block' }}</md-icon>
                     <div slot="headline">{{ selectedUser.isBanned ? 'Restore Access' : 'Suspend User' }}</div>
                  </md-list-item>
                   <md-list-item type="button" disabled>
                     <md-icon slot="start">edit</md-icon>
                     <div slot="headline">Edit Roles (Coming Soon)</div>
                  </md-list-item>
               </div>
           </div>
        </div>
      </Transition>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAdmin } from '../../composables/useAdmin';
import { useToast } from '../../components/liquid-ui-kit/LiquidToast/LiquidToast';
import AdminLayout from '../components/AdminLayout.vue';
// M3 Imports handled by plugins/material-web.ts

const { fetchUsers, toggleUserBan, loading } = useAdmin();
const { showToast } = useToast();

const users = ref<any[]>([]);
const searchQuery = ref('');
const showActionSheet = ref(false);
const selectedUser = ref<any>(null);

onMounted(async () => {
  users.value = await fetchUsers();
});

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(u => 
    (u.email && u.email.toLowerCase().includes(query)) ||
    (u.displayName && u.displayName.toLowerCase().includes(query))
  );
});

const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
};

const formatDate = (timestamp: any) => {
  if (!timestamp) return '-';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);
};

// Mobile Actions
const openMobileActionSheet = (user: any) => {
    if (window.innerWidth <= 768) {
        selectedUser.value = user;
        showActionSheet.value = true;
    }
};

const closeActionSheet = () => {
    showActionSheet.value = false;
    setTimeout(() => selectedUser.value = null, 300);
};

const handleBanToggle = async (user: any) => {
  const action = user.isBanned ? 'unban' : 'ban';
  if (!confirm(`Are you sure you want to ${action} this user?`)) return;

  try {
    await toggleUserBan(user.id, !user.isBanned);
    user.isBanned = !user.isBanned;
    showToast(`User ${action}ned successfully`, 'success');
    closeActionSheet();
  } catch (e: any) {
    showToast(`Failed to ${action} user: ${e.message}`, 'error');
  }
};
</script>

<style scoped>
/* Page Layout */
.user-page {
    /* Padding handled by AdminLayout */
    max-width: 1200px;
    margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

/* Typography Tokens */
.headline-large {
    font-family: var(--md-sys-typescale-headline-large-font);
    font-size: var(--md-sys-typescale-headline-large-size);
    font-weight: 400;
    color: var(--md-sys-color-on-background);
    margin: 0;
}

.body-large {
  font-family: var(--md-sys-typescale-body-large-font);
  font-size: var(--md-sys-typescale-body-large-size);
  color: var(--md-sys-color-on-surface-variant);
}

/* Filter Bar */
.filter-bar {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    align-items: center;
}

.search-field {
    flex: 1;
    max-width: 400px;
}

/* M3 Card / List */
.m3-card {
    background: var(--md-sys-color-surface);
    border-radius: 16px;
    border: 1px solid var(--md-sys-color-outline-variant);
    overflow: hidden;
}

.list-container {
    display: flex;
    flex-direction: column;
}

.list-header {
    display: flex;
    padding: 16px;
    background: var(--md-sys-color-surface-container);
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    font-family: var(--md-sys-typescale-label-large-font);
    font-weight: 500;
    color: var(--md-sys-color-on-surface-variant);
}

.list-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    cursor: pointer;
    transition: background 0.2s;
}

.list-item:hover {
    background: var(--md-sys-color-surface-container-low);
}

.list-item:last-child {
    border-bottom: none;
}

/* Columns */
.col-main { flex: 2; display: flex; align-items: center; gap: 16px; }
.col-role { flex: 1; }
.col-date { flex: 1.5; color: var(--md-sys-color-on-surface-variant); }
.col-status { flex: 1; }
.col-actions { flex: 0.5; display: flex; justify-content: flex-end; }

/* User Info */
.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
}

.text-content {
    display: flex;
    flex-direction: column;
}

.title-medium {
    font-family: var(--md-sys-typescale-title-medium-font);
    font-size: var(--md-sys-typescale-title-medium-size);
    font-weight: 500;
    color: var(--md-sys-color-on-surface);
}

.body-medium {
    font-family: var(--md-sys-typescale-body-medium-font);
    font-size: var(--md-sys-typescale-body-medium-size);
    color: var(--md-sys-color-on-surface-variant);
}

/* Role Badges */
.role-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 500;
}

.role-badge.admin { background: var(--md-sys-color-tertiary-container); color: var(--md-sys-color-on-tertiary-container); }
.role-badge.vendor { background: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container); }
.role-badge.customer { background: var(--md-sys-color-surface-variant); color: var(--md-sys-color-on-surface-variant); }

/* Status */
.status-indicator {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.875rem;
    font-weight: 500;
}

.status-indicator::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
}

.status-indicator.active::before { background: var(--md-sys-color-primary); }
.status-indicator.active { color: var(--md-sys-color-on-surface); }
.status-indicator.banned::before { background: var(--md-sys-color-error); }
.status-indicator.banned { color: var(--md-sys-color-error); }

/* Empty State */
.empty-state {
    padding: 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--md-sys-color-on-surface-variant);
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
}

/* Mobile Responsive */
.mobile-only { display: none; }

@media (max-width: 768px) {
    .desktop-only { display: none; }
    .mobile-only { display: block; }
    
    .list-header { display: none; }
    
    .list-item {
        padding: 16px;
    }
    
    .col-main {
        flex: 1;
    }
    
    .chevron {
        color: var(--md-sys-color-on-surface-variant);
    }
}

/* Action Sheet Overlay */
.mobile-action-sheet-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 1000;
    display: flex;
    align-items: flex-end;
}

.action-sheet {
    background: var(--md-sys-color-surface);
    width: 100%;
    border-radius: 28px 28px 0 0;
    padding: 16px 0 32px 0;
    box-shadow: 0 -4px 10px rgba(0,0,0,0.2);
    animation: slideUp 0.3s cubic-bezier(0.2, 0, 0, 1);
}

.sheet-handle {
    width: 32px;
    height: 4px;
    background: var(--md-sys-color-outline-variant);
    border-radius: 2px;
    margin: 0 auto 16px auto;
}

.sheet-header {
    padding: 0 24px 16px 24px;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    margin-bottom: 8px;
}

.title-large {
    font-family: var(--md-sys-typescale-title-large-font);
    font-size: var(--md-sys-typescale-title-large-size);
    margin: 0 0 4px 0;
}

@keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
}

.slide-up-enter-active, .slide-up-leave-active {
    transition: opacity 0.3s;
}
.slide-up-enter-from, .slide-up-leave-to {
    opacity: 0;
}
</style>
