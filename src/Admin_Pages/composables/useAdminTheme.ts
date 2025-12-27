import { ref } from 'vue';

// Fully independent composable for Admin Theme
// Does NOT rely on shared cacheManager or common utils
const currentAdminTheme = ref('light');

export function useAdminTheme() {

    const setAdminTheme = (theme: string) => {
        currentAdminTheme.value = theme;
        // Apply to body with a specific data-attribute for admin to avoid conflicts
        document.body.setAttribute('data-admin-theme', theme);

        // Use standard LocalStorage, keyed specifically for admin
        localStorage.setItem('admin_pref_theme', theme);
    };

    // Initialize immediately to prevent flash
    const initTheme = () => {
        const cachedTheme = localStorage.getItem('admin_pref_theme');
        if (cachedTheme) {
            currentAdminTheme.value = cachedTheme;
            document.body.setAttribute('data-admin-theme', cachedTheme);
        } else {
            // Default
            document.body.setAttribute('data-admin-theme', 'light');
        }
    };

    initTheme(); // Run synchronously

    // onMounted is not strictly needed for this side-effect if we run it here, 
    // but useful if we need DOM guaranteed (though body usually exists).
    // keeping it simple.

    return {
        currentAdminTheme,
        setAdminTheme
    };
}
