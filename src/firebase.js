import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDcANm55E4Z97-vKCeUKTwxVtQuhGZYTZI",
    authDomain: "asean-scoring.firebaseapp.com",
    databaseURL: "https://asean-scoring-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "asean-scoring",
    storageBucket: "asean-scoring.appspot.com",
    messagingSenderId: "880072281043",
    appId: "1:880072281043:web:72241ca9bceb7dc49cfd26"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed
export const db = getFirestore(app);