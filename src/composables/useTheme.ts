import { ref, onMounted } from 'vue';
import { cacheManager } from '../utils/cacheManager';

const liquidAnimationsEnabled = ref(false);
const currentTheme = ref('light'); // Default to light ('Google Material')

export function useTheme() {

    // Toggle animations preference
    const toggleLiquidAnimations = () => {
        liquidAnimationsEnabled.value = !liquidAnimationsEnabled.value;
        updateBodyClasses();
        cacheManager.set('user_preferences', {
            theme: currentTheme.value,
            animations: liquidAnimationsEnabled.value
        }, 86400000); // 24h
    };

    // Set active theme and apply to root element
    const setTheme = (theme: string) => {
        currentTheme.value = theme;
        // Apply to <html> tag for global CSS variable scope
        document.documentElement.setAttribute('data-theme', theme);

        cacheManager.set('user_preferences', {
            theme: currentTheme.value,
            animations: liquidAnimationsEnabled.value
        }, 86400000); // 24h
    };

    // Helper for animations class
    const updateBodyClasses = () => {
        if (liquidAnimationsEnabled.value) {
            document.body.classList.remove('disable-liquid-effects');
        } else {
            document.body.classList.add('disable-liquid-effects');
        }
    };

    onMounted(() => {
        const cachedPrefs = cacheManager.get('user_preferences') as any;

        if (cachedPrefs) {
            currentTheme.value = cachedPrefs.theme;
            liquidAnimationsEnabled.value = cachedPrefs.animations;
            document.documentElement.setAttribute('data-theme', cachedPrefs.theme);
        } else {
            // Default check
            document.documentElement.setAttribute('data-theme', 'light');
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
