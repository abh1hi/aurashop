<template>
  <AdminLayout>
    <div class="messages-page">
      <header class="page-header">
        <div class="header-text">
          <h1 class="headline-large">Messages</h1>
          <p class="body-large subtext">User inquiries and support tickets.</p>
        </div>
        <div class="header-actions">
           <md-filled-button>
             <md-icon slot="icon">edit</md-icon>
             Compose
           </md-filled-button>
        </div>
      </header>

      <section class="messages-list-section">
          <!-- Mock Filter Tabs -->
          <div class="filter-tabs">
              <md-filter-chip label="Inbox" selected></md-filter-chip>
              <md-filter-chip label="Unread"></md-filter-chip>
              <md-filter-chip label="Sent"></md-filter-chip>
              <md-filter-chip label="Archived"></md-filter-chip>
          </div>

          <!-- Empty State for Demo -->
          <div class="m3-card empty-state">
              <md-icon class="empty-icon">chat_bubble_outline</md-icon>
              <h2 class="title-medium">No new messages</h2>
              <p class="body-medium">You're all caught up! New inquiries will appear here.</p>
          </div>
      </section>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '../components/AdminLayout.vue';
</script>

<style scoped>
.messages-page {
  /* Padding handled by AdminLayout */
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.subtext {
  margin-top: 0.25rem;
}

.headline-large {
  font-family: var(--md-sys-typescale-headline-large-font);
  font-size: var(--md-sys-typescale-headline-large-size);
  font-weight: 400;
  color: var(--md-sys-color-on-background);
  margin: 0;
}

.body-large {
  color: var(--md-sys-color-on-surface-variant);
}

.filter-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 1.5rem;
}

.m3-card {
  background: var(--md-sys-color-surface);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
    gap: 1rem;
    color: var(--md-sys-color-on-surface-variant);
}

.empty-icon {
    font-size: 48px;
    opacity: 0.5;
}
</style>
