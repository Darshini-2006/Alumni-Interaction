// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);