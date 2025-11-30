import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useUser } from '../composables/useUser';
import { useAuth } from '../composables/useAuth';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast.js';

export function useProfilePage() {
    const router = useRouter();
    const { userProfile, addAddress, removeAddress } = useUser();
    const { logout, user } = useAuth();
    const { showToast } = useToast();

    const showAddAddress = ref(false);
    const newAddress = ref({
        label: '',
        addressLine: '',
        phoneNumber: ''
    });

    const handleSaveAddress = async () => {
        if (!newAddress.value.label || !newAddress.value.addressLine || !newAddress.value.phoneNumber) {
            showToast('Please fill all fields', 'warning');
            return;
        }
        try {
            await addAddress(newAddress.value);
            showToast('Address added', 'success');
            showAddAddress.value = false;
            newAddress.value = { label: '', addressLine: '', phoneNumber: '' };
        } catch (error) {
            showToast('Failed to add address', 'error');
        }
    };

    const handleDeleteAddress = async (id) => {
        try {
            await removeAddress(id);
            showToast('Address removed', 'info');
        } catch (error) {
            showToast('Failed to remove address', 'error');
        }
    };

    const formatRole = (role) => {
        return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const handleCreateStore = () => {
        if (user.value?.isAnonymous) {
            showToast('Please sign in to create a store.', 'info');
            router.push({ path: '/login', query: { redirect: '/profile' } });
        } else {
            router.push('/onboarding');
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return {
        router,
        userProfile,
        user,
        showAddAddress,
        newAddress,
        handleSaveAddress,
        handleDeleteAddress,
        formatRole,
        handleCreateStore,
        handleLogout
    };
}
