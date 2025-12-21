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
          {{ isAnonymous ? 'Link Account' : 'Sign In' }}
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
          :text="isLogin ? (isAnonymous ? 'Link Account' : 'Sign In') : 'Sign Up'" 
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
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import LiquidInput from '../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import { useAuth } from '../composables/useAuth';
import { useUser } from '../composables/useUser';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast';
import { useWishlist } from '../composables/useWishlist';

const router = useRouter();
const route = useRoute();
const { loginWithGoogle, loginAnonymously, loginWithPhone, loginWithEmail, registerWithEmail, setupRecaptcha, linkWithGoogle, linkWithEmail, user } = useAuth();
const { addRole, mergeUserData } = useUser();
const { fetchWishlist } = useWishlist();
const { showToast } = useToast();

const isAnonymous = computed(() => user.value?.isAnonymous);

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

const performRedirect = () => {
    const redirectPath = route.query.redirect || '/';
    if (redirectPath.toString().startsWith('/vendor') || redirectPath.toString().startsWith('/admin')) {
        window.location.href = redirectPath.toString();
    } else {
        router.push(redirectPath);
    }
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    if (isLogin.value) {
      if (isAnonymous.value) {
        // Link Account Flow
        await linkWithEmail(email.value, password.value);
        showToast('Account linked successfully!', 'success');
      } else {
        // Normal Sign In
        const currentUid = user.value?.uid;
        const wasAnonymous = isAnonymous.value;

        await loginWithEmail(email.value, password.value);
        
        if (wasAnonymous && currentUid && user.value.uid !== currentUid) {
             if (confirm("Merge your guest data with this account?")) {
                 await mergeUserData(currentUid, user.value.uid);
                 await fetchWishlist();
                 showToast('Data merged!', 'success');
             }
        }

        showToast('Logged in successfully!', 'success');
      }
    } else {
      // Sign Up Flow
      const currentUid = user.value?.uid;
      const wasAnonymous = isAnonymous.value;

      await registerWithEmail(email.value, password.value);
      
      // Auto-merge for new account creation from anonymous
      if (wasAnonymous && currentUid && user.value.uid !== currentUid) {
          await mergeUserData(currentUid, user.value.uid);
          await fetchWishlist();
      }

      showToast('Account created successfully!', 'success');
    }
    performRedirect();
  } catch (error) {
    if (error.code === 'auth/credential-already-in-use') {
        // Handle Merge Flow
        if (confirm("This email is already associated with another account. Do you want to switch to it and merge your current data?")) {
            const currentUid = user.value.uid;
            // Sign in to the existing account (this will sign out the anonymous user)
            const targetUser = await loginWithEmail(email.value, password.value);
            await mergeUserData(currentUid, targetUser.uid);
            await fetchWishlist();
            showToast('Logged in and data merged!', 'success');
            performRedirect();
            return;
        }
    }
    showToast(error.message, 'error');
  } finally {
    loading.value = false;
  }
};

const handleGoogleLogin = async () => {
  try {
    if (isAnonymous.value) {
        await linkWithGoogle();
        showToast('Account linked with Google!', 'success');
    } else {
        await loginWithGoogle();
        showToast('Logged in with Google!', 'success');
    }
    performRedirect();
  } catch (error) {
    if (error.code === 'auth/credential-already-in-use') {
         if (confirm("This Google account is already in use. Switch and merge data?")) {
            const currentUid = user.value.uid;
            const targetUser = await loginWithGoogle(); // This might need re-auth logic depending on provider
            await mergeUserData(currentUid, targetUser.uid);
            await fetchWishlist();
            showToast('Logged in and data merged!', 'success');
            performRedirect();
            return;
         }
    }
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
      performRedirect();
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
@import './LoginPage.css';
</style>
