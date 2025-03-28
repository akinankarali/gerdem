import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// For development purposes only. Replace with your Firebase project configuration
// In production, use environment variables (.env.local)
const firebaseConfig = {
  apiKey: "AIzaSyAUkg5yu2TlxOH4cD2rCE7MxCt3f9SEWQo",
  authDomain: "gerdem-cef21.firebaseapp.com",
  projectId: "gerdem-cef21",
  storageBucket: "gerdem-cef21.firebasestorage.app",
  messagingSenderId: "276621950305",
  appId: "1:276621950305:web:44bbb910a3e61ff2055920",
  measurementId: "G-P6WTWRWQ0W",

  
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app)

let analytics;
if (typeof window !== "undefined" && firebaseConfig.measurementId) {
  analytics = getAnalytics(app);
}

export { db, storage, analytics, auth, signInWithEmailAndPassword };