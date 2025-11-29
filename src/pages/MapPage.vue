<template>
  <div class="map-page-container">
    <div class="map-wrapper">
      <div id="map"></div>
      
      <div class="command-palette">
        <!-- Search Bar -->
        <LiquidAutocomplete 
            placeholder="Search location..." 
            @select="handleLocationSelect"
        />

        <!-- Location Details Card -->
        <div v-if="selectedLocation" class="location-details-card">
            <div class="location-header">
                <div>
                    <span class="location-title">Selected Location</span>
                    <p class="location-address">{{ selectedLocation.address }}</p>
                </div>
                <LiquidButton icon="close" type="ghost" size="sm" @click="clearSelection" />
            </div>
            
            <div class="coords-row">
                <span>LAT: {{ selectedLocation.lat.toFixed(6) }}</span>
                <span>LNG: {{ selectedLocation.lng.toFixed(6) }}</span>
            </div>

            <div class="action-row">
                <LiquidButton text="Pin Location" icon="push_pin" type="secondary" size="sm" @click="pinLocation" />
                <LiquidButton text="Confirm" icon="check" type="primary" size="sm" @click="confirmLocation" />
            </div>
        </div>
      </div>

      <!-- Locate Me Button -->
      <button class="locate-btn" @click="locateUser" title="Locate Me">
        <span class="material-icons-round">my_location</span>
      </button>

    </div>
    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidAutocomplete from '../components/liquid-ui-kit/LiquidAutocomplete/LiquidAutocomplete.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import { useLocation } from '../composables/useLocation.js';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast.js';

const map = ref(null);
const marker = ref(null);
const selectedLocation = ref(null);
const { location: currentLocation, detectLocation, setLocation } = useLocation();
const { showToast } = useToast();

// Custom Marker Icon using Material Icons
const createCustomIcon = () => {
    return L.divIcon({
        className: 'custom-pin',
        html: '<span class="material-icons-round pin-icon">location_on</span>',
        iconSize: [30, 30],
        iconAnchor: [15, 30] // Center horizontally, bottom vertically
    });
};

const customIcon = createCustomIcon();

onMounted(async () => {
    initMap();
    // Try to get current location on load
    await detectLocation();
    
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;
            updateMapView(latitude, longitude);
            fetchAddress(latitude, longitude);
        },
        () => {
            // Fallback center (London)
            updateMapView(51.505, -0.09);
        }
    );
});

const initMap = () => {
    map.value = L.map('map', {
        zoomControl: false // We'll add it manually or style it
    }).setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map.value);
    
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map.value);

    // Map Click Event
    map.value.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        updateMarker(lat, lng);
        await fetchAddress(lat, lng);
    });
};

const updateMapView = (lat, lng) => {
    if (map.value) {
        map.value.setView([lat, lng], 13);
        updateMarker(lat, lng);
    }
};

const updateMarker = (lat, lng) => {
    if (marker.value) {
        marker.value.setLatLng([lat, lng]);
    } else {
        marker.value = L.marker([lat, lng], { icon: customIcon }).addTo(map.value);
    }
};

const handleLocationSelect = (item) => {
    // Photon API returns coordinates in [lon, lat] order in geometry.coordinates
    // Nominatim returns lat, lon as strings
    // We need to handle both or standardize. 
    // Since we are switching to Photon in Autocomplete, let's assume Photon format or normalize it.
    
    let lat, lng, address;

    if (item.geometry && item.geometry.coordinates) {
        // Photon format
        lng = item.geometry.coordinates[0];
        lat = item.geometry.coordinates[1];
        address = [item.properties.name, item.properties.city, item.properties.country].filter(Boolean).join(', ');
    } else {
        // Fallback / Nominatim format
        lat = parseFloat(item.lat);
        lng = parseFloat(item.lon);
        address = item.display_name;
    }
    
    updateMapView(lat, lng);
    selectedLocation.value = {
        lat,
        lng,
        address
    };
};

const fetchAddress = async (lat, lng) => {
    try {
        // Using Photon API (Komoot) which is free and CORS friendly
        // https://photon.komoot.io/reverse?lon=10&lat=52
        const response = await fetch(`https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
            const props = data.features[0].properties;
            // Construct a readable address
            const addressParts = [
                props.name,
                props.street,
                props.housenumber,
                props.city,
                props.state,
                props.country
            ].filter(Boolean);
            
            // Remove duplicates (sometimes name and city are same)
            const uniqueAddress = [...new Set(addressParts)].join(', ');

            selectedLocation.value = {
                lat,
                lng,
                address: uniqueAddress || "Unknown Location"
            };
        } else {
             selectedLocation.value = {
                lat,
                lng,
                address: "Unknown Location"
            };
        }

    } catch (error) {
        console.error('Reverse geocoding failed', error);
        // Fallback to simple coordinates if API fails
        selectedLocation.value = {
            lat,
            lng,
            address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
        };
        // Don't spam toast on map drag/click, just show coords
    }
};

const clearSelection = () => {
    selectedLocation.value = null;
    if (marker.value) {
        map.value.removeLayer(marker.value);
        marker.value = null;
    }
};

const pinLocation = () => {
    showToast('Location pinned!', 'success');
};

const confirmLocation = () => {
    if (selectedLocation.value) {
        // Extract a shorter address for the header (e.g., City, Country)
        const parts = selectedLocation.value.address.split(',');
        const shortAddress = parts.slice(0, 2).join(',').trim(); // First two parts usually work
        
        setLocation(shortAddress);
        showToast(`Location set to: ${shortAddress}`, 'success');
    }
};

const locateUser = () => {
    if (!navigator.geolocation) {
        showToast("Geolocation is not supported by your browser", "error");
        return;
    }

    showToast("Locating...", "info");
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;
            updateMapView(latitude, longitude);
            fetchAddress(latitude, longitude);
            showToast("Location found", "success");
        },
        (error) => {
            console.error(error);
            showToast("Unable to retrieve your location", "error");
        }
    );
};
</script>

<style scoped>
@import './MapPage.css';
</style>
