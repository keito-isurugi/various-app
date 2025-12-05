import { getApps, initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app =
	getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Connect to Firebase Emulator if enabled
if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
	if (typeof window !== "undefined") {
		try {
			connectFirestoreEmulator(db, "localhost", 8080);
			console.log(" Connected to Firestore Emulator");
		} catch (error) {
			console.log("Firestore Emulator already connected");
		}
	}
}

export { app, db };
