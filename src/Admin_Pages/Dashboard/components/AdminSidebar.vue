<template>
  <aside class="admin-sidebar">
    <div class="sidebar-header">
      <div class="brand">
        <span class="material-icons-round logo-icon">check_circle</span>
        <h2>Aurashop</h2>
      </div>
      <button class="close-btn-mobile" @click="$emit('close')">
        <span class="material-icons-round">close</span>
      </button>
    </div>

    <div class="sidebar-menu">
      <div class="menu-section">
        <span class="menu-label">Menu</span>
        
        <router-link to="/admin" class="nav-item" active-class="active" exact>
          <span class="material-icons-round">dashboard</span>
          Dashboard
        </router-link>
        
        <router-link to="/admin/users" class="nav-item" active-class="active">
          <span class="material-icons-round">people</span>
          Users
        </router-link>
        
        <router-link to="/admin/vendors" class="nav-item" active-class="active">
          <span class="material-icons-round">storefront</span>
          Vendors
        </router-link>
        
        <router-link to="/admin/stores" class="nav-item" active-class="active">
          <span class="material-icons-round">business</span>
          Stores
        </router-link>

        <router-link to="/admin/kyc" class="nav-item" active-class="active">
          <span class="material-icons-round">verified_user</span>
          KYC Requests
        </router-link>

        <router-link to="/admin/team" class="nav-item" active-class="active">
            <span class="material-icons-round">group</span>
            Team
        </router-link>
      </div>

      <div class="menu-section">
        <span class="menu-label">General</span>
        
        <router-link to="/admin/settings" class="nav-item" active-class="active">
          <span class="material-icons-round">settings</span>
          Settings
        </router-link>
        
        <div class="nav-item">
          <span class="material-icons-round">help_outline</span>
          Help
        </div>
        
        <div class="nav-item" @click="logout">
          <span class="material-icons-round">logout</span>
          Logout
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAuth } from '../../../composables/useAuth';
import { useRouter } from 'vue-router';

const { logout: authLogout } = useAuth();
const router = useRouter();

const logout = async () => {
    await authLogout();
    router.push('/login');
};
</script>

<style scoped src="./AdminSidebar.css"></style>
