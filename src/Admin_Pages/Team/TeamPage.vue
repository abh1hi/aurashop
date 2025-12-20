<template>
  <AdminLayout>
    <div class="team-management-header">
      <div class="header-content">
        <h1 class="page-title">Operational<span>Team</span></h1>
        <p class="page-subtitle">Manage system administrators, developers, and data architects.</p>
      </div>
      <div class="header-actions">
        <LiquidButton text="Role Mapping" icon="security" type="ghost" size="sm" />
      </div>
    </div>

    <div class="team-viewport">
      <div class="team-masonry">
        <div class="member-glass-card" v-for="member in teamMembers" :key="member.id">
          <div class="card-glow"></div>
          <div class="member-identity">
            <div class="avatar-wrap">
              <img :src="member.avatar" class="member-img" />
              <div class="status-dot online"></div>
            </div>
            <div class="member-details">
              <h3 class="member-name">{{ member.name }}</h3>
              <span class="member-handle">@sys_admin_{{ member.id }}</span>
            </div>
          </div>
          
          <div class="member-role-tag">
            <span class="material-icons-round">shield</span>
            {{ member.role }}
          </div>
          
          <div class="member-stats">
            <div class="stat-item">
              <span class="val">142</span>
              <span class="lbl">Commits</span>
            </div>
            <div class="stat-item">
              <span class="val">12</span>
              <span class="lbl">Deploy</span>
            </div>
          </div>

          <div class="member-actions">
            <LiquidButton text="Message" type="ghost" size="sm" style="flex: 1" />
            <LiquidButton text="Profile" type="primary" size="sm" style="flex: 1" />
          </div>
        </div>
        
        <!-- Add New Member Glass Card -->
        <div class="member-glass-card add-new">
          <div class="add-icon-wrap">
              <span class="material-icons-round">person_add_alt</span>
          </div>
          <h3 class="add-title">Invite Protocol</h3>
          <p class="add-desc">Provision new access keys for collaborators.</p>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '../components/AdminLayout.vue';
import LiquidButton from '../../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';

const teamMembers = [
  {
    id: 1,
    name: 'Totok Michael',
    role: 'Administrator',
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: 2,
    name: 'Alexandra Deff',
    role: 'Developer',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 3,
    name: 'Edwin Adenike',
    role: 'Designer',
    avatar: 'https://i.pravatar.cc/150?img=3'
  }
];
</script>

<style scoped src="./TeamPage.css"></style>
