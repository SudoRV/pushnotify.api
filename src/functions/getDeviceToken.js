import { 
  messaging, 
  getToken,  
} from "../files/firebase";

// 🔹 Register Service Worker
async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service Workers Not Supported.");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    console.log("Service Worker Registered.");
    return registration;
  } catch (error) {
    console.error("Service Worker Registration Failed: ", error.message);
    return null;
  }
}

async function requestNotificationPermission(){
    // Request Notification Permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied.");
      return false;
    }else{
        return true;
    }
}

async function getDeviceToken(){
    await registerServiceWorker();
    
    try{
        const token = await getToken(messaging, {
          vapidKey: "BEYLH-zHd4f9kw2lZMTI5cilEv21mfNJbIZS1hlnYLcCJUI7x1RlN6cqatwX2MCx_NJF4NzC7lHPFKAT2EQHnRE"
        });

        if (!token) {
          console.log("No registration token available.");
          return null;
        }

        return token;
    }catch(error){
        if(error.toString().includes("permission-blocked")){
            return "Notification Permission Blocked! Enable Through Site Setting"
        }
    }
}


export { registerServiceWorker, requestNotificationPermission, getDeviceToken };