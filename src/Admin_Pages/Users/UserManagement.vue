<template>
  <AdminLayout>
    <div class="page-header">
      <h1>User Management</h1>
      <div class="search-bar">
        <LiquidInput 
          v-model="searchQuery" 
          placeholder="Search users..." 
          icon="search" 
        />
      </div>
    </div>

    <div class="users-table-container">
      <div v-if="loading" class="loading-state">
         <div class="spinner"></div>
      </div>
      
      <table v-else-if="filteredUsers.length > 0" class="users-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>
              <div class="user-info">
                <div class="user-avatar">
                  {{ getInitials(user.displayName || user.email) }}
                </div>
                <div class="user-details">
                  <span class="user-name">{{ user.displayName || 'No Name' }}</span>
                  <span class="user-email">{{ user.email }}</span>
                </div>
              </div>
            </td>
            <td>{{ user.isVendor ? 'Vendor' : 'Customer' }}</td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td>
              <span class="status-badge" :class="user.isBanned ? 'banned' : 'active'">
                {{ user.isBanned ? 'Banned' : 'Active' }}
              </span>
            </td>
            <td>
              <button 
                class="action-btn" 
                :class="user.isBanned ? 'unban' : 'ban'"
                @click="handleBanToggle(user)"
              >
                {{ user.isBanned ? 'Unban' : 'Ban' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-state">
        <p>No users found matching your search.</p>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAdmin } from '../../composables/useAdmin';
import { useToast } from '../../components/liquid-ui-kit/LiquidToast/LiquidToast';
import LiquidInput from '../../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import AdminLayout from '../components/AdminLayout.vue';

const { fetchUsers, toggleUserBan, loading } = useAdmin();
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
  } catch (e) {
    showToast(`Failed to ${action} user`, 'error');
  }
};
</script>

<style scoped src="./UserManagement.css"></style>
