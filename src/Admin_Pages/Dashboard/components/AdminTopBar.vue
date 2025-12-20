<template>
  <header class="admin-topbar">
    <div class="topbar-left">
      <button class="menu-btn" @click="$emit('toggle-sidebar')">
        <span class="material-icons-round">menu</span>
      </button>
      <div class="search-wrap">
        <LiquidInput 
          placeholder="Search AuraCore..." 
          icon="search"
          v-model="searchQuery"
          size="sm"
        />
      </div>
    </div>

    <div class="topbar-right">
      <div class="status-indicator">
        <span class="dot"></span>
        <span class="label">Live</span>
      </div>

      <div class="action-buttons">
        <button class="icon-btn">
          <span class="material-icons-round">chat_bubble_outline</span>
          <span class="badge"></span>
        </button>
        <button class="icon-btn">
          <span class="material-icons-round">notifications_none</span>
        </button>
      </div>
      
      <div class="user-chip">
        <img :src="photoURL" alt="Admin" class="avatar" />
        <span class="material-icons-round">expand_more</span>
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

const photoURL = computed(() => user.value?.photoURL || 'https://i.pravatar.cc/150?img=12');
</script>

<style scoped src="./AdminTopBar.css"></style>
