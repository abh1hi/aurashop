import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUser } from '../composables/useUser';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast';

export function useEditProfilePage() {
    const router = useRouter();
    const { userProfile, updateProfile } = useUser();
    const { showToast } = useToast();

    const loading = ref(false);
    const form = ref({
        displayName: '',
        username: '',
        email: '',
        phoneNumber: ''
    });



    // Sync form with user profile whenever it changes
    watch(userProfile, (newProfile) => {
        if (newProfile) {
            form.value = {
                displayName: newProfile.displayName || '',
                username: newProfile.username || '',
                email: newProfile.email || '',
                phoneNumber: newProfile.phoneNumber || ''
            };
        }
    }, { immediate: true });

    const handleSave = async () => {
        loading.value = true;
        try {
            await updateProfile({
                displayName: form.value.displayName,
                username: form.value.username,
                phoneNumber: form.value.phoneNumber
            });
            showToast('Profile updated successfully!', 'success');
            router.push('/profile');
        } catch (error) {
            showToast('Failed to update profile.', 'error');
            console.error(error);
        } finally {
            loading.value = false;
        }
    };

    return {
        router,
        loading,
        form,
        handleSave
    };
}
