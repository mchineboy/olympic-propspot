import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBqG7CWbHWQCI4RObhqimebhhSPOmoFzIE",
    authDomain: "ota-propspot.firebaseapp.com",
    projectId: "ota-propspot",
    storageBucket: "ota-propspot.appspot.com",
    messagingSenderId: "679905341367",
    appId: "1:679905341367:web:f305b21e6463da00f8c232",
    measurementId: "G-VBX5DKXD72"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);