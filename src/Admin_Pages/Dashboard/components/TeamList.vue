<template>
  <div class="team-card">
    <div class="team-header">
      <h3>Team Collaboration</h3>
      <button class="add-btn">
        <span class="material-icons-round" style="font-size: 16px;">add</span>
        Add Member
      </button>
    </div>

    <div class="team-list">
      <div class="team-member" v-for="member in members" :key="member.id">
        <img :src="member.avatar" class="member-avatar" />
        <div class="member-info">
          <span class="member-name">{{ member.name }}</span>
          <span class="member-role">{{ member.role }}</span>
        </div>
        <span class="status-badge" :class="member.status">
          {{ member.statusLabel }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const members = [
  {
    id: 1,
    name: 'Alexandra Deff',
    role: 'Working on Github Project Repository',
    avatar: 'https://i.pravatar.cc/150?img=5',
    status: 'completed',
    statusLabel: 'Completed'
  },
  {
    id: 2,
    name: 'Edwin Adenike',
    role: 'Working on Integrate User Authentication',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'progress',
    statusLabel: 'In Progress'
  },
  {
    id: 3,
    name: 'Isaac Oluwatemilorun',
    role: 'Working on Develop Search Functionality',
    avatar: 'https://i.pravatar.cc/150?img=11',
    status: 'pending',
    statusLabel: 'Pending'
  },
  {
    id: 4,
    name: 'David Oshodi',
    role: 'Working on Responsive Layout',
    avatar: 'https://i.pravatar.cc/150?img=8',
    status: 'progress',
    statusLabel: 'In Progress'
  }
];
</script>

<style scoped src="./TeamList.css"></style>
