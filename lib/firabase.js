// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBh5CledLjqg0xYHw3R9F9TEmyz4A6LYTo",
  authDomain: "various-app-1420c.firebaseapp.com",
  projectId: "various-app-1420c",
  storageBucket: "various-app-1420c.appspot.com",
  messagingSenderId: "83855653621",
  appId: "1:83855653621:web:dfb564ff5670fdeeade3bc",
  measurementId: "G-HEDMSWTXGM"
};


// Initialize Firebase
let app
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}
// const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db