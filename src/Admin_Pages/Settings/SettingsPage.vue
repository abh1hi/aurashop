<template>
  <AdminLayout>
    <div class="settings-page">
      <header class="page-header">
        <h1 class="headline-large">Platform Configuration</h1>
        <p class="body-large subtext">Manage commercial parameters, visual identity, and system protocols.</p>
      </header>

      <div class="settings-grid">
        <!-- Visual Identity Section -->
        <section class="m3-card theme-card">
          <div class="card-header">
            <h2 class="headline-small">Visual Identity</h2>
            <p class="body-medium text-secondary">Customize the admin interface appearance.</p>
          </div>
          
          <div class="theme-grid">
            <div 
              v-for="theme in themes" 
              :key="theme.id"
              class="theme-option"
              :class="{ active: currentTheme === theme.id }"
              @click="setTheme(theme.id)"
            >
              <div class="color-preview" :style="{ background: theme.preview }">
                <div class="accent-dot" :style="{ background: theme.accent }"></div>
                <md-icon v-if="currentTheme === theme.id" class="check-icon">check_circle</md-icon>
              </div>
              <span class="label-large">{{ theme.name }}</span>
            </div>
          </div>
        </section>

        <!-- detailed-settings-column -->
        <div class="settings-column">
            <!-- Commercial Engine -->
            <section class="m3-card">
                <div class="card-header">
                    <h2 class="headline-small">Commercial Engine</h2>
                </div>
                <div class="fields-row">
                    <md-outlined-text-field 
                        label="Transaction Fee (%)" 
                        type="number" 
                        v-model="platformFee"
                        class="flex-1"
                    >
                        <md-icon slot="leading-icon">percent</md-icon>
                    </md-outlined-text-field>
                    
                    <md-outlined-text-field 
                        label="Tax Rate (%)" 
                        type="number" 
                        v-model="taxRate"
                        class="flex-1"
                    >
                        <md-icon slot="leading-icon">receipt_long</md-icon>
                    </md-outlined-text-field>
                </div>
                <p class="body-small text-tertiary mt-2">Applied to all merchant settlements globally.</p>
            </section>

             <!-- System Protocols -->
            <section class="m3-card">
                <div class="card-header">
                    <h2 class="headline-small">System Protocols</h2>
                </div>
                
                <div class="toggle-row">
                    <div class="toggle-text">
                        <span class="body-large fw-500">Freeze Mode</span>
                        <p class="body-small text-secondary">Suspend all new client connections.</p>
                    </div>
                    <md-switch :selected="maintenanceMode" @change="maintenanceMode = !maintenanceMode"></md-switch>
                </div>
                
                <div class="divider"></div>

                <div class="toggle-row">
                    <div class="toggle-text">
                        <span class="body-large fw-500">Auto-Provisioning</span>
                        <p class="body-small text-secondary">Authorize vendors without manual review.</p>
                    </div>
                    <md-switch :selected="autoApproveVendors" @change="autoApproveVendors = !autoApproveVendors"></md-switch>
                </div>
            </section>
        </div>
      </div>

      <footer class="action-footer">
          <md-text-button>Discard</md-text-button>
          <md-filled-button>
              <md-icon slot="icon">save</md-icon>
              Save Changes
          </md-filled-button>
      </footer>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AdminLayout from '../components/AdminLayout.vue';
import { useTheme } from '../../composables/useTheme';
// Icons and components are now imported globally


const { currentTheme, setTheme } = useTheme();

const platformFee = ref('10');
const taxRate = ref('18');
const maintenanceMode = ref(false);
const autoApproveVendors = ref(false);

