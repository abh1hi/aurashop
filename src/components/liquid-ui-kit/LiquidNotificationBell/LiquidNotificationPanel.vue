<template>
  <div class="notification-panel">
    <div class="panel-header">
      <h3>Notifications</h3>
      <button 
        v-if="notifications.length > 0" 
        class="mark-read-btn"
        @click="markAllAsRead"
      >
        Mark all as read
      </button>
    </div>

    <div class="panel-content">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
      </div>

      <div v-else-if="notifications.length > 0" class="notification-list">
        <div 
          v-for="notif in notifications" 
          :key="notif.id"
          class="notification-item"
          :class="{ 'unread': !notif.isRead, 'clickable': true }"
          @click="openDetail(notif)"
        >
          <div class="icon-wrapper" :class="notif.type">
            <span class="material-icons-round">{{ getIcon(notif.type) }}</span>
          </div>
          <div class="content">
            <h4 class="title">{{ notif.title }}</h4>
            <p class="message-preview">{{ notif.message }}</p>
            <span class="time">{{ formatTime(notif.createdAt) }}</span>
          </div>
          <div v-if="!notif.isRead" class="dot"></div>
        </div>
      </div>

      <div v-else class="empty-state">
        <span class="material-icons-round empty-icon">notifications_off</span>
        <p>No new notifications</p>
      </div>
    </div>

    <!-- Notification Detail Sheet -->
    <LiquidActionSheet
        v-model="showDetailSheet"
        :title="selectedNotification?.title || 'Notification'"
    >
        <div v-if="selectedNotification" class="detail-content">
            <div class="detail-header">
                 <div class="icon-wrapper large" :class="selectedNotification.type">
                    <span class="material-icons-round">{{ getIcon(selectedNotification.type) }}</span>
                </div>
                <span class="detail-time">{{ formatTime(selectedNotification.createdAt) }}</span>
            </div>
            
            <div class="detail-body">
                <p class="full-message">{{ selectedNotification.message }}</p>
            </div>

            <div class="detail-actions">
                <LiquidButton
                    v-if="selectedNotification.link"
                    text="View Details"
                    icon="arrow_forward"
                    type="primary"
                    class="w-100 mb-md"
                    @click="handleLinkAction"
                />
                 <LiquidButton
                    v-if="!selectedNotification.isRead"
                    text="Mark as Read"
                    icon="done"
                    type="secondary"
                    class="w-100"
                    @click="handleMarkRead"
                />
                <LiquidButton
                    v-else
                    text="Close"
                    type="ghost"
                    class="w-100"
                    @click="showDetailSheet = false"
                />
            </div>
        </div>
    </LiquidActionSheet>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useNotifications, type Notification } from '../../../composables/useNotifications';
import { useRouter } from 'vue-router';
import LiquidActionSheet from '../LiquidActionSheet/LiquidActionSheet.vue';
import LiquidButton from '../LiquidButton/LiquidButton.vue';

const { notifications, loading, markAllAsRead, markAsRead } = useNotifications();
const router = useRouter();

const emit = defineEmits(['close']);

const showDetailSheet = ref(false);
const selectedNotification = ref<Notification | null>(null);

const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success': return 'check_circle';
    case 'error': return 'error';
    case 'warning': return 'warning';
    case 'order': return 'local_mall';
    case 'system': return 'dns';
    case 'promotion': return 'local_offer';
    default: return 'info';
  }
};

const formatTime = (timestamp: any) => {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
};

const openDetail = (notif: Notification) => {
    selectedNotification.value = notif;
    showDetailSheet.value = true;
    
    // Auto-mark as read on open? Or explicit? 
    // Usually opening details implies reading.
    if (!notif.isRead) {
        markAsRead(notif.id);
    }
};

const handleLinkAction = () => {
    if (selectedNotification.value?.link) {
        router.push(selectedNotification.value.link);
        showDetailSheet.value = false;
        emit('close'); // Close the main panel too
    }
};

const handleMarkRead = () => {
    if (selectedNotification.value) {
        markAsRead(selectedNotification.value.id);
        showDetailSheet.value = false;
    }
};

// Reset selection when sheet closes
watch(showDetailSheet, (val) => {
    if (!val) setTimeout(() => { selectedNotification.value = null }, 300);
});
</script>

<style scoped>
.notification-panel {
  background: var(--liquid-glass-base);
  backdrop-filter: blur(var(--liquid-blur)) saturate(var(--liquid-saturate));
  -webkit-backdrop-filter: blur(var(--liquid-blur)) saturate(var(--liquid-saturate));
  border: 1px solid var(--liquid-glass-border);
  border-radius: 12px;
  box-shadow: var(--liquid-shadow-lg);
  overflow: hidden;
  width: 100%;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--liquid-glass-border);
}

.panel-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.mark-read-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.mark-read-btn:hover {
  background: var(--liquid-glass-shine-1);
}

.panel-content {
  max-height: 400px;
  overflow-y: auto;
}

.notification-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  border-bottom: 1px solid var(--liquid-glass-border);
  cursor: pointer;
  transition: background 0.2s;
}

.notification-item:hover {
  background: var(--liquid-glass-shine-1);
}

.notification-item.unread {
  background: rgba(var(--primary-rgb), 0.1);
}

.icon-wrapper {
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.icon-wrapper .material-icons-round {
  font-size: 18px;
}

/* Icon Colors */
.icon-wrapper.success { color: #2ecc71; background: rgba(46, 204, 113, 0.15); }
.icon-wrapper.error { color: #e74c3c; background: rgba(231, 76, 60, 0.15); }
.icon-wrapper.warning { color: #f1c40f; background: rgba(241, 196, 15, 0.15); }
.icon-wrapper.info { color: #3498db; background: rgba(52, 152, 219, 0.15); }
.icon-wrapper.order { color: #9b59b6; background: rgba(155, 89, 182, 0.15); }

.content {
  flex: 1;
  min-width: 0; /* Text truncation fix */
}

.title {
  margin: 0 0 4px 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.message-preview {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.time {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
}

.dot {
  width: 8px;
  height: 8px;
  background: var(--primary-color);
  border-radius: 50%;
  margin-left: 8px;
  margin-top: 6px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 10px;
  opacity: 0.5;
}

/* Scrollbar */
.panel-content::-webkit-scrollbar {
  width: 4px;
}

.panel-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

/* Detail Sheet Styles */
.detail-content {
    padding: 8px 0;
}

.detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
}

.icon-wrapper.large {
    width: 48px;
    height: 48px;
}

.icon-wrapper.large .material-icons-round {
    font-size: 24px;
}

.detail-time {
    font-size: 12px;
    color: var(--text-secondary);
}

.full-message {
    font-size: 15px;
    line-height: 1.6;
    color: var(--text-primary);
    margin-bottom: 32px;
    white-space: pre-wrap;
}

.detail-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.mb-md { margin-bottom: 12px; }
.w-100 { width: 100%; }

/* Mobile Optimizations */
@media (max-width: 480px) {
  .notification-panel {
    background: var(--bg-color); /* Solid background for readability */
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border: 1px solid var(--liquid-glass-border);
    box-shadow: 0 4px 24px rgba(0,0,0,0.5); /* Stronger shadow */
  }

  .panel-header h3 {
    font-size: 16px; /* Larger title */
    color: var(--text-primary);
  }

  .message-preview {
    color: var(--text-primary); /* Brighter text for preview */
    opacity: 0.8;
  }
  
  .title {
      color: var(--text-primary);
      font-weight: 600;
  }
}
</style>
