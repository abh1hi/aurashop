<template>
  <header class="admin-topbar">
    <div class="search-container">
      <button class="menu-btn-mobile" @click="$emit('toggle-sidebar')">
        <span class="material-icons-round">menu</span>
      </button>
      <LiquidInput 
        placeholder="Search task" 
        icon="search"
        v-model="searchQuery"
      />
    </div>

    <div class="topbar-actions">
      <button class="action-btn">
        <span class="material-icons-round">mail_outline</span>
      </button>
      <button class="action-btn">
        <span class="material-icons-round">notifications_none</span>
      </button>
      
      <div class="user-profile">
        <img :src="photoURL" alt="User" class="avatar" />
        <div class="user-info">
          <span class="user-name">{{ displayName }}</span>
          <span class="user-email">{{ email }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import LiquidInput from '../../../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import { useAuth } from '../../../composables/useAuth';

const { user } = useAuth();
const searchQuery = ref('');

const displayName = computed(() => user.value?.displayName || 'Admin User');
const email = computed(() => user.value?.email || 'No Email');
const photoURL = computed(() => user.value?.photoURL || 'https://i.pravatar.cc/150?img=12');
</script>

<style scoped src="./AdminTopBar.css"></style>
