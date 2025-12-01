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
            <div class="form-row">
                <div class="form-group flex-1">
                    <label>House No / Flat</label>
                    <input v-model="addressForm.houseNumber" class="glass-input" placeholder="A-101" />
                </div>
                <div class="form-group flex-1">
                    <label>Pincode</label>
                    <input v-model="addressForm.pincode" class="glass-input" placeholder="100001" />
                </div>
            </div>

            <div class="form-group">
                <label>Street / Area</label>
                <input v-model="addressForm.street" class="glass-input" placeholder="Main Street" />
            </div>

            <div class="form-row">
                <div class="form-group flex-1">
                    <label>City</label>
                    <input v-model="addressForm.city" class="glass-input" />
                </div>
                <div class="form-group flex-1">
                    <label>Country</label>
                    <input v-model="addressForm.country" class="glass-input" />
                </div>
            </div>

            <div class="form-group">
                <label>Full Address Preview</label>
                <textarea 
                    v-model="addressForm.address" 
                    class="glass-input" 
                    rows="2"
                    readonly
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
                <label>Label</label>
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
                <input 
                    v-if="addressForm.label === 'Other'"
                    v-model="addressForm.customLabel"
                    class="glass-input mt-2"
                    placeholder="Custom Label (e.g. Gym)"
                />
            </div>

            <div class="action-buttons-row">
                <LiquidButton 
                    v-if="mode !== 'save' && mode !== 'edit'"
                    text="Set as Current Location" 
                    type="primary" 
                    class="flex-1" 
                    @click="setAsCurrent" 
                    :loading="isSettingCurrent"
                />
                <LiquidButton 
                    v-if="mode === 'save' || mode === 'edit'"
                    :text="mode === 'edit' ? 'Update Address' : 'Save New Address'" 
                    type="secondary" 
                    class="flex-1" 
                    @click="saveAddress" 
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
import { useMapPage } from './MapPage.js';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidAutocomplete from '../components/liquid-ui-kit/LiquidAutocomplete/LiquidAutocomplete.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidActionSheet from '../components/liquid-ui-kit/LiquidActionSheet/LiquidActionSheet.vue';

const {
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
} = useMapPage();
</script>

<style scoped>
@import './MapPage.css';
</style>
