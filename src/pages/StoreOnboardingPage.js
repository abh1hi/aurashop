import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useVendor } from '../composables/useVendor';
import { useAuth } from '../composables/useAuth';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast.js';
import vendorCats from '../../vendorcat.json';

export function useStoreOnboardingLogic() {
    const router = useRouter();
    const route = useRoute();
    const { createStore, updateStore, uploadKYC, submitForReview, loading, fetchUserKYC } = useVendor();
    const { user, setupRecaptcha, linkWithPhone } = useAuth();
    const { showToast } = useToast();

    const currentStep = ref(1);
    const totalSteps = 8;
    const storeId = ref(route.params.id); // Get from route
    const videoFile = ref(null);
    const docFile = ref(null);
    const videoInput = ref(null);
    const docInput = ref(null);
    const videoError = ref('');
    const docError = ref('');

    // Phone Verification State
    const verificationSent = ref(false);
    const otpCode = ref('');
    const verifying = ref(false);
    const confirmationResult = ref(null);
    const rawPhone = ref('');
    const isValidPhone = ref(false);

    const formData = reactive({
        name: '',
        phone: '',
        category: '',
        address: '',
        city: '',
        hours: '',
        bankName: '',
        accountNumber: '',
        ifsc: '',
        description: '',
        logoUrl: '',
        bannerUrl: ''
    });

    const isPhoneVerified = computed(() => !!user.value?.phoneNumber);

    const existingKYC = ref(null);
    const useExistingKYC = ref(false);

    const isNextDisabled = computed(() => {
        if (currentStep.value === 2 && !isPhoneVerified.value) return true;
        if (currentStep.value === 3) {
            if (useExistingKYC.value) return !existingKYC.value;
            return (!videoFile.value || !docFile.value);
        }
        if (currentStep.value === 4 && !formData.category) return true;
        return false;
    });

    onMounted(async () => {
        if (user.value?.phoneNumber) {
            formData.phone = user.value.phoneNumber;
        }
        const kyc = await fetchUserKYC();
        if (kyc) {
            existingKYC.value = kyc;
            useExistingKYC.value = true; // Default to using existing if available
        }
    });

    const toggleExistingKYC = () => {
        useExistingKYC.value = !useExistingKYC.value;
    };

    const onPhoneValidate = (phoneObject) => {
        isValidPhone.value = phoneObject.valid;
        if (phoneObject.valid) {
            formData.phone = phoneObject.number; // Store formatted number (E.164)
        }
    };

    const triggerVideoUpload = () => videoInput.value.click();
    const triggerDocUpload = () => docInput.value.click();

    const handleVideoChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        videoError.value = '';
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = function () {
            window.URL.revokeObjectURL(video.src);
            if (video.duration > 11) { // Allow 1s buffer
                videoError.value = "Video must be 10 seconds or less.";
                videoFile.value = null;
            } else {
                videoFile.value = file;
            }
        };
        video.src = URL.createObjectURL(file);
    };

    const handleDocChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        docError.value = '';
        if (file.type !== 'application/pdf') {
            docError.value = "Only PDF files are allowed.";
            return;
        }

        const maxSize = 550 * 1024; // 550KB (500KB + 50KB buffer)
        if (file.size > maxSize) {
            docError.value = "File size must be less than 550KB.";
            return;
        }
        docFile.value = file;
    };

    const categories = vendorCats.categories;

    const categoryOptions = computed(() => {
        const options = [];
        for (const group in categories) {
            categories[group].forEach(cat => {
                options.push({
                    label: cat.name,
                    value: cat.id,
                    icon: 'category'
                });
            });
        }
        return options;
    });

    const sendVerificationCode = async () => {
        if (!formData.phone) return;
        verifying.value = true;
        try {
            const appVerifier = setupRecaptcha('recaptcha-container');
            const result = await linkWithPhone(formData.phone, appVerifier);
            confirmationResult.value = result;
            verificationSent.value = true;
            showToast('OTP sent successfully', 'success');
        } catch (error) {
            console.error(error);
            showToast('Failed to send OTP. Try again.', 'error');
        } finally {
            verifying.value = false;
        }
    };

    const verifyOTP = async () => {
        if (!otpCode.value || !confirmationResult.value) return;
        verifying.value = true;
        try {
            await confirmationResult.value.confirm(otpCode.value);
            showToast('Phone verified successfully!', 'success');
            verificationSent.value = false;
        } catch (error) {
            console.error(error);
            showToast('Invalid OTP', 'error');
            otpCode.value = '';
        } finally {
            verifying.value = false;
        }
    };

    const steps = [
        { label: "Welcome", description: "Get started" },
        { label: "Store Basics", description: "Name & Phone" },
        { label: "Identity", description: "KYC Verification" },
        { label: "Category", description: "What you sell" },
        { label: "Details", description: "Location & Hours" },
        { label: "Bank Info", description: "For Payouts" },
        { label: "Branding", description: "Logo & Banner" },
        { label: "Review", description: "Submit" }
    ];

    const getStepTitle = (step) => {
        return steps[step - 1]?.label || "";
    };

    const getStepDescription = (step) => {
        const descs = [
            "Get started with your store setup.",
            "Tell us the basics about your business.",
            "We need to verify your identity.",
            "What kind of products do you sell?",
            "Where is your store located.",
            "Where should we send your payouts?",
            "Make your store look professional.",
            "Double check everything looks good."
        ];
        return descs[step - 1];
    };

    const nextStep = () => {
        if (currentStep.value < totalSteps) currentStep.value++;
    };

    const prevStep = () => {
        if (currentStep.value > 1) currentStep.value--;
    };

    const handleNext = async () => {
        try {
            switch (currentStep.value) {
                case 2: // Basics
                    if (!storeId.value) {
                        storeId.value = await createStore({ name: formData.name, phone: formData.phone });
                    } else {
                        await updateStore(storeId.value, { name: formData.name, phone: formData.phone });
                    }
                    break;
                case 3: // KYC
                    if (useExistingKYC.value && existingKYC.value) {
                        await updateStore(storeId.value, {
                            kycVideoUrl: existingKYC.value.videoUrl,
                            kycDocUrl: existingKYC.value.docUrl,
                            kycStatus: 'submitted'
                        });
                    } else if (videoFile.value && docFile.value) {
                        try {
                            const { videoUrl, docUrl } = await uploadKYC(videoFile.value, docFile.value);
                            await updateStore(storeId.value, {
                                kycVideoUrl: videoUrl,
                                kycDocUrl: docUrl,
                                kycStatus: 'submitted'
                            });
                        } catch (e) {
                            showToast('Failed to upload KYC documents', 'error');
                            return;
                        }
                    }
                    break;
                case 4: // Category
                    await updateStore(storeId.value, { category: formData.category });
                    break;
                case 5: // Details
                    await updateStore(storeId.value, { address: formData.address, city: formData.city, hours: formData.hours });
                    break;
                case 6: // Bank
                    await updateStore(storeId.value, { bankDetails: { name: formData.bankName, account: formData.accountNumber, ifsc: formData.ifsc } });
                    break;
                case 7: // Branding
                    await updateStore(storeId.value, { description: formData.description, logoUrl: formData.logoUrl, bannerUrl: formData.bannerUrl });
                    break;
                case 8: // Submit
                    await submitForReview(storeId.value);
                    showToast('Store submitted successfully! 🎉', 'success');
                    router.push('/profile');
                    return;
            }
            nextStep();
        } catch (e) {
            showToast('Error saving progress', 'error');
            console.error(e);
        }
    };

    const getCategoryName = (id) => {
        for (const group in categories) {
            const found = categories[group].find(c => c.id === id);
            if (found) return found.name;
        }
        return id;
    };

    return {
        currentStep,
        totalSteps,
        storeId,
        videoFile,
        docFile,
        videoInput,
        docInput,
        videoError,
        docError,
        verificationSent,
        otpCode,
        verifying,
        confirmationResult,
        rawPhone,
        isValidPhone,
        formData,
        isPhoneVerified,
        isNextDisabled,
        loading,
        categoryOptions,
        onPhoneValidate,
        triggerVideoUpload,
        triggerDocUpload,
        handleVideoChange,
        handleDocChange,
        sendVerificationCode,
        verifyOTP,
        getStepTitle,
        getStepDescription,
        nextStep,
        prevStep,
        handleNext,
        getCategoryName,
        existingKYC,
        useExistingKYC,
        toggleExistingKYC,
        steps
    };
}
