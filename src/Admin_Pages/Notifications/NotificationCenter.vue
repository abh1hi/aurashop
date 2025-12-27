<template>
  <AdminLayout>
    <div class="notification-center-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Notification Center</h1>
          <p class="page-subtitle">Send targeted alerts, system updates, and marketing messages.</p>
        </div>
        <div class="header-actions">
           <md-outlined-button @click="goToHistory">
             <md-icon slot="icon">restore</md-icon>
             Load Saved / History
           </md-outlined-button>
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
                          placeholder="Type name, email, or UID..." 
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

              <div class="form-group">
                <label class="field-label">Media Attachment</label>
                <div class="media-type-selector mb-sm">
                    <md-outlined-select 
                        label="Attachment Type" 
                        :value="mediaSource"
                        @change="e => mediaSource = e.target.value"
                        class="w-100"
                    >
                        <md-select-option value="url">
                            <div slot="headline">External URL</div>
                        </md-select-option>
                        <md-select-option value="upload">
                            <div slot="headline">Upload File</div>
                        </md-select-option>
                    </md-outlined-select>
                </div>

                <div v-if="mediaSource === 'url'" class="mt-sm">
                    <md-outlined-text-field
                        label="Media URL"
                        v-model="formData.mediaUrl" 
                        placeholder="https://... (Image or Video)" 
                        class="w-100"
                        :disabled="uploading"
                    >
                        <md-icon slot="leading-icon">image</md-icon>
                    </md-outlined-text-field>
                </div>

                <div v-else class="mt-sm upload-box">
                    <input 
                        type="file" 
                        id="media-upload" 
                        class="hidden-input" 
                        accept="image/*,video/*"
                        @change="handleFileUpload"
                    >
                    <label for="media-upload" class="upload-label" v-if="!uploading && !formData.mediaUrl">
                        <md-icon>add_photo_alternate</md-icon>
                        <span>Click to Upload Image/Video</span>
                    </label>
                    
                    <div v-else-if="uploading" class="upload-status">
                        <md-circular-progress indeterminate></md-circular-progress>
                        <span>Uploading...</span>
                    </div>

                    <div v-else-if="formData.mediaUrl" class="upload-success">
                        <md-icon class="success-icon">check_circle</md-icon>
                        <span>Media Uploaded</span>
                        <md-text-button @click.prevent="formData.mediaUrl = ''" class="remove-media-btn">Remove</md-text-button>
                    </div>
                </div>
              </div>

              <div class="form-actions mt-xl">
                 <md-outlined-button 
                    type="button" 
                    class="draft-btn"
                    @click="handleSaveDraft"
                    :disabled="loading || !formData.title"
                 >
                    <md-icon slot="icon">save</md-icon>
                    Save Draft
                 </md-outlined-button>
                 
                 <md-filled-button 
                    type="submit" 
                    class="send-btn"
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
                              
                              <div v-if="formData.mediaUrl" class="notif-media-preview">
                                  <video v-if="isVideo" :src="formData.mediaUrl" controls muted class="media-content"></video>
                                  <img v-else :src="formData.mediaUrl" alt="Notification Media" class="media-content" />
                              </div>
                              
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
import { useRouter } from 'vue-router';
import AdminLayout from '../components/AdminLayout.vue';
import { useAdmin } from '../../composables/useAdmin';
import { useToast } from '../../components/liquid-ui-kit/LiquidToast/LiquidToast';
import { storage } from '../../firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const router = useRouter();
const { loading, error, searchUsers, sendBulkNotification, saveDraft } = useAdmin();
const { showToast } = useToast();

// Replaced local load logic with separate page support
onMounted(() => {
    const template = history.state.templateData;
    if (template) {
        console.log('Hydrating from template:', template);
        formData.title = template.title || '';
        formData.message = template.message || '';
        formData.type = template.type || 'info';
        formData.link = template.link || '';
        formData.mediaUrl = template.mediaUrl || '';
        formData.targetGroup = template.targetGroup || 'specific';
        
        mediaSource.value = formData.mediaUrl ? 'url' : 'upload';
        
        // Clear state to prevent reload on refresh? Optional.
        // history.replaceState({}, ''); 
        showToast('Template loaded', 'success');
    }
});

const handleSaveDraft = async () => {
    if (!formData.title) {
        showToast('Please enter at least a title', 'warning');
        return;
    }
    
    try {
        await saveDraft({
            title: formData.title,
            message: formData.message,
            type: formData.type,
            link: formData.link,
            mediaUrl: formData.mediaUrl,
            targetGroup: formData.targetGroup
        });
        showToast('Draft saved successfully', 'success');
    } catch (e) {
        showToast('Failed to save draft', 'error');
    }
};

const goToHistory = () => {
    router.push('/admin/notifications/history');
};

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

