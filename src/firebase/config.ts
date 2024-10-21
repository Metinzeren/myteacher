import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as firebaseAuth from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

const firebaseConfig = {
  apiKey: 'AIzaSyBOqyURyaTZySJrn64Solnh01ZBjUdLDkI',
  authDomain: 'my-teacher-553bb.firebaseapp.com',
  projectId: 'my-teacher-553bb',
  storageBucket: 'my-teacher-553bb.appspot.com',
  messagingSenderId: '53633082621',
  appId: '1:53633082621:web:e878efe13877d5da858a94',
  measurementId: 'G-RML9LCRBGJ',
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Firestore
const db = getFirestore(app);
const database = getDatabase(app);
// Initialize Auth
const auth = initializeAuth(app, {
  persistence: reactNativePersistence(AsyncStorage),
});
const initStorage = getStorage(app);


export { db, auth, app, initStorage, database };
