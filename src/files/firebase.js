let messaging, getToken, onMessage;

async function initializeFirebase() {
    try {
        if (typeof window !== "undefined" && "Notification" in window) {
            // Use dynamic import to load Firebase modules only when needed
            const { initializeApp } = await import("firebase/app");
            const { getMessaging, getToken: getFCMToken, onMessage: onFCMMessage } = await import("firebase/messaging");

            // Firebase config
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
            messaging = getMessaging(app);
            getToken = getFCMToken;
            onMessage = onFCMMessage;
        } else {
            console.warn("Firebase messaging is not supported in this environment.");
        }
    } catch (err) {
        console.error("Error initializing Firebase:", err);
    }
}

// Call the function to initialize Firebase dynamically
initializeFirebase();

export { messaging, getToken, onMessage };