// ... rest of existing logic ...
// (We need to insert the rest carefully or use a slightly different replace strategy to avoid wiping the rest of the script block if it was too large)
// Actually, I'll just replace the setup block start and rely on `activeTab` being new.
// Wait, I am replacing a huge chunk. Let me just check the boundaries.
// The `handleSend` implementation is below. I will just inject these NEW functions after `useAdmin` destructuring.


const formData = reactive({
    targetGroup: 'specific',
    title: '',
    message: '',
    type: 'info',
    link: '',
    mediaUrl: ''
});

const mediaSource = ref<'url' | 'upload'>('url');
const uploading = ref(false);

const handleFileUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Validation (Max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showToast('File too large (Max 10MB)', 'error');
        return;
    }

    uploading.value = true;
    try {
        const fileRef = storageRef(storage, `notifications/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        formData.mediaUrl = url;
        showToast('Media uploaded successfully', 'success');
    } catch (e: any) {
        console.error('Upload failed', e);
        showToast('Failed to upload media', 'error');
    } finally {
        uploading.value = false;
    }
};



const isVideo = computed(() => {
    if (!formData.mediaUrl) return false;
    const url = formData.mediaUrl.toLowerCase();
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov') || url.endsWith('.ogg');
});

const searchQuery = ref('');
const searchResults = ref<any[]>([]);
const selectedUsers = ref<any[]>([]);
let searchTimeout: any = null;

const handleGroupChange = (val: string) => {
    formData.targetGroup = val;
    // Reset selections when group changes
    selectedUsers.value = [];
    searchQuery.value = '';
    searchResults.value = [];
};

const handleUserSearch = () => {
    if (searchTimeout) clearTimeout(searchTimeout);
    
    if (!searchQuery.value || searchQuery.value.length < 2) {
        searchResults.value = [];
        return;
    }

    searchTimeout = setTimeout(async () => {
        try {
            // Use server-side search which supports Name, Email, and UID
            const results = await searchUsers({ query: searchQuery.value });
            // Filter out already selected users
            searchResults.value = results.filter((user: any) => 
                !selectedUsers.value.some(u => u.id === user.id)
            ).slice(0, 5);
        } catch (e) {
            console.error('Search failed', e);
        }
    }, 300); // 300ms debounce
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
            link: formData.link,
            mediaUrl: formData.mediaUrl
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
        formData.mediaUrl = '';
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
    display: flex; /* Changed for flex actions */
    justify-content: space-between;
    align-items: center;
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

.form-actions {
    display: flex;
    gap: 12px;
}

.send-btn {
    flex: 2;
    height: 48px;
    font-size: 1rem;
}

.draft-btn {
    flex: 1;
    height: 48px;
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

.notif-media-preview {
    margin-top: 8px;
    margin-bottom: 8px;
    border-radius: 8px;
    overflow: hidden;
    background: #000;
}

.media-content {
    width: 100%;
    height: auto;
    max-height: 200px;
    object-fit: cover;
    display: block;
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


.mt-sm { margin-top: 8px; }
.mb-sm { margin-bottom: 8px; }

/* Upload Box */

/* Upload Box */
.hidden-input { display: none; }

.upload-box {
    border: 2px dashed var(--md-sys-color-outline-variant);
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    transition: border-color 0.2s;
}

.upload-box:hover {
    border-color: var(--md-sys-color-primary);
}

.upload-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: var(--md-sys-color-on-surface-variant);
}

.upload-status, .upload-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: var(--md-sys-color-on-surface);
}

.success-icon { color: #10b981; }
.remove-media-btn { --md-text-button-label-text-color: var(--md-sys-color-error); }

/* History Log (Original) */
.full-width {
    grid-column: 1 / -1;
}

.history-section {
    margin-top: 2rem;
}

.log-card {
    padding: 0 !important; /* Reset padding for flush table */
    overflow: hidden;
}

.log-table {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.log-header {
    display: grid;
    grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr;
    padding: 16px 24px;
    background: rgba(255,255,255,0.05);
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--md-sys-color-on-surface-variant);
}

.log-row {
    display: grid;
    grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr;
    padding: 16px 24px;
    align-items: center;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    transition: background 0.2s;
    font-size: 0.875rem;
    color: var(--md-sys-color-on-surface);
}

.log-row:last-child {
    border-bottom: none;
}

.log-row:hover {
    background: rgba(255,255,255,0.02);
}

.col-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 500;
}

.log-icon {
    font-size: 20px;
    opacity: 0.8;
}
.log-icon.info { color: var(--md-sys-color-secondary); }
.log-icon.success { color: green; }
.log-icon.warning { color: orange; }
.log-icon.error { color: var(--md-sys-color-error); }

.col-audience { color: var(--md-sys-color-on-surface-variant); }
.col-sender { font-family: monospace; font-size: 0.8rem; opacity: 0.7; }

.status-badge {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    background: rgba(255,255,255,0.1);
}
.status-badge.success { background: rgba(16, 185, 129, 0.2); color: #10b981; }

.empty-state {
    padding: 48px;
    text-align: center;
    color: var(--md-sys-color-on-surface-variant);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

</style>
