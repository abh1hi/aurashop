<template>
  <AdminLayout>
    <div class="user-management-header">
      <div class="header-content">
        <h1 class="page-title">User<span>Directory</span></h1>
        <p class="page-subtitle">Manage system access, roles, and security compliance.</p>
      </div>
      <div class="search-wrap">
        <LiquidInput 
          v-model="searchQuery" 
          placeholder="Filter by name or email..." 
          icon="search" 
        />
      </div>
    </div>

    <div class="users-viewport">
      <div v-if="loading" class="loading-state">
         <div class="skeleton-loader"></div>
      </div>
      
      <div v-else-if="filteredUsers.length > 0" class="table-container">
        <!-- Desktop Header -->
        <div class="grid-header">
          <div class="col-user">User Entity</div>
          <div class="col-role">System Roles</div>
          <div class="col-joined">Joined</div>
          <div class="col-status">Status</div>
          <div class="col-actions">Actions</div>
        </div>

        <div class="grid-rows">
          <div v-for="user in filteredUsers" :key="user.id" class="data-row">
            <div class="col-user">
              <div class="identity-card">
                <div class="user-orb">
                  {{ getInitials(user.displayName || user.email) }}
                </div>
                <div class="identity-details">
                  <span class="user-name">{{ user.displayName || 'Anonymous Entity' }}</span>
                  <span class="user-email">{{ user.email }}</span>
                </div>
              </div>
            </div>

            <div class="col-role">
              <div class="role-selector">
                <LiquidDropdown 
                  :model-value="'Manage Roles'"
                  :options="getRoleOptionsForUser(user)"
                  placeholder="Manage Access"
                  @change="(val: any) => handleRoleAction(user, val)"
                />
              </div>
            </div>

            <div class="col-joined">
              <span class="timestamp">{{ formatDate(user.createdAt) }}</span>
            </div>

            <div class="col-status">
              <div class="status-visual" @click.stop="toggleStatusDetail(user.id)">
                <div class="status-dots">
                   <div 
                      v-for="role in ['admin', 'vendor', 'customer']" 
                      :key="role"
                      class="dot"
                      :class="getRoleDotClass(user, role)"
                      :title="role"
                   ></div>
                </div>
                
                <!-- Status Detail Dropdown -->
                <Transition name="fade">
                  <div v-if="activeStatusId === user.id" class="status-detail-dropdown">
                    <div class="detail-header">Role Status</div>
                    <div v-for="role in ['admin', 'vendor', 'customer']" :key="role" class="detail-row">
                      <span class="detail-label">{{ role }}</span>
                      <span class="detail-val" :class="getRoleDotClass(user, role)">
                        {{ getRoleStatusLabel(user, role) }}
                      </span>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>

            <div class="col-actions">
              <div class="action-cluster">
                <button 
                  class="icon-btn-glass" 
                  :class="user.isBanned ? 'unban' : 'ban'"
                  @click="handleBanToggle(user)"
                  :title="user.isBanned ? 'Restore User' : 'Restrict User'"
                >
                  <span class="material-icons-round">{{ user.isBanned ? 'lock_open' : 'block' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <span class="material-icons-round">person_search</span>
        <h3>No matching entities found</h3>
        <p>Try refining your search parameters.</p>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAdmin } from '../../composables/useAdmin';
import { useToast } from '../../components/liquid-ui-kit/LiquidToast/LiquidToast';
import LiquidInput from '../../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import LiquidDropdown from '../../components/liquid-ui-kit/LiquidDropdown/LiquidDropdown.vue';
import AdminLayout from '../components/AdminLayout.vue';

const { fetchUsers, toggleUserBan, updateUserRole, toggleRoleBan, loading } = useAdmin();
const { showToast } = useToast();

const users = ref<any[]>([]);
const searchQuery = ref('');

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
  if (!name) return 'U';
  return name.charAt(0).toUpperCase();
};

const formatDate = (timestamp: any) => {
  if (!timestamp) return '-';
  // Handle Firestore Timestamp
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);
};

const handleBanToggle = async (user: any) => {
  const action = user.isBanned ? 'unban' : 'ban';
  if (!confirm(`Are you sure you want to ${action} this user?`)) return;

  try {
    await toggleUserBan(user.id, !user.isBanned);
    user.isBanned = !user.isBanned;
    showToast(`User ${action}ned successfully`, 'success');
  } catch (e: any) {
    console.error('Ban Error:', e);
    showToast(`Failed to ${action} user: ${e.message}`, 'error');
  }
};

const activeStatusId = ref<string | null>(null);

const toggleStatusDetail = (userId: string) => {
  activeStatusId.value = activeStatusId.value === userId ? null : userId;
};

// Close dropdown when clicking outside
const closeStatusDetail = () => {
    activeStatusId.value = null;
};

// Global click listener for closing dropdowns
onMounted(() => {
    document.addEventListener('click', closeStatusDetail);
});
import { onUnmounted } from 'vue';
onUnmounted(() => {
    document.removeEventListener('click', closeStatusDetail);
});

const getRoleDotClass = (user: any, role: string) => {
    const isPresent = role === 'customer' || (role === 'admin' && user.isAdmin) || (role === 'vendor' && user.isVendor);
    if (!isPresent) return 'inactive'; // Grey/Hidden

    const bannedRoles = user.bannedRoles || [];
    const isBanned = bannedRoles.includes(role);
    return isBanned ? 'banned' : 'active';
};

const getRoleStatusLabel = (user: any, role: string) => {
    const isPresent = role === 'customer' || (role === 'admin' && user.isAdmin) || (role === 'vendor' && user.isVendor);
    if (!isPresent) return 'N/A';
    
    const bannedRoles = user.bannedRoles || [];
    return bannedRoles.includes(role) ? 'Banned' : 'Active';
};

const getRoleOptionsForUser = (user: any) => {
  const options = [];
  const bannedRoles = user.bannedRoles || [];
  
  // Existing Roles Actions
  if (user.isAdmin) {
      const isBanned = bannedRoles.includes('admin');
      options.push({ 
          label: isBanned ? 'Restore Admin' : 'Suspend Admin', 
          value: { action: 'toggle_ban', role: 'admin', ban: !isBanned }, 
          icon: isBanned ? 'check_circle' : 'block',
          danger: !isBanned
      });
  }
  if (user.isVendor) {
      const isBanned = bannedRoles.includes('vendor');
      options.push({ 
          label: isBanned ? 'Restore Vendor' : 'Suspend Vendor', 
          value: { action: 'toggle_ban', role: 'vendor', ban: !isBanned }, 
          icon: isBanned ? 'check_circle' : 'storefront',
          danger: !isBanned
      });
  }
  
  // Base Customer Role (always exists conceptually)
  const isCustomerBanned = bannedRoles.includes('customer');
  options.push({ 
      label: isCustomerBanned ? 'Restore Customer' : 'Suspend Customer', 
      value: { action: 'toggle_ban', role: 'customer', ban: !isCustomerBanned }, 
      icon: isCustomerBanned ? 'check_circle' : 'person',
      danger: !isCustomerBanned
  });

  return options;
};

const handleRoleAction = async (user: any, payload: any) => {
  if (!payload) return;
  const { action, role, ban } = payload;

  if (action === 'toggle_ban') {
      const verb = ban ? 'Suspend' : 'Restore';
      if (!confirm(`${verb} ${role} rights for this user?`)) return;

      try {
          await toggleRoleBan(user.id, role, ban);
          
          // Optimistic Update
          if (!user.bannedRoles) user.bannedRoles = [];
          if (ban) {
              user.bannedRoles.push(role);
          } else {
              user.bannedRoles = user.bannedRoles.filter((r: string) => r !== role);
          }
          
          showToast(`${role} rights ${ban ? 'suspended' : 'restored'}`, 'success');
      } catch (e: any) {
          console.error('Role Action Error:', e);
          showToast(`Failed to update role status: ${e.message}`, 'error');
      }
  }
};
</script>

<style scoped src="./UserManagement.css"></style>
