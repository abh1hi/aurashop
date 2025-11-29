<template>
  <div class="page-container">
    <AppHeader />
    
    <main class="main-content">
      <div class="profile-container">
        <LiquidCard class="profile-card">
          <div class="profile-header">
            <div class="avatar-container">
              <img 
                :src="userProfile?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (userProfile?.email || 'User')" 
                alt="Avatar" 
                class="avatar"
              />
            </div>
            <h2 class="username">{{ userProfile?.displayName || 'User' }}</h2>
            <p class="email">{{ userProfile?.email || userProfile?.phoneNumber }}</p>
            <div class="roles-badges">
              <span v-for="role in userProfile?.roles" :key="role" class="role-badge">
                {{ formatRole(role) }}
              </span>
            </div>
          </div>

          <div class="profile-details">
            <div class="section-title">Account Details</div>
            <div class="detail-row">
              <span class="label">User ID:</span>
              <span class="value">{{ userProfile?.uid }}</span>
            </div>
            
            <!-- Vendor Details -->
            <div v-if="userProfile?.roles?.includes('vendor')" class="role-section">
              <div class="section-title">Vendor Profile</div>
              <div class="detail-row">
                <span class="label">Store Name:</span>
                <span class="value">{{ userProfile?.vendorProfile?.storeName }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Status:</span>
                <span class="value status" :class="userProfile?.vendorProfile?.status">{{ userProfile?.vendorProfile?.status }}</span>
              </div>
            </div>

            <!-- Delivery Details -->
            <div v-if="userProfile?.roles?.includes('delivery_partner')" class="role-section">
              <div class="section-title">Delivery Profile</div>
              <div class="detail-row">
                <span class="label">Vehicle:</span>
                <span class="value">{{ userProfile?.deliveryProfile?.vehicleType }}</span>
              </div>
            </div>
          </div>

          <div class="actions">
            <LiquidButton 
              text="Edit Profile" 
              type="secondary" 
              icon="edit"
              class="action-btn"
            />
            <LiquidButton 
              text="Logout" 
              type="danger" 
              icon="logout"
              class="action-btn"
              @click="handleLogout"
            />
          </div>
        </LiquidCard>
      </div>
    </main>

    <BottomNavBar />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidCard from '../components/liquid-ui-kit/LiquidCard/LiquidCard.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import { useUser } from '../composables/useUser';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { userProfile } = useUser();
const { logout } = useAuth();

const formatRole = (role) => {
  return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const handleLogout = async () => {
  try {
    await logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout failed', error);
  }
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: var(--bg-color);
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding-top: var(--spacing-lg);
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
  -webkit-overflow-scrolling: touch;
  display: flex;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
}

.profile-container {
  width: 100%;
  max-width: 500px;
}

.profile-card {
  padding: 30px;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.avatar-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid white;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  margin-bottom: 16px;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 4px;
}

.email {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 12px;
}

.roles-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.role-badge {
  background: rgba(var(--brand-primary-rgb), 0.1);
  color: var(--brand-primary);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(var(--brand-primary-rgb), 0.2);
}

.profile-details {
  margin-bottom: 30px;
}

.section-title {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-secondary);
  margin-bottom: 12px;
  font-weight: 700;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  padding-bottom: 4px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
}

.label {
  color: var(--text-secondary);
}

.value {
  font-weight: 500;
  color: var(--text-color);
}

.role-section {
  margin-top: 20px;
}

.status {
  text-transform: capitalize;
}

.status.pending { color: #f59e0b; }
.status.approved { color: #10b981; }
.status.rejected { color: #ef4444; }

.actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
}
</style>
