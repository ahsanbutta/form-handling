import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Configure via Vite env variables (set in .env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k)

if (missingKeys.length) {
  // Surface a clear error early if env is not configured
  // eslint-disable-next-line no-console
  console.error('Missing Firebase env variables:', missingKeys.join(', '))
  throw new Error('Firebase configuration is incomplete. Check your .env values.')
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)


