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
                <LiquidButton text="Confirm Address" icon="check" type="primary" size="sm" @click="openAddressSheet" />
            </div>
        </div>
      </div>

      <!-- Locate Me Button -->
      <button class="locate-btn" @click="locateUser" title="Locate Me">
        <span class="material-icons-round">my_location</span>
      </button>

      <!-- Address Action Sheet -->
      <LiquidActionSheet 
        v-model="showAddressSheet" 
        title="Confirm Address" 
        subtitle="Add details to save this location"
      >
        <div class="address-form">
            <div class="form-group">
                <label>Address</label>
                <textarea 
                    v-model="addressForm.address" 
                    class="glass-input" 
                    rows="3"
                ></textarea>
            </div>

            <div class="form-group">
                <label>Phone Number</label>
                <input 
                    type="tel" 
                    v-model="addressForm.phone" 
                    class="glass-input" 
                    placeholder="+1 234 567 8900"
                />
            </div>

            <div class="form-group">
                <label>Label (Optional)</label>
                <div class="label-pills">
                    <button 
                        v-for="label in ['Home', 'Work', 'Other']" 
                        :key="label"
                        class="label-pill"
                        :class="{ active: addressForm.label === label }"
                        @click="addressForm.label = label"
                    >
                        {{ label }}
                    </button>
                </div>
            </div>

            <div class="action-buttons-row">
                <LiquidButton 
                    text="Set as Current Location" 
                    type="primary" 
                    class="flex-1" 
                    @click="setAsCurrent" 
                    :loading="isSettingCurrent"
                />
                <LiquidButton 
                    text="Save New Address" 
                    type="secondary" 
                    class="flex-1" 
                    @click="saveNewAddress" 
                    :loading="isSavingNew"
                />
            </div>
        </div>
      </LiquidActionSheet>

    </div>
    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidAutocomplete from '../components/liquid-ui-kit/LiquidAutocomplete/LiquidAutocomplete.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidActionSheet from '../components/liquid-ui-kit/LiquidActionSheet/LiquidActionSheet.vue';
import { useLocation } from '../composables/useLocation.js';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast.js';
import { useRouter } from 'vue-router';

const map = ref(null);
const marker = ref(null);
const selectedLocation = ref(null);
const showAddressSheet = ref(false);
const isSettingCurrent = ref(false);
const isSavingNew = ref(false);
const router = useRouter();

const addressForm = reactive({
    address: '',
    phone: '',
    label: 'Home'
});

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
        const response = await fetch(`https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
            const props = data.features[0].properties;
            const addressParts = [
                props.name,
                props.street,
                props.housenumber,
                props.city,
                props.state,
                props.country
            ].filter(Boolean);
            
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
        selectedLocation.value = {
            lat,
            lng,
            address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
        };
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

const openAddressSheet = () => {
    if (selectedLocation.value) {
        addressForm.address = selectedLocation.value.address;
        showAddressSheet.value = true;
    }
};

const validateForm = () => {
    if (!addressForm.phone) {
        showToast('Please enter a phone number', 'warning');
        return false;
    }
    return true;
};

const setAsCurrent = async () => {
    if (!validateForm()) return;

    isSettingCurrent.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Set global location
    setLocation(addressForm.address);
    
    showToast('Location updated successfully!', 'success');
    isSettingCurrent.value = false;
    showAddressSheet.value = false;
};

const saveNewAddress = async () => {
    if (!validateForm()) return;

    isSavingNew.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Here we would typically add to a user's address list in a store/DB
    console.log('Saving new address:', { ...addressForm, ...selectedLocation.value });
    
    showToast('New address saved to your profile!', 'success');
    isSavingNew.value = false;
    showAddressSheet.value = false;
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

.address-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    padding: 0 var(--spacing-md);
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.form-group label {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    font-weight: 500;
}

.glass-input {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    padding: 12px;
    color: var(--text-color);
    font-family: inherit;
    resize: none;
}

.glass-input:focus {
    outline: none;
    border-color: var(--primary-pastel);
    background: rgba(255, 255, 255, 0.2);
}

.label-pills {
    display: flex;
    gap: var(--spacing-sm);
}

.label-pill {
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid var(--glass-border);
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
}

.label-pill.active {
    background: var(--text-color);
    color: var(--bg-color);
    border-color: var(--text-color);
}

.action-buttons-row {
    display: flex;
    gap: var(--spacing-md);
    margin-top: var(--spacing-md);
}

.flex-1 {
    flex: 1;
}
</style>
