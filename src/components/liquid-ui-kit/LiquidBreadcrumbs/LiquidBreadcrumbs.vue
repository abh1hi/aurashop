<template>
  <nav class="breadcrumbs breadcrumbs-glass" v-if="breadcrumbs.length > 0">
    <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
      <router-link 
        v-if="index < breadcrumbs.length - 1" 
        :to="crumb.path" 
        class="breadcrumb-item"
      >
        <span v-if="crumb.icon" class="material-icons-round breadcrumb-icon">{{ crumb.icon }}</span>
        <span v-else>{{ crumb.label }}</span>
      </router-link>
      
      <span v-else class="breadcrumb-item active">
        <span v-if="crumb.icon" class="material-icons-round breadcrumb-icon">{{ crumb.icon }}</span>
        <span v-else>{{ crumb.label }}</span>
      </span>

      <span v-if="index < breadcrumbs.length - 1" class="material-icons-round breadcrumb-separator">navigate_next</span>
    </template>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const breadcrumbs = computed(() => {
  const pathArray = route.path.split('/').filter(p => p);
  const crumbs = [];

  // Always add Home
  crumbs.push({
    path: '/',
    label: 'Home',
    icon: 'home'
  });

  let currentPath = '';
  
  pathArray.forEach((segment) => {
    currentPath += `/${segment}`;
    
    // Format label: capitalize and replace hyphens
    let label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    
    // Handle dynamic params (basic heuristic)
    // In a real app, you might look up the route name or meta title
    const matchedRoute = router.getRoutes().find(r => r.path === currentPath);
    if (matchedRoute && matchedRoute.meta && matchedRoute.meta.title) {
        label = matchedRoute.meta.title;
    }

    crumbs.push({
      path: currentPath,
      label: label
    });
  });

  // Don't show breadcrumbs on home page only
  if (crumbs.length === 1) return [];

  return crumbs;
});
</script>

<style scoped>
.breadcrumbs {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
    font-size: var(--text-sm);
    color: var(--text-secondary);
}

.breadcrumb-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    text-decoration: none;
    color: var(--text-secondary);
    transition: color 0.2s;
    cursor: pointer;
}

.breadcrumb-item:hover {
    color: var(--brand-primary);
}

.breadcrumb-separator {
    color: var(--text-tertiary);
    font-size: 18px;
    user-select: none;
}

.breadcrumb-item.active {
    color: var(--text-color);
    font-weight: var(--font-weight-medium);
    cursor: default;
    pointer-events: none;
}

/* Glass Breadcrumb Variant */
.breadcrumbs-glass {
    display: inline-flex;
    padding: 6px 12px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-full);
    backdrop-filter: blur(var(--glass-blur));
}

.breadcrumb-icon {
    font-size: 16px;
}
</style>
