import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { useUser } from '../composables/useUser';
import { useAuth } from '../composables/useAuth';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast.js';
import { useTheme } from '../composables/useTheme';

export function useProfilePage() {
    const router = useRouter();
    const { userProfile, addAddress, removeAddress, updateAddress } = useUser();
    const { logout, user } = useAuth();
    const { showToast } = useToast();
    const { liquidAnimationsEnabled, currentTheme, toggleLiquidAnimations, setTheme } = useTheme();

    const isAnonymous = ref(false); // This should be computed from user but ref for now to match usage
    const showAddressBookSheet = ref(false);
    const themeCategory = ref('standard');
    const activeTab = ref('overview');

    const standardThemes = [
        { label: 'Chic (Default)', value: 'chic', icon: 'palette' },
        { label: 'Oceanic', value: 'oceanic', icon: 'water_drop' },
        { label: 'Sunset', value: 'sunset', icon: 'wb_sunny' },
        { label: 'Forest', value: 'forest', icon: 'forest' },
        { label: 'Lavender', value: 'lavender', icon: 'local_florist' },
        { label: 'Mint', value: 'mint', icon: 'eco' },
        { label: 'Peach', value: 'peach', icon: 'emoji_food_beverage' },
        { label: 'Slate', value: 'slate', icon: 'dark_mode' },
    ];

    const glassThemes = [
        { label: 'Crystal', value: 'crystal', icon: 'diamond' },
        { label: 'Frost', value: 'frost', icon: 'ac_unit' },
        { label: 'Aurora', value: 'aurora', icon: 'auto_awesome' },
        { label: 'Obsidian', value: 'obsidian', icon: 'volcano' },
        { label: 'Prism', value: 'prism', icon: 'looks' },
        { label: 'Midnight', value: 'midnight', icon: 'nights_stay' },
        { label: 'Deep Space', value: 'deep-space', icon: 'rocket_launch' },
        { label: 'Cyberpunk', value: 'cyberpunk', icon: 'bolt' },
    ];

    const filteredThemeOptions = computed(() => {
        return themeCategory.value === 'standard' ? standardThemes : glassThemes;
    });

    const openAddressBook = () => {
        showAddressBookSheet.value = true;
    };

    const addNewAddress = () => {
        showAddressBookSheet.value = false;
        router.push({ path: '/map', query: { mode: 'save' } });
    };

    const editAddress = (id) => {
        showAddressBookSheet.value = false;
        router.push({ path: '/map', query: { mode: 'edit', id } });
    };

    const confirmDeleteAddress = async (id) => {
        if (confirm('Are you sure you want to delete this address?')) {
            await handleDeleteAddress(id);
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

    const getTabIcon = (tab) => {
        const icons = {
            overview: 'dashboard',
            orders: 'shopping_bag',
            settings: 'settings'
        };
        return icons[tab] || 'circle';
    };

    const getTabLabel = (tab) => {
        const labels = {
            overview: 'Overview',
            orders: 'Order History',
            settings: 'Settings'
        };
        return labels[tab] || 'Tab';
    };

    return {
        router,
        userProfile,
        user,
        isAnonymous: computed(() => user.value?.isAnonymous),
        handleDeleteAddress,
        formatRole,
        handleCreateStore,
        handleLogout,
        showAddressBookSheet,
        openAddressBook,
        addNewAddress,
        editAddress,
        confirmDeleteAddress,
        liquidAnimationsEnabled,
        currentTheme,
        toggleLiquidAnimations,
        setTheme,
        themeCategory,
        filteredThemeOptions,
        activeTab,
        getTabIcon,
        getTabLabel
    };
}
