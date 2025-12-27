<template>
  <AdminLayout>
    <div class="team-page">
      <header class="page-header">
         <div class="header-text">
            <h1 class="headline-large">Software Team</h1>
            <p class="body-large subtext">Platform administrators and developers.</p>
         </div>
         <md-filled-button>
            <md-icon slot="icon">person_add</md-icon>
            Invite Member
         </md-filled-button>
      </header>

      <div class="team-grid">
         <div v-for="member in teamMembers" :key="member.id" class="m3-card member-card">
            <div class="card-header">
                <div class="avatar-lg">
                   <img :src="member.avatar" class="avatar-img" />
                </div>
                <div class="member-info">
                   <h3 class="title-medium">{{ member.name }}</h3>
                   <span class="body-small handle">@sys_admin_{{ member.id }}</span>
                   <span class="role-badge">{{ member.role }}</span>
                </div>
            </div>
            
            <div class="card-stats">
               <div class="stat">
                  <span class="label-small">Commits</span>
                  <span class="title-large">142</span>
               </div>
               <div class="divider"></div>
               <div class="stat">
                  <span class="label-small">Deploy</span>
                  <span class="title-large">12</span>
               </div>
            </div>

            <div class="card-actions">
               <md-outlined-button style="flex:1">Profile</md-outlined-button>
               <md-filled-tonal-button style="flex:1">Message</md-filled-tonal-button>
            </div>
         </div>

         <!-- Add Card -->
         <div class="m3-card add-card">
            <div class="add-content">
               <md-icon class="add-icon">group_add</md-icon>
               <h3 class="title-medium">New Access Key</h3>
               <p class="body-small">Provision access for new collaborators</p>
            </div>
         </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '../components/AdminLayout.vue';

const teamMembers = [
  { id: 1, name: 'Totok Michael', role: 'Administrator', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 2, name: 'Alexandra Deff', role: 'Developer', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 3, name: 'Edwin Adenike', role: 'Designer', avatar: 'https://i.pravatar.cc/150?img=3' }
];
</script>

<style scoped>
.headline-large { font-family: var(--md-sys-typescale-headline-large-font); font-size: var(--md-sys-typescale-headline-large-size); font-weight: 400; color: var(--md-sys-color-on-background); margin: 0; }
.body-large { font-size: 1rem; color: var(--md-sys-color-on-surface-variant); }
.team-page { /* Padding handled */ max-width: 1200px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }

.team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }

.m3-card { background: var(--md-sys-color-surface); border-radius: 16px; border: 1px solid var(--md-sys-color-outline-variant); overflow: hidden; padding: 24px; display: flex; flex-direction: column; }

/* Member Card */
.card-header { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 24px; }
.avatar-lg { width: 80px; height: 80px; border-radius: 50%; overflow: hidden; margin-bottom: 12px; border: 2px solid var(--md-sys-color-primary-container); }
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.title-medium { font-size: 1.1rem; font-weight: 500; margin: 0 0 4px 0; }
.handle { display: block; margin-bottom: 8px; }
.role-badge { background: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container); padding: 4px 12px; border-radius: 16px; font-size: 0.75rem; font-weight: 500; }

.card-stats { display: flex; justify-content: center; align-items: center; margin-bottom: 24px; background: var(--md-sys-color-surface-container); padding: 12px; border-radius: 12px; }
.stat { text-align: center; padding: 0 16px; }
.title-large { font-weight: 600; color: var(--md-sys-color-primary); }
.divider { width: 1px; height: 32px; background: var(--md-sys-color-outline-variant); }

.card-actions { display: flex; gap: 12px; margin-top: auto; }

/* Add Card */
.add-card { border-style: dashed; background: transparent; justify-content: center; align-items: center; text-align: center; cursor: pointer; transition: background 0.2s; }
.add-card:hover { background: var(--md-sys-color-surface-container-low); }
.add-icon { font-size: 48px; color: var(--md-sys-color-primary); margin-bottom: 16px; }
</style>
