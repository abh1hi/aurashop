import { ref, onMounted } from 'vue';
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

    onMounted(() => {
        if (userProfile.value) {
            form.value = {
                displayName: userProfile.value.displayName || '',
                username: userProfile.value.username || '',
                email: userProfile.value.email || '',
                phoneNumber: userProfile.value.phoneNumber || ''
            };
        }
    });

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
