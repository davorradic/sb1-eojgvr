import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export const firebaseConfig = {
  apiKey: "AIzaSyAy8zWqnyDYwc6j90b2-h2E0Aq2YM2uKwY",
  authDomain: "roc-projects.firebaseapp.com",
  projectId: "roc-projects",
  storageBucket: "roc-projects.appspot.com",
  messagingSenderId: "299507270577",
  appId: "1:299507270577:web:a046d0847486484810f390"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { app, auth, db, storage }