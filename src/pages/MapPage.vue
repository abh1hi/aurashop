<template>
  <div class="map-page-container">
    <div class="map-wrapper">
      <div id="map"></div>
      
      <!-- Premium Overlay: Command Palette -->
      <div class="map-overlay-container">
        <LiquidCard class="command-palette-card fade-in">
          <div class="search-section-map">
            <LiquidAutocomplete 
                placeholder="Find a place or address..." 
                @select="handleLocationSelect"
                class="map-search-input"
            />
          </div>

          <!-- Active Selection Details -->
          <transition name="slide-up">
            <div v-if="selectedLocation" class="location-details-expanded">
                <div class="detail-header">
                    <div class="title-group">
                        <span class="detail-label">Selected Destination</span>
                        <h2 class="detail-address">{{ selectedLocation.address }}</h2>
                    </div>
                    <LiquidButton icon="close" type="ghost" size="sm" @click="clearSelection" class="close-detail-btn" />
                </div>
                
                <div class="detail-meta">
                    <div class="meta-item">
                        <span class="material-icons-round">explore</span>
                        <span>{{ selectedLocation.lat.toFixed(4) }}, {{ selectedLocation.lng.toFixed(4) }}</span>
                    </div>
                </div>

                <div class="detail-actions">
                    <LiquidButton 
                        text="Confirm & Save" 
                        icon="edit_location_alt" 
                        type="primary" 
                        size="md" 
                        class="w-100" 
                        @click="openAddressSheet" 
                    />
                    <LiquidButton 
                        text="Pin Location" 
                        icon="push_pin" 
                        type="secondary" 
                        size="md" 
                        class="w-100 mt-2" 
                        @click="pinLocation" 
                    />
                </div>
            </div>
          </transition>
        </LiquidCard>
      </div>

      <!-- Float Actions -->
      <div class="map-float-actions">
        <button class="glass-float-btn" @click="locateUser" title="Locate Me">
          <span class="material-icons-round">my_location</span>
        </button>
      </div>

      <!-- Address Confirmation Sheet -->
      <LiquidActionSheet 
        v-model="showAddressSheet" 
        title="Address Verification" 
        subtitle="Please confirm the exact delivery details"
      >
        <div class="verification-form">
            <div class="glass-form-grid">
                <div class="field-item">
                    <label>House / Flat No.</label>
                    <LiquidInput v-model="addressForm.houseNumber" placeholder="e.g. 402, Building A" />
                </div>
                <div class="field-item">
                    <label>Pincode</label>
                    <LiquidInput v-model="addressForm.pincode" placeholder="123456" />
                </div>
                <div class="field-item full-width">
                    <label>Street / Area Info</label>
                    <LiquidInput v-model="addressForm.street" placeholder="Main Street, Landmarks" icon="add_location" />
                </div>
                <div class="field-item">
                    <label>City</label>
                    <LiquidInput v-model="addressForm.city" />
                </div>
                <div class="field-item">
                    <label>Country</label>
                    <LiquidInput v-model="addressForm.country" />
                </div>
            </div>

            <div class="label-selection-area">
                <label class="section-label">Save Address As</label>
                <div class="premium-pills">
                    <button 
                        v-for="label in ['Home', 'Work', 'Other']" 
                        :key="label"
                        class="pill-btn"
                        :class="{ active: addressForm.label === label }"
                        @click="addressForm.label = label"
                    >
                        {{ label }}
                    </button>
                </div>
            </div>

            <div class="form-final-actions mt-xl">
                <LiquidButton 
                    v-if="mode !== 'save' && mode !== 'edit'"
                    text="Set as Current Location" 
                    type="primary" 
                    size="lg"
                    class="w-100" 
                    @click="setAsCurrent" 
                    :loading="isSettingCurrent"
                />
                <LiquidButton 
                    v-else
                    :text="mode === 'edit' ? 'Update Address' : 'Save Address'" 
                    type="primary" 
                    size="lg"
                    class="w-100" 
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

<script setup lang="ts">
import { useMapPage } from './MapPage';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidAutocomplete from '../components/liquid-ui-kit/LiquidAutocomplete/LiquidAutocomplete.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidActionSheet from '../components/liquid-ui-kit/LiquidActionSheet/LiquidActionSheet.vue';
import LiquidCard from '../components/liquid-ui-kit/LiquidCard/LiquidCard.vue';
import LiquidInput from '../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';

const {
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

.w-100 { width: 100%; }
.mt-2 { margin-top: 8px; }
.mt-xl { margin-top: 32px; }
.fade-in { animation: fadeIn 0.4s ease-out; }

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.slide-up-enter-active, .slide-up-leave-active {
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.slide-up-enter-from { opacity: 0; transform: translateY(20px); }
.slide-up-leave-to { opacity: 0; transform: translateY(20px); }
</style>
