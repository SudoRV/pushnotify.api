import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

//fcm config
const firebaseConfig = {
  apiKey: "AIzaSyD9p-7xYM290Nzi--njJd7K5HgkruxMrsE",
  authDomain: "light-status-41588.firebaseapp.com",
  projectId: "light-status-41588",
  storageBucket: "light-status-41588.firebasestorage.app",
  messagingSenderId: "138858114707",
  appId: "1:138858114707:web:c3aeb49f531f4013bda766",
  measurementId: "G-4Y5207N5WC"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };

