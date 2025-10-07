// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATs85gfAgSdYZVpza602P91Bp7xeSvqmk",
  authDomain: "form-handling-9ded8.firebaseapp.com",
  projectId: "form-handling-9ded8",
  storageBucket: "form-handling-9ded8.firebasestorage.app",
  messagingSenderId: "156327790727",
  appId: "1:156327790727:web:c3e35b1add34797ec09022",
  measurementId: "G-FLGVQGQP00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const authh = getAuth();
export default app;
