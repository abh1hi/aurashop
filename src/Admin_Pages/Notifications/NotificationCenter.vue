<template>
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
        <LiquidCard class="compose-card">
          <form @submit.prevent="handleSend" class="notification-form">
            
            <!-- Recipient Selection -->
            <div class="form-group">
              <label class="field-label">Target Audience</label>
              <LiquidDropdown 
                :modelValue="formData.targetGroup" 
                :options="targetGroupOptions" 
                @update:modelValue="handleGroupChange"
                placeholder="Select Audience"
                class="w-100"
              />
            </div>

            <!-- Specific User Search (Conditional) -->
            <transition name="fade">
              <div v-if="formData.targetGroup === 'specific'" class="form-group user-search-group">
                <label class="field-label">Search User</label>
                <div class="search-wrapper">
                    <LiquidInput 
                        v-model="searchQuery" 
                        placeholder="Type name or email..." 
                        icon="search"
                        @input="handleUserSearch"
                    />
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
                    <span v-for="user in selectedUsers" :key="user.id" class="user-tag">
                        {{ user.displayName || user.email }}
                        <button type="button" class="remove-tag-btn" @click="removeUser(user.id)">&times;</button>
                    </span>
                 </div>
              </div>
            </transition>

            <div class="divider"></div>

            <!-- Content Section -->
            <div class="form-group">
              <label class="field-label">Notification Type</label>
              <div class="type-selector">
                 <button 
                    v-for="type in notificationTypes" 
                    :key="type.value"
                    type="button"
                    class="type-btn"
                    :class="{ active: formData.type === type.value, [type.value]: true }"
                    @click="formData.type = type.value"
                 >
                    <span class="material-icons-round">{{ type.icon }}</span>
                    {{ type.label }}
                 </button>
              </div>
            </div>

            <div class="form-group">
              <label class="field-label">Title</label>
              <LiquidInput 
                v-model="formData.title" 
                placeholder="Brief header (e.g., 'Order Shipped')" 
                icon="title"
              />
            </div>

            <div class="form-group">
              <label class="field-label">Message Content</label>
              <textarea 
                v-model="formData.message" 
                class="liquid-textarea" 
                placeholder="Enter your detailed message here..."
                rows="4"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="field-label">Action Link (Optional)</label>
              <LiquidInput 
                v-model="formData.link" 
                placeholder="e.g., /products/special-sale" 
                icon="link"
              />
            </div>

            <div class="form-actions mt-xl">
               <LiquidButton 
                text="Send Notification" 
                type="primary" 
                size="lg" 
                icon="send" 
                class="w-100"
                :loading="loading"
                :disabled="!isValid"
               />
            </div>

          </form>
        </LiquidCard>
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
                        <span class="material-icons-round" style="font-size: 14px;">signal_cellular_4_bar</span>
                        <span class="material-icons-round" style="font-size: 14px;">wifi</span>
                        <span class="material-icons-round" style="font-size: 14px;">battery_full</span>
                    </div>
                </div>
                <div class="mockup-content">
                    <div class="notif-card-preview" :class="formData.type">
                        <div class="notif-icon-box">
                            <span class="material-icons-round">{{ getTypeIcon(formData.type) }}</span>
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
                <span class="material-icons-round">{{ getTypeIcon(formData.type) }}</span>
                <span>{{ formData.title || 'New Notification' }}</span>
             </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import LiquidCard from '../../components/liquid-ui-kit/LiquidCard/LiquidCard.vue';
import LiquidInput from '../../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import LiquidDropdown from '../../components/liquid-ui-kit/LiquidDropdown/LiquidDropdown.vue';
import LiquidButton from '../../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import { useAdmin } from '../../composables/useAdmin';
import { useToast } from '../../components/liquid-ui-kit/LiquidToast/LiquidToast';

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

const handleGroupChange = () => {
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
    max-width: 1200px;
    margin: 0 auto;
    padding-bottom: 60px;
}

.page-header {
    margin-bottom: 32px;
}

