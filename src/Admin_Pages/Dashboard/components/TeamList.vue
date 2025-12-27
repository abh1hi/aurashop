<template>
  <div class="team-card-container">
    <div class="team-list" v-if="members.length > 0">
      <div class="team-member" v-for="member in members" :key="member.id">
        <div class="member-avatar">
            <img :src="member.avatar" />
        </div>
        <div class="member-info">
          <span class="member-name">{{ member.name }}</span>
          <span class="member-role">{{ member.role }}</span>
        </div>
        <span class="status-badge" :class="member.status">
          {{ member.statusLabel }}
        </span>
      </div>
    </div>
    <div v-else class="empty-state">
        <p class="body-medium">No recent registrations found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdmin } from '../../../composables/useAdmin';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/icon/icon.js';

const { fetchRecentActivity } = useAdmin();
const members = ref<any[]>([]);

onMounted(async () => {
    members.value = await fetchRecentActivity();
});
</script>

<style scoped>
.team-card-container {
    display: flex;
    flex-direction: column;
}

.team-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.team-member {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
}

.team-member:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.member-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    background: var(--md-sys-color-surface-variant);
}

.member-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.member-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.member-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--md-sys-color-on-surface);
}

.member-role {
    font-size: 0.75rem;
    color: var(--md-sys-color-on-surface-variant);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
}

.status-badge {
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
}

.status-badge.completed { background: var(--md-sys-color-tertiary-container); color: var(--md-sys-color-on-tertiary-container); }
.status-badge.progress { background: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container); }
.status-badge.pending { background: var(--md-sys-color-error-container); color: var(--md-sys-color-on-error-container); }

.empty-state {
    padding: 24px;
    text-align: center;
    color: var(--md-sys-color-on-surface-variant);
    font-style: italic;
}
</style>