const themes = [
  { id: 'light', name: 'Default', preview: '#fbfbfd', accent: '#6750A4' },
  { id: 'dark', name: 'Midnight', preview: '#1C1B1F', accent: '#D0BCFF' },
  { id: 'lavender', name: 'Lavender', preview: '#E6E6FA', accent: '#7B68EE' },
  { id: 'mint', name: 'Mint', preview: '#F0FFF0', accent: '#00FA9A' },
  { id: 'oceanic', name: 'Oceanic', preview: '#E0F7FA', accent: '#006064' },
  { id: 'sunset', name: 'Sunset', preview: '#FFF3E0', accent: '#E65100' },
  { id: 'obsidian', name: 'Obsidian', preview: '#000000', accent: '#6200EA' },
];
</script>

<style scoped>
/* Typography Utils matching M3 tokens */
.headline-large { font-family: var(--md-sys-typescale-headline-large-font); font-size: var(--md-sys-typescale-headline-large-size); font-weight: var(--md-sys-typescale-headline-large-weight); color: var(--md-sys-color-on-background); margin: 0; }
.headline-small { font-family: var(--md-sys-typescale-headline-small-font); font-size: var(--md-sys-typescale-headline-small-size); font-weight: var(--md-sys-typescale-headline-small-weight); color: var(--md-sys-color-on-surface); margin: 0; }
.body-large { font-family: var(--md-sys-typescale-body-large-font); font-size: var(--md-sys-typescale-body-large-size); color: var(--md-sys-color-on-surface); }
.body-medium { font-family: var(--md-sys-typescale-body-medium-font); font-size: var(--md-sys-typescale-body-medium-size); color: var(--md-sys-color-on-surface-variant); }
.body-small { font-family: var(--md-sys-typescale-body-small-font); font-size: var(--md-sys-typescale-body-small-size); }
.label-large { font-family: var(--md-sys-typescale-label-large-font); font-size: var(--md-sys-typescale-label-large-size); font-weight: var(--md-sys-typescale-label-large-weight); color: var(--md-sys-color-on-surface); }

.fw-500 { font-weight: 500; }
.text-secondary { color: var(--md-sys-color-on-surface-variant); }
.text-tertiary { color: var(--md-sys-color-outline); }
.mt-2 { margin-top: 0.5rem; }
.flex-1 { flex: 1; }

/* Page Layout */
.settings-page {
    max-width: 1200px;
    margin: 0 auto;
    padding-bottom: 80px;
}

.page-header {
    margin-bottom: 2.5rem;
}

.subtext {
    margin-top: 0.5rem;
    color: var(--md-sys-color-on-surface-variant);
    max-width: 600px;
}

.settings-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
}

@media (min-width: 1024px) {
    .settings-grid {
        grid-template-columns: 1fr 1fr; /* Two columns on large screens */
        align-items: start;
    }
    
    /* Make theme card span full width if desired, or fit in column */
    .theme-card {
        grid-column: span 1;
    }
}

/* M3 Card */
.m3-card {
    background: var(--md-sys-color-surface);
    border-radius: 20px;
    padding: 1.5rem;
    border: 1px solid var(--md-sys-color-outline-variant);
    /* Elevation 1 */
    box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3); 
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.card-header h2 {
    margin-bottom: 0.25rem;
}

.fields-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.settings-column {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

/* Toggle Rows */
.toggle-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
}

.divider {
    height: 1px;
    background: var(--md-sys-color-outline-variant);
    margin: 0.5rem 0;
}

/* Theme Grid */
.theme-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 1rem;
}

.theme-option {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 12px;
    transition: background-color 0.2s;
}

.theme-option:hover {
    background-color: var(--md-sys-color-surface-variant);
}

.color-preview {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    border: 1px solid var(--md-sys-color-outline-variant);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.accent-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    position: absolute;
    bottom: 6px;
    right: 6px;
    border: 1px solid white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.theme-option.active .color-preview {
    border: 2px solid var(--md-sys-color-primary);
}

.check-icon {
    color: var(--md-sys-color-primary);
    background: var(--md-sys-color-surface);
    border-radius: 50%;
    font-size: 20px;
}

/* Footer */
.action-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid var(--md-sys-color-outline-variant);
}
</style>
