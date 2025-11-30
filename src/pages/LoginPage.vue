<template>
  <div class="login-page">
    <div class="glass-container">
      <div class="auth-header">
        <h1 class="auth-title">{{ isLogin ? 'Welcome Back' : 'Create Account' }}</h1>
        <p class="auth-subtitle">{{ isLogin ? 'Sign in to continue' : 'Sign up to get started' }}</p>
      </div>

      <div class="auth-toggle">
        <button 
          class="toggle-btn" 
          :class="{ active: isLogin }" 
          @click="toggleMode(true)"
        >
          Sign In
        </button>
        <button 
          class="toggle-btn" 
          :class="{ active: !isLogin }" 
          @click="toggleMode(false)"
        >
          Sign Up
        </button>
      </div>

      <!-- Phone Auth Form -->
      <div v-if="authMethod === 'phone'" class="auth-form">
        <div class="form-group phone-input-group">
          <vue-tel-input 
            v-model="phoneNumber" 
            mode="international"
            :autoDefaultCountry="false"
            defaultCountry="US"
            :inputOptions="{ placeholder: 'Phone Number' }"
            @validate="onPhoneValidate"
            class="liquid-phone-input"
          ></vue-tel-input>
        </div>
        <div v-if="confirmationResult" class="form-group">
          <LiquidInput 
            v-model="otp"
            placeholder="Enter OTP"
            icon="lock"
            icon-position="left"
            type="text"
          />
        </div>
        <div id="recaptcha-container"></div>
        <LiquidButton 
          :text="confirmationResult ? 'Verify OTP' : 'Send OTP'" 
          type="primary" 
          size="lg" 
          class="submit-btn"
          icon="arrow_forward"
          icon-position="right"
          @click="handlePhoneAuth"
          :disabled="!isValidPhone && !confirmationResult"
        />
        <button class="text-btn" @click="authMethod = 'email'">Use Email instead</button>
      </div>
      <!-- Email Auth Form -->
      <form v-else @submit.prevent="handleSubmit" class="auth-form">
        <div v-if="!isLogin" class="form-group">
          <LiquidInput 
            v-model="name"
            placeholder="Full Name"
            icon="person"
            icon-position="left"
            type="text"
          />
        </div>
        
        <div class="form-group">
          <LiquidInput 
            v-model="email"
            placeholder="Email Address"
            icon="email"
            icon-position="left"
            type="email"
          />
        </div>

        <div class="form-group">
          <LiquidInput 
            v-model="password"
            placeholder="Password"
            icon="lock"
            icon-position="left"
            type="password"
          />
        </div>
        <LiquidButton 
          :text="isLogin ? 'Sign In' : 'Sign Up'" 
          type="primary" 
          size="lg" 
          class="submit-btn"
          icon="arrow_forward"
          icon-position="right"
          :loading="loading"
        />
        <button class="text-btn" @click="authMethod = 'phone'">Use Phone instead</button>
      </form>

      <div class="divider">
        <span>Or continue with</span>
      </div>

      <div class="social-login">
        <button class="social-btn google" @click="handleGoogleLogin">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
        </button>
        <button class="social-btn anonymous" @click="handleAnonymousLogin" title="Guest Login">
           <span class="material-icons">person_outline</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import LiquidInput from '../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import { useAuth } from '../composables/useAuth';
import { useUser } from '../composables/useUser';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast.js';

const router = useRouter();
const route = useRoute();
const { loginWithGoogle, loginAnonymously, loginWithPhone, loginWithEmail, registerWithEmail, setupRecaptcha } = useAuth();
const { addRole } = useUser();
const { showToast } = useToast();

const isLogin = ref(true);
const authMethod = ref('email'); // 'email' or 'phone'
const name = ref('');
const email = ref('');
const password = ref('');
const phoneNumber = ref('');
const otp = ref('');
const confirmationResult = ref(null);
const isValidPhone = ref(false);
const formattedPhone = ref('');

const toggleMode = (login) => {
  isLogin.value = login;
  confirmationResult.value = null;
  otp.value = '';
};

