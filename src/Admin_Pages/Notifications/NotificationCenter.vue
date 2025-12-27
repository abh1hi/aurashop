<template>
  <AdminLayout>
    <div class="notification-center-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Notification Center</h1>
          <p class="page-subtitle">Send targeted alerts, system updates, and marketing messages.</p>
        </div>
      </div>

      <div class="content-grid">
        <!-- Compose Section -->
        <section class="compose-section">
          <div class="m3-card compose-card">
            <form @submit.prevent="handleSend" class="notification-form">
              
              <!-- Recipient Selection -->
              <div class="form-group">
                <md-outlined-select 
                  label="Target Audience"
                  :value="formData.targetGroup" 
                  @change="e => handleGroupChange(e.target.value)"
                  class="w-100"
                >
                    <md-select-option v-for="opt in targetGroupOptions" :key="opt.value" :value="opt.value">
                        <div slot="headline">{{ opt.label }}</div>
                    </md-select-option>
                </md-outlined-select>
              </div>

              <!-- Specific User Search (Conditional) -->
              <transition name="fade">
                <div v-if="formData.targetGroup === 'specific'" class="form-group user-search-group">
                  <div class="search-wrapper">
                      <md-outlined-text-field
                          label="Search User"
                          v-model="searchQuery" 
                          placeholder="Type name or email..." 
                          @input="handleUserSearch"
                          class="w-100"
                      >
                        <md-icon slot="leading-icon">search</md-icon>
                      </md-outlined-text-field>

                      <div v-if="searchResults.length > 0" class="search-results-dropdown">
                          <div 
                              v-for="user in searchResults" 
                              :key="user.id" 
                              class="search-result-item"
                              @click="selectUser(user)"
                          >
                              <div class="user-avatar-small">
                                  <img :src="user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`" alt="Avatar"/>
                              </div>
                              <div class="user-info">
                                  <span class="user-name">{{ user.displayName || 'Unnamed User' }}</span>
                                  <span class="user-email">{{ user.email }}</span>
                              </div>
                          </div>
                      </div>
                  </div>
                  <!-- Selected Users Tags -->
                   <div v-if="selectedUsers.length > 0" class="selected-users-tags">
                      <div v-for="user in selectedUsers" :key="user.id" class="user-chip">
                          <span>{{ user.displayName || user.email }}</span>
                          <md-icon-button @click="removeUser(user.id)" class="remove-btn">
                             <md-icon>close</md-icon>
                          </md-icon-button>
                      </div>
                   </div>
                </div>
              </transition>

              <div class="divider"></div>

              <!-- Content Section -->
              <div class="form-group">
                <label class="field-label">Notification Type</label>
                <div class="type-selector">
                   <div 
                      v-for="type in notificationTypes" 
                      :key="type.value"
                      class="type-btn-wrapper"
                   >
                       <md-filled-tonal-button 
                            v-if="formData.type === type.value"
                            type="button"
                            @click="formData.type = type.value"
                            class="type-btn active"
                        >
                            <md-icon slot="icon">{{ type.icon }}</md-icon>
                            {{ type.label }}
                        </md-filled-tonal-button>
                        <md-outlined-button 
                            v-else
                            type="button"
                            @click="formData.type = type.value"
                            class="type-btn"
                        >
                            <md-icon slot="icon">{{ type.icon }}</md-icon>
                            {{ type.label }}
                        </md-outlined-button>
                   </div>
                </div>
              </div>

              <div class="form-group">
                <md-outlined-text-field
                    label="Title"
                    v-model="formData.title" 
                    placeholder="Brief header (e.g., 'Order Shipped')" 
                    class="w-100"
                >
                    <md-icon slot="leading-icon">title</md-icon>
                </md-outlined-text-field>
              </div>

              <div class="form-group">
                <md-outlined-text-field
                    label="Message Content"
                    type="textarea"
                    v-model="formData.message"
                    rows="4"
                    class="w-100"
                ></md-outlined-text-field>
              </div>

              <div class="form-group">
                <md-outlined-text-field
                    label="Action Link (Optional)"
                    v-model="formData.link" 
                    placeholder="e.g., /products/special-sale" 
                    class="w-100"
                >
                    <md-icon slot="leading-icon">link</md-icon>
                </md-outlined-text-field>
              </div>

              <div class="form-actions mt-xl">
                 <md-filled-button 
                    type="submit" 
                    class="w-100 send-btn"
                    :disabled="!isValid || loading"
                 >
                    <md-icon slot="icon">send</md-icon>
                    Send Notification
                 </md-filled-button>
              </div>

            </form>
          </div>
        </section>

        <!-- Preview Section -->
        <section class="preview-section">
          <h3 class="section-title">Live Preview</h3>
          <div class="preview-container">
              <!-- Notification Panel Preview -->
               <div class="preview-mockup">
                  <div class="mockup-header">
                      <span class="mockup-time">9:41</span>
                      <div class="mockup-status">
                          <md-icon style="font-size: 14px;">signal_cellular_4_bar</md-icon>
                          <md-icon style="font-size: 14px;">wifi</md-icon>
                          <md-icon style="font-size: 14px;">battery_full</md-icon>
                      </div>
                  </div>
                  <div class="mockup-content">
                      <div class="notif-card-preview" :class="formData.type">
                          <div class="notif-icon-box">
                              <md-icon>{{ getTypeIcon(formData.type) }}</md-icon>
                          </div>
                          <div class="notif-text-content">
                              <span class="notif-title">{{ formData.title || 'Notification Title' }}</span>
                              <p class="notif-message">{{ formData.message || 'The notification description will appear here. It offers a preview of how users will see it.' }}</p>
                              <span class="notif-time">Just now</span>
                          </div>
                      </div>
                  </div>
               </div>
               
               <!-- Toast Preview -->
               <div class="toast-preview" :class="formData.type">
                  <md-icon>{{ getTypeIcon(formData.type) }}</md-icon>
                  <span>{{ formData.title || 'New Notification' }}</span>
               </div>
          </div>
        </section>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import AdminLayout from '../components/AdminLayout.vue';
