import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAgpUnUjW0TW4V5V09_6Wjk_Mw9BtsWMRU", // TODO: Replace with your API Key
    authDomain: "aurashop-one.firebaseapp.com",
    projectId: "aurashop-one",
    storageBucket: "aurashop-one.firebasestorage.app",
    messagingSenderId: "542627715578",
    appId: "1:542627715578:web:d7841db040bdb4e03f6c43",
    measurementId: "G-QJDZT0M3SK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Connect to emulators in development mode
if (import.meta.env.DEV) {
    console.log('Connecting to Firebase Emulators...');
    connectAuthEmulator(auth, 'https://3czzqk3l-9099.use2.devtunnels.ms',);
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
}

export { auth, db, storage };
