// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import authentication
import { getFirestore, collection, addDoc } from "firebase/firestore"; // Import Firestore functions

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLBr-dLd1AvvZ7DftiN0lAY_IVWB1PPbM",
  authDomain: "alumni-interaction-449e5.firebaseapp.com",
  projectId: "alumni-interaction-449e5",
  storageBucket: "alumni-interaction-449e5.firebasestorage.app",
  messagingSenderId: "226623415270",
  appId: "1:226623415270:web:e0af79143fcd8670486c27",
  measurementId: "G-KJMVJKL0FM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize authentication
const db = getFirestore(app); // Initialize Firestore

// Export auth and db so they can be used in other files
export { auth,app, db };