.page-title {
    font-size: var(--text-3xl);
    font-weight: 800;
    margin-bottom: 8px;
    background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.page-subtitle {
    color: var(--secondary-text);
}

.content-grid {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 32px;
}

@media(max-width: 1024px) {
    .content-grid {
        grid-template-columns: 1fr;
    }
}

.compose-card {
    padding: 32px;
}

.form-group {
    margin-bottom: 24px;
}

.field-label {
    display: block;
    font-size: var(--text-sm);
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--primary-text);
}

.divider {
    height: 1px;
    background: var(--liquid-glass-border);
    margin: 24px 0;
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
    background: var(--liquid-glass-base);
    border: 1px solid var(--liquid-glass-border);
    backdrop-filter: blur(16px);
    border-radius: var(--radius-md);
    margin-top: 4px;
    box-shadow: var(--liquid-shadow-lg);
    z-index: 10;
}

.search-result-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    cursor: pointer;
    transition: background 0.2s;
}

.search-result-item:hover {
    background: rgba(255, 255, 255, 0.1);
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
    font-size: var(--text-sm);
    font-weight: 600;
}

.user-email {
    font-size: var(--text-xs);
    color: var(--secondary-text);
}

.selected-users-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
}

.user-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background: var(--brand-primary-light);
    color: var(--brand-primary);
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: 500;
}

.remove-tag-btn {
    background: none;
    border: none;
    color: currentColor;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
    display: flex;
}

/* Type Selector */
.type-selector {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 12px;
}

.type-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border: 1px solid var(--liquid-glass-border);
    background: var(--liquid-glass-shine-1);
    border-radius: var(--radius-md);
    cursor: pointer;
    color: var(--secondary-text);
    transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
}

.type-btn.active {
    background: var(--liquid-glass-base);
    transform: translateY(-2px);
    box-shadow: var(--liquid-shadow-md);
    color: var(--primary-text);
    font-weight: 600;
}

.type-btn.info.active { border-color: var(--info-color); color: var(--info-color); }
.type-btn.success.active { border-color: var(--success-color); color: var(--success-color); }
.type-btn.warning.active { border-color: var(--warning-color); color: var(--warning-color); }
.type-btn.error.active { border-color: var(--error-color); color: var(--error-color); }
.type-btn.promotion.active { border-color: #d946ef; color: #d946ef; }
.type-btn.system.active { border-color: #64748b; color: #64748b; }

.liquid-textarea {
    width: 100%;
    padding: 16px;
    background: var(--liquid-glass-inner);
    border: 1px solid var(--liquid-glass-border);
    border-radius: var(--radius-lg);
    color: var(--primary-text);
    font-family: inherit;
    resize: vertical;
    outline: none;
    transition: all 0.3s ease;
}

.liquid-textarea:focus {
    border-color: var(--brand-primary);
    box-shadow: 0 0 0 3px rgba(var(--brand-primary-rgb), 0.1);
}

/* Preview Section */
.preview-container {
    perspective: 1000px;
}

.preview-mockup {
    background: var(--bg-color);
    border: 1px solid var(--liquid-glass-border);
    border-radius: 24px;
    overflow: hidden;
    box-shadow: var(--liquid-shadow-xl);
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
    color: var(--primary-text);
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
    background: var(--liquid-glass-base);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    border: 1px solid var(--liquid-glass-border);
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

.info .notif-icon-box { background: rgba(59, 130, 246, 0.1); color: var(--info-color); }
.success .notif-icon-box { background: rgba(16, 185, 129, 0.1); color: var(--success-color); }
.warning .notif-icon-box { background: rgba(245, 158, 11, 0.1); color: var(--warning-color); }
.error .notif-icon-box { background: rgba(239, 68, 68, 0.1); color: var(--error-color); }
.promotion .notif-icon-box { background: rgba(217, 70, 239, 0.1); color: #d946ef; }
.system .notif-icon-box { background: rgba(100, 116, 139, 0.1); color: #64748b; }

.notif-text-content {
    flex: 1;
}

.notif-title {
    display: block;
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 4px;
    color: var(--primary-text);
}

.notif-message {
    font-size: 12px;
    color: var(--secondary-text);
    line-height: 1.4;
    margin-bottom: 4px;
}

.notif-time {
    font-size: 10px;
    color: var(--tertiary-text);
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

.toast-preview.success { border-left: 4px solid var(--success-color); }
.toast-preview.error { border-left: 4px solid var(--error-color); }

@keyframes slideInDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
