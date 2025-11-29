import { ref } from 'vue';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast.js';

const location = ref('Locating...');
const { showToast } = useToast();

export function useLocation() {
    const detectLocation = async () => {
        if (!navigator.geolocation) {
            await fetchIpLocation();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Success - GPS available
                // In a real app, reverse geocode here. 
                // For now, we simulate a city name or just use "Current Location"
                location.value = "New York, USA"; // Mocked for now as we don't have a reverse geocoding API key
                showToast("Location updated via GPS", "success");
            },
            async (error) => {
                // Error or Denied - Fallback to IP
                console.warn("GPS Access denied or failed:", error.message);
                await fetchIpLocation();
            },
            { timeout: 5000 }
        );
    };

    const fetchIpLocation = async () => {
        try {
            // Using ipapi.co for free IP geolocation (rate limited but works for demos)
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            if (data.city) {
                location.value = `${data.city}, ${data.country_code}`;
                showToast("Using Network Location. Turn on GPS for better accuracy.", "info");
            } else {
                location.value = "Unknown Location";
                showToast("Could not determine location.", "error");
            }
        } catch (e) {
            console.error("IP Location failed", e);
            location.value = "Unknown Location";
            // Fallback to a default if everything fails
            location.value = "Select Location";
        }
    };

    const setLocation = (newLocation) => {
        location.value = newLocation;
    };

    return { location, detectLocation, setLocation };
}
