import { ref } from 'vue';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast.js';

const location = ref({
    address: 'Locating...',
    lat: null,
    lng: null,
    source: null // 'gps' | 'ip' | 'manual'
});
const hasInitialLocation = ref(false);
const { showToast } = useToast();
let watchId = null;

export function useLocation() {
    const fetchIpLocation = async (silent = false) => {
        try {
            // Using ipwho.is for better CORS support and accuracy on free tier
            const response = await fetch('https://ipwho.is/');
            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            if (data.success !== false) { // ipwho.is returns success: false on failure
                location.value = {
                    address: `${data.city}, ${data.country_code}`,
                    lat: data.latitude,
                    lng: data.longitude,
                    source: 'ip'
                };
                if (!silent && !hasInitialLocation.value) {
                    showToast("Using Network Location. Turn on GPS for better accuracy.", "info");
                    hasInitialLocation.value = true;
                }
            } else {
                throw new Error(data.message || "IP Location failed");
            }
        } catch (e) {
            console.error("IP Location failed", e);
            location.value = { ...location.value, address: "Unknown Location" };
            if (!silent && !hasInitialLocation.value) {
                showToast("Could not determine location.", "error");
            }
        }
    };

    const detectLocation = async (silent = false) => {
        if (!navigator.geolocation) {
            await fetchIpLocation(silent);
            return;
        }

        // Clear existing watch if any
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
        }

        watchId = navigator.geolocation.watchPosition(
            (position) => {
                // Success - GPS available
                location.value = {
                    address: "New York, USA", // Mocked for now
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    source: 'gps'
                };

                if (!silent && !hasInitialLocation.value) {
                    showToast("Location updated via GPS", "success");
                    hasInitialLocation.value = true;
                } else if (!silent && hasInitialLocation.value === false) {
                    showToast("Location updated via GPS", "success");
                }
            },
            async (error) => {
                console.warn("GPS Watch failed:", error.message);
                // Only fallback to IP if we haven't established location yet
                if (!hasInitialLocation.value) {
                    await fetchIpLocation(silent);
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    };

    const stopLocationWatch = () => {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
        }
    };

    const setLocation = (newLocation) => {
        if (typeof newLocation === 'string') {
            location.value = { ...location.value, address: newLocation, source: 'manual' };
        } else {
            location.value = { ...location.value, ...newLocation, source: 'manual' };
        }
    };

    return { location, detectLocation, setLocation, stopLocationWatch };
}
