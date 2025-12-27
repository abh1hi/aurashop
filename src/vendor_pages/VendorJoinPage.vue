<template>
  <div class="join-page">
    <div class="background-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <div class="join-card glass-panel">
      <div v-if="loading" class="loading-state">
        <LiquidSpinner />
        <p>Verifying Invite Token...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <span class="material-icons-round error-icon">broken_image</span>
        <h2>Invalid Link</h2>
        <p>{{ error }}</p>
        <LiquidButton text="Go Home" @click="router.push('/')" type="ghost" class="mt-lg" />
      </div>

      <div v-else class="content-state">
        <div class="store-badge">
          <span class="material-icons-round">store</span>
        </div>
        
        <h1 class="title">Join Team</h1>
        <p class="subtitle">You have been invited to join <strong>{{ invite?.storeId }}</strong> as <strong>{{ invite?.role }}</strong>.</p>
        
        <div class="user-info-card">
          <div class="avatar">
            {{ user?.email?.[0].toUpperCase() }}
          </div>
          <div class="info">
            <span class="label">Applying as</span>
            <span class="value">{{ user?.email }}</span>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="apply-form">
          <LiquidInput 
            v-model="formData.name" 
            label="Full Name" 
            placeholder="Your legal name" 
            required 
            class="mb-md"
          />
          
          <LiquidInput 
            v-model="formData.phone" 
            label="Phone Number" 
            placeholder="+1 234 567 8900" 
            required 
            class="mb-md"
          />

          <div class="input-group mb-lg">
            <label>Why do you want to join?</label>
            <textarea 
              v-model="formData.bio" 
              class="liquid-textarea" 
              placeholder="Briefly describe your experience..."
              rows="3"
            ></textarea>
          </div>

          <LiquidButton 
            text="Submit Application" 
            type="primary" 
            size="lg" 
            :loading="submitting" 
            fullWidth
            icon="send"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useVendor } from '../composables/useVendor';
import { useAuth } from '../composables/useAuth';
import LiquidInput from '../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidSpinner from '../components/liquid-ui-kit/LiquidSpinner/LiquidSpinner.vue';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast';

const route = useRoute();
const router = useRouter();
const { fetchInvite, applyForPosition } = useVendor();
const { user } = useAuth();
const { showToast } = useToast();

const loading = ref(true);
const submitting = ref(false);
const error = ref<string | null>(null);
const invite = ref<any>(null);

const formData = ref({
  name: '',
  phone: '',
  bio: ''
});

onMounted(async () => {
  if (!user.value) {
    // Redirect to login with return url
    // Since we don't have a robust auth redirect store, strictly forcing login view for now
    // Ideally: router.push({ path: '/login', query: { redirect: route.fullPath } });
    showToast('Please login to apply', 'info');
    router.push('/login'); // Assuming login exists
    return;
  }

  const token = route.params.token as string;
  if (!token) {
    error.value = "Missing token";
    loading.value = false;
    return;
  }

  const data = await fetchInvite(token);
  if (!data) {
    error.value = "Invite not found or expired.";
  } else if (data.status !== 'active') {
    error.value = "This invite is no longer valid.";
  } else {
    invite.value = data;
  }
  loading.value = false;
});

const handleSubmit = async () => {
  submitting.value = true;
  try {
    await applyForPosition(route.params.token as string, formData.value);
    showToast('Application Submitted!', 'success');
    router.push('/vendor/dashboard'); // Redirect to a dashboard or success page
  } catch (e) {
    showToast('Failed to submit application', 'error');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.join-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.background-blobs {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  z-index: 0;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
}

.blob-1 { top: -10%; left: -10%; width: 500px; height: 500px; background: var(--primary-color); }
.blob-2 { bottom: -10%; right: -10%; width: 400px; height: 400px; background: var(--secondary-color); }

.join-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 480px;
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.store-badge {
  width: 64px;
  height: 64px;
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
}

.store-badge .material-icons-round { font-size: 32px; }

.title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: var(--spacing-xs);
}

.subtitle {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.user-info-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.info .label { font-size: 0.75rem; color: var(--text-secondary); }
.info .value { font-weight: 500; color: var(--text-primary); }

.apply-form { width: 100%; text-align: left; }

.liquid-textarea {
  width: 100%;
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-md);
  font-family: inherit;
  color: var(--text-primary);
  resize: vertical;
  transition: all 0.3s ease;
}

.liquid-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  background: rgba(255, 255, 255, 0.1);
}

.error-state { color: var(--error-color); }
.error-icon { font-size: 48px; margin-bottom: var(--spacing-md); }
</style>
