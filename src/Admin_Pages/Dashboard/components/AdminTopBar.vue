<template>
  <header class="admin-topbar m3-surface-container">
    <div class="topbar-left">
      <md-icon-button class="menu-btn" @click="$emit('toggle-sidebar')">
        <md-icon>menu</md-icon>
      </md-icon-button>
      
      <div class="search-wrap">
         <div class="search-container" ref="searchContainer">
             <md-outlined-text-field 
                 placeholder="Search (Cmd+K)" 
                 :value="searchQuery"
                 @input="handleSearchInput"
                 @focus="showResults = true"
                 density="compact"
                 class="search-input"
                 id="global-search-input"
             >
                <md-icon slot="leading-icon">search</md-icon>
             </md-outlined-text-field>

             <!-- Search Dropdown -->
             <div class="search-results m3-surface m3-elevation-3" v-if="showResults && searchQuery.length >= 2">
                 <!-- Loading State -->
                 <div v-if="loading" class="p-3 text-center">
                     <md-circular-progress indeterminate class="small-loader"></md-circular-progress>
                 </div>
                 
                 <!-- Empty State -->
                 <div v-else-if="!hasResults" class="p-3 text-center text-muted">
                     No results found for "{{ searchQuery }}"
                 </div>

                 <!-- Results List -->
                 <div v-else>
                     <!-- Pages -->
                     <div v-if="results.pages.length" class="result-section">
                         <div class="section-title">Navigation</div>
                         <div v-for="page in results.pages" :key="page.path" class="result-item" @click="goToPage(page.path)">
                             <md-icon>{{ page.icon }}</md-icon>
                             <span>{{ page.title }}</span>
                             <md-icon class="arrow-icon">arrow_forward</md-icon>
                         </div>
                     </div>

                     <!-- Users -->
                     <div v-if="results.users.length" class="result-section">
                         <div class="section-title">Users</div>
                         <div v-for="u in results.users" :key="u.id" class="result-item" @click="goToUser(u.id)">
                             <div class="avatar-xs">
                                 <img :src="u.photoURL || `https://ui-avatars.com/api/?name=${u.displayName || 'U'}`" />
                             </div>
                             <div class="item-info">
                                 <span class="main-text">{{ u.displayName || u.email }}</span>
                                 <span class="sub-text" v-if="u.displayName">{{ u.email }}</span>
                             </div>
                         </div>
                     </div>

                     <!-- Stores -->
                     <div v-if="results.stores.length" class="result-section">
                         <div class="section-title">Stores</div>
                         <div v-for="s in results.stores" :key="s.id" class="result-item" @click="goToStore(s.id)">
                             <md-icon>store</md-icon>
                             <div class="item-info">
                                 <span class="main-text">{{ s.name }}</span>
                                 <span class="sub-text">{{ s.status }}</span>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
      </div>
    </div>

    <div class="topbar-right">
      <div class="status-chip">
         <span class="dot"></span>
         <span class="label">System Live</span>
      </div>

      <div class="action-buttons">
         <md-icon-button @click="navigateToMessages">
             <md-icon>chat_bubble_outline</md-icon>
         </md-icon-button>
         <md-icon-button @click="navigateToNotifications">
             <md-icon>notifications</md-icon>
         </md-icon-button>
      </div>
      
      <div class="user-profile">
         <div class="avatar-sm">
             <img :src="photoURL" alt="Admin" />
         </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../../composables/useAuth';
import { useAdmin } from '../../../composables/useAdmin';

const { user } = useAuth();
const { globalSearch } = useAdmin();
const router = useRouter();

const searchQuery = ref('');
const showResults = ref(false);
const loading = ref(false);
const results = ref({ pages: [] as any[], users: [] as any[], stores: [] as any[] });
const searchContainer = ref<HTMLElement | null>(null);

let debounceTimer: any = null;

