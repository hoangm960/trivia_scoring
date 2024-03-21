import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCwt_Gz7B5LA8QmcEIg9K_eFRFpduIfMqA",
    authDomain: "trivia-scoring.firebaseapp.com",
    databaseURL: "https://trivia-scoring-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "trivia-scoring",
    storageBucket: "trivia-scoring.appspot.com",
    messagingSenderId: "526557471327",
    appId: "1:526557471327:web:d15409f218b6fe6b44b1ea",
    measurementId: "G-N32MKHC2YB"
};
// Initialize Firebase

const app = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed
export const db = getFirestore(app);