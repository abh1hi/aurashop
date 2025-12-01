import { ref, reactive, onMounted, watch, computed } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from '../composables/useLocation.js';
import { useUser } from '../composables/useUser.js';
import { useAuth } from '../composables/useAuth.js';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast.js';
import { useRouter, useRoute } from 'vue-router';

export function useMapPage() {
    const map = ref(null);
    const marker = ref(null);
    const circle = ref(null);
    const selectedLocation = ref(null);
    const showAddressSheet = ref(false);
    const isSettingCurrent = ref(false);
    const isSavingNew = ref(false);
    const router = useRouter();
    const route = useRoute();

    const mode = computed(() => route.query.mode);

    const addressForm = reactive({
        houseNumber: '',
        street: '',
        city: '',
        pincode: '',
        country: '',
        address: '',
        phone: '',
        label: 'Home',
        customLabel: ''
    });

    const { location: currentLocation, detectLocation, setLocation } = useLocation();
    const { userProfile, addAddress, updateAddress } = useUser();
    const { user } = useAuth();
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
        if (!map.value) return;
        if (marker.value) {
            marker.value.setLatLng([lat, lng]);
        } else {
            marker.value = L.marker([lat, lng], { icon: customIcon }).addTo(map.value);
        }
    };

    const drawAccuracyCircle = (lat, lng, radius) => {
        if (!map.value) return;
        if (circle.value) {
            circle.value.setLatLng([lat, lng]);
            circle.value.setRadius(radius);
        } else {
            circle.value = L.circle([lat, lng], {
                color: 'var(--primary-color)',
                fillColor: 'var(--primary-color)',
                fillOpacity: 0.1,
                radius: radius
            }).addTo(map.value);
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

                // Auto-fill form components
                addressForm.city = props.city || props.state || '';
                addressForm.country = props.country || '';
                addressForm.pincode = props.postcode || '';
                addressForm.street = props.street || props.name || '';
                addressForm.houseNumber = props.housenumber || '';

                // Construct full address string
                const uniqueAddress = [...new Set(addressParts)].join(', ');
                addressForm.address = uniqueAddress;

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

            // Autofill phone number if available
            if (userProfile.value?.phoneNumber) {
                addressForm.phone = userProfile.value.phoneNumber;
            } else if (user.value?.phoneNumber) {
                addressForm.phone = user.value.phoneNumber;
            }

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

    const saveAddress = async () => {
        if (!validateForm()) return;

        isSavingNew.value = true;

        try {
            const finalLabel = addressForm.label === 'Other' ? addressForm.customLabel : addressForm.label;

            const addressData = {
                label: finalLabel || 'Home',
                addressLine: addressForm.address,
                houseNumber: addressForm.houseNumber,
                street: addressForm.street,
                city: addressForm.city,
                pincode: addressForm.pincode,
                country: addressForm.country,
                phoneNumber: addressForm.phone,
                lat: selectedLocation.value.lat,
                lng: selectedLocation.value.lng
            };

            if (mode.value === 'edit' && route.query.id) {
                await updateAddress({ ...addressData, id: route.query.id });
                showToast('Address updated successfully!', 'success');
            } else {
                await addAddress(addressData);
                showToast('New address saved to your profile!', 'success');
            }

            router.push('/profile'); // Redirect back to profile
        } catch (error) {
            console.error("Save address failed:", error);
            showToast('Failed to save address', 'error');
        } finally {
            isSavingNew.value = false;
            showAddressSheet.value = false;
        }
    };

    const locateUser = async () => {
        showToast("Locating...", "info");
        await detectLocation(); // This now handles everything including IP fallback
    };

    onMounted(async () => {
        initMap();

        // Check for Edit Mode
        if (route.query.mode === 'edit' && route.query.id) {
            const addrId = route.query.id;
            const addr = userProfile.value?.addresses?.find(a => a.id === addrId);

            if (addr) {
                // Pre-fill form
                addressForm.houseNumber = addr.houseNumber || '';
                addressForm.street = addr.street || '';
                addressForm.city = addr.city || '';
                addressForm.pincode = addr.pincode || '';
                addressForm.country = addr.country || '';
                addressForm.address = addr.addressLine;
                addressForm.phone = addr.phoneNumber;
                addressForm.label = ['Home', 'Work'].includes(addr.label) ? addr.label : 'Other';
                if (addressForm.label === 'Other') addressForm.customLabel = addr.label;

                // Set map location
                updateMapView(addr.lat, addr.lng);
                selectedLocation.value = {
                    lat: addr.lat,
                    lng: addr.lng,
                    address: addr.addressLine
                };
                showAddressSheet.value = true;
            }
        } else {
            // Try to get current location on load
            await detectLocation();
        }
    });

    watch(currentLocation, (newLoc) => {
        if (newLoc && newLoc.lat && newLoc.lng) {
            updateMapView(newLoc.lat, newLoc.lng);

            // If source is IP, show toast and draw circle
            if (newLoc.source === 'ip') {
                showToast("GPS not available, using approximate location", "info");
                drawAccuracyCircle(newLoc.lat, newLoc.lng, 5000); // 5km radius
            } else {
                // Remove circle if GPS is back
                if (circle.value) {
                    map.value.removeLayer(circle.value);
                    circle.value = null;
                }
            }

            // Auto-select if not already selected
            if (!selectedLocation.value) {
                fetchAddress(newLoc.lat, newLoc.lng);
            }
        }
    }, { deep: true, immediate: true });

    return {
        map,
        marker,
        circle,
        selectedLocation,
        showAddressSheet,
        isSettingCurrent,
        isSavingNew,
        mode,
        addressForm,
        handleLocationSelect,
        clearSelection,
        pinLocation,
        openAddressSheet,
        setAsCurrent,
        saveAddress,
        locateUser
    };
}