import { useAdmin } from '../../composables/useAdmin';
import { useToast } from '../../components/liquid-ui-kit/LiquidToast/LiquidToast';
// Icons and components are now imported globally

const { loading, error, fetchUsers, sendBulkNotification } = useAdmin();
const { showToast } = useToast();

const targetGroupOptions = [
    { label: 'Specific Users', value: 'specific' },
    { label: 'All Vendors', value: 'vendors' },
    { label: 'All Customers', value: 'customers' },
    { label: 'Broadcast Checks (Everyone)', value: 'all' }
];

const notificationTypes = [
    { label: 'Info', value: 'info', icon: 'info' },
    { label: 'Success', value: 'success', icon: 'check_circle' },
    { label: 'Warning', value: 'warning', icon: 'warning' },
    { label: 'Error', value: 'error', icon: 'error' },
    { label: 'Promotion', value: 'promotion', icon: 'campaign' },
    { label: 'System', value: 'system', icon: 'dns' }
];

const formData = reactive({
    targetGroup: 'specific',
    title: '',
    message: '',
    type: 'info',
    link: ''
});

const searchQuery = ref('');
const allUsers = ref<any[]>([]);
const searchResults = ref<any[]>([]);
const selectedUsers = ref<any[]>([]);

// Prefetch users for searching - simplified for MVP. In prod, use server-side search.
onMounted(async () => {
    try {
        allUsers.value = await fetchUsers();
    } catch (e) {
        console.error('Failed to load users', e);
    }
});

const handleGroupChange = (val: string) => {
    formData.targetGroup = val;
    // Reset selections when group changes
    selectedUsers.value = [];
    searchQuery.value = '';
    searchResults.value = [];
};

const handleUserSearch = () => {
    if (!searchQuery.value) {
        searchResults.value = [];
        return;
    }
    const query = searchQuery.value.toLowerCase();
    searchResults.value = allUsers.value.filter((user: any) => 
        (user.displayName?.toLowerCase().includes(query) || user.email?.toLowerCase().includes(query)) &&
        !selectedUsers.value.some(u => u.id === user.id)
    ).slice(0, 5);
};

const selectUser = (user: any) => {
    selectedUsers.value.push(user);
    searchQuery.value = '';
    searchResults.value = [];
};

const removeUser = (userId: string) => {
    selectedUsers.value = selectedUsers.value.filter(u => u.id !== userId);
};

const getTypeIcon = (type: string) => {
    const found = notificationTypes.find(t => t.value === type);
    return found ? found.icon : 'notifications';
};

const isValid = computed(() => {
    if (!formData.title || !formData.message) return false;
    if (formData.targetGroup === 'specific' && selectedUsers.value.length === 0) return false;
    return true;
});

const handleSend = async () => {
    if (!isValid.value) return;

    try {
        const payload = {
            title: formData.title,
            message: formData.message,
            type: formData.type,
            link: formData.link
        };

        const specificIds = selectedUsers.value.map(u => u.id);
        const count = await sendBulkNotification(
            formData.targetGroup as any, 
            payload, 
            specificIds
        );

        showToast(`Successfully sent to ${count} recipient(s)!`, 'success');
        
        // Reset Form
        formData.title = '';
        formData.message = '';
        formData.link = '';
        formData.type = 'info';
        selectedUsers.value = [];

    } catch (e: any) {
        showToast(error.value || 'Failed to send notifications', 'error');
    }
};
</script>

