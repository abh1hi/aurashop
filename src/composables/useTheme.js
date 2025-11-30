import { ref, onMounted } from 'vue';
import { cacheManager } from '../utils/cacheManager';

const liquidAnimationsEnabled = ref(false);
const currentTheme = ref('chic'); // Default theme

export function useTheme() {
    const toggleLiquidAnimations = () => {
        liquidAnimationsEnabled.value = !liquidAnimationsEnabled.value;
        updateBodyClasses();
        cacheManager.set('user_preferences', {
            theme: currentTheme.value,
            animations: liquidAnimationsEnabled.value
        }, 86400000); // 24 hours TTL
    };

    const setTheme = (theme) => {
        currentTheme.value = theme;
        document.getElementById('app')?.setAttribute('data-theme', theme);
        cacheManager.set('user_preferences', {
            theme: currentTheme.value,
            animations: liquidAnimationsEnabled.value
        }, 86400000); // 24 hours TTL
    };

    const updateBodyClasses = () => {
        if (liquidAnimationsEnabled.value) {
            document.body.classList.remove('disable-liquid-effects');
        } else {
            document.body.classList.add('disable-liquid-effects');
        }
    };

    onMounted(() => {
        // Initialize state based on cache or defaults
        const cachedPrefs = cacheManager.get('user_preferences');

        if (cachedPrefs) {
            currentTheme.value = cachedPrefs.theme;
            liquidAnimationsEnabled.value = cachedPrefs.animations;
            document.getElementById('app')?.setAttribute('data-theme', cachedPrefs.theme);
        } else {
            // Fallback to DOM attribute if no cache
            const app = document.getElementById('app');
            if (app) {
                const theme = app.getAttribute('data-theme');
                if (theme) currentTheme.value = theme;
            }
        }
        updateBodyClasses();
    });

    return {
        liquidAnimationsEnabled,
        currentTheme,
        toggleLiquidAnimations,
        setTheme,
    };
}
