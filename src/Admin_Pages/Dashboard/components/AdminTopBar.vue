<template>
  <header class="admin-topbar m3-surface-container">
    <div class="topbar-left">
      <md-icon-button class="menu-btn" @click="$emit('toggle-sidebar')">
        <md-icon>menu</md-icon>
      </md-icon-button>
      
      <div class="search-wrap">
         <md-outlined-text-field 
             placeholder="Search Admin Panel..." 
             :value="searchQuery"
             @input="searchQuery = $event.target.value"
             density="compact"
             class="search-input"
         >
            <md-icon slot="leading-icon">search</md-icon>
         </md-outlined-text-field>
      </div>
    </div>

    <div class="topbar-right">
      <div class="status-chip">
         <span class="dot"></span>
         <span class="label">System Live</span>
      </div>

      <div class="action-buttons">
         <md-icon-button @click="navigateToMessages">
             <md-icon>chat_bubble_outline</md-icon>
         </md-icon-button>
         <md-icon-button @click="navigateToNotifications">
             <md-icon>notifications</md-icon>
         </md-icon-button>
      </div>
      
      <div class="user-profile">
         <div class="avatar-sm">
             <img :src="photoURL" alt="Admin" />
         </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../../composables/useAuth';

const { user } = useAuth();
const router = useRouter();
const searchQuery = ref('');

const photoURL = computed(() => user.value?.photoURL || 'https://i.pravatar.cc/150?img=12');

const navigateToMessages = () => {
  router.push('/admin/messages');
};

const navigateToNotifications = () => {
  router.push('/admin/notifications');
};
</script>

<style scoped>
.admin-topbar {
    height: 64px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--md-sys-color-surface, #ffffff);
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    /* No sticky needed, parent flex col handles it */
}

.topbar-left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
}

.search-wrap {
    max-width: 400px;
    flex: 1;
}

.search-input {
    width: 100%;
}

.topbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.status-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: var(--md-sys-color-surface-container-high);
    border-radius: 16px;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--md-sys-color-primary);
    display: none;
}

@media(min-width: 768px) {
    .status-chip { display: flex; }
}

.dot {
    width: 8px;
    height: 8px;
    background: var(--md-sys-color-primary);
    border-radius: 50%;
    box-shadow: 0 0 8px var(--md-sys-color-primary);
}

.action-buttons {
    display: flex;
    gap: 4px;
}

.user-profile {
    margin-left: 8px;
    cursor: pointer;
}

.avatar-sm {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid var(--md-sys-color-outline-variant);
}

.avatar-sm img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