const onPhoneValidate = (phoneObject) => {
  isValidPhone.value = phoneObject.valid;
  if (phoneObject.valid) {
    formattedPhone.value = phoneObject.number;
  }
};

const loading = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  try {
    if (isLogin.value) {
      await loginWithEmail(email.value, password.value);
      showToast('Logged in successfully!', 'success');
    } else {
      await registerWithEmail(email.value, password.value);
      showToast('Account created successfully!', 'success');
    }
    const redirectPath = route.query.redirect || '/';
    router.push(redirectPath);
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    loading.value = false;
  }
};

const handleGoogleLogin = async () => {
  try {
    await loginWithGoogle();
    showToast('Logged in with Google!', 'success');
    const redirectPath = route.query.redirect || '/';
    router.push(redirectPath);
  } catch (error) {
    showToast(error.message, 'error');
  }
};

const handleAnonymousLogin = async () => {
  try {
    await loginAnonymously();
    showToast('Ghost mode activated! 👻 Sign in to come back to life.', 'info');
    router.push('/');
  } catch (error) {
    showToast(error.message, 'error');
  }
};

const handlePhoneAuth = async () => {
  try {
    if (!confirmationResult.value) {
      if (!isValidPhone.value) {
        showToast("Please enter a valid phone number", 'warning');
        return;
      }
      const appVerifier = setupRecaptcha('recaptcha-container');
      // Use the formatted number (E.164)
      confirmationResult.value = await loginWithPhone(formattedPhone.value, appVerifier);
      showToast('OTP sent!', 'success');
    } else {
      await confirmationResult.value.confirm(otp.value);
      showToast('Phone verified successfully!', 'success');
      const redirectPath = route.query.redirect || '/';
      router.push(redirectPath);
    }
  } catch (error) {
    console.error(error);
    showToast(error.message, 'error');
    if (!confirmationResult.value) {
        window.recaptchaVerifier?.clear();
    }
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); */
  padding: var(--spacing-lg);
  position: relative;
  overflow: hidden;
}

/* Background decoration */
.login-page::before,
.login-page::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
}

.login-page::before {
  top: -100px;
  left: -100px;
  width: 400px;
  height: 400px;
  background: rgba(139, 69, 19, 0.2); /* Brownish tint */
}

.login-page::after {
  bottom: -100px;
  right: -100px;
  width: 300px;
  height: 300px;
  background: rgba(230, 213, 208, 0.4); /* Dusty rose tint */
}

.glass-container {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: var(--radius-xl);
  padding: 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  z-index: 1;
  position: relative;
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-color);
  margin-bottom: 8px;
}

.auth-subtitle {
  color: var(--text-secondary);
  font-size: 16px;
}

.auth-toggle {
  display: flex;
  background: rgba(0, 0, 0, 0.05);
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.toggle-btn {
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn.active {
  background: white;
  color: var(--brand-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.forgot-password {
  text-align: right;
}

.forgot-password a {
  color: var(--brand-primary);
  font-size: 14px;
  text-decoration: none;
  font-weight: 500;
}

.submit-btn {
  width: 100%;
  margin-top: 10px;
}

.text-btn {
    background: none;
    border: none;
    color: var(--brand-primary);
    cursor: pointer;
    font-size: 14px;
    margin-top: 10px;
    text-decoration: underline;
}

.divider {
  margin: 30px 0;
  text-align: center;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
}

.divider span {
  background: rgba(255, 255, 255, 0.7); /* Match glass container bg somewhat */
  padding: 0 10px;
  color: var(--text-secondary);
  font-size: 14px;
  position: relative;
  z-index: 1;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.social-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.social-btn img {
  width: 24px;
  height: 24px;
}

.social-btn.anonymous {
    color: var(--text-secondary);
}

/* Vue Tel Input Overrides for Liquid Style */
.liquid-phone-input {
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.1);
  background: rgba(255,255,255,0.8);
  padding: 4px;
}
.liquid-phone-input:focus-within {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 2px rgba(var(--brand-primary-rgb), 0.2);
}
</style>
