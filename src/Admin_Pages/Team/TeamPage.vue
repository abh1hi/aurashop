<template>
  <AdminLayout>
    <div class="team-page-header">
      <h1>Team Members</h1>
      <p>Manage your admin team and collaborators.</p>
    </div>

    <div class="team-grid">
      <div class="member-card" v-for="member in teamMembers" :key="member.id">
        <img :src="member.avatar" class="member-avatar-large" />
        <h3 class="member-name-large">{{ member.name }}</h3>
        <span class="member-role-large">{{ member.role }}</span>
        
        <div class="member-actions">
          <LiquidButton text="Edit" type="secondary" style="flex: 1" />
          <LiquidButton text="Message" type="primary" style="flex: 1" />
        </div>
      </div>
      
      <!-- Add New Member Card -->
      <div class="member-card" style="justify-content: center; border: 2px dashed #e5e7eb; box-shadow: none;">
        <div style="width: 64px; height: 64px; background: #f3f4f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <span class="material-icons-round" style="font-size: 32px; color: #9ca3af;">add</span>
        </div>
        <h3 class="member-name-large" style="color: #9ca3af;">Add Member</h3>
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
