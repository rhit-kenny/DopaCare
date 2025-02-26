// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHqcWBBw8MDw9ObI5eRNxUvYYg63yokJw",
  authDomain: "csse280-final-project-9aa65.firebaseapp.com",
  projectId: "csse280-final-project-9aa65",
  storageBucket: "csse280-final-project-9aa65.firebasestorage.app",
  messagingSenderId: "126210306161",
  appId: "1:126210306161:web:3a79080f13839b538cebd0",
  measurementId: "G-9ME4PL6ZQ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