<style scoped>
.notification-center-page {
    /* max-width: 1200px; Remove max-width constraint enforced by Layout */
    margin: 0 auto;
    width: 100%;
}

.page-header {
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

.content-grid {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 2rem;
}

@media(max-width: 1024px) {
    .content-grid {
        grid-template-columns: 1fr;
    }
}

/* M3 Card Styles */
.m3-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    padding: 2rem;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.2);
}

.form-group {
    margin-bottom: 1.5rem;
}

.w-100 {
    width: 100%;
}

.field-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: var(--md-sys-color-on-surface);
}

.divider {
    height: 1px;
    background: var(--md-sys-color-outline-variant);
    margin: 1.5rem 0;
}

/* User Search */
.search-wrapper {
    position: relative;
}

.search-results-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    background: var(--md-sys-color-surface);
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 8px;
    margin-top: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10;
}

.search-result-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    cursor: pointer;
    transition: background 0.2s;
    color: var(--md-sys-color-on-surface);
}

.search-result-item:hover {
    background: var(--md-sys-color-surface-variant);
}

.user-avatar-small {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
}

.user-avatar-small img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.user-info {
    display: flex;
    flex-direction: column;
}

.user-name {
    font-size: 0.875rem;
    font-weight: 600;
}

.user-email {
    font-size: 0.75rem;
    color: var(--md-sys-color-on-surface-variant);
}

.selected-users-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
}

.user-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 4px 4px 12px;
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
    border-radius: 100px;
    font-size: 0.875rem;
    font-weight: 500;
}

.remove-btn {
    --md-icon-button-icon-size: 18px;
    width: 24px;
    height: 24px;
}

/* Type Selector */
.type-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.type-btn-wrapper {
    flex: 1 1 auto;
}

.type-btn {
    width: 100%;
}

.send-btn {
    height: 48px;
    font-size: 1rem;
}

/* Preview Section */
.preview-container {
    perspective: 1000px;
}

.preview-mockup {
    background: var(--md-sys-color-background);
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    width: 320px;
    margin: 0 auto;
    height: 600px;
    position: relative;
    transform: rotateY(-5deg) rotateX(2deg);
    transition: transform 0.5s ease;
}

.preview-mockup:hover {
    transform: rotateY(0) rotateX(0);
}

.mockup-header {
    display: flex;
    justify-content: space-between;
    padding: 14px 20px;
    background: transparent;
    font-size: 12px;
    font-weight: 600;
    color: var(--md-sys-color-on-surface);
}

.mockup-status {
    display: flex;
    gap: 4px;
}

.mockup-content {
    padding: 20px;
    background: rgba(0,0,0,0.02);
    height: 100%;
}

.notif-card-preview {
    display: flex;
    gap: 12px;
    padding: 16px;
    background: var(--md-sys-color-surface);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    border: 1px solid var(--md-sys-color-outline-variant);
    margin-bottom: 20px;
    animation: slideInDown 0.5s ease-out;
}

.notif-icon-box {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.info .notif-icon-box { background: rgba(59, 130, 246, 0.1); color: var(--md-sys-color-secondary); }
.success .notif-icon-box { background: rgba(16, 185, 129, 0.1); color: green; }
.warning .notif-icon-box { background: rgba(245, 158, 11, 0.1); color: orange; }
.error .notif-icon-box { background: rgba(239, 68, 68, 0.1); color: var(--md-sys-color-error); }
.promotion .notif-icon-box { background: rgba(217, 70, 239, 0.1); color: purple; }
.system .notif-icon-box { background: rgba(100, 116, 139, 0.1); color: gray; }

.notif-text-content {
    flex: 1;
}

.notif-title {
    display: block;
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 4px;
    color: var(--md-sys-color-on-surface);
}

.notif-message {
    font-size: 12px;
    color: var(--md-sys-color-on-surface-variant);
    line-height: 1.4;
    margin-bottom: 4px;
}

.notif-time {
    font-size: 10px;
    color: var(--md-sys-color-outline);
}

.toast-preview {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    background: #333;
    color: white;
    border-radius: 8px;
    margin: 20px auto;
    width: fit-content;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    font-size: 14px;
}

.toast-preview.success { border-left: 4px solid green; }
.toast-preview.error { border-left: 4px solid var(--md-sys-color-error); }

@keyframes slideInDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
