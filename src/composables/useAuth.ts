import { ref } from 'vue';
import {
    GoogleAuthProvider,
    signInWithPopup,
    signInAnonymously,
    signInWithPhoneNumber,
    linkWithPhoneNumber,
    RecaptchaVerifier,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    type User,

    linkWithPopup,
    EmailAuthProvider,
    linkWithCredential,

} from 'firebase/auth';
import { auth } from '../firebase';

const user = ref<User | null>(null);
const isAuthenticated = ref(false);

export function useAuth() {

    const initAuth = () => {
        onAuthStateChanged(auth, (u) => {
            user.value = u;
            isAuthenticated.value = !!u;
        });
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            return result.user;
        } catch (error) {
            console.error("Google login error:", error);
            throw error;
        }
    };

    const loginAnonymously = async () => {
        try {
            const result = await signInAnonymously(auth);
            return result.user;
        } catch (error) {
            console.error("Anonymous login error:", error);
            throw error;
        }
    };

    const setupRecaptcha = (elementId: string) => {
        return new RecaptchaVerifier(auth, elementId, {
            'size': 'invisible',
        });
    };

    const loginWithPhone = async (phoneNumber: string, appVerifier: RecaptchaVerifier) => {
        try {
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            return confirmationResult;
        } catch (error) {
            console.error("Phone login error:", error);
            throw error;
        }
    };

    const loginWithEmail = async (email: string, password: string) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result.user;
        } catch (error) {
            console.error("Email login error:", error);
            throw error;
        }
    };

    const registerWithEmail = async (email: string, password: string) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            return result.user;
        } catch (error) {
            console.error("Email register error:", error);
            throw error;
        }
    };

    const logout = async () => {
        await firebaseSignOut(auth);
    };

    const linkWithPhone = async (phoneNumber: string, appVerifier: RecaptchaVerifier) => {
        if (!user.value) throw new Error("No user to link");
        try {
            const confirmationResult = await linkWithPhoneNumber(user.value, phoneNumber, appVerifier);
            return confirmationResult;
        } catch (error) {
            console.error("Link phone error:", error);
            throw error;
        }
    };

    const linkWithGoogle = async () => {
        if (!user.value) throw new Error("No user to link");
        const provider = new GoogleAuthProvider();
        try {
            const result = await linkWithPopup(user.value, provider);
            return result.user;
        } catch (error) {
            console.error("Link Google error:", error);
            throw error;
        }
    };

    const linkWithEmail = async (email: string, password: string) => {
        if (!user.value) throw new Error("No user to link");
        const credential = EmailAuthProvider.credential(email, password);
        try {
            const result = await linkWithCredential(user.value, credential);
            return result.user;
        } catch (error) {
            console.error("Link Email error:", error);
            throw error;
        }
    };

    return {
        user,
        isAuthenticated,
        initAuth,
        loginWithGoogle,
        loginAnonymously,
        loginWithPhone,
        loginWithEmail,
        registerWithEmail,
        setupRecaptcha,
        logout,
        linkWithPhone,
        linkWithGoogle,
        linkWithEmail
    };
}