const photoURL = computed(() => user.value?.photoURL || 'https://i.pravatar.cc/150?img=12');
const hasResults = computed(() => 
    results.value.pages.length > 0 || 
    results.value.users.length > 0 || 
    results.value.stores.length > 0
);

const handleSearchInput = (e: Event) => {
    const val = (e.target as HTMLInputElement).value;
    searchQuery.value = val;
    showResults.value = true;
    
    if (debounceTimer) clearTimeout(debounceTimer);
    
    if (val.length < 2) {
        results.value = { pages: [], users: [], stores: [] };
        return;
    }

    loading.value = true;
    debounceTimer = setTimeout(async () => {
        try {
            results.value = await globalSearch(val);
        } catch (err) {
            console.error(err);
        } finally {
            loading.value = false;
        }
    }, 300);
};

const goToPage = (path: string) => {
    router.push(path);
    closeSearch();
};
const goToUser = (id: string) => {
    router.push(`/admin/users/${id}`);
    closeSearch();
};
const goToStore = (id: string) => {
    router.push(`/admin/stores/${id}`);
    closeSearch();
};

const closeSearch = () => {
    showResults.value = false;
    searchQuery.value = '';
};

// Click Outside
const handleClickOutside = (e: MouseEvent) => {
    if (searchContainer.value && !searchContainer.value.contains(e.target as Node)) {
        showResults.value = false;
    }
};

// Keyboard Shortcut
const handleKeydown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('global-search-input');
        if (input) {
            (input as any).focus();
        }
    }
    if (e.key === 'Escape') {
        showResults.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('keydown', handleKeydown);
});

const navigateToMessages = () => {
  router.push('/admin/messages');
};

const navigateToNotifications = () => {
  router.push('/admin/notifications');
};
</script>

<style scoped>
.admin-topbar {
    height: 64px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--md-sys-color-surface, #ffffff);
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    /* No sticky needed, parent flex col handles it */
}

.topbar-left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
}

.search-wrap {
    max-width: 400px;
    flex: 1;
}

.search-input {
    width: 100%;
}

.topbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.status-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: var(--md-sys-color-surface-container-high);
    border-radius: 16px;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--md-sys-color-primary);
    display: none;
}

@media(min-width: 768px) {
    .status-chip { display: flex; }
}

.dot {
    width: 8px;
    height: 8px;
    background: var(--md-sys-color-primary);
    border-radius: 50%;
    box-shadow: 0 0 8px var(--md-sys-color-primary);
}

.action-buttons {
    display: flex;
    gap: 4px;
}

.user-profile {
    margin-left: 8px;
    cursor: pointer;
}

.avatar-sm {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid var(--md-sys-color-outline-variant);
}

.avatar-sm img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Search Dropdown */
.search-container {
    position: relative;
    width: 100%;
}

.search-results {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: var(--md-sys-color-surface, #fff);
    border-radius: 8px;
    margin-top: 8px;
    max-height: 400px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border: 1px solid var(--md-sys-color-outline-variant);
}

.result-section {
    padding: 8px 0;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
}
.result-section:last-child { border-bottom: none; }

.section-title {
    padding: 4px 16px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--md-sys-color-outline);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.result-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    cursor: pointer;
    transition: background 0.2s;
    color: var(--md-sys-color-on-surface);
}

.result-item:hover {
    background: var(--md-sys-color-surface-variant);
}

.arrow-icon {
    margin-left: auto;
    font-size: 18px;
    color: var(--md-sys-color-outline);
}

.avatar-xs {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    background: #ccc;
}
.avatar-xs img { width: 100%; height: 100%; object-fit: cover; }

.item-info {
    display: flex;
    flex-direction: column;
}

.main-text {
    font-weight: 500;
    font-size: 0.9rem;
}

.sub-text {
    font-size: 0.75rem;
    color: var(--md-sys-color-on-surface-variant);
}

.small-loader {
    --md-circular-progress-size: 24px;
}

.text-muted { color: var(--md-sys-color-outline); }
.p-3 { padding: 12px; }
.text-center { text-align: center; }
</style>
